// Tape Wall's reel: about twenty seconds of its components at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Wall} from './parts/wall.tsx';
import {Strip, markerWidth} from './parts/strip.tsx';
import {TapeLine} from './parts/link.tsx';
import {Note} from './parts/note.tsx';
import {Title} from './parts/title.tsx';
import {Steps} from './parts/steps.tsx';
import {NewSheet} from './parts/sheet.tsx';

export const reel = {seconds: 22, width: 1920, height: 1080};
/** What happens when, for the motion's sound (sound.json): tape torn and pressed, marker written, a sheet comes down, a tack pushed in */
export const cues = [
  {at: 0.3, role: 'cut'}, {at: 0.45, role: 'draw', dur: 0.5}, {at: 1.35, role: 'cut'}, {at: 1.5, role: 'draw', dur: 0.5}, {at: 2.3, role: 'move', dur: 0.4},
  {at: 4.8, role: 'out', dur: 0.5}, {at: 5.4, role: 'land'},
  {at: 5.9, role: 'cut'}, {at: 6.2, role: 'draw', dur: 0.5}, {at: 6.8, role: 'move', dur: 0.4}, {at: 7.2, role: 'cut'}, {at: 7.5, role: 'draw', dur: 0.5},
  {at: 8.2, role: 'move', dur: 0.4}, {at: 8.6, role: 'cut'}, {at: 8.9, role: 'draw', dur: 0.5}, {at: 9.9, role: 'land'}, {at: 10.0, role: 'draw', dur: 0.6},
  {at: 11.0, role: 'move', dur: 0.4}, {at: 11.4, role: 'cut'}, {at: 11.7, role: 'draw', dur: 0.5},
  {at: 13.2, role: 'out', dur: 0.5}, {at: 13.8, role: 'land'},
  {at: 14.1, role: 'cut'}, {at: 15.0, role: 'cut'}, {at: 15.9, role: 'cut'}, {at: 16.8, role: 'cut'},
  {at: 19.2, role: 'out', dur: 0.5}, {at: 19.9, role: 'cut'}, {at: 20.6, role: 'cut'}, {at: 21.2, role: 'move', dur: 0.3},
];

const span = (t: number, a: number, d: number) => Math.max(0, Math.min(1, (t - a) / d));
const edge = (text: string, x: number, side: 1 | -1) => x + side * (markerWidth(text, 60) + 78) / 2;

const Ask = ({t}: {t: number}) => <><Wall label="Light and air" /><Title lines={['Why is', 'the sky blue?']} show={span(t, 0.3, 2.3)} /></>;

function Map({t}: {t: number}) {
  const q = span(t, 11.0, 0.6) * 0.6;
  return (
    <>
      <Wall label="Light and air" corners={span(t, 5.3, 0.5)} />
      <Strip text="Sunlight" at={[400, 320]} angle={-3} show={span(t, 5.9, 0.85)} quiet={q} />
      <TapeLine from={[edge('Sunlight', 400, 1) + 14, 322]} to={[edge('Air molecules', 1260, -1) - 18, 318]} draw={span(t, 6.8, 0.45)} />
      <Strip text="Air molecules" at={[1260, 320]} angle={2} show={span(t, 7.2, 0.85)} quiet={q} />
      <TapeLine from={[1260, 372]} to={[1260, 510]} draw={span(t, 8.2, 0.4)} />
      <Strip text="Blue scatters most" at={[1260, 570]} angle={-1.5} show={span(t, 8.6, 0.85)} />
      <Note lines={['Shorter waves', 'bounce around', 'more']} at={[470, 600]} width={480} angle={-4} show={span(t, 9.6, 1.1)} />
      <TapeLine from={[1250, 622]} to={[1250, 772]} tone="key" width={16} draw={span(t, 11.0, 0.5)} />
      <Strip text="The sky looks blue" at={[1240, 850]} angle={1} show={span(t, 11.4, 0.85)} />
    </>
  );
}

const Sunset = ({t}: {t: number}) => (
  <><Wall label="At sunset" corners={span(t, 13.7, 0.5)} />
    <Steps items={['Sun sits low', 'Light crosses more air', 'Blue scatters away', 'Reds and oranges remain']} shown={Math.max(0, (t - 14.1) / 0.9)} x={300} y={290} gap={165} /></>
);
const Close = ({t}: {t: number}) => <><Wall label="Light and air" corners={span(t, 19.7, 0.4)} /><Title lines={['Look up', 'tonight']} show={span(t, 19.9, 1.6)} /></>;

export default function Reel() {
  const t = useTime();
  if (t < 4.8) return <Ask t={t} />;
  if (t < 5.3) return <NewSheet from={<Ask t={t} />} to={<Map t={t} />} drop={span(t, 4.8, 0.5)} />;
  if (t < 13.2) return <Map t={t} />;
  if (t < 13.7) return <NewSheet from={<Map t={t} />} to={<Sunset t={t} />} drop={span(t, 13.2, 0.5)} />;
  if (t < 19.2) return <Sunset t={t} />;
  if (t < 19.7) return <NewSheet from={<Sunset t={t} />} to={<Close t={t} />} drop={span(t, 19.2, 0.5)} />;
  return <Close t={t} />;
}
