import {Written} from './strip.tsx';

export const meta = {
  name: {en: 'Tacked card', 'zh-CN': '图钉卡片'},
  purpose: 'mark',
  line: 'A white card pushed onto the wall with a vermilion thumbtack, slightly turned, with the key point written on it in two or three marker lines.',
  fits: 'the one thing to remember from a wall; a rule; the answer to the wall\'s question',
  params: {
    lines: {type: 'text[]', doc: 'two or three short lines'},
    at: {type: '[x, y]', doc: 'the card\'s centre'},
    width: {type: 'px', default: 520, doc: 'its width'},
    angle: {type: 'degrees', default: 3, doc: 'how it hangs'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: the card swings on and the tack is pushed in (0.35 s), then the lines are written'},
  },
  preview: 12.4,
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

export function Note({lines, at, width = 520, angle = 3, show = 1}: {lines: string[]; at: [number, number]; width?: number; angle?: number; show?: number}) {
  if (show <= 0) return null;
  const s = clamp(show), on = clamp(s / 0.35), lh = 62, h = 80 + lines.length * lh, swing = (1 - on) * 14;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`translate(${at[0]} ${at[1] - h / 2}) rotate(${angle + swing}) translate(0 ${h / 2})`} opacity={Math.min(1, on * 3)}>
        <rect x={-width / 2 + 6} y={-h / 2 + 10} width={width} height={h} fill="#000" opacity={0.2} />
        <rect x={-width / 2} y={-h / 2} width={width} height={h} fill="var(--color-card)" />
        {[...Array(lines.length)].map((_, i) => <line key={i} x1={-width / 2 + 30} x2={width / 2 - 30} y1={-h / 2 + 64 + (i + 1) * lh - 18} y2={-h / 2 + 64 + (i + 1) * lh - 18} stroke="#8FB4C9" strokeWidth={2} opacity={0.5} />)}
        {lines.map((l, i) => (
          <g key={i} transform={`translate(0 ${-h / 2 + 56 + (i + 0.5) * lh})`}>
            <Written text={l} size={40} write={(s - 0.35) / 0.65 * lines.length - i} seed={`n${l}`} />
          </g>
        ))}
        <g transform={`translate(0 ${-h / 2 + 22}) scale(${1 + (1 - on) * 0.6})`}>
          <ellipse cx={3} cy={6} rx={17} ry={14} fill="#000" opacity={0.25} />
          <circle r={17} fill="var(--color-key)" /><circle cx={-5} cy={-6} r={6} fill="#fff" opacity={0.45} />
        </g>
      </g>
    </svg>
  );
}
