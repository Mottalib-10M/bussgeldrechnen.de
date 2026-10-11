/**
 * Moteur du Bußgeldkatalog : lit bkat-2026.json (tableau officiel de la BKatV) et params-2026.json.
 * Règles appliquées, toutes lues dans le texte :
 *  - Regelsätze de l'Anlage et des Tabellen 1 et 2 du Anhang (BKatV) ;
 *  - § 3 Abs. 3 BKatV + Tabelle 4 : majoration pour Gefährdung / Sachbeschädigung des Regelsätze > 55 € ;
 *  - § 3 Abs. 4a BKatV : Vorsatz double le Regelsatz > 55 €, arrondi à l'euro inférieur ;
 *  - § 4 Abs. 2 BKatV : beharrlich (deux dépassements ≥ 26 km/h en 12 mois) → Fahrverbot 1 mois ;
 *  - § 107 OWiG : Gebühr 5 % (min. 25 €, max. 7 500 €) + 3,50 € de Zustellung, seulement au-delà de 55 € ;
 *  - FeV Anlage 13 (points) et Anlage 12 (A/B en Probezeit).
 */
import { P, BKAT, type BkatEntry, type SpeedRow, type DistanceRow } from './params';

export type VehicleClass = 'a' | 'b' | 'c';
const V = P.verfahren;

export const entries = BKAT.entries;
export const entry = (nr: string): BkatEntry => {
  const e = BKAT.entries.find((x) => x.nr === nr);
  if (!e) throw new Error(`BKat-Nummer unbekannt : ${nr}`);
  return e;
};

/** Toleranzabzug (PTB : 3 km/h jusqu'à 100 km/h mesurés, 3 % au-delà), arrondi en faveur du conducteur. */
export function toleranz(measured: number): number {
  const t = P.toleranz;
  if (measured <= 0) return 0;
  return measured <= t.grenze_kmh ? Math.max(0, measured - t.kmh_bis_100) : Math.floor(measured * (1 - t.prozent_ueber_100));
}

/** Frais du Bußgeldbescheid (§ 107 OWiG). 0 pour un Verwarnungsgeld (≤ 55 €). */
export function fees(fine: number): { gebuehr: number; auslagen: number; total: number; verwarnung: boolean } {
  if (fine <= V.verwarnung_max) return { gebuehr: 0, auslagen: 0, total: 0, verwarnung: true };
  const g = Math.min(V.gebuehr_max, Math.max(V.gebuehr_min, fine * V.gebuehr_satz));
  return { gebuehr: g, auslagen: V.zustellung, total: g + V.zustellung, verwarnung: false };
}

/** Majoration de la Tabelle 4 (§ 3 Abs. 3 BKatV). Sans ligne correspondante, le Regelsatz reste inchangé. */
export function increase(base: number, kind: 'none' | 'danger' | 'damage'): number {
  if (kind === 'none' || base <= V.verwarnung_max) return base;
  const row = BKAT.increase.find((r) => r.base === base);
  return row ? row[kind] : base;
}

/** Vorsatz (§ 3 Abs. 4a BKatV) : Regelsatz > 55 € doublé, arrondi à l'euro inférieur. */
export const vorsatz = (fine: number, yes: boolean) => (yes && fine > V.verwarnung_max ? Math.floor(fine * 2) : fine);

export interface Outcome { nr: string; fine: number; fv: number; points: number; probe: 'A' | 'B' | null; fees: number; total: number; verwarnung: boolean; label: string; notes: string[] }

function finish(nr: string, label: string, fine: number, fv: number, points: number, notes: string[] = []): Outcome {
  const f = fees(fine);
  return { nr, label, fine, fv, points, probe: points ? 'A' : null, fees: f.total, total: fine + f.total, verwarnung: f.verwarnung, notes };
}

export interface SpeedInput { limit: number; measured: number; inner: boolean; cls?: VehicleClass; tolerance?: boolean; intent?: boolean; prior26?: boolean }
export interface SpeedOutcome extends Outcome { over: number; vorwerfbar: number; row: SpeedRow | null; beharrlich: boolean }

