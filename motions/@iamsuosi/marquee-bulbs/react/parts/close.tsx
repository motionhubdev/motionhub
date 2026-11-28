import {useId} from 'react';
import {Bulb, BulbDefs, clamp} from './bulbs.tsx';

export const meta = {
  name: {en: 'Closing plaque', 'zh-CN': '散场牌'},
  purpose: 'close',
  line: 'A round-cornered enamel plaque with a name in the theatre face and one plain line, ringed by bulbs that come on once round it and then hold still.',
  fits: 'the last seconds of a film: a name, a title, where to find more',
  params: {
    name: {type: 'text', doc: 'a short name or title'},
    line: {type: 'text', default: '', doc: 'one plain line under it'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.2 s: the plaque appears, the ring of bulbs comes on clockwise, then the line'},
  },
  preview: 22.2,
};

export function Close({name, line = '', show = 1}: {name: string; line?: string; show?: number}) {
  const id = useId().replace(/:/g, '');
  const w = 1080, h = 420, x = (1920 - w) / 2, y = 290, n = 44;
  // bulbs evenly round a rectangle 34 px outside the plaque, clockwise from the top middle
  const ox = x - 34, oy = y - 34, ow = w + 68, oh = h + 68, per = 2 * (ow + oh);
  const ring: [number, number][] = Array.from({length: n}, (_, i) => {
    let d = ((i / n) * per + ow / 2) % per;
    if (d < ow) return [ox + d, oy];
    d -= ow; if (d < oh) return [ox + ow, oy + d];
    d -= oh; if (d < ow) return [ox + ow - d, oy + oh];
    d -= ow; return [ox, oy + oh - d];
  });
  const plaque = clamp(show / 0.25);
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <BulbDefs id={id} />
        <g opacity={plaque}>
          <rect x={x} y={y} width={w} height={h} rx={40} fill="var(--color-brass)" />
          <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx={30} fill="var(--color-plate)" />
          <rect x={x + 30} y={y + 30} width={w - 60} height={h - 60} rx={20} fill="none" stroke="var(--color-panel)" strokeWidth={3} opacity={0.5} />
        </g>
        {ring.map(([bx, by], i) => <Bulb key={i} x={bx} y={by} r={10} id={id} lit={clamp((show - 0.2 - (i / n) * 0.55) / 0.08)} />)}
      </svg>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: plaque}}>
        <div style={{fontFamily: 'var(--font-display)', fontSize: 104, letterSpacing: '0.06em', color: 'var(--color-panel)', textTransform: 'uppercase', lineHeight: 1}}>{name}</div>
        {line && <div style={{marginTop: 28, fontFamily: 'var(--font-sans)', fontSize: 36, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--color-panel)', opacity: clamp((show - 0.8) / 0.2)}}>{line}</div>}
      </div>
    </>
  );
}
