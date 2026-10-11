import { P } from '../engine/params';
import { T, isoDate, moisOptions, yearOptions, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Bis wann Sie reagieren können', 'Your deadline to respond'), cta: T(l, 'Bußgeld berechnen', 'Calculate the fine'),
  inputs: [{ id: 'm', label: T(l, 'Bescheid zugestellt: Monat', 'Notice delivered: month'), def: 10, options: moisOptions(l) }, { id: 'd', label: T(l, 'Tag', 'Day'), def: 12, max: 31 }, { id: 'y', label: T(l, 'Jahr', 'Year'), def: 2026, options: yearOptions(2026, 2027) }],
  run: ({ m, d, y }: Record<string, number>) => { const day = Math.min(28, Math.max(1, Math.round(d)));
    const t = new Date(`${isoDate(y, m, day)}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 7 * P.verfahren.einspruch_wochen);
    const [ey, em, ed] = t.toISOString().slice(0, 10).split('-');
    return { head: [T(l, 'Einspruchsfrist endet am', 'Objection period ends on'), `${ed}.${em}.${ey}`] as [string, string], rows: [[T(l, 'Frist', 'Period'), T(l, `${P.verfahren.einspruch_wochen} Wochen ab Zustellung`, `${P.verfahren.einspruch_wochen} weeks from delivery`)], [T(l, 'Fällt sie auf Wochenende/Feiertag', 'If it falls on a weekend/holiday'), T(l, 'nächster Werktag', 'next working day')]] as [string, string][],
      note: T(l, 'Tage über 28 werden auf den 28. gesetzt.', 'Days above 28 are set to the 28th.') }; },
});
