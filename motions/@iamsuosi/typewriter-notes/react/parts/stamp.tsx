export const meta = {
  name: {en: 'Rubber stamp', 'zh-CN': '橡皮印章'},
  purpose: 'close',
  line: 'A red rubber stamp pressed onto the sheet at an angle: a word in a double-ruled box with a line above and below it, the ink thin in places.',
  fits: 'the last beat: a sheet filed, read, done; a date and a name to end on',
  params: {
    word: {type: 'text', doc: 'one short word, in capitals'},
    top: {type: 'text', default: '', doc: 'a small line above it'},
    bottom: {type: 'text', default: '', doc: 'a small line below it: a date, a place'},
    at: {type: '[x, y]', default: [1180, 420], doc: 'the stamp\'s centre'},
    tilt: {type: 'degrees', default: -9, doc: 'its angle'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 0.5 s: it comes down from above and lands at 0.4, then lifts off its shadow'},
  },
  preview: 27.0,
};

export function Stamp({word, top = '', bottom = '', at = [1180, 420], tilt = -9, show = 1}: {word: string; top?: string; bottom?: string; at?: [number, number]; tilt?: number; show?: number}) {
  if (show <= 0) return null;
  const landed = show >= 0.4, fall = Math.min(1, show / 0.4), scale = landed ? 1 : 1.5 - 0.5 * fall ** 2;
  const w = Math.max(word.length * 62, 360), h = 210, id = `st-${word.replace(/\W/g, '')}`;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.9" numOctaves="2" seed="13" result="n" />
          <feComponentTransfer in="n" result="a"><feFuncA type="linear" slope="3.2" intercept="-1.15" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="a" operator="out" />
        </filter>
      </defs>
      <g transform={`translate(${at[0]} ${at[1]}) rotate(${tilt}) scale(${scale})`} opacity={landed ? 0.9 : 0.35 * fall}
        filter={landed ? `url(#${id})` : undefined} style={{fontFamily: 'var(--font-type)', fontWeight: 700}}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="none" stroke="var(--color-ribbon)" strokeWidth={9} />
        <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={h - 32} rx={8} fill="none" stroke="var(--color-ribbon)" strokeWidth={4} />
        {top && <text y={-52} textAnchor="middle" fontSize={30} letterSpacing="0.2em" fill="var(--color-ribbon)">{top.toUpperCase()}</text>}
        <text y={30} textAnchor="middle" fontSize={96} letterSpacing="0.06em" fill="var(--color-ribbon)">{word.toUpperCase()}</text>
        {bottom && <text y={78} textAnchor="middle" fontSize={30} letterSpacing="0.2em" fill="var(--color-ribbon)">{bottom.toUpperCase()}</text>}
      </g>
    </svg>
  );
}
