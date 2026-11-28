import {Word, Fixings, type Gas} from './tube.tsx';

export const meta = {
  name: {en: 'Neon figure', 'zh-CN': '霓虹数字'},
  purpose: 'data',
  line: 'A figure in upright tube capitals, its digits lighting one after another, with a small line of white tube under it saying what it counts.',
  fits: 'a year, a count, a temperature or a price the scene turns on; one figure at a time',
  params: {
    value: {type: 'text', doc: 'the figure as it should read: 1898, 15 kV, 24/7'},
    label: {type: 'text', default: '', doc: 'what it counts, and its source, in small white tube'},
    color: {type: 'pink | cyan | amber | red | white', default: 'amber', doc: 'the figure\'s gas'},
    at: {type: '[x, y]', default: [960, 560], doc: 'the middle of the figure\'s baseline'},
    size: {type: 'px', default: 360, doc: 'the figure\'s height'},
    on: {type: 'progress', default: 1, doc: '0 to 1 over about 1.6 s: the digits, then the label'},
  },
  preview: 13.0,
};

export function Digits({value, label = '', color = 'amber', at = [960, 560], size = 360, on = 1}: {value: string; label?: string; color?: Gas; at?: [number, number]; size?: number; on?: number}) {
  const w = value.length * size * 0.5;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <Fixings points={[[at[0] - w * 0.35, at[1] - size * 0.1], [at[0] + w * 0.35, at[1] - size * 0.1]]} wire={[at[0] + w * 0.5, at[1] - size * 0.2]} />
      <Word text={value} x={at[0]} y={at[1]} size={size} color={color} face="block" on={Math.min(1, on / 0.7)} seed={`digits:${value}`} />
      {label && <Word text={label} x={at[0]} y={at[1] + 150} size={64} color="white" face="block" on={Math.max(0, (on - 0.6) / 0.4)} seed={`digits:${label}`} />}
    </svg>
  );
}
