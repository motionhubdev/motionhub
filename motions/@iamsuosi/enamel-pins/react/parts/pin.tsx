import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'Pin', 'zh-CN': '徽章'},
  purpose: 'mark',
  line: 'One hard-enamel pin: a simple shape in a flat glossy enamel inside a raised gold or silver outline, pressed into the felt with a small give, then a glint runs across it.',
  fits: 'a symbol for an idea; decoration around a banner or a badge; the thing a scene is about, as an emblem',
  params: {
    shape: {type: 'flower | hex | drop | leaf | bolt | cloud | moon | circle', doc: 'the pin\'s outline'},
    at: {type: '[x, y]', doc: 'its centre'},
    size: {type: 'px', default: 160, doc: 'its width'},
    enamel: {type: 'color', default: 'cherry', doc: 'its fill: cherry, butter, mint, lilac or cream'},
    metal: {type: 'gold | silver', default: 'gold', doc: 'its outline'},
    angle: {type: 'degrees', default: 0, doc: 'how it is turned on the felt'},
    press: {type: 'progress', default: 1, doc: '0 to 1 over about 0.35 s: brought down from above, a small give into the felt, settled'},
    glint: {type: 'progress', default: 1, doc: '0 to 1 over about 0.45 s, after the press: a band of light across the enamel'},
  },
  preview: 2.6,
};

