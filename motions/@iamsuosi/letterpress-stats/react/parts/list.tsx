import {CANVAS, Speckle, span} from './press.tsx';

export const meta = {
  name: {en: 'Galley list', 'zh-CN': '排版清单'},
  purpose: 'steps',
  line: 'A column of metal type like a proof pulled from a galley: numbered rows with dot leaders to their value, each row printed in turn; one row may be marked by a vermilion pointing hand.',
  fits: 'three to six steps, parts, dates or prices in order; a contents page; a ranking',
  params: {
    rows: {type: '{label, value}[]', doc: 'up to six rows: a short label and a short value'},
    shown: {type: 'number', default: 99, doc: 'how many rows are printed; a fraction is the next row coming in (about 0.35 s a row)'},
    mark: {type: 'number', default: -1, doc: 'the row the vermilion hand points at; -1 for none'},
    title: {type: 'text', default: '', doc: 'a small capital heading over the column'},
    x: {type: 'px', default: 340, doc: 'the column\'s left edge'},
    y: {type: 'px', default: 300, doc: 'the first row\'s baseline'},
    width: {type: 'px', default: 1240, doc: 'the column\'s width'},
  },
  preview: 15.5,
};

type Row = {label: string; value: string};
const HAND = 'M0 0 L-0.38 -0.07 Q-0.44 -0.1 -0.5 -0.12 L-0.62 -0.14 Q-0.72 -0.17 -0.86 -0.13 L-1 -0.1 L-1 0.2 L-0.86 0.22 Q-0.74 0.27 -0.62 0.24 L-0.48 0.22 Q-0.42 0.2 -0.44 0.15 L-0.52 0.13 Q-0.46 0.1 -0.5 0.06 L-0.56 0.05 Q-0.5 0.02 -0.52 -0.02 L-0.4 -0.03 L-0.02 0.04 Q0.04 0.02 0 0 Z';

export function List({rows, shown = 99, mark = -1, title = '', x = 340, y = 300, width = 1240}: {rows: Row[]; shown?: number; mark?: number; title?: string; x?: number; y?: number; width?: number}) {
  const lh = 112, size = 62;
  const text = {fontFamily: 'var(--font-text)'} as const;
  return (
    <svg {...CANVAS}>
      <Speckle />
      {title && <text x={x} y={y - 110} fontSize={30} fill="var(--color-vermilion)" letterSpacing="0.22em" style={text}>{title.toUpperCase()}</text>}
      {title && <rect x={x} y={y - 86} width={width} height={2} fill="var(--color-ink)" opacity={0.8} />}
      {rows.slice(0, 6).map((r, i) => {
        const p = span(shown, i, i + 1), by = y + i * lh;
        if (p <= 0) return null;
        const ink = span(p, 0.25, 0.8), kiss = p < 1 ? 1 + 0.015 * Math.sin(Math.PI * p) : 1;
        return (
          <g key={i} opacity={0.15 + 0.85 * ink} transform={`translate(${x} ${by}) scale(${kiss}) translate(${-x} ${-by})`} filter="url(#lp-speckle)">
            <text x={x} y={by} fontSize={size * 0.62} fill="var(--color-muted)" style={text}>{String(i + 1).padStart(2, '0')}</text>
            <text x={x + 90} y={by} fontSize={size} fill="var(--color-ink)" style={text}>{r.label}</text>
            <text x={x + width} y={by} fontSize={size} fill="var(--color-ink)" textAnchor="end" style={{...text, fontStyle: 'italic'}}>{r.value}</text>
            <line x1={x + 90} x2={x + width} y1={by + 26} y2={by + 26} stroke="var(--color-ink)" strokeWidth={4} strokeDasharray="0 18" strokeLinecap="round" opacity={0.45} />
          </g>
        );
      })}
      {mark >= 0 && span(shown, mark + 0.6, mark + 1) > 0 && (
        <path d={HAND} transform={`translate(${x - 40} ${y + mark * lh - 20}) scale(${110})`} fill="var(--color-vermilion)" filter="url(#lp-speckle)" opacity={span(shown, mark + 0.6, mark + 1)} />
      )}
    </svg>
  );
}