/** Dépassement de vitesse : Tabelle 1 du Anhang (Nr. 11.1, 11.2, 11.3). */
export function speeding(i: SpeedInput): SpeedOutcome {
  const cls = i.cls ?? 'c';
  const vorwerfbar = i.tolerance === false ? i.measured : toleranz(i.measured);
  const over = Math.max(0, vorwerfbar - i.limit);
  const row = over > 0 ? BKAT.speed.find((r) => r.cls === cls && over >= Math.max(1, r.lo) && (r.hi === null || over <= r.hi)) ?? null : null;
  if (!row) return { ...finish('', '', 0, 0, 0), over, vorwerfbar, row: null, beharrlich: false };
  let fine = i.inner ? row.inner : row.outer;
  let fv = i.inner ? row.fvInner : row.fvOuter;
  const points = i.inner ? row.ptInner : row.ptOuter;
  const notes: string[] = [];
  fine = vorsatz(fine, !!i.intent);
  const beharrlich = !!i.prior26 && over >= V.beharrlich_kmh && fv === 0;
  if (beharrlich) { fv = 1; notes.push('beharrlich'); }
  return { ...finish(row.nr, row.nr, fine, fv, points, notes), over, vorwerfbar, row, beharrlich };
}

export interface DistanceOutcome extends Outcome { ratio: number; row: DistanceRow | null }
/** Abstand (Nr. 12 + Tabelle 2) : ratio = Abstand en m ÷ halber Tachowert. */
export function distance(speed: number, meters: number, intent = false): DistanceOutcome {
  const ratio = speed > 0 ? meters / (speed / 2) : 1;
  if (speed <= 80) {
    const e = entry('12.1');
    return { ...finish('12.1', e.text, vorsatz(e.fine!, intent), 0, 0), ratio, row: null };
  }
  if (ratio >= 0.5) {
    const e = entry('12.4');
    return { ...finish('12.4', e.text, vorsatz(e.fine!, intent), 0, 0), ratio, row: null };
  }
  const band = speed > 130 ? 130 : speed > 100 ? 100 : 80;
  const rows = BKAT.distance.filter((r) => r.speedFrom === band).sort((a, b) => a.tenths - b.tenths);
  const row = rows.find((r) => ratio < r.tenths / 10) ?? rows[rows.length - 1];
  return { ...finish(row.nr, row.nr, vorsatz(row.fine, intent), row.fv, row.points), ratio, row };
}

/** Une ligne du catalogue avec ses options (Gefährdung, Sachbeschädigung, Vorsatz). */
export function fromEntry(nr: string, opts: { harm?: 'none' | 'danger' | 'damage'; intent?: boolean } = {}): Outcome {
  const e = entry(nr);
  if (e.fine === null) throw new Error(`${nr} renvoie à une table`);
  const already = /Gefährdung|Sachbeschädigung|gefährdet|beschädigt/.test(e.text);
  const base = already ? e.fine : increase(e.fine, opts.harm ?? 'none');
  const fine = vorsatz(base, !!opts.intent);
  const o = finish(e.nr, e.text, fine, e.fv, e.points);
  return { ...o, probe: e.probe };
}

/** Rotlicht (Nr. 132 / 132a) selon la durée de la phase rouge et ses suites. */
export function redLight(o: { overOneSecond: boolean; harm: 'none' | 'danger' | 'damage'; cyclist?: boolean }): Outcome {
  const base = o.cyclist ? '132a' : '132';
  const nr = o.overOneSecond
    ? `${base}.3${o.harm === 'danger' ? '.1' : o.harm === 'damage' ? '.2' : ''}`
    : o.harm === 'danger' ? `${base}.1` : o.harm === 'damage' ? `${base}.2` : base;
  return fromEntry(nr);
}

/** Handy am Steuer (Nr. 246) ; Radfahrer : 246.4. */
export function phone(o: { harm: 'none' | 'danger' | 'damage'; cyclist?: boolean }): Outcome {
  if (o.cyclist) return fromEntry('246.4');
  return fromEntry(o.harm === 'danger' ? '246.2' : o.harm === 'damage' ? '246.3' : '246.1');
}

