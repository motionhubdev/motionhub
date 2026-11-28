export const meta = {
  name: {en: 'Wall', 'zh-CN': '墙面'},
  purpose: 'ground',
  line: 'A deep teal plaster wall with a soft wash of daylight from the top left and a faint trowelled texture: the ground everything is hung on.',
  fits: 'every scene, under the string, the prints and the words',
  params: {},
  preview: 1.8,
};

// trowelled plaster: one tile of soft noise, drawn once and repeated by the browser
const PLASTER = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="p" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="9" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 -0.35"/></filter>'
  + '<filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="2" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.6 0.36"/></filter>'
  + '<rect width="400" height="400" filter="url(#p)" opacity="0.5"/><rect width="400" height="400" filter="url(#g)"/></svg>')}")`;

export function Wall() {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-wall)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: PLASTER, opacity: 0.35}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 18% 10%, var(--color-daylight) 0%, transparent 65%)', opacity: 0.22}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.28) 100%)'}} />
    </div>
  );
}
