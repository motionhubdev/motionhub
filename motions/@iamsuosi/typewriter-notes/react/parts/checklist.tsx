import {Typed} from './typed.tsx';
import {titleLines} from './title.tsx';

export const meta = {
  name: {en: 'Typed checklist', 'zh-CN': '打字清单'},
  purpose: 'steps',
  line: 'A heading and a list of empty boxes typed in turn; then, one by one, each box is struck through with a red x as the step is done.',
  fits: 'steps in order; habits or rules; what a method asks; three to six items',
  params: {
    title: {type: 'text', default: '', doc: 'the heading, in capitals with its rule; none without one'},
    items: {type: 'text[]', doc: 'three to six short items, at most 34 characters'},
    typed: {type: 'number', default: 9999, doc: 'keystrokes typed so far'},
    done: {type: 'number', default: 0, doc: 'how many boxes are ticked; animate about one every half second, after the list is typed'},
  },
  preview: 16.2,
};

export const checklistLines = (title: string, items: string[]) => [...(title ? [...titleLines(title), ''] : []), ...items.map((it) => `[ ] ${it}`)];

export function Checklist({title = '', items, typed = 9999, done = 0}: {title?: string; items: string[]; typed?: number; done?: number}) {
  const lines = checklistLines(title, items), first = lines.length - items.length;
  const ticks = items.map((_, i) => ({line: first + i, col: 1, ch: 'x', red: true, age: (done - i) * 4})).filter((_, i) => done > i);
  return <Typed lines={lines} typed={typed} extra={ticks} seed="tw-list" />;
}
