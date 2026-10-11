/**
 * Cas de référence du moteur. Chaque attendu est lu dans le texte officiel (BKatV Anlage et Anhang,
 * FeV Anlage 13, § 107 OWiG, KraftStG § 9) ou relevé au Kfz-Steuer-Rechner du BMF (bloc « BMF »).
 */
import { describe, expect, it } from 'vitest';
import { speeding, distance, fees, increase, redLight, phone, alcohol, fromEntry, toleranz, limitationEnd, search, entry } from '../src/lib/engine/bkat';
import { stage, tilgung, seminar, applyMeasure, probezeit, pointsAt } from '../src/lib/engine/punkte';
import { pkw, elektro, krad, anhaenger, wohnmobil, co2Progressive, gewichtssteuer, schwerbehindert } from '../src/lib/engine/kfzsteuer';
import { nextHu, huLate, monthsLate, huCost, licenceFees, vignettePlan } from '../src/lib/engine/kosten';
import { BKAT } from '../src/lib/engine/params';

describe('BKat : lecture du texte officiel', () => {
  it('catalogue complet et tables', () => {
    expect(BKAT.entries.length).toBe(534); // numéros à montant fixe (596 au total, dont les renvois aux tables et les intitulés de groupe)
    expect(BKAT.speed.filter((r) => r.cls === 'c')).toHaveLength(10);
    expect(BKAT.distance).toHaveLength(15);
    expect(BKAT.increase.length).toBeGreaterThan(40);
  });
  it('lignes connues (BKatV Anlage)', () => {
    expect(entry('132').fine).toBe(90);
    expect(entry('132.3').fine).toBe(200); expect(entry('132.3').fv).toBe(1);
    expect(entry('246.1').fine).toBe(100);
    expect(entry('241').fine).toBe(500);
    expect(entry('241.2').fine).toBe(1500);
    expect(entry('243b').fine).toBe(250);
    expect(entry('50').fine).toBe(200);
    expect(entry('153').fine).toBe(100); expect(entry('153').points).toBe(0);
    expect(entry('100').fine).toBe(30);
    expect(entry('63.5').fine).toBe(40);
    expect(entry('52a.1').points).toBe(1); expect(entry('52a.1').probe).toBe('B');
  });
  it('recherche plein texte', () => {
    expect(search('Sicherheitsgurt').some((e) => e.nr === '100')).toBe(true);
    expect(search('246.1')[0].nr).toBe('246.1');
  });
});

describe('Geschwindigkeit (Tabelle 1 c)', () => {
  it('Toleranz 3 km/h / 3 %', () => {
    expect(toleranz(74)).toBe(71);
    expect(toleranz(100)).toBe(97);
    expect(toleranz(150)).toBe(145);
    expect(toleranz(153)).toBe(148);
  });
  it('21 km/h innerorts : 115 €, 1 point, frais 28,50 €', () => {
    const r = speeding({ limit: 50, measured: 74, inner: true });
    expect(r.over).toBe(21); expect(r.fine).toBe(115); expect(r.points).toBe(1); expect(r.fv).toBe(0);
    expect(r.fees).toBe(28.5); expect(r.total).toBe(143.5); expect(r.probe).toBe('A');
  });
  it('31 km/h : Fahrverbot innerorts seulement', () => {
    const i = speeding({ limit: 50, measured: 81, tolerance: false, inner: true });
    expect([i.fine, i.fv, i.points]).toEqual([260, 1, 2]);
    const o = speeding({ limit: 100, measured: 131, tolerance: false, inner: false });
    expect([o.fine, o.fv, o.points]).toEqual([200, 0, 1]);
  });
  it('mesure 150 sur 100 außerorts : 45 km/h, 320 €, 1 mois, 2 points', () => {
    const r = speeding({ limit: 100, measured: 150, inner: false });
    expect([r.over, r.fine, r.fv, r.points]).toEqual([45, 320, 1, 2]);
  });
  it('plus de 70 km/h innerorts : 800 €, 3 mois', () => {
    const r = speeding({ limit: 30, measured: 101, tolerance: false, inner: true });
    expect([r.fine, r.fv, r.points]).toEqual([800, 3, 2]);
  });
  it('jusqu’à 10 km/h : Verwarnungsgeld sans frais', () => {
    const r = speeding({ limit: 50, measured: 60, tolerance: false, inner: true });
    expect(r.fine).toBe(30); expect(r.verwarnung).toBe(true); expect(r.fees).toBe(0);
  });
  it('beharrlich (§ 4 Abs. 2 BKatV) et Vorsatz (§ 3 Abs. 4a)', () => {
    expect(speeding({ limit: 100, measured: 126, tolerance: false, inner: false, prior26: true }).fv).toBe(1);
    expect(speeding({ limit: 100, measured: 125, tolerance: false, inner: false, prior26: true }).fv).toBe(0);
    expect(speeding({ limit: 50, measured: 71, tolerance: false, inner: true, intent: true }).fine).toBe(230);
  });
  it('Lkw (Tabelle 1 a) : 16-20 km/h außerorts, 140 €, 1 point', () => {
    const r = speeding({ limit: 80, measured: 98, tolerance: false, inner: false, cls: 'a' });
    expect([r.fine, r.points]).toEqual([140, 1]);
  });
});

