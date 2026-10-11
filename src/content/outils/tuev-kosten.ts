import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { huCost, huLate } from '../../lib/engine/kosten';
import { formatMoney } from '../../lib/format';

const H = P.hu;
const c = huCost('pkw', true, true), cm = huCost('pkw', true, false), k = huCost('krad', false);
const late9 = huLate(9);
const r = (x: { min: number; max: number }, l: 'de' | 'en') => `${formatMoney(x.min, 0, l)} bis ${formatMoney(x.max, 0, l)}`.replace(' bis ', l === 'de' ? ' bis ' : ' to ');

export default defineGuide({
  id: 'tuev-kosten',
  group: 'rechner',
  order: 60,
  tool: 'tuev',
  related: ['tuev-ueberzogen', 'kfz-steuer-rechner', 'fuehrerschein-kosten', 'bussgeldrechner'],
  sources: ['stvzoAnl8', 'gebost', 'bkatAnlage'],
  de: {
    slug: 'tuev-kosten',
    nav: 'TÜV-Kosten',
    card: 'Nächster HU-Termin, Bußgeld bei Überziehung, amtlicher Gebührenrahmen.',
    title: 'TÜV Kosten 2026: HU-Gebühren, Fristen und Überziehung',
    description: `TÜV Kosten 2026: Gebührenrahmen der HU mit Abgasuntersuchung ${r(c, 'de')} inkl. USt nach GebOSt, nächster Termin nach StVZO, Bußgeld bei überzogener Plakette.`,
    h1: 'TÜV-Kosten und HU-Termin auf einen Blick',
    intro: 'Letzte Prüfung eintragen: der Rechner nennt den nächsten Termin, die Folgen einer Überziehung und den amtlichen Gebührenrahmen.',
    resume: `Die Hauptuntersuchung, umgangssprachlich TÜV, ist für Pkw nach Anlage VIII der StVZO zum ersten Mal ${H.pkw_erst_monate} Monate nach der Erstzulassung fällig und dann alle ${H.pkw_monate} Monate, jeweils bis zum Ende des Monats auf der Plakette. Was sie kostet, hängt davon ab, wer prüft. Bei den amtlich anerkannten Sachverständigen der Technischen Prüfstellen gilt der Gebührenrahmen der GebOSt: für einen Pkw bis 3,5 t ${formatMoney(H.gebuehr_pkw_min, 2, 'de')} bis ${formatMoney(H.gebuehr_pkw_max, 2, 'de')} für die HU, dazu die Abgasuntersuchung mit dem Faktor ${String(H.au_faktor_bei_hu).replace('.', ',')} und die Plakette. Mit Umsatzsteuer ergibt das ${r(c, 'de')} bei einer AU über den OBD-Stecker. Überwachungsorganisationen wie GTÜ oder KÜS legen ihre Entgelte selbst fest. Wer die Frist um mehr als zwei Monate überzieht, zahlt ein Verwarnungsgeld, nach mehr als acht Monaten ${late9.fine} Euro und einen Punkt.`,
    faqs: [
      { q: 'Warum ist die HU bei verschiedenen Prüfstellen unterschiedlich teuer?', a: 'Weil nur die amtlich anerkannten Sachverständigen der Technischen Prüfstellen an den Gebührenrahmen der GebOSt gebunden sind. Überwachungsorganisationen legen ihre Entgelte nach Anlage VIIIb der StVZO in eigener Verantwortung fest, einheitlich im Bereich der jeweiligen Prüfstelle, und müssen sie aushängen. Ein Preisvergleich vor Ort lohnt sich deshalb.' },
      { q: 'Wie berechnet der Rechner den nächsten HU-Termin?', a: `Nach Anlage VIII der StVZO, Abschnitt 2: Die Frist beginnt mit Monat und Jahr der letzten HU oder, beim Neuwagen, der Zuteilung des Kennzeichens. Für Pkw sind es ${H.pkw_erst_monate} Monate bis zur ersten und ${H.pkw_monate} Monate bis zu jeder weiteren Untersuchung, für Motorräder ${H.krad_monate} Monate. Fällig ist die HU bis zum Ende des berechneten Monats.` },
      { q: 'Was kostet eine Hauptuntersuchung beim Motorrad?', a: `Bei einer Technischen Prüfstelle sieht die GebOSt für Krafträder ${formatMoney(H.gebuehr_krad_min, 2, 'de')} bis ${formatMoney(H.gebuehr_krad_max, 2, 'de')} vor, mit Plakette und Umsatzsteuer also ${r(k, 'de')}. Die Untersuchung der Abgasanlage ist bei Motorrädern in der Regel Teil der HU; eine Abgasmessung wie beim Auto rechnet der Rechner hier nicht hinzu.` },
    ],
    body: (h) => `
<h2>Gebührenrahmen der Technischen Prüfstellen</h2>
${h.table(['Leistung', 'GebOSt-Nr.', 'Gebühr netto'], [
  ['HU Pkw und andere Kfz bis 3,5 t', '413.4.1 Sp. 5', `${h.eur(H.gebuehr_pkw_min, 2)} bis ${h.eur(H.gebuehr_pkw_max, 2)}`],
  ['HU Krafträder', '413.3 Sp. 5', `${h.eur(H.gebuehr_krad_min, 2)} bis ${h.eur(H.gebuehr_krad_max, 2)}`],
  ['AU ohne Messung am Endrohr (OBD)', '413.5.1.2', `${h.eur(H.au_ohne_messung_min, 2)} bis ${h.eur(H.au_ohne_messung_max, 2)}`],
  ['AU mit Messung am Endrohr', '413.5.1.1', `${h.eur(H.au_mit_messung_min, 2)} bis ${h.eur(H.au_mit_messung_max, 2)}`],
  ['Prüfplakette', '416', h.eur(H.plakette, 2)],
], 'Gebührentarif der GebOSt; die AU wird bei gemeinsamer Durchführung mit 0,85 multipliziert, Umsatzsteuer kommt hinzu', ['l', 'l', 'r'])}
<p>Bei einer AU mit Messung am Endrohr liegt der Rahmen für den Pkw bei ${r(cm, 'de')}. Quelle ist der ${h.src('gebost', 'Gebührentarif der GebOSt')}; die Fristen stehen in ${h.src('stvzoAnl8', 'Anlage VIII der StVZO')}.</p>
<h2>Wenn die Plakette abgelaufen ist</h2>
<p>Der Katalog ahndet die Überziehung nach Nummer 186: bis zwei Monate kein Verwarnungsgeld, danach gestaffelt bis ${h.eur(late9.fine)} und einem Punkt ab mehr als acht Monaten. Einzelheiten und die Regeln für Fahrzeuge mit Sicherheitsprüfung stehen auf der Seite ${h.a('tuev-ueberzogen', 'TÜV überzogen')}.</p>
<h2>Grenzen des Rechners</h2>
<p>Er kennt keine Mängel: Werden bei der HU erhebliche Mängel festgestellt, ist eine Nachprüfung innerhalb eines Monats nötig, die eigene Gebühren kostet. Gasanlagen, Taxen und Mietwagen haben Zuschläge, die hier fehlen.</p>`,
  },
  en: {
    slug: 'mot-cost-germany',
    nav: 'MOT (HU) cost',
    card: 'Next MOT date, fine for an overdue sticker, official fee range.',
    title: 'MOT Cost Germany 2026: TÜV and HU Fees, Due Dates, Fines',
    description: `MOT (HU, TÜV) cost in Germany 2026: official fee range with emissions test ${r(c, 'en')} incl. VAT, next due date under the StVZO, fine for an overdue sticker.`,
    h1: 'MOT in Germany: HU cost and due date',
    intro: 'Enter your last inspection to get the next due date, the consequences of being late and the official fee range.',
    resume: `Germany's roadworthiness test is the Hauptuntersuchung (HU), usually just called TÜV after one of the organisations that carry it out. Under annex VIII of the vehicle registration rules (StVZO), a car's first HU is due ${H.pkw_erst_monate} months after first registration and then every ${H.pkw_monate} months, by the end of the month shown on the round sticker on the rear plate. The price depends on who does the test. Official experts at the Technische Prüfstellen charge within the fee range of the GebOSt schedule: ${formatMoney(H.gebuehr_pkw_min, 2, 'en')} to ${formatMoney(H.gebuehr_pkw_max, 2, 'en')} for a car up to 3.5 tonnes, plus the emissions test (AU) multiplied by ${H.au_faktor_bei_hu} and the sticker. With 19 per cent VAT that comes to ${r(c, 'en')} with an AU through the on-board diagnostics port. Private inspection organisations such as GTÜ or KÜS set their own prices. Being more than two months late brings a fine, and after eight months ${late9.fine} euros and a point.`,
    faqs: [
      { q: 'Does my car registered abroad need a German HU when I move?', a: 'When you register a car in Germany that was previously registered abroad, the HU period starts from the date of an inspection under German rules (StVZO annex VIII, no. 2.3), which the registration process usually requires. Ask the registration office which documents it accepts, since the exact steps depend on the vehicle and its papers.' },
      { q: 'Why do HU prices differ between test centres in Germany?', a: 'Only the official experts of the Technische Prüfstellen are bound by the fee range in the GebOSt schedule. Private inspection organisations set their charges themselves under annex VIIIb of the StVZO, uniformly within each test-centre area, and must display them. Comparing local prices before booking can save money.' },
      { q: 'How is the next HU date worked out?', a: `Under annex VIII no. 2.1 and 2.3 StVZO the period starts with the month and year of the last HU, or for a new car the month the number plate was issued. Cars get ${H.pkw_erst_monate} months to the first test and ${H.pkw_monate} months between later tests, motorbikes ${H.krad_monate} months. The test is due by the end of the resulting month.` },
    ],
    body: (h) => `
<h2>The official fee range</h2>
${h.table(['Service', 'GebOSt no.', 'Fee before VAT'], [
  ['HU for cars and vehicles up to 3.5 t', '413.4.1 col. 5', `${h.eur(H.gebuehr_pkw_min, 2)} to ${h.eur(H.gebuehr_pkw_max, 2)}`],
  ['HU for motorbikes', '413.3 col. 5', `${h.eur(H.gebuehr_krad_min, 2)} to ${h.eur(H.gebuehr_krad_max, 2)}`],
  ['Emissions test via OBD port', '413.5.1.2', `${h.eur(H.au_ohne_messung_min, 2)} to ${h.eur(H.au_ohne_messung_max, 2)}`],
  ['Emissions test with tailpipe measurement', '413.5.1.1', `${h.eur(H.au_mit_messung_min, 2)} to ${h.eur(H.au_mit_messung_max, 2)}`],
  ['Inspection sticker', '416', h.eur(H.plakette, 2)],
], 'GebOSt fee schedule; done together with the HU, the emissions test is multiplied by 0.85; VAT is added', ['l', 'l', 'r'])}
<p>With a tailpipe measurement the range for a car is ${r(cm, 'en')}. Sources: the ${h.src('gebost', 'GebOSt fee schedule')} and ${h.src('stvzoAnl8', 'StVZO annex VIII')} for the intervals.</p>
<h2>When the sticker has run out</h2>
<p>Catalogue number 186 sets no fine for up to two months overdue, then rising steps up to ${h.eur(late9.fine)} and one point after more than eight months. The ${h.a('tuev-ueberzogen', 'overdue MOT page')} explains the steps.</p>
<h2>What the calculator leaves out</h2>
<p>Defects: if significant defects are found, a re-inspection within a month is needed and charged separately. Surcharges for gas systems, taxis and hire cars are not included.</p>`,
  },
});
