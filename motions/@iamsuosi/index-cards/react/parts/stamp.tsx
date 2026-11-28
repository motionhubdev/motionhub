import {span} from './desk.tsx';

export const meta = {
  name: {en: 'Rubber stamp', 'zh-CN': '印章'},
  purpose: 'mark',
  line: 'A round rubber stamp in terracotta ink pressed onto a card at an angle: a word in capitals round a ring, a little uneven where the ink was thin.',
  fits: 'marking a step or a result done, checked, ready or tested',
  params: {
    word: {type: 'text', doc: 'one short word, in capitals'},
    at: {type: '[x, y]', doc: 'its centre'},
    size: {type: 'px', default: 220, doc: 'its diameter'},
    tilt: {type: 'degrees', default: -14, doc: 'its angle'},
    press: {type: 'progress', default: 1, doc: '0 to 1 over 0.3 s: it comes down from larger and lands'},
  },
  preview: 20.5,
};

export function Stamp({word, at, size = 220, tilt = -14, press = 1}: {word: string; at: [number, number]; size?: number; tilt?: number; press?: number}) {
  if (press <= 0) return null;
  const k = span(press, 0, 0.6), s = 1 + 0.5 * (1 - k) ** 2, r = size / 2;
  return (
    <svg width={size + 40} height={size + 40} viewBox={`${-r - 20} ${-r - 20} ${size + 40} ${size + 40}`}
      style={{position: 'absolute', left: at[0] - r - 20, top: at[1] - r - 20, overflow: 'visible', transform: `rotate(${tilt}deg) scale(${s})`, opacity: k < 1 ? 0.4 + 0.6 * k : 1}}>
      <defs>
        <filter id="ic-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08 0.6" numOctaves="2" seed="5" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 2.6" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
      <g filter="url(#ic-ink)" fill="none" stroke="var(--color-accent)">
        <circle r={r - 6} strokeWidth={10} />
        <circle r={r - 26} strokeWidth={4} />
        <text x={0} y={size * 0.09} textAnchor="middle" fontSize={size * 0.26} fill="var(--color-accent)" stroke="none" style={{fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em'}}>{word.toUpperCase()}</text>
      </g>
    </svg>
  );
}