describe('Abstand, Rotlicht, Handy, Alkohol', () => {
  it('Abstand (Tabelle 2)', () => {
    expect(distance(120, 20).nr).toBe('12.6.2');
    expect(distance(120, 20).fine).toBe(100);
    const r = distance(140, 15);
    expect([r.nr, r.fine, r.fv, r.points]).toEqual(['12.7.3', 240, 1, 2]);
    expect(distance(70, 10).nr).toBe('12.1');
    expect(distance(100, 30).nr).toBe('12.4');
    expect(distance(90, 2).nr).toBe('12.5.5');
  });
  it('Rotlicht', () => {
    expect(redLight({ overOneSecond: false, harm: 'none' }).fine).toBe(90);
    const r = redLight({ overOneSecond: true, harm: 'danger' });
    expect([r.nr, r.fine, r.fv, r.points]).toEqual(['132.3.1', 320, 1, 2]);
    expect(redLight({ overOneSecond: false, harm: 'none', cyclist: true }).fine).toBe(60);
  });
  it('Handy', () => {
    expect(phone({ harm: 'none' }).fine).toBe(100);
    expect(phone({ harm: 'damage' }).fv).toBe(1);
    expect(phone({ harm: 'none', cyclist: true }).fine).toBe(55);
  });
  it('Alkohol (§ 24a, § 24c StVG)', () => {
    expect(alcohol({ promille: 0.6, priorEntries: 0, novice: false }).fine).toBe(500);
    const r = alcohol({ promille: 0.6, priorEntries: 1, novice: false });
    expect([r.fine, r.fv]).toEqual([1000, 3]);
    expect(alcohol({ promille: 0.2, priorEntries: 0, novice: true }).fine).toBe(250);
    expect(alcohol({ promille: 0.2, priorEntries: 0, novice: false }).fine).toBe(0);
    expect(alcohol({ promille: 1.2, priorEntries: 0, novice: false }).criminal).toBe(true);
    expect(alcohol({ promille: 1.7, priorEntries: 0, novice: false }).mpu).toBe(true);
    expect(alcohol({ promille: 0, thc: 4, priorEntries: 0, novice: false }).nr).toBe('242');
  });
  it('Tabelle 4, frais § 107 OWiG, Verjährung', () => {
    expect(increase(100, 'danger')).toBe(120); expect(increase(100, 'damage')).toBe(145); expect(increase(40, 'danger')).toBe(40);
    expect(fees(55).total).toBe(0); expect(fees(60).total).toBe(28.5); expect(fees(1000).total).toBe(53.5);
    expect(fromEntry('52a', { harm: 'none' }).fine).toBe(55);
    expect(limitationEnd('2026-08-15')).toBe('2027-02-15');
  });
});

describe('Punkte (§ 4, § 29 StVG) et Probezeit (§ 2a)', () => {
  it('étapes', () => {
    expect([stage(0), stage(3), stage(4), stage(6), stage(8)]).toEqual(['none', 'vormerkung', 'ermahnung', 'verwarnung', 'entzug']);
    expect(applyMeasure(8, 'none')).toEqual({ measure: 'ermahnung', points: 5 });
    expect(applyMeasure(8, 'ermahnung')).toEqual({ measure: 'verwarnung', points: 7 });
    expect(applyMeasure(8, 'verwarnung').measure).toBe('entzug');
  });
  it('Tilgung et Überliegefrist', () => {
    expect(tilgung('2026-03-01', 1)).toEqual({ tilgungsreif: '2028-09-01', geloescht: '2029-09-01', monate: 30 });
    expect(tilgung('2026-03-01', 2).tilgungsreif).toBe('2031-03-01');
    expect(pointsAt([{ rechtskraft: '2024-01-10', points: 1 }, { rechtskraft: '2025-05-01', points: 2 }], '2026-10-11')).toBe(2);
    expect(pointsAt([{ rechtskraft: '2024-01-10', points: 1 }], '2026-07-11')).toBe(0);
  });
  it('Fahreignungsseminar et Probezeit', () => {
    expect(seminar(5, null)).toEqual({ allowed: true, after: 4 });
    expect(seminar(6, null).allowed).toBe(false);
    expect(seminar(3, 2).allowed).toBe(false);
    expect(probezeit(1, 0)).toEqual({ step: 'aufbauseminar', units: 1, years: 4 });
    expect(probezeit(0, 1).step).toBe('keine');
    expect(probezeit(1, 2).step).toBe('verwarnung');
  });
});

