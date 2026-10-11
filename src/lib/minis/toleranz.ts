import { toleranz } from '../engine/bkat';
import { T, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Toleranzabzug: gemessen und vorgeworfen', 'Tolerance: measured and charged'), cta: T(l, 'Zum vollständigen Bußgeldrechner', 'Open the full fine calculator'),
  inputs: [{ id: 'g', label: T(l, 'Gemessene Geschwindigkeit', 'Measured speed'), def: 78, unit: 'km/h', max: 400 }, { id: 'e', label: T(l, 'Erlaubt', 'Limit'), def: 50, unit: 'km/h', max: 300 }],
  run: ({ g, e }: Record<string, number>) => { const v = toleranz(g);
    return { head: [T(l, 'Vorgeworfene Überschreitung', 'Excess charged'), `${num(Math.max(0, v - e), l)} km/h`] as [string, string], rows: [[T(l, 'Nach Abzug', 'After deduction'), `${num(v, l)} km/h`], [T(l, 'Abzug', 'Deduction'), `${num(g - v, l)} km/h`], [T(l, 'Regel', 'Rule'), g <= 100 ? T(l, '3 km/h bis 100 km/h', '3 km/h up to 100 km/h') : T(l, '3 % über 100 km/h, abgerundet', '3% above 100 km/h, rounded down')]] as [string, string][] }; },
});
