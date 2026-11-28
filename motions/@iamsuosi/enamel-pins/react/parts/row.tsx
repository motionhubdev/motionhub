import {Pin} from './pin.tsx';
import {Banner} from './banner.tsx';

export const meta = {
  name: {en: 'Pin row', 'zh-CN': '徽章排'},
  purpose: 'steps',
  line: 'Three or four pins in a row across the felt, each with a small banner under it naming it, pressed in one after another.',
  fits: 'three or four benefits, steps or parts in order; what something does, one emblem each',
  params: {
    items: {type: '{shape, enamel, label}[]', doc: 'three or four: a Pin shape, its enamel and a word or two for its banner'},
    shown: {type: 'number', default: 99, doc: 'how many have been pressed in; a fraction is the next one pressing (about 0.4 s each)'},
    y: {type: 'px', default: 470, doc: 'the pins\' centre line'},
  },
  preview: 10.8,
};

type Item = {shape: string; enamel: string; label: string};

export function PinRow({items, shown = 99, y = 470}: {items: Item[]; shown?: number; y?: number}) {
  const n = items.length, gap = 1600 / n;
  return (
    <>
      {items.map((it, i) => {
        const x = 160 + gap * (i + 0.5), p = Math.max(0, Math.min(1, shown - i)), tilt = [-6, 5, -3, 7][i % 4];
        return (
          <div key={i}>
            <Pin shape={it.shape} enamel={it.enamel} at={[x, y]} size={300} angle={tilt} press={Math.min(1, p * 1.6)} glint={Math.max(0, p * 1.6 - 0.6)} />
            <Banner lines={[it.label]} at={[x, y + 260]} width={Math.min(gap - 60, 420)} angle={-tilt / 2} press={Math.max(0, p * 1.6 - 0.45)} glint={1} />
          </div>
        );
      })}
    </>
  );
}
