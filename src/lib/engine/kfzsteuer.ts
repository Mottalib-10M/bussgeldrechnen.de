/**
 * Kraftfahrzeugsteuer (KraftStG, Stand 22.12.2025). Règles lues dans le texte :
 *  - § 8 Nr. 1 / § 9 Abs. 1 Nr. 2 : Pkw selon la date de première immatriculation (EZ)
 *      a) EZ jusqu'au 30.6.2009 : par 100 cm³ commencés, taux selon la classe d'émission ;
 *      b) EZ 1.7.2009 – 31.12.2020 : 2 € (essence) / 9,50 € (diesel) par 100 cm³ + 2 € par g CO2
 *         au-delà de 120 (EZ ≤ 2011), 110 (2012-2013) ou 95 g/km (dès 2014) ;
 *      c) EZ dès le 1.1.2021 : même part cylindrée + barème progressif au-delà de 95 g/km.
 *  - § 18 Abs. 4a : EZ 5.11.2008 – 30.6.2009, b) s'applique s'il est plus favorable que a).
 *  - § 3d : Elektro exonéré 10 ans pour une EZ du 18.5.2011 au 31.12.2030, au plus tard jusqu'au 31.12.2035 ;
 *    ensuite § 8 Nr. 2 + § 9 Abs. 1 Nr. 3 (poids total par 200 kg) réduit de 50 % (§ 9 Abs. 2).
 *  - § 9 Abs. 1 Nr. 1 (moto), Nr. 2a (Wohnmobil), Nr. 5 (Anhänger) ; § 3a (Schwerbehinderte) ;
 *  - § 11 Abs. 5 : montant dû arrondi à l'euro inférieur.
 */
import { P } from './params';
const K = P.kfz;

export type Fuel = 'benzin' | 'diesel';
export type AltKlasse = keyof typeof K.alt_saetze;
export interface PkwInput { ez: string; fuel: Fuel; ccm: number; co2: number; altKlasse?: AltKlasse }
export interface TaxLine { label: string; amount: number }
export interface TaxResult { annual: number; raw: number; lines: TaxLine[]; regime: string; exemptUntil?: string }

const per100 = (ccm: number) => Math.ceil(Math.max(0, ccm) / 100);
const floorEur = (x: number) => Math.floor(x + 1e-9);

function hubraum(ccm: number, fuel: Fuel): TaxLine {
  const u = per100(ccm);
  return { label: 'hubraum', amount: u * (fuel === 'diesel' ? K.hubraum_diesel : K.hubraum_benzin) };
}

/** Barème CO2 progressif des Pkw immatriculés depuis le 1.1.2021. */
export function co2Progressive(co2: number): number {
  let rest = Math.max(0, Math.floor(co2) - K.co2_frei_2021), from = K.co2_frei_2021, sum = 0;
  for (const [to, rate] of K.co2_stufen_2021 as [number, number][]) {
    const span = Math.min(rest, to - from);
    if (span <= 0) break;
    sum += span * rate; rest -= span; from = to;
  }
  return sum;
}

function regimeB(i: PkwInput): TaxResult {
  const h = hubraum(i.ccm, i.fuel);
  const frei = i.ez <= '2011-12-31' ? K.co2_frei_bis_2011 : i.ez <= '2013-12-31' ? K.co2_frei_2012_2013 : K.co2_frei_ab_2014;
  const c = Math.max(0, Math.floor(i.co2) - frei) * K.co2_satz_2009;
  const raw = h.amount + c;
  return { annual: floorEur(raw), raw, lines: [h, { label: 'co2', amount: c }], regime: 'b' };
}

function regimeA(i: PkwInput): TaxResult {
  const k = i.altKlasse ?? 'euro3plus';
  const rate = K.alt_saetze[k][i.fuel === 'diesel' ? 1 : 0];
  const raw = per100(i.ccm) * rate;
  return { annual: floorEur(raw), raw, lines: [{ label: 'hubraum', amount: raw }], regime: 'a' };
}

