// Light Table's ground, and what the other parts share: the curves, a frame-sized svg, and a grease-pencil stroke.
import {seededRandom} from '@motionhub/runtime';
import type {ReactNode} from 'react';

export const meta = {
  name: {en: 'Light table', 'zh-CN': '看片灯箱'},
  purpose: 'ground',
  line: 'A dark room and a large light table filling it: a milky, evenly lit surface in a dark bevelled frame, a little cooler at its edges, with small printed numbers along the frame.',
  fits: 'every scene: the surface every slide, strip and mark sits on',
  params: {
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 0.5 s: the tubes flicker once and come up; back to 0 to switch it off'},
    note: {type: 'text', default: '', doc: 'a small printed note on the frame\'s top edge: a job, a roll, a date'},
  },
  preview: 0.45,
};

export const W = 1920, H = 1080;
/** The lit surface, inside the frame */
export const SURFACE = {x: 90, y: 90, w: 1740, h: 900};
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const easeInOut = (x: number) => { const t = clamp(x); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
export const CANVAS = {width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: {position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} as const;

/** A path through points, each nudged by a hand's unsteadiness (the same for the same seed) */
export function hand(points: [number, number][], seed: string, wobble = 4) {
  const r = seededRandom(seed);
  const p = points.map(([x, y]) => [x + (r() - 0.5) * wobble * 2, y + (r() - 0.5) * wobble * 2]);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
    d += ` Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = p[p.length - 1];
  return `${d} L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
}

/** A grease-pencil stroke: waxy, a little broken, drawn on from its start by `p` */
export function Stroke({d, p = 1, color = 'var(--color-mark)', width = 9}: {d: string; p?: number; color?: string; width?: number}) {
  if (p <= 0) return null;
  return (
    <g>
      <defs>
        <filter id="lt-wax" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.6" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
      <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter="url(#lt-wax)" />
    </g>
  );
}

/** Words in grease pencil, revealed left to right by `p` */
export function Scrawl({text, x, y, size, p = 1, color = 'var(--color-marker)', anchor = 'start', rotate = 0}: {text: string; x: number; y: number; size: number; p?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; rotate?: number}) {
  if (p <= 0 || !text) return null;
  const w = text.length * size * 0.78, left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const id = `lt-s-${Math.round(x)}-${Math.round(y)}-${text.replace(/[^A-Za-z0-9]/g, "").slice(0, 16)}-${Math.round(size)}`;
  return (
    <g transform={`rotate(${rotate} ${x} ${y})`}>
      <defs><clipPath id={id}><rect x={left - size * 0.3} y={y - size * 1.3} width={(w + size * 0.6) * clamp(p)} height={size * 1.8} /></clipPath></defs>
      <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} clipPath={`url(#${id})`} style={{fontFamily: 'var(--font-hand)'}}>{text}</text>
    </g>
  );
}

export function Table({on = 1, note = '', children}: {on?: number; note?: string; children?: ReactNode}) {
  // the tubes come up with one flicker
  const lit = on <= 0 ? 0 : on >= 1 ? 1 : Math.min(1, on < 0.25 ? on * 3.2 : on < 0.38 ? 0.35 : 0.35 + (on - 0.38) * 1.05);
  const {x, y, w, h} = SURFACE;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-room)'}}>
      <div style={{position: 'absolute', left: x - 34, top: y - 34, width: w + 68, height: h + 68, borderRadius: 26, background: 'var(--color-bezel)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 10, background: '#3A3D40', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, opacity: lit, background: 'radial-gradient(ellipse 75% 70% at 50% 50%, var(--color-glow) 55%, var(--color-haze) 100%)'}} />
      </div>
      <div style={{position: 'absolute', left: x - 34, top: y - 34, width: w + 68, height: h + 68, borderRadius: 26, pointerEvents: 'none',
        boxShadow: `0 0 ${140 * lit}px ${20 * lit}px rgba(235, 245, 235, ${0.08 * lit})`}} />
      {note && <div style={{position: 'absolute', left: x + 6, top: y - 30, fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)'}}>{note}</div>}
      {[0.25, 0.5, 0.75].map((f) => <div key={f} style={{position: 'absolute', left: x + w * f, top: y + h + 8, width: 2, height: 14, background: 'var(--color-muted)', opacity: 0.6}} />)}
      {children}
    </div>
  );
}
