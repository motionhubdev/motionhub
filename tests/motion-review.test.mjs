import {test, beforeEach, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkLlm, checksReady, eligibleSubmission, publish, validate, validateAnswer} from '../.github/scripts/motion-review.mjs';

const HEAD = 'a'.repeat(40), APP = 'motionhub-dev[bot]';
let root, originalFetch, saved;
const variables = ['GH_TOKEN', 'GITHUB_REPOSITORY', 'MOTIONHUB_BOT', 'OPENCODE_AUTO_APPROVE', 'LLM_BASE_URL', 'LLM_API_KEY', 'LLM_KEY', 'LLM_MODEL'];
const context = () => ({
  schema: 1, repo: 'owner/repo', number: 121, head: HEAD, title: 'Add Ledger', body: '', firstTime: false,
  files: [{path: 'motions/@ana/ledger/motion.json', status: 'added'}], submitter: {id: 42, login: 'ana'},
});
const answer = () => ({verdict: 'approve', summary: 'A sound motion. Ask @maintainer for a second look.', findings: [], imagesInspected: true, humanReview: ''});
const submission = (head = HEAD) => ({
  state: 'open', draft: false, user: {type: 'Bot', login: APP}, head: {sha: head, ref: 'share/ana/ledger/42/s1', repo: {full_name: 'owner/repo'}}, base: {repo: {full_name: 'owner/repo'}},
});
const green = () => [
  {id: 1, name: 'check', head_sha: HEAD, status: 'completed', conclusion: 'success'},
  {id: 2, name: 'ownership', head_sha: HEAD, status: 'completed', conclusion: 'success'},
];

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'motion-review-'));
  originalFetch = globalThis.fetch;
  saved = new Map(variables.map((key) => [key, process.env[key]]));
  process.env.GH_TOKEN = 'synthetic-token';
  process.env.GITHUB_REPOSITORY = 'owner/repo';
  process.env.MOTIONHUB_BOT = APP;
  process.env.OPENCODE_AUTO_APPROVE = 'true';
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of saved) value === undefined ? delete process.env[key] : process.env[key] = value;
  rmSync(root, {recursive: true, force: true});
});

function inputs(c = context(), result = answer()) {
  const input = join(root, 'context.json'), output = join(root, 'result.json');
  writeFileSync(input, JSON.stringify(c));
  writeFileSync(output, JSON.stringify(result));
  return [input, output];
}

function mockGithub({pr = submission(), runs = green(), reviews = []} = {}) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    const u = new URL(url), method = init.method ?? 'GET';
    calls.push({method, path: u.pathname, body: init.body ? JSON.parse(init.body) : null});
    if (method === 'GET' && u.pathname === '/repos/owner/repo/pulls/121') return Response.json(pr);
    if (method === 'GET' && u.pathname === '/repos/owner/repo/pulls/121/files') return Response.json([{filename: 'motions/@ana/ledger/motion.json', status: 'added'}]);
    if (method === 'GET' && u.pathname === `/repos/owner/repo/commits/${HEAD}/check-runs`) return Response.json({check_runs: runs});
    if (method === 'GET' && u.pathname === '/repos/owner/repo/pulls/121/reviews') return Response.json(reviews);
    if (method === 'POST' && u.pathname === '/repos/owner/repo/pulls/121/reviews') return Response.json({id: 1});
    throw new Error(`unexpected ${method} ${u.pathname}`);
  };
  return calls;
}

test('OpenCode reads a generic OpenAI-compatible provider from LLM secrets', () => {
  const config = JSON.parse(readFileSync(new URL('../.github/opencode/motion-review.jsonc', import.meta.url), 'utf8'));
  assert.equal(config.model, 'configured/review');
  assert.equal(config.providers.configured.package, '@opencode/ai/providers/openai-compatible');
  assert.deepEqual(config.providers.configured.env, ['LLM_API_KEY', 'LLM_KEY']);
  assert.equal(config.providers.configured.settings.baseURL, '{env:LLM_BASE_URL}');
  assert.equal(config.providers.configured.models.review.modelID, '{env:LLM_MODEL}');
  assert.match(config.agents['motion-review'].system, /Always write every piece of review prose in English/);
  assert.match(readFileSync(new URL('../.github/opencode/prompt.txt', import.meta.url), 'utf8'), /Always write all review prose in English/);
  assert.match(readFileSync(new URL('../REVIEW.md', import.meta.url), 'utf8'), /Always write every part of it in English/);
});