export function pkw(i: PkwInput): TaxResult {
  if (i.ez >= '2021-01-01') {
    const h = hubraum(i.ccm, i.fuel);
    const c = co2Progressive(i.co2);
    const raw = h.amount + c;
    return { annual: floorEur(raw), raw, lines: [h, { label: 'co2', amount: c }], regime: 'c' };
  }
  if (i.ez >= '2009-07-01') return regimeB(i);
  const a = regimeA(i);
  if (i.ez >= '2008-11-05' && i.co2 > 0) {
    const b = regimeB(i);
    if (b.raw < a.raw) return { ...b, regime: 'a/b' };
  }
  return a;
}

/** Taxe au poids des véhicules jusqu'à 3,5 t (§ 9 Abs. 1 Nr. 3), par tranche de 200 kg commencée. */
export function gewichtssteuer(kg: number): number {
  let sum = 0, from = 0;
  for (const [to, rate] of K.gewicht_stufen_bis_3500 as [number, number][]) {
    if (kg <= from) break;
    const span = Math.min(kg, to) - from;
    sum += Math.ceil(span / 200) * rate;
    from = to;
  }
  return sum;
}

const addYears = (iso: string, y: number) => `${Number(iso.slice(0, 4)) + y}${iso.slice(4)}`;

/** Elektro-Pkw : exonération § 3d, puis taxe au poids réduite de moitié. year = année considérée. */
export function elektro(ez: string, kg: number, year: number): TaxResult & { exempt: boolean } {
  const full = gewichtssteuer(Math.min(kg, 3500));
  const raw = full * K.elektro_ermaessigung;
  let exemptUntil: string | undefined;
  if (ez >= K.elektro_ez_von && ez <= K.elektro_ez_bis) {
    const tenYears = addYears(ez, K.elektro_befreiung_jahre);
    exemptUntil = tenYears < K.elektro_befreiung_max ? tenYears : K.elektro_befreiung_max;
  }
  const exempt = !!exemptUntil && `${year}-12-31` <= exemptUntil;
  return { annual: exempt ? 0 : floorEur(raw), raw, lines: [{ label: 'gewicht', amount: full }, { label: 'ermaessigung', amount: -full * K.elektro_ermaessigung }], regime: 'e', exemptUntil, exempt };
}

/** Motorrad : 1,84 € par 25 cm³ commencés. */
export function krad(ccm: number): TaxResult {
  const raw = Math.ceil(Math.max(0, ccm) / 25) * K.krad_je_25ccm;
  return { annual: floorEur(raw), raw, lines: [{ label: 'hubraum', amount: raw }], regime: 'krad' };
}

/** Wohnmobil (§ 9 Abs. 1 Nr. 2a) selon la classe de polluant, par 200 kg commencés. */
export function wohnmobil(kg: number, klasse: 's4' | 's3' | 'sonst'): TaxResult {
  const units = (a: number, b: number) => Math.max(0, Math.ceil((Math.min(kg, b) - a) / 200));
  const W = K.wohnmobil;
  let raw: number;
  if (klasse === 's4' || klasse === 's3') {
    const w = W[klasse];
    raw = Math.min(w.max, units(0, 2000) * w.bis2000 + units(2000, Infinity) * w.ueber2000);
  } else {
    const w = W.sonst;
    raw = units(0, 2000) * w.bis2000 + units(2000, 5000) * w.bis5000 + units(5000, 12000) * w.bis12000 + units(12000, Infinity) * w.ueber12000;
  }
  return { annual: floorEur(raw), raw, lines: [{ label: 'gewicht', amount: raw }], regime: 'wohnmobil' };
}

/** Anhänger (§ 9 Abs. 1 Nr. 5) : 7,46 € par 200 kg commencés, plafond 373,24 €. */
export function anhaenger(kg: number): TaxResult {
  const raw = Math.min(K.anhaenger_max, Math.ceil(Math.max(0, kg) / 200) * K.anhaenger_je_200kg);
  return { annual: floorEur(raw), raw, lines: [{ label: 'gewicht', amount: raw }], regime: 'anhaenger' };
}

/** § 3a : Merkzeichen H, Bl, aG → exonération ; carte orange sans transport gratuit → −50 %. */
export function schwerbehindert(r: TaxResult, art: 'keine' | 'befreit' | 'halb'): TaxResult {
  if (art === 'keine') return r;
  const raw = art === 'befreit' ? 0 : r.raw * K.schwerbehindert_ermaessigung;
  return { ...r, raw, annual: floorEur(raw), lines: [...r.lines, { label: 'schwerbehindert', amount: raw - r.raw }] };
}
