// Marquee Bulbs' bulb letters, and what every other part shares: the 5 × 7 bulb font, one bulb, the sweep that switches words.
import {useId} from 'react';

export const meta = {
  name: {en: 'Bulb word', 'zh-CN': '灯泡字'},
  purpose: 'title',
  line: 'A word or short line spelled in round bulbs on a 5 by 7 grid, unlit glass where no letter is; it switches on, or over to the next word, in a sweep from left to right.',
  fits: 'the title a film opens on; a single word that names a scene; the line it ends on',
  params: {
    text: {type: 'text', doc: 'a word or a short line: A–Z, 0–9 and . , ! ? \' - : / & % +, up to about 12 characters'},
    from: {type: 'text', default: '', doc: 'what the bulbs spelled before; dark glass without one'},
    swap: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: a sweep from the left switches the old bulbs off and the new ones on'},
    tone: {type: 'amber | ruby', default: 'amber', doc: 'the lamps\' colour: amber for words, ruby for the one word that matters'},
    x: {type: 'px', default: 960, doc: 'the middle of the line'},
    y: {type: 'px', default: 540, doc: 'the middle of the line'},
    width: {type: 'px', default: 1500, doc: 'the most the line may take; the bulbs shrink to fit'},
    pitch: {type: 'px', default: 30, doc: 'the distance between bulb centres, at most'},
    glass: {type: 'boolean', default: true, doc: 'unlit glass bulbs where no letter is, inside each letter\'s cell'},
  },
  preview: 5.0,
};

/** The bulb font: each glyph seven rows of five, # a bulb */
export const FONT: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  ',': ['.....', '.....', '.....', '.....', '.##..', '..#..', '.#...'],
  '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  "'": ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  '&': ['.##..', '#..#.', '#.#..', '.#...', '#.#.#', '#..#.', '.##.#'],
  '%': ['##...', '##..#', '...#.', '..#..', '.#...', '#..##', '...##'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
};

export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** The bulbs of a line of text: each {c, r} cell (column across the whole line, row 0–6) and whether it is lit */
export function cells(text: string) {
  const out: {c: number; r: number; on: boolean}[] = [];
  [...text.toUpperCase()].forEach((ch, i) => {
    const g = FONT[ch] ?? FONT['?'];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) out.push({c: i * 6 + c, r, on: g[r][c] === '#'});
  });
  return out;
}
/** Columns a line takes: five a letter and one between */
export const columns = (text: string) => Math.max(1, [...text].length * 6 - 1);

/** Gradients one svg needs for its bulbs: ids from the prefix */
export function BulbDefs({id}: {id: string}) {
  return (
    <defs>
      <radialGradient id={`${id}-a`} cx="0.42" cy="0.38" r="0.65"><stop offset="0" stopColor="var(--color-filament)" /><stop offset="0.55" stopColor="var(--color-amber)" /><stop offset="1" stopColor="var(--color-amberDeep)" /></radialGradient>
      <radialGradient id={`${id}-r`} cx="0.42" cy="0.38" r="0.65"><stop offset="0" stopColor="var(--color-filament)" /><stop offset="0.5" stopColor="var(--color-ruby)" /><stop offset="1" stopColor="var(--color-rubyDeep)" /></radialGradient>
      <radialGradient id={`${id}-h`}><stop offset="0" stopColor="var(--color-amber)" stopOpacity="0.5" /><stop offset="0.45" stopColor="var(--color-amber)" stopOpacity="0.16" /><stop offset="1" stopColor="var(--color-amber)" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-hr`}><stop offset="0" stopColor="var(--color-ruby)" stopOpacity="0.55" /><stop offset="0.45" stopColor="var(--color-ruby)" stopOpacity="0.18" /><stop offset="1" stopColor="var(--color-ruby)" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-g`} cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="var(--color-glassLight)" /><stop offset="1" stopColor="var(--color-glass)" /></radialGradient>
    </defs>
  );
}

/** One bulb at x, y of radius r: dark glass at `lit` 0, a warm lamp with its halo at 1 (between, warming up) */
export function Bulb({x, y, r, lit, id, tone = 'amber', glass = true}: {x: number; y: number; r: number; lit: number; id: string; tone?: 'amber' | 'ruby'; glass?: boolean}) {
  const k = clamp(lit), ruby = tone === 'ruby';
  return (
    <g>
      {k > 0 && <circle cx={x} cy={y} r={r * 3} fill={`url(#${id}-${ruby ? 'hr' : 'h'})`} opacity={k} />}
      {glass && <circle cx={x} cy={y} r={r} fill={`url(#${id}-g)`} />}
      {k > 0 && <circle cx={x} cy={y} r={r} fill={`url(#${id}-${ruby ? 'r' : 'a'})`} opacity={k} />}
      <circle cx={x - r * 0.32} cy={y - r * 0.36} r={r * 0.22} fill="var(--color-filament)" opacity={0.25 + 0.55 * k} />
    </g>
  );
}

/** How lit a bulb in column `c` of `n` is while a sweep switches from one word to the next: [old, new] */
export function sweep(swap: number, c: number, n: number) {
  const front = swap * (n + 8) - 4;
  const off = 1 - clamp((front - c) / 2.5), on = clamp((front - c - 3) / 2.5);
  return [off, on];
}

type Props = {text: string; from?: string; swap?: number; tone?: 'amber' | 'ruby'; x?: number; y?: number; width?: number; pitch?: number; glass?: boolean};

/** Bulb letters, centred at x, y */
export function BulbText({text, from = '', swap = 1, tone = 'amber', x = 960, y = 540, width = 1500, pitch = 30, glass = true}: Props) {
  const id = useId().replace(/:/g, '');
  const n = Math.max(columns(text), columns(from || ' ')), p = Math.min(pitch, width / n), r = p * 0.34;
  const left = x - ((n - 1) * p) / 2, top = y - 3 * p;
  const pad = (s: string) => { const k = Math.round((n + 1) / 6) - [...s].length; return ' '.repeat(Math.max(0, Math.floor(k / 2))) + s + ' '.repeat(Math.max(0, Math.ceil(k / 2))); };
  const a = cells(pad(from)), b = cells(pad(text)), map = new Map(a.map((q) => [`${q.c},${q.r}`, q.on]));
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <BulbDefs id={id} />
      {b.filter((q) => q.c < n).map((q) => {
        const [off, on] = sweep(swap, q.c, n), was = map.get(`${q.c},${q.r}`) ?? false;
        const lit = Math.max(was ? off : 0, q.on ? on : 0);
        return <Bulb key={`${q.c}-${q.r}`} x={left + q.c * p} y={top + q.r * p} r={r} lit={lit} id={id} tone={tone} glass={glass} />;
      })}
    </svg>
  );
}

