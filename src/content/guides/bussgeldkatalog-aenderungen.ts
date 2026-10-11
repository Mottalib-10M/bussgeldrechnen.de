import { defineGuide } from '../../lib/guide-types';
import { P, BKAT } from '../../lib/engine/params';
import { entry, speeding, fees, toleranz } from '../../lib/engine/bkat';
import { formatMoney, formatNumber } from '../../lib/format';

const V = P.verfahren, A = P.alkohol;
const all = BKAT.entries;
const n = all.length;
const band = (lo: number, hi: number) => all.filter((x) => x.fine! > lo && x.fine! <= hi).length;
const nVerw = band(0, V.verwarnung_max), n100 = band(V.verwarnung_max, 100), n250 = band(100, 250), nTop = all.filter((x) => x.fine! > 250).length;
const nPts = all.filter((x) => x.points > 0).length, nFv = all.filter((x) => x.fv > 0).length;
const maxFine = Math.max(...all.map((x) => x.fine!));
const in21 = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });
const out21 = speeding({ limit: 100, measured: 121, inner: false, tolerance: false });
const in31 = speeding({ limit: 50, measured: 81, inner: true, tolerance: false });
const rot = entry('132'), handy = entry('246.1'), gasse = entry('50'), geh = entry('52a'), gurt = entry('100'), thc = entry('242'), anf = entry('243b'), uz = entry('153'), winter = entry('5a');
const oldMinTotal = 23.5;
const T = P.toleranz;
const tol = { m: 74, v: toleranz(74) }, tolHi = { m: 150, v: toleranz(150) };
const m = (x: number, l: 'de' | 'en', d = 0) => formatMoney(x, d, l);

