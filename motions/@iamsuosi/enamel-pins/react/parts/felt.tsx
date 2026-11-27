export const meta = {
  name: {en: 'Felt board', 'zh-CN': '毛毡板'},
  purpose: 'ground',
  line: 'Deep green felt with soft fibres and a pool of light, stitched round its edge in cream thread, with an optional small note in a corner.',
  fits: 'under every scene',
  params: {
    note: {type: 'text', default: '', doc: 'a small note at the top left, inside the stitching'},
  },
  preview: 0.2,
};

const FIBRE = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="f" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="3" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.75 0 0 0 0 0.85 0 0 0 0 0.8 0 0 0 -1.2 0.62"/></filter>'
  + '<filter id="d" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="8" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.05 0 0 0 0 0.03 0 0 0 -1.4 0.8"/></filter>'
  + '<rect width="400" height="400" filter="url(#d)" opacity="0.5"/><rect width="400" height="400" filter="url(#f)"/></svg>')}")`;

export function Felt({note = ''}: {note?: string}) {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-felt)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1100px 760px at 46% 40%, var(--color-feltLight), transparent 75%)'}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: FIBRE, opacity: 0.32}} />
      <div style={{position: 'absolute', inset: 34, borderRadius: 26, border: '4px dashed var(--color-stitch)', opacity: 0.55, boxShadow: 'inset 0 0 0 10px rgba(0,0,0,0.06)'}} />
      {note && <div style={{position: 'absolute', left: 80, top: 66, fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-stitch)', opacity: 0.9}}>{note}</div>}
    </div>
  );
}
