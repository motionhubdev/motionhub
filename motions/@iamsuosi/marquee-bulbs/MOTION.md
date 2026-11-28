# Marquee Bulbs

A theatre sign on a street at night. Words and figures are spelled in round bulbs on a 5 by 7 grid, warm amber against dark glass, inside a brass-edged panel framed by a row of chasing lights. A word never fades: a sweep runs across the sign from the left, switching the old bulbs off and the new ones on. Painted enamel plates carry the small words.

## Essence, and what it is not

- Every important word is made of bulbs. Unlit bulbs stay visible as dark glass inside each letter's cell, so the grid of the sign is always there.
- Light has a source: each lit bulb has a hot core, an amber rim and a soft halo, and the sign throws a faint warm spill on the wall and pavement.
- Small words are painted, in a theatre face, on cream enamel plates with a brass edge. They are never made of bulbs.
- One accent: ruby bulbs for the one word or figure that matters.

Not Stage Light (no spotlight and no condensed type in shadow: here the words are the light), not Pixel Quest (no game screen, no pixels: round lamps with glow), not a neon sign (no tubes, no script). The nearest in this catalogue are those two; this one is a street sign, lit lamp by lamp.

## Colour

- `night` the ground; `pavement` a darker band along the foot of the frame; `spill` the sign's warm light on the wall, always faint (at most a fifth).
- `panel` the sign's painted board; `brass` and `brassDeep` its edges and rules.
- `amber`, `amberDeep` and `filament`: a lit bulb, from rim to hot heart, and its halo. Every bulb word is amber.
- `ruby`, `rubyDeep`: the one word or figure that matters. Never two on a sign, never for decoration.
- `glass`, `glassLight`: unlit bulbs.
- `plate`: enamel plates and the closing plaque; the words painted on them are `panel`.
- `muted`: anything in the sans off the sign.
- No blue, no white light, no gradient skies.

## Type

- **Bulbs** for words and figures: the motion's own 5 by 7 font (`FONT` in `react/parts/bulbs.tsx`): A–Z, 0–9 and . , ! ? ' - : / & % +. A letter is five bulbs wide with one empty column between letters. A line holds up to about twelve characters; its bulbs are spaced 24 to 46 px and shrink to fit the width they are given. Capitals only.
- **Limelight** for painted plates (34 to 52 px, capitals, spaced 0.1 em) and the closing name (about 104 px).
- **Josefin Sans** 600 for the plaque's line and captions, 36 px. Chinese falls back to Noto Sans SC; Chinese words go on plates, never in bulbs.

## Motion

- **A word switches on** in about 1 s: a front sweeps from left to right, each bulb warming over about 0.12 s as it passes. Switching to a new word is the same sweep: old bulbs go out a few columns ahead of the new ones coming on.
- **The frame chases** at five steps a second at most: two bulbs of every three burn and the dark one walks round. The overall brightness never changes, so the chase never flashes.
- **A figure counts** to its real value over about 1.2 s, slowing as it lands; its digits keep the width of the final figure.
- **An arrow lights** from tail to tip in about 0.8 s, then a slow run of light travels along it towards what it points at.
- **A sign comes on** with its frame lighting round from the top left in about 0.8 s, before its words.
- **Between scenes** the lights go down from left to right and the next scene comes up the same way, in about 0.6 s.
- **Photosensitivity:** nothing flashes. No bulb blinks on and off faster than three times a second, and the whole frame is never switched on and off at once except in the slow 0.6 s lights-down. Do not strobe the chase or flash words on the beat.
- Hold a lit word at least 1.2 s.

## Composition

The sign is the frame's subject: a panel about 1640 by 620 px a little above the middle, or two smaller signs side by side for a comparison. A painted plate sits above a word or under a figure; an arrow comes in from outside the sign. Keep 120 px of dark street around the sign and the pavement visible at the foot.

## Components

- **title**: Bulb word (`react/parts/bulbs.tsx`): a word or short line in bulbs, switched on or over to the next in a sweep. Fits: an opening title; the word a scene is named by.
- **steps**: Billing (`react/parts/billing.tsx`): a fixed phrase on a plate and one bulb word switched item after item. Fits: a list told one at a time; what is on.
- **data**: Bulb figure (`react/parts/figure.tsx`): a number in large bulb digits counting to its value, with a painted label. Fits: the one figure a scene is about.
- **link**: Bulb arrow (`react/parts/arrow.tsx`): an arrow lit from tail to tip, light running along it, a word on a plate. Fits: pointing at what a sentence names.
- **compare**: Double bill (`react/parts/pair.tsx`): two small signs side by side; the losing one dims. Fits: then and now; this or that.
- **close**: Closing plaque (`react/parts/close.tsx`): an enamel plaque with a name and a line, ringed by bulbs. Fits: the last seconds.
- **transition**: Lights down (`react/parts/lights-down.tsx`): dark from left to right, then the next scene up.
- **ground**: Night street (`react/parts/night.tsx`) and Marquee (`react/parts/board.tsx`): the street with its spill, and the sign with its chasing frame.

## Avoid

- Long words in bulbs: past twelve letters the bulbs get too small to glow. Fix: put the sentence on a plate and one word in bulbs.
- Fading words in and out. Fix: sweep them on and over.
- Ruby everywhere. Fix: one ruby word per sign.
- Blinking or strobing lights. Fix: a steady chase with constant brightness; a slow lights-down.
- Real blur filters for glow: they make the frame slow to draw. Fix: the halo is a radial gradient.
- A sign crammed to its edges. Fix: leave the grid's dark glass around the words.

## Self-audit

Every bulb word is readable at half size; no more than one ruby word on a sign; nothing flashes faster than three times a second; every figure is the real one; the closing plaque is held still for at least 1.5 s.
