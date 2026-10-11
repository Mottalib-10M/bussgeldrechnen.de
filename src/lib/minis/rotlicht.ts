import { redLight } from '../engine/bkat';
import { T, eur2, fvTxt, num, yn, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Rote Ampel: Ihr Fall', 'Red light: your case'), cta: T(l, 'Alle Verstöße berechnen', 'Calculate any offence'),
  inputs: [
    { id: 's', label: T(l, 'Rot schon länger als 1 Sekunde?', 'Red for more than 1 second?'), def: 0, options: yn(l) },
    { id: 'h', label: T(l, 'Folgen', 'Consequences'), def: 0, options: [{ value: '0', label: T(l, 'keine', 'none') }, { value: '1', label: T(l, 'Gefährdung', 'endangered others') }, { value: '2', label: T(l, 'Sachschaden', 'property damage') }] },
  ],
  run: ({ s, h }: Record<string, number>) => { const r = redLight({ overOneSecond: s === 1, harm: (['none', 'danger', 'damage'] as const)[h] ?? 'none' });
    return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'BKat-Nummer', 'BKat number'), r.nr], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)]] as [string, string][] }; },
});
