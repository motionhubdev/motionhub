import {seededRandom} from '@motionhub/runtime';

export const meta = {
  name: {en: 'Tape strip', 'zh-CN': '胶带词条'},
  purpose: 'term',
  line: 'A strip of masking tape torn off the roll and pressed onto the wall at a slight angle, then a word or two written on it in black marker, left to right.',
  fits: 'a keyword, a name, a part of an idea; one strip per idea on a concept wall',
  params: {
    text: {type: 'text', doc: 'one to three words, written in capitals'},
    at: {type: '[x, y]', doc: 'the strip\'s centre'},
    size: {type: 'px', default: 60, doc: 'the writing\'s height; the strip fits it'},
    angle: {type: 'degrees', default: -2, doc: 'how the strip lies'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 0.85 s: the tape laid left to right (0.3 s), then the word written (0.55 s)'},
    quiet: {type: 'progress', default: 0, doc: '0 to 1: an earlier strip stepping back, its marker greying a little; it stays on the wall'},
  },
  preview: 12.6,
};

/** Permanent Marker's advance per capital, measured (em); others take the average */
const ADV: Record<string, number> = {'0': 0.69, '1': 0.32, '2': 0.65, '3': 0.56, '4': 0.58, '5': 0.58, '6': 0.5, '7': 0.58, '8': 0.54, '9': 0.53, 'A': 0.7, 'B': 0.69, 'C': 0.61, 'D': 0.59, 'E': 0.63, 'F': 0.58, 'G': 0.79, 'H': 0.7, 'I': 0.52, 'J': 0.67, 'K': 0.78, 'L': 0.63, 'M': 0.97, 'N': 0.68, 'O': 0.74, 'P': 0.64, 'Q': 0.74, 'R': 0.65, 'S': 0.58, 'T': 0.61, 'U': 0.7, 'V': 0.58, 'W': 0.99, 'X': 0.62, 'Y': 0.49, 'Z': 0.66, ' ': 0.37, '?': 0.56, '.': 0.23, ',': 0.2, '!': 0.26, "'": 0.27};
export const markerWidth = (text: string, size: number) => [...text.toUpperCase()].reduce((w, c) => w + (ADV[c] ?? (c === ' ' ? 0.3 : 0.6)), 0) * size;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const lay = (x: number) => 1 - (1 - clamp(x)) ** 3;

/** A strip's outline: a band with torn, uneven ends */
export function tapePath(w: number, h: number, seed: string) {
  const r = seededRandom(seed), end = (x: number, dir: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 6; i++) pts.push(`${(x + dir * (r() * 9)).toFixed(1)} ${(-h / 2 + (h * i) / 6).toFixed(1)}`);
    return dir > 0 ? pts : pts.reverse();
  };
  return `M${end(w / 2, 1).join('L')}L${end(-w / 2, -1).join('L')}Z`;
}

/** A piece of tape at a centre, `grow` 0 to 1 laying it from its left end; children are drawn on it */
export function Tape({at, w, h, angle, grow = 1, seed, color = 'var(--color-tape)', children}: {at: [number, number]; w: number; h: number; angle: number; grow?: number; seed: string; color?: string; children?: any}) {
  const id = `tp${seed.replace(/[^A-Za-z0-9]/g, '')}${Math.round(at[0])}${Math.round(at[1])}`, g = lay(grow);
  if (g <= 0) return null;
  const d = tapePath(w, h, seed);
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>
      <defs><clipPath id={id}><rect x={-w / 2 - 12} y={-h} width={(w + 24) * g} height={h * 2} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <path d={d} transform="translate(3 4)" fill="#000" opacity={0.16} />
        <path d={d} fill={color} opacity={0.94} />
        <path d={`M${-w / 2} ${-h / 2 + 3}H${w / 2}`} stroke="#fff" strokeWidth={2} opacity={0.35} />
        <path d={`M${-w / 2} ${h / 2 - 2}H${w / 2}`} stroke="#000" strokeWidth={2} opacity={0.08} />
        {children}
      </g>
    </g>
  );
}

/** Marker words written left to right by `write`, in a box centred on 0 */
export function Written({text, size, write = 1, quiet = 0, seed, color = 'var(--color-marker)'}: {text: string; size: number; write?: number; quiet?: number; seed: string; color?: string}) {
  const w = markerWidth(text, size), id = `wr${seed.replace(/[^A-Za-z0-9]/g, '')}${Math.round(size)}`;
  if (write <= 0) return null;
  return (
    <g>
      <defs><clipPath id={id}><rect x={-w / 2 - 10} y={-size} width={(w + 20) * clamp(write)} height={size * 2} /></clipPath></defs>
      <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fill={color} opacity={1 - 0.4 * quiet} clipPath={`url(#${id})`}
        style={{fontFamily: 'var(--font-hand)'}}>{text.toUpperCase()}</text>
    </g>
  );
}

export function Strip({text, at, size = 60, angle = -2, show = 1, quiet = 0}: {text: string; at: [number, number]; size?: number; angle?: number; show?: number; quiet?: number}) {
  if (show <= 0) return null;
  const w = markerWidth(text, size) + size * 1.3, h = size * 1.55, s = clamp(show);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <Tape at={at} w={w} h={h} angle={angle} grow={s / 0.35} seed={text}>
        <Written text={text} size={size} write={(s - 0.35) / 0.65} quiet={quiet} seed={text} />
      </Tape>
    </svg>
  );
}
