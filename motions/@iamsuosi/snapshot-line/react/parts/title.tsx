import {Snapshot, Written, clamp, easeOut, span} from './print.tsx';
import {peg} from './peg.ts';

export const meta = {
  name: {en: 'Title with a print', 'zh-CN': '标题与照片'},
  purpose: 'title',
  line: 'A title set large in a soft serif on the wall, a hand-written line under it in pen, and one print pegged beside it on a short length of string, swinging gently.',
  fits: 'the question a film opens on; a chapter title; a section of a list',
  params: {
    title: {type: 'text', doc: 'a few words, on one or two lines'},
    sub: {type: 'text', default: '', doc: 'a short hand-written line under it'},
    picture: {type: 'text', default: 'sun', doc: 'the print beside it (a picture name, see Snapshot)'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.6 s: the title rises in, the print drops onto its peg and swings, the line is written'},
  },
  preview: 2.6,
};

export function Title({title, sub = '', picture = 'sun', show = 1}: {title: string; sub?: string; picture?: string; show?: number}) {
  const a = easeOut(span(show, 0, 0.4)), drop = span(show, 0.15, 0.6), swing = 9 * Math.exp(-drop * 3.2) * Math.sin(drop * 14) * (drop > 0 ? 1 : 0);
  return (
    <>
      <div style={{position: 'absolute', left: 150, top: 330, width: 1000, opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
        <div style={{fontFamily: 'var(--font-display)', fontSize: 120, lineHeight: 1.02, color: 'var(--color-paper)', letterSpacing: '-0.01em'}}>{title}</div>
        {sub && <div style={{marginTop: 30}}><Written text={sub} write={span(show, 0.55, 1)} size={84} color="var(--color-tag)" align="left" /></div>}
      </div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, opacity: clamp(show * 4)}}>
        <path d="M1200 190 Q1460 250 1720 196" stroke="var(--color-string)" strokeWidth={3} fill="none" />
      </svg>
      <div style={{position: 'absolute', left: 1460 - 170, top: 226 - (1 - easeOut(drop)) * 60, width: 340, transformOrigin: '50% 0', transform: `rotate(${swing.toFixed(2)}deg)`, opacity: clamp(drop * 4)}}>
        <Snapshot picture={picture} develop={span(show, 0.4, 1)} size={340} />
        <div style={{position: 'absolute', left: 161, top: -40}}>{peg(100)}</div>
      </div>
    </>
  );
}
