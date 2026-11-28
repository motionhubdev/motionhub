// Submission progress and reviewer feedback from the command line, through the same signed-in account as publish.
// motionhub.dev reads public GitHub state; the credential only selects the caller's own submission records.
//
//   motionhub status [--json]                 waiting shares, submission history and open review details
//   motionhub status <@scope/slug> [--json]   the newest share for one motion, with its pull request's details
//   motionhub status --pr <number> [--json]   one pull request, including after it was closed or merged
import {parseArgs} from 'node:util';
import {api, asSignedIn} from './artifact-cli.mjs';
import {ID} from './check.mjs';

const USAGE = 'usage: motionhub status [<@scope/slug>] [--pr <number>] [--json]';
const NEXT = {change: 'needs your change', checks: 'waiting for the checks', maintainer: 'waiting for a maintainer', draft: 'draft'};
const REVIEW = {approved: 'approved', changes: 'changes requested', commented: 'reviewer notes', pending: 'not reviewed yet'};
const get = (path) => asSignedIn((token) => api(path, 'GET', token));
const printJson = (value) => console.log(JSON.stringify(value, null, 2));

function printFeedback(feedback) {
  for (const item of feedback ?? []) {
    console.log(`\n  ${item.author}${item.state ? ` · ${item.state.toLowerCase()}` : ''} · ${item.at}`);
    console.log(item.body.split('\n').map((line) => `    ${line}`).join('\n'));
    if (item.url) console.log(`    ${item.url}`);
  }
}

function printPull(pr) {
  console.log(`\nPR #${pr.number}  ${pr.title}`);
  console.log(`  ${pr.motions?.join(', ') || 'No motion paths reported'} · ${NEXT[pr.next] ?? pr.next}`);
  const runs = pr.checkRuns?.length
    ? pr.checkRuns.map((run) => `${run.name}: ${run.status === 'completed' ? run.conclusion : run.status}`).join(' · ')
    : pr.checks;
  console.log(`  Checks: ${runs}`);
  console.log(`  Review: ${REVIEW[pr.review] ?? (pr.reviewed ? 'reviewer notes' : 'not reviewed yet')}`);
  console.log(`  ${pr.url}`);
  printFeedback(pr.feedback);
}

function printShare(share) {
  const state = share.status === 'withdrawn' ? 'withdrawn' : share.state ?? 'submitted';
  console.log(`${share.motion}  ${share.version}  ${state}${share.pr ? `  PR #${share.pr}` : ''}`);
  if (share.prUrl) console.log(`  ${share.prUrl}`);
}

/** The command line for `motionhub status`: its args after `status`. Returns the process exit status. */
export async function statusCli(args) {
  let values, positionals;
  try {
    ({values, positionals} = parseArgs({args, options: {pr: {type: 'string'}, json: {type: 'boolean'}}, allowPositionals: true}));
  } catch { console.error(USAGE); return 2; }
  const [id, ...extra] = positionals;
  if (extra.length || (id && values.pr) || (id && (!ID.test(id) || !id.startsWith('@'))) || (values.pr && !/^[1-9]\d{0,8}$/.test(values.pr))) {
    console.error(USAGE); return 2;
  }
  if (values.pr) {
    const pull = await get(`/api/me/pulls/${values.pr}`);
    if (values.json) printJson({pull}); else printPull(pull);
    return 0;
  }
  if (id) {
    const shares = await get('/api/me/shares');
    const matches = [...shares.waiting, ...shares.submitted].filter((share) => share.motion === id);
    if (!matches.length) throw new Error(`No submission for ${id} belongs to this account. Run motionhub status to list yours.`);
    const share = matches[0];
    const pull = share.pr ? await get(`/api/me/pulls/${share.pr}`) : null;
    if (values.json) printJson({share, pull});
    else {
      if (share.url) console.log(`Check and submit: ${share.url}`);
      printShare(share);
      if (pull) printPull(pull);
    }
    return 0;
  }
  const [pulls, shares] = await Promise.all([get('/api/me/pulls'), get('/api/me/shares')]);
  if (values.json) { printJson({...shares, ...pulls}); return 0; }
  for (const share of shares.waiting) {
    console.log(`${share.motion}  ${share.version}  waiting for you to submit`);
    console.log(`  Check and submit: ${share.url}`);
  }
  for (const share of shares.submitted) printShare(share);
  for (const pull of pulls.pulls) printPull(pull);
  if (!shares.waiting.length && !shares.submitted.length && !pulls.pulls.length) console.log('No submissions yet: motionhub publish <dir>');
  else if (!pulls.pulls.length) console.log('\nNo open pull requests. Use motionhub status <@scope/slug> to read a closed one.');
  return 0;
}
