import {COLS, Typed} from './typed.tsx';

export const meta = {
  name: {en: 'Typed heading', 'zh-CN': '打字标题'},
  purpose: 'title',
  line: 'A heading typed in capitals at the centre of the sheet and ruled underneath with a row of equals signs, then the lines that follow it.',
  fits: 'what a sheet of notes is about; the book or talk a film opens on; a chapter',
  params: {
    title: {type: 'text', doc: 'a few words; typed in capitals'},
    lines: {type: 'text[]', default: [], doc: 'what is typed under it, with the Typed block\'s marks'},
    typed: {type: 'number', default: 9999, doc: 'keystrokes typed so far (titleLines(title, lines) through scriptLength gives the whole)'},
    seed: {type: 'string', default: 'tw-title', doc: 'which unevenness the letters take'},
  },
  preview: 2.2,
};

/** A heading's lines: centred capitals and a rule of the same length, a blank line, then `lines` */
export function titleLines(title: string, lines: string[] = []) {
  const t = title.toUpperCase(), pad = ' '.repeat(Math.max(0, Math.floor((COLS - t.length) / 2)));
  return [pad + t, pad + '='.repeat(t.length), ...(lines.length ? ['', ...lines] : [])];
}

export function Title({title, lines = [], typed = 9999, seed = 'tw-title'}: {title: string; lines?: string[]; typed?: number; seed?: string}) {
  return <Typed lines={titleLines(title, lines)} typed={typed} seed={seed} />;
}
