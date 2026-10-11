import { seminar } from '../engine/punkte';
import { T, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Bringt Ihnen das Fahreignungsseminar etwas?', 'Will the driver improvement seminar help you?'), cta: T(l, 'Zum Punkterechner', 'Open the points calculator'),
  inputs: [{ id: 'p', label: T(l, 'Punkte heute', 'Points today'), def: 4, max: 20 }, { id: 's', label: T(l, 'Letztes Seminar', 'Last seminar'), def: 0, options: [{ value: '0', label: T(l, 'noch nie', 'never') }, { value: '1', label: T(l, 'vor weniger als 5 Jahren', 'less than 5 years ago') }, { value: '2', label: T(l, 'vor 5 Jahren oder mehr', '5 years ago or more') }] }],
  run: ({ p, s }: Record<string, number>) => { const r = seminar(Math.round(p), s === 0 ? null : s === 1 ? 1 : 6);
    return { head: [T(l, 'Punkte nach dem Seminar', 'Points after the seminar'), num(r.after, l)] as [string, string], rows: [[T(l, 'Abzug', 'Deduction'), r.allowed ? T(l, '1 Punkt', '1 point') : T(l, 'keiner', 'none')], [T(l, 'Grund', 'Reason'), r.allowed ? T(l, 'Stand 1 bis 5, Frist frei', 'total 1 to 5, no recent seminar') : p > 5 ? T(l, 'ab 6 Punkten kein Abzug', 'no deduction from 6 points') : p < 1 ? T(l, 'keine Punkte', 'no points') : T(l, 'nur einmal in 5 Jahren', 'only once in 5 years')]] as [string, string][] }; },
});
