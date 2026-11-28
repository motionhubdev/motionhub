import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'Sheet out, sheet in', 'zh-CN': '抽纸换纸'},
  purpose: 'transition',
  line: 'The finished sheet is pulled up and out of the machine in one quick draw, and a fresh one is rolled up from behind the platen.',
  fits: 'from one sheet of notes to the next; a new section; from a quotation to a list',
  params: {
    from: {type: 'node', doc: 'the sheet leaving (a Typed block with its paper)'},
    to: {type: 'node', doc: 'the sheet arriving'},
    p: {type: 'progress', doc: '0 to 1 over about 1 s: out in the first half, in over the second'},
  },
  preview: 9.3,
};

const c = (v: number) => Math.max(0, Math.min(1, v));

export function Feed({from, to, p}: {from: ReactNode; to: ReactNode; p: number}) {
  const out = c(p / 0.45) ** 2.2, inn = 1 - (1 - c((p - 0.5) / 0.5)) ** 3;
  return (
    <>
      {p < 0.45 && <div style={{position: 'absolute', inset: 0, transform: `translateY(${-1150 * out}px) rotate(${-1.2 * out}deg)`}}>{from}</div>}
      {p > 0.5 && <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 228px 0)'}}><div style={{position: 'absolute', inset: 0, transform: `translateY(${560 * (1 - inn)}px)`}}>{to}</div></div>}
    </>
  );
}
