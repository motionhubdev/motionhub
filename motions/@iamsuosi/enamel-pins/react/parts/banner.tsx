import {PinBody} from './pin.tsx';

export const meta = {
  name: {en: 'Banner pin', 'zh-CN': '横幅徽章'},
  purpose: 'title',
  line: 'Words set in dark enamel on a ribbon-shaped pin with notched ends and a gold outline, pressed into the felt and glinting; one or two short lines.',
  fits: 'a title; the claim of a promo; a name; a short verdict',
  params: {
    lines: {type: 'text[]', doc: 'one or two short lines, a few words in all'},
    at: {type: '[x, y]', doc: 'the banner\'s centre'},
    width: {type: 'px', default: 1100, doc: 'its width; the words are sized to fit it'},
    enamel: {type: 'color', default: 'cream', doc: 'its ground: cream or butter read best'},
    angle: {type: 'degrees', default: -3, doc: 'how it is turned'},
    press: {type: 'progress', default: 1, doc: 'as Pin: pressed in over about 0.35 s'},
    glint: {type: 'progress', default: 1, doc: 'as Pin'},
  },
  preview: 2.6,
};

/** Lilita One's average advance in em, for sizing words to a width */
export const LILITA = 0.5;
export const fit = (text: string, width: number, max: number) => Math.min(max, width / Math.max(1, [...text].length * LILITA));

export function Banner({lines, at, width = 1100, enamel = 'cream', angle = -3, press = 1, glint = 1}: {lines: string[]; at: [number, number]; width?: number; enamel?: string; angle?: number; press?: number; glint?: number}) {
  const n = Math.max(1, Math.min(2, lines.length)), H = n === 1 ? width * 0.22 : width * 0.36, T = H * 0.32, W = width;
  const d = `M${-W / 2} ${-H / 2}H${W / 2}L${W / 2 - T} 0L${W / 2} ${H / 2}H${-W / 2}L${-W / 2 + T} 0Z`;
  const size = Math.min(...lines.slice(0, 2).map((l) => fit(l, W - T * 2.6, (H / n) * 0.78)));
  return (
    <PinBody d={d} at={at} size={W} w={W} h={H} enamel={enamel} angle={angle} press={press} glint={glint} id={`banner${lines.join('')}`}>
      <path d={`M${-W / 2 + T * 1.25} ${-H / 2 + 12}H${W / 2 - T * 1.25}M${-W / 2 + T * 1.25} ${H / 2 - 12}H${W / 2 - T * 1.25}`} stroke="var(--color-gold)" strokeWidth={3} opacity={0.7} />
      {lines.slice(0, 2).map((l, i) => (
        <text key={i} x={0} y={(i - (n - 1) / 2) * (H / n) * 0.92 + size * 0.36} textAnchor="middle" fontSize={size} fill="var(--color-ink)"
          style={{fontFamily: 'var(--font-display)', letterSpacing: '0.02em'}}>{l}</text>
      ))}
    </PinBody>
  );
}
