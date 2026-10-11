import { pkw, schwerbehindert } from '../engine/kfzsteuer';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was § 3a KraftStG bei Ihrem Auto spart', 'What Section 3a saves on your car'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'a', label: T(l, 'Ausweis', 'Card'), def: 1, options: [{ value: '1', label: T(l, 'Merkzeichen H, Bl oder aG', 'marks H, Bl or aG') }, { value: '2', label: T(l, 'orangefarben, ohne Freifahrt', 'orange, no free transport') }] }, { id: 'c', label: T(l, 'Hubraum', 'Engine size'), def: 1598, unit: 'cm³', max: 10000 }, { id: 'g', label: 'CO2', def: 135, unit: 'g/km', max: 1000 }],
  run: ({ a, c, g }: Record<string, number>) => { const base = pkw({ ez: '2022-06-01', fuel: 'benzin', ccm: c, co2: g }); const r = schwerbehindert(base, a === 1 ? 'befreit' : 'halb');
    return { head: [T(l, 'Ihre Kfz-Steuer pro Jahr', 'Your vehicle tax per year'), eur2(r.annual, l)] as [string, string], rows: [[T(l, 'Ohne Vergünstigung', 'Without relief'), eur2(base.annual, l)], [T(l, 'Ersparnis', 'Saving'), eur2(base.annual - r.annual, l)]] as [string, string][],
      note: T(l, 'Beispiel: Benziner mit Erstzulassung 2022. Nur ein Fahrzeug, nur auf Antrag.', 'Example: petrol car first registered in 2022. One vehicle only, on application.') }; },
});
