export const meta = {
  name: 'Proofline tether',
  purpose: 'link',
  line: 'A thin connector drawn from a mathematical symbol to the feature it describes.',
  fits: 'Linking a term to an area, a slope to a tangent, a variable to a length, or any symbol to one mathematical referent.',
  params: {
    from: {type: '[x, y]', doc: 'Start point at the active symbol in frame pixels.'},
    to: {type: '[x, y]', doc: 'Endpoint on the mathematical referent in frame pixels.'},
    control1: {type: '[x, y]', default: null, doc: 'Optional first cubic control point; a direct curve is calculated without it.'},
    control2: {type: '[x, y]', default: null, doc: 'Optional second cubic control point; a direct curve is calculated without it.'},
    progress: {type: 'progress', default: 1, doc: 'How much of the connector has drawn, from the symbol toward the referent.'},
    color: {type: 'active | construct | compare | muted', default: 'active', doc: 'Semantic colour token for this relation.'},
  },
  preview: 'previews/tether.jpg',
};

export const Tether = ({
  from,
  to,
  control1,
  control2,
  progress = 1,
  color = 'active',
}: {
  from: [number, number];
  to: [number, number];
  control1?: [number, number] | null;
  control2?: [number, number] | null;
  progress?: number;
  color?: 'active' | 'construct' | 'compare' | 'muted';
}) => {
  const c1 = control1 ?? [from[0] + (to[0] - from[0]) * 0.35, from[1]];
  const c2 = control2 ?? [to[0] - (to[0] - from[0]) * 0.35, to[1]];
  const p = Math.max(0, Math.min(1, progress));
  const d = `M${from[0]} ${from[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${to[0]} ${to[1]}`;
  return (
    <g fill="none" stroke={`var(--color-${color})`} strokeWidth="2.6" strokeLinecap="round">
      <path d={d} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <circle cx={to[0]} cy={to[1]} r="6.5" fill={`var(--color-${color})`} stroke="none" opacity={p > 0.985 ? 1 : 0} />
    </g>
  );
};
