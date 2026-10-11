import { P } from '../engine/params';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Amtliche Gebühren der Umschreibung', 'Official fees for the exchange'), cta: T(l, 'Führerscheinkosten berechnen', 'Calculate licence costs'),
  inputs: [{ id: 'h', label: T(l, 'Führerschein aus', 'Licence from'), def: 0, options: [{ value: '0', label: T(l, 'EU/EWR oder Anlage-11-Staat ohne Prüfung', 'EU/EEA or annex 11 country, no test') }, { value: '1', label: T(l, 'Anlage-11-Staat mit Theorieprüfung', 'annex 11 country with theory test') }, { value: '2', label: T(l, 'anderer Staat: Theorie und Praxis', 'other country: theory and practical') }] }],
  run: ({ h }: Record<string, number>) => { const F = P.fuehrerschein;
    const amt = F.antrag_pruefung + (h === 0 ? F.eu_umschreibung : F.ersterteilung); const th = h >= 1 ? F.theorie + F.theorie_pc : 0; const pr = h === 2 ? F.praxis_b : 0;
    return { head: [T(l, 'Amtliche Gebühren', 'Official fees'), eur2(amt + th + pr, l)] as [string, string], rows: [[T(l, 'Behörde', 'Authority'), eur2(amt, l)], [T(l, 'Theorieprüfung', 'Theory test'), eur2(th, l)], [T(l, 'Praxisprüfung Klasse B', 'Class B practical'), eur2(pr, l)]] as [string, string][],
      note: T(l, 'Ohne Fahrschule, Sehtest und Übersetzung, deren Preise frei sind.', 'Excluding driving school, eye test and translation, whose prices are free.') }; },
});
