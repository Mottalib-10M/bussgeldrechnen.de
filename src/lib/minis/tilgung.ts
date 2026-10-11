import { tilgung } from '../engine/punkte';
import { T, isoDate, moisOptions, yearOptions, num, type L } from './_kit';
const fmt = (iso: string) => { const [y, m, d] = iso.split('-'); return `${d}.${m}.${y}`; };
export default (l: L) => ({
  title: T(l, 'Wann ein Punkt verfällt', 'When a point expires'), cta: T(l, 'Zum Punkterechner', 'Open the points calculator'),
  inputs: [{ id: 'p', label: T(l, 'Punkte des Eintrags', 'Points of the entry'), def: 1, options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }] }, { id: 'm', label: T(l, 'Rechtskraft: Monat', 'Final on: month'), def: 3, options: moisOptions(l) }, { id: 'y', label: T(l, 'Jahr', 'Year'), def: 2025, options: yearOptions(2020, 2026) }],
  run: ({ p, m, y }: Record<string, number>) => { const t = tilgung(isoDate(y, m), (p as 1 | 2 | 3));
    return { head: [T(l, 'Tilgungsreif am', 'Expires on'), fmt(t.tilgungsreif)] as [string, string], rows: [[T(l, 'Frist', 'Period'), T(l, `${num(t.monate / 12, l, t.monate % 12 ? 1 : 0)} Jahre`, `${num(t.monate / 12, l, t.monate % 12 ? 1 : 0)} years`)], [T(l, 'Endgültig gelöscht am', 'Finally deleted on'), fmt(t.geloescht)]] as [string, string][] }; },
});
