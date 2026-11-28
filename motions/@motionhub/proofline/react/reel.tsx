import type {ReactNode} from 'react';
import {Easing, Sequence, interpolate, useTime, useTokens} from '@motionhub/runtime';
import {CoordinateField} from './parts/coordinate-field.tsx';
import {TriangleInvariant} from './parts/triangle-invariant.tsx';
import {AreaModel, resolveAreaModel} from './parts/area-model.tsx';
import {QuadraticGraph, resolveQuadraticGraph} from './parts/quadratic-graph.tsx';
import {Tether} from './parts/tether.tsx';
import {formatNumber, secantSlope, tangentSlope, tangentValue} from './math.ts';

export const reel = {seconds: 26, width: 1920, height: 1080};

export const cues = [
  {at: 0, role: 'draw', dur: 0.9}, {at: 1.2, role: 'move', dur: 0.8}, {at: 1.8, role: 'count'},
  {at: 2.8, role: 'draw', dur: 0.55}, {at: 3, role: 'move', dur: 0.8}, {at: 4.6, role: 'land'},
  {at: 5, role: 'cut'}, {at: 5.1, role: 'draw', dur: 0.9}, {at: 6.2, role: 'draw', dur: 0.9},
  {at: 7.4, role: 'count'}, {at: 9, role: 'move', dur: 0.8}, {at: 9.1, role: 'draw', dur: 0.55},
  {at: 10.2, role: 'count'}, {at: 11.6, role: 'land'},
  {at: 12, role: 'cut'}, {at: 12.1, role: 'draw', dur: 1.2}, {at: 13.5, role: 'draw', dur: 0.9},
  {at: 15, role: 'move', dur: 0.8}, {at: 16.3, role: 'move', dur: 0.8}, {at: 17.6, role: 'move', dur: 0.8},
  {at: 19.5, role: 'cut'}, {at: 19.6, role: 'draw', dur: 0.55}, {at: 21.5, role: 'land'},
  {at: 22, role: 'cut'}, {at: 22.1, role: 'draw', dur: 0.9}, {at: 23, role: 'count'},
  {at: 24.2, role: 'move', dur: 0.8}, {at: 24.3, role: 'draw', dur: 0.55}, {at: 25.5, role: 'out'},
] as const;

const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

type DurationName = 'enter' | 'construct' | 'trace' | 'connect' | 'transform' | 'settle';
type EasingName = 'arrive' | 'transform' | 'leave';

const useReelProgress = () => {
  const time = useTime();
  const tokens = useTokens();
  return (start: number, duration: DurationName = 'transform', curve: EasingName = 'transform', from = 0, to = 1) => {
    if (!tokens.duration || !tokens.easing) {
      throw new Error('Proofline reel requires duration and easing tokens.');
    }
    const seconds = tokens.duration[duration] as number;
    const values = tokens.easing[curve] as [number, number, number, number];
    return interpolate(time, [start, start + seconds], [from, to], {
      easing: Easing.bezier(...values),
      clamp: true,
    });
  };
};

const Stage = ({label, title, children}: {label: string; title: string; children: ReactNode}) => (
  <>
    <CoordinateField width={1720} />
    <div style={{position: 'absolute', left: 96, top: 48, fontFamily: 'var(--font-label)', fontSize: 18, letterSpacing: 2, color: 'var(--color-muted)'}}>
      PROOFLINE / {label}
    </div>
    <div style={{position: 'absolute', left: 96, top: 100, fontSize: 64, lineHeight: 1.1, letterSpacing: -2, fontWeight: 600, color: 'var(--color-ink)'}}>
      {title}
    </div>
    {children}
  </>
);

const Half = () => (
  <span style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, margin: '0 16px', verticalAlign: 'middle'}}>
    <span style={{fontSize: 44}}>1</span>
    <span style={{width: 54, borderTop: '3px solid currentColor', margin: '7px 0'}} />
    <span style={{fontSize: 44}}>2</span>
  </span>
);

const TriangleReel = () => {
  const time = useTime();
  const progress = useReelProgress();
  const first = progress(1.2);
  const second = progress(3);
  const apex = time < 3 ? mix(260, 560, first) : mix(560, 400, second);
  return (
    <Stage label="INVARIANT" title="What stays true?">
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <TriangleInvariant apex={apex} construction={progress(0, 'construct')} active={1} />
        <Tether from={[1260, 560]} to={[950, 730]} control1={[1160, 560]} control2={[1080, 730]} progress={progress(2.8, 'connect')} />
      </svg>
      <div style={{position: 'absolute', left: 1280, top: 370, opacity: progress(1.8, 'enter', 'arrive')}}>
        <div style={{fontFamily: 'var(--font-label)', fontSize: 18, letterSpacing: 2, color: 'var(--color-muted)', marginBottom: 42}}>THE INVARIANT</div>
        <div style={{fontFamily: 'var(--font-math)', fontSize: 92, color: 'var(--color-active)', display: 'flex', alignItems: 'center'}}>
          <span>A =</span><Half /><span>bh</span>
        </div>
        <div style={{fontSize: 28, color: 'var(--color-ink)', marginTop: 40}}>Base and height stay fixed.</div>
      </div>
    </Stage>
  );
};

