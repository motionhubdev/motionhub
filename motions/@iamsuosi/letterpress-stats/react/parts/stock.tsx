export const meta = {
  name: {en: 'Stock', 'zh-CN': '棉纸'},
  purpose: 'ground',
  line: 'A sheet of cream cotton stock with soft fibres, a faint deckle shadow at its edges and a small folio in metal type in a corner.',
  fits: 'every scene: the sheet under all parts',
  params: {
    folio: {type: 'text', default: '', doc: 'a small note in the top right corner, in metal type: a page, a section'},
    note: {type: 'text', default: '', doc: 'a small note in the top left corner'},
  },
  preview: 7.0,
};

// cotton fibres and the felt's texture: one tile of noise, drawn once and repeated by the browser
const FIBRE = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="f" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.7 0.5" numOctaves="3" seed="2" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.45 0 0 0 0 0.38 0 0 0 0 0.27 0 0 0 -0.9 0.52"/></filter>'
  + '<filter id="s" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="2" seed="8" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.42 0 0 0 0 0.3 0 0 0 -0.7 0.4"/></filter>'
  + '<rect width="400" height="400" filter="url(#f)"/><rect width="400" height="400" filter="url(#s)" opacity="0.6"/></svg>')}")`;

export function Stock({folio = '', note = ''}: {folio?: string; note?: string}) {
  const small = {position: 'absolute', top: 52, fontFamily: 'var(--font-text)', fontSize: 26, fontStyle: 'italic', color: 'var(--color-muted)', letterSpacing: '0.02em'} as const;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-stock)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: FIBRE, opacity: 0.32}} />
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 160px rgba(120, 96, 60, 0.16)'}} />
      {note && <div style={{...small, left: 140}}>{note}</div>}
      {folio && <div style={{...small, right: 140}}>{folio}</div>}
    </div>
  );
}
