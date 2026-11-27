// Typewriter Notes' reel: three sheets typed at a brisk pace, for a player. Not a template: read it for how the parts move.
import {useTime} from '@motionhub/runtime';
import {Desk} from './parts/desk.tsx';
import {Typed, colX, lineY, scriptLength, script} from './parts/typed.tsx';
import {titleLines} from './parts/title.tsx';
import {Checklist, checklistLines} from './parts/checklist.tsx';
import {Ledger, ledgerLines} from './parts/ledger.tsx';
import {Pencil} from './parts/pencil.tsx';
import {Stamp} from './parts/stamp.tsx';
import {Feed} from './parts/feed.tsx';

const QUOTE = titleLines('Notes on Walden', [
  'I went to the woods because I',
  'wished to live {deliberately}, to',
  '~face~ front only the essential',
  'facts of life.',
  '',
  '      -- H. D. Thoreau, Walden, 1854',
]);
const ITEMS = ['one quotation to a card', 'copy it word for word', 'write down where it came from'];
const LIST = checklistLines('Keeping reading notes', ITEMS);
const ROWS = [{label: 'Boards', value: '$8.03½'}, {label: 'Shingles', value: '4.00'}, {label: 'Old brick', value: '4.00'}, {label: 'Nails', value: '3.90'}, {label: 'All the rest', value: '8.19'}];
const TOTAL = {label: 'Total', value: '$28.12½'};
const SUMS = ledgerLines('His house, 1845', ROWS, TOTAL);

// keystrokes a second in each sheet, and when each begins
const RATE = 30;
const A0 = 0.4, A1 = A0 + scriptLength(QUOTE) / RATE;
const NOTE = A1 + 0.4, F1 = NOTE + 1.9;
const B0 = F1 + 1.2, B1 = B0 + scriptLength(LIST) / RATE, TICKS = B1 + 0.3, F2 = TICKS + ITEMS.length * 0.45 + 0.9;
const C0 = F2 + 1.2, C1 = C0 + scriptLength(SUMS) / RATE, NOTE2 = C1 + 0.4, STAMP = NOTE2 + 1.8;

export const reel = {seconds: 28, width: 1920, height: 1080};

const runs = (lines: string[], start: number, rate: number) => {
  const s = script(lines);
  const out: {at: number; role: string; dur?: number}[] = [];
  let from = 0;
  for (const r of [...s.returns, s.length]) {
    out.push({at: start + from / rate, role: 'draw', dur: (r - from) / rate});
    if (r < s.length) out.push({at: start + r / rate, role: 'land'});
    from = r + 4;
  }
  return out;
};
/** What happens when, for the motion's sound (sound.json): keys run, the carriage returns, the bell, a pencil, a sheet out, the stamp */
export const cues = [
  ...runs(QUOTE, A0, RATE), {at: NOTE, role: 'move', dur: 1.1},
  {at: F1, role: 'cut', dur: 0.5},
  ...runs(LIST, B0, RATE), ...ITEMS.map((_, i) => ({at: TICKS + i * 0.45, role: 'land'})),
  {at: F2, role: 'cut', dur: 0.5},
  ...runs(SUMS, C0, RATE), {at: C1 - 0.3, role: 'count'}, {at: NOTE2, role: 'move', dur: 1.1}, {at: STAMP + 0.2, role: 'out'},
];

const k = (t: number, start: number, rate: number) => Math.max(0, (t - start) * rate);
const span = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

const Quote = ({t}: {t: number}) => (
  <>
    <Typed lines={QUOTE} typed={k(t, A0, RATE)} seed="walden" />
    <Pencil text="the whole book" at={[colX(31), lineY(5, QUOTE.length) + 8]} to={[colX(26) + 4, lineY(4, QUOTE.length) + 16]} size={54} show={span(t, NOTE, NOTE + 1.2)} />
  </>
);
const List = ({t}: {t: number}) => <Checklist title="Keeping reading notes" items={ITEMS} typed={t < B0 ? 0 : k(t, B0, RATE)} done={Math.max(0, (t - TICKS) / 0.45)} />;
const Sums = ({t}: {t: number}) => (
  <>
    <Ledger title="His house, 1845" rows={ROWS} total={TOTAL} typed={t < C0 ? 0 : k(t, C0, RATE)} />
    <Pencil text="a college room: $30 a year" at={[colX(0), lineY(2, SUMS.length) + 22]} tilt={-3} show={span(t, NOTE2, NOTE2 + 1.2)} size={58} />
    <Stamp word="Filed" top="Reading notes" bottom="Walden" at={[1385, 215]} show={span(t, STAMP, STAMP + 0.5)} />
  </>
);

export default function Reel() {
  const t = useTime();
  let sheet;
  if (t < F1) sheet = <Quote t={t} />;
  else if (t < B0 - 0.2) sheet = <Feed from={<Quote t={t} />} to={<List t={t} />} p={span(t, F1, B0 - 0.2)} />;
  else if (t < F2) sheet = <List t={t} />;
  else if (t < C0 - 0.2) sheet = <Feed from={<List t={t} />} to={<Sums t={t} />} p={span(t, F2, C0 - 0.2)} />;
  else sheet = <Sums t={t} />;
  return (<><Desk />{sheet}<Desk layer="platen" /></>);
}
