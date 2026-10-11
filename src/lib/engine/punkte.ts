/**
 * Fahreignungs-Bewertungssystem (§ 4 StVG), Tilgung (§ 29 StVG) et Probezeit (§ 2a StVG).
 * Depuis la réforme de 2014, chaque inscription a son propre délai : pas de Tilgungshemmung.
 */
import { P } from './params';
const K = P.punkte;

export type Stage = 'none' | 'vormerkung' | 'ermahnung' | 'verwarnung' | 'entzug';
export function stage(points: number): Stage {
  if (points >= K.entzug_ab) return 'entzug';
  if (points >= K.verwarnung_ab) return 'verwarnung';
  if (points >= K.ermahnung_ab) return 'ermahnung';
  if (points >= 1) return 'vormerkung';
  return 'none';
}

/** Points restants avant le retrait (8). */
export const untilEntzug = (points: number) => Math.max(0, K.entzug_ab - points);

/** Fahreignungsseminar (§ 4 Abs. 7) : −1 point si le total est entre 1 et 5, une fois en cinq ans. */
export function seminar(points: number, lastSeminarYearsAgo: number | null): { allowed: boolean; after: number } {
  const allowed = points >= 1 && points <= K.seminar_abzug_bis && (lastSeminarYearsAgo === null || lastSeminarYearsAgo >= K.seminar_sperre_jahre);
  return { allowed, after: allowed ? points - 1 : points };
}

/**
 * § 4 Abs. 6 : une étape sautée est d'abord prononcée, et le total est ramené à 5 (Ermahnung) ou 7 (Verwarnung).
 * prevMeasure = dernière mesure déjà prononcée.
 */
export function applyMeasure(points: number, prevMeasure: Stage): { measure: Stage; points: number } {
  const s = stage(points);
  if (s === 'entzug' && prevMeasure !== 'verwarnung') {
    return prevMeasure === 'ermahnung' ? { measure: 'verwarnung', points: K.verwarnung_reset } : { measure: 'ermahnung', points: K.ermahnung_reset };
  }
  if (s === 'verwarnung' && prevMeasure !== 'ermahnung' && prevMeasure !== 'verwarnung') return { measure: 'ermahnung', points: K.ermahnung_reset };
  return { measure: s, points };
}

const addMonths = (iso: string, m: number) => {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1 + m, d)).toISOString().slice(0, 10);
};

/** Tilgung d'une inscription (§ 29 Abs. 1, 4, 6) : délai depuis la Rechtskraft, puis Überliegefrist d'un an. */
export function tilgung(rechtskraft: string, points: 1 | 2 | 3, fahrverbotOhnePunkte = false): { tilgungsreif: string; geloescht: string; monate: number } {
  const monate = points === 3 ? K.tilgung_3p_monate : points === 2 ? K.tilgung_2p_monate : K.tilgung_1p_monate;
  void fahrverbotOhnePunkte;
  const tilgungsreif = addMonths(rechtskraft, monate);
  return { tilgungsreif, geloescht: addMonths(tilgungsreif, K.ueberliege_monate), monate };
}

/** Total au jour donné : somme des inscriptions non encore tilgungsreif. */
export function pointsAt(list: Array<{ rechtskraft: string; points: 1 | 2 | 3 }>, today: string): number {
  return list.reduce((s, e) => s + (tilgung(e.rechtskraft, e.points).tilgungsreif > today ? e.points : 0), 0);
}

export type ProbeStep = 'keine' | 'aufbauseminar' | 'verwarnung' | 'entzug';
/**
 * § 2a Abs. 2 : un A ou deux B → Aufbauseminar (+ 2 ans de Probezeit) ; nouveau A ou deux B après le
 * séminaire → Verwarnung et verkehrspsychologische Beratung conseillée ; encore une fois → Entzug.
 */
export function probezeit(a: number, b: number): { step: ProbeStep; units: number; years: number } {
  const units = a + Math.floor(b / 2);
  const step: ProbeStep = units >= 3 ? 'entzug' : units === 2 ? 'verwarnung' : units === 1 ? 'aufbauseminar' : 'keine';
  return { step, units, years: P.probezeit.jahre + (units >= 1 ? P.probezeit.verlaengerung_jahre : 0) };
}