export default defineGuide({
  id: 'bussgeldkatalog-aenderungen',
  group: 'verstoesse',
  order: 90,
  mini: 'katalog',
  related: ['bussgeldrechner', 'verjaehrung-bussgeld', 'punkteabbau', 'cannabis-am-steuer', 'geschwindigkeitsueberschreitung', 'bussgeldbescheid'],
  sources: ['bkatv', 'bkatAnlage', 'bgbl2026_142', 'stvg26', 'stvg24a', 'owig107'],
  de: {
    slug: 'bussgeldkatalog-aenderungen',
    nav: 'Bußgeldkatalog 2026',
    card: 'Welche Fassung gilt, was sich am 1. Juli 2026 geändert hat und welche Beträge bleiben.',
    title: 'Bußgeldkatalog 2026: was gilt und was sich geändert hat',
    description: `Bußgeldkatalog 2026: ${n} Tatbestände mit festem Betrag, Verjährung ${V.verjaehrung_monate} Monate seit 1.7.2026, Punktehandel bis ${m(V.taeuschung_bussgeld_max, 'de')}. Beträge der Reform von 2021 gelten.`,
    h1: 'Bußgeldkatalog 2026: Stand, Neuerungen und Beträge',
    intro: 'Die Beträge sind 2026 dieselben wie seit Ende 2021; neu sind die Verjährung und das Verbot des Punktehandels.',
    resume: `Der Bußgeldkatalog 2026 ist die Anlage zur Bußgeldkatalog-Verordnung in ihrer zuletzt im August 2026 geänderten Fassung (BGBl. 2026 I Nr. 236). Die Regelsätze für Tempo, Rotlicht, Handy oder Parken sind dabei unverändert geblieben: Es gelten weiter die Beträge der Reform vom November 2021, etwa ${in21.fine} Euro und ein Punkt für 21 km/h zu schnell innerorts oder ${handy.fine} Euro und ein Punkt für das Handy am Steuer. Geändert hat sich das Verfahren. Seit dem 1. Juli 2026 verjähren Verkehrsordnungswidrigkeiten nach § 26 Abs. 3 StVG einheitlich in ${V.verjaehrung_monate} Monaten statt zuvor in drei Monaten bis zum Bescheid. Am selben Tag trat § 4c StVG in Kraft, der den Handel mit Punkten verbietet und mit bis zu ${formatNumber(V.taeuschung_bussgeld_max, 0, 'de')} Euro ahndet. Für Cannabis gilt seit 2024 der Grenzwert von ${String(A.thc_ng).replace('.', ',')} ng/ml THC.`,
    faqs: [
      { q: 'Wurden die Bußgelder im Jahr 2026 erhöht?', a: `Nein, die Regelsätze im Katalog sind 2026 nicht gestiegen. Die letzte Änderung der BKatV vom 12. August 2026 betrifft nach ihrer Überschrift die Qualifikation von Berufskraftfahrern, nicht die bekannten Beträge. Für 21 bis 25 km/h innerorts bleibt es bei ${in21.fine} Euro, für Rotlicht bei ${rot.fine} Euro, für fehlende Rettungsgasse bei ${gasse.fine} Euro. Neu sind die längere Verjährung und das Verbot des Punktehandels.` },
      { q: 'Seit wann beträgt die Verjährung bei Bußgeldern sechs Monate?', a: `Seit dem 1. Juli 2026. Das Fünfte Gesetz zur Änderung des Straßenverkehrsgesetzes vom 12. Mai 2026 hat § 26 Abs. 3 StVG neu gefasst: Die Frist der Verfolgungsverjährung beträgt nun ${V.verjaehrung_monate} Monate. Vorher galten drei Monate, solange kein Bußgeldbescheid ergangen war, und erst danach sechs Monate. Unterbrechungen nach § 33 OWiG gibt es weiterhin.` },
      { q: 'Wie viele Tatbestände mit festem Betrag enthält der Bußgeldkatalog 2026?', a: `In der aktuellen Fassung zählen wir ${n} laufende Nummern mit einem festen Regelsatz. Davon liegen ${nVerw} bei höchstens ${V.verwarnung_max} Euro und damit im Bereich des Verwarnungsgeldes, ${nPts} bringen mindestens einen Punkt und ${nFv} ein Regelfahrverbot. Die übrigen Nummern verweisen auf die Tabellen für Geschwindigkeit und Abstand im Anhang oder sind Überschriften.` },
      { q: 'Warum zeigen manche Bußgeldrechner noch 23,50 Euro Gebühren?', a: `Weil sie einen veralteten Stand verwenden. Nach dem geltenden § 107 OWiG beträgt die Gebühr fünf Prozent der Geldbuße, mindestens ${V.gebuehr_min} Euro, und für die Zustellung kommen ${m(V.zustellung, 'de', 2)} dazu. Bei kleinen Bußgeldern sind das zusammen ${m(V.gebuehr_min + V.zustellung, 'de', 2)}. Ein Bußgeld von ${in21.fine} Euro kostet also mit Bescheid ${m(in21.total, 'de', 2)}.` },
    ],
    body: (h) => `
<h2>Welche Fassung 2026 gilt</h2>
<p>Den Bußgeldkatalog gibt es nicht als eigenes Gesetz, sondern als Anlage zur ${h.src('bkatv', 'Bußgeldkatalog-Verordnung (BKatV)')} vom 14. März 2013. Sie wird laufend geändert, oft an Stellen, die Autofahrer kaum betreffen. Die im Oktober 2026 gültige Fassung trägt den Vermerk: zuletzt geändert durch Artikel 4 der Verordnung vom 12. August 2026, verkündet im Bundesgesetzblatt 2026 Teil I Nummer 236. Diese Verordnung befasst sich mit der Qualifikation von Berufskraftfahrern. Die Beträge für Pkw-Fahrer, die in den Schlagzeilen auftauchen, hat sie nicht verändert.</p>
<p>Wir haben die ${h.src('bkatAnlage', 'Anlage mit allen laufenden Nummern')} vollständig ausgewertet. Das Ergebnis zeigt, wie der Katalog aufgebaut ist:</p>
${h.table(['Bereich', 'Anzahl Nummern'], [
  [`bis ${h.eur(V.verwarnung_max)} (Verwarnungsgeld)`, nVerw],
  [`über ${h.eur(V.verwarnung_max)} bis ${h.eur(100)}`, n100],
  [`über ${h.eur(100)} bis ${h.eur(250)}`, n250],
  [`über ${h.eur(250)}`, nTop],
  ['davon mit mindestens einem Punkt', nPts],
  ['davon mit Regelfahrverbot', nFv],
  ['Nummern mit festem Regelsatz insgesamt', n],
], `BKatV-Anlage, ${BKAT.stand}; ohne die Tabellen für Geschwindigkeit und Abstand`, ['l', 'r'])}
<p>Fast zwei Drittel der Nummern bleiben im Bereich des Verwarnungsgeldes, für das weder Gebühren noch Punkte anfallen. Der höchste feste Regelsatz beträgt ${h.eur(maxFine)} und betrifft wiederholtes Fahren unter Cannabis und Alkohol zugleich.</p>

<h2>Neu seit dem 1. Juli 2026: sechs Monate Verjährung</h2>
<p>Die wichtigste Änderung des Jahres steht nicht im Katalog, sondern im Straßenverkehrsgesetz. Das ${h.src('bgbl2026_142', 'Fünfte Gesetz zur Änderung des StVG vom 12. Mai 2026')} hat § 26 Abs. 3 StVG neu gefasst. Seit dem 1. Juli 2026 beträgt die Frist der Verfolgungsverjährung für Ordnungswidrigkeiten nach § 24 Abs. 1 StVG ${V.verjaehrung_monate} Monate. Bis dahin galt eine zweistufige Regel: drei Monate, solange noch kein Bußgeldbescheid ergangen war, und sechs Monate danach.</p>
<p>Praktisch heißt das: Die Behörde hat doppelt so viel Zeit, um nach einem Blitzer oder einer Anzeige die erste verjährungsunterbrechende Handlung vorzunehmen. Die Rechnung „drei Monate abwarten, dann ist es verjährt“, die auf vielen älteren Seiten noch steht, stimmt nicht mehr. Wie die Frist läuft und wodurch sie neu beginnt, erklärt die Seite zur ${h.a('verjaehrung-bussgeld', 'Verjährung im Bußgeldverfahren')}; die Vorschrift selbst ist ${h.src('stvg26', '§ 26 StVG')}.</p>

<h2>Neu seit dem 1. Juli 2026: Punktehandel ist verboten</h2>
<p>Dasselbe Gesetz hat § 4c in das StVG eingefügt. Verboten ist es nun, eine Behörde über die Person zu täuschen, die einen punktebewehrten Verstoß begangen hat, oder eine solche Täuschung anzubieten. Ebenso verboten ist es, den Kontakt zu jemandem zu vermitteln, der dazu bereit ist. Wer dagegen verstößt, begeht eine Ordnungswidrigkeit nach § 23 StVG, die mit bis zu ${h.eur(V.taeuschung_bussgeld_max)} geahndet werden kann. Das richtet sich vor allem gegen Angebote, bei denen jemand gegen Geld als Fahrer auftritt und die Punkte übernimmt. Wie man Punkte auf erlaubtem Weg loswird, steht auf der Seite zum ${h.a('punkteabbau', 'Punkteabbau')}.</p>

<h2>Die Beträge, die 2026 gelten</h2>
<p>Die großen Erhöhungen liegen über vier Jahre zurück. Mit der Reform, die am 9. November 2021 in Kraft trat, stiegen vor allem die Regelsätze für Geschwindigkeitsverstöße und Parken auf Geh- und Radwegen. Diese Beträge gelten 2026 unverändert. Eine Auswahl der häufigsten Fälle, gerechnet mit unserem Katalogmodul:</p>
${h.table(['Verstoß', 'Regelsatz', 'Punkte', 'Mit Gebühren'], [
  ['21 bis 25 km/h zu schnell, innerorts', h.eur(in21.fine), in21.points, h.eur(in21.total, 2)],
  ['21 bis 25 km/h zu schnell, außerorts', h.eur(out21.fine), out21.points, h.eur(out21.total, 2)],
  ['31 bis 40 km/h zu schnell, innerorts (1 Monat Fahrverbot)', h.eur(in31.fine), in31.points, h.eur(in31.total, 2)],
  ['Rotlicht (Nr. 132)', h.eur(rot.fine!), rot.points, h.eur(rot.fine! + fees(rot.fine!).total, 2)],
  ['Handy am Steuer (Nr. 246.1)', h.eur(handy.fine!), handy.points, h.eur(handy.fine! + fees(handy.fine!).total, 2)],
  ['Keine Rettungsgasse (Nr. 50)', h.eur(gasse.fine!), gasse.points, h.eur(gasse.fine! + fees(gasse.fine!).total, 2)],
  ['Ohne Winterreifen bei Glätte (Nr. 5a)', h.eur(winter.fine!), winter.points, h.eur(winter.fine! + fees(winter.fine!).total, 2)],
  ['Umweltzone ohne Plakette (Nr. 153)', h.eur(uz.fine!), uz.points, h.eur(uz.fine! + fees(uz.fine!).total, 2)],
  ['Auf dem Gehweg geparkt (Nr. 52a)', h.eur(geh.fine!), geh.points, h.eur(geh.fine! + fees(geh.fine!).total, 2)],
  ['Nicht angeschnallt (Nr. 100)', h.eur(gurt.fine!), gurt.points, h.eur(gurt.fine! + fees(gurt.fine!).total, 2)],
], 'Regelsätze nach BKatV, Stand 12.8.2026; Gebühren nach § 107 OWiG', ['l', 'r', 'r', 'r'])}
<p>Die vollständige Staffel für alle Geschwindigkeiten steht in der ${h.a('geschwindigkeitsueberschreitung', 'Übersicht zur Geschwindigkeitsüberschreitung')}. Für jede andere Nummer rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')} den Gesamtbetrag aus.</p>

<h2>Cannabis: der Grenzwert seit 2024</h2>
<p>Mit der Teillegalisierung von Cannabis wurde 2024 auch § 24a StVG geändert. Ordnungswidrig handelt seitdem, wer mit ${h.num(A.thc_ng, 1)} ng/ml THC oder mehr im Blutserum ein Kraftfahrzeug führt. Der Katalog behandelt das unter Nummer 242 wie die 0,5-Promille-Grenze: ${h.eur(thc.fine!)}, ${thc.fv} Monat Fahrverbot und ${thc.points} Punkte beim ersten Mal. Wer zugleich Alkohol getrunken hat, fällt unter Nummer 243a mit höheren Beträgen. Für Fahranfänger in der Probezeit und unter ${A.anfaenger_alter} Jahren gilt nach § 24c StVG ein absolutes Verbot, das Nummer 243b mit ${h.eur(anf.fine!)} und ${anf.points} Punkt ahndet. Die Einzelheiten stehen auf der Seite zu ${h.a('cannabis-am-steuer', 'Cannabis am Steuer')}; den Wortlaut enthält ${h.src('stvg24a', '§ 24a StVG')}.</p>

<h2>Gebühren: Achtung bei veralteten Rechnern</h2>
<p>Der Katalog nennt nur das Bußgeld. Was auf dem Bescheid zusätzlich steht, regelt ${h.src('owig107', '§ 107 OWiG')}: fünf Prozent der Geldbuße, mindestens ${h.eur(V.gebuehr_min)} und höchstens ${h.eur(V.gebuehr_max)}, dazu ${h.eur(V.zustellung, 2)} für die Zustellung. Einige Rechner im Netz, darunter auch amtliche, nennen noch einen Mindestbetrag von zusammen ${h.eur(oldMinTotal, 2)}. Nach dem geltenden Wortlaut sind es ${h.eur(V.gebuehr_min + V.zustellung, 2)}. Beim Rotlichtverstoß für ${h.eur(rot.fine!)} macht das einen Unterschied von ${h.eur(V.gebuehr_min + V.zustellung - oldMinTotal, 2)}; bei Bußgeldern ab ${h.eur(V.gebuehr_min / V.gebuehr_satz)} spielt die Mindestgebühr keine Rolle mehr, weil fünf Prozent dann mehr ergeben.</p>

<h2>Toleranzabzug: der Katalog rechnet mit dem vorwerfbaren Wert</h2>
<p>Die Tabelle für Geschwindigkeitsverstöße im Anhang knüpft nicht an den gemessenen, sondern an den vorwerfbaren Wert an. Vom Messwert wird eine Toleranz abgezogen, die sich an den Verkehrsfehlergrenzen der Messgeräte orientiert: ${T.kmh_bis_100} km/h bis ${T.grenze_kmh} km/h Messwert, darüber ${h.pct(T.prozent_ueber_100, 0)}, jeweils zugunsten des Fahrers abgerundet. Wer innerorts mit ${tol.m} km/h gemessen wird, dem werden ${tol.v} km/h vorgeworfen; auf der Autobahn werden aus ${tolHi.m} km/h ${tolHi.v} km/h. Die Polizei Brandenburg weist darauf hin, dass der Abzug vom Messverfahren abhängt. Daran hat sich 2026 nichts geändert, und auch die Stufen der Tabelle sind dieselben wie seit 2021.</p>

<h2>Wie wir den Katalog auswerten</h2>
<p>Alle Beträge auf dieser Seite und in den Rechnern stammen aus der amtlichen Fassung, nicht aus Sekundärquellen. Wir lesen die Anlage, die Tabellen des Anhangs und die Punktebewertung aus Anlage 13 der Fahrerlaubnis-Verordnung, gleichen sie miteinander ab und berechnen daraus jede Zeile. Ändert sich der Stand der Verordnung, ändern sich die Zahlen hier mit. Ändert sich nur eine Gebühr oder Frist außerhalb der Verordnung, passen wir die Parameter ebenso an. Wenn eine andere Seite einen abweichenden Betrag nennt, lohnt der Blick auf den Stand, den sie angibt: Häufig stammt die Zahl aus der Zeit vor November 2021 oder rechnet mit einer veralteten Gebühr.</p>

<h2>Was 2026 nicht neu ist, aber oft so dargestellt wird</h2>
<p>Jedes Jahr kursieren Meldungen über angeblich neue Strafen. Einige Regeln, die regelmäßig als Neuerung erscheinen, gelten schon länger. Das Fahrverbot wegen Beharrlichkeit bei zwei Überschreitungen ab ${V.beharrlich_kmh} km/h binnen eines Jahres steht seit Jahren in § 4 Abs. 2 BKatV. Die Verdopplung bei Vorsatz nach § 3 Abs. 4a BKatV ist ebenfalls nicht neu. Und das Verwarnungsgeld endet weiterhin bei ${h.eur(V.verwarnung_max)}; darüber beginnt der Bußgeldbescheid mit Gebühren. Wer eine Meldung prüfen will, schaut auf den Stand der BKatV: Solange er nicht nach dem 12. August 2026 liegt, hat sich am Katalog nichts geändert.</p>

<h2>Was ein Verstoß vom Oktober 2026 konkret bedeutet</h2>
<p>Für einen Verstoß, der heute begangen wird, gilt alles zusammen: der Regelsatz aus der Anlage, gegebenenfalls erhöht nach Tabelle 4 bei Gefährdung oder Sachbeschädigung, die Gebühren nach § 107 OWiG, die Punkte nach Anlage 13 der Fahrerlaubnis-Verordnung und die Frist von ${V.verjaehrung_monate} Monaten bis zur Verjährung, sofern die Behörde sie nicht unterbricht. Wie ein Bescheid aufgebaut ist und welche Fristen er auslöst, beschreibt die Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}.</p>`,
  },
  en: {
    slug: 'fine-catalogue-changes',
    nav: 'Fine catalogue 2026',
    card: 'Which version applies, what changed on 1 July 2026 and which amounts stay the same.',
    title: 'Fine Catalogue Germany 2026: What Changed and What Applies',
    description: `German fine catalogue (Bußgeldkatalog) 2026: ${n} fixed-amount offences, ${V.verjaehrung_monate}-month limitation since 1 July 2026, point trading now banned with fines up to ${m(V.taeuschung_bussgeld_max, 'en')}.`,
    h1: 'The German fine catalogue in 2026: what applies and what is new',
    intro: 'Fine amounts in 2026 are the same as since late 2021; what changed is the limitation period and a ban on trading points.',
    resume: `Germany's fine catalogue, the Bußgeldkatalog, is the annex to a federal ordinance (BKatV) whose current version was last amended by Article 4 of an ordinance of 12 August 2026 (Federal Law Gazette 2026 I No. 236). That amendment did not touch the everyday amounts drivers care about. In 2026 you still pay the rates introduced in November 2021: ${in21.fine} euros and one point for 21 to 25 km/h over the limit in a built-up area, ${rot.fine} euros and one point for a red light, ${handy.fine} euros and one point for using a phone at the wheel. The real changes came on 1 July 2026 through an amendment to the Road Traffic Act. Traffic offences now become time-barred after ${V.verjaehrung_monate} months instead of three months before a fine notice, and a new Section 4c bans paying someone to take your points, with fines of up to ${formatNumber(V.taeuschung_bussgeld_max, 0, 'en')} euros. The cannabis limit of ${A.thc_ng} ng/ml THC has applied since 2024.`,
    faqs: [
      { q: 'Did German traffic fines go up in 2026?', a: `No. The standard amounts in the catalogue are unchanged in 2026. The latest amendment of 12 August 2026 deals with the qualification of professional drivers. Speeding 21 to 25 km/h over in town still costs ${in21.fine} euros, a red light ${rot.fine} euros and a missing emergency corridor ${gasse.fine} euros. The changes that matter came on 1 July 2026: a longer limitation period and a ban on point trading.` },
      { q: 'Is the old three-month rule for German speeding tickets still valid?', a: `No. Since 1 July 2026, Section 26(3) of the Road Traffic Act sets a single limitation period of ${V.verjaehrung_monate} months for traffic offences. The previous rule of three months until a fine notice was issued no longer applies. The period can still be interrupted, for example by the hearing form or the notice, under Section 33 of the Administrative Offences Act.` },
      { q: 'Can I pay someone in Germany to take my speeding points?', a: `Not legally. Since 1 July 2026, Section 4c of the Road Traffic Act bans deceiving the authority about who committed an offence that carries points, offering to do so, or arranging contact with someone willing to do it. Each is an administrative offence with a fine of up to ${formatNumber(V.taeuschung_bussgeld_max, 0, 'en')} euros under Section 23 of the same Act.` },
      { q: 'How many offences in the German fine catalogue have a fixed fine?', a: `In the current version we count ${n} numbered offences with a fixed standard fine. Of these, ${nVerw} cost no more than ${V.verwarnung_max} euros, the warning-fine range without fees or points; ${nPts} carry at least one point and ${nFv} a standard driving ban. The remaining numbers refer to the speed and distance tables in the appendix or are headings.` },
    ],
    body: (h) => `
<h2>Where the catalogue comes from</h2>
<p>There is no single traffic code with prices in it. The amounts sit in the annex to the ${h.src('bkatv', 'Fine Catalogue Ordinance (BKatV)')} of 14 March 2013, which the federal transport ministry amends from time to time. The version in force in October 2026 was last amended on 12 August 2026 (Federal Law Gazette 2026 I No. 236), by an ordinance about professional driver qualification. Police forces, city offices and courts across all sixteen states apply the same catalogue, so a red light costs the same in Hamburg as in Munich.</p>
<p>We read every entry of the ${h.src('bkatAnlage', 'official annex')}. Its structure in figures:</p>
${h.table(['Range', 'Number of entries'], [
  [`up to ${h.eur(V.verwarnung_max)} (warning fine)`, nVerw],
  [`over ${h.eur(V.verwarnung_max)} to ${h.eur(100)}`, n100],
  [`over ${h.eur(100)} to ${h.eur(250)}`, n250],
  [`over ${h.eur(250)}`, nTop],
  ['of which carry at least one point', nPts],
  ['of which carry a standard driving ban', nFv],
  ['All entries with a fixed fine', n],
], `BKatV annex, ${BKAT.stand}; speed and distance tables not included`, ['l', 'r'])}
<p>Most entries stay at warning-fine level, which means no fees and no points. The highest fixed amount is ${h.eur(maxFine)}, for repeat driving under the influence of both cannabis and alcohol.</p>

<h2>Change one: a six-month limitation period</h2>
<p>The ${h.src('bgbl2026_142', 'Fifth Act amending the Road Traffic Act of 12 May 2026')} rewrote Section 26(3) of that Act with effect from 1 July 2026. The authority now has ${V.verjaehrung_monate} months from the offence to take its first step, such as sending a hearing form, before the case lapses. Before July, the rule had two stages: three months until a fine notice was issued, six months afterwards. Some websites still repeat the three-month figure, so treat it with caution. The page on ${h.a('verjaehrung-bussgeld', 'limitation periods')} explains how the clock is interrupted and restarted; the provision itself is ${h.src('stvg26', 'Section 26 StVG')}.</p>

<h2>Change two: point trading is banned</h2>
<p>For years, some websites offered to find a person who would claim to have been driving and accept your points for a fee. Since 1 July 2026, the new Section 4c of the Road Traffic Act prohibits deceiving the authority about who committed an offence that carries points, offering such a deception and arranging contact with someone prepared to carry it out. Section 23 of the Act makes this an administrative offence with a fine of up to ${h.eur(V.taeuschung_bussgeld_max)}. The legal ways to reduce your total are on the page about ${h.a('punkteabbau', 'removing Flensburg points')}.</p>

<h2>The amounts you pay in 2026</h2>
<p>The last big round of increases took effect on 9 November 2021, when speeding fines and penalties for parking on pavements and cycle paths rose sharply. Those amounts still apply. A selection calculated with the catalogue engine behind this site:</p>
${h.table(['Offence', 'Fine', 'Points', 'With fees'], [
  ['21 to 25 km/h over, built-up area', h.eur(in21.fine), in21.points, h.eur(in21.total, 2)],
  ['21 to 25 km/h over, outside towns', h.eur(out21.fine), out21.points, h.eur(out21.total, 2)],
  ['31 to 40 km/h over, built-up area (1-month ban)', h.eur(in31.fine), in31.points, h.eur(in31.total, 2)],
  ['Red light (no. 132)', h.eur(rot.fine!), rot.points, h.eur(rot.fine! + fees(rot.fine!).total, 2)],
  ['Phone at the wheel (no. 246.1)', h.eur(handy.fine!), handy.points, h.eur(handy.fine! + fees(handy.fine!).total, 2)],
  ['No emergency corridor (no. 50)', h.eur(gasse.fine!), gasse.points, h.eur(gasse.fine! + fees(gasse.fine!).total, 2)],
  ['No winter tyres in icy conditions (no. 5a)', h.eur(winter.fine!), winter.points, h.eur(winter.fine! + fees(winter.fine!).total, 2)],
  ['Low-emission zone without sticker (no. 153)', h.eur(uz.fine!), uz.points, h.eur(uz.fine! + fees(uz.fine!).total, 2)],
  ['Parked on the pavement (no. 52a)', h.eur(geh.fine!), geh.points, h.eur(geh.fine! + fees(geh.fine!).total, 2)],
  ['No seatbelt (no. 100)', h.eur(gurt.fine!), gurt.points, h.eur(gurt.fine! + fees(gurt.fine!).total, 2)],
], 'Standard fines under the BKatV as amended on 12 August 2026; fees under Section 107 OWiG', ['l', 'r', 'r', 'r'])}
<p>Every speed band is listed in the overview of ${h.a('geschwindigkeitsueberschreitung', 'speeding fines in Germany')}, and the ${h.a('bussgeldrechner', 'fine calculator')} works out the total for any other entry.</p>

<h2>Cannabis since 2024</h2>
<p>When Germany partly legalised cannabis in 2024, Section 24a of the Road Traffic Act gained a THC limit: driving with ${h.num(A.thc_ng, 1)} ng/ml or more of THC in blood serum is an offence. The catalogue treats it like the 0.5 per mille alcohol limit, so a first offence under number 242 costs ${h.eur(thc.fine!)}, ${thc.fv} month without driving and ${thc.points} points. Combining cannabis with alcohol falls under number 243a with higher amounts. New drivers on probation and anyone under ${A.anfaenger_alter} face a total ban under Section 24c, punished under number 243b with ${h.eur(anf.fine!)} and ${anf.points} point. If you come from a country where cannabis is legal, note that the German limit applies however long ago you consumed; the page on ${h.a('cannabis-am-steuer', 'cannabis and driving')} goes into detail, and the wording is in ${h.src('stvg24a', 'Section 24a StVG')}.</p>

<h2>Fees: some calculators are out of date</h2>
<p>The catalogue gives only the fine. ${h.src('owig107', 'Section 107 of the Administrative Offences Act')} adds a fee of five per cent, at least ${h.eur(V.gebuehr_min)} and at most ${h.eur(V.gebuehr_max)}, plus ${h.eur(V.zustellung, 2)} for delivery. A few online calculators, including at least one run by a police force, still show a minimum of ${h.eur(oldMinTotal, 2)} in total. Under the current wording the minimum is ${h.eur(V.gebuehr_min + V.zustellung, 2)}. From a fine of ${h.eur(V.gebuehr_min / V.gebuehr_satz)} upwards the minimum no longer matters, because five per cent is then higher.</p>

<h2>The tolerance deduction still applies</h2>
<p>Speed fines are based on the speed held against you, not the raw reading. A margin reflecting the error limits of the measuring devices comes off first: ${T.kmh_bis_100} km/h for readings up to ${T.grenze_kmh} km/h, ${h.pct(T.prozent_ueber_100, 0)} above that, always rounded in the driver's favour. A reading of ${tol.m} km/h in town becomes ${tol.v} km/h; ${tolHi.m} km/h on the Autobahn becomes ${tolHi.v} km/h. The Brandenburg police note that the exact deduction depends on the measuring method. None of this changed in 2026, and neither did the speed bands in the table.</p>

<h2>Foreign licences and foreign plates</h2>
<p>The catalogue applies to everyone who drives in Germany, whether the car carries German plates, a rental company's plates or plates from your home country, and whatever licence you hold. The amounts do not depend on nationality. Offences that carry points are stored in the Flensburg register against the person, whatever licence they hold. If you are about to exchange a non-EU licence, remember that a foreign licence is valid in Germany for ${P.fuehrerschein.drittstaat_monate} months after you take up residence; the page on ${h.a('fuehrerschein-umschreiben', 'exchanging your licence')} explains the rest.</p>

<h2>How we keep the figures current</h2>
<p>Every amount on this site is read from the official version of the ordinance and its tables, together with the points list in annex 13 of the Driving Licence Ordinance, and recalculated whenever the official text changes. Changes to fees or deadlines outside the ordinance are updated in the same way. When another website quotes a different figure, check the date it gives: the number often predates November 2021 or uses an outdated fee.</p>

<h2>What is not new, whatever the headlines say</h2>
<p>Every year, social media posts announce supposedly new penalties. Several rules that keep resurfacing have applied for years: the driving ban for persistent speeding after two offences of ${V.beharrlich_kmh} km/h or more within twelve months (Section 4(2) BKatV), the doubling of fines for intentional offences (Section 3(4a) BKatV) and the ${h.eur(V.verwarnung_max)} ceiling for warning fines. A simple test for any headline: if the BKatV has not been amended after 12 August 2026, the catalogue amounts are the ones in the table above. What follows once a letter arrives is a separate topic, covered in our guide to the German fine notice.</p>`,
  },
});
