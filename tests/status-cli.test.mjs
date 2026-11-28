// Submission status from the real command, signed in against a stand-in for motionhub.dev's /api/me/ endpoints.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const BIN = fileURLToPath(new URL('../bin/motionhub.mjs', import.meta.url));
const MOCK = `
import {appendFileSync, readFileSync} from 'node:fs';
globalThis.fetch = async (url, options = {}) => {
  const {pathname} = new URL(url), method = options.method ?? 'GET';
  appendFileSync(process.env.TEST_LOG, JSON.stringify({method, path: pathname, auth: options.headers?.authorization}) + '\\n');
  const state = JSON.parse(readFileSync(process.env.TEST_STATE, 'utf8'));
  const answer = state[method + ' ' + pathname];
  if (!answer) return Response.json({error: 'not found'}, {status: 404});
  return Response.json(answer.json, {status: answer.status ?? 200});
};
`;

const PULL = {
  number: 121, title: 'Add Proofline 1.0.0', url: 'https://github.com/motionhubdev/motionhub/pull/121',
  updated: '2026-11-28T10:00:00Z', motions: ['@motionhub/proofline'], shared: true,
  checks: 'passed', checkRuns: [{name: 'check', status: 'completed', conclusion: 'success'}, {name: 'ownership', status: 'completed', conclusion: 'success'}],
  reviewed: true, review: 'changes', next: 'change',
  feedback: [{author: 'github-actions[bot]', state: 'COMMENTED', at: '2026-11-28T10:12:00Z', body: '**Blocking** Check the coordinate labels.', url: 'https://github.com/motionhubdev/motionhub/pull/121#pullrequestreview-1'}],
};
const SHARES = {
  waiting: [{id: 's2', motion: '@ana/new-look', version: '1.0.0', url: '/share/s2', created: '2026-11-28T09:00:00Z', expires: '2026-11-29T09:00:00Z'}],
  submitted: [{id: 's1', motion: '@motionhub/proofline', version: '1.0.0', status: 'submitted', pr: 121, prUrl: PULL.url, at: '2026-11-28T09:50:00Z', state: null}],
};

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'motionhub-status-'));
  mkdirSync(join(root, 'home/.motionhub'), {recursive: true});
  writeFileSync(join(root, 'home/.motionhub/artifact-token'), 'test-credential');
  writeFileSync(join(root, 'mock.mjs'), MOCK);
  const state = (value) => writeFileSync(join(root, 'state.json'), JSON.stringify(value));
  state({});
  const run = (args) => promisify(execFile)(process.execPath, ['--import', join(root, 'mock.mjs'), BIN, ...args], {
    cwd: root, env: {...process.env, HOME: join(root, 'home'), MOTIONHUB_ARTIFACT_ORIGIN: 'https://motionhub.dev', TEST_LOG: join(root, 'log'), TEST_STATE: join(root, 'state.json')},
  }).then(({stdout}) => ({code: 0, stdout}), (error) => ({code: error.code, stdout: error.stdout, stderr: error.stderr}));
  const log = () => existsSync(join(root, 'log')) ? readFileSync(join(root, 'log'), 'utf8').trim().split('\n').map((line) => JSON.parse(line)) : [];
  return {root, state, run, log, done: () => rmSync(root, {recursive: true, force: true})};
}

test('status lists waiting shares, submission history, check runs and concrete reviewer feedback', async () => {
  const t = setup();
  try {
    t.state({'GET /api/me/pulls': {json: {pulls: [PULL]}}, 'GET /api/me/shares': {json: SHARES}});
    const r = await t.run(['status']);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /@ana\/new-look {2}1\.0\.0 {2}waiting for you to submit/);
    assert.match(r.stdout, /@motionhub\/proofline {2}1\.0\.0 {2}submitted {2}PR #121/);
    assert.match(r.stdout, /Checks: check: success · ownership: success/);
    assert.match(r.stdout, /Review: changes requested/);
    assert.match(r.stdout, /Check the coordinate labels\./);
    assert.match(r.stdout, /needs your change/);
    assert.deepEqual(t.log().map((entry) => entry.path).sort(), ['/api/me/pulls', '/api/me/shares']);
    assert.ok(t.log().every((entry) => entry.auth === 'Bearer test-credential'));
  } finally { t.done(); }
});

test('status by motion id and by PR reads details, including a closed pull request, and offers JSON', async () => {
  const t = setup();
  try {
    t.state({'GET /api/me/shares': {json: SHARES}, 'GET /api/me/pulls/121': {json: {...PULL, state: 'closed'}}});
    const one = await t.run(['status', '@motionhub/proofline']);
    assert.equal(one.code, 0, one.stderr);
    assert.match(one.stdout, /PR #121 {2}Add Proofline 1\.0\.0/);
    assert.match(one.stdout, /github-actions\[bot\] · commented/);
    const byPr = await t.run(['status', '--pr', '121', '--json']);
    assert.equal(byPr.code, 0, byPr.stderr);
    assert.equal(JSON.parse(byPr.stdout).pull.state, 'closed');
    t.state({'GET /api/me/pulls': {json: {pulls: [PULL]}}, 'GET /api/me/shares': {json: SHARES}});
    const all = await t.run(['status', '--json']);
    assert.deepEqual(Object.keys(JSON.parse(all.stdout)).sort(), ['pulls', 'submitted', 'waiting']);
  } finally { t.done(); }
});

test('invalid status queries are refused without a request, and an unknown id says what to list', async () => {
  const t = setup();
  try {
    for (const args of [['status', 'not-an-id'], ['status', '--pr', 'nope'], ['status', '@ana/a', '--pr', '1'], ['status', '@ana/a', 'extra']]) {
      const r = await t.run(args);
      assert.equal(r.code, 2, args.join(' '));
      assert.match(r.stderr, /usage: motionhub status/);
    }
    assert.deepEqual(t.log(), []);
    t.state({'GET /api/me/shares': {json: {waiting: [], submitted: []}}});
    const missing = await t.run(['status', '@ana/missing']);
    assert.equal(missing.code, 1);
    assert.match(missing.stderr, /No submission for @ana\/missing/);
  } finally { t.done(); }
});