/** Each shape in a box of 100 around its centre */
export const SHAPES: Record<string, string> = {
  flower: (() => { const p: string[] = []; for (let i = 0; i <= 120; i++) { const a = (i / 120) * Math.PI * 2, r = 35 + 15 * Math.cos(5 * a); p.push(`${(Math.cos(a - Math.PI / 2) * r).toFixed(1)} ${(Math.sin(a - Math.PI / 2) * r).toFixed(1)}`); } return `M${p.join('L')}Z`; })(),
  hex: (() => { const p: string[] = []; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; p.push(`${(Math.cos(a) * 48).toFixed(1)} ${(Math.sin(a) * 48).toFixed(1)}`); } return `M${p.join('L')}Z`; })(),
  drop: 'M0 -50C22 -18 38 2 38 18A38 32 0 0 1 -38 18C-38 2 -22 -18 0 -50Z',
  leaf: 'M-42 40C-46 -14 -6 -46 46 -46C48 6 16 44 -42 40Z',
  bolt: 'M10 -50L-34 6L-4 6L-14 50L34 -10L4 -10Z',
  cloud: 'M-38 24A20 20 0 0 1 -34 -8A24 24 0 0 1 6 -26A24 24 0 0 1 44 -2A16 16 0 0 1 38 24Z',
  moon: 'M12 -46A48 48 0 1 0 12 46A38 38 0 1 1 12 -46Z',
  circle: 'M0 -48A48 48 0 1 1 0 48A48 48 0 1 1 0 -48Z',
};
/** The raised metal lines inside some shapes */
const DETAIL: Record<string, string> = {
  flower: 'M0 -12A12 12 0 1 1 0 12A12 12 0 1 1 0 -12Z',
  hex: 'M0 -26L22.5 -13L22.5 13L0 26L-22.5 13L-22.5 -13Z',
  leaf: 'M-34 32C-8 4 14 -18 38 -38',
  circle: 'M0 -40A40 40 0 1 1 0 40A40 40 0 1 1 0 -40Z',
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** How a press goes: the pin's scale, its lift (shadow distance) and the felt's give, at press p */
export function pressed(p: number) {
  const t = clamp(p);
  if (t < 0.55) { const k = (t / 0.55) ** 2; return {scale: 1.28 - 0.3 * k, lift: 1 - k, give: k * 0.6, alpha: clamp(t / 0.15)}; }
  if (t < 0.78) { const k = (t - 0.55) / 0.23; return {scale: 0.98 - 0.02 * Math.sin(k * Math.PI), lift: 0, give: 0.6 + 0.4 * Math.sin(k * Math.PI), alpha: 1}; }
  const k = (t - 0.78) / 0.22; return {scale: 0.98 + 0.02 * k, lift: 0, give: 0.6 - 0.1 * k, alpha: 1};
}

const ids = (key: string) => key.replace(/[^A-Za-z0-9]/g, '');

/**
 * A pin of any outline, drawn at its centre: the felt's give and the shadow under it, the metal, the enamel, the metal lines and
 * a glint. `children` are drawn in the enamel, in the 100-unit box (a word, a figure).
 */
export function PinBody({d, detail, at, size, enamel, metal = 'gold', angle = 0, press = 1, glint = 1, id, children, w = 100, h = 100}: {d: string; detail?: string; at: [number, number]; size: number; enamel: string; metal?: 'gold' | 'silver'; angle?: number; press?: number; glint?: number; id: string; children?: ReactNode; w?: number; h?: number}) {
  if (press <= 0) return null;
  const {scale, lift, give, alpha} = pressed(press), k = (size / w) * scale, key = ids(id);
  const m = metal === 'gold' ? ['var(--color-goldLight)', 'var(--color-gold)', 'var(--color-goldDark)'] : ['#F2F4F6', '#B8BEC6', '#6F7782'];
  const gx = -w * 0.8 + clamp(glint) * w * 1.6;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: alpha}}>
      <defs>
        <linearGradient id={`${key}m`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={m[0]} /><stop offset="0.45" stopColor={m[1]} /><stop offset="1" stopColor={m[2]} /></linearGradient>
        <radialGradient id={`${key}g`}><stop offset="0.55" stopColor="#000" stopOpacity={0.5} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
        <filter id={`${key}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={3 + lift * 9} /></filter>
        <clipPath id={`${key}c`}><path d={d} /></clipPath>
      </defs>
      <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>
        <ellipse cx={4} cy={8} rx={(size / 2) * 0.95} ry={(size * h / w / 2) * 0.95} fill={`url(#${key}g)`} opacity={give * 0.55} />
        <g transform={`translate(${6 + lift * 26} ${9 + lift * 34}) scale(${k})`} filter={`url(#${key}b)`} opacity={0.5 - lift * 0.25}><path d={d} fill="#000" stroke="#000" strokeWidth={10} strokeLinejoin="round" /></g>
        <g transform={`scale(${k})`}>
          <path d={d} fill={`url(#${key}m)`} stroke={`url(#${key}m)`} strokeWidth={10} strokeLinejoin="round" />
          <path d={d} fill={`var(--color-${enamel})`} />
          <g clipPath={`url(#${key}c)`}>
            {children}
            {detail && <path d={detail} fill="none" stroke={`url(#${key}m)`} strokeWidth={4.5} strokeLinecap="round" />}
            <ellipse cx={-w * 0.18} cy={-h * 0.22} rx={w * 0.26} ry={h * 0.1} fill="#fff" opacity={0.28} transform={`rotate(-28 ${-w * 0.18} ${-h * 0.22})`} />
            {glint > 0 && glint < 1 && <rect x={gx} y={-h} width={w * 0.14} height={h * 2} fill="#fff" opacity={0.5} transform={`rotate(24 ${gx} 0)`} />}
          </g>
        </g>
      </g>
    </svg>
  );
}

type Props = {shape: string; at: [number, number]; size?: number; enamel?: string; metal?: 'gold' | 'silver'; angle?: number; press?: number; glint?: number};

export function Pin({shape, at, size = 160, enamel = 'cherry', metal = 'gold', angle = 0, press = 1, glint = 1}: Props) {
  return <PinBody d={SHAPES[shape] ?? SHAPES.circle} detail={DETAIL[shape]} at={at} size={size} enamel={enamel} metal={metal} angle={angle} press={press} glint={glint} id={`${shape}${at[0]}${at[1]}`} />;
}
