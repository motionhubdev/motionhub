import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'Switch off, switch on', 'zh-CN': '关灯换场'},
  purpose: 'transition',
  line: 'The sign is switched off in one click and the wall goes dark; a beat later the next sign\'s tubes warm on out of the dark.',
  fits: 'from one sign to the next; a new section; the end of a film',
  params: {
    from: {type: 'node', doc: 'the scene switched off'},
    to: {type: 'node', doc: 'the scene that comes on; its tubes light by their own on'},
    p: {type: 'progress', doc: '0 to 1 over about 0.7 s: off at 0.1, dark until 0.4, the wall back by 1'},
  },
  preview: 4.55,
};

export function Switch({from, to, p}: {from: ReactNode; to: ReactNode; p: number}) {
  const dark = p < 0.1 ? 0 : p < 0.4 ? 0.94 : 0.94 * (1 - (p - 0.4) / 0.6) ** 1.5;
  return (
    <>
      {p < 0.4 ? from : to}
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dark}} />
    </>
  );
}
