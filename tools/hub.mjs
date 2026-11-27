// motionhub.dev from the command line, with no dependencies: search its index, get a motion into the project (its
// package checked against the SHA-256 the index gives, unpacked with no link and no path outside the motion), start a
// new motion, and share one through motionhub.dev (HUB.md, CONTRIBUTING.md). A project keeps its motions in ./motions/
// (SPEC.md §13) and records what it took from the hub in ./motions.lock.json (docs/cli.md).
//
//   motionhub search [words ...]                one line per motion that has every word in its id, names, line, fit or tags
//   motionhub get <id> [--out <dir>]            the newest version of `@iamsuosi/lab-notebook` into ./motions/<id>/,
//                                               recorded in ./motions.lock.json; with --out, into <dir> (which must not
//                                               exist yet) and not recorded
//   motionhub get                               every motion ./motions.lock.json records, at its version: one missing is
//                                               taken, one there is checked to be the copy as published
//   motionhub init <slug> [--handle <handle>]   ./motions/<slug>/ with every required file but the poster, to fill in,
//                                               scoped to the account `motionhub login` signed in (or --handle): its
//                                               id is @<handle>/<slug>
//   motionhub tokens [MOTION.md] [--out <file>] a motion in one file's tokens, as tokens.json; by default the project's
//                                               (./MOTION.md, else ./motion/MOTION.md), to standard output
//   motionhub publish <dir> [--wait]            the pull request's checks, then the motion uploaded to motionhub.dev and a
//                                               link (and a code) where the person signs in to motionhub.dev and opens the
//                                               pull request; nothing of git, gh or a GitHub token is needed here. Signed
//                                               in with `motionhub login`, in a terminal, the person certifies the DCO
//                                               here instead, and the pull request is opened at once. With --wait, waits
//                                               for the pull request and prints its address. --pr and --github are
//                                               refused: a fork is not a way to submit

import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {handleOf} from './security/ownership.mjs';
import {ID, SPEC, checkMotion, expandTokens, listMotions, motionId, parseFrontMatter, place} from './check.mjs';
import {files as filesOf, tgz} from './pack.mjs';
import {privateIndex, privatePackage} from './private-cli.mjs';
import {keptToken, origin, signedIn} from './artifact-cli.mjs';
import {createInterface} from 'node:readline/promises';

export const HUB = 'https://motionhub.dev';

/** Where a project keeps its motions (SPEC.md §13), and the file that records the ones it took from a hub. */
export const MOTIONS = 'motions';
export const LOCK = 'motions.lock.json';
const LOCK_VERSION = 1;

/** Where a motion taken from a hub sits in a project: motions/<id>/, so motions/@<scope>/<slug>/. */
export const motionPath = (id, root = '.') => join(root, MOTIONS, ...id.split('/'));

/**
 * The project's lock: `{lockfileVersion, motions: {<id>: {version, sha256, private?}}}`, with no motions when there is
 * none. `private: true` marks a motion of your own kept on motionhub.dev for you alone (tools/private-cli.mjs): it is
 * taken back signed in, from your private motions, not from the public index.
 */
export function readLock(root = '.') {
  const file = join(root, LOCK);
  if (!existsSync(file)) return {lockfileVersion: LOCK_VERSION, motions: {}};
  let lock;
  try { lock = JSON.parse(readFileSync(file, 'utf8')); } catch (error) { throw new Error(`${file} is not JSON: ${error.message}`); }
  if (lock?.lockfileVersion !== LOCK_VERSION || !lock.motions || typeof lock.motions !== 'object') throw new Error(`${file} is in a format this version does not know: update with npx @motionhub/cli@latest`);
  // an entry names where a motion is written, so it must be an id, and its package a SHA-256
  for (const [id, m] of Object.entries(lock.motions)) {
    if (!ID.test(id) || !id.startsWith('@') || typeof m?.version !== 'string' || !/^[0-9A-Za-z.+-]+$/.test(m.version) || !/^[0-9a-f]{64}$/.test(m?.sha256 ?? '') || (m.private !== undefined && m.private !== true)) throw new Error(`${file}: "${id}" is not a motion this file can record ({"version", "sha256"} under an id @<scope>/<slug>, and "private": true for one of your own)`);
  }
  return lock;
}

