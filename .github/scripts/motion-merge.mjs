// The only automatic merge path. It runs after motion-review.mjs publishes an approval, with a separate GitHub App
// credential and OPENCODE_AUTO_MERGE. The model cannot call this directly: its clean result, the live approval, exact
// head, required checks, eligible share branch and established account are all checked again before PUT .../merge.
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {appJwt} from './site-dispatch.mjs';
import {validateAnswer, eligibleSubmission, checksReady, changesRequested} from './motion-review.mjs';

const MARKER = '<!-- motionhub-opencode-review:';
const fail = (message) => { throw new Error(message); };

async function github(path, token, {method, body} = {}) {
  if (!token || !path.startsWith('/')) fail('The merge App credential is missing.');
  const response = await fetch('https://api.github.com' + path, {
    method: method ?? (body ? 'POST' : 'GET'), redirect: 'error', signal: AbortSignal.timeout(30_000),
    headers: {authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'content-type': 'application/json'},
    ...(body ? {body: JSON.stringify(body)} : {}),
  });
  if (!response.ok) fail(`GitHub answered ${response.status}: ${(await response.text()).slice(0, 2000)}`);
  return response.status === 204 ? null : response.json();
}

/** A token for this one repository, with only the permissions automatic merging and its live checks need. */
export function mergeTokenProblem(body, repo) {
  if (!body || typeof body.token !== 'string' || !body.token) return 'GitHub gave no merge token';
  if (body.repository_selection && body.repository_selection !== 'selected') return 'The merge token covers every repository';
  const repositories = body.repositories ?? [];
  if (repositories.length !== 1 || repositories[0].full_name !== repo) return 'The merge token covers another repository';
  for (const [name, value] of Object.entries(body.permissions ?? {})) {
    if ((name === 'contents' || name === 'pull_requests') && value === 'write') continue;
    if (name === 'checks' && value === 'read') continue;
    if (name === 'metadata' && value === 'read') continue;
    return `The merge token has an unexpected permission: ${name}`;
  }
  if (body.permissions?.contents !== 'write' || body.permissions?.pull_requests !== 'write' || body.permissions?.checks !== 'read') return 'The merge token lacks contents or pull-requests write, or checks read';
  return '';
}

async function mintMergeToken() {
  const repo = process.env.GITHUB_REPOSITORY, id = process.env.MOTION_MERGE_APP_ID, pem = process.env.MOTION_MERGE_APP_PRIVATE_KEY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo ?? '') || !/^\d+$/.test(id ?? '') || !String(pem).includes('PRIVATE KEY')) {
    fail('MOTION_MERGE_APP_ID and MOTION_MERGE_APP_PRIVATE_KEY are required for automatic merging.');
  }
  const jwt = appJwt(id, pem);
  const installation = await github(`/repos/${repo}/installation`, jwt);
  if (!Number.isSafeInteger(installation.id)) fail('The merge App is not installed on this repository.');
  const body = await github(`/app/installations/${installation.id}/access_tokens`, jwt, {
    body: {repositories: [repo.split('/')[1]], permissions: {contents: 'write', pull_requests: 'write', checks: 'read'}},
  });
  const problem = mergeTokenProblem(body, repo);
  if (problem) fail(problem);
  return body.token;
}

async function pullFiles(repo, number, token) {
  const files = [];
  for (let page = 1; page <= 3; page++) {
    const rows = await github(`/repos/${repo}/pulls/${number}/files?per_page=100&page=${page}`, token);
    files.push(...rows.map((file) => ({path: file.filename, status: file.status})));
    if (rows.length < 100) return files;
  }
  fail('GitHub did not list every file in the submission.');
}

const approved = (reviews, head) => reviews.some((review) => review.user?.login === 'github-actions[bot]'
  && review.state === 'APPROVED' && String(review.body ?? '').includes(`${MARKER}${head} -->`));

/** Merge a validated context and result with a one-repository installation token. */
export async function mergeSubmission(context, result, token) {
  if (process.env.OPENCODE_AUTO_MERGE !== 'true') return {merged: false, reason: 'disabled'};
  if (process.env.OPENCODE_AUTO_APPROVE !== 'true') return {merged: false, reason: 'approval disabled'};
  const repo = process.env.GITHUB_REPOSITORY;
  if (context.schema !== 1 || context.repo !== repo || !Number.isSafeInteger(context.number)) fail('Invalid merge context.');
  if (context.firstTime || result.verdict !== 'approve' || !result.imagesInspected || result.humanReview
    || result.findings.some((finding) => finding.severity === 'blocking')) return {merged: false, reason: 'approval gates'};
  const pr = await github(`/repos/${repo}/pulls/${context.number}`, token);
  if (pr.head?.sha !== context.head || pr.state !== 'open' || pr.draft) return {merged: false, reason: 'stale or closed'};
  const [files, runBody, reviews] = await Promise.all([
    pullFiles(repo, context.number, token),
    github(`/repos/${repo}/commits/${context.head}/check-runs?per_page=100`, token),
    github(`/repos/${repo}/pulls/${context.number}/reviews?per_page=100`, token),
  ]);
  if (!eligibleSubmission(pr, files, process.env.MOTIONHUB_BOT) || !checksReady(context.head, runBody.check_runs ?? [])
    || !approved(reviews, context.head) || changesRequested(reviews)) return {merged: false, reason: 'live gates'};
  // `sha` makes the merge conditional on the exact revision that was reviewed. A later push cannot be merged here.
  const current = await github(`/repos/${repo}/pulls/${context.number}`, token);
  if (current.head?.sha !== context.head || current.state !== 'open' || current.draft) return {merged: false, reason: 'head moved'};
  return github(`/repos/${repo}/pulls/${context.number}/merge`, token, {
    method: 'PUT',
    body: {
      commit_title: `Merge motion submission #${context.number}: ${context.title}`,
      commit_message: 'Reviewed and approved by OpenCode. Automatic merging uses a dedicated GitHub App.',
      merge_method: 'merge', sha: context.head,
    },
  });
}

export async function merge(contextPath, resultPath) {
  const context = JSON.parse(readFileSync(contextPath, 'utf8'));
  const result = validateAnswer(context, JSON.parse(readFileSync(resultPath, 'utf8')));
  if (process.env.OPENCODE_AUTO_MERGE !== 'true') return {merged: false, reason: 'disabled'};
  if (process.env.OPENCODE_AUTO_APPROVE !== 'true') return {merged: false, reason: 'approval disabled'};
  const token = await mintMergeToken();
  return mergeSubmission(context, result, token);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [contextPath, resultPath] = process.argv.slice(2);
  if (!contextPath || !resultPath) fail('Usage: node .github/scripts/motion-merge.mjs <context.json> <result.json>');
  merge(contextPath, resultPath)
    .then((result) => console.log(result.merged ? `Merged: ${result.sha}` : `Not merged: ${result.reason ?? 'requirements changed'}`))
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
