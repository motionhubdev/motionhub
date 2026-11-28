# OpenCode + Kimi motion review

`../workflows/opencode-review.yml` reviews motion submissions opened by motionhub's GitHub App. It is not a general pull-request reviewer and never runs a submission's code.

## Repository configuration

1. Set the Actions variable `OPENCODE_ENABLED` to `true`.
2. Set `OPENCODE_MODEL` to a model from OpenCode's [provider catalogue](https://opencode.ai/docs/providers/). For Moonshot's China endpoint, for example: `moonshotai-cn/kimi-k3.1-pro`. For the global endpoint: `moonshotai/kimi-k3.1-pro`.
3. Add the matching Actions secret:
   - Moonshot API: `MOONSHOT_API_KEY`.
   - Kimi for Coding: `KIMI_API_KEY`, with a model such as `kimi-code-plan-cn/kimi-for-coding` (or the corresponding global provider).
4. Keep `MOTIONHUB_BOT` set to the exact login of motionhub's GitHub App, as `ownership.yml` already requires.
5. Initially leave `OPENCODE_AUTO_APPROVE` unset or `false`: the agent then leaves reviewer notes only. Set it to `true` only after the comment-only workflow has been observed on real submissions.

No OpenCode GitHub App installation or OIDC permission is needed. The workflow installs the pinned `@opencode/cli` release and uses the repository's own limited `GITHUB_TOKEN` only in the final publication job.

## What must hold before an automatic approval

- The pull request is open, not a draft, and comes from the configured App on a same-repository `share/` branch.
- Every changed path is under `motions/` or `accounts/`, with no symbolic links and at least one motion file.
- Both required jobs, `check` and `ownership`, are green on the exact head commit.
- The submitter already has an account record on main; a first submission always waits for a person.
- The model returned no blocking finding, inspected every submitted poster and preview, and asked for no human review.
- No maintainer has an outstanding `CHANGES_REQUESTED` review; a later approval or dismissal clears that gate.
- `OPENCODE_AUTO_APPROVE` is `true`.
- The publication job re-reads the live pull request and all of those conditions before it posts, and posts only once per head commit.

An approval is only a GitHub review: the agent never merges, and branch protection, code-owner review and maintainer judgment still apply. A failure in inference or publication fails the workflow rather than silently approving anything.

## Credential and prompt-injection boundaries

The context job has read-only repository, check and pull-request access. The inference job receives the model credential but no GitHub write token. The publication job receives a pull-request write token but no model credential. Checkout credentials are never persisted.

The checked-out submission is data. OpenCode's configuration denies shell, edit, external-directory, web, skill and subagent access; it allows only local reads, globs and grep. The model returns bounded JSON observations. `motion-review.mjs` validates them and alone chooses `COMMENT` or `APPROVE`; model output cannot select a GitHub event, mention users, or inject trusted markup.

See [OpenCode's CI documentation](https://opencode.ai/docs/cli/commands/#ci), [agent permissions](https://opencode.ai/docs/permissions/) and [Kimi provider identifiers](https://models.dev/) for the upstream configuration these files use.
