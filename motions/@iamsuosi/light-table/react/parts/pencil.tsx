import {CANVAS, Scrawl, Stroke, hand} from './table.tsx';

export const meta = {
  name: {en: 'Grease pencil', 'zh-CN': '油性笔记号'},
  purpose: 'mark',
  line: 'A mark in waxy red grease pencil drawn on the glass over a slide: a loose circle round the change, an arrow to it, a tick in green, with a word or two written beside it.',
  fits: 'pointing at what changed; naming it in two words; approving the after',
  params: {
    kind: {type: 'circle | arrow | tick | underline', default: 'circle', doc: 'the mark'},
    at: {type: '[x, y]', doc: 'its centre (circle, tick), its point (arrow) or its start (underline)'},
    size: {type: 'px', default: 120, doc: 'the circle\'s radius, the arrow\'s length, the tick\'s height or the underline\'s length'},
    note: {type: 'text', default: '', doc: 'a word or two written beside it'},
    side: {type: 'left | right', default: 'right', doc: 'which side the note and the arrow\'s tail sit on'},
    draw: {type: 'progress', default: 1, doc: '0 to 1 over about 0.6 s: the mark is drawn, then the note written'},
    seed: {type: 'string', default: 'm', doc: 'changes the hand\'s wobble'},
  },
  preview: 8.6,
};

type Props = {kind?: 'circle' | 'arrow' | 'tick' | 'underline'; at: [number, number]; size?: number; note?: string; side?: 'left' | 'right'; draw?: number; seed?: string};

export function Pencil({kind = 'circle', at, size = 120, note = '', side = 'right', draw = 1, seed = 'm'}: Props) {
  const [x, y] = at, dir = side === 'right' ? 1 : -1;
  let d = '', nx = x + dir * (size + 30), ny = y;
  if (kind === 'circle') {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 26; i++) { const a = -2.2 + (i / 24) * Math.PI * 2.15; pts.push([x + Math.cos(a) * size * 1.25, y + Math.sin(a) * size * (0.85 + 0.04 * Math.sin(i))]); }
    d = hand(pts, seed, 5);
    nx = x + dir * (size * 1.25 + 30); ny = y - size * 0.7;
  } else if (kind === 'arrow') {
    const tx = x + dir * size, ty = y - size * 0.55;
    d = hand([[tx, ty], [x + dir * size * 0.45, y - size * 0.55], [x + dir * 12, y - 6]], seed, 3)
      + ` M${x + dir * 40} ${y - 34} L${x + dir * 6} ${y - 4} L${x + dir * 46} ${y + 4}`;
    nx = tx + dir * 20; ny = ty + 14;
  } else if (kind === 'tick') {
    d = hand([[x - size * 0.4, y], [x - size * 0.1, y + size * 0.35], [x + size * 0.5, y - size * 0.5]], seed, 3);
    nx = x + dir * size * 0.8;
  } else {
    d = hand([[x, y], [x + size * 0.5, y + 4], [x + size, y - 2]], seed, 3);
    nx = x + size + 24; ny = y + 10;
  }
  const color = kind === 'tick' ? 'var(--color-after)' : 'var(--color-mark)';
  return (
    <svg {...CANVAS}>
      <Stroke d={d} p={Math.min(1, draw / 0.65)} color={color} width={kind === 'circle' ? 9 : 10} />
      <Scrawl text={note} x={nx} y={ny} size={46} p={(draw - 0.6) / 0.4} color={color} anchor={side === 'right' ? 'start' : 'end'} rotate={-3} />
    </svg>
  );
}
