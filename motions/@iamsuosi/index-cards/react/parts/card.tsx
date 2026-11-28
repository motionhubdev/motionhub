import type {ReactNode} from 'react';
import {Card, easeOut, span} from './desk.tsx';

export const meta = {
  name: {en: 'Note card', 'zh-CN': '说明卡'},
  purpose: 'term',
  line: 'A small card laid beside the stack: a word in the slab heading, what it means in two lines, and a little drawing in the corner; it is dealt onto the desk with a slight turn.',
  fits: 'a term a step uses; a tip; a warning; a measure to remember',
  params: {
    word: {type: 'text', doc: 'the word or the tip\'s name'},
    text: {type: 'text', doc: 'what it means, in about twelve words'},
    art: {type: 'node', default: null, doc: 'a small drawing, 200 × 200; none without one'},
    at: {type: '[x, y]', default: [1180, 640], doc: 'the card\'s top left corner'},
    tilt: {type: 'degrees', default: 3, doc: 'its turn on the desk'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 0.4 s: it is dealt in from the right'},
  },
  preview: 10.4,
};

export function NoteCard({word, text, art = null, at = [1180, 640], tilt = 3, show = 1}: {word: string; text: string; art?: ReactNode; at?: [number, number]; tilt?: number; show?: number}) {
  if (show <= 0) return null;
  const k = easeOut(span(show, 0, 1));
  return (
    <Card w={640} h={380} style={{left: at[0] + (1 - k) * 700, top: at[1], transform: `rotate(${tilt + (1 - k) * 12}deg)`}} lift={0.25}>
      <div style={{position: 'absolute', left: 40, top: 30, fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700, color: 'var(--color-accent)'}}>{word}</div>
      <div style={{position: 'absolute', left: 40, top: 140, width: art ? 360 : 560, fontFamily: 'var(--font-sans)', fontSize: 34, lineHeight: '56px', color: 'var(--color-ink)'}}>{text}</div>
      {art && <div style={{position: 'absolute', right: 26, top: 140, width: 200, height: 200}}>{art}</div>}
    </Card>
  );
}
