# Typewriter Notes

A sheet of paper rising out of a typewriter, seen from the typist's chair. Words arrive one keystroke at a time, each letter a little uneven, and at every return the carriage slides back and the sheet feeds up a line. The phrase that matters is typed in the red half of the ribbon; the reader's thought is written in soft pencil in the margin; a finished sheet is pulled out, or stamped and filed.

## Essence, and what it is not

- One sheet on a dark walnut desk, its lower edge disappearing behind a black rubber platen at the bottom of the frame. The line being typed always sits just above the bail, at y 772; earlier lines have fed up above it.
- Everything on the sheet is monospaced type in one size. Emphasis comes only from the ribbon's red, a typed underline, capitals or a struck-out word, as a typewriter allows.
- Letters are struck, not faded: each lands at once, a touch large and dark, and settles. No two letters sit exactly alike.
- One hand-made thing per sheet besides the type: a pencil note with its arrow, or a red rubber stamp.

Not Red Pencil (a printed page marked up in red pen: here the page is being typed, and the red is ribbon), not Lab Notebook (a squared notebook where a diagram is drawn: here there are only words), not Ink Scroll (brush and rice paper). There is no screen, cursor or digital type: no blinking caret, no glow, no code font on a dark ground.

## Colour

- `desk` `#2A221C`: the walnut desk, the only ground. A vignette darkens its edges.
- `paper` `#F2ECDF`: the sheet, with a faint tooth.
- `ink` `#1F1C19`: the black half of the ribbon: every typed letter.
- `ribbon` `#B02A20`: the red half of the ribbon: one phrase a sheet, a tick, a total, and the stamp. Never a background, never more than a phrase.
- `pencil` `#5D5952`: graphite, for margin notes and their arrows only.
- `platen` `#121110` and `metal` `#A9A69F`: the machine's roller, bail and knobs.
- `muted` `#8C8478`: captions only. No other colour appears.

## Type

- Courier Prime at 42 px, 64 px line to line, 40 characters to the line, from x 456: the grid every typed part shares (`SIZE`, `LH`, `COLS`, `colX`, `lineY`). Headings are capitals centred by spaces and ruled with equals signs; a ledger runs dot leaders to a figure set right. Chinese falls back to Noto Serif SC.
- Reenie Beanie at 50 to 58 px for pencil notes: two to six words, tilted 3 to 5 degrees. Chinese falls back to Ma Shan Zheng.
- The stamp is Courier Prime Bold in capitals inside a double-ruled box.
- Captions, when a film has them, are typed too: Courier Prime 34 px bold on a paper strip with a red rule.

## Motion

- **Typing**: a letter is one keystroke, a space 0.6, a run of one key (an indent, a rule, a leader) 0.15 to 0.2. Read-aloud pace is about 14 keystrokes a second; a brisk reel types up to 30. A struck letter lands 8 per cent large and settles in one keystroke.
- **Return**: four keystrokes' time: the red type guide under the typing point slides back to the margin while the sheet feeds up one line (64 px).
- **Corrections**: `~word~` types the word, backs up, and strikes it through with x; `_word_` types it, backs up, and underlines it. Use one per sheet at most, for a real change of mind.
- **Pencil**: the note is written left to right over about 0.8 s, then its arrow is drawn in 0.4 s.
- **Stamp**: it comes down from above in 0.2 s and lands at once, at full ink; nothing bounces.
- **A new sheet**: the old one is pulled up and out in 0.45 s, quickening and tilting a degree, and a fresh one rolls up from behind the platen in 0.5 s, easing to a stop.
- Typing follows the narration: a line is typed while it is said, or just before. Nothing moves on a finished sheet: no drift, no zoom.

## Composition

The sheet is 1260 px wide, centred, its foot under the platen. A sheet holds a heading, a blank line and at most eight more lines; past that, pull it out and roll in a new one. The pencil goes in a blank line or a short line's empty end, never over type; the stamp goes in the top corner beside the heading.

## Components

- **ground**: Desk and platen (`react/parts/desk.tsx`): the walnut desk under everything (`layer="desk"`), and the platen, bail and knobs over the sheet (`layer="platen"`).
- **quote**: Typed block (`react/parts/typed.tsx`): lines typed keystroke by keystroke on their sheet, with red ribbon, strike-outs, underlines and leaders as inline marks. Fits: a quotation and its source; a note.
- **title**: Typed heading (`react/parts/title.tsx`): capitals centred and ruled with equals signs, then the lines under it. Fits: what a sheet is about; a chapter.
- **steps**: Typed checklist (`react/parts/checklist.tsx`): empty boxes typed in turn, then struck with a red x one by one. Fits: steps, habits, rules.
- **data**: Typed ledger (`react/parts/ledger.tsx`): names, dot leaders, figures set right, a rule and the total in red. Fits: a small account of real figures.
- **link**: Pencil note (`react/parts/pencil.tsx`): a few soft pencil words and an arrow to the typed word they are about.
- **close**: Rubber stamp (`react/parts/stamp.tsx`): a red stamp pressed on at an angle. Fits: a sheet filed, read, done.
- **transition**: Sheet out, sheet in (`react/parts/feed.tsx`): one sheet pulled out, the next rolled in.

## Avoid

- Too many lines on a sheet, so it feeds up past the frame. Fix: at most a heading and eight lines; then a new sheet.
- Red everywhere. Fix: one red phrase a sheet, or the total, or the ticks.
- Letters fading or sliding in. Fix: they are struck: present at once, settling in one keystroke.
- Pencil over type. Fix: a blank line or an empty line end; the arrow runs between lines.
- A quotation changed to fit. Fix: type it as written and say where it is from; a strike-out shows a typist's slip, never a change to the author's words.
- Typing faster than it can be read in a film with narration. Fix: about 14 keystrokes a second, the line typed as it is said.

## Self-audit

Every quotation and figure matches its source, which is typed or captioned; the line being typed sits just above the bail; one red phrase or total per sheet; pencil never covers type; a finished sheet holds still while it is read.
