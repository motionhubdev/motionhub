// Letterpress Stats' reel: about twenty seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {span} from './parts/press.tsx';
import {Headline} from './parts/press.tsx';
import {Stock} from './parts/stock.tsx';
import {Figure} from './parts/figure.tsx';
import {Versus} from './parts/versus.tsx';
import {List} from './parts/list.tsx';
import {Ornament} from './parts/ornament.tsx';
import {Colophon} from './parts/colophon.tsx';
import {Feed} from './parts/feed.tsx';

export const reel = {seconds: 21, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): sorts slide in, the press comes down, a sheet is fed */
export const cues = [
  {at: 0.2, role: 'draw', dur: 1.2}, {at: 1.6, role: 'land'}, {at: 2.0, role: 'move'},
  {at: 3.8, role: 'cut', dur: 0.6}, {at: 4.5, role: 'draw', dur: 0.8}, {at: 5.4, role: 'land'},
  {at: 7.4, role: 'cut', dur: 0.6}, {at: 8.2, role: 'draw', dur: 0.6}, {at: 8.92, role: 'land'}, {at: 9.2, role: 'draw', dur: 0.6}, {at: 9.92, role: 'land'},
  {at: 11.4, role: 'cut', dur: 0.6}, {at: 12.3, role: 'count'}, {at: 12.8, role: 'count'}, {at: 13.3, role: 'count'}, {at: 13.8, role: 'count'}, {at: 14.2, role: 'move'},
  {at: 16.8, role: 'cut', dur: 0.6}, {at: 17.6, role: 'draw', dur: 0.6}, {at: 18.3, role: 'land'}, {at: 19.0, role: 'out'},
];

const Opening = ({t}: {t: number}) => (
  <><Stock note="On the hand press" folio="i" />
    <Headline lines={['Words you', 'can touch']} accent="touch" set={span(t, 0.2, 1.4)} press={span(t, 1.6, 1.82)} y={210} />
    <Ornament at={[960, 790]} width={1000} show={span(t, 2.0, 2.4)} /></>
);
const Lines = ({t}: {t: number}) => (
  <><Stock note="The Gutenberg Bible" folio="ii" />
    <Figure value="42" unit="lines" label="to a page of most of the Bible printed in Mainz, about 1455" set={span(t, 4.5, 5.3)} press={span(t, 5.4, 5.62)} y={700} /></>
);
const Copies = ({t}: {t: number}) => (
  <><Stock note="The Gutenberg Bible" folio="iii" />
    <Versus items={[{value: '180', label: 'copies printed, by most estimates'}, {value: '49', label: 'copies known to survive'}]} accent={1} show={span(t, 8.2, 10.2)} /></>
);
const Proof = ({t}: {t: number}) => (
  <><Stock note="How a sheet is printed" folio="iv" />
    <List title="Pulling a proof" rows={[{label: 'Set the type', value: 'by hand'}, {label: 'Lock up the forme', value: 'in a chase'}, {label: 'Ink the rollers', value: 'thinly'}, {label: 'Pull the impression', value: 'once'}]}
      shown={Math.max(0, (t - 12.3) / 0.5)} mark={3} /></>
);
const End = ({t}: {t: number}) => <><Stock /><Colophon name="Set & printed" line="Wood type, metal type, cotton paper" show={span(t, 17.6, 18.8)} /></>;

export default function Reel() {
  const t = useTime();
  if (t < 3.8) return <Opening t={t} />;
  if (t < 4.4) return <Feed from={<Opening t={t} />} to={<Lines t={t} />} feed={span(t, 3.8, 4.4)} />;
  if (t < 7.4) return <Lines t={t} />;
  if (t < 8.0) return <Feed from={<Lines t={t} />} to={<Copies t={t} />} feed={span(t, 7.4, 8.0)} />;
  if (t < 11.4) return <Copies t={t} />;
  if (t < 12.0) return <Feed from={<Copies t={t} />} to={<Proof t={t} />} feed={span(t, 11.4, 12.0)} />;
  if (t < 16.8) return <Proof t={t} />;
  if (t < 17.4) return <Feed from={<Proof t={t} />} to={<End t={t} />} feed={span(t, 16.8, 17.4)} />;
  return <End t={t} />;
}