/** Write the project's lock, its motions in the order of their ids, so the file only changes where a motion does. */
export function writeLock(lock, root = '.') {
  const motions = Object.fromEntries(Object.keys(lock.motions).sort().map((id) => [id, {version: lock.motions[id].version, sha256: lock.motions[id].sha256, ...(lock.motions[id].private ? {private: true} : {})}]));
  writeFileSync(join(root, LOCK), `${JSON.stringify({lockfileVersion: LOCK_VERSION, motions}, null, 2)}\n`);
}

/** The SHA-256 of a motion's directory packed the way the hub packs it under `id`: its package's when it is the copy as published. */
export const packedSha256 = (dir, id) => createHash('sha256').update(tgz(filesOf(dir).map((n) => [`${id}/${n}`, readFileSync(join(dir, n))]))).digest('hex');

/** The motion a project holds, as SPEC.md §11 says a tool looks for one, or undefined. */
export const projectMotion = (root = '.') => ['MOTION.md', 'motion/MOTION.md'].map((f) => join(root, f)).find((f) => existsSync(f));

/** A motion in one file's tokens, in the form of tokens.json; a file that is not a valid one is refused, with why. */
export function motionTokens(path) {
  const issues = checkMotion(path, {hub: false});
  if (issues.length) throw new Error(`${path} is not a valid motion in one file:\n${issues.map((i) => `  ${i.code}  ${i.message}`).join('\n')}`);
  return expandTokens(parseFrontMatter(readFileSync(path, 'utf8')).data.tokens);
}

async function get(url) {
  let res;
  try { res = await fetch(url, {signal: AbortSignal.timeout(20_000)}); }
  catch (error) { throw new Error(`motionhub.dev could not be reached: ${error.message}`); }
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}

/** The index's rows. */
export async function index(base = HUB) {
  const body = await (await get(`${base}/api/motions.json`)).json();
  if (body.spec !== 'motion/0.1' || !Array.isArray(body.motions)) throw new Error(`the index is in a format this version does not know (${body.spec}): update with npx @motionhub/cli@latest`);
  return body.motions;
}

/** The rows that contain every word. */
export function search(rows, words) {
  const wanted = words.map((w) => w.toLowerCase()).filter(Boolean);
  return rows.filter((m) => {
    const text = [m.slug, ...Object.values(m.name), ...Object.values(m.line), ...Object.values(m.fit?.for ?? {}), ...(m.catalogs ?? []), ...m.tags].join(' ').toLowerCase();
    return wanted.every((w) => text.includes(w));
  });
}

