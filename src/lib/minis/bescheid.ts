import { fees } from '../engine/bkat';
import { P } from '../engine/params';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was auf dem Bescheid dazukommt', 'What the notice adds on top'), cta: T(l, 'Bußgeld berechnen', 'Calculate the fine'),
  inputs: [{ id: 'b', label: T(l, 'Bußgeld laut Katalog', 'Fine under the catalogue'), def: 100, unit: '€', max: 100000 }],
  run: ({ b }: Record<string, number>) => { const f = fees(b);
    return { head: [T(l, 'Gesamtbetrag', 'Total amount'), eur2(b + f.total, l)] as [string, string],
      rows: [[T(l, 'Gebühr (5 %, mind. 25 €)', 'Fee (5%, at least €25)'), eur2(f.gebuehr, l)], [T(l, 'Zustellung', 'Delivery'), eur2(f.auslagen, l)], [T(l, 'Verfahren', 'Procedure'), f.verwarnung ? T(l, `Verwarnungsgeld bis ${P.verfahren.verwarnung_max} €`, `warning fine up to €${P.verfahren.verwarnung_max}`) : T(l, 'Bußgeldbescheid', 'fine notice')]] as [string, string][] }; },
});
