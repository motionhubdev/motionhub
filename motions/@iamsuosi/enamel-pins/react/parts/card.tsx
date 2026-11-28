import {Banner} from './banner.tsx';

export const meta = {
  name: {en: 'Backing card', 'zh-CN': '背卡'},
  purpose: 'close',
  line: 'A pin\'s backing card slides up onto the felt, a hang hole at its top; the name, as a banner pin, is pressed into it and one line is printed under it.',
  fits: 'the end of a promo: a name and a line; the takeaway as something to keep',
  params: {
    name: {type: 'text[]', doc: 'the name or takeaway, one or two short lines, set as a banner pin'},
    line: {type: 'text', default: '', doc: 'one line printed on the card under it'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.4 s: the card slides up, the pin is pressed in, the line appears'},
  },
  preview: 19.8,
};

const span = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const out = (x: number) => 1 - (1 - x) ** 3;

export function Card({name, line = '', show = 1}: {name: string[]; line?: string; show?: number}) {
  const rise = out(span(show, 0, 0.45)), y = 120 + (1 - rise) * 1000;
  return (
    <>
      <div style={{position: 'absolute', left: 560, top: y, width: 800, height: 880, background: 'var(--color-card)', borderRadius: 28, boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
        <div style={{position: 'absolute', left: 340, top: 40, width: 120, height: 38, borderRadius: 19, background: 'var(--color-felt)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.45)'}} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 110, height: 2, borderTop: '3px dashed var(--color-cardInk)', opacity: 0.25}} />
        {line && <div style={{position: 'absolute', left: 60, right: 60, top: 640, textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 40, fontWeight: 600, color: 'var(--color-cardInk)', opacity: span(show, 0.75, 1)}}>{line}</div>}
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 50, textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-cardInk)', opacity: 0.6}}>Hard enamel · gold plated</div>
      </div>
      <Banner lines={name} at={[960, y + 400]} width={660} angle={-4} press={span(show, 0.5, 0.75)} glint={span(show, 0.75, 1)} />
    </>
  );
}