/** The regular files of a ustar archive, by path; a link or other special entry is refused. */
export function untar(tar) {
  const files = new Map();
  const text = (at, width) => tar.subarray(at, at + width).toString('utf8').replace(/\0.*$/s, '');
  for (let at = 0; at + 512 <= tar.length;) {
    if (tar.subarray(at, at + 512).every((b) => b === 0)) break;
    const name = text(at, 100), prefix = text(at + 345, 155), size = parseInt(text(at + 124, 12).trim() || '0', 8), type = String.fromCharCode(tar[at + 156] || 48);
    if (!Number.isFinite(size) || size < 0 || at + 512 + size > tar.length) throw new Error('the package is not a valid archive');
    const path = prefix ? `${prefix}/${name}` : name;
    if (type === '0') files.set(path, tar.subarray(at + 512, at + 512 + size));
    else if (type !== '5') throw new Error(`the package holds a link or special file: ${path}`);
    at += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}

/** A motion's files from its package, checked against its index row, by path within the motion. */
export function unpack(row, gz) {
  if (createHash('sha256').update(gz).digest('hex') !== row.package.sha256) throw new Error(`${row.slug} ${row.version}: the package does not match the index's SHA-256`);
  const files = new Map(), root = `${row.slug}/`;
  for (const [path, data] of untar(gunzipSync(gz))) {
    if (!path.startsWith(root) || path.split('/').some((p) => !p || p === '.' || p === '..')) throw new Error(`the package holds a file outside its motion: ${path}`);
    files.set(path.slice(root.length), data);
  }
  return files;
}

/**
 * Write the package `row` names (its `slug` the motion's id, `package.url` and `package.sha256`) into `out`, which must
 * not exist yet. A `private` row's package is downloaded signed in (tools/private-cli.mjs); either is checked against its SHA-256.
 */
async function take(row, out, base) {
  if (existsSync(out)) throw new Error(`${out} already exists: a project keeps the copy it took, so remove it first or choose --out`);
  const gz = row.private ? await privatePackage(row) : Buffer.from(await (await get(new URL(row.package.url, base).href)).arrayBuffer());
  const files = unpack(row, gz);
  for (const [path, data] of files) { mkdirSync(dirname(join(out, path)), {recursive: true}); writeFileSync(join(out, path), data); }
}

/** Write the newest version of the motion `id` (`<slug>` or `@<scope>/<slug>`) into `out`, which must not exist yet. Returns its index row. */
export async function getMotion(id, out, base = HUB, rows) {
  const row = (rows ?? await index(base)).find((m) => m.slug === id);
  if (!row) throw new Error(`no motion "${id}" on ${base}${id.startsWith('@') ? '' : ` (a community motion's id starts with its creator: @<login>/${id})`}: motionhub search <words>`);
  await take(row, out, base);
  return row;
}

/**
 * Bring the project's motions to what its lock records (`motionhub get` with no id): a motion missing from motions/ is
 * taken at the recorded version and checked against the recorded SHA-256; one already there is packed the hub's way and
 * compared with it. Returns one line per motion and how many are not the copy as published.
 */
export async function restore(root = '.', base = HUB) {
  const lock = readLock(root), lines = [];
  let changed = 0;
  for (const [id, {version, sha256, private: own}] of Object.entries(lock.motions)) {
    const out = motionPath(id, root), at = relative(root, out);
    if (!existsSync(out)) {
      await take({slug: id, version, private: own, package: {url: `${own ? '/api/private' : ''}/m/${id}/${version}.tgz`, sha256}}, out, base);
      lines.push(`${id} ${version}  taken into ${at}`);
    } else if (packedSha256(out, id) === sha256) lines.push(`${id} ${version}  ok`);
    else {
      lines.push(`${id} ${version}  changed: ${at} is not the copy as published. A motion of your own goes in a directory of its own (motions/<name>/); remove this one and run motionhub get to take it back`);
      changed++;
    }
  }
  return {lines, changed};
}

/** The command line for search and get: `args` after the command's name. Returns the exit status. */
export async function main(command, args, base = HUB) {
  if (command === 'search') {
    const rows = search(await index(base), args.filter((a) => !a.startsWith('--')));
    const text = (localized) => (localized ? localized.en ?? Object.values(localized)[0] : undefined);
    for (const m of rows) {
      const about = [m.catalogs?.length && `in ${m.catalogs.join(', ')}`, text(m.fit?.for) && `for: ${text(m.fit.for)}`, text(m.fit?.not) && `not for: ${text(m.fit.not)}`].filter(Boolean);
      console.log(`${m.slug}  ${m.version}  ${text(m.line)}  (${about.map((a) => `${a}; `).join('')}looks: ${m.tags.join(', ')}; by ${m.authors.map(handleOf).join(', ')}; ${m.license.text}${m.tools.length ? `; for ${m.tools.join(', ')}` : ''})`);
    }
    console.log(rows.length ? `${rows.length} motion(s); get one with: motionhub get <id>` : 'No motion has every one of those words');
    return 0;
  }
  const value = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const slug = args.find((a, i) => !a.startsWith('--') && !['--out', '--handle'].includes(args[i - 1]));
  if (command === 'tokens') {
    if (args.includes('--out') && (!value('--out') || value('--out').startsWith('--'))) { console.error('usage: motionhub tokens [MOTION.md] [--out <file>]: --out needs a path'); return 2; }
    const file = slug ?? projectMotion();
    if (!file) {
      const held = listMotions(resolve(MOTIONS)).map((d) => `  motionhub tokens ${join(MOTIONS, d, 'MOTION.md')}`);
      console.error(`no MOTION.md here or in ./motion: usage: motionhub tokens [MOTION.md] [--out <file>]${held.length ? `\nthe project holds several motions; name one:\n${held.join('\n')}` : ''}`);
      return 2;
    }
    const json = `${JSON.stringify(motionTokens(file), null, 2)}\n`;
    if (value('--out')) { writeFileSync(value('--out'), json); console.log(`${value('--out')}, the tokens of ${file}`); } else process.stdout.write(json);
    return 0;
  }
  if (command === 'publish') {
    // a fork pull request fails ownership (it will not check out fork code). The only submission is the site intake
    if (args.includes('--pr') || args.includes('--github')) {
      console.error('publish submits only through motionhub.dev. Run `motionhub publish <dir>` (add --wait to wait for the pull request): motionhub\'s GitHub App opens the pull request from a share/ branch. A fork, with your own GitHub token, is not a way to submit: those pull requests fail the ownership check. `motionhub check <dir> --author <handle>` runs the checks as that account.');
      return 2;
    }
    if (!slug) { console.error('usage: motionhub publish <dir> [--wait]'); return 2; }
    // signed in for this hub, a person at a terminal may submit from here; an agent, with no terminal, gives the link
    const token = base === origin ? await keptToken().catch(() => '') : '';
    console.log(await shareLink(resolve(slug), {wait: args.includes('--wait'), log: (l) => console.log(l), token, certify: certifyHere}, base));
    return 0;
  }
  if (command === 'init') {
    if (!slug || !/^(?=.{3,40}$)[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { console.error('usage: motionhub init <slug> [--handle <handle>]  (3 to 40 characters of a-z, 0-9 and single hyphens)'); return 2; }
    if (args.includes('--github')) { console.error('init takes --handle <handle>, your handle on motionhub.dev, in place of --github'); return 2; }
    const out = resolve(MOTIONS, slug);
    if (existsSync(out)) throw new Error(`${out} already exists`);
    // the signed-in account's handle when motionhub.dev can say it; init itself needs no network
    const account = value('--handle') ? {login: value('--handle')} : await signedIn().catch((e) => { console.error(`motionhub.dev could not say who is signed in (${e.message}): pass --handle <handle>, or fill in scope and authors in motion.json`); return undefined; });
    for (const [path, data] of scaffold(slug, account)) { mkdirSync(dirname(join(out, path)), {recursive: true}); writeFileSync(join(out, path), data); }
    console.log(`${out}, the motion @${account?.login ? account.login.toLowerCase() : 'your-handle'}/${slug}, authored by ${account?.login ? `${account.login}${value('--handle') ? '' : ' (the account motionhub login signed in)'}` : 'nobody yet: run motionhub login, or set scope and authors in motion.json'}: fill in motion.json, MOTION.md, tokens.json and CREDITS.md, add poster.jpg (a frame of a film made in it, 960 to 3840 pixels wide, at most 500 KB) and any tool directory, then: motionhub upload ${relative(process.cwd(), out)} to keep it for yourself, or motionhub publish ${relative(process.cwd(), out)} to make it public`);
    return 0;
  }
  if (!slug) {
    if (args.includes('--out')) { console.error('usage: motionhub get <id> [--out <dir>]: --out takes one motion'); return 2; }
    if (!Object.keys(readLock().motions).length) { console.error(`usage: motionhub get <id> [--out <dir>], or motionhub get to take every motion ${LOCK} records: there is none here yet`); return 2; }
    const {lines, changed} = await restore('.', base);
    for (const line of lines) console.log(line);
    return changed ? 1 : 0;
  }
  const custom = value('--out'), own = args.includes('--private');
  const out = resolve(custom ?? motionPath(slug)), at = relative(process.cwd(), out);
  // --private: one of your own motions, kept on motionhub.dev for you alone (tools/private-cli.mjs), signed in
  const rows = own ? await privateIndex() : await index(base);
  if (own && !rows.some((m) => m.slug === slug)) throw new Error(`you have no ${slug} uploaded: motionhub list`);
  const lock = readLock();
  // a copy already in the project stays: it is the version the film was made in
  if (!custom && existsSync(out)) {
    const held = lock.motions[slug], newest = rows.find((m) => m.slug === slug);
    if (held && newest && held.version === newest.version) { console.log(`${slug} ${held.version} is in ${at}, the newest version`); return 0; }
    throw new Error(`${at} already exists${held ? ` at ${held.version}` : ''}${newest ? `; the newest is ${newest.version}: remove ${at} and get it again to take that one` : ''}`);
  }
  const row = await getMotion(slug, out, base, rows);
  if (!custom) { lock.motions[row.slug] = {version: row.version, sha256: row.package.sha256, ...(own ? {private: true} : {})}; writeLock(lock); }
  if (own) { console.log(`${row.slug} ${row.version}, your private motion, in ${at}${custom ? '' : `, recorded in ${LOCK} as private: motionhub get takes it back when you are signed in`}`); return 0; }
  console.log(`${row.slug} ${row.version} in ${at}${custom ? '' : `, recorded in ${LOCK}`}: read its MOTION.md and tokens.json before drawing. Credit: ${row.name.en} by ${row.authors.map((a) => a.name).join(', ')}, ${base}/${row.slug}/, ${row.license.text}`);
  return 0;
}

/** A new motion's starting files, by path: every required file but the poster, with what each part is for, scoped to its author. */
export function scaffold(slug, author) {
  const title = slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  const color = (hex) => ({colorSpace: 'srgb', components: [1, 3, 5].map((i) => Math.round((parseInt(hex.slice(i, i + 2), 16) / 255) * 10000) / 10000), hex});
  return new Map([
    ['motion.json', JSON.stringify({spec: SPEC, scope: (author?.login || 'your-handle').toLowerCase(), slug, version: '1.0.0', name: {en: title}, line: {en: `One sentence: what ${title} looks like and what it is for.`},
      authors: [{name: author?.name || author?.login || 'Your name', handle: (author?.login || 'your-handle').toLowerCase()}], license: {text: 'CC-BY-4.0', code: 'MIT'}, tags: [],
      fit: {for: {en: `The subjects and kinds of film ${title} is for, and any footage the maker must bring.`}, not: {en: 'What it handles badly.'}}}, null, 2) + '\n'],
    ['MOTION.md', `# ${title}\n\nWhat a film in this motion feels like, in a sentence or two. Describe the look and the motion, never a particular film.\n\n## Essence\n\nThe few traits that make a frame read as ${title} at a glance, and what it is easily confused with.\n\n## Colour\n\nWhat each colour token is for, and what is never coloured.\n\n## Type\n\nThe faces and their roles, sizes, and how words sit in the frame.\n\n## Motion\n\nHow things arrive, change and leave; the easing and the durations in seconds; how motion follows the narration or music; what never moves.\n\n## Avoid\n\nThe mistakes this look invites, and what to do instead.\n`],
    ['tokens.json', JSON.stringify({
      color: {$type: 'color', ground: {$value: color('#FBFAF5'), $description: 'the ground'}, ink: {$value: color('#1B2A47'), $description: 'every line and word'}, accent: {$value: color('#CF4F33'), $description: 'the one thing that matters'}},
      font: {$type: 'fontFamily', sans: {$value: ['Inter', 'sans-serif']}},
      duration: {$type: 'duration', enter: {$value: {value: 0.6, unit: 's'}}},
      easing: {$type: 'cubicBezier', arrive: {$value: [0.22, 1, 0.36, 1]}},
    }, null, 2) + '\n'],
    ['CREDITS.md', `# Credits\n\n${title} is an original motion.\n\n## Fonts\n\n- Inter: SIL Open Font License 1.1, https://github.com/rsms/inter\n\n## Assets\n\n- None.\n`],
  ]);
}

/**
 * The hub's recorded accounts, so the checks here judge a rename as the server will. They never replace the server's
 * authorization: a handle not recorded yet is the submitter's own, which motionhub.dev records with the pull request.
 */
async function sharingAccounts(base, was) {
  const registry = await (await get(`${base}/api/accounts.json`)).json();
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) throw new Error('the hub account registry is invalid');
  const accounts = new Map();
  for (const [login, id] of Object.entries(registry)) {
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('the hub account registry is invalid');
    accounts.set(login.toLowerCase(), id);
  }
  for (const a of was?.authors ?? []) if (!accounts.has(String(handleOf(a)).toLowerCase())) throw new Error('the published author is not recorded; contact the maintainer');
  return accounts;
}

/**
 * Whether the person at this terminal certifies the DCO for `id` and its `files`, typed as a yes. False with no terminal
 * to ask (an agent, a pipe): a share is then submitted from its link, by the person, on motionhub.dev.
 */
export async function certifyHere({id, version, files}) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return false;
  console.log(`${id} ${version} is ready to open its pull request. These files become public when you confirm, even if the pull request is closed later:\n  ${files.join('\n  ')}`);
  console.log('Confirm only for a share you started yourself. By confirming you certify the Developer Certificate of Origin 1.1 (https://developercertificate.org): you have the right to contribute this motion under its licence.');
  const rl = createInterface({input: process.stdin, output: process.stdout});
  try { return /^yes$/i.test((await rl.question('Type yes to certify and open the pull request, anything else to get a link instead: ')).trim()); }
  finally { rl.close(); }
}

/**
 * Share a motion through motionhub.dev, with no git, gh or GitHub token here: check it as its pull request will be
 * checked (all but who you are, which the site and the pull request judge), pack it, upload it, and say where to open
 * the pull request: a link to sign in with GitHub at and a code to type there. With `wait`, ask until the pull request
 * is open (or `log` says it is not yet) and give its address. `ask` is the time between asks, in ms.
 */
export async function shareLink(dir, {wait = false, log = () => {}, ask = 5000, most = 30 * 60 * 1000, token = '', certify} = {}, base = HUB) {
  if (!existsSync(join(dir, 'motion.json'))) throw new Error(`${dir} has no motion.json: share a motion's directory (motionhub init <slug> makes one)`);
  const manifest = JSON.parse(readFileSync(join(dir, 'motion.json'), 'utf8'));
  const id = motionId(manifest);
  const published = (await index(base)).find((m) => m.slug === id);
  const was = published ? await (await get(`${base}/m/${id}/motion.json`)).json() : undefined;
  const accounts = await sharingAccounts(base, was);
  // judged by the hub's accounts, but in its own place: a project's motions/<name>/ is not the catalogue (SPEC.md §13)
  const issues = checkMotion(dir, {was, shared: true, accounts, catalogue: place(dir).catalogue});
  if (issues.length) throw new Error(`${dir} does not pass the hub's checks:\n${issues.map((i) => `${i.at}  ${i.code}  ${i.message}`).join('\n')}`);
  const bytes = tgz(filesOf(dir).map((n) => [`${id}/${n}`, readFileSync(join(dir, n))]));
  if (bytes.length > 1024 * 1024) throw new Error(`${id} packs to ${bytes.length} bytes: a motion is at most 1 MB, its poster included`);
  // motionhub-share: the way of sharing this command line speaks (site/submissions.mjs PROTOCOL), header polling
  const res = await fetch(`${base}/api/submissions`, {method: 'POST', headers: {'content-type': 'application/gzip', 'user-agent': 'motionhub-cli', 'motionhub-share': '2'}, body: bytes});
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`motionhub.dev did not take it (${res.status}): ${body.error ?? res.statusText}`);
  const lines = [
    `${id} ${manifest.version} passes the checks and is uploaded${published ? `, after ${published.version}` : ''}. Nothing is published yet. To open its pull request under your name:`,
    `  1. Open ${body.url}`,
    `  2. Sign in to motionhub.dev, check the motion, and type this code: ${body.code}`,
    `Files to publish: ${filesOf(dir).join(', ')}`,
    `All listed files become public when you confirm the pull request.`,
    `The link works until ${body.expires}. Never type the code on a page you did not open from this terminal.`,
  ];
  // signed in, and certified by the person at this terminal: submitted from here, as the share page would
  if (token && certify && await certify({id, version: manifest.version, files: filesOf(dir)})) {
    const sent = await fetch(`${base}/api/submissions/${body.id}/submit`, {method: 'POST', headers: {'content-type': 'application/json', 'user-agent': 'motionhub-cli', authorization: `Bearer ${token}`}, body: JSON.stringify({code: body.code, mine: true, dco: true})}).catch(() => undefined);
    const done = sent ? await sent.json().catch(() => ({})) : {};
    if (sent?.ok && done.prUrl) return `The pull request is open: ${done.prUrl}`;
    lines.unshift(`It was not submitted from here: ${done.error ?? (sent ? `motionhub.dev answered ${sent.status}` : 'motionhub.dev could not be reached')}. Submit it from its link instead.`);
  }
  if (!wait) return lines.join('\n');
  log(lines.join('\n'));
  for (const until = Date.now() + most; Date.now() < until;) {
    await new Promise((r) => setTimeout(r, ask));
    // a moment without the network, or an answer that is not one, is asked again next time
    const res = await fetch(`${base}/api/submissions/${body.id}/status`, {headers: {'user-agent': 'motionhub-cli', authorization: `Bearer ${body.poll}`}}).catch(() => undefined);
    if (res?.status === 404) throw new Error('motionhub.dev no longer knows this share: share again');
    const s = res?.ok ? await res.json().catch(() => ({})) : {};
    if (s.prUrl) return `The pull request is open: ${s.prUrl}`;
    if (s.status === 'expired') throw new Error('the share link expired before it was submitted: share again');
  }
  return `Not submitted yet; the link still works until ${body.expires}: ${body.url}`;
}
