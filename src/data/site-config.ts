/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://de-verkehr.example";
export const SITE_NAMES: Record<string, string> = {"de": "Bußgeld & Kfz 2026", "en": "German Traffic Fines"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
/** Une locale par langue (RECETTE §4) : « 1.234 € » en allemand, « €1,234 » en anglais. */
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const LOCALE_TAG = 'de-DE';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-11';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber eines unabhängigen Bußgeld- und Kfz-Steuer-Rechners für Deutschland", "en": "Publisher of an independent German traffic-fine and vehicle-tax calculator"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners liest die Bußgeldkatalog-Verordnung, die Anlagen 12 und 13 der Fahrerlaubnis-Verordnung und das Kraftfahrzeugsteuergesetz im amtlichen Wortlaut und rechnet daraus Bußgeld mit Gebühren, Punkte in Flensburg, Fahrverbot, Probezeitfolgen und Kfz-Steuer. Die Steuerberechnung stimmt in 21 Vergleichsfällen mit dem Rechner des Bundesfinanzministeriums überein; Kanzleien vermittelt die Website nicht.", "en": "Radif Partners reads Germany's Fine Catalogue Ordinance, annexes 12 and 13 of the Driving Licence Ordinance and the Motor Vehicle Tax Act in their official wording and turns them into fines with fees, Flensburg points, driving bans, probation consequences and vehicle tax, in German and English. The tax engine matches the Federal Finance Ministry calculator in 21 test cases, and the site refers no one to law firms."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Bußgeldkatalog-Verordnung", "Fahreignungs-Bewertungssystem", "Kraftfahrzeugsteuergesetz", "Fahrerlaubnis auf Probe"], "en": ["German fine catalogue (BKatV)", "Flensburg points system", "German vehicle tax (KraftStG)", "Probationary licence"]};
export const CONTACT_EMAIL = "contact@de-verkehr.example";
export const THEME_COLOR = '#A3121B';
export const LOGO_SYMBOL = 'BK';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = '9c3e7a1f5b2d48e6a0f4c8b1d7e3a592';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
