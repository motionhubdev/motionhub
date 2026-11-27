import {Receipt, type Line} from './receipt.tsx';

export const meta = {
  name: {en: 'Two receipts', 'zh-CN': '两张小票'},
  purpose: 'compare',
  line: 'Two printers side by side print the same list for two things, line for line, so their figures sit level; a ballpoint marks the line that differs.',
  fits: 'this against that, item by item; two prices, two specs, two units for the same things',
  params: {
    left: {type: 'Line[]', doc: 'the left receipt\'s print (as Receipt)'},
    right: {type: 'Line[]', doc: 'the right receipt\'s print, the same lines in the same order'},
    fed: {type: 'number', default: 99, doc: 'lines out of both mouths; the right one runs half a line behind'},
    mark: {type: '{side, row, kind, draw}', default: null, doc: 'a ballpoint stroke on one receipt\'s line: side 0 or 1'},
    tear: {type: 'progress', default: 0, doc: 'both torn off together'},
  },
  preview: 14.6,
};

type Mark = {side: 0 | 1; row: number; kind?: 'circle' | 'tick' | 'underline'; draw: number};

export function Pair({left, right, fed = 99, mark = null, tear = 0}: {left: Line[]; right: Line[]; fed?: number; mark?: Mark | null; tear?: number}) {
  return (
    <>
      <Receipt lines={left} fed={fed} x={180} width={720} seed="pairL" tear={tear} mark={mark?.side === 0 ? mark : null} />
      <Receipt lines={right} fed={fed - 0.5} x={1020} width={720} seed="pairR" tear={tear} mark={mark?.side === 1 ? mark : null} />
    </>
  );
}
