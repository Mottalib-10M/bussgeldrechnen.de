import { fromEntry } from '../engine/bkat';
import { T, eur2, num, type L } from './_kit';
const CASES: Array<[string, string, string]> = [
  ['63.1', 'Parkschein abgelaufen, bis 30 Minuten', 'Ticket expired, up to 30 minutes'], ['63.3', 'Parkschein abgelaufen, bis 2 Stunden', 'Ticket expired, up to 2 hours'], ['63.5', 'Parkschein abgelaufen, über 3 Stunden', 'Ticket expired, over 3 hours'],
  ['52a', 'Auf Geh- oder Radweg', 'On a pavement or cycle path'], ['52a.1', 'Auf Geh- oder Radweg, mit Behinderung', 'On a pavement or cycle path, obstructing'], ['58', 'In zweiter Reihe', 'Double-parked'],
  ['55', 'Behindertenparkplatz ohne Ausweis', 'Disabled bay without a permit'], ['55a', 'E-Ladeplatz ohne Berechtigung', 'EV charging bay without right'], ['53', 'Feuerwehrzufahrt', 'Fire service access'], ['53.1', 'Feuerwehrzufahrt, Rettungsfahrzeug behindert', 'Fire service access, emergency vehicle blocked'],
];
export default (l: L) => ({
  title: T(l, 'Falschparken: Ihr Fall', 'Parking: your case'), cta: T(l, 'Ganzen Katalog durchsuchen', 'Search the whole catalogue'),
  inputs: [{ id: 'c', label: T(l, 'Situation', 'Situation'), def: 0, options: CASES.map((c, i) => ({ value: String(i), label: T(l, c[1], c[2]) })) }],
  run: ({ c }: Record<string, number>) => { const k = CASES[c] ?? CASES[0]; const r = fromEntry(k[0]);
    return { head: [T(l, 'Zu zahlen', 'Amount due'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'BKat-Nummer', 'BKat number'), r.nr], [T(l, 'Art', 'Type'), r.verwarnung ? T(l, 'Verwarnungsgeld', 'warning fine') : T(l, 'Bußgeld mit Gebühren', 'fine with fees')], [T(l, 'Punkte', 'Points'), num(r.points, l)]] as [string, string][] }; },
});