describe('Kfz-Steuer (KraftStG § 9)', () => {
  it('barème CO2 2021', () => {
    expect(co2Progressive(95)).toBe(0);
    expect(co2Progressive(115)).toBe(40);
    expect(co2Progressive(128)).toBeCloseTo(68.6);
    expect(co2Progressive(200)).toBeCloseTo(40 + 44 + 50 + 58 + 68 + 20);
  });
  it('Pkw par période d’immatriculation', () => {
    expect(pkw({ ez: '2023-05-01', fuel: 'benzin', ccm: 1498, co2: 128 }).annual).toBe(98);
    expect(pkw({ ez: '2016-02-01', fuel: 'benzin', ccm: 1395, co2: 119 }).annual).toBe(76);
    expect(pkw({ ez: '2010-06-01', fuel: 'benzin', ccm: 1598, co2: 155 }).annual).toBe(102);
    expect(pkw({ ez: '2005-03-01', fuel: 'benzin', ccm: 1598, co2: 0, altKlasse: 'euro3plus' }).annual).toBe(108);
    expect(pkw({ ez: '2005-03-01', fuel: 'diesel', ccm: 1896, co2: 0, altKlasse: 'euro3plus' }).annual).toBe(293);
  });
  it('Elektro : exonération puis 50 % de la taxe au poids', () => {
    expect(gewichtssteuer(2232)).toBeCloseTo(136.54);
    const e = elektro('2022-04-01', 2232, 2030);
    expect(e.exempt).toBe(true); expect(e.exemptUntil).toBe('2032-04-01');
    expect(elektro('2029-04-01', 2232, 2036).exemptUntil).toBe('2035-12-31');
    expect(elektro('2029-04-01', 2232, 2036).annual).toBe(68);
  });
  it('moto, remorque, camping-car, § 3a', () => {
    expect(krad(689).annual).toBe(51);
    expect(anhaenger(750).annual).toBe(29);
    expect(anhaenger(3500).annual).toBe(134);
    expect(wohnmobil(3500, 's4').annual).toBe(240);
    expect(schwerbehindert(pkw({ ez: '2023-05-01', fuel: 'benzin', ccm: 1498, co2: 128 }), 'halb').annual).toBe(49);
  });
});

describe('Coûts réglementés', () => {
  it('HU', () => {
    expect(nextHu('2026-03', 'pkw', true)).toBe('2029-03');
    expect(nextHu('2026-11', 'pkw', false)).toBe('2028-11');
    expect(monthsLate('2026-01', '2026-06')).toBe(5);
    expect(huLate(1)).toEqual({ fine: 0, points: 0 });
    expect(huLate(3)).toEqual({ fine: 15, points: 0 });
    expect(huLate(9)).toEqual({ fine: 60, points: 1 });
    const c = huCost('pkw', true);
    expect(c.min).toBeGreaterThan(50); expect(c.max).toBeLessThan(140);
  });
  it('permis et vignette', () => {
    expect(licenceFees('B').total).toBeCloseTo(5.1 + 35.7 + 11.1 + 9.9 + 109.1);
    const v = vignettePlan(1, 7);
    expect(v[0].kind).toBe('tag10'); expect(v[0].cost).toBe(12.8);
    expect(vignettePlan(12, 3)[0].kind).toBe('jahr');
  });
});

/** Grille relevée le 2026-10-11 au Kfz-Steuer-Rechner du Bundesfinanzministerium (bmfRechner). */
describe('BMF : 21 cas relevés au Kfz-Steuer-Rechner officiel', () => {
  const P = (ez: string, fuel: 'benzin' | 'diesel', ccm: number, co2: number, alt?: 'euro3plus' | 'euro2' | 'euro1' | 'ozonfrei' | 'sonstige') => pkw({ ez, fuel, ccm, co2, altKlasse: alt }).annual;
  it.each([
    [P('2023-01-01', 'benzin', 1498, 128), 98], [P('2023-01-01', 'diesel', 1968, 145), 299], [P('2023-01-01', 'benzin', 2998, 214), 396],
    [P('2023-01-01', 'benzin', 999, 95), 20], [P('2023-01-01', 'benzin', 1984, 250), 520], [P('2016-01-01', 'benzin', 1395, 119), 76],
    [P('2016-01-01', 'diesel', 1598, 104), 170], [P('2010-01-01', 'benzin', 1598, 155), 102], [P('2013-01-01', 'diesel', 1995, 139), 248],
    [P('2013-01-01', 'benzin', 1390, 109), 28], [P('2005-01-01', 'benzin', 1598, 0, 'euro3plus'), 108], [P('2005-01-01', 'diesel', 1896, 0, 'euro3plus'), 293],
    [P('2005-01-01', 'benzin', 1781, 0, 'euro1'), 272], [P('2005-01-01', 'benzin', 1390, 0, 'euro2'), 103], [P('2005-01-01', 'diesel', 2500, 0, 'sonstige'), 939],
    [P('2009-03-01', 'benzin', 1598, 150, 'euro3plus'), 92],
    [elektro('2005-01-01', 2232, 2026).annual, 68], [elektro('2005-01-01', 1800, 2026).annual, 50],
    [krad(689).annual, 51], [anhaenger(750).annual, 29], [anhaenger(3500).annual, 134],
  ])('cas %#', (mine, bmf) => expect(mine).toBe(bmf));
});
