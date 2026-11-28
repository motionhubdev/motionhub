import {CANVAS, PressLine, Speckle, measure, span} from './press.tsx';

export const meta = {
  name: {en: 'Colophon', 'zh-CN': '版记'},
  purpose: 'close',
  line: 'A printer\'s closing mark: a small name in wood type pressed in the middle of a quiet sheet, a vermilion rule under it and one line of italic metal type.',
  fits: 'the last seconds of a film: its name, who made it, a date or an address',
  params: {
    name: {type: 'text', doc: 'a short name, set in wood type'},
    line: {type: 'text', default: '', doc: 'one line under it, in italic metal type'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: the name is set and pressed, then the rule and the line print'},
  },
  preview: 20.5,
};

export function Colophon({name, line = '', show = 1}: {name: string; line?: string; show?: number}) {
  const size = 120, w = measure(name, size), x = 960 - w / 2;
  return (
    <svg {...CANVAS}>
      <Speckle />
      <PressLine text={name} x={x} y={540} size={size} set={span(show, 0, 0.55)} press={span(show, 0.6, 0.8)} />
      <rect x={960 - 90 * span(show, 0.75, 0.95)} y={590} width={180 * span(show, 0.75, 0.95)} height={6} fill="var(--color-vermilion)" filter="url(#lp-speckle)" />
      {line && <text x={960} y={666} textAnchor="middle" fontSize={36} fill="var(--color-ink)" opacity={span(show, 0.8, 1)} style={{fontFamily: 'var(--font-text)', fontStyle: 'italic'}}>{line}</text>}
    </svg>
  );
}
