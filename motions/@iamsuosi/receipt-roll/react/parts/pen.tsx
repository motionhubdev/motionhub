import {seededRandom} from '@motionhub/runtime';

export const meta = {
  name: {en: 'Ballpoint', 'zh-CN': '圆珠笔'},
  purpose: 'mark',
  line: 'One blue ballpoint stroke over the print: a loose loop around a line, a tick beside it or a quick underline, drawn in half a second.',
  fits: 'the one line a scene is about; the cheaper of two totals; a figure to remember',
  params: {
    kind: {type: 'circle | tick | underline', default: 'circle', doc: 'a loop around the box, a tick in the margin to its left, or a line under it'},
    box: {type: '[x, y, w, h]', doc: 'what it marks, in the frame\'s pixels'},
    draw: {type: 'progress', default: 1, doc: '0 to 1 over about 0.5 s: the stroke drawn from its start'},
    seed: {type: 'string', default: 'pen', doc: 'which hand-drawn wobble; the same seed draws the same stroke'},
  },
  preview: 9.6,
};

export type Box = [number, number, number, number];

/** The stroke's path: a loop that overshoots its start, a tick, or an underline, each with a hand's small wobble */
export function penPath(kind: string, [x, y, w, h]: Box, seed: string) {
  const r = seededRandom(seed), j = (a: number) => (r() - 0.5) * a;
  if (kind === 'tick') {
    const s = h * 0.8, bx = x - s * 1.0, by = y + h * 0.3;
    return `M${bx} ${by}l${s * 0.32 + j(4)} ${s * 0.38 + j(4)}l${s * 0.62 + j(6)} ${-s * 0.95 + j(6)}`;
  }
  if (kind === 'underline') {
    const yy = y + h + 6, pts: string[] = [];
    for (let i = 0; i <= 12; i++) pts.push(`${(x - 10 + (w + 30) * i / 12).toFixed(1)} ${(yy + Math.sin(i * 0.9 + r() * 2) * 2.5 + i * 0.4).toFixed(1)}`);
    return `M${pts.join('L')}`;
  }
  const cx = x + w / 2, cy = y + h / 2, rx = w / 2 + 26, ry = h / 2 + 9, a0 = -2.3 + j(0.4), tilt = j(0.06), pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const a = a0 + (Math.PI * 2 * 1.1 * i) / 72, k = 1 + 0.05 * Math.sin(i * 0.31 + r() * 0.3) + (i / 72) * 0.07;
    const px = Math.cos(a) * rx * k, py = Math.sin(a) * ry * k;
    pts.push(`${(cx + px * Math.cos(tilt) - py * Math.sin(tilt)).toFixed(1)} ${(cy + px * Math.sin(tilt) + py * Math.cos(tilt)).toFixed(1)}`);
  }
  return `M${pts.join('L')}`;
}

export function Pen({kind = 'circle', box, draw = 1, seed = 'pen'}: {kind?: 'circle' | 'tick' | 'underline'; box: Box; draw?: number; seed?: string}) {
  if (draw <= 0) return null;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={penPath(kind, box, seed)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, draw)} fill="none"
        stroke="var(--color-pen)" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
    </svg>
  );
}
