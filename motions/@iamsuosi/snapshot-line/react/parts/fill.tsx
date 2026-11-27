import {Picture, Written, clamp, easeInOut} from './print.tsx';

export const meta = {
  name: {en: 'Into the print', 'zh-CN': '推进照片'},
  purpose: 'close',
  line: 'One print comes off the wall towards the viewer until it fills the height of the frame, and the closing words are written by hand on its white bottom edge.',
  fits: 'the last seconds of a film: the picture it comes back to, and the line it ends on',
  params: {
    picture: {type: 'text', doc: 'the picture (a name, see Snapshot)'},
    caption: {type: 'text', default: '', doc: 'the closing words, written on the edge'},
    grow: {type: 'progress', default: 1, doc: '0 to 1 over about 1.4 s: from a small print on the wall to one filling the frame\'s height'},
    write: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: the words written'},
  },
  preview: 26.0,
};

export function Fill({picture, caption = '', grow = 1, write = 1}: {picture: string; caption?: string; grow?: number; write?: number}) {
  const g = easeInOut(grow), lerp = (a: number, b: number) => a + (b - a) * g;
  // from a 360 px print in the middle of the wall to the whole frame, a 230 px white edge kept at the bottom
  const w = lerp(360, 860), h = lerp(432, 1040), left = lerp(780, 530), top = lerp(324, 20), b = lerp(21.6, 30), edge = lerp(93.6, 200);
  return (
    <div style={{position: 'absolute', left, top, width: w, height: h, background: 'var(--color-paper)', boxShadow: '0 20px 30px -14px rgba(0,0,0,0.5)'}}>
      <svg width={w - 2 * b} height={h - b - edge} viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', left: b, top: b, display: 'block'}}>
        <Picture name={picture} />
      </svg>
      {caption && <div style={{position: 'absolute', left: 0, right: 0, top: h - edge + edge * 0.28, display: 'flex', justifyContent: 'center', opacity: clamp(grow * 2)}}>
        <Written text={caption} write={write} size={edge * 0.48} /></div>}
    </div>
  );
}
