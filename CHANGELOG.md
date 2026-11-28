# Changelog

## 0.12.0

- `status` shows your shares waiting to be submitted, submission history, open pull requests, both required checks, the reviewer workflow, the latest review decision and concrete reviewer feedback. `status <id>` selects one motion, `status --pr <number>` reads a pull request after it closes too, and `--json` returns the records for tools. It uses the same motionhub.dev login as `publish`, with no GitHub token.

## 0.11.0

Breaking change. A motion belongs to a motionhub account, and its author is named by a handle (`motion/0.7`).

- The format is `motion/0.7`: an author is `{"name", "handle"}` and `scope` is a handle on the hub that holds the motion. A motion at `motion/0.6` or earlier is read as before, its `github` read as the handle.
- `init` writes a `motion/0.7` motion scoped to the account `motionhub login` signed in, or to `--handle <handle>`. `--github` is removed, and `init` no longer asks `gh`.
- `publish` no longer asks GitHub about an author that is not recorded yet: motionhub.dev records the submitter's account with the pull request. Sign in to motionhub.dev once before publishing a first motion, so the handle is yours.
- `@motionhub/cli/hub` no longer exports `githubAccount` or `githubUser`.
- `share` is now `publish`, and `private push`, `private list` and `private delete` are now `upload`, `list` and `delete`: one word for keeping a motion for yourself, one for making it public. The old names say the new ones and run nothing.
- Signed in with `login`, at a terminal, `publish` lists the files, asks you to certify the DCO, and opens the pull request at once, with no link or code. Without a terminal (an agent), or with a sign-in from before this version, it gives the link as before; `login` again to share from the terminal.
- In the catalogue, only the pull request motionhub.dev opens records an account, and only its submitter's, once. A pull request opened by hand records none. An account id may be one motionhub.dev issues, above any GitHub gives.

## 0.10.0

Breaking change. `motionhub share` submits only through motionhub.dev.

- `share --pr` is removed. It forked `motionhub-dev/motionhub` with the author's own GitHub token and opened a pull request from that fork. Those pull requests fail the `ownership` check, which does not check out fork code. Run `motionhub share <dir>`, open the link, and sign in with GitHub. motionhub's GitHub App opens the pull request from a `share/` branch.
- `share --github` is removed. `motionhub check <dir> --author <login>` runs the checks as that account without uploading.
- `share` still needs no git, `gh` or GitHub token. `--wait` still waits for the pull request.
- `@motionhub/cli/hub` no longer exports `share` or `forkOf`. `shareLink` is the submission.
