import {useTime} from '@motionhub/runtime';
import {Snapshot, clamp, easeInOut, printHeight, span} from './print.tsx';
import {peg} from './peg.ts';

export const meta = {
  name: {en: 'Snapshot line', 'zh-CN': '照片绳'},
  purpose: 'steps',
  line: 'Prints pegged along a string across the frame; the string is pulled so they travel and swing on their pegs, and the one that stops in the middle comes forward, develops and gets its caption written.',
  fits: 'points of a list one at a time; a feature round-up; a timeline, with a dated tag under each print',
  params: {
    items: {type: '{picture, caption, tag?}[]', doc: 'the prints in order: a picture name (see Snapshot), a few words, and a small tag under it (a date, a number) for a timeline'},
    moves: {type: '{at, to}[]', doc: 'when the string is pulled (seconds of the sequence) and which print it brings to the middle; the first is where it rests at the start'},
    travel: {type: 'number', default: 1.1, doc: 'seconds a pull takes'},
    y: {type: 'px', default: 250, doc: 'the string\'s height at the middle'},
    size: {type: 'px', default: 300, doc: 'a print\'s width; the one in the middle is drawn about a fifth larger'},
    gap: {type: 'px', default: 430, doc: 'the distance between prints along the string'},
    mark: {type: 'number', default: -1, doc: 'the print given a red pen ring once it is in the middle; -1 for none'},
  },
  preview: 12.0,
};

type Item = {picture: string; caption: string; tag?: string};
type Move = {at: number; to: number};

/** Where the string is (the index at the middle, fractional while moving) and how long since it last stopped, at time t */
function position(t: number, moves: Move[], travel: number) {
  let pos = moves[0]?.to ?? 0, stopped = t - (moves[0]?.at ?? 0), from = pos;
  for (const m of moves.slice(1)) {
    if (t < m.at) break;
    from = pos;
    const k = span(t, m.at, m.at + travel);
    pos = from + (m.to - from) * easeInOut(k);
    stopped = t - (m.at + travel);
  }
  return {pos, stopped};
}

/** How far each print leans on its peg: it lags as the string starts, then swings past and settles once it stops */
function lean(t: number, moves: Move[], travel: number, i: number) {
  let a = 0;
  for (let k = 1; k < moves.length; k++) {
    const m = moves[k], dir = Math.sign(m.to - moves[k - 1].to) || 1, dt = t - m.at;
    if (dt < 0) continue;
    // lag while pulled, then a damped swing
    if (dt < travel) a += dir * 7 * Math.sin((Math.PI * dt) / travel);
    const after = dt - travel * 0.5;
    if (after > 0) a += -dir * 6 * Math.exp(-after / 0.8) * Math.sin((2 * Math.PI * after) / (1.05 + i * 0.04));
  }
  return a;
}

export function Line({items, moves, travel = 1.1, y = 250, size = 300, gap = 430, mark = -1}: {items: Item[]; moves: Move[]; travel?: number; y?: number; size?: number; gap?: number; mark?: number}) {
  const t = useTime(), {pos, stopped} = position(t, moves, travel);
  const sag = (x: number) => { const u = clamp((x + 20) / 1960); return y - 6 + 196 * u * (1 - u); };
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M-20 ${y - 6} Q960 ${y + 92} 1940 ${y - 6}`} stroke="var(--color-string)" strokeWidth={3} fill="none" />
        <path d={`M-20 ${y - 3} Q960 ${y + 95} 1940 ${y - 3}`} stroke="rgba(0,0,0,0.25)" strokeWidth={2} fill="none" transform="translate(0 10)" />
      </svg>
      {items.map((it, i) => {
        const off = i - pos, x = 960 + off * gap;
        if (x < -size || x > 1920 + size) return null;
        const near = clamp(1 - Math.abs(off) * 1.6), centred = Math.abs(off) < 0.02;
        const s = size * (1 + 0.2 * easeInOut(near)), top = sag(x);
        // a print develops and is captioned only when it has come to rest in the middle
        const here = centred ? Math.max(0, stopped) : 0;
        const seen = moves.some((m, k) => m.to === i && t > m.at + (k ? travel : 0) + 1.4);
        const develop = centred ? span(here, 0, 1.2) : seen ? 1 : 0, write = centred ? span(here, 0.6, 1.4) : seen ? 1 : 0;
        return (
          <div key={i} style={{position: 'absolute', left: x - s / 2, top: top - 8, width: s, transformOrigin: '50% 0', transform: `rotate(${lean(t, moves, travel, i).toFixed(2)}deg)`, zIndex: Math.round(near * 10)}}>
            <Snapshot picture={it.picture} caption={it.caption} develop={develop} write={write} size={s} mark={i === mark ? (centred ? span(here, 1.2, 1.7) : seen ? 1 : 0) : 0} />
            <div style={{position: 'absolute', left: s / 2 - 9, top: -s * 0.12}}>{peg(s * 0.3)}</div>
            {it.tag && <div style={{position: 'absolute', left: 0, right: 0, top: printHeight(s) + 18, display: 'flex', justifyContent: 'center'}}>
              <div style={{padding: '4px 14px', background: 'var(--color-tag)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 34, letterSpacing: '0.08em', color: 'var(--color-ink)'}}>{it.tag}</div></div>}
          </div>
        );
      })}
    </>
  );
}
