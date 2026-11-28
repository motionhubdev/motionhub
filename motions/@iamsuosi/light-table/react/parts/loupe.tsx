import type {ReactNode} from 'react';
import {H, W, easeInOut, span} from './table.tsx';

export const meta = {
  name: {en: 'Loupe', 'zh-CN': '放大镜'},
  purpose: 'term',
  line: 'A round loupe with a dark rim glides across the table and stops over one detail, showing it about twice as large through its glass, with a soft glint.',
  fits: 'the one detail that changed; a defect, a fix, a small number; looking closer at what a word names',
  params: {
    children: {type: 'node', doc: 'what lies under it: the same scene, drawn again at the frame\'s size, which it magnifies'},
    from: {type: '[x, y]', doc: 'where it starts'},
    to: {type: '[x, y]', doc: 'the detail it stops over'},
    glide: {type: 'progress', default: 1, doc: '0 to 1 over about 1.4 s: it glides from `from` to `to`, easing in and out'},
    radius: {type: 'px', default: 170, doc: 'the glass\'s radius'},
    zoom: {type: 'number', default: 2.2, doc: 'how much larger it shows what is under it'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over 0.3 s: it is set down (from a little larger, its shadow closing in)'},
  },
  preview: 6.6,
};

export function Loupe({children, from, to, glide = 1, radius = 170, zoom = 2.2, show = 1}: {children?: ReactNode; from: [number, number]; to: [number, number]; glide?: number; radius?: number; zoom?: number; show?: number}) {
  if (show <= 0) return null;
  const g = easeInOut(glide), x = from[0] + (to[0] - from[0]) * g, y = from[1] + (to[1] - from[1]) * g;
  const r = radius, s = 1 + 0.08 * (1 - span(show, 0, 1)), lift = 1 - span(show, 0, 1) + 0.4 * Math.sin(Math.PI * glide);
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${s})`, opacity: Math.min(1, show * 3)}}>
      <div style={{position: 'absolute', inset: -22, borderRadius: '50%', background: 'var(--color-bezel)', boxShadow: `0 ${12 + 24 * lift}px ${24 + 30 * lift}px rgba(15, 18, 16, 0.4), inset 0 3px 0 rgba(255,255,255,0.18)`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: 'var(--color-glow)'}}>
        <div style={{position: 'absolute', left: r - x * zoom, top: r - y * zoom, width: W, height: H, transform: `scale(${zoom})`, transformOrigin: '0 0'}}>{children}</div>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), rgba(255,255,255,0) 38%)', boxShadow: 'inset 0 0 26px rgba(0,0,0,0.25)'}} />
      </div>
    </div>
  );
}
