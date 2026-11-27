import {BulbText, clamp} from './bulbs.tsx';

export const meta = {
  name: {en: 'Billing', 'zh-CN': '轮换节目'},
  purpose: 'steps',
  line: 'A fixed phrase painted on a plate over the sign, and under it one bulb word that is switched to the next in a sweep, item after item, like a sign changing its billing.',
  fits: 'a list told one item at a time; the options a choice comes down to; what is on tonight, this week, next',
  params: {
    phrase: {type: 'text', doc: 'the fixed words on the plate: NOW SHOWING, TODAY'},
    words: {type: 'text[]', doc: 'the items, each a short word or two'},
    step: {type: 'number', default: 0, doc: 'which item is lit, counting from 0; a fraction is the sweep to the next (animate one step over about 1 s, then hold)'},
    show: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: the plate appears and the first item sweeps on'},
    accent: {type: 'number', default: -1, doc: 'the item lit in ruby, the one that matters; -1 for none'},
    y: {type: 'px', default: 300, doc: 'the top of the plate'},
  },
  preview: 9.6,
};

export function Billing({phrase, words, step = 0, show = 1, accent = -1, y = 300}: {phrase: string; words: string[]; step?: number; show?: number; accent?: number; y?: number}) {
  const i = Math.max(0, Math.min(words.length - 1, Math.floor(step))), f = clamp(step - i);
  const next = Math.min(words.length - 1, i + 1), moving = f > 0 && next !== i;
  const shown = moving ? words[next] : words[i];
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp(show * 3)}}>
        <div style={{padding: '10px 40px 6px', background: 'var(--color-plate)', borderRadius: 6, boxShadow: 'inset 0 0 0 3px var(--color-brassDeep)',
          fontFamily: 'var(--font-display)', fontSize: 52, letterSpacing: '0.12em', color: 'var(--color-panel)', textTransform: 'uppercase'}}>{phrase}</div>
      </div>
      <BulbText text={shown} from={moving ? words[i] : ''} swap={moving ? f : step <= 0 ? show : 1} tone={(moving ? next : i) === accent ? 'ruby' : 'amber'} y={y + 250} width={1400} pitch={30} />
    </>
  );
}
