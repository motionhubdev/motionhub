import {Tubes, Word, type Gas} from './tube.tsx';

export const meta = {
  name: {en: 'Boxed sign', 'zh-CN': '框形招牌'},
  purpose: 'term',
  line: 'A small sign hung on two wires: one word in upright tube inside a rounded tube frame, a short line of script under it, and a tube arrow pointing at what it names.',
  fits: 'naming a thing as it is said; a term and its few-word gloss; pointing at part of the picture',
  params: {
    word: {type: 'text', doc: 'one word, in capitals'},
    note: {type: 'text', default: '', doc: 'a few words under it, in script tube'},
    at: {type: '[x, y]', default: [760, 460], doc: 'the frame\'s centre'},
    color: {type: 'pink | cyan | amber | red | white', default: 'cyan', doc: 'the word\'s and the frame\'s gas'},
    noteColor: {type: 'pink | cyan | amber | red | white', default: 'pink', doc: 'the note\'s gas'},
    arrow: {type: 'left | right | none', default: 'right', doc: 'which way the arrow points, from the frame\'s side'},
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 1.6 s: frame, word, note, arrow'},
  },
  preview: 17.2,
};

export function Label({word, note = '', at = [760, 460], color = 'cyan', noteColor = 'pink', arrow = 'right', on = 1}: {word: string; note?: string; at?: [number, number]; color?: Gas; noteColor?: Gas; arrow?: 'left' | 'right' | 'none'; on?: number}) {
  const w = Math.max(word.length * 92 + 160, note.length * 84 * 0.4 + 140, 420), h = note ? 370 : 230, [cx, cy] = at;
  const frame = `M ${cx - w / 2 + 40} ${cy - h / 2} H ${cx + w / 2 - 40} A 40 40 0 0 1 ${cx + w / 2} ${cy - h / 2 + 40} V ${cy + h / 2 - 40} A 40 40 0 0 1 ${cx + w / 2 - 40} ${cy + h / 2} H ${cx - w / 2 + 40} A 40 40 0 0 1 ${cx - w / 2} ${cy + h / 2 - 40} V ${cy - h / 2 + 40} A 40 40 0 0 1 ${cx - w / 2 + 40} ${cy - h / 2} Z`;
  const ax = arrow === 'right' ? cx + w / 2 + 40 : cx - w / 2 - 40, dir = arrow === 'right' ? 1 : -1;
  const arrowPath = `M ${ax} ${cy} h ${dir * 200} m ${-dir * 60} -60 l ${dir * 60} 60 l ${-dir * 60} 60`;
  const p = (a: number, b: number) => Math.max(0, Math.min(1, (on - a) / (b - a)));
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      {[-1, 1].map((s) => <path key={s} d={`M ${cx + s * (w / 2 - 70)} -10 L ${cx + s * (w / 2 - 70)} ${cy - h / 2}`} stroke="var(--color-wire)" strokeWidth={3} />)}
      <Tubes paths={[frame]} color={color} on={p(0, 0.45)} width={8} seed={`label:frame:${word}`} />
      <Word text={word.toUpperCase()} x={cx} y={cy + (note ? -20 : 52)} size={150} color={color} face="block" on={p(0.2, 0.65)} seed={`label:${word}`} />
      {note && <Word text={note} x={cx} y={cy + 105} size={84} color={noteColor} on={p(0.45, 0.85)} seed={`label:note:${note}`} />}
      {arrow !== 'none' && <Tubes paths={[arrowPath]} color={noteColor} on={p(0.7, 1)} width={8} seed={`label:arrow:${word}`} />}
    </svg>
  );
}
