// A motion submission review, with OpenCode + a configured LLM kept apart from GitHub's write credential. prepare captures a
// trusted main revision and a submission's public files as data; OpenCode reads that checkout with no shell, edit,
// network or subagent tools; publish revalidates the live pull request before leaving one review. Only this program
// chooses APPROVE versus COMMENT. motion-merge.mjs, not this program, handles the separate automatic merge gate.
import {appendFileSync, existsSync, lstatSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {submitter} from '../../tools/check.mjs';

const MARKER = '<!-- motionhub-opencode-review:';
const REQUIRED = ['check', 'ownership'];
const alreadyReviewed = (reviews, head) => reviews.some((review) => review.user?.login === 'github-actions[bot]'
  && String(review.body ?? '').includes(`${MARKER}${head} -->`));
// A model cannot override a person's outstanding request for changes. A later approval or dismissal clears it;
// main's branch rules dismiss stale reviews on a new push.
export const changesRequested = (reviews) => {
  const latest = new Map();
  for (const review of [...reviews].sort((a, b) => String(a.submitted_at ?? '').localeCompare(String(b.submitted_at ?? '')) || (a.id ?? 0) - (b.id ?? 0))) {
    if (review.user?.login !== 'github-actions[bot]' && ['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) latest.set(review.user?.id ?? review.user?.login, review.state);
  }
  return [...latest.values()].includes('CHANGES_REQUESTED');
};
const fail = (message = 'Motion review rejected an invalid, stale, oversized or ineligible request.') => { throw new Error(message); };
const text = (value, max) => {
  if (typeof value !== 'string' || value.length > max) fail();
  return value;
};
const pathOK = (path) => typeof path === 'string' && /^[A-Za-z0-9@._/-]+$/.test(path)
  && !path.startsWith('/') && path.split('/').every((part) => part && part !== '.' && part !== '..');

/** Validate the secret-driven OpenAI-compatible provider without printing its endpoint credential or model. */
export function checkLlm(env = process.env) {
  const base = env.LLM_BASE_URL, model = env.LLM_MODEL, key = env.LLM_API_KEY || env.LLM_KEY;
  if (typeof base !== 'string' || !base.trim() || base !== base.trim() || base.length > 2000) fail('Set LLM_BASE_URL to the OpenAI-compatible API base URL.');
  if (typeof model !== 'string' || !model.trim() || model !== model.trim() || model.length > 200 || /[\u0000-\u001f\u007f]/.test(model)) fail('Set LLM_MODEL to the model ID the endpoint expects.');
  if (typeof key !== 'string' || !key.trim() || key !== key.trim() || key.length > 10000 || /[\u0000-\u001f\u007f]/.test(key)) fail('Set LLM_API_KEY (or LLM_KEY) to the endpoint credential.');
  let url;
  try { url = new URL(base); } catch { fail('LLM_BASE_URL is not a valid URL.'); }
  const loopback = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) || url.username || url.password || url.search || url.hash) {
    fail('LLM_BASE_URL must be an HTTPS origin and path, without credentials, query or fragment (HTTP is allowed only for loopback).');
  }
  console.log('The LLM endpoint, credential and model are configured.');
}

async function github(path, body) {
  const token = process.env.GH_TOKEN;
  if (!token || !path.startsWith(`/repos/${process.env.GITHUB_REPOSITORY}/`)) fail();
  const response = await fetch('https://api.github.com' + path, {
    method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(30_000),
    headers: {authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'content-type': 'application/json'},
    ...(body ? {body: JSON.stringify(body)} : {}),
  });
  if (!response.ok) fail(`GitHub answered ${response.status} while reviewing the submission.`);
  return response.json();
}

async function pages(path, most = 3) {
  const out = [];
  for (let page = 1; page <= most; page++) {
    const rows = await github(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!Array.isArray(rows)) fail();
    out.push(...rows);
    if (rows.length < 100) return out;
  }
  fail('GitHub did not list the complete submission within the review limit.');
}

/** Only the App's protected, same-repository share branches are submissions this agent may review. */
export function eligibleSubmission(pr, files, app) {
  return pr?.state === 'open' && !pr.draft && pr.user?.type === 'Bot' && pr.user.login === app
    && pr.head?.repo?.full_name === process.env.GITHUB_REPOSITORY && pr.base?.repo?.full_name === process.env.GITHUB_REPOSITORY
    && typeof pr.head.ref === 'string' && pr.head.ref.startsWith('share/')
    && files.length > 0 && files.length <= 300
    && files.some((file) => file.path.startsWith('motions/'))
    && files.every((file) => pathOK(file.path) && /^(motions|accounts)\//.test(file.path));
}

/** Both required jobs must be green on the exact submitted commit. Later duplicate runs use the newest run. */
export function checksReady(head, runs) {
  return REQUIRED.every((name) => {
    const run = runs.filter((candidate) => candidate.name === name).sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];
    return run && (!run.head_sha || run.head_sha === head) && run.status === 'completed' && run.conclusion === 'success';
  });
}

function firstSubmission(id) {
  if (!existsSync('accounts')) return true;
  for (const name of readdirSync('accounts')) {
    if (!name.endsWith('.json')) continue;
    try { if (JSON.parse(readFileSync(join('accounts', name), 'utf8')).id === id) return false; } catch { fail(); }
  }
  return true;
}

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

async function pullFiles(number) {
  return (await pages(`/repos/${process.env.GITHUB_REPOSITORY}/pulls/${number}/files`)).map((file) => ({
    path: text(file.filename, 500), status: text(file.status, 30),
  }));
}

/** Capture only an eligible, fully checked submission. Waiting is not an error: workflow_run asks again later. */
export async function prepare(destination) {
  const repo = process.env.GITHUB_REPOSITORY, app = process.env.MOTIONHUB_BOT;
  const number = Number(process.env.PR), head = process.env.HEAD_SHA;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo ?? '') || !Number.isSafeInteger(number) || number < 1 || !/^[0-9a-f]{40}$/.test(head ?? '') || !app) fail();
  const pr = await github(`/repos/${repo}/pulls/${number}`);
  if (pr.head?.sha !== head) { output('review', 'skip'); return; }
  const files = await pullFiles(number);
  const linked = files.some((file) => {
    try { return lstatSync(join('pr', file.path)).isSymbolicLink(); } catch { return false; }
  });
  if (!eligibleSubmission(pr, files, app) || linked) { output('review', 'skip'); return; }
  const runs = (await github(`/repos/${repo}/commits/${head}/check-runs?per_page=100`)).check_runs ?? [];
  if (!checksReady(head, runs)) { output('review', 'wait'); return; }
  const reviews = await pages(`/repos/${repo}/pulls/${number}/reviews`);
  if (alreadyReviewed(reviews, head)) { output('review', 'skip'); return; }
  const commits = await pages(`/repos/${repo}/pulls/${number}/commits`);
  if (commits.at(-1)?.sha !== head) { output('review', 'skip'); return; }
  const who = submitter(commits, app, pr.head.ref);
  if (who.error) fail(who.error);
  const context = {
    schema: 1, repo, number, head,
    title: text(pr.title ?? '', 1000), body: text(pr.body ?? '', 30000), files,
    submitter: {id: who.id, login: who.login}, firstTime: firstSubmission(who.id),
  };
  if (JSON.stringify(context).length > 240000) fail();
  writeFileSync(destination, JSON.stringify(context) + '\n', {mode: 0o600});
  output('review', 'ready');
}

