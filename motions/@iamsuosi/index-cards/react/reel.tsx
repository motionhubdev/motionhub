// Index Cards' reel: about twenty seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Desk, easeOut, line, span} from './parts/desk.tsx';
import {Title} from './parts/title.tsx';
import {Stack} from './parts/stack.tsx';
import {NoteCard} from './parts/card.tsx';
import {Tip} from './parts/tip.tsx';
import {Done} from './parts/done.tsx';

export const reel = {seconds: 21.5, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): cards are laid and flicked, drawings drawn, the stamp lands */
export const cues = [
  {at: 0.2, role: 'land'}, {at: 3.3, role: 'move', dur: 0.5}, {at: 3.9, role: 'draw', dur: 0.9},
  {at: 5.8, role: 'cut', dur: 0.5}, {at: 6.4, role: 'draw', dur: 0.9}, {at: 8.2, role: 'cut', dur: 0.5}, {at: 8.8, role: 'draw', dur: 0.9},
  {at: 10.0, role: 'land'}, {at: 11.4, role: 'cut', dur: 0.5}, {at: 12.0, role: 'draw', dur: 0.9},
  {at: 13.4, role: 'move', dur: 0.5}, {at: 13.8, role: 'land'}, {at: 14.1, role: 'land'}, {at: 14.6, role: 'draw', dur: 0.3}, {at: 14.85, role: 'draw', dur: 0.3},
  {at: 16.6, role: 'move', dur: 0.4}, {at: 17.1, role: 'draw', dur: 0.9}, {at: 18.5, role: 'cut', dur: 0.4}, {at: 19.6, role: 'out'},
];

