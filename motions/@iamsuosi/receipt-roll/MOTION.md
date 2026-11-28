# Receipt Roll

Figures told as a till receipt. On a dark matte counter, a strip of warm-white thermal paper rises out of a printer's black mouth one line at a time: a heading, items with dotted leaders running to their values, rules, and a total under a double rule. A blue ballpoint loops the one line that matters. When the list is done, the strip is torn off and lifted away, and the next print starts from a fresh torn edge.

## Essence, and what it is not

- One object at a time: a vertical strip of paper, centred, coming up out of the mouth at the bottom of the frame. The paper grows; it is never placed.
- Every character is monospaced, so leaders, columns and totals line up like a real receipt. Print is a soft thermal black, a little uneven from line to line.
- Two colours do all the work: the paper and its print. The only other colour is the ballpoint's blue, used once a scene.
- Things move only as a receipt does: rising out of the mouth, torn off, a chit dropped on the counter.

Not Red Pencil (no printed page or margin notes; the pen only loops, ticks or underlines), not Plumb Line (no cut paper or depth), not Stage Light (no spotlight, no condensed numerals). Not a spreadsheet or a dashboard: no grid, no bars, no charts.

## Colour

- `desk` `#34363A` with `deskGrain` `#40434A`: the counter, a soft pool of light where the paper comes out, darker at the corners.
- `paper` `#F6F3EC`: every receipt, stub and chit. `paperShade` `#E4DED2`: the slight curl at the paper's sides.
- `ink` `#2C2C30`: all print, rules and the bar pattern. Each line is printed at 84 to 100 per cent, so the print looks thermal, not digital.
- `faded` `#97938A`: small print and the dots of a leader.
- `pen` `#2443B5`: the ballpoint. One stroke per scene, on paper only; never print, never a background.
- `slot` `#17181B` with `slotEdge` `#55585E`: the printer's mouth and its lit lip.
- No other colour: no red totals, no green ticks, no highlighter.

## Type

- Courier Prime for every printed character: 38 px for items, 1.6 times that, bold, for a heading or title line, about 0.72 times that for small print. It advances 0.6 em a character, so a line holds `(width − 112) / (0.6 × size)` characters: about 28 on the default 760 px strip.
- An item is `label ...... value`: the dots fill the line, in `faded`. Totals are bold. Headings are centred capitals.
- Work Sans only for a caption off the paper. Chinese falls back to Noto Sans SC.

## Motion

- **Printing**: the paper rises out of the mouth at about one line per 0.16 to 0.22 s, steadily (`feed`). A line appears as it clears the mouth, never by fading or typing letter by letter.
- **The pen**: once the line it marks is out, a loop around it, a tick in its left margin or an underline is drawn in about 0.5 s, with a hand's small wobble, overshooting its start a little.
- **A chit** drops onto the counter beside the receipt in 0.35 s, from a little above and turned, settling flat with its shadow closing in.
- **Tearing off**: the strip is torn at the mouth and lifted up and out of the frame in about 0.55 s, turning a few degrees and gathering speed (`tear`); a fresh torn edge is left in the mouth.
- Sound follows the print: a printer's chatter while paper rises, a scratch for the pen and the tear.
- Nothing else moves: no camera, no zoom, no drift while a receipt is held.

## Composition

The mouth sits at y 990, across the bottom of the frame; the strip rises from it, centred, 760 px wide, and a long list can reach the top. Two receipts sit side by side, 720 px each, with their lines level. A chit lies to the right of the strip, never over its print. A caption, if any, sits on the counter at the bottom left, off the paper.

## Components

- **data**: Receipt (`react/parts/receipt.tsx`): the strip rising line by line, with headings, items and leaders, rules, a bar pattern, a total; one line may be marked; it can be torn off. Fits: specs, prices, the parts of a whole.
- **mark**: Ballpoint (`react/parts/pen.tsx`): one loop, tick or underline, drawn in half a second. Fits: the one line a scene is about.
- **title**: Title stub (`react/parts/stub.tsx`): a short receipt whose print is the title in large bold capitals. Fits: the opening question; a chapter title.
- **compare**: Two receipts (`react/parts/pair.tsx`): two printers print the same list for two things, line for line. Fits: this against that; two units.
- **term**: Chit (`react/parts/chit.tsx`): a torn-off piece dropped on the counter with a word and what it means. Fits: a term defined, an aside.
- **transition**: Tear-off (`react/parts/tear.tsx`): the strip torn off and lifted away. Fits: from one list to the next.
- **close**: Last stub (`react/parts/close.tsx`): stars, a name in large capitals, one line, the bar pattern. Fits: the end.
- **ground**: Counter (`react/parts/desk.tsx`): the dark matte counter and its pool of light. Fits: under every scene.

## Avoid

- Lines longer than the strip holds: they collide with the leader. Fix: count characters; shorten the label, not the value.
- A list of twenty items: the strip runs out of the frame. Fix: about ten lines a receipt; tear off and print the next.
- Pen on everything. Fix: one stroke a scene, on the line the narration names.
- Colour in the print (a red total, a green value). Fix: bold, a double rule, or the pen.
- Fading or sliding a receipt in. Fix: it rises out of the mouth; it leaves by being torn off.
- Invented prices or figures dressed as real. Fix: real values, with their source in the small print.

## Self-audit

Every item's leader reaches its value without touching it; totals add up; the pen marks the line the narration names and only that one; the print never runs off the top of the frame while it is read; each receipt is torn off before the next starts.
