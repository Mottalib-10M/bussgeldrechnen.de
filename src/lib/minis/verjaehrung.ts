import { limitationEnd } from '../engine/bkat';
import { T, isoDate, moisOptions, yearOptions, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wann die Frist ohne Unterbrechung abläuft', 'When the period runs out without interruption'), cta: T(l, 'Bußgeld berechnen', 'Calculate the fine'),
  inputs: [{ id: 'm', label: T(l, 'Monat des Verstoßes', 'Month of the offence'), def: 8, options: moisOptions(l) }, { id: 'd', label: T(l, 'Tag', 'Day'), def: 15, max: 31 }, { id: 'y', label: T(l, 'Jahr', 'Year'), def: 2026, options: yearOptions(2026, 2027) }],
  run: ({ m, d, y }: Record<string, number>) => { const day = Math.min(28, Math.max(1, Math.round(d))); const end = limitationEnd(isoDate(y, m, day));
    const [ey, em, ed] = end.split('-');
    return { head: [T(l, 'Verjährung ohne Unterbrechung am', 'Time-barred, if never interrupted, on'), `${ed}.${em}.${ey}`] as [string, string],
      rows: [[T(l, 'Frist (§ 26 Abs. 3 StVG)', 'Period (Section 26(3) StVG)'), T(l, '6 Monate', '6 months')], [T(l, 'Unterbrochen durch', 'Interrupted by'), T(l, 'Anhörung, Bescheid u. a. (§ 33 OWiG)', 'hearing, notice etc. (Section 33 OWiG)')]] as [string, string][],
      note: T(l, 'Tage über 28 werden auf den 28. gesetzt, damit jeder Monat gilt.', 'Days above 28 are set to the 28th so that every month works.') }; },
});
