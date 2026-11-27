import type {ReactNode} from 'react';
import {Scrawl, easeOut, span} from './table.tsx';

export const meta = {
  name: {en: 'Contact strip', 'zh-CN': '胶片条'},
  purpose: 'steps',
  line: 'A strip of three to five frames with sprocket holes laid across the light; the frames are numbered in grease pencil and lit one at a time while the others dim.',
  fits: 'stages of a change in order; a sequence over time; steps shown as pictures',
  params: {
    frames: {type: 'node[]', doc: 'three to five pictures, each drawn into a 300 × 220 frame'},
    lit: {type: 'number', default: -1, doc: 'the frame in focus; the others dim. -1 for all lit'},
    lay: {type: 'progress', default: 1, doc: '0 to 1 over about 0.6 s: the strip slides on from the left'},
    y: {type: 'px', default: 360, doc: 'the strip\'s top'},
    notes: {type: 'text[]', default: [], doc: 'a word under each frame, in grease pencil'},
  },
  preview: 18.6,
};

export function Strip({frames, lit = -1, lay = 1, y = 360, notes = []}: {frames: ReactNode[]; lit?: number; lay?: number; y?: number; notes?: string[]}) {
  const n = Math.min(5, frames.length), fw = 300, fh = 220, gap = 36, w = n * fw + (n + 1) * gap, x0 = (1920 - w) / 2;
  const slide = (1 - easeOut(lay)) * -(x0 + w);
  const holes = Array.from({length: Math.floor(w / 46)}, (_, i) => i * 46 + 18);
  return (
    <div style={{position: 'absolute', left: x0 + slide, top: y, width: w, height: fh + 110}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(40, 34, 28, 0.88)', borderRadius: 4, boxShadow: '0 8px 22px rgba(10,10,10,0.25)'}} />
      {[14, fh + 110 - 32].map((top) => holes.map((hx) => <div key={`${top}-${hx}`} style={{position: 'absolute', left: hx, top, width: 22, height: 18, borderRadius: 4, background: 'var(--color-glow)', opacity: 0.85}} />))}
      {frames.slice(0, n).map((f, i) => {
        const on = lit < 0 || lit === i;
        return (
          <div key={i} style={{position: 'absolute', left: gap + i * (fw + gap), top: 55, width: fw, height: fh, overflow: 'hidden', background: '#fff', opacity: on ? 1 : 0.35, transition: 'none'}}>{f}</div>
        );
      })}
      <svg width={w} height={fh + 220} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {frames.slice(0, n).map((_, i) => (
          <g key={i}>
            <Scrawl text={String(i + 1)} x={gap + i * (fw + gap) + 8} y={-14} size={44} p={span(lay, 0.6 + i * 0.08, 0.8 + i * 0.08)} color="var(--color-mark)" />
            {notes[i] && <Scrawl text={notes[i]} x={gap + i * (fw + gap) + fw / 2} y={fh + 170} size={40} anchor="middle" p={span(lay, 0.7, 1)} />}
          </g>
        ))}
      </svg>
    </div>
  );
}
