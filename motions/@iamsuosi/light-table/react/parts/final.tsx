import type {ReactNode} from 'react';
import {Mount} from './pair.tsx';
import {Scrawl, span} from './table.tsx';

export const meta = {
  name: {en: 'Last slide', 'zh-CN': '最后一张'},
  purpose: 'close',
  line: 'Everything is cleared but one slide, centred on the light; the room darkens round it and one line is written under it.',
  fits: 'the result a film ends on, with its last word: the after, kept',
  params: {
    children: {type: 'node', doc: 'the picture kept, drawn into the slide\'s window'},
    label: {type: 'text', default: '', doc: 'the word on the mount'},
    line: {type: 'text', default: '', doc: 'one line written under it'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.5 s: the slide is laid, the room darkens, the line is written'},
  },
  preview: 21.5,
};

export function Final({children, label = '', line = '', show = 1}: {children?: ReactNode; label?: string; line?: string; show?: number}) {
  const lay = span(show, 0, 0.3), dark = span(show, 0.3, 0.7);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 34% 40% at 50% 46%, rgba(23,25,29,0) 70%, rgba(23,25,29,0.82) 100%)', opacity: dark}} />
      <div style={{opacity: lay}}><Mount x={580} y={200 - 30 * (1 - lay)} label={label} labelColor="var(--color-after)" write={span(show, 0.25, 0.45)}>{children}</Mount></div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Scrawl text={line} x={960} y={880} size={56} anchor="middle" p={span(show, 0.6, 1)} />
      </svg>
    </div>
  );
}
