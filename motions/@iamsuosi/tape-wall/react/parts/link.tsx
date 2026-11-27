import {seededRandom} from '@motionhub/runtime';
import {lay} from './strip.tsx';

export const meta = {
  name: {en: 'Tape line', 'zh-CN': '胶带连线'},
  purpose: 'link',
  line: 'A thin line of coloured tape laid from one strip to another, in one straight run or with one turn, cut square at its ends with a small torn tab; teal for a link, vermilion for the one that matters.',
  fits: 'one idea leading to the next; a cause and its effect; this belongs to that',
  params: {
    from: {type: '[x, y]', doc: 'where it starts: the edge of a strip'},
    to: {type: '[x, y]', doc: 'where it ends: the edge of the next'},
    via: {type: '[x, y]', default: null, doc: 'one corner it turns at; straight without one'},
    tone: {type: 'link | key', default: 'link', doc: 'teal for a link; vermilion for the one that matters, once a wall'},
    draw: {type: 'progress', default: 1, doc: '0 to 1 over about 0.5 s: laid from its start'},
    width: {type: 'px', default: 14, doc: 'the tape\'s width'},
  },
  preview: 12.6,
};

type P = [number, number];

export function TapeLine({from, to, via = null, tone = 'link', draw = 1, width = 14}: {from: P; to: P; via?: P | null; tone?: 'link' | 'key'; draw?: number; width?: number}) {
  if (draw <= 0) return null;
  const pts = via ? [from, via, to] : [from, to];
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = lens.reduce((a, b) => a + b, 0);
  let left = lay(draw) * total;
  const segs: [P, P][] = [];
  pts.slice(1).forEach((p, i) => {
    if (left <= 0) return;
    const a = pts[i], k = Math.min(1, left / lens[i]);
    segs.push([a, [a[0] + (p[0] - a[0]) * k, a[1] + (p[1] - a[1]) * k]]);
    left -= lens[i];
  });
  const r = seededRandom(`${from}${to}`), color = `var(--color-${tone})`;
  const end = segs[segs.length - 1][1], last = segs[segs.length - 1], ang = Math.atan2(last[1][1] - last[0][1], last[1][0] - last[0][0]) * 180 / Math.PI;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {segs.map(([a, b], i) => <line key={`s${i}`} x1={a[0] + 2} y1={a[1] + 3} x2={b[0] + 2} y2={b[1] + 3} stroke="#000" strokeWidth={width} opacity={0.15} />)}
      {segs.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={width} opacity={0.95} />)}
      {draw >= 1 && <g transform={`translate(${end[0]} ${end[1]}) rotate(${ang})`}>
        <path d={`M-6 ${-width * 1.3}L${width * 1.6} 0L-6 ${width * 1.3}L${-2 + r() * 4} 0Z`} fill={color} />
      </g>}
    </svg>
  );
}
