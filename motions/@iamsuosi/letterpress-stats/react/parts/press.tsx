// Letterpress Stats' headline, and what every other part shares: the measured wood type, a sort, an impression and the press.
export const meta = {
  name: {en: 'Headline', 'zh-CN': '标题'},
  purpose: 'title',
  line: 'One to three lines of wood type: the sorts slide into the composing line letter by letter, then the press comes down once and leaves the words bitten into the sheet in ink, one word in vermilion.',
  fits: 'the claim a film opens on; a chapter title; a headline a figure answers',
  params: {
    lines: {type: 'text[]', doc: 'one to three short lines, set in capitals'},
    accent: {type: 'text', default: '', doc: 'one word (as written) printed in vermilion; none without one'},
    set: {type: 'progress', default: 1, doc: '0 to 1 over about 1.2 s: the sorts slide in from the right, 50 ms apart, line after line'},
    press: {type: 'progress', default: 1, doc: '0 to 1 over 0.22 s, after the set: the press comes down, the sorts lift away and the impression is left'},
    align: {type: 'center | left', default: 'center', doc: 'lines centred on the sheet, or set from `x`'},
    x: {type: 'px', default: 140, doc: 'the left edge of the lines when they are set from the left'},
    y: {type: 'px', default: 190, doc: 'the top of the first line'},
    width: {type: 'px', default: 1640, doc: 'the widest a line may run; each line is sized to fill it, up to `size`'},
    size: {type: 'px', default: 230, doc: 'the largest a line is set'},
  },
  preview: 3.0,
};

export const W = 1920, H = 1080;
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const CANVAS = {width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: {position: 'absolute', left: 0, top: 0, overflow: 'visible'}} as const;

/** Alfa Slab One's advance per character in em, measured in the player */
const ADVANCE: Record<string, number> = {'0': 0.73, '1': 0.52, '2': 0.65, '3': 0.62, '4': 0.69, '5': 0.65, '6': 0.69, '7': 0.65, '8': 0.7, '9': 0.69, A: 0.81, B: 0.77, C: 0.72, D: 0.8, E: 0.71, F: 0.63, G: 0.78, H: 0.84, I: 0.42, J: 0.67, K: 0.83, L: 0.65, M: 1.14, N: 0.94, O: 0.79, P: 0.74, Q: 0.81, R: 0.8, S: 0.67, T: 0.78, U: 0.78, V: 0.79, W: 1.21, X: 0.8, Y: 0.78, Z: 0.69, ' ': 0.3, '.': 0.24, ',': 0.24, ':': 0.24, '%': 0.88, '×': 0.57, '+': 0.58, '-': 0.39, '–': 0.55, '$': 0.68, '/': 0.42, '!': 0.34, '?': 0.63, '&': 0.83, "'": 0.19, '’': 0.21};
export const adv = (c: string) => ADVANCE[c.toUpperCase()] ?? (/[　-鿿]/.test(c) ? 1 : 0.75);
/** A little air between wood sorts, in em */
export const TRACK = 0.03;
export const measure = (text: string, size: number) => [...text].reduce((w, c) => w + (adv(c) + TRACK) * size, -TRACK * size);
export const fit = (text: string, width: number, max: number) => Math.min(max, width / Math.max(0.5, measure(text, 1)));

/** Where each character of a line starts, from its left edge */
export function lay(text: string, size: number) {
  const chars = [...text.toUpperCase()], xs: number[] = [];
  let x = 0;
  for (const c of chars) { xs.push(x); x += (adv(c) + TRACK) * size; }
  return {chars, xs};
}

/** The speckle of ink that did not take: one filter, defined in every sheet that prints */
export const Speckle = () => (
  <defs>
    <filter id="lp-speckle" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="9" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 3.3" result="m" />
      <feComposite in="SourceGraphic" in2="m" operator="in" />
    </filter>
  </defs>
);

/**
 * Words bitten into the sheet: the paper's shadow on one side of each stroke, its lit edge on the other, the ink inside with
 * the speckle of an uneven roll. `ink` is how far the impression has come (0 none, 1 printed); `font` the face's variable.
 */
