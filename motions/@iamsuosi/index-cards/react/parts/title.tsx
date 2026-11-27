import {Card, easeOut, span} from './desk.tsx';

export const meta = {
  name: {en: 'Title card', 'zh-CN': '标题卡'},
  purpose: 'title',
  line: 'A single card slid onto the desk at a slight angle with a paper clip on its top edge: the subject in a big slab heading, a line under it, and what you will need listed small.',
  fits: 'the opening of a how-to: what it makes and what it takes; a chapter of a longer tutorial',
  params: {
    title: {type: 'text', doc: 'what the tutorial makes or does: a few words'},
    sub: {type: 'text', default: '', doc: 'one line under it'},
    needs: {type: 'text[]', default: [], doc: 'what you will need, each a word or two'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 0.8 s: the card slides in from below, then its list is ticked on'},
  },
  preview: 2.4,
};

export function Title({title, sub = '', needs = [], show = 1}: {title: string; sub?: string; needs?: string[]; show?: number}) {
  const k = easeOut(span(show, 0, 0.55));
  return (
    <Card style={{left: 440, top: 230 + (1 - k) * 700, transform: `rotate(${-2 + 1 * k}deg)`}} lift={0.4 * (1 - k) + 0.1}>
      <svg width={90} height={160} viewBox="0 0 90 160" style={{position: 'absolute', left: 860, top: -54, overflow: 'visible'}}>
        <path d="M30 150 V30 a20 20 0 0 1 40 0 V130 a12 12 0 0 1 -24 0 V48" fill="none" stroke="#8E959C" strokeWidth={7} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 56, top: 24, fontFamily: 'var(--font-display)', fontSize: 74, fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.05}}>{title}</div>
      {sub && <div style={{position: 'absolute', left: 58, top: 158, fontFamily: 'var(--font-sans)', fontSize: 38, color: 'var(--color-ink)', fontStyle: 'italic'}}>{sub}</div>}
      {needs.length > 0 && <div style={{position: 'absolute', left: 58, top: 262, fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-muted)'}}>you will need</div>}
      {needs.slice(0, 5).map((n, i) => (
        <div key={i} style={{position: 'absolute', left: 58, top: 312 + i * 56, display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'var(--font-sans)', fontSize: 38, color: 'var(--color-ink)', opacity: span(show, 0.55 + i * 0.08, 0.65 + i * 0.08)}}>
          <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: 'var(--color-accent)'}} />{n}
        </div>
      ))}
    </Card>
  );
}
