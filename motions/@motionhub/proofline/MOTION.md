# Proofline

A precise editorial canvas where mathematical objects, notation, and graphs stay visibly connected as an idea is constructed. Its signature is the proofline: a thin semantic connector between a symbol and the region, point, length, or feature it describes. Mathematics is shown as a system of meanings and transformations, never as decorative notation.

## Essence

- A bright, neutral ground with crisp vector geometry, generous empty space, and a local coordinate grid only where it aids the explanation.
- Two coordinated representations usually share the frame: a mathematical object on the left and its symbolic reading on the right. A connector makes their relationship explicit.
- Every animated change has mathematical meaning: constructing an object, tracing a function, changing a parameter, preserving an invariant, or approaching a limit.
- One active relation holds attention at a time. Previously constructed elements remain visible and still unless the current operation changes them.
- The frame feels like a carefully designed mathematics journal or museum panel, but not a page from a specific publication.

Proofline is not Lab Notebook: it has no notebook sheet, handwriting, pen texture, punched holes, or red result box. It is not Drafting Table: it uses a bright editorial ground rather than a blueprint and explains general mathematics rather than mechanisms. It is not Idea Map: its links connect mathematical representations and quantities, not a network of conceptual terms.

## Colour

Every colour comes from `tokens.json` and has a fixed semantic role.

- `ground`: the entire canvas. No photographic texture, vignette, or coloured gradient.
- `ink`: headings, axes, essential body copy, and primary labels.
- `construct`: geometric objects, function curves, principal mathematical terms, and the persistent course or chapter marker.
- `active`: the one relation currently being explained. Use it for the active term, its corresponding regions or line, the proofline, and its endpoint. Never use it as general decoration.
- `compare`: a second representation or a preceding state that must remain distinguishable from the active result, such as a secant beside a tangent.
- `muted`: dimension lines, secondary notes, axis values, and non-essential metadata.
- `grid`: dividers and coordinate grids only. It never represents data or a mathematical object.

Filled mathematical regions use `construct` at 5–9% opacity or `active` at 12% opacity over `ground`. Do not introduce extra tints by eye. Use `active` for strokes, connectors, and type at least 48 px. Small essential text remains `ink`; `muted` is reserved for non-essential metadata and secondary lines, so readability never depends on orange, teal, or grey contrast. Colour is always reinforced by a label, position, line style, or shape.

Only the local background grid may fade through an alpha mask. No glows, drop shadows, bevels, lens effects, or multicolour gradients.

## Type

- `display` is Manrope, falling back to Segoe UI and then sans-serif. Use it for headings, body copy, captions, and short explanatory phrases.
- `math` is STIX Two Math, falling back to Cambria Math and then serif. Use it for every variable, expression, equation, coordinate, and numerical mathematical label.
- `label` is IBM Plex Mono, falling back to Consolas and then monospace. Use it for chapter metadata, view names, short semantic annotations, and component labels.

At 1920 × 1080:

- Main heading: 72–84 px, weight 600, line height 1.05–1.12, with slight negative tracking. One or two lines at most.
- Subtitle and secondary explanation: 27–32 px, line height 1.3–1.4.
- Display equation: 52–96 px. Break long working at relation operators; never shrink a derivation to fit one line.
- Graph and geometry labels: 23–32 px. Essential coordinates remain at least 23 px.
- Monospace metadata: 17–20 px with 1.4–2.2 px tracking. Keep it short and non-essential.
- Caption: 30–32 px, line height 1.1, one line preferred. Two lines are allowed only after measuring that the complete cue fits inside the 84 px caption band.

Headings use sentence case. Metadata may use uppercase. Do not use handwritten faces, faux blackletter, outline type, or a different face to make a formula look decorative. Build superscripts, fractions, and aligned relations as real mathematical structures rather than rotating or scaling a whole text box.

## Motion

Timing uses seconds and the named tokens; frames are derived from the composition's frame rate.

- `enter` (0.45 s): a heading, label, or symbolic term arrives with opacity 0 → 1 and a 12 px upward settle, using `arrive`. A mathematical object does not bounce.
- `construct` (0.9 s): a geometric segment, boundary, or dimension draws in the order a learner would construct it, using `transform`.
- `trace` (1.2 s): a function curve draws from left to right in its domain. A point that moves on the curve follows the actual function values.
- `connect` (0.55 s): a proofline draws from the active symbol toward its mathematical referent. The endpoint appears last. A branch draws only when one term refers to more than one region or feature.
- `transform` (0.8 s): a point, parameter, or shape changes continuously using `transform`. Preserve object identity and keep the relevant invariant or dependent value visible.
- `settle` (0.35 s): a completed relation comes to rest. Hold the finished frame long enough for the spoken explanation; the narration determines that hold, not a fixed scene duration.

Use `arrive` for arrivals, `transform` for constructions and mathematical changes, and `leave` only when an element must exit. Linear timing is reserved for constant-rate parameter motion when the mathematics requires it.

The camera is fixed. Use a clean cut for a new idea rather than a decorative pan, zoom, spin, or parallax move. Do not use springs, overshoot, elastic easing, or floating transitions. Once a construction is complete, it remains still unless the current operation acts on it.

Motion follows the words that name the operation: draw the object on the noun, connect the symbol when its meaning is stated, and transform the object when the change is described. Optional sound is quiet and functional: a soft draw, connect, or land cue, never a cinematic whoosh.

## Composition and framing

