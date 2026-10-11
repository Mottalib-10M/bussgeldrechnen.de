import { distance } from '../engine/bkat';
import { T, eur2, fvTxt, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Abstand: halber Tacho in der Praxis', 'Gap: half the speedometer in practice'), cta: T(l, 'Alle Verstöße berechnen', 'Calculate any offence'),
  inputs: [{ id: 'v', label: T(l, 'Tempo', 'Speed'), def: 120, unit: 'km/h', max: 300 }, { id: 'm', label: T(l, 'Abstand', 'Gap'), def: 25, unit: 'm', max: 500 }],
  run: ({ v, m }: Record<string, number>) => { const r = distance(v, m);
    return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'Gesetzlicher Mindestwert (halber Tacho)', 'Legal reference (half the speedometer)'), `${num(v / 2, l)} m`], [T(l, 'BKat-Nummer', 'BKat number'), r.nr], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)]] as [string, string][] }; },
});
