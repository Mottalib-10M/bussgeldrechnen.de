import { fromEntry } from '../engine/bkat';
import { T, eur2, fvTxt, num, type L } from './_kit';
const CASES: Array<[string, string, string]> = [['100', 'Nicht angeschnallt', 'No seatbelt'], ['246.1', 'Handy am Steuer', 'Phone at the wheel'], ['132', 'Rote Ampel', 'Red light'], ['50', 'Keine Rettungsgasse', 'No emergency corridor'], ['5a', 'Ohne Winterreifen bei Glätte', 'No winter tyres on ice'], ['135', 'Blaulicht nicht Platz gemacht', 'Not giving way to blue lights'], ['243b', 'Alkohol in der Probezeit', 'Alcohol during probation']];
export default (l: L) => ({
  title: T(l, 'Häufige Verstöße nach dem Katalog 2026', 'Common offences under the 2026 catalogue'), cta: T(l, 'Ganzen Katalog durchsuchen', 'Search the whole catalogue'),
  inputs: [{ id: 'c', label: T(l, 'Verstoß', 'Offence'), def: 0, options: CASES.map((c, i) => ({ value: String(i), label: T(l, c[1], c[2]) })) }],
  run: ({ c }: Record<string, number>) => { const k = CASES[c] ?? CASES[0]; const r = fromEntry(k[0]);
    return { head: [T(l, 'Zu zahlen', 'Amount due'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'BKat-Nummer', 'BKat number'), r.nr], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)]] as [string, string][] }; },
});
