import { elektro } from '../engine/kfzsteuer';
import { T, eur2, yearOptions, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Bis wann Ihr E-Auto steuerfrei ist', 'How long your EV stays tax-free'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'y', label: T(l, 'Erstzulassung', 'First registered'), def: 2024, options: yearOptions(2012, 2030) }, { id: 'kg', label: T(l, 'Zulässige Gesamtmasse', 'Permitted total weight'), def: 2200, unit: 'kg', max: 3500 }],
  run: ({ y, kg }: Record<string, number>) => { const r = elektro(`${y}-06-01`, kg, 2026); const until = r.exemptUntil ? r.exemptUntil.split('-').reverse().join('.') : '–';
    return { head: [T(l, 'Steuerfrei bis', 'Tax-free until'), until] as [string, string], rows: [[T(l, 'Danach pro Jahr', 'Afterwards per year'), eur2(Math.floor(r.raw), l)], [T(l, 'Ohne Ermäßigung wären es', 'Without the reduction it would be'), eur2(Math.floor(r.raw * 2), l)]] as [string, string][],
      note: T(l, 'Angenommen: Erstzulassung im Juni des gewählten Jahres.', 'Assumes first registration in June of the chosen year.') }; },
});
