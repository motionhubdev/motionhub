// Typewriter Notes' typed block, and what the other typed parts share: the script of keystrokes, the sheet it is typed on.
import {seededRandom} from '@motionhub/runtime';

export const meta = {
  name: {en: 'Typed block', 'zh-CN': '打字段落'},
  purpose: 'quote',
  line: 'Lines typed onto a sheet one keystroke at a time, each letter a little uneven in ink and height; the sheet feeds up a line at each return. Inline marks give red ribbon, a struck-out word and an underline.',
  fits: 'a quotation and its source; a note; a definition; any few lines a film reads out',
  params: {
    lines: {type: 'text[]', doc: 'the lines, at most 40 characters each. {words} are typed in red ribbon; ~words~ are typed, then struck through with x; _words_ are typed, then underlined; "left | right" sets right with dot leaders'},
    typed: {type: 'number', default: 9999, doc: 'keystrokes typed so far: a letter is one, a return four (the sheet feeds up); animate it at about 14 a second for reading pace, up to 30 in a brisk reel. scriptLength(lines) gives the whole'},
    cols: {type: 'number', default: 40, doc: 'the line width in characters, for leaders and centring'},
    paper: {type: 'boolean', default: true, doc: 'draw the sheet under the type; false types onto a sheet drawn elsewhere'},
    seed: {type: 'string', default: 'tw', doc: 'which unevenness the letters take'},
  },
  preview: 6.8,
};

/** The page's grid, in frame pixels: type size, advance, line height, the line being typed, the left margin */
export const SIZE = 42, ADV = SIZE * 0.6, LH = 64, TYPE_Y = 772, LEFT = 456, COLS = 40, RETURN = 4;
export const SHEET = {x: 330, w: 1260};
export const colX = (col: number) => LEFT + col * ADV;
/** The baseline of line `i` of `n` once all of them are typed */
export const lineY = (i: number, n: number) => TYPE_Y - (n - 1 - i) * LH;

type Ev = {line: number; col: number; ch: string; red: boolean; tick: number};
type Script = {events: Ev[]; returns: number[]; length: number; lines: number};

const visible = (s: string) => s.replace(/[{}~_]/g, '');

/** The keystrokes of `lines`: each letter and overstrike with the tick it is struck on, and where each return begins */
export function script(lines: string[], cols = COLS): Script {
  const events: Ev[] = [], returns: number[] = [];
  let tick = 0;
  lines.forEach((raw, line) => {
    let text = raw;
    const bar = raw.indexOf(' | ');
    if (bar >= 0) {
      const l = raw.slice(0, bar), r = raw.slice(bar + 3), dots = Math.max(2, cols - visible(l).length - visible(r).length - 2);
      text = `${l} ${'․'.repeat(dots)} ${r}`;
    }
    let col = 0, red = false, strike = -1, under = -1;
    for (const c of text) {
      if (c === '{') { red = true; continue; }
      if (c === '}') { red = false; continue; }
      if (c === '~' || c === '_') {
        const start = c === '~' ? strike : under;
        if (start < 0) { if (c === '~') strike = col; else under = col; continue; }
        tick += 2; // back up
        for (let k = start; k < col; k++) events.push({line, col: k, ch: c === '~' ? 'x' : '_', red, tick: tick++});
        tick += 1;
        if (c === '~') strike = -1; else under = -1;
        continue;
      }
      // a leader is the full stop held down: quicker than a letter
      events.push({line, col, ch: c === '․' ? '.' : c, red, tick});
      // a run of one key (a rule, an indent, a leader) goes quicker than words
      const prev = events[events.length - 2], run = (c === ' ' || c === '-' || c === '=') && prev?.line === line && prev.ch === c;
      tick += c === '․' ? 0.15 : run || (c === ' ' && col === 0) ? 0.2 : c === ' ' ? 0.6 : 1;
      col++;
    }
    if (line < lines.length - 1) { returns.push(tick); tick += RETURN; }
  });
  return {events, returns, length: tick, lines: lines.length};
}
export const scriptLength = (lines: string[], cols = COLS) => script(lines, cols).length;

