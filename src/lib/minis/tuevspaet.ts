import { huLate } from '../engine/kosten';
import { T, eur2, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'HU überzogen: was droht', 'MOT overdue: what you risk'), cta: T(l, 'HU-Termin und Kosten berechnen', 'Calculate MOT date and cost'),
  inputs: [{ id: 'm', label: T(l, 'Monate überzogen', 'Months overdue'), def: 5, max: 60 }],
  run: ({ m }: Record<string, number>) => { const r = huLate(Math.round(m));
    return { head: [T(l, 'Verwarnungs- oder Bußgeld', 'Warning or regular fine'), eur2(r.fine, l)] as [string, string], rows: [[T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'BKat-Nummer', 'BKat number'), m <= 2 ? '–' : m <= 4 ? '186.2.1' : m <= 8 ? '186.2.2' : '186.2.3']] as [string, string][] }; },
});
