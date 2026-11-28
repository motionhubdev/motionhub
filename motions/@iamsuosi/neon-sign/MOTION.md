# Neon Sign

A dark brick wall at night with signs bent in glass tube. Before a sign is lit its tubes are visible as dim grey glass; then each letter or stroke stutters alight, once or twice, and holds, a white-hot core inside a coloured glow that spills onto the bricks. A lit sign hums a few per cent brighter and dimmer, slowly. Between scenes the whole wall is switched off and the next sign warms on out of the dark.

## Essence, and what it is not

- One wall for the whole film: rows of dark bricks, a vignette, and a pool of the sign's colour washed over them.
- Everything that reads is tube: words in a joined script or in upright capitals, and simple marks (a ring, a moon, a bolt, a star, an arrow, a wave, a heart). A tube is one continuous stroke of even thickness, never a filled shape.
- Light comes from the tubes only: the coloured pool on the wall follows the sign, and the wall goes black when it is switched off.
- Small grey standoffs hold tubes off the wall; a black cable runs from a sign down out of the frame. They are always there, lit or not.

Not Stage Light (a stage with one moving spotlight, condensed figures: here the light is the sign itself), not Night Diagram (a science diagram drawn in light lines), not a glitch or a screen: no scan lines, pixels, RGB split or digital flicker. Not a real business's sign either: no names, logos or slogans of anyone.

## Colour

- `mortar` `#0D0C11` and the bricks a shade above it: the wall. It is never lit by anything but the signs.
- `glass` `#34333D`: a tube that is off.
- `core` `#FFF6F9`: the middle of every lit tube.
- Gases, each a tube's colour, its glow and its pool on the wall: `pink` `#FF4FA8` for titles and names, `cyan` `#3FE6F5` for labels and frames, `amber` `#FFB43F` for figures, `red` `#FF5533` (pure neon's red-orange) for the one thing that warns or matters, `white` `#E9F0FF` for small lines and sources.
- At most two gases on the wall at once, and one pool of light. `metal` and `wire` are the fixings. `muted` is for captions only.

## Type

- Neonderthaw, a joined script drawn as one line, for titles, names and notes: 150 to 330 px. Its letters light one by one.
- Tilt Neon, upright tube capitals and figures, for labels, figures and small lines: 64 px for a source, 96 to 150 px for a label, 300 to 360 px for a figure.
- Chinese falls back to ZCOOL KuaiLe in both roles.
- A sign holds one to three words; a scene holds at most three lines.
- Captions are Tilt Neon at 38 px, pale `white` on a dark strip, so they read as part of the night.

## Motion

- **Lighting a sign**: over about 1.2 s the letters or strokes light in turn, left to right. Each one shows 0.07 s of light, goes dark for 0.13 s, then climbs to full; some stutter once more. A sign of several parts (frame, word, note, arrow; a mark and its name) lights part after part over 1.6 to 1.8 s.
- **Holding**: a lit sign never stands perfectly still and never blinks: its brightness swells and falls by 4.5 per cent over about 1.25 s.
- **Switching**: one click and the wall drops to near black at once; it stays dark for 0.2 s; then the next sign's tubes start their stutter as the wall's light returns over 0.4 s. Use it between scenes, never inside one.
- **Going dark**: at the close, lines go out one by one with one last stutter, until one is left lit.
- **Photosensitivity**: each tube stutters at most twice, each sign's parts light in turn rather than together, and the hum is slow and shallow, so the frame never flashes more than three times a second and never as a whole. Keep it that way: no strobing signs, no fast blinking arrows.
- Sound: a soft electric tick as a tube catches, a low transformer swell under a lit sign, a heavy switch click between scenes.

## Composition

A sign sits in the upper middle of the wall, with dark wall around it on every side: about a third of the frame lit, the rest night. A mark and its name stack in the middle; a figure sits a little below centre with its source under it; a boxed sign hangs left of centre on its two wires, its arrow pointing at what it names. Nothing below y 900, where captions go.

## Components

- **ground**: Brick wall at night (`react/parts/wall.tsx`): the bricks, the grit, and the pool of the sign's colour; its `lit` follows the sign's own.
- **title**: Neon word (`react/parts/tube.tsx`): one to three words in tube, script or block, stuttering on letter by letter. It also holds what every part shares: `Tubes` for any path, `Word`, `Fixings`, how a tube lights and hums.
- **open**: Neon mark (`react/parts/mark.tsx`): a simple mark from a few tube strokes, then its name lit under it. Fits: an opening sting; a series' mark; an end.
- **data**: Neon figure (`react/parts/digits.tsx`): a figure in upright tube with a small white line saying what it counts.
- **term**: Boxed sign (`react/parts/label.tsx`): a word in a rounded tube frame hung on two wires, a short note under it, an arrow pointing at what it names.
- **transition**: Switch off, switch on (`react/parts/switch.tsx`): the wall dark in one click, then the next sign warming on.
- **close**: Last light (`react/parts/last.tsx`): lines lit together going dark one by one, until one is left.

## Avoid

- A wall crowded with signs and colours. Fix: one sign, at most two gases, one pool of light.
- Filled letters or shapes. Fix: tubes are strokes; use the script or block face, or a path.
- Blinking for attention. Fix: a stutter only as a tube catches; the hum while it holds; nothing else flashes.
- Real names, logos or slogans of a business, or a sign that would pass for one. Fix: invented marks and plain words.
- Long sentences. Fix: one to three words a sign; split the sentence across switched scenes.
- A lit wall with no sign, or a sign whose colour does not match its pool. Fix: `Wall`'s `light` and `lit` follow the sign.

## Self-audit

Every sign is readable once lit; the dim glass shows before it lights; no more than three flashes a second anywhere; one pool of light, in the sign's colour; the fixings and cable are present; facts on the wall are true and sourced in the caption or credits.