export function Impression({chars, xs, x, y, size, ink = 1, color = 'var(--color-ink)', colorOf, font = 'var(--font-display)'}:
  {chars: string[]; xs: number[]; x: number; y: number; size: number; ink?: number; color?: string; colorOf?: (i: number) => string; font?: string}) {
  if (ink <= 0) return null;
  const d = Math.max(1, Math.min(4, size / 70));
  const glyphs = (dx: number, dy: number, fill: (i: number) => string, extra = {}) => chars.map((c, i) => (
    <text key={i} x={x + xs[i] + dx} y={y + dy} fontSize={size} fill={fill(i)} style={{fontFamily: font}} {...extra}>{c}</text>
  ));
  const kiss = clamp(ink);
  return (
    <g>
      <g opacity={kiss}>{glyphs(-d, -d, () => 'var(--color-bite)')}{glyphs(d, d, () => 'var(--color-lift)')}</g>
      <g filter="url(#lp-speckle)" opacity={0.15 + 0.85 * kiss}>{glyphs(0, 0, colorOf ?? (() => color))}</g>
    </g>
  );
}

/** A wooden sort for a character: a block of end grain with its letter cut on the face, readable as it would print */
export function Sort({c, x, y, size, o = 1}: {c: string; x: number; y: number; size: number; o?: number}) {
  const w = adv(c) * size, top = y - size * 0.86, h = size * 1.02;
  if (c === ' ') return null;
  return (
    <g opacity={o}>
      <rect x={x - size * 0.015} y={top} width={w + size * 0.03} height={h} rx={size * 0.03} fill="var(--color-wood)" stroke="var(--color-grain)" strokeWidth={Math.max(1.5, size * 0.012)} />
      <rect x={x - size * 0.015} y={top + h - size * 0.07} width={w + size * 0.03} height={size * 0.07} rx={size * 0.02} fill="var(--color-grain)" opacity={0.6} />
      <text x={x} y={y} fontSize={size} fill="var(--color-grain)" style={{fontFamily: 'var(--font-display)'}}>{c}</text>
    </g>
  );
}

/**
 * A line of wood type that is set, then pressed: over `set` its sorts slide in from the right one by one; over `press` the line
 * is pushed a little into the sheet (it grows 2 per cent and settles), the sorts lift away and the impression is left.
 */
export function PressLine({text, x, y, size, set = 1, press = 1, colorOf}: {text: string; x: number; y: number; size: number; set?: number; press?: number; colorOf?: (i: number) => string}) {
  const {chars, xs} = lay(text, size), n = chars.length;
  const sortsGone = span(press, 0.25, 0.7), ink = span(press, 0.2, 0.75);
  const scale = press > 0 && press < 1 ? 1 + 0.02 * Math.sin(Math.PI * span(press, 0, 0.7)) : 1;
  const cx = x + (xs[n - 1] ?? 0) / 2;
  return (
    <g transform={`translate(${cx} ${y}) scale(${scale}) translate(${-cx} ${-y})`}>
      <Impression chars={chars} xs={xs} x={x} y={y} size={size} ink={ink} colorOf={colorOf} />
      {sortsGone < 1 && chars.map((c, i) => {
        const local = easeOut(span(set, i / (n + 4), (i + 5) / (n + 4)));
        if (local <= 0) return null;
        return <Sort key={i} c={c} x={x + xs[i] + (1 - local) * (420 + 14 * i)} y={y - sortsGone * size * 0.12} size={size} o={Math.min(1, local * 3) * (1 - sortsGone)} />;
      })}
    </g>
  );
}

type Props = {lines: string[]; align?: 'center' | 'left'; accent?: string; set?: number; press?: number; x?: number; y?: number; width?: number; size?: number};

export function Headline({lines, align = 'center', accent = '', set = 1, press = 1, x = 140, y = 190, width = 1640, size = 230}: Props) {
  const n = Math.max(1, lines.length);
  let top = y;
  return (
    <svg {...CANVAS}>
      <Speckle />
      {lines.map((line, i) => {
        const s = fit(line, width, size), base = top + s * 0.86, lx = align === 'center' ? 960 - measure(line, s) / 2 : x;
        top += s * 1.12;
        const up = line.toUpperCase(), at = accent ? up.indexOf(accent.toUpperCase()) : -1;
        const colorOf = (k: number) => (at >= 0 && k >= at && k < at + accent.length ? 'var(--color-vermilion)' : 'var(--color-ink)');
        return <PressLine key={i} text={line} x={lx} y={base} size={s} set={span(set, i / n, (i + 1) / n)} press={press} colorOf={colorOf} />;
      })}
    </svg>
  );
}
