import { pkw } from '../engine/kfzsteuer';
import { T, eur2, yearOptions, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Kfz-Steuer Ihres Pkw in drei Angaben', 'Your car tax in three inputs'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'f', label: T(l, 'Motor', 'Engine'), def: 0, options: [{ value: '0', label: T(l, 'Benzin', 'Petrol') }, { value: '1', label: 'Diesel' }] }, { id: 'c', label: T(l, 'Hubraum', 'Engine size'), def: 1498, unit: 'cm³', max: 10000 }, { id: 'g', label: 'CO2', def: 128, unit: 'g/km', max: 1000 }, { id: 'y', label: T(l, 'Erstzulassung', 'First registered'), def: 2023, options: yearOptions(2010, 2026) }],
  run: ({ f, c, g, y }: Record<string, number>) => { const r = pkw({ ez: `${y}-06-01`, fuel: f === 1 ? 'diesel' : 'benzin', ccm: c, co2: g });
    return { head: [T(l, 'Kfz-Steuer pro Jahr', 'Vehicle tax per year'), eur2(r.annual, l)] as [string, string], rows: r.lines.map((x) => [x.label === 'co2' ? T(l, 'CO2-Anteil', 'CO2 part') : T(l, 'Hubraumanteil', 'Engine-size part'), eur2(x.amount, l)]) as [string, string][] }; },
});
