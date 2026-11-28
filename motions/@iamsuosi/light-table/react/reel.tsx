// Light Table's reel: about twenty seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import type {ReactNode} from 'react';
import {useTime} from '@motionhub/runtime';
import {Table, easeInOut, span} from './parts/table.tsx';
import {Pair} from './parts/pair.tsx';
import {Loupe} from './parts/loupe.tsx';
import {Pencil} from './parts/pencil.tsx';
import {Strip} from './parts/strip.tsx';
import {Tape} from './parts/tape.tsx';
import {Final} from './parts/final.tsx';

export const reel = {seconds: 22, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): the light comes on, slides are laid, the loupe glides, the pencil writes */
export const cues = [
  {at: 0.05, role: 'land'}, {at: 0.8, role: 'draw', dur: 0.8}, {at: 1.7, role: 'land'}, {at: 2.2, role: 'land'},
  {at: 4.4, role: 'land'}, {at: 4.6, role: 'move', dur: 1.4}, {at: 7.6, role: 'draw', dur: 0.6},
  {at: 9.4, role: 'cut', dur: 0.6}, {at: 10.0, role: 'land'}, {at: 10.5, role: 'land'}, {at: 11.6, role: 'move', dur: 0.8}, {at: 13.0, role: 'draw', dur: 0.6},
  {at: 14.8, role: 'cut', dur: 0.6}, {at: 15.6, role: 'draw', dur: 0.8}, {at: 16.6, role: 'count'}, {at: 17.1, role: 'count'}, {at: 17.6, role: 'count'}, {at: 18.1, role: 'count'},
  {at: 19.2, role: 'cut', dur: 0.6}, {at: 20.0, role: 'out'},
];