/** How many returns have fed the sheet at `typed`, fractional while one is under way */
export const fed = (s: Script, typed: number) => s.returns.reduce((n, r) => n + Math.max(0, Math.min(1, (typed - r) / RETURN)), 0);

/** The sheet: warm typing paper with a faint tooth, from `top` down behind the platen */
export function Paper({top}: {top: number}) {
  return (
    <div style={{position: 'absolute', left: SHEET.x, top, width: SHEET.w, height: 1200, background: 'var(--color-paper)',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 18px 40px rgba(0,0,0,0.35)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: TOOTH, opacity: 0.55}} />
    </div>
  );
}
const TOOTH = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="t" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="9" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.45 0 0 0 0 0.38 0 0 0 0 0.28 0 0 0 -0.9 0.5"/></filter>'
  + '<rect width="400" height="400" filter="url(#t)"/></svg>')}")`;

type Extra = {line: number; col: number; ch: string; red?: boolean; age?: number};
type Props = {lines: string[]; typed?: number; cols?: number; paper?: boolean; seed?: string; extra?: Extra[]};

export function Typed({lines, typed = 9999, cols = COLS, paper = true, seed = 'tw', extra = []}: Props) {
  const s = script(lines, cols), feed = fed(s, typed), n = s.lines;
  // the line being typed sits on TYPE_Y; earlier lines have fed up above it
  const y = (line: number) => TYPE_Y - (feed - line) * LH;
  const shown = s.events.filter((e) => e.tick < typed);
  const last = shown[shown.length - 1], done = typed >= s.length;
  // the type guide: under the next letter, or sliding back to the margin while the carriage returns
  const next = s.events.find((e) => e.tick >= typed);
  let guide = next ? next.col : last ? last.col + 1 : 0;
  const ret = s.returns.find((r) => typed >= r && typed < r + RETURN);
  if (ret !== undefined && last) guide = (last.col + 1) * (1 - Math.min(1, (typed - ret) / RETURN) ** 0.6);
  const glyph = (e: Ev | Extra, i: number, age: number) => {
    const r = seededRandom(`${seed}:${e.line}:${e.col}:${e.ch}:${i}`);
    const dx = (r() - 0.5) * 1.6, dy = (r() - 0.5) * 2.4, rot = (r() - 0.5) * 2.2, ink = 0.82 + r() * 0.18;
    const strike = age < 1 ? 1.08 - 0.08 * age : 1;
    const x = colX(e.col) + dx, yy = y(e.line) + dy;
    return (
      <text key={i} x={x} y={yy} fontSize={SIZE} fill={e.red ? 'var(--color-ribbon)' : 'var(--color-ink)'} opacity={Math.min(1, ink * (age < 1 ? 1.15 : 1))}
        transform={`rotate(${rot} ${x + ADV / 2} ${yy}) translate(${x + ADV / 2} ${yy}) scale(${strike}) translate(${-x - ADV / 2} ${-yy})`}>{e.ch}</text>
    );
  };
  const id = `tw-ink-${seed}`;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {paper && <Paper top={y(0) - SIZE * 2.6} />}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" result="d" />
            <feComponentTransfer in="n" result="a"><feFuncA type="linear" slope="2.4" intercept="-1.25" /></feComponentTransfer>
            <feComposite in="d" in2="a" operator="out" />
          </filter>
        </defs>
        <g filter={`url(#${id})`} style={{fontFamily: 'var(--font-type)', fontWeight: 400}}>
          {shown.map((e, i) => glyph(e, i, typed - e.tick))}
          {extra.map((e, i) => glyph(e, 1000 + i, e.age ?? 9))}
        </g>
        {!done && n > 0 && <path d={`M${colX(guide) + ADV / 2 - 9} ${TYPE_Y + 30}l9 -12l9 12z`} fill="var(--color-ribbon)" opacity={0.85} />}
      </svg>
    </div>
  );
}