test('the LLM configuration is validated without disclosing its credential', () => {
  const valid = {LLM_BASE_URL: 'https://api.moonshot.cn/v1', LLM_API_KEY: 'synthetic-secret', LLM_MODEL: 'kimi-k3.1-pro'};
  assert.doesNotThrow(() => checkLlm(valid));
  assert.doesNotThrow(() => checkLlm({...valid, LLM_API_KEY: '', LLM_KEY: 'alias-secret'}));
  assert.doesNotThrow(() => checkLlm({...valid, LLM_BASE_URL: 'http://127.0.0.1:11434/v1'}), 'loopback HTTP is allowed for a local model');
  for (const invalid of [
    {...valid, LLM_BASE_URL: ''},
    {...valid, LLM_BASE_URL: 'http://llm.example.com/v1'},
    {...valid, LLM_BASE_URL: 'https://user:secret@llm.example.com/v1'},
    {...valid, LLM_BASE_URL: 'https://llm.example.com/v1?api_key=secret'},
    {...valid, LLM_MODEL: ''},
    {...valid, LLM_MODEL: 'model\nwith-a-newline'},
    {...valid, LLM_API_KEY: '', LLM_KEY: ''},
  ]) {
    assert.throws(() => checkLlm(invalid), (error) => {
      assert.ok(!error.message.includes('synthetic-secret') && !error.message.includes('alias-secret'));
      return true;
    });
  }
});

test('the check-llm command completes successfully through the real CLI dispatcher', () => {
  const script = fileURLToPath(new URL('../.github/scripts/motion-review.mjs', import.meta.url));
  const out = execFileSync(process.execPath, [script, 'check-llm'], {encoding: 'utf8', env: {
    ...process.env,
    LLM_BASE_URL: 'https://api.moonshot.cn/v1', LLM_API_KEY: 'synthetic-secret', LLM_MODEL: 'kimi-k3.1-pro',
  }});
  assert.match(out, /endpoint, credential and model are configured/);
});

test('only the App\'s same-repository share submissions with motion and account files are eligible', () => {
  const files = context().files;
  assert.equal(eligibleSubmission(submission(), files, APP), true);
  for (const pr of [
    {...submission(), draft: true},
    {...submission(), user: {type: 'User', login: 'ana'}},
    {...submission(), head: {...submission().head, ref: 'feature/ledger'}},
    {...submission(), head: {...submission().head, repo: {full_name: 'fork/repo'}}},
  ]) assert.equal(eligibleSubmission(pr, files, APP), false);
  for (const paths of [[], [{path: 'accounts/ana.json'}], [...files, {path: '.github/workflows/check.yml'}]]) {
    assert.equal(eligibleSubmission(submission(), paths, APP), false);
  }
});

test('automatic approval requires both required checks on the exact head', () => {
  assert.equal(checksReady(HEAD, green()), true);
  assert.equal(checksReady(HEAD, green().slice(0, 1)), false);
  assert.equal(checksReady(HEAD, green().map((run) => ({...run, conclusion: 'failure'}))), false);
  assert.equal(checksReady('b'.repeat(40), green()), false);
  assert.equal(checksReady(HEAD, [...green(), {id: 3, name: 'ownership', head_sha: HEAD, status: 'completed', conclusion: 'failure'}]), false, 'the newest duplicate run decides');
});

