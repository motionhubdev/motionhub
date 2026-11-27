import {Snapshot, span} from './print.tsx';
import {peg} from './peg.ts';

export const meta = {
  name: {en: 'Two prints', 'zh-CN': '双照对比'},
  purpose: 'compare',
  line: 'Two prints pegged side by side on a short string, each with its caption written on and a figure on a tag beneath; the one the comparison favours gets a red pen ring.',
  fits: 'this against that; before and after; two places, two seasons, two shares of a whole',
  params: {
    items: {type: '{picture, caption, tag}[]', doc: 'two of them: a picture name, a few words, and a short figure or word on the tag'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 2 s: the left print develops and is captioned, then the right'},
    mark: {type: '0 | 1 | -1', default: -1, doc: 'the print given the red ring; -1 for neither'},
    ring: {type: 'progress', default: 0, doc: '0 to 1 over about 0.5 s: the ring drawn'},
  },
  preview: 22.3,
};

type Item = {picture: string; caption: string; tag: string};

export function Pair({items, show = 1, mark = -1, ring = 0}: {items: Item[]; show?: number; mark?: number; ring?: number}) {
  const size = 420;
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M300 170 Q960 250 1620 170" stroke="var(--color-string)" strokeWidth={3} fill="none" />
      </svg>
      {items.slice(0, 2).map((it, i) => {
        const cx = i ? 1250 : 670, k = span(show, i * 0.5, i * 0.5 + 0.5), tilt = i ? 2.5 : -2;
        return (
          <div key={i} style={{position: 'absolute', left: cx - size / 2, top: 196, width: size, transformOrigin: '50% 0', transform: `rotate(${tilt}deg)`, opacity: span(show, i * 0.5, i * 0.5 + 0.1)}}>
            <Snapshot picture={it.picture} caption={it.caption} develop={span(k, 0, 0.7)} write={span(k, 0.5, 1)} size={size} mark={i === mark ? ring : 0} />
            <div style={{position: 'absolute', left: size / 2 - 13, top: -48}}>{peg(130)}</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center', opacity: span(k, 0.8, 1)}}>
              <div style={{padding: '6px 22px', background: 'var(--color-tag)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 40, letterSpacing: '0.04em', color: 'var(--color-ink)'}}>{it.tag}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
