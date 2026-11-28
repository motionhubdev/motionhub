# Turn a project's look into a motion

A film you made already has a look: its colours, its faces, how things arrive and leave. This page is how an agent
takes that look out of the project and writes it down as a motion, so the person can use it again in any film, keep it
for themselves on motionhub.dev, or publish it for everyone. It needs no install: any agent that can read a URL and run
`npx` can follow it.

```text
Read https://motionhub.dev/docs/extract.md, then turn this project's look into a motion and upload it for me
```

Ask for `upload` to keep it for yourself, at once and with no review, or for `publish` to make it public. The rest of
this page is for the agent.

## The rules that hold throughout

- **The look, never the film.** A motion holds no story, script, scenes, timings, end card, logo or words of the film it
  came from (SPEC.md §1). Take what any film in this look would share, and leave the rest in the project.
- **Write only in `./motions/<slug>/`.** Never change the person's project: read it.
- **Their work, their licences.** Every face and asset the motion keeps is named in `CREDITS.md` with its licence.
  Leave out anything whose licence you cannot name, and say so. A brand, a logo or another tool's look is never taken.
- **Ask before anything leaves the machine.** Show the person the motion and its file list, and run `upload` or
  `publish` only with their yes. `publish` makes every file public. Its DCO certification is the person's own: you
  never answer it, type a share's code, or submit on their behalf.

## 1. Find the look

Read the project and note where each kind of value lives. Look first for the one place a project keeps its look (a
theme, tokens, CSS custom properties), then in the scenes themselves.

| Project | Colours and faces | Durations and curves | Pieces worth keeping |
| --- | --- | --- | --- |
| Remotion | a `theme.ts`, constants, `style` props, `@remotion/google-fonts` loads | `interpolate` ranges in frames (÷ fps for seconds), `Easing.bezier(...)`, `spring` configs | the components the compositions repeat |
| OpenMotionStudio (`film.tsx`) | the film's theme and its motion's tokens (`motions/`) | the layers' timing and easing | its own components |
| HyperFrames, GSAP, HTML and CSS | `:root` custom properties, stylesheets | `transition`, `animation`, `@keyframes`, GSAP `duration` and `ease` | the elements a timeline animates again and again |
| A video only | sample the colours from frames; name the faces if you can recognise them, else ask | time the cuts and moves | none: write the words and tokens only |

The project may already have a motion of its own (`MOTION.md` at its root, `motion/MOTION.md`, or `motions/<name>/`).
Then start from it: it is the look written down already, and the job is to make it a whole motion.

## 2. Keep what repeats

A value belongs to the look when it recurs, or when changing it would make the film look like something else. A value
used once, for one scene, belongs to the film. Collapse near-duplicates (`#1B2A47` and `#1C2B48`) into one, and give
each value a name by its role, not its appearance: `ground`, `ink`, `accent`, `muted`; `display`, `body`; `enter`,
`exit`; `arrive`, `leave`.

## 3. Write the motion

```sh
npx @motionhub/cli login                 # once: signs the command line in; its handle becomes the motion's scope
npx @motionhub/cli init <slug>           # ./motions/<slug>/ with every required file to fill in
```

`<slug>` is 3 to 40 characters of `a-z`, `0-9` and single hyphens, named for the look (`night-diagram`), not the film.
Then fill in, in this order:

1. **`tokens.json`**: the values from step 2, as W3C design tokens. Colours as `{colorSpace, components, hex}` under a
   `color` group with `$type: "color"`; faces as stacks under `font` (`$type: "fontFamily"`); durations as
   `{value, unit}` under `duration`; curves as `[x1, y1, x2, y2]` under a `cubicBezier` group. Each with a
   `$description` of its role. The file `init` writes shows each form.
