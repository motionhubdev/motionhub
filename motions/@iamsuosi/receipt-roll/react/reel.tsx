// Receipt Roll's reel: about twenty seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Desk} from './parts/desk.tsx';
import {Receipt, type Line} from './parts/receipt.tsx';
import {Stub, stubLines} from './parts/stub.tsx';
import {Pair} from './parts/pair.tsx';
import {TearOff} from './parts/tear.tsx';
import {Chit} from './parts/chit.tsx';
import {LastStub} from './parts/close.tsx';

export const reel = {seconds: 21.5, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): the head prints, the pen marks, a chit lands, the roll is torn */
export const cues = [
  {at: 0.3, role: 'draw', dur: 2.1}, {at: 3.8, role: 'cut', dur: 0.5},
  {at: 4.4, role: 'draw', dur: 2.9}, {at: 7.8, role: 'move', dur: 0.5}, {at: 8.9, role: 'land'},
  {at: 10.6, role: 'cut', dur: 0.5}, {at: 11.3, role: 'draw', dur: 2.0}, {at: 14.0, role: 'move', dur: 0.5},
  {at: 16.6, role: 'cut', dur: 0.5}, {at: 17.3, role: 'draw', dur: 2.2}, {at: 19.6, role: 'out'},
];

const RATE = 0.22;
const fed = (t: number, start: number) => Math.max(0, (t - start) / RATE);
const prog = (t: number, a: number, d: number) => Math.max(0, Math.min(1, (t - a) / d));

const TITLE = {kicker: 'Air, itemised  ·  No. 1', title: ['WHAT IS', 'AIR MADE', 'OF?'], note: 'Dry air, by volume'};
const AIR: Line[] = [
  {text: 'DRY AIR', align: 'center', bold: true}, {text: 'by volume, at sea level', align: 'center', small: true}, {rule: 'dash'},
  {label: 'Nitrogen', value: '78.08 %'}, {label: 'Oxygen', value: '20.95 %'}, {label: 'Argon', value: '0.93 %'},
  {label: 'Carbon dioxide', value: '0.04 %'}, {label: 'Everything else', value: 'trace'}, {rule: 'double'},
  {label: 'TOTAL', value: '100 %', bold: true}, {gap: 0.4}, {rule: 'code'}, {text: 'Figures rounded', align: 'center', small: true}, {gap: 0.6},
];
const temps = (unit: string, v: string[]): Line[] => [
  {text: unit, align: 'center', bold: true}, {rule: 'dash'},
  {label: 'Water freezes', value: v[0]}, {label: 'Body, average', value: v[1]}, {label: 'Water boils', value: v[2]},
  {rule: 'double'}, {text: 'Water at sea level', align: 'center', small: true}, {gap: 0.6},
];
const C = temps('CELSIUS', ['0 °C', '37 °C', '100 °C']), F = temps('FAHRENHEIT', ['32 °F', '98.6 °F', '212 °F']);

function Argon({t}: {t: number}) {
  const away = prog(t, 10.6, 0.55) ** 2.2;
  return <div style={{position: 'absolute', inset: 0, transform: `translateY(${-away * 1300}px)`}}>
    <Chit term="Argon" lines={['A noble gas: it', 'joins with almost', 'nothing at all.']} at={[1400, 300]} angle={4} show={prog(t, 8.9, 0.35)} /></div>;
}

export default function Reel() {
  const t = useTime();
  let scene;
  if (t < 3.8) scene = <Stub {...TITLE} fed={fed(t, 0.3)} />;
  else if (t < 4.4) scene = <TearOff lines={stubLines(TITLE.kicker, TITLE.title, TITLE.note)} x={540} width={840} size={42} seed={`stub${TITLE.title.join('')}`} tear={prog(t, 3.8, 0.55)} />;
  else if (t < 10.6) scene = <><Receipt lines={AIR} fed={fed(t, 4.4)} seed="air" mark={{row: 4, kind: 'circle', draw: prog(t, 7.8, 0.5)}} /><Argon t={t} /></>;
  else if (t < 11.3) scene = <><TearOff lines={AIR} seed="air" tear={prog(t, 10.6, 0.55)} /><Argon t={t} /></>;
  else if (t < 16.6) scene = <Pair left={C} right={F} fed={fed(t, 11.3)} mark={{side: 1, row: 4, kind: 'tick', draw: prog(t, 14.0, 0.45)}} />;
  else if (t < 17.3) scene = <Pair left={C} right={F} tear={prog(t, 16.6, 0.55)} />;
  else scene = <LastStub name="AIR, ITEMISED" line="Printed one line at a time" note="Figures from standard tables" fed={fed(t, 17.3)} />;
  return <><Desk />{scene}</>;
}
