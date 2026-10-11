import { phone } from '../engine/bkat';
import { T, eur2, fvTxt, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Handy am Steuer: was es kostet', 'Phone at the wheel: what it costs'), cta: T(l, 'Alle Verstöße berechnen', 'Calculate any offence'),
  inputs: [
    { id: 'w', label: T(l, 'Unterwegs mit', 'Travelling by'), def: 0, options: [{ value: '0', label: T(l, 'Auto, Motorrad, Lkw', 'car, motorbike, lorry') }, { value: '1', label: T(l, 'Fahrrad', 'bicycle') }] },
    { id: 'h', label: T(l, 'Folgen', 'Consequences'), def: 0, options: [{ value: '0', label: T(l, 'keine', 'none') }, { value: '1', label: T(l, 'Gefährdung', 'endangered others') }, { value: '2', label: T(l, 'Sachschaden', 'property damage') }] },
  ],
  run: ({ w, h }: Record<string, number>) => { const r = phone({ cyclist: w === 1, harm: (['none', 'danger', 'damage'] as const)[h] ?? 'none' });
    return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'Regelsatz', 'Standard fine'), eur2(r.fine, l)], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)]] as [string, string][] }; },
});
