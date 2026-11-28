import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'New sheet', 'zh-CN': '贴新纸'},
  purpose: 'transition',
  line: 'A fresh sheet of kraft, already holding the next scene, comes down over the wall from above with its shadow, and is taped at its four corners.',
  fits: 'from one wall to the next: a new part, a new question; nothing on the old wall is torn down',
  params: {
    from: {type: 'node', doc: 'the wall being covered'},
    to: {type: 'node', doc: 'the next scene, drawn with Wall corners so its corner tapes stay'},
    drop: {type: 'progress', doc: '0 to 1 over about 0.5 s: the sheet comes down; its corners are taped by the next scene\'s Wall'},
  },
  preview: 5.05,
};

const ease = (x: number) => { const t = Math.max(0, Math.min(1, x)); return 1 - (1 - t) ** 3; };

export function NewSheet({from, to, drop}: {from: ReactNode; to: ReactNode; drop: number}) {
  const y = -1100 * (1 - ease(drop));
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {from}
      <div style={{position: 'absolute', left: 0, top: y, width: 1920, height: 1080, boxShadow: '0 30px 50px rgba(40,20,0,0.45)', overflow: 'hidden'}}>{to}</div>
    </div>
  );
}
