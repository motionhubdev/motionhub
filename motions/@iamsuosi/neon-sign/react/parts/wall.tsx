import {seededRandom} from '@motionhub/runtime';

export const meta = {
  name: {en: 'Brick wall at night', 'zh-CN': '夜里的砖墙'},
  purpose: 'ground',
  line: 'A dark brick wall at night, mortar barely showing, with a pool of the sign\'s coloured light washed over the bricks behind it.',
  fits: 'every scene: the wall every tube is mounted on',
  params: {
    light: {type: 'pink | cyan | amber | red | white', default: 'pink', doc: 'the colour of the light on the wall: the sign\'s main gas'},
    lit: {type: 'progress', default: 1, doc: 'how much of it: follow the sign\'s own on'},
    at: {type: '[x, y]', default: [960, 480], doc: 'the middle of the pool of light'},
  },
  preview: 12.6,
};

const BRICKS = (() => {
  const r = seededRandom('neon:bricks'), rows: string[] = [];
  for (let y = 0, row = 0; y < 1080; y += 58, row++) {
    for (let x = (row % 2) * -92; x < 1920; x += 184) {
      const shade = 0.82 + r() * 0.3;
      rows.push(`<rect x="${x + 3}" y="${y + 3}" width="178" height="52" rx="3" fill="rgb(${Math.round(36 * shade)},${Math.round(30 * shade)},${Math.round(38 * shade)})"/>`);
    }
  }
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${rows.join('')}</svg>`)}")`;
})();
const GRIT = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="g" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="17" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.2 0.55"/></filter>'
  + '<rect width="320" height="320" filter="url(#g)"/></svg>')}")`;

export function Wall({light = 'pink', lit = 1, at = [960, 480]}: {light?: string; lit?: number; at?: [number, number]}) {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-mortar)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: BRICKS}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: GRIT, opacity: 0.6}} />
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 760px 480px at ${at[0]}px ${at[1]}px, var(--color-${light}), transparent 75%)`, opacity: 0.2 * lit, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 75% at 50% 45%, transparent 45%, rgba(0,0,0,0.6))'}} />
    </div>
  );
}
