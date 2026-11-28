import {seededRandom} from '@motionhub/runtime';

export const meta = {
  name: {en: 'Pencil note', 'zh-CN': '铅笔批注'},
  purpose: 'link',
  line: 'A few words written in soft pencil in the margin, slightly tilted, and a loose pencil arrow from them to the typed word they are about.',
  fits: 'the reader\'s own thought beside a quotation; why a line matters; a cross-reference',
  params: {
    text: {type: 'text', doc: 'two to six words'},
    at: {type: '[x, y]', doc: 'where the note\'s baseline starts, in the margin'},
    to: {type: '[x, y]', default: null, doc: 'what it points at; no arrow without one'},
    tilt: {type: 'degrees', default: -4, doc: 'the note\'s slant'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.2 s: the words are written left to right, then the arrow is drawn'},
    size: {type: 'px', default: 56, doc: 'the writing\'s size'},
  },
  preview: 8.8,
};

type Pt = [number, number];

export function Pencil({text, at, to = null, tilt = -4, show = 1, size = 56}: {text: string; at: Pt; to?: Pt | null; tilt?: number; show?: number; size?: number}) {
  const w = text.length * size * 0.36, write = Math.min(1, show / 0.7), draw = Math.max(0, (show - 0.7) / 0.3);
  const r = seededRandom(`pencil:${text}`);
  const id = `pc-${text.replace(/\W/g, '').slice(0, 10)}`;
  let arrow = '', head = '';
  if (to) {
    // from the note's nearer end, bowed a little to one side
    const left = to[0] < at[0], up = to[1] < at[1] - size;
    const sx = left ? at[0] - 10 : at[0] + w * 0.5, sy = up ? at[1] - size * 0.6 : at[1] - size * 0.25;
    const len = Math.hypot(to[0] - sx, to[1] - sy) || 1, bow = 0.18 * len * (0.8 + r() * 0.4);
    const mx = (sx + to[0]) / 2 + ((to[1] - sy) / len) * bow, my = (sy + to[1]) / 2 - ((to[0] - sx) / len) * bow;
    arrow = `M${sx} ${sy} Q${mx} ${my} ${to[0]} ${to[1]}`;
    const ang = Math.atan2(to[1] - my, to[0] - mx), a1 = ang + 2.6, a2 = ang - 2.6;
    head = `M${to[0] + 26 * Math.cos(a1)} ${to[1] + 26 * Math.sin(a1)} L${to[0]} ${to[1]} L${to[0] + 26 * Math.cos(a2)} ${to[1] + 26 * Math.sin(a2)}`;
  }
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id={id}><rect x={at[0] - 20} y={at[1] - size * 1.2} width={(w + 40) * write} height={size * 1.8} transform={`rotate(${tilt} ${at[0]} ${at[1]})`} /></clipPath>
        <filter id={`${id}-g`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="5" result="n" />
          <feComponentTransfer in="n" result="a"><feFuncA type="linear" slope="2.4" intercept="-0.7" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="a" operator="out" />
        </filter>
      </defs>
      <g filter={`url(#${id}-g)`} opacity={0.88}>
        <text x={at[0]} y={at[1]} fontSize={size} fill="var(--color-pencil)" clipPath={`url(#${id})`} transform={`rotate(${tilt} ${at[0]} ${at[1]})`}
          style={{fontFamily: 'var(--font-hand)'}}>{text}</text>
        {to && draw > 0 && <path d={arrow} pathLength={1} strokeDasharray={`${draw} 1`} stroke="var(--color-pencil)" strokeWidth={3.2} fill="none" strokeLinecap="round" />}
        {to && draw >= 1 && <path d={head} stroke="var(--color-pencil)" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </g>
    </svg>
  );
}
