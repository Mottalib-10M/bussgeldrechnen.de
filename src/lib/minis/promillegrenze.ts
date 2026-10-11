import { P } from '../engine/params';
import { T, num, yn, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Welche Grenze gilt für Sie?', 'Which limit applies to you?'), cta: T(l, 'Folgen berechnen', 'Calculate the consequences'),
  inputs: [{ id: 'n', label: T(l, 'Probezeit oder unter 21?', 'Probation or under 21?'), def: 0, options: yn(l) }, { id: 'r', label: T(l, 'Unterwegs mit', 'Travelling by'), def: 0, options: [{ value: '0', label: T(l, 'Auto oder Motorrad', 'car or motorbike') }, { value: '1', label: T(l, 'Fahrrad', 'bicycle') }] }],
  run: ({ n, r }: Record<string, number>) => { const A = P.alkohol;
    const owi = r === 1 ? T(l, 'keine Bußgeldgrenze', 'no fine limit') : n === 1 ? '0,0 ‰' : `${num(A.promille_owi, l, 1)} ‰`;
    return { head: [T(l, 'Ab hier droht ein Bußgeld', 'A fine applies from'), owi] as [string, string],
      rows: [[T(l, 'Straftat bei Ausfallerscheinungen', 'Crime if impaired'), `${num(A.relativ_promille, l, 1)} ‰`], [T(l, 'Straftat ohne Weiteres', 'Crime in any case'), `${num(r === 1 ? A.rad_straftat_promille : A.straftat_promille, l, 1)} ‰`], [T(l, 'MPU', 'MPU'), `${num(A.mpu_promille, l, 1)} ‰`]] as [string, string][] }; },
});
