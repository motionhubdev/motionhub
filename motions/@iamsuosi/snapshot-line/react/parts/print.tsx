// Snapshot Line's instant print, and what every other part shares: the pictures, the curves, handwriting written in.
import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'Snapshot', 'zh-CN': '快照'},
  purpose: 'term',
  line: 'One square instant print with a white border and a deep bottom edge: its picture develops from flat grey, then its caption is written by hand on the bottom edge.',
  fits: 'the one thing a sentence names; a point of a list held up to look at; a moment of a timeline',
  params: {
    picture: {type: 'sun | cloud | rain | wave | mountain | moon | tree | leaf | cup | house | flower | star', doc: 'what the print shows, drawn in flat shapes'},
    caption: {type: 'text', default: '', doc: 'a few words written on the bottom edge'},
    develop: {type: 'progress', default: 1, doc: '0 to 1 over about 1.2 s: grey, then the picture coming up warm'},
    write: {type: 'progress', default: 1, doc: '0 to 1 over about 0.8 s: the caption written from the left'},
    size: {type: 'px', default: 320, doc: 'the print\'s width'},
    mark: {type: 'progress', default: 0, doc: '0 to 1 over about 0.5 s: a red pen ring drawn round the print\'s picture'},
  },
  preview: 6.5,
};

export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const easeInOut = (x: number) => { const t = clamp(x); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** A print's proportions: picture square, border, deep bottom */
export const PRINT = {border: 0.06, bottom: 0.26};
export const printHeight = (size: number) => size * (1 - 2 * PRINT.border) + size * PRINT.border + size * PRINT.bottom;

/** The pictures, each in a 100 × 100 box of flat shapes */
export function Picture({name}: {name: string}) {
  const C = (n: string) => `var(--color-${n})`;
  const sky = <rect width={100} height={100} fill={C('sky')} />;
  const night = <rect width={100} height={100} fill={C('dusk')} />;
  const ground = <path d="M0 74 Q30 64 55 72 T100 68 V100 H0Z" fill={C('leaf')} />;
  const P: Record<string, ReactNode> = {
    sun: <>{sky}<circle cx={66} cy={36} r={16} fill={C('sun')} /><path d="M0 80 Q25 70 50 78 T100 74 V100 H0Z" fill={C('sea')} /><path d="M0 88 Q25 82 50 88 T100 86 V100 H0Z" fill={C('seaDeep')} /></>,
    cloud: <>{sky}<g fill={C('paper')}><circle cx={38} cy={50} r={14} /><circle cx={54} cy={42} r={18} /><circle cx={70} cy={52} r={12} /><rect x={30} y={50} width={46} height={14} rx={7} /></g></>,
    rain: <>{<rect width={100} height={100} fill={C('rainSky')} />}<g fill={C('paper')} opacity={0.95}><circle cx={40} cy={30} r={13} /><circle cx={56} cy={24} r={16} /><circle cx={70} cy={32} r={11} /><rect x={32} y={30} width={44} height={13} rx={6} /></g>
      <g stroke={C('sea')} strokeWidth={3} strokeLinecap="round">{[34, 46, 58, 70].map((x, i) => <path key={x} d={`M${x} ${52 + (i % 2) * 6} l-4 10 M${x + 4} ${70 + (i % 2) * 4} l-4 10`} />)}</g></>,
    wave: <>{sky}<path d="M0 56 Q16 40 32 52 T64 50 T100 48 V100 H0Z" fill={C('sea')} /><path d="M0 70 Q18 60 36 70 T70 68 T100 66 V100 H0Z" fill={C('seaDeep')} /><path d="M20 47 q6 -6 12 -1" stroke={C('paper')} strokeWidth={3} fill="none" /></>,
    mountain: <>{sky}<path d="M-4 84 L34 30 L52 56 L66 40 L104 84Z" fill={C('stone')} /><path d="M34 30 L26 42 L32 40 L36 46 L42 40Z M66 40 L60 48 L66 46 L70 50 L72 48Z" fill={C('paper')} /><path d="M0 84 Q30 76 50 84 T100 82 V100 H0Z" fill={C('sea')} /></>,
    moon: <>{night}<circle cx={60} cy={40} r={18} fill={C('sun')} /><circle cx={68} cy={34} r={16} fill={C('dusk')} />{[[20, 22], [32, 60], [80, 70], [16, 80], [86, 20]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={1.6} fill={C('paper')} />)}</>,
    tree: <>{sky}{ground}<rect x={47} y={50} width={6} height={26} fill={C('earth')} /><circle cx={50} cy={40} r={20} fill={C('leafDeep')} /><circle cx={40} cy={48} r={12} fill={C('leafDeep')} /><circle cx={60} cy={48} r={12} fill={C('leafDeep')} /></>,
    leaf: <><rect width={100} height={100} fill={C('sun')} /><path d="M24 76 Q20 34 70 24 Q78 66 24 76Z" fill={C('leaf')} /><path d="M24 76 Q46 52 66 30" stroke={C('leafDeep')} strokeWidth={3} fill="none" /></>,
    cup: <><rect width={100} height={100} fill={C('earthLight')} /><path d="M30 44 H66 V64 Q66 78 48 78 Q30 78 30 64Z" fill={C('paper')} /><path d="M66 50 q12 0 12 8 q0 8 -12 8" stroke={C('paper')} strokeWidth={5} fill="none" /><path d="M42 36 q-4 -6 0 -12 M52 36 q-4 -6 0 -12" stroke={C('paper')} strokeWidth={3} fill="none" opacity={0.8} /></>,
    house: <>{sky}{ground}<rect x={32} y={46} width={36} height={30} fill={C('paper')} /><path d="M28 48 L50 30 L72 48Z" fill={C('earth')} /><rect x={46} y={60} width={9} height={16} fill={C('earth')} /></>,
    flower: <>{sky}{ground}<path d="M50 76 V48" stroke={C('leafDeep')} strokeWidth={4} />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={50 + 9 * Math.cos((a * Math.PI) / 180)} cy={40 + 9 * Math.sin((a * Math.PI) / 180)} r={7} fill={C('pen')} />)}<circle cx={50} cy={40} r={5} fill={C('sun')} /></>,
    star: <>{night}<path d="M50 22 L57 42 L78 42 L61 54 L68 74 L50 62 L32 74 L39 54 L22 42 L43 42Z" fill={C('sun')} /></>,
  };
  return <>{P[name] ?? P.sun}</>;
}

