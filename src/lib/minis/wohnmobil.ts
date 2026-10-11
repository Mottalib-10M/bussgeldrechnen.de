import { wohnmobil } from '../engine/kfzsteuer';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wohnmobil: Steuer nach Gewicht und Schadstoffklasse', 'Motorhome: tax by weight and emission class'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'kg', label: T(l, 'Zulässige Gesamtmasse', 'Permitted total weight'), def: 3500, unit: 'kg', max: 20000 }, { id: 'k', label: T(l, 'Schadstoffklasse', 'Emission class'), def: 0, options: [{ value: '0', label: T(l, 'S 4 oder besser', 'S 4 or better') }, { value: '1', label: 'S 3 – S 1' }, { value: '2', label: T(l, 'keine', 'none') }] }],
  run: ({ kg, k }: Record<string, number>) => { const kl = (['s4', 's3', 'sonst'] as const)[k] ?? 's4'; const r = wohnmobil(kg, kl); const best = wohnmobil(kg, 's4');
    return { head: [T(l, 'Kfz-Steuer pro Jahr', 'Vehicle tax per year'), eur2(r.annual, l)] as [string, string], rows: [[T(l, 'Mit Klasse S 4', 'With class S 4'), eur2(best.annual, l)], [T(l, 'Mehrkosten Ihrer Klasse', 'Extra cost of your class'), eur2(r.annual - best.annual, l)]] as [string, string][] }; },
});
