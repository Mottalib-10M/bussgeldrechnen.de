import { alcohol } from '../engine/bkat';
import { T, eur2, fvTxt, num, yn, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Promille am Steuer: die Folgen', 'Alcohol at the wheel: the consequences'), cta: T(l, 'Grenzwerte im Detail', 'Limits in detail'),
  inputs: [
    { id: 'p', label: T(l, 'Blutalkohol', 'Blood alcohol'), def: 0.6, unit: '‰', max: 5, decimals: 2 },
    { id: 'v', label: T(l, 'Frühere Einträge wegen Alkohol', 'Earlier alcohol entries'), def: 0, options: [{ value: '0', label: T(l, 'keine', 'none') }, { value: '1', label: T(l, 'einer', 'one') }, { value: '2', label: T(l, 'mehrere', 'several') }] },
    { id: 'n', label: T(l, 'Probezeit oder unter 21?', 'Probation or under 21?'), def: 0, options: yn(l) },
  ],
  run: ({ p, v, n }: Record<string, number>) => { const r = alcohol({ promille: p, priorEntries: (v as 0 | 1 | 2), novice: n === 1 });
    return { head: [r.criminal ? T(l, 'Strafverfahren statt Bußgeld', 'Criminal case, not a fine') : T(l, 'Zu zahlen inklusive Gebühren', 'Total including fees'), r.criminal ? '§ 316 StGB' : eur2(r.total, l)] as [string, string],
      rows: [[T(l, 'Punkte', 'Points'), num(r.criminal ? 3 : r.points, l)], [T(l, 'Fahrverbot', 'Driving ban'), r.criminal ? T(l, 'Entziehung', 'withdrawal') : fvTxt(r.fv, l)], [T(l, 'MPU angeordnet', 'MPU ordered'), r.mpu ? T(l, 'ja (ab 1,6 ‰)', 'yes (from 1.6‰)') : T(l, 'nicht wegen des Werts', 'not because of the reading')]] as [string, string][],
      note: r.criminal ? T(l, 'Drei Punkte gelten, wenn das Gericht die Fahrerlaubnis entzieht (FeV Anlage 13 Nr. 1.8).', 'Three points apply when the court withdraws the licence (FeV annex 13 no. 1.8).') : undefined }; },
});