2. **`MOTION.md`**: the look in words, for an agent that has never seen the film, in five sections, in this order:
   **Essence** (what makes a frame read as this look at a glance, and what it is easily confused with), **Colour**
   (what each token is for, and what is never coloured), **Type** (each face's role, sizes, how words sit in the
   frame), **Motion** (how things arrive, change and leave; durations in seconds and the curves by name; what never
   moves) and **Avoid** (the mistakes this look invites, and what to do instead). Numbers where numbers matter. No
   sentence about this film's subject.
3. **`motion.json`**: `name` and `line` (one concrete sentence: what it looks like and what it is for), `tags`,
   `license` (`CC-BY-4.0` and `MIT` unless the person chooses another the hub accepts), and `fit`: `for`, the subjects
   and kinds of film it suits, and `not`, what it handles badly. Be honest: a look made for one subject says so.
4. **`CREDITS.md`**: every face and asset, with its source and licence. Faces with an open licence only (SIL OFL,
   Apache 2.0, Ubuntu Font Licence).
5. **`poster.jpg`**: one frame of the person's film that shows the look, not a title card: a JPEG 960 to 3840 pixels
   wide, at most 500 KB. Take it from their engine (Remotion: `npx remotion still <composition> poster.jpg
   --frame=<n> --image-format=jpeg`; OpenMotionStudio: a still of the film), or ask them for one.

That is a whole motion. Components are optional and make it far more useful; add them when the project has pieces
worth keeping.

## 4. Make its components (optional)

Rework the pieces that repeat into `react/parts/<Name>.tsx`, one component a file (SPEC.md §12):

- It imports only `react`, `@motionhub/runtime`, `three` and files by a relative path. In a Remotion project, replace
  `useCurrentFrame()` and `useVideoConfig()` with `useTime()` from `@motionhub/runtime`, and `interpolate` and `Easing`
  with the runtime's own.
- Colours are `var(--color-<token>)` and faces `var(--font-<token>)`: no hex value or face name in the code.
- What changes from film to film arrives as props: the words, the numbers, the progress (`0` to `1`), a video's `src`.
  Nothing of this film's story stays in it.
- It exports a literal `meta`: `name`, `purpose` (one of `title`, `open`, `close`, `data`, `compare`, `steps`, `term`,
  `link`, `quote`, `mark`, `transition`, `ground`), `line`, `fits`, `params` (each with `type` and `doc`) and
  `preview`.
- Time comes from `useTime()` and randomness from `seededRandom`, so a frame draws the same every time. No network,
  `eval`, timers on strings, storage or cookies: the checks refuse them.
- A picture of each in `react/previews/<Name>.jpg`.

Optionally `react/reel.tsx`, at most 30 seconds, composing the components to show the look's range: the motion's page
plays it.

## 5. Check it

```sh
npx @motionhub/cli check motions/<slug>
```

Fix every issue it names and run it again until it prints `0 issue(s)`. Then read `MOTION.md` once more as a stranger
would, and put a frame of the person's film beside `poster.jpg`: the same ground, the same colours in the same roles,
the same faces.

## 6. Upload or publish

Show the person the motion: its `line`, `fit`, the tokens, the components, and the file list. Then, with their yes:

```sh
npx @motionhub/cli upload motions/<slug>     # for them alone: kept at once on motionhub.dev, no review
npx @motionhub/cli publish motions/<slug> --wait   # for everyone: reviewed, then listed
```

`upload` keeps it in their account; any project of theirs takes it back with `npx @motionhub/cli get @<handle>/<slug>
--private`. `publish` runs the checks its pull request will run and prints a link and a code: give both to the person
exactly as printed. They open the link, sign in, check the motion, type the code and certify the DCO, and the pull
request opens under their name; `--wait` then prints its address. Run at their own terminal and signed in, `publish`
asks them there instead. Published motions are reviewed for originality and for being a look rather than a film
([Share a motion](../CONTRIBUTING.md)).

To change it later, edit `./motions/<slug>/`, raise `version` in `motion.json`, and `upload` or `publish` again.
