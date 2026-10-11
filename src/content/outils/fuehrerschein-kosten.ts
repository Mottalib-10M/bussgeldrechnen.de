import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { licenceFees } from '../../lib/engine/kosten';
import { formatMoney } from '../../lib/format';

const F = P.fuehrerschein;
const b1 = licenceFees('B'), b3 = licenceFees('B', 2, 2), a1 = licenceFees('A');
const eD = (x: number) => formatMoney(x, 2, 'de'), eE = (x: number) => formatMoney(x, 2, 'en');

export default defineGuide({
  id: 'fuehrerschein-kosten',
  group: 'rechner',
  order: 50,
  tool: 'fuehrerschein',
  related: ['fuehrerschein-umschreiben', 'probezeit-fuehrerschein', 'mpu', 'tuev-kosten', 'kfz-steuer-rechner'],
  sources: ['gebost', 'fev31', 'stvg2a'],
  de: {
    slug: 'fuehrerschein-kosten',
    nav: 'Führerschein-Kosten',
    card: 'Amtliche Gebühren und Ihre Fahrschulpreise, zusammengerechnet.',
    title: 'Führerschein Kosten 2026: amtliche Gebühren und Fahrschule',
    description: `Führerschein Kosten 2026: amtliche Gebühren für Klasse B ${eD(b1.total)} bei je einem Prüfungsversuch, dazu Ihre Fahrschulpreise. Rechner nach der GebOSt 2026.`,
    h1: 'Was der Führerschein kostet, Posten für Posten',
    intro: 'Feste Gebühren und freie Fahrschulpreise getrennt: der Rechner addiert beides und zeigt, was eine Wiederholungsprüfung ausmacht.',
    resume: `Beim Führerschein steht nur ein kleiner Teil der Kosten wirklich fest: die Gebühren von Fahrerlaubnisbehörde und Prüfstelle, die die Gebührenordnung für Maßnahmen im Straßenverkehr (GebOSt) festlegt. Für die Klasse B sind das ${formatMoney(F.antrag_pruefung, 2, 'de')} für die Prüfung des Antrags, ${formatMoney(F.ersterteilung, 2, 'de')} für die Erteilung, ${formatMoney(F.theorie, 2, 'de')} plus ${formatMoney(F.theorie_pc, 2, 'de')} für die Theorieprüfung am PC und ${formatMoney(F.praxis_b, 2, 'de')} für die praktische Prüfung, zusammen ${eD(b1.total)} bei je einem Versuch. Jede Wiederholung kostet die Prüfungsgebühr erneut. Den weit größeren Teil machen die Fahrschule und die Pflichten davor aus: Grundbetrag, Übungsstunden, zwölf Sonderfahrten, Vorstellung zur Prüfung, Sehtest, Erste-Hilfe-Kurs und Passbild. Diese Preise sind frei kalkuliert und regional verschieden. Der Rechner fragt sie deshalb ab, statt einen Durchschnitt zu erfinden, und zeigt die amtlichen Gebühren getrennt.`,
    faqs: [
      { q: 'Welche Führerschein-Gebühren sind gesetzlich festgelegt?', a: `Die der Behörde und der Prüfstelle nach der GebOSt: ${formatMoney(F.antrag_pruefung, 2, 'de')} Antragsprüfung, ${formatMoney(F.ersterteilung, 2, 'de')} Ersterteilung, ${formatMoney(F.theorie, 2, 'de')} Theorieprüfung zuzüglich ${formatMoney(F.theorie_pc, 2, 'de')} für die Prüfung am PC und ${formatMoney(F.praxis_b, 2, 'de')} für die praktische Prüfung Klasse B, jeweils laut Gebührentarif. Fahrschulen legen ihre Preise selbst fest und müssen sie aushängen.` },
      { q: 'Was kostet eine nicht bestandene Führerscheinprüfung?', a: `Bei der Theorie ${formatMoney(F.theorie + F.theorie_pc, 2, 'de')} Prüfgebühr je Versuch, bei der Praxis Klasse B ${formatMoney(F.praxis_b, 2, 'de')}, dazu der Betrag, den Ihre Fahrschule für die Vorstellung zur Prüfung verlangt, und meist weitere Übungsstunden. Mit je zwei Versuchen steigen allein die amtlichen Gebühren auf ${eD(b3.total)}. Stellen Sie im Rechner die Zahl der Versuche ein, um Ihren Fall zu sehen.` },
      { q: 'Ist der Motorradführerschein bei den Gebühren teurer?', a: `Ja, die praktische Prüfung für die Klassen A, A2 und A1 kostet nach dem Gebührentarif der GebOSt ${formatMoney(F.praxis_a, 2, 'de')} statt ${formatMoney(F.praxis_b, 2, 'de')}. Mit Antrag, Erteilung und Theorie ergeben sich ${eD(a1.total)} bei je einem Versuch. Wer im Stufenaufstieg von A2 auf A wechselt, zahlt für die praktische Prüfung einen eigenen, ermäßigten Satz.` },
    ],
    body: (h) => `
<h2>Die amtlichen Gebühren im Überblick</h2>
${h.table(['Posten', 'GebOSt-Nr.', 'Gebühr'], [
  ['Prüfung des Antrags', '201', h.eur(F.antrag_pruefung, 2)],
  ['Erteilung der Fahrerlaubnis', '202.1', h.eur(F.ersterteilung, 2)],
  ['Theorieprüfung je Versuch, zzgl. PC', '401.1 / 401.3', `${h.eur(F.theorie, 2)} + ${h.eur(F.theorie_pc, 2)}`],
  ['Praktische Prüfung Klasse B', '402.3', h.eur(F.praxis_b, 2)],
  ['Praktische Prüfung Klasse A, A2, A1', '402.1', h.eur(F.praxis_a, 2)],
  ['Praktische Prüfung Klasse AM', '402.8', h.eur(F.praxis_am, 2)],
], 'Gebührentarif der GebOSt, Stand 12.8.2026', ['l', 'l', 'r'])}
<p>Quelle ist der ${h.src('gebost', 'Gebührentarif der GebOSt')}. Für die Umschreibung eines Führerscheins aus einem anderen Staat gelten eigene Sätze; sie stehen auf der Seite zum ${h.a('fuehrerschein-umschreiben', 'Führerschein umschreiben')}.</p>
<h2>Was Sie selbst eintragen</h2>
<p>Grundbetrag, Preis je Übungsstunde und Sonderfahrt, Vorstellung zur Prüfung: Diese Werte stehen im Preisaushang jeder Fahrschule. Die Zahl der Übungsstunden hängt vom Lernfortschritt ab; die zwölf Sonderfahrten der Klasse B (Überland, Autobahn, Nacht) sind Pflicht. Sehtest, Erste-Hilfe-Kurs und Passbild fassen Sie im letzten Feld zusammen. Geht der Führerschein später verloren, kostet der Ersatz nach Nr. 202.4 GebOSt zwischen ${h.eur(F.ersatz_min, 2)} und ${h.eur(F.ersatz_max, 2)}, je nach Aufwand der Behörde.</p>
<h2>Danach</h2>
<p>Mit dem ersten Führerschein beginnt die zweijährige ${h.a('probezeit-fuehrerschein', 'Probezeit')} mit null Promille. Wer später ein eigenes Auto anmeldet, rechnet mit Kfz-Steuer und ${h.a('tuev-kosten', 'Hauptuntersuchung')}.</p>`,
  },
  en: {
    slug: 'driving-licence-cost',
    nav: 'Driving licence cost',
    card: 'Official fees plus your driving school prices, added up.',
    title: 'Driving Licence Cost Germany 2026: Fees and School Prices',
    description: `Driving licence cost in Germany 2026: official class B fees ${eE(b1.total)} with one attempt per test, plus your own driving school prices. Based on the GebOSt.`,
    h1: 'What a German driving licence costs, item by item',
    intro: 'Fixed official fees and free-market driving school prices, kept apart and added up, including what a retake adds.',
    resume: `Only a small part of the cost of a German driving licence is fixed by law: the fees of the licensing authority and the testing body, set in the road traffic fee schedule (GebOSt). For a class B car licence these are ${formatMoney(F.antrag_pruefung, 2, 'en')} for checking the application, ${formatMoney(F.ersterteilung, 2, 'en')} for issuing it, ${formatMoney(F.theorie, 2, 'en')} plus ${formatMoney(F.theorie_pc, 2, 'en')} for the computer-based theory test and ${formatMoney(F.praxis_b, 2, 'en')} for the practical test, ${eE(b1.total)} with one attempt at each. Every retake charges the test fee again. Most of the money goes to the driving school and the steps before the test: base fee, practice lessons, twelve mandatory special drives, presentation for the test, eye test, first-aid course and photo. Those prices are set freely and differ by region, so the calculator asks for them instead of inventing an average.`,
    faqs: [
      { q: 'Do I have to go to a German driving school as an adult beginner?', a: 'For a first licence, yes: German rules require training at a licensed driving school, including the special drives for class B, before you can take the practical test. People who already hold a licence from another country follow different rules, which depend on the country; our page on exchanging a foreign licence explains them.' },
      { q: 'How much does a failed German driving test cost?', a: `The test fee is charged again for each attempt: ${formatMoney(F.theorie + F.theorie_pc, 2, 'en')} for the theory test and ${formatMoney(F.praxis_b, 2, 'en')} for the class B practical test, plus whatever your driving school charges for presenting you and, usually, extra lessons. With two attempts at each, the official fees alone come to ${eE(b3.total)}.` },
      { q: 'What does a replacement German licence cost if I lose mine?', a: `The authority charges ${formatMoney(F.ersatz_min, 2, 'en')} to ${formatMoney(F.ersatz_max, 2, 'en')} for a replacement under no. 202.4 of the GebOSt fee schedule, depending on its effort, plus the cost of a new photo. A lost licence must be reported without delay and a replacement document obtained; failing to do so is listed in the fine catalogue as number 168a with a 10-euro warning fine.` },
    ],
    body: (h) => `
<h2>The official fees</h2>
${h.table(['Item', 'GebOSt no.', 'Fee'], [
  ['Checking the application', '201', h.eur(F.antrag_pruefung, 2)],
  ['Issuing the licence', '202.1', h.eur(F.ersterteilung, 2)],
  ['Theory test per attempt, plus computer test', '401.1 / 401.3', `${h.eur(F.theorie, 2)} + ${h.eur(F.theorie_pc, 2)}`],
  ['Practical test, class B', '402.3', h.eur(F.praxis_b, 2)],
  ['Practical test, classes A, A2, A1', '402.1', h.eur(F.praxis_a, 2)],
  ['Practical test, class AM', '402.8', h.eur(F.praxis_am, 2)],
], 'Fee schedule (GebOSt) as of 12 August 2026', ['l', 'l', 'r'])}
<p>Source: the ${h.src('gebost', 'GebOSt fee schedule')}. Exchanging a licence from another country has its own fees, listed on the page about ${h.a('fuehrerschein-umschreiben', 'exchanging a foreign licence')}.</p>
<h2>What you enter yourself</h2>
<p>Base fee, price per lesson and per special drive, and the charge for presentation at the test are on every driving school's price list. The number of lessons depends on your progress; the twelve special drives for class B (country roads, motorway, night) are mandatory. Group the eye test, first-aid course and photo in the last field.</p>
<h2>After the test</h2>
<p>A first licence starts a two-year ${h.a('probezeit-fuehrerschein', 'probation period')} with zero alcohol. Owning a car later brings vehicle tax and the ${h.a('tuev-kosten', 'MOT (HU)')} every two years.</p>`,
  },
});
