/**
 * Coûts réglementés : Hauptuntersuchung (StVZO Anlage VIII, GebOSt Nr. 413 et 416), retard de HU
 * (BKat Nr. 186.2), frais administratifs et d'examen du permis (GebOSt Nr. 201, 202, 401, 402),
 * vignette autrichienne (tarifs ASFINAG 2026).
 */
import { P } from './params';
const H = P.hu, F = P.fuehrerschein;

export type HuVehicle = 'pkw' | 'krad' | 'wohnmobil35' | 'anhaenger750';

const addMonths = (ym: string, m: number) => {
  const [y, mo] = ym.split('-').map(Number);
  const t = y * 12 + (mo - 1) + m;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
};

/** Mois de la prochaine HU (Anlage VIII 2.1 et 2.3). firstHu = véhicule neuf, première HU. */
export function nextHu(lastYm: string, v: HuVehicle, firstHu: boolean): string {
  const m = v === 'krad' ? H.krad_monate
    : v === 'wohnmobil35' ? (firstHu ? H.wohnmobil_35_erst : H.wohnmobil_35)
    : v === 'anhaenger750' ? (firstHu ? H.anhaenger_750_erst : H.anhaenger_750)
    : (firstHu ? H.pkw_erst_monate : H.pkw_monate);
  return addMonths(lastYm, m);
}

/** Mois de retard entiers entre la fin du mois dû et le mois de contrôle. */
export const monthsLate = (dueYm: string, nowYm: string) => {
  const [a, b] = dueYm.split('-').map(Number), [c, d] = nowYm.split('-').map(Number);
  return Math.max(0, (c * 12 + d) - (a * 12 + b));
};

/** Bußgeld pour HU dépassée (BKat Nr. 186.2, véhicules sans Sicherheitsprüfung) et point au-delà de 8 mois. */
export function huLate(months: number): { fine: number; points: number } {
  const row = (H.ueberzogen as [number, number][]).find(([max]) => months <= max)!;
  return { fine: row[1], points: months > H.ueberzogen_punkt_ab_monate ? 1 : 0 };
}

/** Gebührenrahmen d'une HU chez un amtlich anerkannter Sachverständiger (GebOSt), TVA comprise. */
export function huCost(v: 'pkw' | 'krad', withAu: boolean, obd = true): { min: number; max: number } {
  const base = v === 'krad' ? [H.gebuehr_krad_min, H.gebuehr_krad_max] : [H.gebuehr_pkw_min, H.gebuehr_pkw_max];
  const au = !withAu || v === 'krad' ? [0, 0] : obd ? [H.au_ohne_messung_min, H.au_ohne_messung_max] : [H.au_mit_messung_min, H.au_mit_messung_max];
  const f = (b: number, a: number) => (b + a * H.au_faktor_bei_hu + H.plakette) * (1 + H.ust);
  return { min: f(base[0], au[0]), max: f(base[1], au[1]) };
}

export type Klasse = 'B' | 'A' | 'AM';
/** Frais officiels d'un premier permis (sans école de conduite, dont les prix sont libres). */
export function licenceFees(k: Klasse, theoryAttempts = 1, practiceAttempts = 1): { amt: number; theorie: number; praxis: number; total: number } {
  const amt = F.antrag_pruefung + F.ersterteilung;
  const theorie = theoryAttempts * (F.theorie + F.theorie_pc);
  const praxis = practiceAttempts * (k === 'A' ? F.praxis_a : k === 'AM' ? F.praxis_am : F.praxis_b);
  return { amt, theorie, praxis, total: amt + theorie + praxis };
}

export type VignetteKind = 'tag1' | 'tag10' | 'monat2' | 'jahr';
/**
 * Comparaison des vignettes pour `trips` séjours de `days` jours chacun, autoroute utilisée à l'aller
 * et au retour seulement (deux jours de trajet, un seul si le séjour tient en une journée).
 * Hypothèse affichée sur la page : pas de trajet autoroutier pendant le séjour.
 */
export function vignettePlan(trips: number, days: number, krad = false): { kind: VignetteKind; perTrip: number; cost: number }[] {
  const t = krad ? P.vignette.krad : P.vignette.pkw;
  const n = Math.max(0, Math.floor(trips)), d = Math.max(1, Math.floor(days));
  const travelDays = d === 1 ? 1 : 2;
  const per: { kind: VignetteKind; perTrip: number }[] = [{ kind: 'tag1', perTrip: travelDays * t.tag1 }];
  if (d <= 10) per.push({ kind: 'tag10', perTrip: t.tag10 });
  if (d <= 61) per.push({ kind: 'monat2', perTrip: t.monat2 });
  const opts = per.map((o) => ({ ...o, cost: o.perTrip * n }));
  opts.push({ kind: 'jahr', perTrip: n ? t.jahr / n : t.jahr, cost: n ? t.jahr : 0 });
  return opts.sort((a, b) => a.cost - b.cost);
}
