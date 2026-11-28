import {useId} from 'react';
import {
  clamp01,
  formatNumber,
  quadratic,
  secantSlope,
  tangentSlope,
  tangentValue,
  type Quadratic,
} from '../math.ts';

export const meta = {
  name: 'Quadratic change',
  purpose: 'data',
  line: 'A quadratic curve with a model-derived secant, moving point, slope construction, and limiting tangent.',
  fits: 'Functions, average and instantaneous rate of change, secants approaching tangents, and introductory derivatives.',
  params: {
    coefficients: {type: '[a, b, c]', default: [1, 0, 0], doc: 'Quadratic coefficients for f(x) = ax² + bx + c.'},
    x0: {type: 'number', default: 1, doc: 'Fixed x-coordinate at which the limiting tangent is taken.'},
    h: {type: 'number', default: 1, doc: 'Nonzero horizontal separation of the moving secant point; never sample zero for a secant.'},
    origin: {type: '[x, y]', default: [390, 880], doc: 'Pixel origin of the mathematical coordinate system.'},
    unit: {type: 'px', default: 105, doc: 'Equal pixels per data unit on both axes.'},
    trace: {type: 'progress', default: 1, doc: 'How much of the function curve has traced.'},
    secant: {type: 'progress', default: 1, doc: 'Visibility of the secant; set to zero for the clean limit transition.'},
    tangent: {type: 'progress', default: 0, doc: 'Visibility of the limiting tangent.'},
    construction: {type: 'progress', default: 1, doc: 'Visibility of the rise/run construction and moving-point labels.'},
  },
  preview: 'previews/quadratic-graph.jpg',
};

export type QuadraticGraphProps = {
  coefficients?: [number, number, number];
  x0?: number;
  h?: number;
  origin?: [number, number];
  unit?: number;
  trace?: number;
  secant?: number;
  tangent?: number;
  construction?: number;
};

export const resolveQuadraticGraph = (props: QuadraticGraphProps) => {
  const tuple = props.coefficients ?? [1, 0, 0];
  const coefficients: Quadratic = {a: tuple[0], b: tuple[1], c: tuple[2]};
  const x0 = props.x0 ?? 1;
  const h = props.h ?? 1;
  const origin = props.origin ?? [390, 880];
  const unit = props.unit ?? 105;
  if (unit <= 0) {
    throw new Error('Graph unit must be positive.');
  }
  const px = (x: number) => origin[0] + unit * x;
  const py = (y: number) => origin[1] - unit * y;
  return {coefficients, x0, h, origin, unit, px, py};
};

