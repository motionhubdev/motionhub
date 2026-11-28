import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'Felt sheet', 'zh-CN': '换毡'},
  purpose: 'transition',
  line: 'A fresh felt sheet, already pinned with the next scene, slides in over the board from the right, its stitched leading edge casting a soft shadow.',
  fits: 'from one board of pins to the next',
  params: {
    from: {type: 'node', doc: 'the scene being covered'},
    to: {type: 'node', doc: 'the scene on the new sheet'},
    slide: {type: 'progress', doc: '0 to 1 over about 0.6 s'},
  },
  preview: 3.9,
};

const ease = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };

export function Sheet({from, to, slide}: {from: ReactNode; to: ReactNode; slide: number}) {
  const left = 1920 * (1 - ease(slide));
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {from}
      {slide > 0 && <div style={{position: 'absolute', left, top: 0, width: 1920, height: 1080, overflow: 'hidden', boxShadow: '-24px 0 40px rgba(0,0,0,0.45)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>{to}</div>
        <div style={{position: 'absolute', left: 14, top: 0, bottom: 0, width: 0, borderLeft: '4px dashed var(--color-stitch)', opacity: slide < 1 ? 0.6 : 0}} />
      </div>}
    </div>
  );
}
