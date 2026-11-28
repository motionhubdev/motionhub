// Neon Sign's tubes, and what the other parts share: how a tube lights, hums and glows. A tube is a path or a word.
import {seededRandom, useTime} from '@motionhub/runtime';

export const meta = {
  name: {en: 'Neon word', 'zh-CN': '霓虹字'},
  purpose: 'title',
  line: 'A word bent in glass tube on the wall: dim grey glass first, then each letter stutters alight and holds, a white-hot core in a coloured glow that spills onto the bricks.',
  fits: 'a title; the one word a scene is about; a name; a short phrase of one to three words',
  params: {
    text: {type: 'text', doc: 'one to three words'},
    at: {type: '[x, y]', doc: 'the baseline\'s start, or its middle when centred'},
    size: {type: 'px', default: 200, doc: 'the letters\' size'},
    color: {type: 'pink | cyan | amber | red | white', default: 'pink', doc: 'the gas\'s colour'},
    face: {type: 'script | block', default: 'script', doc: 'script: joined handwriting tube; block: upright capitals'},
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 1.2 s: the letters stutter on in turn, left to right, then hold'},
    align: {type: 'left | center', default: 'center', doc: 'where `at` sits'},
    clips: {type: 'boolean', default: true, doc: 'the small standoffs that hold the tube off the wall'},
  },
  preview: 8.5,
};

export type Gas = 'pink' | 'cyan' | 'amber' | 'red' | 'white';
const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * How bright segment `i` of `n` is at `on` (0 to 1 over 1.2 s): dark, then at most two short stutters, then steady. A stutter
 * is an on and an off of a single tube, so the sign as a whole never flashes more than three times a second.
 */
export function light(on: number, i: number, n: number, seed: string) {
  if (on >= 1) return 1;
  const r = seededRandom(`${seed}:${i}`), T = on * 1.2;
  const start = (n > 1 ? (i / (n - 1)) * 0.55 : 0.1) + r() * 0.08, dt = T - start, twice = r() < 0.4;
  if (dt < 0) return 0;
  if (dt < 0.07) return 0.85;
  if (dt < 0.2) return 0.08;
  if (twice && dt > 0.3 && dt < 0.4) return 0.12;
  return clamp(0.7 + dt * 0.9);
}

/** The slow hum of a lit sign: a few per cent of brightness, under one cycle a second, never a flash */
export function useHum(seed: string) {
  const t = useTime(), r = seededRandom(`hum:${seed}`), ph = r() * 6.28;
  return 0.955 + 0.045 * Math.sin(t * 2 * Math.PI * 0.8 + ph);
}

export const gas = (c: Gas) => `var(--color-${c})`;

/** The layers of a lit tube, outermost first: the spill on the wall, two glows, the coloured glass, the hot core */
export const LAYERS = [
  {w: 0.5, o: 0.05, core: false}, {w: 0.2, o: 0.12, core: false}, {w: 0.085, o: 0.36, core: false}, {w: 0.038, o: 1, core: false}, {w: 0, o: 0.92, core: true},
];

/** Tubes along SVG paths in a box: each path is a segment that lights on its own; `width` is the tube's thickness */
export function Tubes({paths, color = 'pink', on = 1, width = 9, seed = 'tubes', transform}: {paths: string[]; color?: Gas; on?: number; width?: number; seed?: string; transform?: string}) {
  const hum = useHum(seed), c = gas(color);
  const lit = paths.map((_, i) => light(on, i, paths.length, seed) * hum);
  return (
    <g transform={transform} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => <path key={`g${i}`} d={d} stroke="var(--color-glass)" strokeWidth={width} />)}
      {paths.map((d, i) => <path key={`h${i}`} d={d} stroke="rgba(255,255,255,0.12)" strokeWidth={width * 0.25} transform="translate(-1 -2)" />)}
      {LAYERS.map((l, k) => paths.map((d, i) => lit[i] > 0.01 && (
        <path key={`${k}-${i}`} d={d} stroke={l.core ? 'var(--color-core)' : c} strokeOpacity={l.o * lit[i]}
          strokeWidth={l.core ? width * 0.42 : (l.w / 0.038) * width} />
      )))}
    </g>
  );
}

