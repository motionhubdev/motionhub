import {Strip, Tape, Written, markerWidth} from './strip.tsx';

export const meta = {
  name: {en: 'Numbered strips', 'zh-CN': '编号胶带'},
  purpose: 'steps',
  line: 'Steps down the wall, one strip each, every strip led by its number written on a short square of teal tape; laid one after another, earlier ones stepping back a little.',
  fits: 'a process in three to five steps; causes in order; a list to read top to bottom',
  params: {
    items: {type: 'text[]', doc: 'three to five steps, a few words each'},
    shown: {type: 'number', default: 99, doc: 'how many are on the wall; a fraction is the next one being laid and written (about 0.9 s each)'},
    x: {type: 'px', default: 360, doc: 'the left edge of the numbers'},
    y: {type: 'px', default: 300, doc: 'the first step\'s centre line'},
    gap: {type: 'px', default: 150, doc: 'from one step to the next'},
  },
  preview: 18.2,
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

export function Steps({items, shown = 99, x = 360, y = 300, gap = 150}: {items: string[]; shown?: number; x?: number; y?: number; gap?: number}) {
  return (
    <>
      {items.map((it, i) => {
        const p = clamp(shown - i), tilt = [-2, 1.5, -1, 2, -1.5][i % 5], cy = y + i * gap;
        const quiet = clamp(shown - i - 1.2) * 0.6;
        if (p <= 0) return null;
        return (
          <div key={i}>
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
              <Tape at={[x + 46, cy]} w={96} h={96} angle={tilt * 2} grow={p / 0.25} seed={`n${i}`} color="var(--color-link)">
                <Written text={String(i + 1)} size={66} write={(p - 0.2) / 0.2} quiet={quiet} seed={`num${i}`} color="var(--color-tape)" />
              </Tape>
            </svg>
            <Strip text={it} at={[x + 130 + (markerWidth(it, 58) + 58 * 1.3) / 2, cy]} size={58} angle={tilt} show={clamp((p - 0.25) / 0.75)} quiet={quiet} />
          </div>
        );
      })}
    </>
  );
}
