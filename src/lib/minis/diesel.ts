import { pkw } from '../engine/kfzsteuer';
import { T, eur2, yearOptions, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Diesel gegen Benziner: gleicher Motor, andere Steuer', 'Diesel versus petrol: same engine, different tax'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'c', label: T(l, 'Hubraum', 'Engine size'), def: 1968, unit: 'cm³', max: 10000 }, { id: 'g', label: 'CO2', def: 140, unit: 'g/km', max: 1000 }, { id: 'y', label: T(l, 'Erstzulassung', 'First registered'), def: 2022, options: yearOptions(2010, 2026) }],
  run: ({ c, g, y }: Record<string, number>) => { const d = pkw({ ez: `${y}-06-01`, fuel: 'diesel', ccm: c, co2: g }); const b = pkw({ ez: `${y}-06-01`, fuel: 'benzin', ccm: c, co2: g });
    return { head: [T(l, 'Diesel pro Jahr', 'Diesel per year'), eur2(d.annual, l)] as [string, string], rows: [[T(l, 'Benziner, gleiche Werte', 'Petrol, same figures'), eur2(b.annual, l)], [T(l, 'Diesel-Aufschlag', 'Diesel surcharge'), eur2(d.annual - b.annual, l)]] as [string, string][] }; },
});
