import {seededRandom} from '@motionhub/runtime';
import {tornEdge} from './receipt.tsx';

export const meta = {
  name: {en: 'Chit', 'zh-CN': '纸条'},
  purpose: 'term',
  line: 'A short torn-off piece of thermal paper dropped on the counter at a slight angle: a word in bold capitals and what it means in two or three printed lines.',
  fits: 'a term defined; a unit explained; an aside next to the main receipt',
  params: {
    term: {type: 'text', doc: 'the word, short'},
    lines: {type: 'text[]', doc: 'what it means, two or three short printed lines'},
    at: {type: '[x, y]', doc: 'the chit\'s top left corner'},
    width: {type: 'px', default: 440, doc: 'its width'},
    angle: {type: 'degrees', default: -4, doc: 'how it lies'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 0.35 s: dropped from a little above, settling flat'},
  },
  preview: 9.6,
};

export function Chit({term, lines, at, width = 440, angle = -4, show = 1}: {term: string; lines: string[]; at: [number, number]; width?: number; angle?: number; show?: number}) {
  if (show <= 0) return null;
  const s = Math.min(1, show), h = 118 + lines.length * 40, r = seededRandom(term);
  const drop = (1 - s) ** 2, rot = angle + (1 - s) * 6 * (r() > 0.5 ? 1 : -1);
  const edge = (y: number, d: number) => tornEdge(0, width, y, `${term}${y}`, d);
  return (
    <div style={{position: 'absolute', left: at[0], top: at[1] - drop * 60, width, height: h, opacity: Math.min(1, s * 3), transform: `rotate(${rot}deg) scale(${1 + drop * 0.06})`, transformOrigin: '50% 50%'}}>
      <svg width={width + 20} height={h + 30} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M${edge(10, 1)}L${width} ${h - 4}L0 ${h - 4}Z`} transform={`translate(${8 + drop * 20} ${10 + drop * 30})`} fill="#000" opacity={0.3 - drop * 0.2} />
        <path d={`M${edge(0, 1)}L${width} ${h - 10}L0 ${h - 10}Z`} fill="var(--color-paper)" />
        <text x={28} y={66} fontSize={42} fontWeight={700} fill="var(--color-ink)" style={{fontFamily: 'var(--font-mono)'}}>{term.toUpperCase()}</text>
        <line x1={28} x2={width - 28} y1={86} y2={86} stroke="var(--color-ink)" strokeWidth={2} strokeDasharray="8 7" opacity={0.7} />
        {lines.map((l, i) => <text key={i} x={28} y={128 + i * 40} fontSize={27} fill="var(--color-ink)" opacity={0.88} style={{fontFamily: 'var(--font-mono)', whiteSpace: 'pre'}}>{l}</text>)}
      </svg>
    </div>
  );
}