/** Hand-written words revealed from the left by `write` */
export function Written({text, write, size, color = 'var(--color-ink)', align = 'center'}: {text: string; write: number; size: number; color?: string; align?: 'center' | 'left'}) {
  const k = clamp(write);
  return (
    <div style={{fontFamily: 'var(--font-hand)', fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textAlign: align,
      clipPath: `inset(-20% ${(1 - k) * 100}% -20% 0)`}}>{text}</div>
  );
}

type Props = {picture: string; caption?: string; develop?: number; write?: number; size?: number; mark?: number};

export function Snapshot({picture, caption = '', develop = 1, write = 1, size = 320, mark = 0}: Props) {
  const b = size * PRINT.border, inner = size - 2 * b, h = printHeight(size), d = easeOut(develop);
  const ring = clamp(mark), circ = Math.PI * (inner * 0.62 + inner * 0.56);
  return (
    <div style={{position: 'relative', width: size, height: h, background: 'var(--color-paper)', borderRadius: size * 0.012,
      boxShadow: '0 10px 18px -8px rgba(0,0,0,0.45), 0 2px 3px rgba(0,0,0,0.2)'}}>
      <svg width={inner} height={inner} viewBox="0 0 100 100" style={{position: 'absolute', left: b, top: b, display: 'block'}}>
        <Picture name={picture} />
        {/* the chemistry: flat grey that clears, warm first, as it develops */}
        <rect width={100} height={100} fill="var(--color-undeveloped)" opacity={1 - d} />
        <rect width={100} height={100} fill="var(--color-sun)" opacity={0.18 * Math.sin(Math.PI * d)} />
        <rect width={100} height={100} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
      </svg>
      {caption && <div style={{position: 'absolute', left: b, right: b, top: b + inner + size * 0.04}}>
        <Written text={caption} write={write} size={Math.min(size * 0.15, inner / (Math.max(6, caption.length) * 0.4))} /></div>}
      {ring > 0 && <svg width={size * 1.3} height={size * 1.3} viewBox={`0 0 ${size * 1.3} ${size * 1.3}`} style={{position: 'absolute', left: -size * 0.15, top: -size * 0.15, overflow: 'visible'}}>
        <ellipse cx={size * 0.65} cy={size * 0.15 + b + inner / 2} rx={inner * 0.62} ry={inner * 0.56} fill="none" stroke="var(--color-pen)" strokeWidth={size * 0.018} strokeLinecap="round"
          strokeDasharray={circ * 1.08} strokeDashoffset={circ * 1.08 * (1 - ring)} transform={`rotate(-14 ${size * 0.65} ${size * 0.15 + b + inner / 2})`} />
      </svg>}
    </div>
  );
}
