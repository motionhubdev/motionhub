import {test, beforeEach, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {mergeSubmission, mergeTokenProblem} from '../.github/scripts/motion-merge.mjs';

const HEAD = 'c'.repeat(40), APP = 'motionhub-dev[bot]';
let originalFetch, saved;
const variables = ['GITHUB_REPOSITORY', 'MOTIONHUB_BOT', 'OPENCODE_AUTO_MERGE', 'OPENCODE_AUTO_APPROVE'];
const context = () => ({
  schema: 1, repo: 'owner/repo', number: 121, head: HEAD, title: 'Add Proofline 1.0.0', firstTime: false,
  files: [{path: 'motions/@motionhub/proofline/motion.json', status: 'added'}, {path: 'accounts/motionhub.json', status: 'added'}],
});
const result = () => ({verdict: 'approve', summary: 'Ready', findings: [], imagesInspected: true, humanReview: ''});
const submission = (head = HEAD) => ({
  state: 'open', draft: false, user: {type: 'Bot', login: APP},
  head: {sha: head, ref: 'share/motionhub/proofline/264293696/s1', repo: {full_name: 'owner/repo'}}, base: {repo: {full_name: 'owner/repo'}},
});
const green = () => [
  {id: 1, name: 'check', head_sha: HEAD, status: 'completed', conclusion: 'success'},
  {id: 2, name: 'ownership', head_sha: HEAD, status: 'completed', conclusion: 'success'},
];
const approval = () => ({user: {login: 'github-actions[bot]'}, state: 'APPROVED', body: `<!-- motionhub-opencode-review:${HEAD} -->`});

beforeEach(() => {
  originalFetch = globalThis.fetch;
  saved = new Map(variables.map((key) => [key, process.env[key]]));
  process.env.GITHUB_REPOSITORY = 'owner/repo';
  process.env.MOTIONHUB_BOT = APP;
  process.env.OPENCODE_AUTO_MERGE = 'true';
  process.env.OPENCODE_AUTO_APPROVE = 'true';
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of saved) value === undefined ? delete process.env[key] : process.env[key] = value;
});

function mockGithub({pr = submission(), reviews = [approval()], runs = green()} = {}) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    const u = new URL(url), method = init.method ?? 'GET';
    calls.push({url: u, method, body: init.body ? JSON.parse(init.body) : null, auth: init.headers?.authorization});
    if (method === 'GET' && u.pathname === '/repos/owner/repo/pulls/121') return Response.json(pr);
    if (method === 'GET' && u.pathname === '/repos/owner/repo/pulls/121/files') return Response.json(context().files.map((file) => ({filename: file.path, status: file.status})));
    if (method === 'GET' && u.pathname === `/repos/owner/repo/commits/${HEAD}/check-runs`) return Response.json({check_runs: runs});
    if (method === 'GET' && u.pathname === '/repos/owner/repo/pulls/121/reviews') return Response.json(reviews);
    if (method === 'PUT' && u.pathname === '/repos/owner/repo/pulls/121/merge') return Response.json({merged: true, sha: 'merge-sha'});
    throw new Error(`unexpected ${method} ${u.pathname}`);
  };
  return calls;
}

test('a clean approved submission merges only with the merge App token and exact reviewed SHA', async () => {
  const calls = mockGithub();
  const merged = await mergeSubmission(context(), result(), 'synthetic-merge-token');
  assert.equal(merged.merged, true);
  const put = calls.find((call) => call.method === 'PUT');
  assert.equal(put.body.sha, HEAD);
  assert.equal(put.body.merge_method, 'merge');
  assert.equal(put.auth, 'Bearer synthetic-merge-token');
  assert.ok(calls.every((call) => call.auth === 'Bearer synthetic-merge-token'));
});

test('disabled automatic merging does not contact GitHub', async () => {
  process.env.OPENCODE_AUTO_MERGE = 'false';
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error('unexpected'); };
  assert.deepEqual(await mergeSubmission(context(), result(), 'synthetic-merge-token'), {merged: false, reason: 'disabled'});
  assert.equal(called, false);
});

test('automatic approval being disabled also prevents merging without contacting GitHub', async () => {
  process.env.OPENCODE_AUTO_APPROVE = 'false';
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error('unexpected'); };
  assert.deepEqual(await mergeSubmission(context(), result(), 'synthetic-merge-token'), {merged: false, reason: 'approval disabled'});
  assert.equal(called, false);
});

test('no live approval, a first submission, a human block or a moved head prevents merging', async () => {
  for (const {context: c, options} of [
    {context: context(), options: {reviews: []}},
    {context: {...context(), firstTime: true}, options: {}},
    {context: context(), options: {reviews: [approval(), {user: {id: 7, login: 'maintainer'}, state: 'CHANGES_REQUESTED', submitted_at: '2026-11-28T12:00:00Z'}]}},
    {context: context(), options: {pr: submission('d'.repeat(40))}},
  ]) {
    const calls = mockGithub(options);
    assert.equal((await mergeSubmission(c, result(), 'synthetic-merge-token')).merged, false);
    assert.equal(calls.some((call) => call.method === 'PUT'), false);
  }
});

test('merge token validation accepts only the exact repository and required least permissions', () => {
  const valid = {
    token: 'secret', repository_selection: 'selected', repositories: [{full_name: 'owner/repo'}],
    permissions: {contents: 'write', pull_requests: 'write', checks: 'read', metadata: 'read'},
  };
  assert.equal(mergeTokenProblem(valid, 'owner/repo'), '');
  assert.match(mergeTokenProblem({...valid, permissions: {...valid.permissions, administration: 'write'}}, 'owner/repo'), /unexpected permission/);
  assert.match(mergeTokenProblem({...valid, permissions: Object.fromEntries(Object.entries(valid.permissions).filter(([name]) => name !== 'checks'))}, 'owner/repo'), /lacks/);
  assert.match(mergeTokenProblem({...valid, repositories: [{full_name: 'owner/other'}]}, 'owner/repo'), /another repository/);
  assert.match(mergeTokenProblem({...valid, repository_selection: 'all'}, 'owner/repo'), /every repository/);
  assert.match(mergeTokenProblem({token: ''}, 'owner/repo'), /no merge token/);
});