/** The model supplies observations, never an event or a capability. Publish applies every gate again. */
export function validateAnswer(context, result) {
  if (context.schema !== 1 || !['comment', 'approve'].includes(result?.verdict)) fail();
  if (typeof result.imagesInspected !== 'boolean' || !Array.isArray(result.findings) || result.findings.length > 12) fail();
  const findings = result.findings.map((finding) => {
    if (!['blocking', 'suggestion'].includes(finding?.severity)) fail();
    const path = finding.path ?? null;
    if (path !== null && (!pathOK(path) || !context.files.some((file) => file.path === path))) fail();
    return {severity: finding.severity, path, detail: text(finding.detail, 2500)};
  });
  return {
    verdict: result.verdict,
    summary: text(result.summary, 10000),
    findings,
    imagesInspected: result.imagesInspected,
    humanReview: result.humanReview == null ? '' : text(result.humanReview, 2000),
  };
}

export function validate(contextPath, answerPath, resultPath) {
  const context = JSON.parse(readFileSync(contextPath, 'utf8'));
  const raw = text(readFileSync(answerPath, 'utf8').trim(), 120000)
    .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const result = validateAnswer(context, JSON.parse(raw));
  writeFileSync(resultPath, JSON.stringify(result) + '\n', {mode: 0o600});
}

