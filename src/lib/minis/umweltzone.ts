import { fromEntry } from '../engine/bkat';
import { T, eur2, num, yn, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ohne passende Plakette in der Umweltzone', 'Low-emission zone without the right sticker'), cta: T(l, 'Ganzen Katalog durchsuchen', 'Search the whole catalogue'),
  inputs: [{ id: 'v', label: T(l, 'Vorsätzlich (zum Beispiel trotz Hinweis)?', 'Intentional (e.g. despite a warning)?'), def: 0, options: yn(l) }],
  run: ({ v }: Record<string, number>) => { const r = fromEntry('153', { intent: v === 1 });
    return { head: [T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), eur2(r.total, l)] as [string, string], rows: [[T(l, 'Regelsatz (Nr. 153)', 'Standard fine (no. 153)'), eur2(r.fine, l)], [T(l, 'Gebühr und Zustellung', 'Fee and delivery'), eur2(r.fees, l)], [T(l, 'Punkte', 'Points'), num(r.points, l)]] as [string, string][] }; },
});
