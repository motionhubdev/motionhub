// Enamel Pins' reel: about twenty seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Felt} from './parts/felt.tsx';
import {Pin} from './parts/pin.tsx';
import {Banner} from './parts/banner.tsx';
import {Badge} from './parts/badge.tsx';
import {PinRow} from './parts/row.tsx';
import {BadgePair} from './parts/pair.tsx';
import {Card} from './parts/card.tsx';
import {Sheet} from './parts/sheet.tsx';

export const reel = {seconds: 20.5, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): a pin is pressed in, it glints, a sheet slides over */
export const cues = [
  {at: 0.5, role: 'land'}, {at: 1.0, role: 'land'}, {at: 1.25, role: 'land'}, {at: 1.5, role: 'land'}, {at: 1.9, role: 'draw'},
  {at: 3.6, role: 'move', dur: 0.6}, {at: 4.5, role: 'land'}, {at: 4.9, role: 'draw'},
  {at: 7.6, role: 'move', dur: 0.6}, {at: 8.55, role: 'land'}, {at: 8.95, role: 'land'}, {at: 9.35, role: 'land'},
  {at: 12.0, role: 'move', dur: 0.6}, {at: 12.85, role: 'land'}, {at: 13.2, role: 'land'}, {at: 13.5, role: 'count'},
  {at: 16.4, role: 'move', dur: 0.6}, {at: 17.0, role: 'cut', dur: 0.6}, {at: 18.0, role: 'land'}, {at: 18.4, role: 'out'},
];

const span = (t: number, a: number, d: number) => Math.max(0, Math.min(1, (t - a) / d));

const Open = ({t}: {t: number}) => (
  <><Felt note="Pinned facts · bees" />
    <Pin shape="flower" enamel="butter" at={[380, 300]} size={230} angle={-12} press={span(t, 1.0, 0.35)} glint={span(t, 1.4, 0.45)} />
    <Pin shape="hex" enamel="mint" at={[1560, 280]} size={200} angle={8} press={span(t, 1.25, 0.35)} glint={span(t, 1.65, 0.45)} />
    <Pin shape="drop" enamel="butter" at={[1500, 820]} size={170} angle={14} metal="silver" press={span(t, 1.5, 0.35)} glint={span(t, 1.9, 0.45)} />
    <Banner lines={['Meet the', 'honeybee']} at={[930, 560]} width={980} press={span(t, 0.4, 0.35)} glint={span(t, 1.9, 0.45)} /></>
);
const Eyes = ({t}: {t: number}) => (
  <><Felt note="Pinned facts · bees" />
    <Badge value="5" label="eyes" at={[760, 540]} size={520} rim="lilac" press={span(t, 4.4, 0.35)} glint={span(t, 4.85, 0.45)} />
    <Banner lines={['Two big,', 'three small']} at={[1390, 560]} width={560} angle={6} press={span(t, 5.2, 0.35)} glint={1} /></>
);
const Jobs = ({t}: {t: number}) => (
  <><Felt note="What a worker does" />
    <PinRow items={[{shape: 'flower', enamel: 'cherry', label: 'Pollinate'}, {shape: 'hex', enamel: 'butter', label: 'Build comb'}, {shape: 'drop', enamel: 'mint', label: 'Make honey'}]}
      shown={Math.max(0, (t - 8.45) / 0.4)} y={480} /></>
);
const Lives = ({t}: {t: number}) => (
  <><Felt note="How long they live" />
    <BadgePair left={{value: '6 wks', label: 'Worker, summer', rim: 'mint'}} right={{value: '5 yrs', label: 'Queen, at most', rim: 'cherry'}} press={span(t, 12.75, 1.0)} /></>
);
const End = ({t}: {t: number}) => <><Felt /><Card name={['Meet the', 'honeybee']} line="Small facts, pinned one at a time" show={span(t, 17.0, 1.5)} /></>;

export default function Reel() {
  const t = useTime();
  if (t < 3.6) return <Open t={t} />;
  if (t < 4.2) return <Sheet from={<Open t={t} />} to={<Eyes t={t} />} slide={span(t, 3.6, 0.6)} />;
  if (t < 7.6) return <Eyes t={t} />;
  if (t < 8.2) return <Sheet from={<Eyes t={t} />} to={<Jobs t={t} />} slide={span(t, 7.6, 0.6)} />;
  if (t < 12.0) return <Jobs t={t} />;
  if (t < 12.6) return <Sheet from={<Jobs t={t} />} to={<Lives t={t} />} slide={span(t, 12.0, 0.6)} />;
  if (t < 16.4) return <Lives t={t} />;
  if (t < 17.0) return <Sheet from={<Lives t={t} />} to={<End t={t} />} slide={span(t, 16.4, 0.6)} />;
  return <End t={t} />;
}
