# Tape Wall

A concept worked out on a wall of brown kraft paper, the way a team works through an idea in a workshop. Each keyword is a strip of masking tape, torn off the roll, pressed on a little crooked and written on in black marker. Thin lines of teal tape run from one strip to the next to show how ideas connect; one vermilion line marks the link that matters. The key point is written on a white card pushed on with a red thumbtack. Earlier strips stay where they are. A new sheet of kraft comes down over the wall to start the next part.

## Essence, and what it is not

- Everything is a thing stuck to a wall: tape strips, tape lines, a tacked card. There is no drawn arrow, icon or diagram.
- Words are capitals in a marker hand, one to four words a strip.
- Three colours on the brown: cream tape, teal tape for links, vermilion for the one key link and the tack.
- The wall fills up as it is explained: nothing is erased or replaced within a wall.

Not Lab Notebook (no squared paper, no pen diagram), not Evidence Board (no dark felt, photographs or string), not Idea Map (no type on a layout sheet), not Marker Margin (it is not drawn over footage). It reads as hand-made and physical, not as a whiteboard or a slide.

## Colour

- `kraft` `#C39A6B`, with `kraftLight` `#D3AE82` and `kraftDark` `#9C774E`: the wall, its fibres and creases, lighter in the middle and darker at the edges.
- `tape` `#EEE3C4`: every keyword strip, and the four pieces at the corners of a sheet. Slightly translucent, lit along its top edge.
- `marker` `#1E1A17`: every word.
- `link` `#1F7F7A`: thin tape for connections, and the squares that number steps.
- `key` `#E2492E`: one link or underline a wall, and the thumbtack. Never a strip, never a word.
- `card` `#FBF8F1`: the tacked card, with faint blue rules.

## Type

- Permanent Marker, capitals, for every word on tape or a card: 60 px on a keyword strip, 100 to 130 px on a title strip, 40 px on a card. A strip is as long as its words plus about one and a third times their height; measured advances are in `strip.tsx`.
- Space Grotesk 600 for a small typed label at the top left of a wall (26 px, capitals) and the caption. Chinese falls back to Noto Sans SC.
- Two to four words a strip; a card holds two or three short lines.

## Motion

- **A strip** (about 0.85 s): the tape is laid from its left end in 0.3 s (`lay`, slowing as it is pressed), then the word is written on it left to right in 0.55 s.
- **A tape line** (about 0.5 s) is laid from the strip it leaves to the strip it reaches, in one run or with one corner; it is laid only once both ideas are spoken of, and the next strip goes up after it.
- **The card** swings on and its tack is pushed in (0.35 s), then its lines are written one after another.
- **Stepping back**: when a later idea arrives, earlier strips can grey a little (marker at 60 per cent); they never leave.
- **A new sheet** (0.5 s) comes down over the whole wall from above with a deep shadow, then its four corners are taped, one after another.
- Sound: the rip of tape, the scratch of the marker, a soft thump for a tack or a sheet.

## Composition

Keep 120 px clear inside the edges. A wall holds at most six strips: ideas flow left to right, then down. A title is two or three long strips stacked, offset from each other, with a vermilion underline. Steps run down the left side, each led by its number on a square of teal tape. The card sits in open space beside the idea it explains, never over a strip.

## Components

- **term**: Tape strip (`react/parts/strip.tsx`): tape laid and a word written on it. Fits: a keyword, a part of an idea.
- **link**: Tape line (`react/parts/link.tsx`): thin teal or vermilion tape from one strip to another. Fits: cause and effect, this leads to that.
- **mark**: Tacked card (`react/parts/note.tsx`): the key point on a white card with a red tack. Fits: the one thing to remember.
- **title**: Title strips (`react/parts/title.tsx`): a title on two or three long strips, underlined in vermilion. Fits: the question, a chapter, the last line.
- **steps**: Numbered strips (`react/parts/steps.tsx`): steps down the wall, each numbered on teal. Fits: a process, causes in order.
- **transition**: New sheet (`react/parts/sheet.tsx`): a fresh sheet of kraft comes down over the wall. Fits: the next part.
- **ground**: Kraft wall (`react/parts/wall.tsx`): the wall, with a sheet's corner tapes and a small label. Fits: under every scene.

## Avoid

- More than six strips on a wall: it turns into clutter. Fix: a new sheet for the next part.
- Long sentences on tape. Fix: a keyword on the strip, the sentence in the narration or on the card.
- Links nobody said. Fix: lay a line only for a connection the narration makes.
- Vermilion twice. Fix: one key link or underline a wall; everything else teal.
- Tidy, straight-edged, perfectly level tape. Fix: tear its ends and turn each strip a degree or three.
- Words fading in. Fix: tape is laid, then words are written.

## Self-audit

Every strip's words fit on its tape; every tape line starts and ends at a strip's edge; vermilion appears once a wall; strips never overlap each other or the card; the final wall is readable at phone size.
