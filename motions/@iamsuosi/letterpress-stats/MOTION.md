# Letterpress Stats

A film printed on a hand press. Every word is wood or metal type: wooden sorts slide one by one into a composing line, the press comes down once, and the words are left bitten into thick cream cotton stock, the paper dark on one side of each stroke and lit on the other, the ink a little uneven where the roller did not take. Deep blue-black ink, and one vermilion for the single thing a sheet stresses.

## Essence, and what it is not

- One sheet at a time, cream and quiet, with generous margins: a broadside, a title page, a proof.
- Type you could touch. Every impression has depth (a shadow edge and a lit edge of paper) and a fine speckle in its ink. Nothing is flat or glossy.
- The set, then the press. Words are never typed or faded in: their sorts slide into place, light wood with the letter cut on the face, and the press turns them into ink in one beat.
- Two colours only: ink for everything, vermilion for one word, one figure or one ornament per sheet.

Not Riso Pop (no halftones, no second ink overprinting, no bright pink), not Red Pencil (nothing is marked up by hand), not Ink Scroll (no brush, no rice paper). The closest is Riso Pop for the warmth of print, but this is relief type pressed into paper, not stencilled ink on top of it.

## Colour

- `stock` `#F2EADA`: the sheet, all of the ground.
- `bite` `#D9CDB5` and `lift` `#FFF9EE`: the paper's own shadow and highlight round an impression, offset by about a fiftieth of the type's size. Never used as fills of their own.
- `ink` `#1E2433`: every word, figure, rule and ornament.
- `vermilion` `#C9412B`: the one thing a sheet stresses. Never two things on one sheet, never a background.
- `wood` `#C89B63` and `grain` `#A97B48`: only the wooden sorts before they print.
- `muted` `#6E6656`: folios, notes and the numbers of a list, small.

## Type

- Alfa Slab One for wood type: headlines and figures, in capitals. A headline line is sized to fill up to 1640 px of width, at most 230 px; a big figure up to 520 px. Sorts sit 0.03 em apart, like real blocks.
- Libre Caslon Text for metal type: labels and lists at 36 to 62 px, italic for sources, values and the colophon line; small capitals spaced 0.22 em for list headings, in vermilion.
- Chinese falls back to Noto Serif SC.
- A sheet holds one to three lines of wood type. Longer thoughts go into metal type.

## Motion

- **Set**: each sort slides in from about 420 px to the right, easing out over 0.28 s, 50 ms after the one before; a line of ten letters is set in about 0.8 s; lines are set one after another.
- **Press**: 0.22 s. The line grows 2 per cent and settles, the sorts lift a little and vanish, and the impression darkens into place (`kiss`). Everything set together is pressed together: one beat.
- **Rows** of a list print one by one, about 0.5 s apart, each with a small kiss.
- **Ornaments** are pressed in 0.4 s; a rule runs out from its leaf.
- **Feed**: a new sheet slides up from the bottom over 0.6 s, its edge casting a soft shadow, already printed with what comes next.
- Held sheets do not move: no drift, no zoom. The press lands on the beat when there is music.

## Composition

Margins of 140 px. A headline is centred, with an ornamental rule under it; a figure sits on the left with its unit beside it and its label between two rules; a comparison is two centred columns with a vermilion leaf between; a list is a centred column with dot leaders. Folios and notes sit small in the top corners. Captions are a strip of stock with a vermilion rule.

## Components

- **title**: Headline (`react/parts/press.tsx`): one to three lines of wood type, set and pressed, one word in vermilion. Fits: the claim a film opens on; a chapter title.
- **data**: Big figure (`react/parts/figure.tsx`): one number in wood type with a vermilion unit and a label between rules. Fits: a count, a year, a price.
- **compare**: Versus (`react/parts/versus.tsx`): two values in wood type over italic labels, pressed in turn. Fits: then and now; two counts.
- **steps**: Galley list (`react/parts/list.tsx`): numbered rows of metal type with dot leaders, printed in turn; a vermilion hand points at one. Fits: steps, contents, a ranking.
- **mark**: Ornament (`react/parts/ornament.tsx`): a brass rule with a leaf, a leaf alone, or a pointing hand.
- **close**: Colophon (`react/parts/colophon.tsx`): a small name pressed in the middle, a vermilion rule, one italic line.
- **transition**: Sheet feed (`react/parts/feed.tsx`): a new sheet fed over the last.
- **ground**: Stock (`react/parts/stock.tsx`): cream cotton with fibres, a soft edge and small corner notes.

## Avoid

- Flat type with no depth. Fix: every impression has its bite and lift edges, and its speckle.
- Typing or fading words on. Fix: set the sorts, then press.
- Vermilion everywhere. Fix: one word, figure or ornament per sheet.
- Too many words in wood type. Fix: three short lines at most; the rest in metal type.
- Smooth gradients, gloss or drop shadows on type. Fix: paper, ink and the impression only.
- Invented figures. Fix: real numbers, with their source in the label.

## Self-audit

Every word was set and then pressed; no sheet has more than one vermilion thing; each figure has its source; margins hold at 140 px; the colophon is held for at least 1.5 s.
