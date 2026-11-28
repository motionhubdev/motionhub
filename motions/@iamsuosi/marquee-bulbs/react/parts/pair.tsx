import {Board} from './board.tsx';
import {BulbText, clamp} from './bulbs.tsx';

export const meta = {
  name: {en: 'Double bill', 'zh-CN': '双联招牌'},
  purpose: 'compare',
  line: 'Two small signs side by side, each with its bulb word and a painted plate; one comes on, then the other, and the one that loses the comparison dims to half.',
  fits: 'then and now; this or that; two options and the one chosen',
  params: {
    items: {type: '{word, label}[]', doc: 'two of them: a short bulb word and a small painted label'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1.6 s: the left sign comes on, then the right'},
    dim: {type: '0 | 1 | -1', default: -1, doc: 'which sign dims to half once both are lit; -1 for neither'},
    dimming: {type: 'progress', default: 0, doc: '0 to 1 over about 0.6 s: that sign dims'},
    chase: {type: 'number', default: 0, doc: 'the frames\' chase, in steps (time × 5)'},
  },
  preview: 19.3,
};

type Item = {word: string; label: string};

export function Pair({items, show = 1, dim = -1, dimming = 0, chase = 0}: {items: Item[]; show?: number; dim?: number; dimming?: number; chase?: number}) {
  return (
    <>
      {items.slice(0, 2).map((it, i) => {
        const x = i === 0 ? 120 : 1000, on = clamp((show - i * 0.5) / 0.5), k = dim === i ? 1 - 0.5 * clamp(dimming) : 1;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, opacity: k}}>
            <Board x={x} y={250} width={800} height={420} on={on} chase={chase} />
            <BulbText text={it.word} swap={on} x={x + 400} y={430} width={640} pitch={24} />
            <div style={{position: 'absolute', left: x, width: 800, top: 720, display: 'flex', justifyContent: 'center', opacity: on}}>
              <div style={{padding: '8px 28px 4px', background: 'var(--color-plate)', borderRadius: 6, boxShadow: 'inset 0 0 0 3px var(--color-brassDeep)',
                fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '0.1em', color: 'var(--color-panel)', textTransform: 'uppercase'}}>{it.label}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
