import {useId} from 'react';
import {Bulb, BulbDefs, clamp} from './bulbs.tsx';

export const meta = {
  name: {en: 'Bulb arrow', 'zh-CN': '灯泡箭头'},
  purpose: 'link',
  line: 'An arrow of bulbs that lights from its tail to its head, then keeps a slow run of light travelling along it towards what it points at, with a painted word on its shaft.',
  fits: 'pointing at the thing a sentence names; this way to the next idea; from a cause to its effect',
  params: {
    from: {type: '[x, y]', doc: 'the tail'},
    to: {type: '[x, y]', doc: 'the tip'},
    draw: {type: 'progress', default: 1, doc: '0 to 1 over about 0.8 s: the bulbs light from tail to tip'},
    run: {type: 'number', default: 0, doc: 'the travelling light, in steps: animate it at about 6 steps a second; 0 holds it still'},
    label: {type: 'text', default: '', doc: 'a word painted on a small plate by the tail'},
    tone: {type: 'amber | ruby', default: 'amber', doc: 'the lamps\' colour'},
  },
  preview: 15.5,
};

type Pt = [number, number];

export function Arrow({from, to, draw = 1, run = 0, label = '', tone = 'amber'}: {from: Pt; to: Pt; draw?: number; run?: number; label?: string; tone?: 'amber' | 'ruby'}) {
  const id = useId().replace(/:/g, '');
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, gap = 34;
  const shaft: Pt[] = Array.from({length: Math.floor(len / gap) + 1}, (_, i) => [from[0] + ux * i * gap, from[1] + uy * i * gap]);
  // the head: two short rows of bulbs swept back from the tip
  const head: Pt[] = [];
  for (const side of [1, -1]) for (let k = 1; k <= 3; k++) {
    const a = Math.atan2(uy, ux) + Math.PI + side * 0.7;
    head.push([to[0] + Math.cos(a) * k * gap, to[1] + Math.sin(a) * k * gap]);
  }
  const all = [...shaft.map((p, i) => ({p, at: i / shaft.length})), ...head.map((p) => ({p, at: 1}))];
  const step = Math.floor(run);
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <BulbDefs id={id} />
        {all.map(({p, at}, i) => {
          const lit = clamp((draw * 1.15 - at) / 0.15);
          const dim = run > 0 && i < shaft.length && (i - step) % 4 !== 0 ? 0.55 : 1;
          return <Bulb key={i} x={p[0]} y={p[1]} r={10} id={id} lit={lit * dim} tone={tone} />;
        })}
      </svg>
      {label && <div style={{position: 'absolute', left: from[0] - 20, top: from[1] + 34, padding: '6px 20px 2px', background: 'var(--color-plate)', borderRadius: 5,
        boxShadow: 'inset 0 0 0 3px var(--color-brassDeep)', fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: '0.1em', color: 'var(--color-panel)', textTransform: 'uppercase', opacity: clamp(draw * 3)}}>{label}</div>}
    </>
  );
}
