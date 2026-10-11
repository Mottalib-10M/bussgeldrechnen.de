import { alcohol } from '../engine/bkat';
import { T, eur2, fvTxt, num, yn, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'THC am Steuer: der Grenzwert 3,5 ng/ml', 'THC at the wheel: the 3.5 ng/ml limit'), cta: T(l, 'Alkohol und Drogen berechnen', 'Calculate alcohol and drugs'),
  inputs: [
    { id: 't', label: T(l, 'THC im Blutserum', 'THC in blood serum'), def: 4, unit: 'ng/ml', max: 100, decimals: 1 },
    { id: 'a', label: T(l, 'Dazu Alkohol getrunken?', 'Alcohol as well?'), def: 0, options: yn(l) },
    { id: 'n', label: T(l, 'Probezeit oder unter 21?', 'Probation or under 21?'), def: 0, options: yn(l) },
  ],
  run: ({ t, a, n }: Record<string, number>) => { const r = alcohol({ promille: 0, thc: t, priorEntries: 0, novice: n === 1, withAlcoholAndThc: a === 1 });
    return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'BKat-Nummer', 'BKat number'), r.nr || '–'], [T(l, 'Punkte', 'Points'), num(r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), fvTxt(r.fv, l)]] as [string, string][] }; },
});
