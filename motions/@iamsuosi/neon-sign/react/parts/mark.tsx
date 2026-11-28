import {Tubes, Word, Fixings, type Gas} from './tube.tsx';

export const meta = {
  name: {en: 'Neon mark', 'zh-CN': '霓虹标志'},
  purpose: 'open',
  line: 'A simple mark bent in tube (a ring, a bolt, a moon, a star, an arrow, a wave, a heart) that stutters on stroke by stroke, then the name under it lights; the sign holds, humming.',
  fits: 'a film\'s opening sting; a channel\'s or a series\' mark; the end of a film, with its name',
  params: {
    shapes: {type: 'text[]', doc: 'the strokes, laid on one another in a 200 px box: ring, bolt, moon, star, arrow, wave, heart; or your own SVG paths in that box (centred on 0, 0)'},
    colors: {type: 'text[]', default: ['pink'], doc: 'a gas for each stroke, in turn: pink, cyan, amber, red, white'},
    name: {type: 'text', default: '', doc: 'the name under it, in script tube'},
    nameColor: {type: 'pink | cyan | amber | red | white', default: 'cyan', doc: 'the name\'s gas'},
    at: {type: '[x, y]', default: [960, 400], doc: 'the mark\'s centre'},
    scale: {type: 'number', default: 1.6, doc: 'the mark\'s size, times its 200 px box'},
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 1.8 s: the strokes stutter on, then the name'},
  },
  preview: 3.4,
};

export const SHAPES: Record<string, string> = {
  ring: 'M -80 0 A 80 80 0 1 1 80 0 A 80 80 0 1 1 -80 0',
  bolt: 'M 18 -62 L -26 8 L 12 8 L -16 64',
  moon: 'M 22 -58 A 62 62 0 1 0 22 58 A 48 48 0 1 1 22 -58',
  star: 'M 0 -70 L 18 -22 L 68 -22 L 28 10 L 42 60 L 0 30 L -42 60 L -28 10 L -68 -22 L -18 -22 Z',
  arrow: 'M -80 0 L 72 0 M 36 -36 L 72 0 L 36 36',
  wave: 'M -90 0 Q -67 -40 -45 0 T 0 0 T 45 0 T 90 0',
  heart: 'M 0 60 C -70 10 -80 -40 -42 -58 C -18 -68 0 -48 0 -32 C 0 -48 18 -68 42 -58 C 80 -40 70 10 0 60 Z',
};

type Props = {shapes: string[]; colors?: string[]; name?: string; nameColor?: Gas; at?: [number, number]; scale?: number; on?: number};

export function Mark({shapes, colors = ['pink'], name = '', nameColor = 'cyan', at = [960, 400], scale = 1.6, on = 1}: Props) {
  const mark = Math.min(1, on / 0.7), word = Math.max(0, (on - 0.55) / 0.45);
  const r = 100 * scale;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <Fixings points={[[at[0] - r * 0.6, at[1] + r * 0.85], [at[0] + r * 0.6, at[1] + r * 0.85]]} wire={[at[0] + r * 0.7, at[1] + r * 0.9]} />
      {shapes.map((s, i) => (
        <Tubes key={i} paths={[SHAPES[s] ?? s]} color={(colors[i % colors.length] ?? 'pink') as Gas} on={Math.max(0, Math.min(1, mark * 1.4 - i * 0.3))}
          width={9 / scale} seed={`mark:${s}:${i}`} transform={`translate(${at[0]} ${at[1]}) scale(${scale})`} />
      ))}
      {name && <Word text={name} x={at[0]} y={at[1] + r + 170} size={150} color={nameColor} on={word} seed={`mark:${name}`} />}
    </svg>
  );
}