export interface AlcoholInput { promille: number; thc?: number; priorEntries: 0 | 1 | 2; novice: boolean; withAlcoholAndThc?: boolean }
export interface AlcoholOutcome extends Outcome { criminal: boolean; mpu: boolean }
/**
 * § 24a / § 24c StVG + Nr. 241 à 243b. Au-delà, la page renvoie au droit pénal (§ 316 StGB) sans calculer de peine.
 * mpu : seuil de § 13 Satz 1 Nr. 2 Buchst. c FeV (1,6 ‰), sans préjuger des autres motifs.
 */
export function alcohol(i: AlcoholInput): AlcoholOutcome {
  const A = P.alkohol;
  const suffix = i.priorEntries === 0 ? '' : `.${i.priorEntries}`;
  const thc = i.thc ?? 0;
  const mpu = i.promille >= A.mpu_promille;
  const criminal = i.promille >= A.straftat_promille;
  let o: Outcome;
  if (thc >= A.thc_ng && i.withAlcoholAndThc) o = fromEntry(`243a${suffix}`);
  else if (i.promille >= A.promille_owi) o = fromEntry(`241${suffix}`);
  else if (thc >= A.thc_ng) o = fromEntry(`242${suffix}`);
  else if (i.novice && (i.promille > 0 || thc > 0)) o = fromEntry('243b');
  else o = finish('', '', 0, 0, 0);
  return { ...o, criminal, mpu };
}

/** Fin de la Verfolgungsverjährung (§ 26 Abs. 3 StVG, six mois depuis le 1.7.2026), sans interruption. */
export function limitationEnd(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + V.verjaehrung_monate, d));
  return dt.toISOString().slice(0, 10);
}

/** Recherche plein texte dans le catalogue (numéro ou mots), pour l'outil de l'accueil. */
/** Mots de tous les jours (et leur équivalent anglais) → termes du texte officiel. */
const SYN: Record<string, string[]> = {
  handy: ['elektronisches gerät'], smartphone: ['elektronisches gerät'], phone: ['elektronisches gerät'], telefon: ['elektronisches gerät'],
  rotlicht: ['rotes wechsellichtzeichen', 'rotlicht'], ampel: ['wechsellichtzeichen'], 'red': ['rotes wechsellichtzeichen'],
  winterreifen: ['glatteis', 'bereifung'], reifen: ['bereifung', 'reifen'], tyres: ['bereifung'],
  rettungsgasse: ['gasse'], gurt: ['gurt'], seatbelt: ['sicherheitsgurt'], belt: ['sicherheitsgurt'],
  tüv: ['hauptuntersuchung'], tuev: ['hauptuntersuchung'], mot: ['hauptuntersuchung'],
  falschparken: ['geparkt'], parken: ['geparkt'], parking: ['geparkt'], halteverbot: ['gehalten', 'halten'],
  blitzer: ['höchstgeschwindigkeit'], speeding: ['höchstgeschwindigkeit'], alkohol: ['promille', 'alkohol'], alcohol: ['promille', 'alkohol'],
  cannabis: ['tetrahydrocannabinol'], kiffen: ['tetrahydrocannabinol'], blaulicht: ['blaues blinklicht', 'einsatzfahrzeug'], kind: ['kind'],
  'e-scooter': ['elektrokleinstfahrzeug'], scooter: ['elektrokleinstfahrzeug'], fahrrad: ['radfahr', 'fahrrad'], bike: ['radfahr'],
};
export function search(q: string, limit = 30): BkatEntry[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const words = s.split(/\s+/);
  const hay = (e: BkatEntry) => (e.text + ' ' + e.heading).toLowerCase();
  const hit = (h: string, w: string) => h.includes(w) || (SYN[w] ?? []).some((x) => h.includes(x));
  return BKAT.entries.filter((e) => e.fine !== null && (e.nr === s || words.every((w) => hit(hay(e), w)))).slice(0, limit);
}