const AreaReel = () => {
  const progress = useReelProgress();
  const combine = progress(4);
  const simplified = progress(5.2);
  const labels = progress(2.4, 'enter', 'arrive');
  const layout = resolveAreaModel({});
  const first: [number, number] = [layout.right, layout.origin[1] + layout.xSize / 2];
  const second: [number, number] = [layout.origin[0] + layout.xSize / 2, layout.bottom];
  return (
    <Stage label="REPRESENT" title="See what a formula means.">
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <AreaModel outer={progress(0.1, 'construct')} partitions={progress(1.2, 'construct')} labels={labels} combine={combine} />
        <Tether from={[1030, 744]} to={first} control1={[950, 744]} control2={[930, first[1]]} progress={progress(4, 'connect')} />
        <Tether from={[1030, 800]} to={second} control1={[970, 985]} control2={[650, 985]} progress={progress(4, 'connect')} />
      </svg>
      <div style={{position: 'absolute', left: 1030, top: 330, fontFamily: 'var(--font-math)', fontSize: 62}}>(x + 2)(x + 3)</div>
      <div style={{position: 'absolute', left: 1030, top: 440, fontFamily: 'var(--font-math)', fontSize: 50, color: 'var(--color-muted)'}}>=</div>
      <div style={{position: 'absolute', left: 1030, top: 530, fontFamily: 'var(--font-math)', fontSize: 62, display: 'flex', gap: 20, opacity: labels * (1 - simplified)}}>
        <span style={{color: 'var(--color-construct)'}}>x<sup>2</sup></span><span>+</span>
        <span style={{color: combine > 0 ? 'var(--color-active)' : 'var(--color-construct)'}}>2x</span><span>+</span>
        <span style={{color: combine > 0 ? 'var(--color-active)' : 'var(--color-construct)'}}>3x</span><span>+</span>
        <span style={{color: 'var(--color-construct)'}}>6</span>
      </div>
      <div style={{position: 'absolute', left: 1030, top: 520, fontFamily: 'var(--font-math)', fontSize: 84, display: 'flex', gap: 25, opacity: simplified}}>
        <span style={{color: 'var(--color-construct)'}}>x<sup>2</sup></span><span>+</span>
        <span style={{color: 'var(--color-active)'}}>5x</span><span>+</span>
        <span style={{color: 'var(--color-construct)'}}>6</span>
      </div>
      <div style={{position: 'absolute', left: 1030, top: 716, width: 4, height: 156, background: 'var(--color-active)', opacity: combine}} />
      <div style={{position: 'absolute', left: 1060, top: 728, opacity: combine}}>
        <div style={{fontFamily: 'var(--font-math)', fontSize: 52, color: 'var(--color-active)'}}>2x + 3x = 5x</div>
        <div style={{fontSize: 27, color: 'var(--color-ink)', marginTop: 22}}>Two areas. One combined term.</div>
      </div>
    </Stage>
  );
};

