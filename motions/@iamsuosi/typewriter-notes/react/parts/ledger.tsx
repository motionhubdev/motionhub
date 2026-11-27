import {COLS, Typed} from './typed.tsx';
import {titleLines} from './title.tsx';

export const meta = {
  name: {en: 'Typed ledger', 'zh-CN': '打字账目'},
  purpose: 'data',
  line: 'Rows of a typed account: a name, dot leaders run out by the full stop, its figure set right; a rule of hyphens, and the total typed in red.',
  fits: 'a budget, a cost, a count broken into parts; a small table of real figures with their sum',
  params: {
    title: {type: 'text', default: '', doc: 'the heading; none without one'},
    rows: {type: '{label, value}[]', doc: 'up to seven rows: a short name and its figure, as written in the source'},
    total: {type: '{label, value}', default: null, doc: 'the sum, typed in red under a rule; none without one'},
    typed: {type: 'number', default: 9999, doc: 'keystrokes typed so far'},
  },
  preview: 23.6,
};

type Row = {label: string; value: string};

export const ledgerLines = (title: string, rows: Row[], total?: Row | null) => [
  ...(title ? [...titleLines(title), ''] : []),
  ...rows.map((r) => `${r.label} | ${r.value}`),
  ...(total ? ['-'.repeat(COLS), `${total.label.toUpperCase()} | {${total.value}}`] : []),
];

export function Ledger({title = '', rows, total = null, typed = 9999}: {title?: string; rows: Row[]; total?: Row | null; typed?: number}) {
  return <Typed lines={ledgerLines(title, rows, total)} typed={typed} seed="tw-ledger" />;
}
