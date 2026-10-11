import { stage, untilEntzug, seminar } from '../engine/punkte';
import { T, num, type L } from './_kit';
const STAGE = { none: ['keine Maßnahme', 'no measure'], vormerkung: ['Vormerkung', 'entry noted'], ermahnung: ['Ermahnung', 'reminder'], verwarnung: ['Verwarnung', 'warning'], entzug: ['Entziehung', 'licence withdrawn'] } as const;
export default (l: L) => ({
  title: T(l, 'Wo Sie im Punktesystem stehen', 'Where you stand in the points system'), cta: T(l, 'Zum Punkterechner', 'Open the points calculator'),
  inputs: [{ id: 'p', label: T(l, 'Punkte heute', 'Points today'), def: 3, max: 20 }],
  run: ({ p }: Record<string, number>) => { const s = stage(p); const sem = seminar(p, null);
    return { head: [T(l, 'Stufe', 'Stage'), T(l, STAGE[s][0], STAGE[s][1])] as [string, string], rows: [[T(l, 'Noch bis 8 Punkte', 'Left until 8 points'), num(untilEntzug(p), l)], [T(l, 'Seminar bringt', 'Seminar gives'), sem.allowed ? T(l, '1 Punkt Abzug', '1 point off') : T(l, 'keinen Abzug', 'no deduction')]] as [string, string][] }; },
});
