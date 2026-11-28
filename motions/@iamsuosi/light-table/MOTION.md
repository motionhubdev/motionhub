# Light Table

A darkened room and a big light table. Pictures arrive as mounted transparencies, laid on the milky glow in card mounts with a word in grease pencil on each; they are compared side by side, the after is slid over the before, a loupe glides in to show one detail twice as large, and a red grease pencil circles what changed. Everything is lit from below.

## Essence, and what it is not

- The table is the frame: a dark room, a dark bevelled frame, and inside it an evenly lit, slightly cool white surface. Nothing floats in empty space; everything lies on the glass.
- Pictures are physical: a card mount round each, a soft shadow on the light, a slight tilt when laid down, a lift when moved.
- Marks are made by hand in waxy grease pencil: a loose circle, an arrow, a tick, a word or two. Red points at the change; green approves the after.
- One detail at a time: the loupe or a circle, never both on one slide at once.

Not Screen Desk (no app windows or devices), not Evidence Board (no felt, pins or string, no case to argue), not Red Pencil (no printed page being corrected). The closest is Red Pencil for marking by hand, but here the subject is pictures compared on light, not text.

## Colour

- `room` `#17191D` and `bezel` `#2B2E34`: the dark round the table, the table's frame, the loupe's rim.
- `glow` `#F5F7F1` falling to `haze` `#DCE3DA` at the edges: the lit surface.
- `mount` `#E8E2D3`: the card mounts and the tape titles are written on.
- `marker` `#1F2125`: grease pencil for labels and titles.
- `mark` `#D8382A`: red grease pencil for the one thing that changed, once a scene.
- `after` `#2E8F63`: green grease pencil for the word on the after and a tick.
- `muted` `#6C7068`: small printed notes on the frame.
- The pictures in the slides keep their own colours: the motion never tints them.

## Type

- Permanent Marker for everything written by hand: labels on mounts at 48 px, titles on tape at 64 px, notes beside marks at 46 px, the last line at 56 px. Short: one to four words.
- Barlow 600 for printed notes on the frame: 20 px, capitals, spaced 0.18 em.
- Chinese falls back to Noto Sans SC.

## Motion

- **The light** comes up in about 0.5 s with one flicker, as tubes do; it can be switched off at the end.
- **Laying a slide** takes 0.45 s: it drops 40 px, shrinks from 105 per cent to its size and its shadow tightens; the second slide follows half a beat later, its label written as it lands.
- **Sliding over**: the after slides across onto the before in 0.8 s, easing in and out, lifting a little on the way (its shadow grows, then settles).
- **The loupe** is set down in 0.3 s and glides to its detail in 1.4 s, easing in and out, magnifying about 2.2 times; it holds there at least a second, then is lifted away.
- **Grease pencil** marks draw on in about 0.4 s and their note is written in the next 0.25 s.
- **A contact strip** slides on from the left in 0.6 s; its frames are lit in turn, about 0.5 s each, the others dimmed.
- **Between scenes** the slides are pushed off one side and the next set pushed on from the other in 0.6 s; the table does not move.
- **The end**: one slide is left centred, the room darkens round it and one line is written under it.

## Composition

The table fills the frame with a 90 px dark margin. Two slides sit side by side at about a third of the frame each; a slide laid over sits in the middle. A tape title sits at the top, tilted a degree or two. A mark sits on the picture, its note in the clear light beside the slide. A strip runs across the middle with words under each frame. Captions sit at the bottom on a strip of the table's light with a red rule.

## Components

- **ground**: Light table (`react/parts/table.tsx`): the room, the frame and the lit surface, switched on and off.
- **compare**: Slide over (`react/parts/pair.tsx`): two mounted slides laid side by side, then the after slid over the before. Takes pictures or video `src`. Fits: any before and after.
- **term**: Loupe (`react/parts/loupe.tsx`): a loupe glides to one detail and magnifies it. Fits: the one detail that changed.
- **mark**: Grease pencil (`react/parts/pencil.tsx`): a circle, arrow, tick or underline with a word or two.
- **steps**: Contact strip (`react/parts/strip.tsx`): three to five frames lit in turn. Fits: stages of a change.
- **title**: Tape title (`react/parts/tape.tsx`): a title written on a strip of tape.
- **close**: Last slide (`react/parts/final.tsx`): one slide kept on the light, the room darkening, one line under it.

## Avoid

- Before and after that differ in framing. Fix: the same picture, the same crop; only the change differs.
- Marks everywhere. Fix: one red mark a scene, and the loupe or a circle, not both.
- Clean digital type for notes. Fix: grease pencil for anything written; Barlow only for the table's printed notes.
- Tinting the pictures with the table's colours. Fix: the slides show the pictures as they are; the light is behind them.
- Exaggerated afters. Fix: show the real change, labelled for what it is.

## Self-audit

Before and after share their framing; the mark lands on the change; the loupe holds long enough to read what it shows; every label is legible; the last slide holds at least 1.5 s.
