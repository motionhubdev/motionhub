import {useId} from 'react';
import {Bulb, BulbDefs, clamp} from './bulbs.tsx';

export const meta = {
  name: {en: 'Marquee', 'zh-CN': '招牌'},
  purpose: 'ground',
  line: 'The sign itself: a dark painted panel with a brass edge, framed by a row of bulbs that chase around it in threes; everything else is lit on it.',
  fits: 'under every bulb word, figure and arrow; small for a corner, or nearly the whole frame',
  params: {
    x: {type: 'px', default: 140, doc: 'the panel\'s left edge'},
    y: {type: 'px', default: 170, doc: 'its top'},
    width: {type: 'px', default: 1640, doc: 'its width'},
    height: {type: 'px', default: 620, doc: 'its height'},
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 0.8 s: the frame\'s bulbs come on around the panel from the top left'},
    chase: {type: 'number', default: 0, doc: 'how far the chase has run, in steps: animate it at about 5 steps a second (time × 5); 0 holds it still'},
  },
  preview: 4.0,
};

export function Board({x = 140, y = 170, width = 1640, height = 620, on = 1, chase = 0}: {x?: number; y?: number; width?: number; height?: number; on?: number; chase?: number}) {
  const id = useId().replace(/:/g, '');
  const gap = 38, inset = 26, r = 9;
  // the bulbs around the panel, clockwise from the top left
  const pts: [number, number][] = [];
  const w = width - inset * 2, h = height - inset * 2, nx = Math.round(w / gap), ny = Math.round(h / gap);
  for (let i = 0; i < nx; i++) pts.push([x + inset + (i * w) / nx, y + inset]);
  for (let i = 0; i < ny; i++) pts.push([x + width - inset, y + inset + (i * h) / ny]);
  for (let i = 0; i < nx; i++) pts.push([x + width - inset - (i * w) / nx, y + height - inset]);
  for (let i = 0; i < ny; i++) pts.push([x + inset, y + height - inset - (i * h) / ny]);
  const step = Math.floor(chase), n = pts.length;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
      <BulbDefs id={id} />
      <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} rx={22} fill="var(--color-brass)" />
      <rect x={x - 4} y={y - 4} width={width + 8} height={height + 8} rx={18} fill="var(--color-brassDeep)" />
      <rect x={x} y={y} width={width} height={height} rx={14} fill="var(--color-panel)" />
      <rect x={x + inset * 2} y={y + inset * 2} width={width - inset * 4} height={height - inset * 4} rx={8} fill="none" stroke="var(--color-brassDeep)" strokeWidth={2} opacity={0.6} />
      {pts.map(([px, py], i) => {
        const reach = clamp(on * (n + 12) / 12 - i / 12);
        // two of every three bulbs burn; the dark one walks round with the chase
        const dark = chase > 0 && (i + step) % 3 === 0;
        return <Bulb key={i} x={px} y={py} r={r} id={id} lit={reach * (dark ? 0.15 : 1)} />;
      })}
    </svg>
  );
}