test('the model cannot name an arbitrary path or an approval event outside the schema', () => {
  assert.deepEqual(validateAnswer(context(), answer()), answer());
  assert.throws(() => validateAnswer(context(), {...answer(), findings: [{severity: 'blocking', path: '.github/workflows/check.yml', detail: 'x'}]}));
  assert.throws(() => validateAnswer(context(), {...answer(), verdict: 'REQUEST_CHANGES'}));
  assert.throws(() => validateAnswer(context(), {...answer(), imagesInspected: 'yes'}));
});

test('a fenced OpenCode answer is parsed and written as bounded data', () => {
  const [input, output] = inputs();
  const raw = join(root, 'answer.txt');
  writeFileSync(raw, '```json\n' + JSON.stringify(answer()) + '\n```\n');
  validate(input, raw, output);
  assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), answer());
});

test('all gates green publishes an approval on the captured commit, with model text quoted', async () => {
  const calls = mockGithub();
  await publish(...inputs());
  const posted = calls.filter((call) => call.method === 'POST');
  assert.equal(posted.length, 1);
  assert.equal(posted[0].body.event, 'APPROVE');
  assert.equal(posted[0].body.commit_id, HEAD);
  assert.match(posted[0].body.body, /<!-- motionhub-opencode-review:a{40} -->/);
  assert.ok(!posted[0].body.body.includes('@maintainer'));
  assert.ok(posted[0].body.body.includes('@\u200bmaintainer'));
});

test('a first submission receives notes but never an automatic approval', async () => {
  const calls = mockGithub();
  await publish(...inputs({...context(), firstTime: true}));
  const posted = calls.find((call) => call.method === 'POST');
  assert.equal(posted.body.event, 'COMMENT');
  assert.match(posted.body.body, /first recorded motion submission/);
});

test('comment-only configuration never approves even a clean result', async () => {
  process.env.OPENCODE_AUTO_APPROVE = 'false';
  const calls = mockGithub();
  await publish(...inputs());
  assert.equal(calls.find((call) => call.method === 'POST').body.event, 'COMMENT');
});

test('a person\'s outstanding request for changes precludes approval until it is resolved', async () => {
  const requested = {id: 1, user: {id: 7, login: 'maintainer'}, state: 'CHANGES_REQUESTED', submitted_at: '2026-11-28T09:00:00Z'};
  let calls = mockGithub({reviews: [requested]});
  await publish(...inputs());
  assert.equal(calls.find((call) => call.method === 'POST').body.event, 'COMMENT');
  calls = mockGithub({reviews: [requested, {id: 2, user: requested.user, state: 'APPROVED', submitted_at: '2026-11-28T10:00:00Z'}]});
  await publish(...inputs());
  assert.equal(calls.find((call) => call.method === 'POST').body.event, 'APPROVE');
});

test('blocking findings, uninspected images or a human-review request preclude approval', async () => {
  for (const result of [
    {...answer(), findings: [{severity: 'blocking', path: null, detail: 'Unclear licensing'}]},
    {...answer(), imagesInspected: false},
    {...answer(), humanReview: 'Watch the reel'},
    {...answer(), verdict: 'comment'},
  ]) {
    const calls = mockGithub();
    await publish(...inputs(context(), result));
    assert.equal(calls.find((call) => call.method === 'POST').body.event, 'COMMENT');
  }
});

test('a stale head or an already reviewed head publishes nothing', async () => {
  let calls = mockGithub({pr: submission('b'.repeat(40))});
  await publish(...inputs());
  assert.equal(calls.filter((call) => call.method === 'POST').length, 0);
  calls = mockGithub({reviews: [{user: {login: 'github-actions[bot]'}, body: `notes <!-- motionhub-opencode-review:${HEAD} -->`}]});
  await publish(...inputs());
  assert.equal(calls.filter((call) => call.method === 'POST').length, 0);
  calls = mockGithub({reviews: [{user: {login: 'submitter'}, body: `forged <!-- motionhub-opencode-review:${HEAD} -->`}]});
  await publish(...inputs());
  assert.equal(calls.filter((call) => call.method === 'POST').length, 1, 'a submitter cannot suppress the reviewer with a forged marker');
});
