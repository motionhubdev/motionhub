import {Scrawl, span} from './table.tsx';

export const meta = {
  name: {en: 'Tape title', 'zh-CN': '胶带标题'},
  purpose: 'title',
  line: 'A strip of white tape pressed onto the table at a slight angle, torn at both ends, with a title written on it in black grease pencil.',
  fits: 'what a comparison is about; a chapter; the question a film opens on',
  params: {
    text: {type: 'text', doc: 'a few words'},
    at: {type: '[x, y]', default: [960, 170], doc: 'the middle of the tape'},
    size: {type: 'px', default: 64, doc: 'the words\' size; the tape fits them'},
    tilt: {type: 'degrees', default: -2, doc: 'the tape\'s angle'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: the tape is pressed on, then the words written'},
  },
  preview: 11.0,
};

export function Tape({text, at = [960, 170], size = 64, tilt = -2, show = 1}: {text: string; at?: [number, number]; size?: number; tilt?: number; show?: number}) {
  if (show <= 0) return null;
  const w = text.length * size * 0.6 + size * 1.6, h = size * 1.55, [x, y] = at, k = span(show, 0, 0.3);
  const torn = (side: number) => Array.from({length: 7}, (_, i) => `${side ? w - (i % 2) * 8 : (i % 2) * 8},${(i / 6) * h}`).join(' ');
  return (
    <svg width={w + 40} height={h + 40} viewBox={`-20 -20 ${w + 40} ${h + 40}`} style={{position: 'absolute', left: x - w / 2 - 20, top: y - h / 2 - 20, overflow: 'visible', transform: `rotate(${tilt}deg) scale(${1.06 - 0.06 * k})`, opacity: Math.min(1, k * 2)}}>
      <polygon points={`${torn(0)} ${torn(1).split(' ').reverse().join(' ')}`} fill="var(--color-mount)" opacity={0.94} />
      <Scrawl text={text} x={w / 2} y={h / 2 + size * 0.36} size={size} p={span(show, 0.35, 1)} anchor="middle" />
    </svg>
  );
}
