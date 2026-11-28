# Enamel Pins

A promo told in collectible pins. On a board of deep green felt, stitched round its edge, hard-enamel pins are pressed in one at a time: simple shapes in flat, glossy enamel inside raised gold outlines. Words are set in dark enamel on ribbon-shaped banner pins, figures on round badges. Each pin comes down from a little above, gives into the felt, settles, and a band of light runs across its enamel. A fresh felt sheet slides over to move on; the end is the name pressed onto a backing card.

## Essence, and what it is not

- Everything that carries meaning is a pin: a raised metal outline, a flat enamel fill, a soft highlight, a shadow on the felt. Nothing is printed on the felt itself but a small stitched note.
- Two to four pins a board, generous felt around them; each turned a few degrees, never in a grid.
- Gold metal, five enamels, one dark enamel for words. The felt is always the same deep green.
- Pins arrive by being pressed, one after another; they never slide, bounce in place or spin.

Not Clay World (no 3D modelling, no clay, no tabletop scene), not Riso Pop (no print, no halftone), not a sticker sheet: there is no white die-cut border, no paper and no peeling; outlines are raised metal and shadows fall softly on fabric.

## Colour

- `felt` `#23423B` and `feltLight` `#2E554B`: the board, lighter in a pool a little above the middle.
- `stitch` `#E9DFC7`: the dashed stitching round the board and along a sheet's leading edge; the small corner note.
- `gold` `#C99A3F`, `goldLight` `#F3D98C`, `goldDark` `#7E5E22`: the metal, lit from the top left. Silver (`#B8BEC6` family) only for a small accent pin.
- Enamels: `cherry` `#D2404D` (the loudest, one pin a board), `butter` `#F2C94C`, `mint` `#86D1B0`, `lilac` `#B49AE3`, `cream` `#F6ECD7` (the ground of banners and badge faces).
- `ink` `#2A1F1C`: dark enamel for every word and figure on a pin.
- `card` `#E8DAC0` and `cardInk` `#5A4636`: the backing card and what is printed on it.
- No gradients in enamel: it is flat, with one soft highlight and a passing glint.

## Type

- Lilita One for every word and figure set in a pin, sized to the pin: a banner's words fill about 80 per cent of its height (measured advance about 0.5 em a character); a badge's figure fills its face.
- Rubik 500 to 600 for what is not enamel: the corner note (28 px, capitals, spaced 0.16 em), the backing card's line (40 px) and its small print, captions.
- Chinese falls back to Noto Sans SC. Two short lines at most on a banner; a figure and one or two words on a badge.

## Motion

- **Press** (0.35 s): a pin appears a quarter larger, lifted, its shadow far and soft; it comes down (`press`), its shadow closing in, gives slightly into the felt with a darker dimple under it, and settles.
- **Glint** (0.45 s): just after the press, a narrow band of light crosses the enamel diagonally.
- **Order**: pins on a board are pressed 0.25 to 0.4 s apart, the main one (a banner or badge) first or last, decorations between.
- **A felt sheet** (0.6 s) slides in from the right over the board, carrying the next scene's pins, its stitched leading edge casting a shadow (`slide`).
- **The close**: the backing card slides up from below, the name's banner is pressed onto it, then its line appears.
- Held pins stay still. The sound is a soft thump and click for each press and a small chime for a glint.

## Composition

A margin of 80 px inside the stitching. The main pin sits a little left of or on centre and takes a third to half of the frame's width; decoration pins sit toward the corners. A row of three or four pins runs across the middle with small banners under them. A caption, if any, sits on a cream pill at the bottom.

## Components

- **mark**: Pin (`react/parts/pin.tsx`): one pin in eight shapes (flower, hex, drop, leaf, bolt, cloud, moon, circle), pressed and glinting. Fits: emblems, decoration.
- **title**: Banner pin (`react/parts/banner.tsx`): words in dark enamel on a notched ribbon pin. Fits: a title, a claim, a name.
- **data**: Number badge (`react/parts/badge.tsx`): a round pin with a figure and a word inside a gold ring. Fits: one figure.
- **steps**: Pin row (`react/parts/row.tsx`): three or four pins with small banners, pressed in turn. Fits: benefits, steps, parts.
- **compare**: Badge pair (`react/parts/pair.tsx`): two badges with a small silver VS pin. Fits: this against that.
- **close**: Backing card (`react/parts/card.tsx`): the card slides up, the name pin is pressed onto it. Fits: the end.
- **transition**: Felt sheet (`react/parts/sheet.tsx`): a new sheet slides over from the right. Fits: between boards.
- **ground**: Felt board (`react/parts/felt.tsx`): the stitched green felt. Fits: under every scene.

## Avoid

- Too many pins: a cluttered board reads as merchandise, not a message. Fix: two to four pins, one main.
- Long words on a banner. Fix: two or three words a line, two lines at most.
- Pins in a grid at right angles. Fix: turn each a few degrees, vary their sizes.
- Cherry everywhere. Fix: one cherry pin a board; the rest butter, mint, lilac or cream.
- Real logos, mascots or brand marks as pins. Fix: simple shapes of your own, or a word.
- Fading pins in. Fix: press them, one at a time.

## Self-audit

Every word on a pin is inside its outline and readable at phone size; no two pins overlap; each board has one main pin and at most one cherry; figures are real; the backing card's name is held for at least 1.5 s.
