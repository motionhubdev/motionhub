import type {ReactNode} from 'react';
import {Card, easeOut, span} from './desk.tsx';
import {Stamp} from './stamp.tsx';

export const meta = {
  name: {en: 'Done card', 'zh-CN': '完成卡'},
  purpose: 'close',
  line: 'The last card, alone on the desk: the finished result drawn large, one line saying what it is, and a round stamp pressed onto its corner.',
  fits: 'the end of a how-to: the finished thing, held for a moment',
  params: {
    text: {type: 'text', doc: 'what is done, in a few words'},
    art: {type: 'node', default: null, doc: 'the finished result, drawn in a 560 × 420 box'},
    word: {type: 'text', default: 'done', doc: 'the stamp\'s word'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.4 s: the card is laid, then the stamp comes down'},
  },
  preview: 20.5,
};

export function Done({text, art = null, word = 'done', show = 1}: {text: string; art?: ReactNode; word?: string; show?: number}) {
  const k = easeOut(span(show, 0, 0.4));
  return (
    <>
      <Card style={{left: 440, top: 230 + (1 - k) * 60, transform: `rotate(${1.2 * k}deg)`, opacity: Math.min(1, k * 2)}} lift={0.15}>
        <div style={{position: 'absolute', left: 240, top: 120, width: 560, height: 420}}>{art}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 58, fontWeight: 700, color: 'var(--color-ink)'}}>{text}</div>
      </Card>
      <Stamp word={word} at={[1370, 760]} size={230} press={span(show, 0.6, 0.85)} />
    </>
  );
}
