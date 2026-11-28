import {clamp01, formatNumber} from '../math.ts';

export const meta = {
  name: 'Area model',
  purpose: 'data',
  line: 'A shared-scale rectangle partition connecting (x + a)(x + b) with four meaningful areas.',
  fits: 'Secondary-school expansion, factorisation, like terms, multiplication, and the link between geometric and algebraic representations.',
  params: {
    a: {type: 'number', default: 2, doc: 'Positive constant added to x in the width; its pixel length is a times unit.'},
    b: {type: 'number', default: 3, doc: 'Positive constant added to x in the height; its pixel length is b times unit.'},
    xUnits: {type: 'number', default: 4.5, doc: 'Positive illustrative value of x used only to establish the shared geometric scale.'},
    origin: {type: '[x, y]', default: [230, 350], doc: 'Top-left corner of the area model in frame pixels.'},
    unit: {type: 'px', default: 80, doc: 'One shared pixel unit on both axes.'},
    outer: {type: 'progress', default: 1, doc: 'Construction progress of the outer rectangle.'},
    partitions: {type: 'progress', default: 1, doc: 'Construction progress of the two internal partitions.'},
    labels: {type: 'progress', default: 1, doc: 'Arrival progress of area and dimension labels.'},
    combine: {type: 'progress', default: 0, doc: 'Active progress of the shared relation ax + bx = (a + b)x.'},
  },
  preview: 'previews/area-model.jpg',
};

export type AreaModelProps = {
  a?: number;
  b?: number;
  xUnits?: number;
  origin?: [number, number];
  unit?: number;
  outer?: number;
  partitions?: number;
  labels?: number;
  combine?: number;
};

export const resolveAreaModel = (props: AreaModelProps) => {
  const a = props.a ?? 2;
  const b = props.b ?? 3;
  const xUnits = props.xUnits ?? 4.5;
  const origin = props.origin ?? [230, 350];
  const unit = props.unit ?? 80;
  if (a <= 0 || b <= 0 || xUnits <= 0 || unit <= 0) {
    throw new Error('Area-model a, b, xUnits, and unit must be positive.');
  }
  const xSize = xUnits * unit;
  const aSize = a * unit;
  const bSize = b * unit;
  return {
    a, b, xUnits, origin, unit, xSize, aSize, bSize,
    right: origin[0] + xSize + aSize,
    bottom: origin[1] + xSize + bSize,
    vertical: origin[0] + xSize,
    horizontal: origin[1] + xSize,
  };
};

const term = (coefficient: number) =>
  coefficient === 1 ? 'x' : `${formatNumber(coefficient)}x`;

export const AreaModel = (props: AreaModelProps) => {
  const {
    a, b, origin, xSize, aSize, bSize, right, bottom, vertical, horizontal,
  } = resolveAreaModel(props);
  const [x, y] = origin;
  const outer = clamp01(props.outer ?? 1);
  const partitions = clamp01(props.partitions ?? 1);
  const labels = clamp01(props.labels ?? 1);
  const combine = clamp01(props.combine ?? 0);
  const sharedStroke = {
    pathLength: 1,
    strokeDasharray: 1,
    fill: 'none',
  } as const;
  const dimensionStyle = {
    fontFamily: 'var(--font-math)',
    fontSize: 28,
    fill: 'var(--color-ink)',
    opacity: labels,
  } as const;

  return (
    <g>
      <g stroke="none">
        <rect x={x} y={y} width={xSize} height={xSize} fill="var(--color-construct)" fillOpacity={0.09 * labels} />
        <rect x={vertical} y={y} width={aSize} height={xSize} fill="var(--color-construct)" fillOpacity={0.09 * labels * (1 - combine)} />
        <rect x={x} y={horizontal} width={xSize} height={bSize} fill="var(--color-construct)" fillOpacity={0.09 * labels * (1 - combine)} />
        <rect x={vertical} y={horizontal} width={aSize} height={bSize} fill="var(--color-construct)" fillOpacity={0.05 * labels} />
        <rect x={vertical} y={y} width={aSize} height={xSize} fill="var(--color-active)" fillOpacity={0.12 * labels * combine} />
        <rect x={x} y={horizontal} width={xSize} height={bSize} fill="var(--color-active)" fillOpacity={0.12 * labels * combine} />
      </g>

      <rect x={x} y={y} width={xSize + aSize} height={xSize + bSize} stroke="var(--color-construct)" strokeWidth="3.2" strokeDashoffset={1 - outer} {...sharedStroke} />
      <line x1={vertical} y1={y} x2={vertical} y2={bottom} stroke="var(--color-construct)" strokeWidth="3.2" strokeDashoffset={1 - partitions} {...sharedStroke} />
      <line x1={x} y1={horizontal} x2={right} y2={horizontal} stroke="var(--color-construct)" strokeWidth="3.2" strokeDashoffset={1 - partitions} {...sharedStroke} />
      <g opacity={combine} stroke="var(--color-active)" strokeWidth="3.2" fill="none">
        <rect x={vertical} y={y} width={aSize} height={xSize} />
        <rect x={x} y={horizontal} width={xSize} height={bSize} />
      </g>

      <g stroke="var(--color-muted)" strokeWidth="1.5" fill="none" opacity={labels}>
        <path d={`M${x} ${y - 18}V${y - 32}M${x} ${y - 25}H${vertical}M${vertical} ${y - 32}V${y - 18}`} />
        <path d={`M${vertical} ${y - 18}V${y - 32}M${vertical} ${y - 25}H${right}M${right} ${y - 32}V${y - 18}`} />
        <path d={`M${x - 16} ${y}H${x - 32}M${x - 24} ${y}V${horizontal}M${x - 16} ${horizontal}H${x - 32}`} />
        <path d={`M${x - 16} ${horizontal}H${x - 32}M${x - 24} ${horizontal}V${bottom}M${x - 16} ${bottom}H${x - 32}`} />
      </g>
      <g {...dimensionStyle}>
        <text x={x + xSize / 2} y={y - 40} textAnchor="middle">x</text>
        <text x={vertical + aSize / 2} y={y - 40} textAnchor="middle">{formatNumber(a)}</text>
        <text x={x - 54} y={y + xSize / 2 + 10} textAnchor="middle">x</text>
        <text x={x - 54} y={horizontal + bSize / 2 + 10} textAnchor="middle">{formatNumber(b)}</text>
        <text x={right + 30} y={y + 32}>x &gt; 0</text>
      </g>

      <g fontFamily="var(--font-math)" textAnchor="middle" opacity={labels}>
        <text x={x + xSize / 2} y={y + xSize / 2 + 28} fontSize="92" fill="var(--color-construct)">x²</text>
        <text x={vertical + aSize / 2} y={horizontal + bSize / 2 + 24} fontSize="66" fill="var(--color-construct)">{formatNumber(a * b)}</text>
        <g fontSize="64" fill="var(--color-construct)" opacity={1 - combine}>
          <text x={vertical + aSize / 2} y={y + xSize / 2 + 22}>{term(a)}</text>
          <text x={x + xSize / 2} y={horizontal + bSize / 2 + 22}>{term(b)}</text>
        </g>
        <g fontSize="64" fill="var(--color-active)" opacity={combine}>
          <text x={vertical + aSize / 2} y={y + xSize / 2 + 22}>{term(a)}</text>
          <text x={x + xSize / 2} y={horizontal + bSize / 2 + 22}>{term(b)}</text>
        </g>
      </g>
    </g>
  );
};
