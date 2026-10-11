import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, fees } from '../../lib/engine/bkat';
import { huLate, monthsLate, nextHu } from '../../lib/engine/kosten';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, H = P.hu;
const s2 = huLate(3), s3 = huLate(6), s4 = huLate(9);
const sp = ['186.1.1', '186.1.2', '186.1.3', '186.1.4'].map((nr) => entry(nr));
const pAb = H.ueberzogen_punkt_ab_monate;
const frei = (H.ueberzogen as [number, number][])[0][0];
/** StVZO Anlage VIII Nr. 2.1 und 2.2 : weitere Fristen in Monaten (nicht in params, direkt aus der Anlage gelesen). */
const A8 = { taxi: 12, kranken: 12, lkw35: 24, anh35: 24, wm75Erst: 72, wm75: 24, wm75Danach: 12, wm75plus: 12, miete: 12, mieteLangPkw: 36 };
const due = '2026-03', check = '2026-10';
const late = monthsLate(due, check), lateR = huLate(late);
const nextAfter = nextHu('2026-10', 'pkw', false);
const tot = (fine: number) => fine + fees(fine).total;
const m = (x: number, l: 'de' | 'en', d = 0) => formatMoney(x, d, l);
const ym = (s: string, l: 'de' | 'en') => {
  const [y, mo] = s.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString(l === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export default defineGuide({
  id: 'tuev-ueberzogen',
  group: 'kosten',
  order: 10,
  mini: 'tuevspaet',
  miniHref: 'tuev-kosten',
  related: ['tuev-kosten', 'bussgeldrechner', 'punkte-in-flensburg', 'probezeit-fuehrerschein', 'umweltzone', 'kfz-steuer'],
  sources: ['bkatAnlage', 'stvzoAnl8', 'fevAnl13', 'fevAnl12'],
  de: {
    slug: 'tuev-ueberzogen',
    nav: 'TÜV überzogen',
    card: 'Zwei Monate ohne Folgen, dann Verwarnungsgeld, ab mehr als acht Monaten ein Punkt.',
    title: 'TÜV überzogen 2026: Bußgeld, Punkt und Fristen der HU',
    description: `TÜV überzogen 2026: bis ${frei} Monate kein Bußgeld, danach ${s2.fine} € und ${s3.fine} €, nach mehr als ${pAb} Monaten ${s4.fine} € und ein Punkt. Fristen der HU nach StVZO Anlage VIII.`,
    h1: 'TÜV überzogen: was eine abgelaufene Plakette kostet',
    intro: 'Wer die Hauptuntersuchung verpasst, hat zwei Monate Spielraum ohne Bußgeld; danach steigt der Betrag in drei Stufen.',
    resume: `Wer die Hauptuntersuchung überzieht, zahlt nach dem Bußgeldkatalog 2026 bis zu ${frei} Monate nach Ablauf der Plakette nichts. Bei mehr als zwei bis vier Monaten sind es ${s2.fine} Euro, bei mehr als vier bis acht Monaten ${s3.fine} Euro, beides als Verwarnungsgeld ohne Gebühren. Nach mehr als ${pAb} Monaten werden ${s4.fine} Euro und ein Punkt in Flensburg fällig, mit Bescheidkosten ${m(tot(s4.fine), 'de', 2)}. Verantwortlich ist der Halter, nicht der Fahrer. Strenger ist die Staffel für Fahrzeuge, die zusätzlich zur Sicherheitsprüfung müssen, etwa schwere Lkw und Busse: Dort kosten schon bis zwei Monate ${sp[0].fine} Euro, und der Punkt kommt nach mehr als vier Monaten. Fällig ist die HU nach Anlage VIII der StVZO am Ende des Monats, den die Prüfplakette am hinteren Kennzeichen zeigt; beim Pkw zuerst ${H.pkw_erst_monate} Monate nach der Zulassung, dann alle ${H.pkw_monate} Monate.`,
    faqs: [
      { q: 'Bekommt man für überzogenen TÜV einen Punkt in Flensburg?', a: `Erst wenn der Vorführtermin um mehr als ${pAb} Monate überschritten ist. Dann sieht der Katalog für Pkw und andere Fahrzeuge ohne Sicherheitsprüfung ${s4.fine} Euro und einen Punkt vor. Bei Fahrzeugen mit Sicherheitsprüfung, etwa schweren Lkw, gibt es den Punkt schon nach mehr als vier Monaten. In der Probezeit zählt der Verstoß als B-Verstoß nach Anlage 12 FeV.` },
      { q: 'Muss der Halter oder der Fahrer zahlen, wenn die HU abgelaufen ist?', a: `Der Halter. Der Bußgeldkatalog beschreibt den Verstoß so, dass jemand als Halter sein Fahrzeug nicht zur Hauptuntersuchung vorgeführt hat. Wer sich das Auto eines Freundes leiht, ist also nicht der Adressat dieses Tatbestands. Bei Firmenwagen trifft die Pflicht das Unternehmen, auf das das Fahrzeug zugelassen ist. Die Beträge reichen von ${s2.fine} bis ${s4.fine} Euro.` },
      { q: 'Verschiebt sich der nächste TÜV-Termin, wenn ich zu spät zur HU gehe?', a: `Nein, zu spät zu kommen bringt keinen Vorteil. Nach Anlage VIII der StVZO beginnt die neue Frist mit Monat und Jahr der letzten Hauptuntersuchung, also mit dem Monat, in dem die verspätete HU stattfand. Wer im ${ym(check, 'de')} statt im ${ym(due, 'de')} prüfen lässt, hat beim Pkw den nächsten Termin im ${ym(nextAfter, 'de')}.` },
      { q: 'Was gilt für die HU beim Saisonkennzeichen?', a: 'Fällt die Hauptuntersuchung in die Zeit außerhalb des Betriebszeitraums, ist sie nach Anlage VIII der StVZO im ersten Monat des nächsten Betriebszeitraums durchzuführen. Wer ein Cabrio nur von April bis Oktober angemeldet hat und eine HU im Januar fällig wäre, lässt sie also im April machen. Ein Bußgeld wegen Überziehung entsteht in dieser Zeit nicht.' },
      { q: 'Muss ein abgemeldetes Auto zur Hauptuntersuchung?', a: 'Nicht, solange es außer Betrieb gesetzt ist. Anlage VIII der StVZO lässt die Untersuchungspflicht ruhen, solange die Zulassungsbehörde die Außerbetriebsetzung in der Zulassungsbescheinigung vermerkt und das Kennzeichen entstempelt hat. War in dieser Zeit eine HU fällig, ist sie bei der Wiederinbetriebnahme nachzuholen, bevor das Fahrzeug wieder fährt.' },
    ],
    body: (h) => `
<h2>Die Staffel nach Nummer 186</h2>
<p>Der Bußgeldkatalog unterscheidet zwei Gruppen. Nummer 186.2 gilt für alle Fahrzeuge, die nach Anlage VIII der StVZO keine Sicherheitsprüfung brauchen, also vor allem Pkw, Motorräder, leichte Lkw, Wohnmobile bis 3,5 t und kleine Anhänger. Nummer 186.1 gilt für Fahrzeuge, die zwischen den Hauptuntersuchungen zusätzlich zur Sicherheitsprüfung müssen, etwa Busse, Lkw über 7,5 t und schwere Anhänger. Für sie ist die Staffel eine Stufe strenger.</p>
${h.table(['Überziehung', 'Ohne Sicherheitsprüfung (186.2)', 'Punkte', 'Mit Sicherheitsprüfung (186.1)', 'Punkte'], [
  [`bis ${frei} Monate`, h.eur(huLate(frei).fine), huLate(frei).points, h.eur(sp[0].fine!), sp[0].points],
  ['mehr als 2 bis 4 Monate', h.eur(s2.fine), s2.points, h.eur(sp[1].fine!), sp[1].points],
  ['mehr als 4 bis 8 Monate', h.eur(s3.fine), s3.points, h.eur(sp[2].fine!), sp[2].points],
  [`mehr als ${pAb} Monate`, h.eur(s4.fine), s4.points, h.eur(sp[3].fine!), sp[3].points],
], 'Regelsätze nach BKat-Nr. 186.1 und 186.2; ohne Gebühren', ['l', 'r', 'r', 'r', 'r'])}
<p>Bis ${h.eur(V.verwarnung_max)} handelt es sich um ein Verwarnungsgeld ohne Gebühren. Beim Pkw ist das bis acht Monate der Fall. Erst die letzte Stufe mit ${h.eur(s4.fine)} führt zu einem Bußgeldbescheid; mit Gebühr und Zustellung sind dann ${h.eur(tot(s4.fine), 2)} zu zahlen. Bei Fahrzeugen mit Sicherheitsprüfung sind es nach mehr als vier Monaten ${h.eur(tot(sp[2].fine!), 2)}, nach mehr als acht ${h.eur(tot(sp[3].fine!), 2)}. Quelle der Beträge ist die ${h.src('bkatAnlage', 'Anlage zur Bußgeldkatalog-Verordnung')}.</p>

<h2>Wann die HU fällig ist</h2>
<p>Die Fristen stehen in ${h.src('stvzoAnl8', 'Anlage VIII der StVZO')}, Nummer 2.1. Für die häufigsten Fahrzeuge:</p>
${h.table(['Fahrzeug', 'Erste HU', 'Danach'], [
  ['Pkw', `${H.pkw_erst_monate} Monate`, `${H.pkw_monate} Monate`],
  ['Pkw als Taxi oder Mietwagen mit Fahrer', `${A8.taxi} Monate`, `${A8.taxi} Monate`],
  ['Krankenwagen bis acht Fahrgastplätze', `${A8.kranken} Monate`, `${A8.kranken} Monate`],
  ['Motorrad', `${H.krad_monate} Monate`, `${H.krad_monate} Monate`],
  ['Lkw bis 3,5 t', `${A8.lkw35} Monate`, `${A8.lkw35} Monate`],
  ['Wohnmobil bis 3,5 t', `${H.wohnmobil_35_erst} Monate`, `${H.wohnmobil_35} Monate`],
  ['Wohnmobil über 3,5 bis 7,5 t', `${A8.wm75} Monate in den ersten ${A8.wm75Erst} Monaten`, `${A8.wm75Danach} Monate`],
  ['Anhänger bis 0,75 t oder ohne eigene Bremse', `${H.anhaenger_750_erst} Monate`, `${H.anhaenger_750} Monate`],
  ['Anhänger über 0,75 bis 3,5 t', `${A8.anh35} Monate`, `${A8.anh35} Monate`],
], 'StVZO Anlage VIII Nr. 2.1; gewerblich ohne Fahrer vermietete Fahrzeuge in der Regel 12 Monate (Nr. 2.2)', ['l', 'r', 'r'])}
<p>Die Frist beginnt nach Nummer 2.3 mit Monat und Jahr der letzten Hauptuntersuchung. Beim Neufahrzeug zählt der Monat, in dem das amtliche Kennzeichen zugeteilt wurde, nicht aber ein Kurzzeitkennzeichen. Sie endet mit Ablauf des Monats, den die Prüfplakette zeigt. Weist die Plakette Dezember 2026 aus, ist die HU also bis zum 31. Dezember 2026 fällig. Der ${h.a('tuev-kosten', 'TÜV-Rechner')} ermittelt den Monat aus der letzten Prüfung.</p>

<h2>Gewerblich vermietete Fahrzeuge</h2>
<p>Nummer 2.2 der Anlage enthält eine Sonderregel, die viele übersehen. Werden Fahrzeuge ohne Fahrer gewerbsmäßig vermietet, ohne für den Mieter zugelassen zu sein, beträgt die Frist ${A8.miete} Monate. Bei einer Mindestmietdauer von einem Jahr gilt für Pkw wieder die Frist von ${A8.mieteLangPkw} Monaten und für Lkw bis 3,5 t die von 24 Monaten. Wird der Vertrag später auf weniger als ein Jahr verkürzt, gelten wieder ${A8.miete} Monate.</p>

<h2>Ein Rechenbeispiel</h2>
<p>Die Plakette weist den ${ym(due, 'de')} aus; die HU war also bis zum Ende dieses Monats fällig. Der Halter fährt im ${ym(check, 'de')} zur Prüfstelle. Nach der Zählweise unseres Rechners sind das ${late} Monate Überziehung, Stufe 186.2.2 mit ${h.eur(lateR.fine)} und ${lateR.points} Punkten, als Verwarnungsgeld. Wäre er erst einen Monat nach Ablauf der Achtmonatsgrenze gekommen, hätte er ${h.eur(s4.fine)} und einen Punkt riskiert. Die neue Frist beginnt mit dem Monat der verspäteten HU: Der nächste Termin liegt im ${ym(nextAfter, 'de')}. Zu spät zu kommen verschiebt den Rhythmus also, ohne Zeit zu gewinnen.</p>

<h2>Was die Prüfung ergeben kann</h2>
<p>Anlage VIII Nummer 3.1.4 regelt, was nach der Untersuchung geschieht, und das hat direkte Folgen für die Frist:</p>
<ul>
<li><strong>Keine Mängel:</strong> Das Fahrzeug bekommt eine neue Prüfplakette.</li>
<li><strong>Geringe Mängel:</strong> Sie werden im Bericht eingetragen; eine Plakette kann trotzdem zugeteilt werden. Der Halter muss die Mängel unverzüglich, spätestens innerhalb eines Monats, beheben lassen.</li>
<li><strong>Erhebliche Mängel:</strong> Keine Plakette. Das Fahrzeug ist spätestens einen Monat nach dem Tag der HU zur Nachprüfung vorzuführen, mit dem Untersuchungsbericht. Wer später kommt oder den Bericht nicht vorlegt, bekommt statt der Nachprüfung eine neue Hauptuntersuchung.</li>
<li><strong>Gefährliche Mängel:</strong> Ebenfalls keine Plakette, zusätzlich ein ausdrücklicher Hinweis auf die Gefahr. Auch hier gilt ein Monat für die Nachprüfung.</li>
<li><strong>Verkehrsunsicher:</strong> Die vorhandene Plakette wird entfernt, die Zulassungsbehörde wird benachrichtigt, und das Fahrzeug darf auf öffentlichen Straßen nicht mehr in Betrieb gesetzt werden.</li>
</ul>
<p>Die Untersuchung der Abgase darf nach Nummer 3.1.1.1 frühestens einen Monat vor der HU stattfinden, wenn sie als eigenständiger Teil etwa in einer anerkannten Werkstatt gemacht wird.</p>

<h2>Was eine Sicherheitsprüfung ist</h2>
<p>Die strengere Staffel der Nummer 186.1 hängt an einem Begriff aus Nummer 1.3.1 der Anlage VIII. Die Sicherheitsprüfung ist eine Sicht-, Wirkungs- und Funktionsprüfung von Fahrgestell, Fahrwerk, Verbindungseinrichtung, Lenkung, Reifen, Rädern und Bremsanlage. Sie findet zwischen zwei Hauptuntersuchungen statt, bei Lkw über 7,5 t nach den ersten Jahren etwa alle sechs Monate, bei Bussen je nach Alter in kürzeren Abständen. Ihr Termin steht auf einer eigenen Prüfmarke mit SP-Schild. Wer einen Pkw fährt, hat damit nichts zu tun; für ihn gilt stets Nummer 186.2.</p>

<h2>Ehemalige Mietwagen und Gebrauchtkauf</h2>
<p>Wer einen jungen Gebrauchtwagen kauft, der vorher gewerblich vermietet wurde, sollte die Plakette besonders genau ansehen. Während der Vermietung galt die Frist von ${A8.miete} Monaten, und die erste HU kann deshalb schon nach einem Jahr stattgefunden haben. Wechselt der Halter innerhalb der ersten sieben Monate nach der Erstzulassung und nach dieser HU, gilt für die zweite Hauptuntersuchung nach Nummer 2.1.2.1.1 wieder die Frist von ${H.pkw_erst_monate} Monaten. Maßgeblich bleibt, was auf der Plakette steht. Mit der Zulassung auf den neuen Halter geht auch die Pflicht über, das Fahrzeug rechtzeitig vorzuführen.</p>

<h2>Was im Untersuchungsbericht steht</h2>
<p>Nach Nummer 3.1.5.1 enthält der Bericht unter anderem das Kennzeichen, Monat und Jahr der letzten HU, den Kilometerstand, Datum und Ort der Untersuchung, festgestellte Mängel mit ihrer Einstufung, die Entscheidung über die Plakette, eine etwaige Wiedervorführpflicht, die Entgelte und den Monat, in dem die nächste HU fällig wird. Zeigt der Wegstreckenzähler weniger an als bei der letzten HU dokumentiert und ist kein Tausch des Zählers nachgewiesen, meldet der Prüfer das über das Kraftfahrt-Bundesamt an die Zulassungsbehörde (Nummer 3.1.4.8). Den Bericht sollte man aufbewahren: Ohne ihn gibt es bei erheblichen Mängeln keine Nachprüfung, sondern eine neue HU.</p>

<h2>Abgemeldet, Saisonkennzeichen, Import</h2>
<p>Drei Lagen verändern den Fälligkeitstermin. Ist das Fahrzeug außer Betrieb gesetzt, ruht die Untersuchungspflicht nach Nummer 2.7; war in dieser Zeit eine HU fällig, wird sie bei Wiederinbetriebnahme nachgeholt. Beim Saisonkennzeichen wird eine HU, die außerhalb des Betriebszeitraums fällig wäre, nach Nummer 2.6 im ersten Monat des nächsten Zeitraums gemacht. Und bei Fahrzeugen, die vorher im Ausland zugelassen waren oder wieder zugelassen werden, beginnt die Frist nach Nummer 2.3 mit dem Monat der Begutachtung nach § 21 StVZO oder einer Hauptuntersuchung.</p>

<h2>Punkte und Probezeit</h2>
<p>Der Punkt nach mehr als ${pAb} Monaten kommt aus ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')}. Er wird mit der Rechtskraft des Bescheids eingetragen und nach zweieinhalb Jahren tilgungsreif; wie das System zählt, zeigt der Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}. In der Probezeit gilt der Verstoß als B-Verstoß nach ${h.src('fevAnl12', 'Anlage 12 FeV')}; zwei B-Verstöße führen zum Aufbauseminar, wie die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')} erklärt. Weil der Verstoß den Halter trifft, kann auch jemand einen Punkt bekommen, der das Auto in diesen Monaten gar nicht selbst gefahren hat.</p>

<h2>Prüfplakette und Umweltplakette</h2>
<p>Die Prüfplakette auf dem hinteren Kennzeichen weist Monat und Jahr der nächsten Hauptuntersuchung aus; nur sie zählt für die Staffel der Nummer 186. Nicht zu verwechseln ist sie mit der grünen Umweltplakette an der Windschutzscheibe, die über die Einfahrt in eine ${h.a('umweltzone', 'Umweltzone')} entscheidet und eigene Regeln hat. Eine frische HU ersetzt keine fehlende Umweltplakette, und umgekehrt. Andere Verstöße rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')} durch.</p>`,
  },
  en: {
    slug: 'overdue-mot-germany',
    nav: 'Overdue MOT',
    card: 'Two months without a fine, then warning fines, and a point after more than eight months.',
    title: 'Overdue MOT Germany 2026: TÜV Fines and the 8-Month Point',
    description: `Overdue MOT (HU, TÜV) in Germany 2026: no fine for ${frei} months, then ${m(s2.fine, 'en')} and ${m(s3.fine, 'en')}, after more than ${pAb} months ${m(s4.fine, 'en')} and a point. Due dates and re-tests explained.`,
    h1: 'Overdue MOT in Germany: what an expired sticker costs',
    intro: 'Miss your Hauptuntersuchung and you have two months of grace; after that the fine rises in three steps.',
    resume: `If your car's roadworthiness test, the Hauptuntersuchung (HU, often called TÜV after one of the test organisations), is overdue, the German fine catalogue charges nothing for up to ${frei} months after the month on the sticker. Beyond that, a car owner pays ${s2.fine} euros for more than two and up to four months and ${s3.fine} euros for more than four and up to eight, both as warning fines without fees. After more than ${pAb} months the fine is ${s4.fine} euros plus one Flensburg point, ${m(tot(s4.fine), 'en', 2)} with the fine-notice fees. The penalty is aimed at the registered keeper, not whoever happens to be driving. Vehicles that also need interim safety checks, such as heavy lorries and buses, face a stricter scale: ${sp[0].fine} euros even within two months and a point after four. Under annex VIII of the vehicle regulations (StVZO), a car's HU is due ${H.pkw_erst_monate} months after first registration and every ${H.pkw_monate} months after that, by the end of the month shown on the round sticker on the rear plate.`,
    faqs: [
      { q: 'Who is fined for an overdue MOT on a company car in Germany?', a: `The registered keeper. Catalogue number 186 fines whoever, as keeper, failed to present the vehicle for its test, so for a company car that is the company it is registered to, not the employee who drives it. The amount depends only on how late the test is: nothing up to ${frei} months for a car, then ${s2.fine}, ${s3.fine} or ${s4.fine} euros.` },
      { q: 'My German car failed the HU. How long do I have for the re-test?', a: 'For significant or dangerous defects, StVZO annex VIII no. 3.1.4 gives one month from the day of the test to present the car again with the inspection report. If you come later or without the report, the examiner carries out a full new HU instead of the cheaper re-check. Minor defects still allow a sticker but must be fixed within a month.' },
      { q: 'Does a late MOT in Germany move my next due date?', a: `Yes, but you gain nothing. The new period starts from the month in which the late test took place (annex VIII no. 2.3). A car due in ${ym(due, 'en')} but tested in ${ym(check, 'en')} gets its next test date in ${ym(nextAfter, 'en')}, so the two-year rhythm simply shifts.` },
      { q: 'Do I get a point for an overdue TÜV in Germany during my probation?', a: `Only once the test is more than ${pAb} months overdue for a car, which brings ${s4.fine} euros and one point. That entry counts as a B offence for drivers in the two-year probation period (annex 12 of the Driving Licence Ordinance). Two B offences lead to a compulsory remedial course. Shorter delays are warning fines and are not recorded.` },
    ],
    body: (h) => `
<h2>The fine scale</h2>
<p>The catalogue splits vehicles into two groups. Number 186.2 covers vehicles that need no interim safety check under annex VIII of the StVZO: cars, motorbikes, light vans, motorhomes up to 3.5 tonnes and small trailers. Number 186.1 covers vehicles that need a safety check between main tests, such as buses, lorries over 7.5 tonnes and heavy trailers, and is one step stricter.</p>
${h.table(['Overdue by', 'No safety check (186.2)', 'Points', 'With safety check (186.1)', 'Points'], [
  [`up to ${frei} months`, h.eur(huLate(frei).fine), huLate(frei).points, h.eur(sp[0].fine!), sp[0].points],
  ['more than 2 to 4 months', h.eur(s2.fine), s2.points, h.eur(sp[1].fine!), sp[1].points],
  ['more than 4 to 8 months', h.eur(s3.fine), s3.points, h.eur(sp[2].fine!), sp[2].points],
  [`more than ${pAb} months`, h.eur(s4.fine), s4.points, h.eur(sp[3].fine!), sp[3].points],
], 'Standard fines under catalogue nos. 186.1 and 186.2, before fees', ['l', 'r', 'r', 'r', 'r'])}
<p>Anything up to ${h.eur(V.verwarnung_max)} is a warning fine without fees, which for a car means every step up to eight months. Only the top step of ${h.eur(s4.fine)} leads to a formal fine notice, ${h.eur(tot(s4.fine), 2)} with the fee and delivery charge. For vehicles with safety checks the totals are ${h.eur(tot(sp[2].fine!), 2)} after four months and ${h.eur(tot(sp[3].fine!), 2)} after eight. The amounts come from the ${h.src('bkatAnlage', 'annex to the fine catalogue ordinance')}.</p>

<h2>Reading the sticker on your plate</h2>
<p>German cars carry a round sticker (Prüfplakette) on the rear number plate that shows the month and year of the next test. Annex VIII no. 2.3 says the period ends when that month runs out, so a sticker for December 2026 means the test is due by 31 December 2026. It is a different thing from the green emissions sticker inside the windscreen, which decides access to a ${h.a('umweltzone', 'low-emission zone')}. If you buy a used car in Germany, check the plate sticker before you sign: the fine is aimed at the keeper, and once the car is registered to you, presenting it for the test is your job.</p>

<h2>How often the test is due</h2>
<p>Intervals are set in ${h.src('stvzoAnl8', 'StVZO annex VIII')}, no. 2.1. The main cases:</p>
${h.table(['Vehicle', 'First test', 'Then every'], [
  ['Car', `${H.pkw_erst_monate} months`, `${H.pkw_monate} months`],
  ['Car used as a taxi or for paid passenger transport', `${A8.taxi} months`, `${A8.taxi} months`],
  ['Motorbike', `${H.krad_monate} months`, `${H.krad_monate} months`],
  ['Van up to 3.5 t', `${A8.lkw35} months`, `${A8.lkw35} months`],
  ['Motorhome up to 3.5 t', `${H.wohnmobil_35_erst} months`, `${H.wohnmobil_35} months`],
  ['Motorhome over 3.5 t to 7.5 t', `${A8.wm75} months during the first ${A8.wm75Erst} months`, `${A8.wm75Danach} months`],
  ['Trailer up to 0.75 t or without its own brakes', `${H.anhaenger_750_erst} months`, `${H.anhaenger_750} months`],
  ['Trailer over 0.75 t to 3.5 t', `${A8.anh35} months`, `${A8.anh35} months`],
], 'StVZO annex VIII no. 2.1; vehicles rented out commercially without a driver usually 12 months (no. 2.2)', ['l', 'r', 'r'])}
<p>For a new car, the clock starts in the month the number plate was issued, not with a temporary plate. After that it starts from the month of the last test. The ${h.a('tuev-kosten', 'MOT date and cost calculator')} works out the month for you.</p>

<h2>Long-term rentals and leasing</h2>
<p>Annex VIII no. 2.2 has a rule that surprises people on long rentals. Vehicles rented out commercially without a driver, and not registered to the renter, must be tested every ${A8.miete} months. If the rental runs for at least a year, a car goes back to the normal ${A8.mieteLangPkw}-month first interval. If the contract is later shortened to under a year, the ${A8.miete}-month period applies again.</p>

<h2>When the test finds defects</h2>
<p>Annex VIII no. 3.1.4 sets out the outcomes. No defects: a new sticker. Minor defects: recorded in the report, a sticker can still be issued, and the keeper must have them fixed within a month at the latest. Significant defects: no sticker, and the car must be presented again within one month of the test day with the report; arrive later or without the report and you pay for a complete new test. Dangerous defects: no sticker, an explicit warning in the report and the same one-month window. Unroadworthy: the existing sticker is removed, the registration office is informed and the car may no longer be used on public roads. The emissions part can be done separately, for example at an approved garage, but no more than one month before the main test (no. 3.1.1.1).</p>

<h2>What counts as a safety check</h2>
<p>The stricter scale under number 186.1 depends on a term defined in annex VIII no. 1.3.1. A safety check (Sicherheitsprüfung) is a visual, performance and function check of the chassis, suspension, coupling, steering, tyres, wheels and brakes. It takes place between main tests, for example every six months for lorries over 7.5 tonnes after their first years, and has its own date marker on the vehicle. Private car drivers never deal with it; for cars, number 186.2 always applies.</p>

<h2>Buying an ex-rental car</h2>
<p>Young used cars sold in Germany are often former rental vehicles. While rented out, they were on the ${A8.miete}-month cycle, so the first HU may already have taken place after a year. If the keeper changes within the first seven months after first registration and after that test, annex VIII no. 2.1.2.1.1 gives the second test the normal ${H.pkw_erst_monate}-month interval again. In every case the sticker on the plate is what counts, and the duty to present the car on time passes to you with the registration.</p>

<h2>What the inspection report records</h2>
<p>Under annex VIII no. 3.1.5.1, the report records among other things the number plate, the month of the last test, the odometer reading, the date and place of the test, any defects and how serious they are, whether a sticker was issued, whether the car must come back, the charges and the month the next test is due. If the odometer shows less than at the previous test and no replacement is documented, the examiner reports it to the registration office through the Federal Motor Transport Authority (no. 3.1.4.8). Keep the report with the car's papers: without it, a re-check after significant defects turns into a full new test. If your German is limited, the defect codes and the line on the next due month are the parts worth translating first.</p>

<h2>A worked example</h2>
<p>Your sticker shows ${ym(due, 'en')}, so the test was due by the end of that month. You take the car in during ${ym(check, 'en')}. Counting in whole months as our calculator does, that is ${late} months overdue: step 186.2.2, ${h.eur(lateR.fine)} and ${lateR.points} points, as a warning fine. One more month past the eight-month mark and it would have been ${h.eur(s4.fine)} and a point. Your next test is then due in ${ym(nextAfter, 'en')}, because the new period starts from the month of the late test.</p>

<h2>Laid-up cars, seasonal plates and imports</h2>
<p>A car that is officially taken off the road (außer Betrieb gesetzt, with the plate's seal removed) has no testing duty for that time; any test that fell due is done when it goes back on the road (no. 2.7). With seasonal plates (Saisonkennzeichen), a test that would fall outside the season is done in the first month of the next season (no. 2.6). For a car previously registered in another country, the period starts from the month of the German inspection carried out for registration (no. 2.3).</p>

<h2>Points, probation and who is liable</h2>
<p>The point after more than ${pAb} months comes from ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')} and is recorded when the notice becomes final; it becomes eligible for deletion after two and a half years, as the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains. For drivers in their Probezeit it is a B offence under ${h.src('fevAnl12', 'annex 12')}, described on the ${h.a('probezeit-fuehrerschein', 'probationary licence page')}. Because the offence is the keeper's, a company or a partner in whose name the car is registered receives the notice, not necessarily the person who drives it every day. Other offences can be checked with the ${h.a('bussgeldrechner', 'fine calculator')}.</p>`,
  },
});
