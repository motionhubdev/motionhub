# Snapshot Line

Square instant prints pegged along a string across a deep teal plaster wall. The film is told one print at a time: the string is pulled, the prints travel and swing on their pegs, and the one that comes to rest in the middle grows a little, develops from flat grey to its picture, and has its caption written by hand on its deep bottom edge.

## Essence, and what it is not

- A string across the frame, sagging a little, with wooden pegs and prints hanging from it. The middle print is the one being talked about: about a fifth larger than the others, in front.
- Each print is a white border with a deeper bottom edge, a square picture in flat drawn shapes (no photographs, no people), and a hand-written caption on the edge.
- Pictures develop: flat grey, a warm flush, then the picture. Only the print in the middle develops; prints already seen stay developed, prints not yet seen stay grey.
- Things hang and swing. A print never slides in a straight line on its own: it is carried by the string, lags as the string starts and swings past as it stops.

Not Evidence Board (no felt, no case file, no red string between items), not Watercolor Tale (no painted book), not a scrapbook or collage (no tape, no cut-outs, no overlapping layers): one string, one row of prints, one wall.

## Colour

- `wall` the ground, with a faint `daylight` wash from the top left and a soft vignette.
- `string` the string; `wood`, `woodDeep` and `spring` the pegs.
- `paper` the prints' borders and the title set on the wall; `undeveloped` a print before it develops.
- `tag` the little paper tags under prints, and the hand-written line on the wall.
- `ink` hand-written captions and words on tags.
- `pen` the red pen ring round the one print that matters. One ring per scene, never more.
- The picture colours (`sky`, `rainSky`, `dusk`, `sun`, `sea`, `seaDeep`, `leaf`, `leafDeep`, `stone`, `earth`, `earthLight`) belong inside prints only, never on the wall.

## Type

- **Young Serif** for titles set directly on the wall, in `paper`: about 120 px, one or two lines, tight leading.
- **Nanum Pen Script** for everything written by hand: captions on a print's edge (sized to fit, at most 15 per cent of the print's width; three or four words), and the line under a title (about 84 px, in `tag`). Chinese falls back to LXGW WenKai.
- **Karla** 700 for tags under prints: a number, a date, a share, 34 to 40 px.

## Motion

- **The string is pulled** from one print to the next in about 1.1 s, slow at both ends (`pull`).
- **A print swings**: it leans about 7 degrees against the pull while the string moves, then swings past and settles over about 2.4 s, each print at a slightly different rate.
- **The middle print** grows to about 1.2 times as it arrives. Once still, it **develops** in about 1.2 s, and its **caption is written** from the left over about 0.8 s, starting 0.6 s in. Hold it at least 1.6 s after that.
- **A red ring** is drawn round one print in about 0.5 s, after its caption.
- **A title** rises in over about 0.4 s while a print drops onto its peg beside it and swings.
- **Between scenes** the whole wall slides away to the left and the next slides in from the right, in about 0.7 s.
- **The close**: one print comes towards the viewer until it fills the height of the frame, and the last words are written on its edge.
- Nothing fades in on its own except the faint flush of developing; nothing bounces.

## Composition

The string runs across the top third, sagging to about 90 px lower at the middle. The middle print sits at the centre; neighbours are about 540 px apart and run off the frame's edges. Tags hang under prints. A title sits on the left with one print hanging on a short string to its right. Keep the lower third quiet: the wall is the breathing room.

## Components

- **term**: Snapshot (`react/parts/print.tsx`): one print with its picture, developing, and its hand-written caption; a red ring. Fits: the one thing a sentence names.
- **steps**: Snapshot line (`react/parts/line.tsx`): prints along a string, pulled one at a time, swinging, the middle one developing and captioned, tags under them. Fits: a list told one point at a time; a timeline with dated tags.
- **title**: Title with a print (`react/parts/title.tsx`): a serif title on the wall, a hand-written line, a print on a short string. Fits: an opening question; a chapter.
- **compare**: Two prints (`react/parts/pair.tsx`): side by side with captions and tags; one ringed in red. Fits: this against that.
- **close**: Into the print (`react/parts/fill.tsx`): a print comes forward to fill the frame's height, the last words on its edge.
- **transition**: Pull through (`react/parts/pull.tsx`): the wall slides away to the left.
- **ground**: Wall (`react/parts/wall.tsx`): teal plaster with daylight.

Pictures available: sun, cloud, rain, wave, mountain, moon, tree, leaf, cup, house, flower, star. Draw others in the same way: a 100 by 100 box of flat shapes in the picture colours, no outlines, no gradients.

## Avoid

- Captions that are sentences. Fix: three or four words on the print; say the rest.
- Developing every print at once. Fix: only the one in the middle develops, when it stops.
- Prints that slide stiffly. Fix: carry them on the string and let them swing.
- Photographs or people in prints. Fix: flat drawn pictures.
- More than one red ring. Fix: ring the one print that matters.
- Filling the wall. Fix: one string, the lower third left bare.

## Self-audit

Every caption reads at half size; only the middle print develops; each print is held at least 1.6 s once captioned; one red ring per scene; every figure on a tag is a real one with a source.
