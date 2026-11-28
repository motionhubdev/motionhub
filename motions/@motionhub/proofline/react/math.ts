export type Quadratic = {
  a: number;
  b: number;
  c: number;
};

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const formatNumber = (value: number, digits = 2): string => {
  const rounded = Math.abs(value) < 1e-10 ? 0 : value;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(rounded);
};

export const triangleArea = (base: number, height: number): number => {
  if (base <= 0 || height <= 0) {
    throw new Error('Base and height must be positive.');
  }
  return (base * height) / 2;
};

export const areaTerms = (x: number, a: number, b: number) => ({
  square: x * x,
  firstRectangle: a * x,
  secondRectangle: b * x,
  constant: a * b,
});

export const expandedArea = (x: number, a: number, b: number): number =>
  x * x + (a + b) * x + a * b;

export const quadratic = ({a, b, c}: Quadratic, x: number): number =>
  a * x * x + b * x + c;

export const secantSlope = (coefficients: Quadratic, x0: number, h: number): number => {
  if (h === 0) {
    throw new Error('A secant requires two distinct points; h must not be zero.');
  }
  return (quadratic(coefficients, x0 + h) - quadratic(coefficients, x0)) / h;
};

export const tangentSlope = (coefficients: Quadratic, x0: number): number =>
  2 * coefficients.a * x0 + coefficients.b;

export const tangentValue = (coefficients: Quadratic, x0: number, x: number): number =>
  quadratic(coefficients, x0) + tangentSlope(coefficients, x0) * (x - x0);
