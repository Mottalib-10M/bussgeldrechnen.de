import { licenceFees } from '../engine/kosten';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Amtliche Gebühren je Prüfungsversuch', 'Official fees per test attempt'), cta: T(l, 'Gesamtkosten mit Fahrschule', 'Total cost with driving school'),
  inputs: [{ id: 't', label: T(l, 'Theorieversuche', 'Theory attempts'), def: 1, max: 10 }, { id: 'p', label: T(l, 'Praxisversuche', 'Practical attempts'), def: 1, max: 10 }],
  run: ({ t, p }: Record<string, number>) => { const r = licenceFees('B', Math.max(1, Math.round(t)), Math.max(1, Math.round(p)));
    return { head: [T(l, 'Amtliche Gebühren Klasse B', 'Official fees, class B'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'Behörde', 'Authority'), eur2(r.amt, l)], [T(l, 'Theorie', 'Theory'), eur2(r.theorie, l)], [T(l, 'Praxis', 'Practical'), eur2(r.praxis, l)]] as [string, string][] }; },
});
