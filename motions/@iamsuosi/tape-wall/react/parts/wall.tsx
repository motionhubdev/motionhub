import {Tape} from './strip.tsx';

export const meta = {
  name: {en: 'Kraft wall', 'zh-CN': '牛皮纸墙'},
  purpose: 'ground',
  line: 'A wall of brown kraft paper with soft fibres and creases and the light falling off at its edges; a sheet taped over it shows a piece of tape at each corner.',
  fits: 'under every scene',
  params: {
    corners: {type: 'progress', default: 0, doc: '0 to 1: the four corner tapes of a sheet taped over the wall, pressed on one after another; none at 0'},
    label: {type: 'text', default: '', doc: 'a small typed label at the top left: a topic, a part'},
  },
  preview: 13.0,
};

const FIBRE = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><filter id="f" x="0" y="0" width="100%" height="100%">'
  + '<feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="3" seed="6" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.45 0 0 0 0 0.32 0 0 0 0 0.18 0 0 0 -1.1 0.62"/></filter>'
  + '<filter id="c" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="2" stitchTiles="stitch"/>'
  + '<feColorMatrix type="matrix" values="0 0 0 0 0.98 0 0 0 0 0.9 0 0 0 0 0.78 0 0 0 1.6 -0.75"/></filter>'
  + '<rect width="500" height="500" filter="url(#c)" opacity="0.5"/><rect width="500" height="500" filter="url(#f)"/></svg>')}")`;

const CORNERS: [number, number, number][] = [[70, 60, -38], [1850, 60, 36], [1850, 1020, -36], [70, 1020, 40]];

export function Wall({corners = 0, label = ''}: {corners?: number; label?: string}) {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-kraft)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: FIBRE, opacity: 0.6}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, var(--color-kraftLight), transparent 70%)', opacity: 0.55}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(60,35,10,0.28))'}} />
      {label && <div style={{position: 'absolute', left: 120, top: 92, fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-marker)', opacity: 0.6}}>{label}</div>}
      {corners > 0 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {CORNERS.map(([x, y, a], i) => <Tape key={i} at={[x, y]} w={190} h={58} angle={a} grow={(corners * 4 - i) * 1.5} seed={`corner${i}`} />)}
      </svg>}
    </div>
  );
}
