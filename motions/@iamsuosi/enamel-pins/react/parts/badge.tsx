import {PinBody, SHAPES} from './pin.tsx';
import {fit} from './banner.tsx';

export const meta = {
  name: {en: 'Number badge', 'zh-CN': '数字徽章'},
  purpose: 'data',
  line: 'A round pin with a figure set large in dark enamel on its cream face, a word under it inside a gold ring, and a coloured rim; pressed in and glinting.',
  fits: 'one figure a scene is about: a count, an age, a size; two of them side by side to compare',
  params: {
    value: {type: 'text', doc: 'the figure as it should read: 5, 6 wks, 100%'},
    label: {type: 'text', default: '', doc: 'one or two words under it, inside the ring'},
    at: {type: '[x, y]', doc: 'its centre'},
    size: {type: 'px', default: 460, doc: 'its width'},
    rim: {type: 'color', default: 'cherry', doc: 'the enamel ring round the face'},
    angle: {type: 'degrees', default: 4, doc: 'how it is turned'},
    press: {type: 'progress', default: 1, doc: 'as Pin'},
    glint: {type: 'progress', default: 1, doc: 'as Pin'},
  },
  preview: 6.2,
};

export function Badge({value, label = '', at, size = 460, rim = 'cherry', angle = 4, press = 1, glint = 1}: {value: string; label?: string; at: [number, number]; size?: number; rim?: string; angle?: number; press?: number; glint?: number}) {
  const vs = fit(value, 62, label ? 38 : 46), ls = fit(label.toUpperCase(), 44, 10);
  return (
    <PinBody d={SHAPES.circle} at={at} size={size} enamel={rim} angle={angle} press={press} glint={glint} id={`badge${value}${label}`}>
      <circle r={37} fill="var(--color-cream)" stroke="var(--color-gold)" strokeWidth={3.5} />
      <text y={label ? 4 : vs * 0.36} textAnchor="middle" fontSize={vs} fill="var(--color-ink)" style={{fontFamily: 'var(--font-display)'}}>{value}</text>
      {label && <text y={22} textAnchor="middle" fontSize={ls} fill="var(--color-ink)" style={{fontFamily: 'var(--font-display)', letterSpacing: '0.06em'}}>{label.toUpperCase()}</text>}
    </PinBody>
  );
}
