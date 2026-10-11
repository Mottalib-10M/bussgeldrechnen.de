import { P } from '../engine/params';
import { T, yn, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wann Ihr Fahrverbot beginnt', 'When your driving ban starts'), cta: T(l, 'Bußgeld berechnen', 'Calculate the fine'),
  inputs: [{ id: 'f', label: T(l, 'Fahrverbot in den letzten 2 Jahren?', 'Driving ban in the last 2 years?'), def: 0, options: yn(l) }, { id: 'm', label: T(l, 'Dauer des neuen Fahrverbots', 'Length of the new ban'), def: 1, options: [1, 2, 3].map((x) => ({ value: String(x), label: String(x) })) }],
  run: ({ f, m }: Record<string, number>) => { const V = P.verfahren;
    return { head: [T(l, 'Spätester Beginn nach Rechtskraft', 'Latest start after the decision is final'), f === 1 ? T(l, '1 Monat', '1 month') : T(l, `${V.fahrverbot_schonfrist_monate} Monate`, `${V.fahrverbot_schonfrist_monate} months`)] as [string, string],
      rows: [[T(l, 'Wahl des Zeitpunkts', 'Choice of timing'), f === 1 ? T(l, 'nein, sofort mit Abgabe', 'no, starts on surrender') : T(l, 'ja, innerhalb der Frist', 'yes, within the window')], [T(l, 'Dauer', 'Length'), `${num(m, l)} ${m === 1 ? T(l, 'Monat', 'month') : T(l, 'Monate', 'months')}`]] as [string, string][] }; },
});
