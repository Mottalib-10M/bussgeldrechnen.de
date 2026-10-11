/** Petits outils communs aux mini-simulateurs (fichier ignoré par le registre : préfixe « _ »). */
import { formatMoney, formatPercent, formatNumber } from '../format';
export type L = 'de' | 'en';
export const T = <A>(l: L, de: A, en: A) => (l === 'en' ? en : de);
export const eur = (x: number, l: L, d = 0) => formatMoney(x, d, l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
const MOIS = { de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
/** « März 2027 » / « March 2027 » à partir d'une date ISO. */
export const moisAnnee = (iso: string, l: L) => { const [y, m] = iso.split('-').map(Number); return `${MOIS[l][m - 1]} ${y}`; };
export const moisOptions = (l: L) => MOIS[l].map((m, i) => ({ value: String(i + 1), label: m }));
/** Options Oui/Non et formats communs aux mini-simulateurs du site. */
export const yn = (l: L) => [{ value: '0', label: T(l, 'Nein', 'No') }, { value: '1', label: T(l, 'Ja', 'Yes') }];
export const fvTxt = (m: number, l: L) => (m ? `${m} ${m === 1 ? T(l, 'Monat', 'month') : T(l, 'Monate', 'months')}` : T(l, 'keins', 'none'));
export const probeTxt = (p: 'A' | 'B' | null, l: L) => (p ? T(l, `${p}-Verstoß`, `${p} offence`) : T(l, 'nicht relevant', 'not relevant'));
export const eur2 = (x: number, l: L) => formatMoney(x, x % 1 ? 2 : 0, l);
export const isoDate = (y: number, m: number, d = 1) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
export const yearOptions = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }));
