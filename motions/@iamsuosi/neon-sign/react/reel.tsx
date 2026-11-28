// Neon Sign's reel: five signs on one wall, switched on and off, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Wall} from './parts/wall.tsx';
import {Mark, SHAPES} from './parts/mark.tsx';
import {NeonWord, Tubes} from './parts/tube.tsx';
import {Digits} from './parts/digits.tsx';
import {Label} from './parts/label.tsx';
import {Switch} from './parts/switch.tsx';
import {Last} from './parts/last.tsx';

export const reel = {seconds: 24.5, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): tubes catch, the transformer swells, a figure, the switch */
export const cues = [
  {at: 0.4, role: 'land'}, {at: 0.75, role: 'land'}, {at: 0.4, role: 'draw', dur: 2.4}, {at: 1.5, role: 'land'},
  {at: 4.07, role: 'cut'}, {at: 4.75, role: 'land'}, {at: 5.2, role: 'land'}, {at: 6.2, role: 'land'},
  {at: 9.32, role: 'cut'}, {at: 10.0, role: 'land'}, {at: 10.5, role: 'count'}, {at: 11.2, role: 'land'},
  {at: 13.67, role: 'cut'}, {at: 14.4, role: 'land'}, {at: 15.0, role: 'land'}, {at: 15.7, role: 'land'},
  {at: 18.67, role: 'cut'}, {at: 19.4, role: 'land'}, {at: 19.9, role: 'land'}, {at: 21.6, role: 'land'}, {at: 22.4, role: 'land'}, {at: 22.8, role: 'out', dur: 1.6},
];

const span = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

const Sting = ({t}: {t: number}) => (
  <><Wall light="pink" lit={span(t, 0.4, 2.0)} at={[960, 420]} />
    <Mark shapes={['ring', 'moon']} colors={['pink', 'cyan']} name="after hours" at={[960, 340]} scale={1.9} on={span(t, 0.4, 2.2)} /></>
);
const Gas = ({t}: {t: number}) => (
  <><Wall light="pink" lit={span(t, 4.75, 6)} at={[960, 450]} />
    <NeonWord text="Neon" at={[960, 520]} size={330} color="pink" on={span(t, 4.75, 5.95)} />
    <NeonWord text="a gas that glows" at={[960, 760]} size={96} color="cyan" face="block" on={span(t, 6.2, 7.4)} /></>
);
const Found = ({t}: {t: number}) => (
  <><Wall light="amber" lit={span(t, 10.0, 11.2)} at={[960, 480]} />
    <Digits value="1898" label="found in London" at={[960, 600]} on={span(t, 10.0, 11.6)} /></>
);
const Colour = ({t}: {t: number}) => (
  <><Wall light="red" lit={span(t, 14.4, 16.6)} at={[1200, 480]} />
    <Label word="Neon" note="glows red-orange" at={[640, 470]} on={span(t, 14.4, 16.0)} />
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <Tubes paths={[SHAPES.wave]} color="red" on={span(t, 15.7, 16.9)} width={10} seed="reel:wave" transform="translate(1530 470) scale(1.7)" />
    </svg></>
);
const Paris = ({t}: {t: number}) => (
  <><Wall light="amber" lit={span(t, 19.4, 20.8)} at={[960, 620]} />
    <Last lines={[{text: 'first shown', color: 'white', face: 'block'}, {text: 'in Paris', color: 'pink'}, {text: '1910', color: 'amber', face: 'block'}]}
      keep={2} y={290} on={span(t, 19.4, 20.8)} off={span(t, 21.6, 23.1)} /></>
);

export default function Reel() {
  const t = useTime();
  if (t < 4.0) return <Sting t={t} />;
  if (t < 4.7) return <Switch from={<Sting t={t} />} to={<Gas t={t} />} p={span(t, 4.0, 4.7)} />;
  if (t < 9.25) return <Gas t={t} />;
  if (t < 9.95) return <Switch from={<Gas t={t} />} to={<Found t={t} />} p={span(t, 9.25, 9.95)} />;
  if (t < 13.6) return <Found t={t} />;
  if (t < 14.3) return <Switch from={<Found t={t} />} to={<Colour t={t} />} p={span(t, 13.6, 14.3)} />;
  if (t < 18.6) return <Colour t={t} />;
  if (t < 19.3) return <Switch from={<Colour t={t} />} to={<Paris t={t} />} p={span(t, 18.6, 19.3)} />;
  return <Paris t={t} />;
}
