// A wooden peg, drawn: shared by the parts that hang prints on a string. Not a component (it has no meta).
import {createElement as h} from 'react';

/** A clothes peg standing on the string at its top middle, `s` its height in px */
export function peg(s: number) {
  const w = s * 0.28;
  return h('svg', {width: w * 1.6, height: s, viewBox: '0 0 28 100', style: {display: 'block', overflow: 'visible'}},
    h('rect', {x: 4, y: 0, width: 10, height: 100, rx: 3, fill: 'var(--color-wood)'}),
    h('rect', {x: 14, y: 0, width: 10, height: 100, rx: 3, fill: 'var(--color-woodDeep)'}),
    h('rect', {x: 2, y: 38, width: 24, height: 10, rx: 2, fill: 'var(--color-spring)'}),
    h('circle', {cx: 14, cy: 43, r: 3, fill: 'var(--color-woodDeep)'}));
}
