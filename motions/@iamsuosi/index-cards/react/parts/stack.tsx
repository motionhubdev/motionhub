import type {ReactNode} from 'react';
import {CARD, Card, easeIn, easeOut, span} from './desk.tsx';

export const meta = {
  name: {en: 'Step stack', 'zh-CN': '步骤卡片叠'},
  purpose: 'steps',
  line: 'A stack of ruled cards, one step to a card: a big number on its tab, a two-colour drawing and one short instruction; the top card is flicked away to show the next, and coloured tabs down the stack\'s edge show how far along it is.',
  fits: 'a how-to in three to six steps; a recipe; setting something up; a routine',
  params: {
    steps: {type: '{text, art}[]', doc: 'the steps in order: one short instruction (seven words or so) and a drawing (a node drawn in a 520 × 400 box; it gets `p`, its drawing progress, if it is a function)'},
    at: {type: 'number', default: 0, doc: 'the step on top; a fraction is that card being flicked away (0.5 s), the next one rising'},
    draw: {type: 'progress', default: 1, doc: 'how far the top card\'s drawing is drawn: 0 to 1 over about 0.9 s after it reaches the top'},
    x: {type: 'px', default: 400, doc: 'the stack\'s left edge'},
    y: {type: 'px', default: 250, doc: 'its top'},
  },
  preview: 7.6,
};

type Step = {text: string; art?: ReactNode | ((p: number) => ReactNode)};

function Face({step, n, total, p}: {step: Step; n: number; total: number; p: number}) {
  const art = typeof step.art === 'function' ? step.art(p) : step.art;
  return (
    <>
      <div style={{position: 'absolute', left: 48, top: 18, fontFamily: 'var(--font-display)', fontSize: 84, fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1}}>{String(n + 1).padStart(2, '0')}</div>
      <div style={{position: 'absolute', left: 168, top: 50, fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-muted)'}}>step {n + 1} of {total}</div>
      <div style={{position: 'absolute', left: 48, top: 156, width: 420, fontFamily: 'var(--font-sans)', fontSize: 50, fontWeight: 700, lineHeight: '56px', color: 'var(--color-ink)'}}>{step.text}</div>
      <div style={{position: 'absolute', right: 30, top: 160, width: 520, height: 400}}>{art}</div>
    </>
  );
}

export function Stack({steps, at = 0, draw = 1, x = 400, y = 250}: {steps: Step[]; at?: number; draw?: number; x?: number; y?: number}) {
  const n = steps.length, top = Math.min(n - 1, Math.floor(at)), f = at - top;
  const flick = top < n - 1 ? f : 0;
  const under = Math.min(3, n - 1 - top);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: CARD.w + 120, height: CARD.h + 60}}>
      {/* tabs down the right edge: done, current, to come */}
      {steps.map((_, i) => {
        const state = i < top || (i === top && flick > 0.5) ? 'done' : i === top || (i === top + 1 && flick > 0.5) ? 'now' : 'next';
        return (
          <div key={i} style={{position: 'absolute', left: CARD.w - 30, top: 40 + i * 92, width: 110, height: 74, borderRadius: '0 10px 10px 0',
            background: state === 'done' ? 'var(--color-done)' : state === 'now' ? 'var(--color-accent)' : 'var(--color-card)', boxShadow: '0 2px 6px rgba(70,55,30,0.2)',
            fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: state === 'next' ? 'var(--color-muted)' : 'var(--color-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 18, boxSizing: 'border-box'}}>{i + 1}</div>
        );
      })}
      {/* the cards beneath, their edges showing */}
      {Array.from({length: under}, (_, k) => under - k).map((d) => {
        const rise = d === 1 ? easeOut(span(flick, 0.3, 1)) : 0, off = (d - rise) * 10;
        return <Card key={d} style={{left: off, top: off, transform: `rotate(${(d % 2 ? 0.6 : -0.5) * (1 - rise)}deg)`}} lift={rise * 0.3}>
          {d === 1 && rise > 0 && <div style={{opacity: rise}}><Face step={steps[top + 1]} n={top + 1} total={n} p={0} /></div>}
        </Card>;
      })}
      {/* the top card, flicked away up and to the right */}
      {flick < 1 && (
        <Card style={{left: 0, top: 0, transform: `translate(${easeIn(flick) * 1500}px, ${-easeIn(flick) * 380}px) rotate(${easeIn(flick) * 24}deg)`, transformOrigin: '20% 80%'}} lift={0.3 + flick}>
          <Face step={steps[top]} n={top} total={n} p={draw} />
        </Card>
      )}
    </div>
  );
}
