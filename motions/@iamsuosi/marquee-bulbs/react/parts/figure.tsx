import {BulbText, clamp, easeOut} from './bulbs.tsx';

export const meta = {
  name: {en: 'Bulb figure', 'zh-CN': '灯泡数字'},
  purpose: 'data',
  line: 'A number in large bulb digits that counts up to its real value, with what it counts painted on a plate beneath.',
  fits: 'the one figure a scene is about: a count, a year, a speed, a price; a countdown',
  params: {
    value: {type: 'number', doc: 'the real figure it lands on'},
    from: {type: 'number', default: 0, doc: 'where the count starts'},
    count: {type: 'progress', default: 1, doc: '0 to 1 over about 1.2 s: the count, slowing as it lands'},
    suffix: {type: 'text', default: '', doc: 'after the figure, in bulbs: %, +'},
    label: {type: 'text', default: '', doc: 'what it counts, painted small on the plate'},
    tone: {type: 'amber | ruby', default: 'amber', doc: 'the lamps\' colour'},
    y: {type: 'px', default: 430, doc: 'the middle of the digits'},
  },
  preview: 15.0,
};

export function Figure({value, from = 0, count = 1, suffix = '', label = '', tone = 'amber', y = 430}: {value: number; from?: number; count?: number; suffix?: string; label?: string; tone?: 'amber' | 'ruby'; y?: number}) {
  const v = Math.round(from + (value - from) * easeOut(count));
  const text = `${v}${suffix}`, wide = `${value}${suffix}`;
  // the digits keep the width of the figure they land on, so the number never jumps sideways
  const padded = text.padStart([...wide].length, ' ');
  return (
    <>
      <BulbText text={padded} y={y} width={1200} pitch={46} tone={tone} />
      {label && <div style={{position: 'absolute', left: 0, right: 0, top: y + 210, display: 'flex', justifyContent: 'center', opacity: clamp(count * 2)}}>
        <div style={{padding: '8px 30px 4px', background: 'var(--color-plate)', borderRadius: 6, boxShadow: 'inset 0 0 0 3px var(--color-brassDeep)',
          fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: '0.1em', color: 'var(--color-panel)', textTransform: 'uppercase'}}>{label}</div>
      </div>}
    </>
  );
}
