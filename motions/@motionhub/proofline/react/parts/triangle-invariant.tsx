import {clamp01} from '../math.ts';

export const meta = {
  name: 'Triangle invariant',
  purpose: 'data',
  line: 'A triangle whose apex moves parallel to its fixed base while its perpendicular height and area stay constant.',
  fits: 'Geometry introductions, area invariants, shearing, and explanations of what changes while a relationship stays true.',
  params: {
    baseStart: {type: '[x, y]', default: [350, 790], doc: 'Left endpoint of the horizontal base in frame pixels.'},
    base: {type: 'px', default: 780, doc: 'Base length in frame pixels.'},
    height: {type: 'px', default: 360, doc: 'Perpendicular height in frame pixels.'},
    apex: {type: 'px', default: 320, doc: 'Apex x-offset from baseStart; clamped so the altitude foot stays inside the base.'},
    construction: {type: 'progress', default: 1, doc: 'How much of the triangle outline has drawn.'},
    active: {type: 'progress', default: 1, doc: 'Opacity of the invariant area fill.'},
  },
  preview: 'previews/triangle-invariant.jpg',
};

export const TriangleInvariant = ({
  baseStart = [350, 790],
  base = 780,
  height = 360,
  apex = 320,
  construction = 1,
  active = 1,
}: {
  baseStart?: [number, number];
  base?: number;
  height?: number;
  apex?: number;
  construction?: number;
  active?: number;
}) => {
  const [x, y] = baseStart;
  const apexOffset = Math.max(base * 0.05, Math.min(base * 0.95, apex));
  const apexX = x + apexOffset;
  const apexY = y - height;
  const draw = clamp01(construction);
  const fill = clamp01(active);
  const triangle = `M${x} ${y}L${apexX} ${apexY}L${x + base} ${y}Z`;
  return (
    <g>
      <path d={triangle} fill="var(--color-active)" fillOpacity={0.12 * fill} stroke="none" />
      <line x1={x - 80} y1={apexY} x2={x + base + 80} y2={apexY} stroke="var(--color-muted)" strokeWidth="1.6" strokeDasharray="9 8" />
      <path d={triangle} fill="none" stroke="var(--color-construct)" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
      <line x1={apexX} y1={apexY} x2={apexX} y2={y} stroke="var(--color-muted)" strokeWidth="1.8" strokeDasharray="8 7" />
      <circle cx={apexX} cy={apexY} r="7" fill="var(--color-construct)" />
      <g fontFamily="var(--font-math)" fill="var(--color-ink)" fontSize="30">
        <text x={apexX + 18} y={apexY + height / 2} dominantBaseline="middle">h</text>
        <text x={x + base / 2} y={y + 70} textAnchor="middle">b</text>
      </g>
      <g stroke="var(--color-muted)" strokeWidth="1.6" fill="none">
        <path d={`M${x} ${y + 25}V${y + 45}M${x} ${y + 35}H${x + base}M${x + base} ${y + 25}V${y + 45}`} />
      </g>
    </g>
  );
};
