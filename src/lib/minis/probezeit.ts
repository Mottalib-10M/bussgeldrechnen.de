import { probezeit } from '../engine/punkte';
import { T, num, type L } from './_kit';
const STEP = { keine: ['keine Maßnahme', 'no measure'], aufbauseminar: ['Aufbauseminar', 'remedial course'], verwarnung: ['Verwarnung + Beratung', 'warning + counselling'], entzug: ['Entziehung', 'licence withdrawn'] } as const;
export default (l: L) => ({
  title: T(l, 'Was in der Probezeit folgt', 'What follows during probation'), cta: T(l, 'Bußgeld mit A/B-Einstufung', 'Fine with A/B classification'),
  inputs: [{ id: 'a', label: T(l, 'A-Verstöße', 'A offences'), def: 1, max: 5 }, { id: 'b', label: T(l, 'B-Verstöße', 'B offences'), def: 0, max: 10 }],
  run: ({ a, b }: Record<string, number>) => { const r = probezeit(Math.round(a), Math.round(b));
    return { head: [T(l, 'Maßnahme', 'Measure'), T(l, STEP[r.step][0], STEP[r.step][1])] as [string, string], rows: [[T(l, 'Probezeit insgesamt', 'Total probation'), T(l, `${num(r.years, l)} Jahre`, `${num(r.years, l)} years`)], [T(l, 'Gezählte Stufen', 'Steps counted'), num(r.units, l)]] as [string, string][] }; },
});