const QuadraticReel = () => {
  const time = useTime();
  const progress = useReelProgress();
  const limit = time >= 7.5;
  let h = 1;
  if (time >= 3) h = mix(1, 0.6, progress(3));
  if (time >= 4.3) h = mix(0.6, 0.3, progress(4.3));
  if (time >= 5.6) h = mix(0.3, 0.1, progress(5.6));
  const secant = limit ? 0 : progress(1.5, 'construct');
  const tangent = limit ? 1 : 0;
  const model = {a: 1, b: 0, c: 0};
  const slope = limit ? tangentSlope(model, 1) : secantSlope(model, 1, h);
  const graph = resolveQuadraticGraph({h});
  const tetherX = 1.52;
  const endpoint: [number, number] = [graph.px(tetherX), graph.py(tangentValue(model, 1, tetherX))];
  return (
    <Stage label="CHANGE" title="See how a curve changes.">
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <QuadraticGraph h={h} trace={progress(0.1, 'trace')} secant={secant} tangent={tangent} construction={secant} />
        <text x="196" y="414" fontFamily="var(--font-math)" fontSize="28" fill="var(--color-construct)">f(x) = x²</text>
        {limit ? <Tether from={[1030, 650]} to={endpoint} control1={[900, 650]} control2={[850, endpoint[1]]} progress={progress(7.5, 'connect')} /> : null}
      </svg>
      <div style={{position: 'absolute', left: 1030, top: 330, fontFamily: 'var(--font-math)', fontSize: 68, color: 'var(--color-construct)'}}>f(x) = x<sup>2</sup></div>
      <div style={{position: 'absolute', left: 1032, top: 425, fontSize: 27, color: 'var(--color-ink)'}}>at the point (1, 1)</div>
      {!limit ? (
        <div style={{position: 'absolute', left: 1030, top: 540, opacity: secant}}>
          <div style={{fontFamily: 'var(--font-label)', fontSize: 18, letterSpacing: 2, color: 'var(--color-ink)'}}>SECANT · h = {formatNumber(h)}</div>
          <div style={{fontFamily: 'var(--font-math)', fontSize: 48, color: 'var(--color-compare)', marginTop: 34}}>m = 2 + h = {formatNumber(slope)}</div>
          <div style={{fontFamily: 'var(--font-math)', fontSize: 27, color: 'var(--color-ink)', marginTop: 22}}>Q = (1 + h, (1 + h)<sup>2</sup>)</div>
        </div>
      ) : (
        <>
          <div style={{position: 'absolute', left: 1030, top: 540, width: 4, height: 250, background: 'var(--color-active)'}} />
          <div style={{position: 'absolute', left: 1060, top: 555}}>
            <div style={{fontFamily: 'var(--font-label)', fontSize: 18, letterSpacing: 2, color: 'var(--color-muted)'}}>THE LIMIT</div>
            <div style={{fontFamily: 'var(--font-math)', fontSize: 64, color: 'var(--color-active)', marginTop: 38, whiteSpace: 'nowrap'}}>h → 0 &nbsp; ⇒ &nbsp; m → 2</div>
            <div style={{fontSize: 27, color: 'var(--color-ink)', marginTop: 30}}>The secant approaches the tangent.</div>
          </div>
        </>
      )}
    </Stage>
  );
};

const SecondAreaReel = () => {
  const progress = useReelProgress();
  const combine = progress(2.2);
  const props = {a: 1, b: 4, xUnits: 4, origin: [230, 300] as [number, number]};
  const layout = resolveAreaModel(props);
  const first: [number, number] = [layout.right, layout.origin[1] + layout.xSize / 2];
  const second: [number, number] = [layout.origin[0] + layout.xSize / 2, layout.bottom];
  return (
    <Stage label="REUSE" title="Same system. New mathematics.">
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <AreaModel {...props} outer={progress(0.1, 'construct')} partitions={progress(0.9, 'construct')} labels={progress(1.4, 'enter', 'arrive')} combine={combine} />
        <Tether from={[1030, 650]} to={first} control1={[900, 650]} control2={[800, first[1]]} progress={progress(2.2, 'connect')} />
        <Tether from={[1030, 740]} to={second} control1={[950, 985]} control2={[650, 985]} progress={progress(2.2, 'connect')} />
      </svg>
      <div style={{position: 'absolute', left: 1030, top: 370, fontFamily: 'var(--font-math)', fontSize: 62}}>(x + 1)(x + 4)</div>
      <div style={{position: 'absolute', left: 1030, top: 510, fontFamily: 'var(--font-math)', fontSize: 84, display: 'flex', gap: 25}}>
        <span style={{color: 'var(--color-construct)'}}>x<sup>2</sup></span><span>+</span>
        <span style={{color: 'var(--color-active)'}}>5x</span><span>+</span>
        <span style={{color: 'var(--color-construct)'}}>4</span>
      </div>
      <div style={{position: 'absolute', left: 1030, top: 700, fontFamily: 'var(--font-math)', fontSize: 52, color: 'var(--color-active)', opacity: combine}}>x + 4x = 5x</div>
      <div style={{position: 'absolute', left: 1032, top: 790, fontSize: 27, color: 'var(--color-ink)', opacity: combine}}>Different values. The same semantic links.</div>
    </Stage>
  );
};

export default function Reel() {
  return (
    <div style={{position: 'absolute', inset: 0, background: 'var(--color-ground)', color: 'var(--color-ink)', fontFamily: 'var(--font-display)'}}>
      <Sequence from={0} duration={5}><TriangleReel /></Sequence>
      <Sequence from={5} duration={7}><AreaReel /></Sequence>
      <Sequence from={12} duration={10}><QuadraticReel /></Sequence>
      <Sequence from={22} duration={4}><SecondAreaReel /></Sequence>
    </div>
  );
}
