import {Strip} from './strip.tsx';
import {TapeLine} from './link.tsx';

export const meta = {
  name: {en: 'Title strips', 'zh-CN': '标题胶带'},
  purpose: 'title',
  line: 'A title written large on two or three long strips of tape, each a little crooked and set off from the last, with a vermilion tape line pressed under it.',
  fits: 'the question a wall answers; a chapter; the last line of a film',
  params: {
    lines: {type: 'text[]', doc: 'two or three short lines'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 2 s: the strips laid and written one after another, then the underline'},
    size: {type: 'px', default: 120, doc: 'the writing\'s height'},
    y: {type: 'px', default: 470, doc: 'the block\'s middle'},
  },
  preview: 3.4,
};

const span = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));

export function Title({lines, show = 1, size = 120, y = 470}: {lines: string[]; show?: number; size?: number; y?: number}) {
  const n = lines.length, step = size * 1.75, top = y - ((n - 1) * step) / 2, per = 0.8 / n;
  const offs = [-70, 60, -20], tilt = [-3, 2, -1.5];
  return (
    <>
      {lines.map((l, i) => <Strip key={i} text={l} at={[960 + offs[i % 3], top + i * step]} size={size} angle={tilt[i % 3]} show={span(show, i * per, (i + 1) * per)} />)}
      <TapeLine from={[620, top + (n - 1) * step + size * 1.05]} to={[1300, top + (n - 1) * step + size * 1.12]} tone="key" width={18} draw={span(show, 0.82, 1)} />
    </>
  );
}
