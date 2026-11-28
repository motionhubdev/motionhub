import {seededRandom} from '@motionhub/runtime';
import {Pen, type Box} from './pen.tsx';

export const meta = {
  name: {en: 'Receipt', 'zh-CN': '小票'},
  purpose: 'data',
  line: 'A strip of thermal paper rising out of a printer\'s mouth line by line: headings, items with dotted leaders to their values, rules, a total under a double rule; one line may be marked in ballpoint.',
  fits: 'specs, a price list, the parts of a whole and their total; any list of names and figures read top to bottom',
  params: {
    lines: {type: 'Line[]', doc: 'the print, top to bottom: {text, align?, bold?, big?, small?}, {label, value, bold?}, {rule: single | double | dash | code | stars}, or {gap: lines}'},
    fed: {type: 'number', default: 99, doc: 'how many lines have come out of the mouth; a fraction is the next line rising (about 0.16 s a line)'},
    x: {type: 'px', default: 580, doc: 'the paper\'s left edge'},
    width: {type: 'px', default: 760, doc: 'the paper\'s width'},
    mouth: {type: 'px', default: 990, doc: 'the y of the printer\'s mouth the paper rises from'},
    size: {type: 'px', default: 38, doc: 'the print size; a line holds as many characters as fit'},
    mark: {type: '{row, kind, draw}', default: null, doc: 'a ballpoint stroke on line `row` (an index into lines): circle, tick or underline, drawn by draw 0 to 1'},
    seed: {type: 'string', default: 'r', doc: 'the paper\'s torn edge and the print\'s uneven heat'},
    tear: {type: 'progress', default: 0, doc: '0 to 1 over about 0.55 s: the strip is torn off at the mouth and lifted up and away, leaving a fresh edge'},
  },
  preview: 9.6,
};

export type Line =
  | {text: string; align?: 'left' | 'center' | 'right'; bold?: boolean; big?: boolean; small?: boolean}
  | {label: string; value: string; bold?: boolean}
  | {rule: 'single' | 'double' | 'dash' | 'code' | 'stars'}
  | {gap: number};

/** Courier Prime's advance, measured: every character is 0.6 em */
export const ADV = 0.6;
const PAD = 56, TOP = 52;
/** The torn strip lifting away, gathering speed */
const lift = (t: number) => Math.min(1, t) ** 2.2;

export function lineHeight(l: Line, s: number) {
  if ('gap' in l) return l.gap * s;
  if ('rule' in l) return l.rule === 'code' ? s * 2.6 : l.rule === 'double' ? s * 1.1 : s * 0.9;
  if ('text' in l) return l.big ? s * 2.3 : l.small ? s * 1.25 : s * 1.5;
  return s * 1.5;
}

/** Where the receipt's lines sit: the paper's top on screen, and each line's top and height there */
export function layout(lines: Line[], fed: number, size: number, mouth: number) {
  const hs = lines.map((l) => lineHeight(l, size));
  const whole = Math.floor(Math.max(0, Math.min(fed, lines.length)));
  let printed = hs.slice(0, whole).reduce((a, b) => a + b, 0);
  if (whole < lines.length) printed += (Math.max(0, fed) - whole) * hs[whole];
  const top = mouth - TOP - printed;
  const tops: number[] = [];
  let y = top + TOP;
  for (const h of hs) { tops.push(y); y += h; }
  return {top, tops, hs};
}

/** A torn edge across the top of a strip: small uneven teeth */
export function tornEdge(x: number, w: number, y: number, seed: string, down = 1) {
  const r = seededRandom(seed), pts: string[] = [];
  for (let i = 0; i <= 40; i++) pts.push(`${(x + (w * i) / 40).toFixed(1)} ${(y + down * (i % 2 ? 5 + r() * 6 : r() * 3)).toFixed(1)}`);
  return pts.join('L');
}

/** The printer's mouth: a dark slot with a lit lip, wider than the paper */
export function Mouth({x, width, y}: {x: number; width: number; y: number}) {
  return (
    <g>
      <rect x={x - 46} y={y - 4} width={width + 92} height={90} rx={18} fill="var(--color-slot)" />
      <rect x={x - 46} y={y - 4} width={width + 92} height={4} rx={2} fill="var(--color-slotEdge)" />
      <rect x={x - 14} y={y + 6} width={width + 28} height={10} rx={5} fill="#000" opacity={0.55} />
    </g>
  );
}

