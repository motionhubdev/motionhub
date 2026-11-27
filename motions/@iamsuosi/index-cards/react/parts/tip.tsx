import type {ReactNode} from 'react';
import {Card, easeOut, line, span} from './desk.tsx';

export const meta = {
  name: {en: 'Do and don\'t', 'zh-CN': '对与错'},
  purpose: 'compare',
  line: 'Two cards dealt side by side, each with a drawing and a short line: the right way gets a green tick drawn over its corner, the wrong way a terracotta cross.',
  fits: 'the right and the wrong way to do a step; two sizes, two methods, two settings',
  params: {
    good: {type: '{text, art}', doc: 'the right way: a short line and a drawing (300 × 260)'},
    bad: {type: '{text, art}', doc: 'the wrong way'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.4 s: the cards are dealt, then the tick and the cross are drawn'},
  },
  preview: 15.5,
};

type Side = {text: string; art?: ReactNode};

export function Tip({good, bad, show = 1}: {good: Side; bad: Side; show?: number}) {
  const sides: [Side, boolean][] = [[good, true], [bad, false]];
  return (
    <>
      {sides.map(([s, ok], i) => {
        const k = easeOut(span(show, i * 0.2, 0.4 + i * 0.2)), mark = span(show, 0.6 + i * 0.15, 0.85 + i * 0.15);
        return (
          <Card key={i} w={720} h={560} style={{left: 180 + i * 840, top: 280 + (1 - k) * 600, transform: `rotate(${(i ? 1.6 : -1.4) * k}deg)`}} lift={0.2}>
            <div style={{position: 'absolute', left: 40, top: 30, fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, color: ok ? 'var(--color-done)' : 'var(--color-accent)'}}>{ok ? 'Do' : 'Don\'t'}</div>
            <div style={{position: 'absolute', left: 210, top: 140, width: 300, height: 260}}>{s.art}</div>
            <div style={{position: 'absolute', left: 40, top: 430, width: 640, textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 38, fontWeight: 700, color: 'var(--color-ink)'}}>{s.text}</div>
            <svg width={140} height={140} viewBox="0 0 140 140" style={{position: 'absolute', right: 26, top: 14, overflow: 'visible'}}>
              {ok ? <path d="M22 74 L58 108 L122 26" stroke="var(--color-done)" strokeWidth={14} {...line(mark)} />
                : <><path d="M28 28 L112 112" stroke="var(--color-accent)" strokeWidth={14} {...line(mark * 2)} /><path d="M112 28 L28 112" stroke="var(--color-accent)" strokeWidth={14} {...line(mark * 2 - 1)} /></>}
            </svg>
          </Card>
        );
      })}
    </>
  );
}
