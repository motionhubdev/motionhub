import {Receipt, type Line} from './receipt.tsx';

export const meta = {
  name: {en: 'Title stub', 'zh-CN': '标题小票'},
  purpose: 'title',
  line: 'A short receipt whose print is the title: a small heading, the question in large bold capitals line by line, a rule of bars, a small note.',
  fits: 'the question a film opens on; a chapter title; what a list is about',
  params: {
    kicker: {type: 'text', default: '', doc: 'a small centred line at the top: a section, a date'},
    title: {type: 'text[]', doc: 'the title, one short line each (about 14 characters a line at the default size)'},
    note: {type: 'text', default: '', doc: 'a small line under the rule'},
    fed: {type: 'number', default: 99, doc: 'lines out of the mouth, as Receipt'},
    tear: {type: 'progress', default: 0, doc: 'as Receipt: torn off and lifted away'},
    x: {type: 'px', default: 540, doc: 'the paper\'s left edge'},
    width: {type: 'px', default: 840, doc: 'its width'},
  },
  preview: 3.0,
};

export function stubLines(kicker: string, title: string[], note: string): Line[] {
  return [
    ...(kicker ? [{text: kicker, align: 'center', small: true} as Line, {rule: 'dash'} as Line] : []),
    {gap: 0.4},
    ...title.map((t) => ({text: t, align: 'center', big: true}) as Line),
    {gap: 0.4}, {rule: 'code'},
    ...(note ? [{text: note, align: 'center', small: true} as Line] : []),
    {gap: 0.6},
  ];
}

export function Stub({kicker = '', title, note = '', fed = 99, tear = 0, x = 540, width = 840}: {kicker?: string; title: string[]; note?: string; fed?: number; tear?: number; x?: number; width?: number}) {
  return <Receipt lines={stubLines(kicker, title, note)} fed={fed} tear={tear} x={x} width={width} size={42} seed={`stub${title.join('')}`} />;
}
