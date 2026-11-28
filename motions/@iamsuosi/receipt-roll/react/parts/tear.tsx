import {Receipt, type Line} from './receipt.tsx';

export const meta = {
  name: {en: 'Tear-off', 'zh-CN': '撕下'},
  purpose: 'transition',
  line: 'The printed strip is torn off at the mouth and lifted up and out of the frame with a slight turn, leaving a fresh torn edge for the next print.',
  fits: 'from one receipt to the next; the end of a list; a clean start',
  params: {
    lines: {type: 'Line[]', doc: 'the print being torn off, as it stands'},
    tear: {type: 'progress', doc: '0 to 1 over about 0.55 s'},
    x: {type: 'px', default: 580, doc: 'the paper\'s left edge, as Receipt'},
    width: {type: 'px', default: 760, doc: 'its width'},
    size: {type: 'px', default: 38, doc: 'the print size, as Receipt'},
    seed: {type: 'string', default: 'r', doc: 'the same seed as the receipt it tears, so its edge stays the same'},
  },
  preview: 4.1,
};

export function TearOff({lines, tear, x = 580, width = 760, seed = 'r', size = 38}: {lines: Line[]; tear: number; x?: number; width?: number; seed?: string; size?: number}) {
  return <Receipt lines={lines} tear={tear} x={x} width={width} seed={seed} size={size} />;
}
