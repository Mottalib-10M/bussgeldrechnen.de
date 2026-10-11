import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsrichtlinien', contactLabel: 'Kontakt', reviewedBy: 'Geprüft von',
  skipToContent: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrumennavigation', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Passende Seiten und Rechner', sourcesTitle: 'Quellen', writtenBy: 'Verfasst von',
  asOf: 'Rechtsstand', lastUpdated: 'geprüft am', footerValidated: 'Grundlage: BKatV, FeV, StVG, KraftStG, GebOSt im amtlichen Wortlaut', footerBrowser: 'Rechnet nur in Ihrem Browser · keine Datenübertragung · kostenlos',
  footerDisclaimer: 'Unabhängige Website von Radif Partners, ohne Verbindung zu Behörden, Polizei, Kanzleien, Versicherern oder Fahrschulen. Allgemeine Information und Berechnung nach den amtlichen Regelsätzen: Die Ergebnisse sind unverbindlich, ersetzen keine Rechtsberatung im Einzelfall und keine Prüfung Ihres Bescheids. Wir geben keine Daten weiter und vermitteln keine Anwälte.', footerPopular: '', notFound: 'Diese Seite gibt es nicht.',
  readMore: 'Weiterlesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculators', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Legal status', lastUpdated: 'checked on', footerValidated: 'Based on the official texts of BKatV, FeV, StVG, KraftStG and GebOSt', footerBrowser: 'Runs only in your browser · no data sent · free',
  footerDisclaimer: 'Independent website published by Radif Partners, not linked to any authority, police force, law firm, insurer or driving school. General information and calculations based on the official standard rates, not legal advice on an individual case and no review of your notice. We share no data and refer no one to lawyers.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