function Print({l, x, w, y, h, size, heat}: {l: Line; x: number; w: number; y: number; h: number; size: number; heat: number}) {
  const ink = 'var(--color-ink)', faded = 'var(--color-faded)', font = {fontFamily: 'var(--font-mono)', whiteSpace: 'pre' as const};
  const inner = w - PAD * 2, x0 = x + PAD, x1 = x + w - PAD, base = y + h * 0.5 + size * 0.32;
  if ('gap' in l) return null;
  if ('rule' in l) {
    const my = y + h / 2;
    if (l.rule === 'single') return <line x1={x0} x2={x1} y1={my} y2={my} stroke={ink} strokeWidth={2} opacity={heat} />;
    if (l.rule === 'double') return <g opacity={heat}><line x1={x0} x2={x1} y1={my - 4} y2={my - 4} stroke={ink} strokeWidth={2} /><line x1={x0} x2={x1} y1={my + 4} y2={my + 4} stroke={ink} strokeWidth={2} /></g>;
    if (l.rule === 'dash') return <line x1={x0} x2={x1} y1={my} y2={my} stroke={ink} strokeWidth={2} strokeDasharray="10 8" opacity={heat * 0.8} />;
    if (l.rule === 'stars') {
      const n = Math.floor(inner / (ADV * size * 2));
      return <text x={x + w / 2} y={base} textAnchor="middle" fontSize={size} fill={faded} style={font}>{Array(n).fill('*').join(' ')}</text>;
    }
    // a pattern of bars of the motion's own: widths from the seed, no code in it
    const r = seededRandom(`bars${Math.round(y)}`), bars: JSX.Element[] = [];
    for (let bx = x0 + inner * 0.12; bx < x1 - inner * 0.12;) { const bw = 2 + Math.floor(r() * 4) * 2; if (r() > 0.38) bars.push(<rect key={bx} x={bx} y={y + h * 0.18} width={bw} height={h * 0.64} fill={ink} />); bx += bw + 3; }
    return <g opacity={heat}>{bars}</g>;
  }
  if ('label' in l) {
    const cols = Math.floor(inner / (ADV * size)), dots = Math.max(2, cols - l.label.length - l.value.length - 2);
    return (
      <text x={x0} y={base} fontSize={size} fontWeight={l.bold ? 700 : 400} fill={ink} opacity={heat} style={font}>
        {l.label}{' '}<tspan fill={faded}>{'.'.repeat(dots)}</tspan>{' '}{l.value}
      </text>
    );
  }
  const s = l.big ? size * 1.6 : l.small ? size * 0.72 : size;
  const anchor = l.align === 'center' ? 'middle' : l.align === 'right' ? 'end' : 'start';
  const tx = l.align === 'center' ? x + w / 2 : l.align === 'right' ? x1 : x0;
  return <text x={tx} y={y + h * 0.5 + s * 0.32} textAnchor={anchor} fontSize={s} fontWeight={l.bold || l.big ? 700 : 400} fill={l.small ? faded : ink} opacity={heat} style={font}>{l.text}</text>;
}

type Props = {lines: Line[]; fed?: number; x?: number; width?: number; mouth?: number; size?: number; mark?: {row: number; kind?: 'circle' | 'tick' | 'underline'; draw: number} | null; seed?: string; tear?: number};

export function Receipt({lines, fed = 99, x = 580, width = 760, mouth = 990, size = 38, mark = null, seed = 'r', tear = 0}: Props) {
  const {top, tops, hs} = layout(lines, fed, size, mouth);
  const heat = seededRandom(`${seed}heat`), clip = `rr-${seed.replace(/[^A-Za-z0-9]/g, '')}${Math.round(x)}`;
  let box: Box | null = null;
  if (mark && lines[mark.row]) {
    const l = lines[mark.row], y = tops[mark.row], h = hs[mark.row];
    box = [x + PAD - 6, y + 4, width - PAD * 2 + 12, h - 8];
  }
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id={clip}><rect x={0} y={-2000} width={1920} height={mouth + 2000} /></clipPath>
          <linearGradient id={`${clip}c`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-paperShade)" stopOpacity={0.7} /><stop offset="0.08" stopColor="var(--color-paperShade)" stopOpacity={0} />
            <stop offset="0.92" stopColor="var(--color-paperShade)" stopOpacity={0} /><stop offset="1" stopColor="var(--color-paperShade)" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        {tear > 0 && <path d={`M${tornEdge(x, width, mouth - 22, `${seed}new`)}L${x + width} ${mouth + 10}L${x} ${mouth + 10}Z`} fill="var(--color-paper)" />}
        <g clipPath={`url(#${clip})`}><g style={{transformOrigin: `${x + width / 2}px ${mouth}px`, transform: tear > 0 ? `translateY(${-lift(tear) * (mouth + 300)}px) rotate(${-7 * tear}deg)` : undefined}}>
          <path d={`M${tornEdge(x + 14, width, top + 16, seed)}L${x + width + 14} ${mouth}L${x + 14} ${mouth}Z`} fill="#000" opacity={0.28} />
          <path d={`M${tornEdge(x, width, top, seed)}L${x + width} ${mouth + 10}L${x} ${mouth + 10}Z`} fill="var(--color-paper)" />
          <rect x={x} y={top} width={width} height={mouth - top + 10} fill={`url(#${clip}c)`} />
          {lines.map((l, i) => tops[i] + hs[i] * 0.2 < mouth + hs[i] && <Print key={i} l={l} x={x} w={width} y={tops[i]} h={hs[i]} size={size} heat={0.84 + heat() * 0.16} />)}
        </g></g>
        <Mouth x={x} width={width} y={mouth} />
      </svg>
      {box && mark && tear <= 0 && <Pen kind={mark.kind ?? 'circle'} box={box} draw={mark.draw} seed={`${seed}${mark.row}`} />}
    </div>
  );
}