/** A word in tube: the same layers drawn as letters, each letter lighting on its own */
export function Word({text, x, y, size, color = 'pink', face = 'script', on = 1, dim = 1, align = 'center', seed}: {text: string; x: number; y: number; size: number; color?: Gas; face?: 'script' | 'block'; on?: number; dim?: number; align?: 'left' | 'center'; seed?: string}) {
  const key = seed ?? `w:${text}`, hum = useHum(key), c = gas(color), chars = [...text];
  const n = chars.filter((ch) => ch !== ' ').length;
  let k = -1;
  const lit = chars.map((ch) => (ch === ' ' ? 0 : light(on, ++k, n, key) * hum * dim));
  const font = {fontFamily: face === 'script' ? 'var(--font-script)' : 'var(--font-block)', fontSize: size, fontWeight: 400, textAnchor: align === 'center' ? 'middle' : 'start'} as const;
  const spans = (paint: (l: number) => Record<string, number | string>) => chars.map((ch, i) => <tspan key={i} {...paint(lit[i])}>{ch}</tspan>);
  return (
    <g style={{fontFamily: font.fontFamily}}>
      <text x={x} y={y} fontSize={size} textAnchor={font.textAnchor} fill="var(--color-glass)" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}>{text}</text>
      {LAYERS.map((l, j) => (
        <text key={j} x={x} y={y} fontSize={size} textAnchor={font.textAnchor} strokeLinejoin="round" strokeLinecap="round"
          fill={l.core ? 'var(--color-core)' : l.w === 0.038 ? c : 'none'} stroke={l.core ? 'none' : c} strokeWidth={l.core ? 0 : l.w * size * (face === 'script' ? 0.6 : 0.8)}>
          {spans((v) => (l.core ? {fillOpacity: l.o * v} : l.w === 0.038 ? {fillOpacity: v, strokeOpacity: v} : {strokeOpacity: l.o * v, fillOpacity: 0}))}
        </text>
      ))}
    </g>
  );
}

/** The small standoffs that hold a tube off the wall, and the wire that runs from the sign's end down out of the frame */
export function Fixings({points, wire}: {points: [number, number][]; wire?: [number, number]}) {
  return (
    <g>
      {wire && <path d={`M${wire[0]} ${wire[1]} C${wire[0] + 10} ${wire[1] + 120} ${wire[0] - 40} ${wire[1] + 220} ${wire[0] - 20} 1100`} stroke="var(--color-wire)" strokeWidth={5} fill="none" />}
      {points.map(([x, y], i) => (
        <g key={i}><rect x={x - 7} y={y - 4} width={14} height={22} rx={3} fill="var(--color-metal)" /><rect x={x - 7} y={y - 4} width={5} height={22} rx={2} fill="rgba(255,255,255,0.25)" /></g>
      ))}
    </g>
  );
}

type Props = {text: string; at: [number, number]; size?: number; color?: Gas; face?: 'script' | 'block'; on?: number; align?: 'left' | 'center'; clips?: boolean};

export function NeonWord({text, at, size = 200, color = 'pink', face = 'script', on = 1, align = 'center', clips = true}: Props) {
  const w = text.length * size * (face === 'script' ? 0.42 : 0.5), x0 = align === 'center' ? at[0] - w / 2 : at[0];
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {clips && <Fixings points={[[x0 + w * 0.15, at[1] - size * 0.12], [x0 + w * 0.5, at[1] - size * 0.12], [x0 + w * 0.85, at[1] - size * 0.12]]} />}
      <Word text={text} x={at[0]} y={at[1]} size={size} color={color} face={face} on={on} align={align} />
    </svg>
  );
}
