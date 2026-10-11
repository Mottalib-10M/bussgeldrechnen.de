import { krad } from '../engine/kfzsteuer';
import { T, eur2, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Motorradsteuer nach Hubraum', 'Motorbike tax by engine size'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'c', label: T(l, 'Hubraum', 'Engine size'), def: 689, unit: 'cm³', max: 3000 }],
  run: ({ c }: Record<string, number>) => { const r = krad(c);
    return { head: [T(l, 'Kfz-Steuer pro Jahr', 'Vehicle tax per year'), eur2(r.annual, l)] as [string, string], rows: [[T(l, 'Angefangene 25 cm³', 'Started 25 cm³ units'), num(Math.ceil(c / 25), l)], [T(l, 'Satz je Einheit', 'Rate per unit'), eur2(1.84, l)]] as [string, string][] }; },
});
