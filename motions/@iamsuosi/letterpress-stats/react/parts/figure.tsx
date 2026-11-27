import {CANVAS, PressLine, Speckle, fit, measure, span} from './press.tsx';

export const meta = {
  name: {en: 'Big figure', 'zh-CN': '大数字'},
  purpose: 'data',
  line: 'One number set very large in wood type and pressed, its unit beside it in vermilion, and what it counts under it in small metal type between two rules.',
  fits: 'the one figure a scene turns on: a count, a year, a size, a price; with its source under it',
  params: {
    value: {type: 'text', doc: 'the figure as it should print: 42, 1455, 3.2'},
    unit: {type: 'text', default: '', doc: 'a short unit or word after it, in vermilion: LINES, %, KM'},
    label: {type: 'text', default: '', doc: 'what it counts and where it comes from, small, under it'},
    set: {type: 'progress', default: 1, doc: '0 to 1 over about 0.8 s: the sorts slide in'},
    press: {type: 'progress', default: 1, doc: '0 to 1 over 0.22 s: the press comes down; the label prints with it'},
    x: {type: 'px', default: 140, doc: 'the left edge'},
    y: {type: 'px', default: 690, doc: 'the figure\'s baseline'},
    size: {type: 'px', default: 520, doc: 'the figure\'s size; it shrinks to fit the width'},
  },
  preview: 6.2,
};

export function Figure({value, unit = '', label = '', set = 1, press = 1, x = 140, y = 690, size = 520}: {value: string; unit?: string; label?: string; set?: number; press?: number; x?: number; y?: number; size?: number}) {
  const s = Math.min(size, fit(value + (unit ? '  ' : '') + unit, 1640, size));
  const us = s * 0.34, ux = x + measure(value, s) + s * 0.12;
  const ink = span(press, 0.2, 0.75);

  return (
    <svg {...CANVAS}>
      <Speckle />
      <PressLine text={value} x={x} y={y} size={s} set={set} press={press} />
      {unit && <PressLine text={unit} x={ux} y={y} size={us} set={span(set, 0.4, 1)} press={press} colorOf={() => 'var(--color-vermilion)'} />}
      {label && (
        <g opacity={ink}>
          <rect x={x} y={y + 50} width={1640} height={3} fill="var(--color-ink)" />
          <text x={x} y={y + 106} fontSize={36} fill="var(--color-ink)" style={{fontFamily: 'var(--font-text)', fontStyle: 'italic'}}>{label}</text>
          <rect x={x} y={y + 134} width={1640} height={1.5} fill="var(--color-ink)" />
        </g>
      )}
    </svg>
  );
}
