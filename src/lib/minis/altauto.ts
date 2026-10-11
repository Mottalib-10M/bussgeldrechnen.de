import { pkw, type AltKlasse } from '../engine/kfzsteuer';
import { T, eur2, type L } from './_kit';
const K: AltKlasse[] = ['euro3plus', 'euro2', 'euro1', 'ozonfrei', 'sonstige'];
export default (l: L) => ({
  title: T(l, 'Steuer für Autos mit Erstzulassung vor Juli 2009', 'Tax for cars first registered before July 2009'), cta: T(l, 'Zum vollständigen Kfz-Steuer-Rechner', 'Open the full vehicle tax calculator'),
  inputs: [{ id: 'f', label: T(l, 'Motor', 'Engine'), def: 0, options: [{ value: '0', label: T(l, 'Benzin', 'Petrol') }, { value: '1', label: 'Diesel' }] }, { id: 'c', label: T(l, 'Hubraum', 'Engine size'), def: 1598, unit: 'cm³', max: 10000 }, { id: 'k', label: T(l, 'Schadstoffklasse', 'Emission class'), def: 0, options: [{ value: '0', label: 'Euro 3 – 6' }, { value: '1', label: 'Euro 2' }, { value: '2', label: 'Euro 1' }, { value: '3', label: T(l, 'ohne, ozonfrei', 'none, ozone-exempt') }, { value: '4', label: T(l, 'übrige', 'other') }] }],
  run: ({ f, c, k }: Record<string, number>) => { const fuel = f === 1 ? 'diesel' : 'benzin'; const r = pkw({ ez: '2006-06-01', fuel, ccm: c, co2: 0, altKlasse: K[k] ?? 'euro3plus' }); const best = pkw({ ez: '2006-06-01', fuel, ccm: c, co2: 0, altKlasse: 'euro3plus' });
    return { head: [T(l, 'Kfz-Steuer pro Jahr', 'Vehicle tax per year'), eur2(r.annual, l)] as [string, string], rows: [[T(l, 'Mit Euro 3 oder besser', 'With Euro 3 or better'), eur2(best.annual, l)], [T(l, 'Aufschlag Ihrer Klasse', 'Surcharge of your class'), eur2(r.annual - best.annual, l)]] as [string, string][] }; },
});