export const QuadraticGraph = (props: QuadraticGraphProps) => {
  const {coefficients, x0, h, origin, unit, px, py} = resolveQuadraticGraph(props);
  const trace = clamp01(props.trace ?? 1);
  const secant = clamp01(props.secant ?? 1);
  const tangent = clamp01(props.tangent ?? 0);
  const construction = clamp01(props.construction ?? 1);
  const id = useId().replace(/:/g, '');
  const bounds = {left: 150, top: 320, right: 850, bottom: 910};
  const domain = [-2.15, 2.25];
  const f0 = quadratic(coefficients, x0);
  const hasSecant = secant > 0 && h !== 0;
  const slope = hasSecant ? secantSlope(coefficients, x0, h) : tangentSlope(coefficients, x0);
  const qx = x0 + h;
  const qy = quadratic(coefficients, qx);
  const curve: string[] = [];
  for (let i = 0; i <= 240; i += 1) {
    const x = domain[0] + ((domain[1] - domain[0]) * i) / 240;
    curve.push(`${i === 0 ? 'M' : 'L'}${px(x)} ${py(quadratic(coefficients, x))}`);
  }
  const dataLeft = (bounds.left - origin[0]) / unit;
  const dataRight = (bounds.right - origin[0]) / unit;
  const secantY = (x: number) => f0 + slope * (x - x0);
  const tangentY = (x: number) => tangentValue(coefficients, x0, x);
  const showQCoordinates = hasSecant && Math.abs(h) >= 0.35;

  return (
    <g>
      <defs>
        <clipPath id={`graph-clip-${id}`}>
          <rect x={bounds.left} y={bounds.top} width={bounds.right - bounds.left} height={bounds.bottom - bounds.top} />
        </clipPath>
      </defs>

      <g stroke="var(--color-grid)" strokeWidth="1">
        {[-2, -1, 0, 1, 2, 3, 4].map((x) => <line key={`gx${x}`} x1={px(x)} y1={bounds.top} x2={px(x)} y2={origin[1]} />)}
        {[1, 2, 3, 4, 5].map((y) => <line key={`gy${y}`} x1={bounds.left} y1={py(y)} x2={bounds.right} y2={py(y)} />)}
      </g>
      <g stroke="var(--color-ink)" strokeWidth="2.2" fill="none">
        <line x1={bounds.left} y1={origin[1]} x2={bounds.right} y2={origin[1]} />
        <line x1={origin[0]} y1={bounds.bottom} x2={origin[0]} y2={bounds.top} />
      </g>
      <path d={`M${bounds.right} ${origin[1]}l-12 -6v12Z`} fill="var(--color-ink)" />
      <path d={`M${origin[0]} ${bounds.top}l-6 12h12Z`} fill="var(--color-ink)" />

      <g fontFamily="var(--font-math)" fontSize="20" fill="var(--color-ink)">
        {[-2, -1, 1, 2, 3, 4].map((x) => <text key={`tx${x}`} x={px(x)} y={origin[1] + 37} textAnchor="middle">{x}</text>)}
        {[1, 2, 3, 4, 5].map((y) => <text key={`ty${y}`} x={origin[0] - 20} y={py(y) + 7} textAnchor="end">{y}</text>)}
        <text x={origin[0] - 20} y={origin[1] + 27} textAnchor="end">0</text>
        <text x={bounds.right - 12} y={origin[1] + 30}>x</text>
        <text x={origin[0] + 20} y={bounds.top + 18}>y</text>
      </g>

      <g clipPath={`url(#graph-clip-${id})`}>
        <path d={curve.join('')} fill="none" stroke="var(--color-construct)" strokeWidth="4.2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - trace} />
        {hasSecant ? (
          <line x1={px(dataLeft)} y1={py(secantY(dataLeft))} x2={px(dataRight)} y2={py(secantY(dataRight))} stroke="var(--color-compare)" strokeWidth="3.2" opacity={secant} />
        ) : null}
        <line x1={px(dataLeft)} y1={py(tangentY(dataLeft))} x2={px(dataRight)} y2={py(tangentY(dataRight))} stroke="var(--color-active)" strokeWidth="3.6" opacity={tangent} />
      </g>

      {hasSecant ? (
        <g opacity={construction} stroke="var(--color-muted)" strokeWidth="1.8" strokeDasharray="8 7">
          <line x1={px(x0)} y1={py(f0)} x2={px(qx)} y2={py(f0)} />
          <line x1={px(qx)} y1={py(f0)} x2={px(qx)} y2={py(qy)} />
        </g>
      ) : null}

      <circle cx={px(x0)} cy={py(f0)} r="7" fill="var(--color-compare)" opacity={1 - tangent} />
      <circle cx={px(x0)} cy={py(f0)} r="7" fill="var(--color-active)" opacity={tangent} />
      {hasSecant ? <circle cx={px(qx)} cy={py(qy)} r="7" fill="var(--color-compare)" opacity={secant} /> : null}

      <g fontFamily="var(--font-math)" fontSize="23" fill="var(--color-ink)">
        <text x={px(x0) - 18} y={py(f0) - 20} textAnchor="end">P = ({formatNumber(x0)}, {formatNumber(f0)})</text>
        {hasSecant ? (
          <text x={px(qx) + 18} y={py(qy) - 20}>
            {showQCoordinates ? `Q = (${formatNumber(qx)}, ${formatNumber(qy)})` : 'Q'}
          </text>
        ) : null}
        {hasSecant && Math.abs(h) >= 0.35 ? (
          <>
            <text x={(px(x0) + px(qx)) / 2} y={py(f0) + 38} textAnchor="middle">h = {formatNumber(h)}</text>
            <text x={px(qx) + 18} y={(py(f0) + py(qy)) / 2}>Δy = {formatNumber(qy - f0)}</text>
          </>
        ) : null}
      </g>
    </g>
  );
};
