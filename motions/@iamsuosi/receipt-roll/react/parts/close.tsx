import {Receipt, type Line} from './receipt.tsx';

export const meta = {
  name: {en: 'Last stub', 'zh-CN': '结尾小票'},
  purpose: 'close',
  line: 'The last print: a row of stars, a name in large bold capitals, one plain line, a rule of bars and a small closing note, then the paper stops.',
  fits: 'the end of a film: a name, a takeaway, where to find more',
  params: {
    name: {type: 'text', doc: 'a short name or the one thing to remember, up to about 14 characters a line'},
    line: {type: 'text', default: '', doc: 'one plain line under it'},
    note: {type: 'text', default: '', doc: 'a small closing note at the bottom'},
    fed: {type: 'number', default: 99, doc: 'lines out of the mouth, as Receipt'},
  },
  preview: 21.0,
};

export function LastStub({name, line = '', note = '', fed = 99}: {name: string; line?: string; note?: string; fed?: number}) {
  const lines: Line[] = [{rule: 'stars'}, {gap: 0.3}, {text: name, align: 'center', big: true}, ...(line ? [{text: line, align: 'center'} as Line] : []),
    {gap: 0.3}, {rule: 'code'}, ...(note ? [{text: note, align: 'center', small: true} as Line] : []), {rule: 'stars'}, {gap: 0.6}];
  return <Receipt lines={lines} fed={fed} x={540} width={840} size={42} seed={`last${name}`} />;
}
