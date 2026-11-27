// Snapshot Line's reel: about twenty-two seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {Sequence, useTime} from '@motionhub/runtime';
import {Wall} from './parts/wall.tsx';
import {Title} from './parts/title.tsx';
import {Line} from './parts/line.tsx';
import {Pair} from './parts/pair.tsx';
import {Fill} from './parts/fill.tsx';
import {Pull} from './parts/pull.tsx';
import {span} from './parts/print.tsx';

export const reel = {seconds: 26.3, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): a print drops on its peg, the string is pulled, a caption is written */
export const cues = [
  {at: 0.4, role: 'land'}, {at: 1.4, role: 'draw', dur: 0.7}, {at: 3.3, role: 'cut', dur: 0.7},
  {at: 4.0, role: 'move', dur: 1.1}, {at: 5.7, role: 'draw', dur: 0.8}, {at: 6.6, role: 'move', dur: 1.1}, {at: 8.3, role: 'draw', dur: 0.8},
  {at: 9.2, role: 'move', dur: 1.1}, {at: 10.9, role: 'draw', dur: 0.8}, {at: 11.8, role: 'move', dur: 1.1}, {at: 13.5, role: 'draw', dur: 0.8}, {at: 14.4, role: 'move', dur: 1.1}, {at: 16.1, role: 'draw', dur: 0.8},
  {at: 18.4, role: 'cut', dur: 0.7}, {at: 19.2, role: 'land'}, {at: 20.2, role: 'land'}, {at: 21.4, role: 'draw', dur: 0.5},
  {at: 22.8, role: 'cut', dur: 0.7}, {at: 23.6, role: 'move', dur: 1.4}, {at: 24.8, role: 'draw', dur: 1.0}, {at: 25.4, role: 'out'},
];

const STAGES = [
  {picture: 'sun', caption: 'sun warms the sea', tag: '1'},
  {picture: 'cloud', caption: 'vapour rises, cools', tag: '2'},
  {picture: 'rain', caption: 'it falls as rain', tag: '3'},
  {picture: 'mountain', caption: 'or snow on peaks', tag: '4'},
  {picture: 'wave', caption: 'rivers run back', tag: '5'},
];

const Opening = ({t}: {t: number}) => <><Wall /><Title title="Where rain comes from" sub="in five snapshots" picture="rain" show={span(t, 0.2, 2.0)} /></>;
// the line runs on its own clock from 3.3 s: prints come in from the right, then the string is pulled one print at a time
const Stages = () => (
  <><Wall /><Line items={STAGES} moves={[{at: 0, to: -1.3}, {at: 0.7, to: 0}, {at: 3.3, to: 1}, {at: 5.9, to: 2}, {at: 8.5, to: 3}, {at: 11.1, to: 4}]} y={230} size={400} gap={540} mark={2} /></>
);
const Shares = ({t}: {t: number}) => (
  <><Wall /><Pair items={[{picture: 'wave', caption: 'salt water', tag: 'about 97%'}, {picture: 'mountain', caption: 'fresh water', tag: 'about 3%'}]}
    show={span(t, 19.0, 21.0)} mark={1} ring={span(t, 21.4, 21.9)} /></>
);
const End = ({t}: {t: number}) => <><Wall /><Fill picture="rain" caption="and round it goes" grow={span(t, 23.6, 25.0)} write={span(t, 24.7, 25.7)} /></>;

export default function Reel() {
  const t = useTime();
  const stages = <Sequence from={3.3}><Stages /></Sequence>;
  if (t < 3.3) return <Opening t={t} />;
  if (t < 4.0) return <Pull from={<Opening t={t} />} to={stages} go={span(t, 3.3, 4.0)} />;
  if (t < 18.4) return stages;
  if (t < 19.1) return <Pull from={stages} to={<Shares t={t} />} go={span(t, 18.4, 19.1)} />;
  if (t < 22.8) return <Shares t={t} />;
  if (t < 23.5) return <Pull from={<Shares t={t} />} to={<End t={t} />} go={span(t, 22.8, 23.5)} />;
  return <End t={t} />;
}
