import {Badge} from './badge.tsx';
import {PinBody, SHAPES} from './pin.tsx';

export const meta = {
  name: {en: 'Badge pair', 'zh-CN': '徽章对比'},
  purpose: 'compare',
  line: 'Two number badges side by side, pressed in left then right, with a small silver pin reading VS between them.',
  fits: 'this against that: two ages, two sizes, two prices; then and now',
  params: {
    left: {type: '{value, label, rim}', doc: 'the left badge'},
    right: {type: '{value, label, rim}', doc: 'the right badge'},
    press: {type: 'progress', default: 1, doc: '0 to 1 over about 1 s: left, right, then the VS pin'},
  },
  preview: 15.0,
};

type B = {value: string; label: string; rim?: string};
const span = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));

export function BadgePair({left, right, press = 1}: {left: B; right: B; press?: number}) {
  return (
    <>
      <Badge {...left} at={[560, 520]} size={500} angle={-5} press={span(press, 0, 0.35)} glint={span(press, 0.35, 0.6)} />
      <Badge {...right} at={[1360, 520]} size={500} angle={5} press={span(press, 0.3, 0.65)} glint={span(press, 0.65, 0.9)} />
      <PinBody d={SHAPES.circle} at={[960, 560]} size={150} enamel="ink" metal="silver" angle={-8} press={span(press, 0.62, 0.95)} glint={1} id="vs">
        <text y={12} textAnchor="middle" fontSize={34} fill="var(--color-cream)" style={{fontFamily: 'var(--font-display)'}}>VS</text>
      </PinBody>
    </>
  );
}
