// Index Cards' ground, and what the other parts share: the curves, a drawn line, and the ruled card itself.
import type {CSSProperties, ReactNode} from 'react';

export const meta = {
  name: {en: 'Linen desk', 'zh-CN': '亚麻桌面'},
  purpose: 'ground',
  line: 'A warm linen cloth across the desk, its weave just visible, lit softly from the top left; a small note may sit in a corner.',
  fits: 'every scene: the surface the cards are laid on',
  params: {
    note: {type: 'text', default: '', doc: 'a small note in the top left corner: what the cards are for'},
  },
  preview: 14.0,
};

export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const easeIn = (x: number) => clamp(x) ** 2.2;

/** A drawn line: its length revealed by `p` */
export const line = (p: number) => ({pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - clamp(p), fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'}) as const;

export const CARD = {w: 1040, h: 620};

/** A ruled index card: cream stock, a red line under the top margin, blue rules, a soft shadow; its content laid over it */
export function Card({w = CARD.w, h = CARD.h, children, style, lift = 0, corner = ''}: {w?: number; h?: number; children?: ReactNode; style?: CSSProperties; lift?: number; corner?: string}) {
  const rules = Array.from({length: Math.floor((h - 150) / 56)}, (_, i) => 150 + i * 56);
  return (
    <div style={{position: 'absolute', width: w, height: h, borderRadius: 6, background: 'var(--color-card)',
      boxShadow: `0 ${3 + 18 * lift}px ${8 + 34 * lift}px rgba(70, 55, 30, ${0.18 + 0.14 * lift}), 0 1px 0 rgba(70, 55, 30, 0.1)`, ...style}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 108, height: 3, background: 'var(--color-margin)', opacity: 0.8}} />
      {rules.map((y) => <div key={y} style={{position: 'absolute', left: 0, right: 0, top: y, height: 2, background: 'var(--color-rule)', opacity: 0.55}} />)}
      {corner && <div style={{position: 'absolute', right: 34, top: 36, fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.06em'}}>{corner}</div>}
      {children}
    </div>
  );
}

const WEAVE = 'repeating-linear-gradient(0deg, rgba(120,104,80,0.10) 0 2px, transparent 2px 5px), repeating-linear-gradient(90deg, rgba(120,104,80,0.08) 0 2px, transparent 2px 6px)';

export function Desk({note = ''}: {note?: string}) {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-linen)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: WEAVE}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 80% at 30% 20%, rgba(255,250,235,0.35), rgba(60,45,20,0.12) 100%)'}} />
      {note && <div style={{position: 'absolute', left: 90, top: 60, fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-muted)'}}>{note}</div>}
    </div>
  );
}
