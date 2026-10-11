import { speeding, type VehicleClass } from '../engine/bkat';
import { T, eur2, fvTxt, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihre Überschreitung im Katalog', 'Your excess speed in the catalogue'), cta: T(l, 'Zum vollständigen Bußgeldrechner', 'Open the full fine calculator'),
  inputs: [
    { id: 'u', label: T(l, 'Überschreitung nach Toleranz', 'Excess after tolerance'), def: 24, unit: 'km/h', max: 200 },
    { id: 'io', label: T(l, 'Ort', 'Where'), def: 1, options: [{ value: '1', label: T(l, 'innerorts', 'in town') }, { value: '0', label: T(l, 'außerorts', 'outside towns') }] },
    { id: 'c', label: T(l, 'Fahrzeug', 'Vehicle'), def: 0, options: [{ value: '0', label: T(l, 'Pkw, Motorrad', 'car, motorbike') }, { value: '1', label: T(l, 'Lkw, Bus, Gespann', 'lorry, bus, with trailer') }, { value: '2', label: T(l, 'Gefahrgut, Bus mit Fahrgästen', 'hazardous goods, bus with passengers') }] },
  ],
  run: ({ u, io, c }: Record<string, number>) => { const cls = (['c', 'a', 'b'] as VehicleClass[])[c] ?? 'c';
    const r = speeding({ limit: 50, measured: 50 + u, inner: io === 1, cls, tolerance: false });
    return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'Tabelle 1, Nummer', 'Table 1, number'), r.nr || '–'], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)]] as [string, string][] }; },
});
