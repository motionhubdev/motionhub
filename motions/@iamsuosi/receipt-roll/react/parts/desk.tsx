export const meta = {
  name: {en: 'Counter', 'zh-CN': '柜台'},
  purpose: 'ground',
  line: 'A matte charcoal counter with a faint grain and a soft pool of light where the paper comes out; nothing else.',
  fits: 'under every scene',
  params: {
    light: {type: '[x, y]', default: [960, 620], doc: 'where the pool of light is brightest'},
  },
  preview: 0.2,
};

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480"><filter id="g" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.004 0.6" numOctaves="2" seed="9" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.3 0 0 0 0 0.31 0 0 0 0 0.34 0 0 0 -1.1 0.75"/></filter>'
  + '<rect width="480" height="480" filter="url(#g)"/></svg>')}")`;

export function Desk({light = [960, 620]}: {light?: [number, number]}) {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-desk)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.55}} />
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 900px 700px at ${light[0]}px ${light[1]}px, var(--color-deskGrain), transparent 70%)`, opacity: 0.9}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.35))'}} />
    </div>
  );
}
