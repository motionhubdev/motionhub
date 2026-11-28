import {CANVAS, Speckle, span} from './press.tsx';

export const meta = {
  name: {en: 'Ornament', 'zh-CN': '花饰'},
  purpose: 'mark',
  line: 'A printer\'s flourish pressed into the sheet: a brass rule running out from a small leaf, or a vermilion pointing hand set against a line to mark it.',
  fits: 'between a headline and what follows; under a figure; pointing at the one row a list is about',
  params: {
    kind: {type: 'rule | hand | leaf', default: 'rule', doc: 'rule: two brass rules with a leaf between; hand: a pointing hand; leaf: the leaf alone'},
    at: {type: '[x, y]', doc: 'its middle (rule, leaf) or the tip of the finger (hand)'},
    width: {type: 'px', default: 900, doc: 'how long the rule runs'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 0.4 s: it is pressed in (the rule runs out from the leaf)'},
    accent: {type: 'boolean', default: false, doc: 'printed in vermilion instead of ink'},
  },
  preview: 3.0,
};

/** A small leaf, drawn about its centre, 1 unit tall */
const LEAF = 'M0 -0.5 C0.32 -0.32 0.34 0.12 0 0.5 C-0.34 0.12 -0.32 -0.32 0 -0.5 Z M0 -0.36 L0 0.42';
/** A pointing hand facing right, its fingertip at 0,0, about 1 unit long */
const HAND = 'M0 0 L-0.38 -0.07 Q-0.44 -0.1 -0.5 -0.12 L-0.62 -0.14 Q-0.72 -0.17 -0.86 -0.13 L-1 -0.1 L-1 0.2 L-0.86 0.22 Q-0.74 0.27 -0.62 0.24 L-0.48 0.22 Q-0.42 0.2 -0.44 0.15 L-0.52 0.13 Q-0.46 0.1 -0.5 0.06 L-0.56 0.05 Q-0.5 0.02 -0.52 -0.02 L-0.4 -0.03 L-0.02 0.04 Q0.04 0.02 0 0 Z';

export function Ornament({kind = 'rule', at, width = 900, show = 1, accent = false}: {kind?: 'rule' | 'hand' | 'leaf'; at: [number, number]; width?: number; show?: number; accent?: boolean}) {
  if (show <= 0) return null;
  const [x, y] = at, fill = accent ? 'var(--color-vermilion)' : 'var(--color-ink)', o = span(show, 0, 0.4), run = span(show, 0.3, 1);
  const deboss = (d: string, t: string, sw = 0) => (
    <g>
      <path d={d} transform={`translate(-2 -2) ${t}`} fill={sw ? 'none' : 'var(--color-bite)'} stroke={sw ? 'var(--color-bite)' : 'none'} strokeWidth={sw} />
      <path d={d} transform={`translate(2 2) ${t}`} fill={sw ? 'none' : 'var(--color-lift)'} stroke={sw ? 'var(--color-lift)' : 'none'} strokeWidth={sw} />
      <path d={d} transform={t} fill={sw ? 'none' : fill} stroke={sw ? fill : 'none'} strokeWidth={sw} filter="url(#lp-speckle)" />
    </g>
  );
  const half = (width / 2 - 50) * run;
  return (
    <svg {...CANVAS} opacity={o}>
      <Speckle />
      {kind === 'hand' && deboss(HAND, `translate(${x} ${y}) scale(150)`)}
      {kind !== 'hand' && deboss(LEAF, `translate(${x} ${y}) scale(42)`, 0)}
      {kind === 'rule' && run > 0 && (
        <g>
          {deboss(`M${x - 40} ${y} H${x - 40 - half}`, '', 5)}
          {deboss(`M${x + 40} ${y} H${x + 40 + half}`, '', 5)}
        </g>
      )}
    </svg>
  );
}
