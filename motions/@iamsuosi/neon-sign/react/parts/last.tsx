import {Word, type Gas} from './tube.tsx';

export const meta = {
  name: {en: 'Last light', 'zh-CN': '最后一盏'},
  purpose: 'close',
  line: 'Two or three lines of a sign lit together; at closing time they go dark one by one, each with a last stutter, until only one word is left glowing.',
  fits: 'the end of a film: what it comes down to, left alight; a date or a name to close on',
  params: {
    lines: {type: '{text, color, face}[]', doc: 'two or three lines, top to bottom, each with its gas and face (script or block)'},
    keep: {type: 'number', default: -1, doc: 'the line left alight; the last line without one'},
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 1.4 s: the lines light top to bottom'},
    off: {type: 'progress', default: 0, doc: '0 to 1 over about 1.5 s: the others go dark one by one'},
    y: {type: 'px', default: 300, doc: 'the first line\'s baseline'},
  },
  preview: 24.0,
};

type Line = {text: string; color?: Gas; face?: 'script' | 'block'};

export function Last({lines, keep = -1, on = 1, off = 0, y = 300}: {lines: Line[]; keep?: number; on?: number; off?: number; y?: number}) {
  const kept = keep < 0 ? lines.length - 1 : keep, others = lines.map((_, i) => i).filter((i) => i !== kept);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      {lines.map((l, i) => {
        const lit = Math.max(0, Math.min(1, on * lines.length - i));
        const k = others.indexOf(i), gone = k < 0 ? 0 : Math.max(0, Math.min(1, off * others.length - k));
        // going dark: one last stutter, then off
        const fade = gone <= 0 ? 1 : gone < 0.25 ? 0.15 : gone < 0.4 ? 0.8 : 0;
        const size = l.face === 'block' ? 150 : 190;
        return (
          <Word key={i} text={l.text} x={960} y={y + i * 240} size={size} color={l.color ?? 'pink'} face={l.face ?? 'script'} on={lit} dim={fade} seed={`last:${i}:${l.text}`} />
        );
      })}
    </svg>
  );
}
