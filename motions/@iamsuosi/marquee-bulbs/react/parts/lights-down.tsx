import type {ReactNode} from 'react';
import {clamp} from './bulbs.tsx';

export const meta = {
  name: {en: 'Lights down', 'zh-CN': '熄灯换场'},
  purpose: 'transition',
  line: 'The street goes dark from left to right as if the sign were switched off at its board, then the next scene comes up from left to right out of the dark.',
  fits: 'between scenes; from one sign to the next; to the closing plaque',
  params: {
    from: {type: 'node', doc: 'the scene leaving'},
    to: {type: 'node', doc: 'the scene arriving'},
    go: {type: 'progress', doc: '0 to 1 over about 0.6 s: dark over the first half, up again over the second'},
  },
  preview: 5.95,
};

export function LightsDown({from, to, go}: {from: ReactNode; to: ReactNode; go: number}) {
  const t = clamp(go), first = t < 0.5, k = first ? t / 0.5 : (t - 0.5) / 0.5;
  // a soft edge of dark moving across: the part it has passed is unlit
  const edge = -20 + k * 140;
  const mask = first
    ? `linear-gradient(90deg, var(--color-night) ${edge - 20}%, transparent ${edge + 20}%)`
    : `linear-gradient(90deg, transparent ${edge - 20}%, var(--color-night) ${edge + 20}%)`;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {first ? from : to}
      <div style={{position: 'absolute', inset: 0, background: mask}} />
    </div>
  );
}
