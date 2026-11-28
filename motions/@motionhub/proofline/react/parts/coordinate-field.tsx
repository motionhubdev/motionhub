import {useId} from 'react';

export const meta = {
  name: 'Coordinate field',
  purpose: 'ground',
  line: 'A local mathematical grid that fades into the neutral editorial canvas.',
  fits: 'Geometry, algebra, functions, and any explanation that needs a coordinate field rather than a notebook page.',
  params: {
    x: {type: 'px', default: 90, doc: 'Left edge of the local field in frame pixels.'},
    y: {type: 'px', default: 260, doc: 'Top edge of the local field in frame pixels.'},
    width: {type: 'px', default: 850, doc: 'Width of the local field in frame pixels.'},
    height: {type: 'px', default: 730, doc: 'Height of the local field in frame pixels.'},
    step: {type: 'px', default: 40, doc: 'Grid spacing in frame pixels.'},
  },
  preview: 'previews/coordinate-field.jpg',
};

export const CoordinateField = ({
  x = 90,
  y = 260,
  width = 850,
  height = 730,
  step = 40,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  step?: number;
}) => {
  if (step <= 0) {
    throw new Error('Grid step must be positive.');
  }
  const id = useId().replace(/:/g, '');
  return (
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-hidden="true">
      <defs>
        <pattern id={`grid-${id}`} width={step} height={step} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M${step} 0H0V${step}`} fill="none" stroke="var(--color-grid)" strokeWidth="1" />
        </pattern>
        <radialGradient id={`fade-${id}`} cx="48%" cy="52%" r="66%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="70%" stopColor="white" stopOpacity="0.42" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-${id}`}>
          <rect x={x} y={y} width={width} height={height} fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <rect x={x} y={y} width={width} height={height} fill={`url(#grid-${id})`} mask={`url(#mask-${id})`} />
    </svg>
  );
};