// ---- the drawings, two colours of line, drawn for this reel ----
const S = {stroke: 'var(--color-ink)', strokeWidth: 6} as const;
const A = {stroke: 'var(--color-accent)', strokeWidth: 6} as const;
const pot = (x: number, y: number, w: number, h: number, p: number) => (
  <g><path d={`M${x} ${y} H${x + w} L${x + w * 0.88} ${y + h} H${x + w * 0.12} Z`} {...A} {...line(p)} />
    <path d={`M${x - 10} ${y} H${x + w + 10} V${y + 26} H${x - 10} Z`} {...A} {...line(p)} /></g>
);
const plant = (x: number, y: number, p: number, s = 1) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 C0 -60 6 -110 0 -150" {...S} {...line(p)} />
    <path d="M0 -60 C-50 -70 -80 -110 -70 -140 C-30 -130 -6 -100 0 -60" {...S} {...line(p)} />
    <path d="M2 -95 C50 -100 80 -140 74 -170 C34 -164 8 -130 2 -95" {...S} {...line(p)} />
    <path d="M0 -150 C-20 -175 -10 -205 6 -212 C20 -196 18 -170 0 -150" {...S} {...line(p)} />
  </g>
);
const drops = (x: number, y: number, p: number) => [0, 1, 2].map((i) => <path key={i} d={`M${x + i * 26} ${y + i * 14} c-8 14 -8 24 0 24 c8 0 8 -10 0 -24`} {...S} strokeWidth={4} {...line(span(p, 0.5 + i * 0.12, 0.8 + i * 0.1))} />);
const ART = [
  (p: number) => <svg viewBox="0 0 520 400" width={520} height={400}>{pot(240, 260, 180, 120, span(p, 0, 0.5))}{plant(330, 260, span(p, 0.2, 0.7), 0.9)}
    <path d="M40 120 H150 L190 90 M150 120 V200 H40 Z M40 140 C10 140 10 190 40 190" {...S} {...line(span(p, 0.3, 0.8))} />{drops(196, 110, p)}</svg>,
  (p: number) => <svg viewBox="0 0 520 400" width={520} height={400}><g transform="rotate(-62 200 300)">{pot(130, 260, 180, 120, span(p, 0, 0.5))}</g>
    <path d="M330 250 C300 200 340 160 390 170 C440 180 450 240 420 270 C390 300 340 290 330 250 Z" {...S} {...line(span(p, 0.3, 0.7))} />
    {plant(390, 175, span(p, 0.3, 0.8), 0.7)}<path d="M250 340 C320 360 380 340 420 300 M404 290 L424 300 L414 320" {...A} {...line(span(p, 0.6, 1))} /></svg>,
  (p: number) => <svg viewBox="0 0 520 400" width={520} height={400}><path d="M170 210 C150 150 210 110 260 120 C320 130 360 180 340 240 C320 300 190 290 170 210 Z" {...S} {...line(span(p, 0, 0.4))} />
    {plant(260, 120, span(p, 0.1, 0.5), 0.6)}
    {[[190, 260, 120, 340], [230, 280, 220, 370], [290, 280, 320, 370], [330, 250, 420, 320], [200, 200, 100, 230]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q${(a + c) / 2 + 20} ${(b + d) / 2} ${c} ${d}`} {...A} strokeWidth={5} {...line(span(p, 0.4 + i * 0.08, 0.7 + i * 0.06))} />)}</svg>,
  (p: number) => <svg viewBox="0 0 520 400" width={520} height={400}>{pot(130, 200, 260, 170, span(p, 0, 0.45))}
    <path d="M150 250 H370" {...S} strokeDasharray="10 14" strokeWidth={5} opacity={span(p, 0.4, 0.6)} fill="none" />{plant(260, 250, span(p, 0.3, 0.8), 0.85)}
    <path d="M420 110 L470 70 M420 110 C440 140 470 150 490 130 L470 70" {...S} {...line(span(p, 0.6, 1))} /></svg>,
  (p: number) => <svg viewBox="0 0 520 400" width={520} height={400}>{pot(130, 200, 260, 170, span(p, 0, 0.45))}{plant(260, 205, span(p, 0.2, 0.7), 0.85)}{drops(250, 40, p)}{drops(330, 60, p)}</svg>,
];
const STEPS = [
  {text: 'Water the plant the day before', art: ART[0]},
  {text: 'Ease it out of the old pot', art: ART[1]},
  {text: 'Loosen circling roots', art: ART[2]},
  {text: 'Set it in fresh mix, one size up', art: ART[3]},
  {text: 'Water it in well', art: ART[4]},
];

export default function Reel() {
  const t = useTime();
  const titleOut = easeOut(span(t, 3.2, 3.7)), stackIn = easeOut(span(t, 3.3, 3.8));
  const stackOut = easeOut(span(t, 13.4, 13.9)), stackBack = easeOut(span(t, 16.6, 17.0)), tipOut = easeOut(span(t, 16.5, 16.9));
  // which card is on top, and how far its drawing has come
  const flicks = [5.8, 8.2, 11.4], at = flicks.reduce((a, s) => a + span(t, s, s + 0.5), 0);
  const drawAt = [3.9, 6.4, 8.8, 12.0][Math.min(3, Math.floor(at))];
  const step = t < 16.6 ? at : 4, draw = t < 16.6 ? span(t, drawAt, drawAt + 0.9) : span(t, 17.1, 18.0);
  return (
    <>
      <Desk note="Houseplants · repotting" />
      {t < 3.8 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${-1400 * titleOut}px)`}}>
        <Title title="Repot a houseplant" sub="in five steps" needs={['a pot one size up', 'fresh potting mix', 'a watering can']} show={span(t, 0.2, 1.2)} /></div>}
      {t >= 3.3 && t < 13.9 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${1400 * (1 - stackIn) - 1600 * stackOut}px)`}}><Stack steps={STEPS} at={step} draw={draw} /></div>}
      <NoteCard word="Root-bound" text="Roots circling the pot: tease them loose with your fingers." at={[1210, 670]} show={span(t, 10.0, 10.4) * (1 - span(t, 11.1, 11.3))} />
      {t >= 13.6 && t < 16.9 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${-1800 * tipOut}px)`}}>
        <Tip good={{text: 'A pot 2 to 5 cm wider', art: <svg viewBox="0 0 300 260" width={300} height={260}>{pot(70, 120, 160, 120, 1)}{plant(150, 125, 1, 0.55)}</svg>}}
          bad={{text: 'A pot far too big', art: <svg viewBox="0 0 300 260" width={300} height={260}>{pot(20, 90, 260, 160, 1)}{plant(150, 95, 1, 0.4)}</svg>}} show={span(t, 13.8, 15.2)} /></div>}
      {t >= 16.6 && t < 18.9 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${1400 * (1 - stackBack)}px)`, opacity: 1 - span(t, 18.5, 18.9)}}><Stack steps={STEPS} at={4} draw={draw} /></div>}
      {t >= 18.6 && <Done text="Repotted" art={<svg viewBox="0 0 560 420" width={560} height={420}>{pot(160, 230, 240, 170, 1)}{plant(280, 235, 1, 1)}</svg>} show={span(t, 18.6, 20.0)} />}
    </>
  );
}
