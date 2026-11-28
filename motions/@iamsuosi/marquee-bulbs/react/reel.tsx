// Marquee Bulbs' reel: about twenty-two seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Night} from './parts/night.tsx';
import {Board} from './parts/board.tsx';
import {BulbText, span} from './parts/bulbs.tsx';
import {Billing} from './parts/billing.tsx';
import {Figure} from './parts/figure.tsx';
import {Arrow} from './parts/arrow.tsx';
import {Pair} from './parts/pair.tsx';
import {Close} from './parts/close.tsx';
import {LightsDown} from './parts/lights-down.tsx';

export const reel = {seconds: 22.5, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): bulbs come on, words switch, a figure counts, the lights go down */
export const cues = [
  {at: 0.3, role: 'draw', dur: 0.8}, {at: 1.2, role: 'land'}, {at: 3.2, role: 'draw', dur: 1.0}, {at: 4.2, role: 'land'},
  {at: 5.8, role: 'cut'}, {at: 6.5, role: 'land'}, {at: 7.8, role: 'draw', dur: 1.0}, {at: 8.8, role: 'land'}, {at: 9.8, role: 'draw', dur: 1.0}, {at: 10.8, role: 'move'},
  {at: 11.8, role: 'cut'}, {at: 12.4, role: 'count', dur: 1.2}, {at: 13.6, role: 'land'}, {at: 14.0, role: 'draw', dur: 0.8},
  {at: 15.9, role: 'cut'}, {at: 16.5, role: 'land'}, {at: 17.3, role: 'land'}, {at: 18.4, role: 'move'},
  {at: 19.6, role: 'cut'}, {at: 20.3, role: 'draw', dur: 0.8}, {at: 21.2, role: 'out'},
];

const go = (t: number, a: number, s = 1) => span(t, a, a + s);

const Opening = ({t}: {t: number}) => (
  <><Night spill={go(t, 0.2, 1)} /><Board on={go(t, 0.1, 0.8)} chase={t > 1.2 ? t * 5 : 0} />
    <BulbText text={t < 3.2 ? 'TONIGHT' : 'THE PICTURES'} from={t < 3.2 ? '' : 'TONIGHT'} swap={t < 3.2 ? go(t, 0.3) : go(t, 3.2)} y={480} width={1400} pitch={36} /></>
);
const Showing = ({t}: {t: number}) => (
  <><Night /><Board chase={t * 5} />
    <Billing phrase="Now showing" words={['Comedy', 'Drama', 'Mystery']} step={t < 9.8 ? go(t, 7.8) : 1 + go(t, 9.8)} show={go(t, 6.5, 0.9)} accent={2} y={250} /></>
);
const Speed = ({t}: {t: number}) => (
  <><Night /><Board x={440} width={1040} chase={t * 5} />
    <Figure value={24} count={go(t, 12.4, 1.2)} label="Frames each second" y={430} />
    <Arrow from={[120, 840]} to={[400, 560]} draw={go(t, 14.0, 0.8)} run={t > 14.8 ? (t - 14.8) * 6 : 0} label="Sound film" /></>
);
const Then = ({t}: {t: number}) => (
  <><Night /><Pair items={[{word: 'SILENT', label: 'Until the late 1920s'}, {word: 'SOUND', label: 'From the late 1920s'}]} show={go(t, 16.4, 1.6)} dim={0} dimming={go(t, 18.4, 0.6)} chase={t > 18 ? t * 5 : 0} /></>
);
const End = ({t}: {t: number}) => <><Night /><Close name="The pictures" line="A short history, lit up" show={go(t, 20.2, 1.2)} /></>;

export default function Reel() {
  const t = useTime();
  if (t < 5.8) return <Opening t={t} />;
  if (t < 6.4) return <LightsDown from={<Opening t={t} />} to={<Showing t={t} />} go={go(t, 5.8, 0.6)} />;
  if (t < 11.8) return <Showing t={t} />;
  if (t < 12.4) return <LightsDown from={<Showing t={t} />} to={<Speed t={t} />} go={go(t, 11.8, 0.6)} />;
  if (t < 15.9) return <Speed t={t} />;
  if (t < 16.5) return <LightsDown from={<Speed t={t} />} to={<Then t={t} />} go={go(t, 15.9, 0.6)} />;
  if (t < 19.6) return <Then t={t} />;
  if (t < 20.2) return <LightsDown from={<Then t={t} />} to={<End t={t} />} go={go(t, 19.6, 0.6)} />;
  return <End t={t} />;
}
