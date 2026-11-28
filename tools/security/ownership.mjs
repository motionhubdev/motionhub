// Shared hub policy. The motion format may describe several authors; this catalogue accepts exactly one.

/** An author's handle: `handle` since motion/0.7, `github` before it (SPEC.md §3), or undefined. */
export const handleOf = (author) => {
  const handle = author?.handle ?? author?.github;
  return typeof handle === 'string' ? handle : undefined;
};

export const singleAuthor = (manifest) => Array.isArray(manifest?.authors) && manifest.authors.length === 1
  && handleOf(manifest.authors[0]) !== undefined;

/** Resolve a recorded account. Authorization never guesses an account from a display name. */
export function accountId(login, accounts) {
  const id = typeof login === 'string' ? accounts?.get(login.toLowerCase()) : undefined;
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

export const ownerId = (manifest, accounts) => singleAuthor(manifest) ? accountId(handleOf(manifest.authors[0]), accounts) : undefined;

/** The sole author stays the same account across versions, including a GitHub rename. */
export function authorProblem(next, previous, accounts) {
  if (!singleAuthor(next)) return 'a motion on motionhub has exactly one author';
  if (!previous) return null;
  if (!singleAuthor(previous)) return 'the published authors need a maintainer to resolve the sole owner';
  const before = ownerId(previous, accounts), after = ownerId(next, accounts);
  if (accounts) {
    if (before === undefined || after === undefined || before !== after) return 'an update cannot change the author account; a renamed handle must be recorded with the same numeric id';
  } else if (handleOf(previous.authors[0]).toLowerCase() !== handleOf(next.authors[0]).toLowerCase()) {
    return 'an update cannot change the author; record both handles with the same account id for a rename';
  }
  return null;
}

/**
 * Whether `commit` (as GitHub's API gives one) is one motionhub's GitHub App made: authored by the app (`app`, its
 * <slug>[bot] account), committed by the app or by GitHub for it (web-flow: a commit made through GitHub's API has
 * GitHub as its committer), and verified by GitHub. motionhub.dev's Worker judges
 * the same commits with it (site/github-app.mjs), and ownership.yml through tools/check.mjs.
 */
export function appCommit(commit, app) {
  const committer = commit?.committer?.login;
  return Boolean(app) && commit?.author?.login === app && (committer === app || committer === 'web-flow')
    && commit.commit?.verification?.verified === true && commit.commit.verification.reason === 'valid';
}
