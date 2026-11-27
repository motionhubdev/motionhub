import type {ReactNode} from 'react';
import {Video} from '@motionhub/runtime';
import {Scrawl, easeInOut, easeOut, span} from './table.tsx';

export const meta = {
  name: {en: 'Slide over', 'zh-CN': '叠片对比'},
  purpose: 'compare',
  line: 'Two mounted transparencies laid side by side on the light, labelled in grease pencil; then the after is slid across and laid over the before, its edge sweeping the change into view.',
  fits: 'a before and after of the same thing: a repair, a restoration, a cleaned or corrected picture, an edit',
  params: {
    before: {type: 'node', doc: 'the before picture, drawn into the slide\'s window (640 × 440)'},
    after: {type: 'node', doc: 'the after picture, the same framing'},
    beforeSrc: {type: 'string', default: '', doc: 'a video for the before instead of a picture'},
    afterSrc: {type: 'string', default: '', doc: 'a video for the after instead of a picture'},
    labels: {type: 'text[]', default: ['before', 'after'], doc: 'the words written on the two mounts'},
    lay: {type: 'progress', default: 1, doc: '0 to 1 over about 0.9 s: the two slides are laid down, one after the other'},
    over: {type: 'progress', default: 0, doc: '0 to 1 over about 0.8 s: the after is slid across onto the before, which it then covers, centred'},
  },
  preview: 3.2,
};

/** The window of a mount, the picture's size */
export const WIN = {w: 640, h: 440};
const MW = 760, MH = 560;

/** A card mount round a transparency: the picture glowing in its window, a word in grease pencil on the card under it */
export function Mount({x, y, children, src, label = '', labelColor, tilt = 0, scale = 1, lift = 0, write = 1}: {x: number; y: number; children?: ReactNode; src?: string; label?: string; labelColor?: string; tilt?: number; scale?: number; lift?: number; write?: number}) {
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MW, height: MH, transform: `rotate(${tilt}deg) scale(${scale})`,
      filter: `drop-shadow(0 ${4 + 26 * lift}px ${6 + 30 * lift}px rgba(20, 24, 22, ${0.18 + 0.2 * lift}))`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: 'var(--color-mount)'}} />
      <div style={{position: 'absolute', left: (MW - WIN.w) / 2, top: 34, width: WIN.w, height: WIN.h, overflow: 'hidden', borderRadius: 4, background: '#fff'}}>
        {src ? <Video src={src} objectFit="cover" style={{width: '100%', height: '100%'}} /> : children}
      </div>
      <svg width={MW} height={MH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Scrawl text={label} x={60} y={MH - 26} size={48} p={write} color={labelColor} />
      </svg>
    </div>
  );
}

type Props = {before?: ReactNode; after?: ReactNode; beforeSrc?: string; afterSrc?: string; labels?: string[]; lay?: number; over?: number};

export function Pair({before, after, beforeSrc = '', afterSrc = '', labels = ['before', 'after'], lay = 1, over = 0}: Props) {
  const a = easeOut(span(lay, 0, 0.55)), b = easeOut(span(lay, 0.45, 1));
  const o = easeInOut(over);
  // side by side they sit at 150 and 1010; laid over, both sit centred at 580
  const bx = 150 + (580 - 150) * o, ax = 1010 + (580 - 1010) * o;
  const lift = Math.sin(Math.PI * o);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {a > 0 && <div style={{opacity: Math.min(1, a * 2)}}><Mount x={bx} y={250 - 40 * (1 - a)} tilt={-1.2 * (1 - o)} scale={1 + 0.05 * (1 - a)} lift={1 - a} label={labels[0]} write={span(lay, 0.3, 0.6)} src={beforeSrc || undefined}>{before}</Mount></div>}
      {b > 0 && <div style={{opacity: Math.min(1, b * 2)}}><Mount x={ax} y={250 - 40 * (1 - b) - 14 * lift} tilt={1.4 * (1 - o)} scale={1 + 0.05 * (1 - b) + 0.02 * lift} lift={Math.max(1 - b, lift)} label={labels[1]} labelColor="var(--color-after)" write={span(lay, 0.8, 1)} src={afterSrc || undefined}>{after}</Mount></div>}
    </div>
  );
}