- Design at 1920 × 1080 with a 96 px outer safe margin. Scale proportionally for other 16:9 outputs.
- The persistent header occupies the top 96 px. A course or subject marker sits at the left and a short chapter label at the right.
- A heading normally begins at x = 96 with its baseline near y = 190; its subtitle sits near y = 238. The main explanation begins below y = 300.
- In a dual view, the visual representation occupies approximately x = 150–900 and the symbolic view x = 1030–1824. Keep the centre clear enough for connectors to read as intentional paths.
- Use a 40 px local grid behind a construction when useful, faded toward its edges. A plotted function instead uses its own true coordinate grid and axes.
- The caption band begins at y = 996. Keep mathematical drawings above y = 950 and out of the caption band.
- A proofline is 2.5–3 px with rounded ends and a 6–7 px endpoint. Route it through empty space, avoid unrelated labels, and never cross an unrelated connector.
- Leave at least 24 px between unrelated labels and lines. Do not fill empty space merely because it is available.

## Treatments

### Opening question

Show one mathematical relationship that invites a question about pattern, change, equivalence, or invariance. The question is the only large text. Construct just enough of the object to make the question legible.

### Dual representation

Place a geometric object, area model, number line, or graph on the left and its notation on the right. Establish the object first, then reveal the corresponding symbols, then draw the active proofline. Keep one relation active.

### Construction

Build points before segments, segments before regions, and dimensions before dependent quantities. Labels arrive beside the features they name. The final construction remains visible for inspection.

### Transformation and invariant

Move one parameter or point along its valid domain. Keep the fixed quantities visually stable while dependent values update from the same underlying model. State the invariant or resulting relation without adding a decorative result badge.

### Approaching a limit

Show a valid sequence of secants, approximations, partitions, or estimates. Keep the current approximation in `compare` and the limiting object or value in `active`. At the limit, transition to the limiting object; never evaluate an expression at a value where it is undefined.

### Representation path

Use a short horizontal or vertical sequence for representations, reasoning stages, or course modules. Advance one stage at a time and leave the completed path readable. The words and number of stages are props of the film, not fixed by the motion.

### Takeaway

Return to the central mathematical relationship, reduce the frame to its essential object and notation, and let the final spoken idea land. A film may add its own course title or call to action; none is built into the motion.

## Components

- **ground** — Coordinate field (`react/parts/coordinate-field.tsx`): a local grid with configurable bounds and spacing, faded into the ground. Fits constructions and representations that need a coordinate field rather than a full-page grid.
- **link** — Proofline tether (`react/parts/tether.tsx`): a cubic connector with configurable symbol and referent points, optional control points, semantic colour, and drawing progress. Fits one symbol-to-feature relation; use two branches only for a shared relation such as two areas forming one like term.
- **data** — Triangle invariant (`react/parts/triangle-invariant.tsx`): a fixed-base triangle with a clamped moving apex, perpendicular height, and invariant area fill. Fits shearing, area, and change-versus-invariance explanations.
- **data** — Area model (`react/parts/area-model.tsx`): a positive `(x + a)(x + b)` model using one shared scale on both axes, with independent construction, label, and like-term combination progress. Fits expansion, factorisation, multiplication, and algebraic representation.
- **data** — Quadratic change (`react/parts/quadratic-graph.tsx`): a model-derived quadratic, secant, moving point, rise/run construction, and limiting tangent with equal data scales. Fits average and instantaneous rate of change and introductory derivatives.

All parts take their mathematical values and progress as props. They import only React, relative files, and the shared deterministic model in `react/math.ts`; colours and faces come only from the motion's CSS tokens. No part contains a course title, narration, scene list, or call to action. The film supplies progress values using the duration and easing tokens.

## Avoid

- Do not turn the look into a notebook, chalkboard, whiteboard, blueprint, or hand-drawn worksheet.
- Do not use floating formulas, mathematical symbols as confetti, decorative rotations, or motion that does not express the explanation.
- Do not reveal a complex finished diagram all at once when its construction is the explanation.
- Do not hardcode a curve, intersection, slope, area, or dependent label independently from its mathematical model. Derive all of them from the same values.
- Do not show a secant at zero separation, divide by zero at a limit, distort a graph's scale to make a slope look correct, or use an invalid geometric transformation.
- Do not use more than one `active` relation in a frame. A branch belonging to that same relation is allowed.
- Do not rely on colour alone, use `grid` for data, or add colours to mark unrelated categories.
- Do not put long prose in the mathematical canvas. Keep labels short and let narration carry sentences.
- Do not use small orange essential text, low-contrast captions, dense derivations, or labels that collide at 1280 × 720.
- Do not add a logo, institution, course title, module list, spoken line, or call to action to reusable components.

## Freedom in each work

Each film chooses its own mathematical content, domain, layout density, representations, narration, captions, and ending. It may emphasize geometry, algebra, functions, or introductory calculus; use a single view or dual view; and build one continuous construction or several independent explanations. The subject, values, labels, and component parameters change. The semantic colour roles, exact type system, mathematical motion rules, and proofline behaviour do not.

## Self-audit

- Check every colour, face, duration, and easing against `tokens.json`; no approximated values.
- Read Essence and Avoid against every finished frame, including the opening and closing frames.
- Verify that each symbol has a visible meaning and each proofline ends on the correct mathematical referent.
- Recompute all displayed quantities from the model used to draw them. Check limiting cases and invalid domains.
- Confirm that only one relation is active and that the viewer can understand it without colour alone.
- Inspect at 1920 × 1080 and 1280 × 720 for type size, collisions, connector routing, and caption clearance.
- Play with narration and confirm that construction, connection, and transformation land on the corresponding words.
- Confirm that reusable components contain no film-specific words, values, story, scene list, end card, network access, storage, or nondeterministic randomness.
- Compare the result with Lab Notebook, Drafting Table, and Idea Map; the differences named in Essence must remain obvious.
