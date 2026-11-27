# Index Cards

A how-to told on a stack of ruled index cards laid on a linen cloth. Each step is one card: a big slab number on its corner, one short instruction, and a line drawing in two colours drawn on as you watch. When a step is done the top card is flicked off the stack and the next one rises; coloured tabs down the stack's edge say how far along you are. Tips are dealt beside it on smaller cards, the right and wrong way on a pair, and the last card gets a round stamp.

## Essence, and what it is not

- Real cards on a real desk: cream stock, a red line under the top margin, blue rules, a soft shadow, a slight turn when laid down.
- One step, one card, one drawing. The drawing is two colours of line, navy for the subject and terracotta for the one part that matters, and it is drawn stroke by stroke.
- Progress is physical: tabs down the stack's right edge, green when done, terracotta for now, cream to come.
- Nothing on a card is a photograph or an interface.

Not Lab Notebook (no squared page, no diagram worked out by hand), not Origami (no 3D sheet), not Screen Desk (no device). The closest is Lab Notebook for drawn lines on paper, but here each step is its own card in a stack, and the drawing is a two-colour illustration, not a worked diagram.

## Colour

- `linen` `#D8D0BF` with `weave` `#C7BEAB`: the desk, softly lit from the top left.
- `card` `#FBF8F0`, `rule` `#A9C1DA`, `margin` `#DE8B80`: the index card, its blue rules and its red top line.
- `ink` `#24324A`: every word and the subject's lines.
- `accent` `#D2693C`: the step number, the part of a drawing that matters, the current tab, the cross on a wrong way and the stamp.
- `done` `#4F7F62`: a done tab and the tick on a right way.
- `muted` `#7C7465`: small notes, "step 2 of 5", the desk's corner note.

## Type

- Zilla Slab 700: step numbers at 84 px in terracotta, titles at 74 px, card headings at 46 to 58 px.
- Karla: the instruction at 50 px bold, under seven words; notes at 34 to 38 px; small capitals at 26 px spaced 0.16 em.
- Chinese falls back to Noto Serif SC and Noto Sans SC.

## Motion

- **A card is laid** in about 0.4 s: it slides in, turns a degree or two and its shadow settles.
- **A drawing** is drawn on over about 0.9 s once its card is on top: the pot or the object first, then the subject, then the terracotta detail, then any arrow or drops.
- **A flick**: the top card leaves up and to the right in 0.5 s, accelerating and turning about 24 degrees; the card beneath rises to the top in the last 0.35 s and its tab turns terracotta while the last one turns green.
- **A tip card** is dealt in from the right in 0.4 s, turning as it comes, and leaves the same way.
- **Do and don't** cards are dealt one after the other, then a tick and a cross are drawn over their corners.
- **The stamp** comes down from half again its size in 0.3 s and lands slightly tilted.
- Hold each card long enough to read its line twice: two to three seconds.

## Composition

The stack sits a little left of centre with its tabs to the right; a tip card overlaps its lower right corner. On a card, the number and "step n of N" sit top left, the instruction under them on the left, the drawing on the right. A title card sits in the middle with a paper clip; the done card the same, its stamp on the lower right corner. Captions are a strip of card with a terracotta rule.

## Components

- **title**: Title card (`react/parts/title.tsx`): what the how-to makes and what you will need.
- **steps**: Step stack (`react/parts/stack.tsx`): the stack, one step a card, flicked away in turn, with tabs for progress.
- **term**: Note card (`react/parts/card.tsx`): a word or tip with a short meaning and a small drawing, dealt beside the stack.
- **compare**: Do and don't (`react/parts/tip.tsx`): two cards, a tick and a cross.
- **mark**: Rubber stamp (`react/parts/stamp.tsx`): a round stamp with one word.
- **close**: Done card (`react/parts/done.tsx`): the finished result and a stamp.
- **ground**: Linen desk (`react/parts/desk.tsx`): the cloth the cards lie on.

## Avoid

- Long instructions. Fix: seven words or so a card; the rest goes in narration or a tip card.
- More than six steps. Fix: split the how-to into chapters, each with its own title card.
- Drawings in many colours or filled flat. Fix: two colours of line; terracotta for the one part that matters.
- Cards that fade in or cut. Fix: lay, flick and deal them like cards.
- Steps out of their real order, or advice that is not true. Fix: follow the real method.

## Self-audit

Steps are in their real order; each card is held long enough to read twice; the tabs match the card on top; the drawing shows the action of its step; the done card shows the finished result and holds at least 1.5 s.
