import type {ReactNode} from 'react';
import {clamp, easeInOut} from './print.tsx';

export const meta = {
  name: {en: 'Pull through', 'zh-CN': '拉过换场'},
  purpose: 'transition',
  line: 'The whole wall slides away to the left as if the string were pulled hard, and the next scene slides in behind it from the right.',
  fits: 'between scenes; from a title to a line of prints; to the close',
  params: {
    from: {type: 'node', doc: 'the scene leaving'},
    to: {type: 'node', doc: 'the scene arriving'},
    go: {type: 'progress', doc: '0 to 1 over about 0.7 s'},
  },
  preview: 3.55,
};

export function Pull({from, to, go}: {from: ReactNode; to: ReactNode; go: number}) {
  const k = easeInOut(clamp(go)), x = -1920 * k;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: x, top: 0, width: 1920, height: 1080}}>{from}</div>
      <div style={{position: 'absolute', left: x + 1920, top: 0, width: 1920, height: 1080}}>{to}</div>
    </div>
  );
}
