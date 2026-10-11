import { P } from '../engine/params';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihr MPU-Budget, Posten für Posten', 'Your MPU budget, item by item'), cta: T(l, 'Führerscheinkosten berechnen', 'Calculate licence costs'),
  inputs: [
    { id: 'g', label: T(l, 'Gutachten (Preis der Begutachtungsstelle)', 'Assessment (price of the assessment centre)'), def: 600, unit: '€', max: 5000 },
    { id: 'n', label: T(l, 'Abstinenznachweise', 'Abstinence tests'), def: 0, max: 24 },
    { id: 'np', label: T(l, 'Preis je Nachweis', 'Price per test'), def: 0, unit: '€', max: 1000 },
    { id: 'k', label: T(l, 'Kurs oder Beratung (freiwillig)', 'Course or counselling (optional)'), def: 0, unit: '€', max: 10000 },
  ],
  run: ({ g, n, np, k }: Record<string, number>) => { const F = P.fuehrerschein; const amt = F.antrag_pruefung + F.neuerteilung_min;
    return { head: [T(l, 'Gesamtkosten (Ihre Angaben + Behörde)', 'Total cost (your figures + authority)'), eur2(g + n * np + k + amt, l)] as [string, string],
      rows: [[T(l, 'Gutachten', 'Assessment'), eur2(g, l)], [T(l, 'Nachweise', 'Tests'), eur2(n * np, l)], [T(l, 'Behörde Neuerteilung, ab', 'Authority re-issue, from'), eur2(amt, l)]] as [string, string][],
      note: T(l, `Die Neuerteilung kostet nach GebOSt Nr. 202.3 zwischen ${F.neuerteilung_min} und ${F.neuerteilung_max} €, dazu ${F.antrag_pruefung} € Antragsprüfung. MPU-Preise legen die Stellen selbst fest.`, `Re-issue costs €${F.neuerteilung_min} to €${F.neuerteilung_max} under GebOSt no. 202.3, plus €${F.antrag_pruefung} for checking the application. Assessment centres set their own MPU prices.`) }; },
});
