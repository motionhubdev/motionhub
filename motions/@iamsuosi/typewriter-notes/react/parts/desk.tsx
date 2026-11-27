import {SHEET} from './typed.tsx';

export const meta = {
  name: {en: 'Desk and platen', 'zh-CN': '桌面与滚筒'},
  purpose: 'ground',
  line: 'A dark walnut desk seen from the typist\'s chair, and, as the front layer, the machine\'s black rubber platen and its paper bail across the bottom of the frame, which the sheet feeds out of.',
  fits: 'every scene: the desk under everything (layer="desk"), the platen over the sheet (layer="platen")',
  params: {
    layer: {type: 'desk | platen', default: 'desk', doc: 'desk: the ground, under everything; platen: the roller and bail, over the sheet'},
  },
  preview: 12.4,
};

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><filter id="g" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.004 0.08" numOctaves="3" seed="21" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0 0.05 0 0 0 1.4 -0.35"/></filter>'
  + '<rect width="960" height="540" filter="url(#g)"/></svg>')}")`;

export function Desk({layer = 'desk'}: {layer?: 'desk' | 'platen'}) {
  if (layer === 'desk') {
    return (
      <div style={{position: 'absolute', inset: 0, background: 'var(--color-desk)'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '1920px 1080px', opacity: 0.9}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 45%, transparent 40%, rgba(0,0,0,0.45))'}} />
      </div>
    );
  }
  const x0 = SHEET.x - 120, w = SHEET.w + 240;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* the bail: a thin bar with two small rollers, just under the line being typed */}
      <div style={{position: 'absolute', left: x0 + 60, top: 822, width: w - 120, height: 8, borderRadius: 4, background: 'linear-gradient(var(--color-metal), #55534f)', boxShadow: '0 3px 6px rgba(0,0,0,0.35)'}} />
      {[0.3, 0.7].map((f) => <div key={f} style={{position: 'absolute', left: x0 + w * f - 28, top: 816, width: 56, height: 20, borderRadius: 10, background: 'var(--color-platen)'}} />)}
      {/* the platen */}
      <div style={{position: 'absolute', left: x0, top: 852, width: w, height: 150, borderRadius: 26,
        background: 'linear-gradient(#3a3835 0%, var(--color-platen) 22%, #050505 70%, #24221f 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: x0 + 24, top: 870, width: w - 48, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)'}} />
      {/* knobs */}
      {[x0 - 70, x0 + w + 6].map((x) => <div key={x} style={{position: 'absolute', left: x, top: 872, width: 64, height: 110, borderRadius: 18, background: 'linear-gradient(90deg, #1a1918, #4a4743 50%, #1a1918)'}} />)}
      <div style={{position: 'absolute', left: 0, top: 1002, width: 1920, height: 78, background: 'linear-gradient(#1c1916, #0d0b0a)'}} />
    </div>
  );
}
