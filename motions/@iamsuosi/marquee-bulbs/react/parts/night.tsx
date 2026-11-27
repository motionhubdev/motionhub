export const meta = {
  name: {en: 'Night street', 'zh-CN': '夜街'},
  purpose: 'ground',
  line: 'A street after dark: a plum-black sky, the faint courses of a brick wall, and the warm spill of the sign on the pavement below.',
  fits: 'every scene: the ground under the sign and everything on it',
  params: {
    spill: {type: 'progress', default: 1, doc: 'how much of the sign\'s warm light falls on the wall and pavement: follow the bulbs as they come on'},
  },
  preview: 21.4,
};

// faint brick courses: one tile, drawn once and repeated by the browser
const BRICK = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><g fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="2">'
  + '<path d="M0 1H240M0 41H240M60 1V41M180 1V41M0 41V80M120 41V80M240 41V80"/></g></svg>')}")`;

export function Night({spill = 1}: {spill?: number}) {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-night)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: BRICK, opacity: 0.8}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 48%, var(--color-spill) 0%, transparent 70%)', opacity: 0.22 * spill}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(var(--color-pavement), var(--color-night))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, height: 80, background: 'radial-gradient(ellipse 50% 100% at 50% 0%, var(--color-spill) 0%, transparent 80%)', opacity: 0.18 * spill}} />
    </div>
  );
}