// ---- the pictures on the slides, drawn for this reel ----
function Landscape({soft = false}: {soft?: boolean}) {
  return (
    <svg width={640} height={440} viewBox="0 0 640 440" style={{display: 'block'}}>
      <defs><filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={7} /></filter></defs>
      <rect width={640} height={440} fill="#A9CBE0" />
      <g filter={soft ? 'url(#soft)' : undefined}>
      <circle cx={470} cy={110} r={46} fill="#F6D27A" />
      <polygon points="0,330 150,150 260,300 360,120 520,320 640,220 640,440 0,440" fill="#5E7C8C" />
      <polygon points="330,155 360,120 392,160 372,150 352,168" fill="#F2F4F2" />
      <polygon points="0,380 640,340 640,440 0,440" fill="#4E7A4A" />
      {[60, 120, 560, 600].map((x) => <polygon key={x} points={`${x},300 ${x - 22},372 ${x + 22},372`} fill="#2F5A36" />)}
      </g>
    </svg>
  );
}
function House({faded = false}: {faded?: boolean}) {
  return (
    <svg width={640} height={440} viewBox="0 0 640 440" style={{display: 'block', filter: faded ? 'sepia(0.75) saturate(0.45) contrast(0.78) brightness(1.08)' : 'none'}}>
      <rect width={640} height={440} fill="#9FD0E8" />
      <rect y={330} width={640} height={110} fill="#6DAA4F" />
      <rect x={190} y={200} width={240} height={160} fill="#E27D4F" />
      <polygon points="170,205 310,110 450,205" fill="#8C3B2E" />
      <rect x={285} y={270} width={50} height={90} fill="#4A3A34" />
      <rect x={215} y={235} width={50} height={44} fill="#F5EFD9" /><rect x={355} y={235} width={50} height={44} fill="#F5EFD9" />
      <rect x={500} y={240} width={20} height={110} fill="#6E4B32" /><circle cx={510} cy={215} r={58} fill="#3F8A44" />
      {faded && [[80, 90, 5], [420, 60, 3], [300, 380, 4], [560, 330, 6], [130, 260, 3]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#fff" opacity={0.8} />)}
      {faded && <path d="M40 20 L120 430" stroke="#fff" strokeWidth={2} opacity={0.5} />}
    </svg>
  );
}
function Moon({phase}: {phase: number}) {
  // phase 0 new, 0.5 full: the lit part as the difference of two discs
  const r = 70, k = Math.cos(phase * 2 * Math.PI), lit = phase <= 0.5;
  return (
    <svg width={300} height={220} viewBox="0 0 300 220" style={{display: 'block'}}>
      <rect width={300} height={220} fill="#1E2738" />
      <circle cx={150} cy={110} r={r} fill="#38425A" />
      {phase > 0.01 && <path d={`M150 ${110 - r} A${r} ${r} 0 0 ${lit ? 1 : 0} 150 ${110 + r} A${Math.abs(k) * r} ${r} 0 0 ${k > 0 ? (lit ? 0 : 1) : (lit ? 1 : 0)} 150 ${110 - r} Z`} fill="#F1EBD2" />}
    </svg>
  );
}

const push = (from: ReactNode, to: ReactNode, p: number) => {
  const e = easeInOut(p);
  return (<><div style={{position: 'absolute', inset: 0, transform: `translateX(${-2000 * e}px)`}}>{from}</div><div style={{position: 'absolute', inset: 0, transform: `translateX(${2000 * (1 - e)}px)`}}>{to}</div></>);
};

const Focus = ({t}: {t: number}) => <><Tape text="what changed?" show={span(t, 0.8, 1.8)} /><Pair before={<Landscape soft />} after={<Landscape />} lay={span(t, 1.6, 2.5)} /></>;
function FocusScene({t}: {t: number}) {
  const loupe = span(t, 4.4, 4.7) * (1 - span(t, 7.1, 7.4));
  return (
    <>
      <Focus t={t} />
      <Loupe from={[1640, 960]} to={[1430, 410]} glide={span(t, 4.6, 6.0)} show={loupe}><Focus t={t} /></Loupe>
      <Pencil kind="circle" at={[1430, 410]} size={80} note="in focus" draw={span(t, 7.6, 8.4)} seed="f" />
    </>
  );
}
const Colour = ({t}: {t: number}) => (
  <><Tape text="faded print, restored" show={span(t, 9.6, 10.4)} />
    <Pair before={<House faded />} after={<House />} labels={['scan', 'restored']} lay={span(t, 9.8, 10.7)} over={span(t, 11.6, 12.4)} />
    <Pencil kind="tick" at={[1420, 430]} size={110} note="colour back" draw={span(t, 13.0, 13.8)} seed="c" /></>
);
const Phases = ({t}: {t: number}) => (
  <><Tape text="the moon, new to full" show={span(t, 15.4, 16.2)} />
    <Strip frames={[0, 0.12, 0.25, 0.37, 0.5].map((p) => <Moon key={p} phase={p} />)} notes={['new', 'crescent', 'quarter', 'gibbous', 'full']}
      lay={span(t, 15.6, 16.3)} lit={t < 16.6 ? -1 : Math.min(4, Math.floor((t - 16.6) / 0.5))} y={400} /></>
);
const End = ({t}: {t: number}) => <Final label="restored" line="kept on the light" show={span(t, 19.6, 21.1)}><House /></Final>;

export default function Reel() {
  const t = useTime();
  let scene: ReactNode;
  if (t < 9.4) scene = <FocusScene t={t} />;
  else if (t < 10.0) scene = push(<FocusScene t={t} />, <Colour t={t} />, span(t, 9.4, 10.0));
  else if (t < 14.8) scene = <Colour t={t} />;
  else if (t < 15.4) scene = push(<Colour t={t} />, <Phases t={t} />, span(t, 14.8, 15.4));
  else if (t < 19.2) scene = <Phases t={t} />;
  else if (t < 19.8) scene = push(<Phases t={t} />, null, span(t, 19.2, 19.8));
  else scene = null;
  return <Table on={span(t, 0, 0.6)} note="Roll 07 · light table">{scene}{t >= 19.6 && <End t={t} />}</Table>;
}
