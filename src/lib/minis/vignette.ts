import { vignettePlan } from '../engine/kosten';
import { T, eur2, num, type L } from './_kit';
const NAME = { tag1: ['1-Tages-Vignetten', '1-day vignettes'], tag10: ['10-Tages-Vignette', '10-day vignette'], monat2: ['2-Monats-Vignette', '2-month vignette'], jahr: ['Jahresvignette', 'annual vignette'] } as const;
export default (l: L) => ({
  title: T(l, 'Welche Vignette sich für Ihre Reisen lohnt', 'Which vignette pays off for your trips'), cta: T(l, 'Führerschein- und Autokosten', 'Licence and car costs'),
  inputs: [{ id: 'n', label: T(l, 'Reisen nach Österreich im Jahr', 'Trips to Austria per year'), def: 2, max: 50 }, { id: 'd', label: T(l, 'Tage pro Reise', 'Days per trip'), def: 7, max: 365 }, { id: 'k', label: T(l, 'Fahrzeug', 'Vehicle'), def: 0, options: [{ value: '0', label: 'Pkw' }, { value: '1', label: T(l, 'Motorrad', 'Motorbike') }] }],
  run: ({ n, d, k }: Record<string, number>) => { const o = vignettePlan(n, d, k === 1); const best = o[0];
    return { head: [T(l, 'Am günstigsten', 'Cheapest'), `${T(l, NAME[best.kind][0], NAME[best.kind][1])}: ${eur2(best.cost, l)}`] as [string, string],
      rows: o.slice(1).map((x) => [T(l, NAME[x.kind][0], NAME[x.kind][1]), eur2(x.cost, l)]) as [string, string][],
      note: T(l, `Annahme: Autobahn nur bei Hin- und Rückfahrt, ${num(n, l)} Reisen.`, `Assumption: motorway only on the way there and back, ${num(n, l)} trips.`) }; },
});
