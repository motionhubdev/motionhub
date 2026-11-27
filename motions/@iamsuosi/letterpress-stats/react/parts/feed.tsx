import type {ReactNode} from 'react';
import {easeOut, span} from './press.tsx';

export const meta = {
  name: {en: 'Sheet feed', 'zh-CN': '换纸'},
  purpose: 'transition',
  line: 'A fresh sheet is fed in from the bottom over the printed one, its leading edge casting a soft shadow, and the next scene is already printed on it.',
  fits: 'from one sheet to the next: a new headline, a figure, a list',
  params: {
    from: {type: 'node', doc: 'the sheet leaving, as it stands'},
    to: {type: 'node', doc: 'the sheet arriving'},
    feed: {type: 'progress', doc: '0 to 1 over about 0.6 s'},
  },
  preview: 4.1,
};

export function Feed({from, to, feed}: {from: ReactNode; to: ReactNode; feed: number}) {
  const p = easeOut(span(feed, 0, 1)), y = 1080 * (1 - p);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-60 * p}px)`, filter: `brightness(${1 - 0.06 * p})`}}>{from}</div>
      {p > 0 && (
        <div style={{position: 'absolute', left: 0, top: y, width: 1920, height: 1080, overflow: 'hidden', boxShadow: '0 -18px 40px rgba(60, 44, 20, 0.22)'}}>
          <div style={{position: 'absolute', left: 0, top: -y, width: 1920, height: 1080, transform: `translateY(${y}px)`}}>{to}</div>
        </div>
      )}
    </div>
  );
}