// A model string is quoted as plain text, not allowed to mention people or inject trusted-looking Markdown.
const escapeComment = (value) => value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/[\\`*_{}[\]()#+!|~]/g, '\\$&').replace(/@/g, '@\u200b');

function reviewBody(context, result, approve, automatic, humanBlock) {
  const lines = [`${MARKER}${context.head} -->`, '## OpenCode motion review', ''];
  lines.push(approve
    ? '**Approved automatically.** The required checks passed, the submitted images were inspected, and no blocking issue or human-review request was reported. Approval and merge are separate steps; this review alone does not merge the pull request.'
    : '**Reviewer notes; no automatic approval.** A maintainer still decides.');
  lines.push('', escapeComment(result.summary));
  if (result.findings.length) {
    lines.push('', '### Findings', '');
    for (const finding of result.findings) lines.push(`- **${finding.severity === 'blocking' ? 'Blocking' : 'Suggestion'}**${finding.path ? ` \`${escapeComment(finding.path)}\`` : ''}: ${escapeComment(finding.detail)}`);
  }
  if (result.humanReview) lines.push('', '### Needs a person', '', escapeComment(result.humanReview));
  if (!result.imagesInspected) lines.push('', 'The poster and component previews still need a person to inspect them.');
  if (context.firstTime) lines.push('', 'This is the submitter\'s first recorded motion submission, so automatic approval is not allowed.');
  if (humanBlock) lines.push('', 'A maintainer has an outstanding request for changes, so automatic approval is not allowed.');
  if (automatic && !approve) lines.push('', 'Automatic approval was not used; the result or one of its safety gates requires a maintainer.');
  const body = lines.join('\n');
  if (body.length > 60000) fail();
  return body;
}

/** Publish to the captured PR only after re-reading its live head, eligibility, required checks and prior reviews. */
export async function publish(contextPath, resultPath) {
  const context = JSON.parse(readFileSync(contextPath, 'utf8'));
  if (context.schema !== 1 || context.repo !== process.env.GITHUB_REPOSITORY || !Number.isSafeInteger(context.number)) fail();
  const result = validateAnswer(context, JSON.parse(readFileSync(resultPath, 'utf8')));
  const pr = await github(`/repos/${context.repo}/pulls/${context.number}`);
  if (pr.head?.sha !== context.head || pr.state !== 'open') return;
  const [files, runBody, reviews] = await Promise.all([
    pullFiles(context.number),
    github(`/repos/${context.repo}/commits/${context.head}/check-runs?per_page=100`),
    pages(`/repos/${context.repo}/pulls/${context.number}/reviews`),
  ]);
  if (!eligibleSubmission(pr, files, process.env.MOTIONHUB_BOT) || !checksReady(context.head, runBody.check_runs ?? [])) return;
  if (alreadyReviewed(reviews, context.head)) return;
  const clean = result.verdict === 'approve' && result.imagesInspected && !result.humanReview
    && !result.findings.some((finding) => finding.severity === 'blocking');
  const automatic = process.env.OPENCODE_AUTO_APPROVE === 'true';
  const humanBlock = changesRequested(reviews);
  const approve = automatic && clean && !context.firstTime && !humanBlock;
  await github(`/repos/${context.repo}/pulls/${context.number}/reviews`, {
    commit_id: context.head, event: approve ? 'APPROVE' : 'COMMENT', body: reviewBody(context, result, approve, automatic, humanBlock),
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  const run = {prepare, validate, publish, 'check-llm': checkLlm}[command];
  if (!run) fail();
  Promise.resolve(run(...args)).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
