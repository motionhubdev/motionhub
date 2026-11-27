import {CANVAS, PressLine, Speckle, fit, measure, span} from './press.tsx';

export const meta = {
  name: {en: 'Versus', 'zh-CN': '对照'},
  purpose: 'compare',
  line: 'Two figures or words side by side in wood type, each over a small metal-type label, a vermilion leaf between them; the second is pressed after the first.',
  fits: 'then and now; two counts; a claim against its correction',
  params: {
    items: {type: '{value, label}[]', doc: 'two of them: a short figure or word, and a label under it'},
    accent: {type: '0 | 1 | -1', default: 1, doc: 'which value is printed in vermilion; -1 for neither'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 2 s: the left one is set and pressed, then the right'},
    y: {type: 'px', default: 620, doc: 'the values\' baseline'},
  },
  preview: 10.8,
};

type Item = {value: string; label: string};

export function Versus({items, accent = 1, show = 1, y = 620}: {items: Item[]; accent?: number; show?: number; y?: number}) {
  const two = items.slice(0, 2), colW = 740;
  const s = Math.min(...two.map((it) => fit(it.value, colW, 380)));
  const left = [140, 1040];
  return (
    <svg {...CANVAS}>
      <Speckle />
      {two.map((it, i) => {
        const a = i * 0.5, set = span(show, a, a + 0.32), press = span(show, a + 0.36, a + 0.46);
        const cx = left[i] + (colW - measure(it.value, s)) / 2;
        return (
          <g key={i}>
            <PressLine text={it.value} x={cx} y={y} size={s} set={set} press={press} colorOf={() => (accent === i ? 'var(--color-vermilion)' : 'var(--color-ink)')} />
            <text x={left[i] + colW / 2} y={y + 90} textAnchor="middle" fontSize={38} fill="var(--color-ink)" opacity={span(press, 0.3, 1)}
              style={{fontFamily: 'var(--font-text)', fontStyle: 'italic'}}>{it.label}</text>
          </g>
        );
      })}
      <g opacity={span(show, 0.3, 0.45)} transform={`translate(960 ${y - s * 0.32}) scale(56)`}>
        <path d="M0 -0.5 C0.32 -0.32 0.34 0.12 0 0.5 C-0.34 0.12 -0.32 -0.32 0 -0.5 Z" fill="var(--color-vermilion)" filter="url(#lp-speckle)" />
      </g>
    </svg>
  );
}
