/** Fabrique de mini-simulateurs « vitesse » (pages par tranche et pages innerorts / außerorts). */
import { speeding } from '../engine/bkat';
import { T, eur2, fvTxt, probeTxt, num, type L } from './_kit';
export function speedMini(l: L, o: { over: number; inner: boolean; lockPlace?: boolean; title: [string, string] }) {
  const inputs = [
    { id: 'limit', label: T(l, 'Erlaubt', 'Limit'), def: o.inner ? 50 : 100, unit: 'km/h', max: 300 },
    { id: 'kmh', label: T(l, 'Gemessen (vor Toleranz)', 'Measured (before tolerance)'), def: 0, unit: 'km/h', max: 400 },
    ...(o.lockPlace ? [] : [{ id: 'io', label: T(l, 'Ort', 'Where'), def: o.inner ? 1 : 0, options: [{ value: '1', label: T(l, 'innerorts', 'in town') }, { value: '0', label: T(l, 'außerorts', 'outside towns') }] }]),
  ];
  const base = o.inner ? 50 : 100;
  const measuredFor = (limit: number, over: number) => { const v = limit + over; return v + 3 > 100 ? Math.ceil((v + 1) / 0.97) - 1 : v + 3; };
  inputs[1].def = measuredFor(base, o.over);
  return {
    title: T(l, o.title[0], o.title[1]), cta: T(l, 'Zum vollständigen Bußgeldrechner', 'Open the full fine calculator'),
    inputs,
    run: (v: Record<string, number>) => {
      const inner = o.lockPlace ? o.inner : v.io === 1;
      const r = speeding({ limit: v.limit, measured: v.kmh, inner });
      return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string],
        rows: [[T(l, 'Überschreitung nach Toleranz', 'Excess after tolerance'), `${num(r.over, l)} km/h`], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)], [T(l, 'Probezeit', 'Probation'), probeTxt(r.probe, l)]] as [string, string][] };
    },
  };
}
