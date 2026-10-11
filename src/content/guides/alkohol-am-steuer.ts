import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { alcohol } from '../../lib/engine/bkat';
import { formatMoney, formatDecimal } from '../../lib/format';

const A = P.alkohol, V = P.verfahren, PZ = P.probezeit, PK = P.punkte;
const first = alcohol({ promille: 0.6, priorEntries: 0, novice: false });
const second = alcohol({ promille: 0.6, priorEntries: 1, novice: false });
const third = alcohol({ promille: 0.6, priorEntries: 2, novice: false });
const nov = alcohol({ promille: 0.2, priorEntries: 0, novice: true });
const FS = P.fuehrerschein;
const tilg3 = PK.tilgung_3p_monate / 12, tilg2 = PK.tilgung_2p_monate / 12;
const mD = (x: number, d = 0) => formatMoney(x, d, 'de'), mE = (x: number, d = 0) => formatMoney(x, d, 'en');
const dD = (x: number) => formatDecimal(x, 2, 'de'), dE = (x: number) => formatDecimal(x, 2, 'en');

export default defineGuide({
  id: 'alkohol-am-steuer',
  group: 'verstoesse',
  order: 40,
  mini: 'alkohol',
  miniHref: 'promillerechner',
  related: ['promillerechner', 'promillegrenze', 'mpu', 'fahrverbot', 'probezeit-fuehrerschein', 'cannabis-am-steuer'],
  sources: ['stvg24a', 'stvg24c', 'bkatAnlage', 'stgb316', 'propk', 'fev13', 'fevAnl13'],
  de: {
    slug: 'alkohol-am-steuer',
    nav: 'Alkohol am Steuer',
    card: 'Bußgeld, Fahrverbot, Wiederholung, Strafverfahren und MPU nach Alkohol am Steuer.',
    title: 'Alkohol am Steuer 2026: Bußgeld, Straftat, Wiederholung, MPU',
    description: `Alkohol am Steuer 2026: ab 0,5 ‰ ${first.fine} €, 1 Monat Fahrverbot, beim zweiten Mal ${mD(second.fine)} und 3 Monate. Ab 1,1 ‰ Straftat mit Entziehung, ab 1,6 ‰ Pflicht zur MPU.`,
    h1: 'Alkohol am Steuer: Bußgeld, Strafe und Führerschein',
    intro: 'Ob Ordnungswidrigkeit oder Straftat, entscheidet der Wert, das Fahrverhalten und das, was schon im Register steht.',
    resume: `Wer mit 0,5 Promille oder mehr im Blut oder mit ${dD(A.aak_owi)} mg/l in der Atemluft Auto fährt, begeht beim ersten Mal eine Ordnungswidrigkeit nach § 24a StVG: ${first.fine} Euro, ${first.fv} Monat Fahrverbot und ${first.points} Punkte. Steht schon eine Alkohol- oder Drogenentscheidung im Fahreignungsregister, verdoppelt sich das Bußgeld auf ${second.fine} Euro bei ${second.fv} Monaten Fahrverbot; bei mehreren Voreintragungen sind es ${third.fine} Euro. Ab 1,1 Promille gilt jeder Fahrer als absolut fahruntüchtig, und es liegt eine Straftat nach § 316 StGB vor, ebenso ab 0,3 Promille, wenn Ausfallerscheinungen oder ein Unfall hinzukommen. Dann drohen Geld- oder Freiheitsstrafe bis zu einem Jahr, die Entziehung der Fahrerlaubnis mit Sperrfrist und drei Punkte. Ab 1,6 Promille verlangt die Fahrerlaubnisbehörde vor einem neuen Führerschein eine MPU. Fahranfänger und Fahrer unter 21 zahlen schon für den ersten Schluck ${nov.fine} Euro.`,
    faqs: [
      { q: 'Was kostet es, zum zweiten Mal mit 0,5 Promille erwischt zu werden?', a: `Ist bereits eine Entscheidung nach § 24a StVG, § 316 oder § 315c StGB im Fahreignungsregister eingetragen, sieht der Katalog ${second.fine} Euro und ${second.fv} Monate Fahrverbot vor, dazu ${second.points} Punkte. Mit Gebühren und Zustellung sind das ${mD(second.total, 2)}. Wiederholte Verstöße unter Alkohol sind außerdem ein eigener MPU-Anlass nach § 13 FeV, unabhängig vom gemessenen Wert.` },
      { q: 'Wie lange ist der Führerschein nach einer Trunkenheitsfahrt mit 1,1 Promille weg?', a: 'Das Gericht entzieht die Fahrerlaubnis in der Regel nach § 69 StGB und setzt eine Sperre fest, vor deren Ablauf keine neue erteilt wird. Sie beträgt nach § 69a StGB sechs Monate bis fünf Jahre, mindestens ein Jahr, wenn in den drei Jahren davor schon eine Sperre angeordnet war. Danach muss die neue Fahrerlaubnis beantragt werden, bei 1,6 Promille oder mehr mit MPU.' },
      { q: 'Ist eine Fahrt mit 0,4 Promille ohne Ausfallerscheinungen erlaubt?', a: `Für erfahrene Fahrer über 21 ja, solange keine Ausfallerscheinungen auftreten: Die Grenze des § 24a StVG liegt bei ${dD(A.promille_owi)} Promille. Fällt das Fahrzeug aber durch Schlangenlinien auf oder passiert ein Unfall, reicht schon ein Wert ab ${dD(A.relativ_promille)} Promille für eine Straftat nach § 316 StGB. Für Fahranfänger und unter 21 ist jeder Wert über null eine Ordnungswidrigkeit.` },
      { q: 'Wie viele Punkte gibt es für eine Trunkenheitsfahrt mit Entziehung?', a: `Drei. Die Anlage 13 der Fahrerlaubnis-Verordnung bewertet Straftaten mit Entziehung der Fahrerlaubnis oder isolierter Sperre mit drei Punkten, die erst nach ${tilg3} Jahren tilgungsreif werden. Die Ordnungswidrigkeit ab 0,5 Promille bringt dagegen zwei Punkte, die nach ${tilg2} Jahren tilgungsreif sind. Beide Einträge zählen als Voreintragung für die höheren Sätze bei einer neuen Alkoholfahrt.` },
      { q: 'Gilt das Alkoholverbot für Fahranfänger auch nach der Probezeit bis zum 21. Geburtstag?', a: `Ja. § 24c StVG verbietet Alkohol am Steuer in der Probezeit und unabhängig davon vor Vollendung des ${A.anfaenger_alter}. Lebensjahres. Wer mit 18 den Führerschein gemacht hat, bleibt also bis zum ${A.anfaenger_alter}. Geburtstag an das absolute Verbot gebunden, auch wenn die Probezeit vorher endet. Der Verstoß kostet ${nov.fine} Euro und ${nov.points} Punkt, in der Probezeit ist er ein A-Verstoß.` },
    ],
    body: (h) => `
<h2>Ordnungswidrigkeit ab 0,5 Promille</h2>
<p>Der Grundtatbestand steht in § 24a Abs. 1 StVG: Ordnungswidrig handelt, wer ein Kraftfahrzeug mit ${h.num(A.aak_owi, 2)} mg/l Atemalkohol, 0,5 Promille Blutalkohol oder einer Alkoholmenge im Körper führt, die zu einem solchen Wert führt. Der letzte Teil ist wichtig: Auch wer bei der Kontrolle noch knapp darunter liegt, weil der Alkohol erst ins Blut geht, kann erfasst sein. Auf Ausfallerscheinungen kommt es bei dieser Stufe nicht an; der Wert allein reicht.</p>
<p>Die Sätze stehen im ${h.src('bkatAnlage', 'Bußgeldkatalog')} unter 241. Entscheidend ist, was schon im Fahreignungsregister steht. Als Voreintragung zählen Entscheidungen nach § 24a StVG, also auch Drogenfahrten, sowie Verurteilungen nach § 316 StGB und § 315c Abs. 1 Nr. 1 Buchst. a StGB.</p>
${h.table(['Lage', 'BKat-Nr.', 'Bußgeld', 'Fahrverbot', 'Punkte', 'mit Gebühren'], [
  ['erstmals ab 0,5 ‰', first.nr, h.eur(first.fine), `${first.fv} Monat`, h.num(first.points), h.eur(first.total, 2)],
  ['eine Voreintragung', second.nr, h.eur(second.fine), `${second.fv} Monate`, h.num(second.points), h.eur(second.total, 2)],
  ['mehrere Voreintragungen', third.nr, h.eur(third.fine), `${third.fv} Monate`, h.num(third.points), h.eur(third.total, 2)],
  ['Probezeit oder unter 21, jeder Wert', nov.nr, h.eur(nov.fine), 'nein', h.num(nov.points), h.eur(nov.total, 2)],
], 'Alkohol am Steuer als Ordnungswidrigkeit nach §§ 24a, 24c StVG und BKatV, Stand August 2026', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Die Bußgeldkatalog-Verordnung behandelt das Fahrverbot hier als Regelfolge. Beim ersten Verstoß kann der Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft gewählt werden, sofern in den zwei Jahren davor kein Fahrverbot rechtskräftig wurde; die Seite zum ${h.a('fahrverbot', 'Fahrverbot')} erklärt das. Der gesetzliche Bußgeldrahmen in § 24a Abs. 3 StVG liegt ein Vielfaches über dem Regelsatz, sodass die Behörde bei besonderen Umständen darüber hinausgehen kann.</p>

<h2>Straftat ab 1,1 Promille oder bei Ausfallerscheinungen</h2>
<p>§ 316 StGB bestraft, wer ein Fahrzeug führt, obwohl er infolge von Alkohol oder anderen berauschenden Mitteln nicht sicher fahren kann. Eine Zahl steht im Gesetz nicht. Die Rechtsprechung, auf die sich auch die ${h.src('propk', 'Polizeiliche Kriminalprävention')} stützt, hat zwei Schwellen gebildet. Ab 1,1 Promille gilt jeder Kraftfahrer als absolut fahruntüchtig, ein Gegenbeweis ist nicht möglich. Ab 0,3 Promille liegt relative Fahruntüchtigkeit vor, wenn alkoholbedingte Fahrfehler oder ein Unfall hinzukommen. Der Strafrahmen von ${h.src('stgb316', '§ 316 StGB')} reicht bis zu einem Jahr Freiheitsstrafe oder Geldstrafe; auch die fahrlässige Tat ist strafbar.</p>
<p>Wird dabei ein anderer Mensch oder eine fremde Sache von bedeutendem Wert gefährdet, kommt § 315c StGB in Betracht, die Gefährdung des Straßenverkehrs, mit einem deutlich höheren Strafrahmen. Für Geld- oder Freiheitsstrafe gibt es keinen Katalog: Staatsanwaltschaft und Gericht entscheiden nach Einkommen, Vorgeschichte und Umständen. Seriös lässt sich deshalb kein fester Betrag nennen.</p>

<h2>Ordnungswidrigkeit und Straftat im Vergleich</h2>
${h.table(['', 'Ordnungswidrigkeit (§ 24a StVG)', 'Straftat (§ 316 StGB)'], [
  ['Schwelle', `ab ${h.num(A.promille_owi, 1)} ‰ oder ${h.num(A.aak_owi, 2)} mg/l`, `ab ${h.num(A.straftat_promille, 1)} ‰, ab ${h.num(A.relativ_promille, 1)} ‰ mit Ausfallerscheinungen`],
  ['Wer entscheidet', 'Bußgeldstelle', 'Staatsanwaltschaft, Gericht'],
  ['Sanktion', `${h.eur(first.fine)} bis ${h.eur(third.fine)} Regelsatz`, 'Geldstrafe in Tagessätzen oder Freiheitsstrafe'],
  ['Führerschein', `Fahrverbot ${first.fv} bis ${third.fv} Monate`, 'Entziehung, Sperre 6 Monate bis 5 Jahre'],
  ['Punkte', h.num(first.points), '3'],
  ['Danach', 'Führerschein kommt zurück', 'Neuantrag, ab 1,6 ‰ mit MPU'],
], 'Die beiden Spuren bei Alkohol am Steuer', ['l', 'l', 'l'])}
<p>Der Unterschied liegt weniger im Geld als im Führerschein. Nach einem Fahrverbot gibt die Behörde das Dokument einfach zurück. Nach einer Entziehung beginnt das Verfahren für eine neue Fahrerlaubnis von vorn, mit Antrag, Gebühren und gegebenenfalls Gutachten.</p>

<h2>Entziehung und Sperre</h2>
<p>Die eigentlich einschneidende Folge der Straftat ist der Verlust der Fahrerlaubnis. Nach § 69 StGB entzieht das Gericht sie, wenn sich aus der Tat ergibt, dass der Täter ungeeignet ist; bei Trunkenheit im Verkehr gilt das nach § 69 Abs. 2 in der Regel. Die Fahrerlaubnis erlischt mit Rechtskraft des Urteils, der Führerschein wird eingezogen. Zugleich setzt das Gericht eine Sperre zwischen sechs Monaten und fünf Jahren fest (§ 69a StGB). War in den letzten drei Jahren schon eine Sperre angeordnet, beträgt das Mindestmaß ein Jahr.</p>
<p>Oft geht dem Urteil die vorläufige Entziehung voraus: Die Polizei stellt den Führerschein noch in der Nacht sicher, und das Gericht bestätigt das per Beschluss. Diese Zeit wird später auf die Sperre angerechnet. Nach Ablauf der Sperre gibt es den Führerschein nicht automatisch zurück; er muss neu beantragt werden. Im Fahreignungsregister stehen dann drei Punkte, die nach ${h.num(tilg3)} Jahren tilgungsreif werden, so steht es in der ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')}.</p>

<h2>Was die Entziehung zusätzlich kostet</h2>
<p>Neben Strafe und Gerichtskosten fallen beim Neuantrag Gebühren der Fahrerlaubnisbehörde an. Die Gebührenordnung sieht für die Neuerteilung nach einer Entziehung ${h.eur(FS.neuerteilung_min, 2)} bis ${h.eur(FS.neuerteilung_max, 2)} vor, je nach Aufwand. Hinzu kommen gegebenenfalls Prüfungen, die die Behörde verlangt, und das Gutachten der Begutachtungsstelle, deren Preise nicht amtlich festgesetzt sind. Wer beruflich fährt, rechnet außerdem die Monate ohne Führerschein ein. Auch E-Scooter sind übrigens Kraftfahrzeuge: Für sie gelten die 0,5-Promille-Grenze, die Nummer 241 und das Fahrverbot genauso wie im Auto.</p>

<h2>Die MPU nach einer Alkoholfahrt</h2>
<p>Für den neuen Führerschein prüft die Fahrerlaubnisbehörde die Eignung. ${h.src('fev13', '§ 13 FeV')} schreibt in mehreren Fällen zwingend ein medizinisch-psychologisches Gutachten vor:</p>
<ul>
<li>bei einer Fahrt mit ${h.num(A.mpu_promille, 1)} Promille oder ${h.num(A.mpu_aak, 1)} mg/l Atemalkohol oder mehr, und zwar mit jedem Fahrzeug, also auch mit dem Fahrrad;</li>
<li>bei wiederholten Zuwiderhandlungen unter Alkoholeinfluss, auch wenn jede einzelne nur eine Ordnungswidrigkeit war; reine Verstöße gegen das Alkoholverbot für Fahranfänger zählen dabei nicht;</li>
<li>wenn Tatsachen auf Alkoholmissbrauch hindeuten oder die Fahrerlaubnis schon einmal aus diesem Grund entzogen war.</li>
</ul>
<p>Wer also zweimal mit 0,6 Promille auffällt, kann nach dem zweiten Bescheid zur MPU müssen, obwohl nie eine Straftat vorlag. Ablauf, Fristen und Begutachtungsstellen beschreibt die Seite zur ${h.a('mpu', 'MPU')}.</p>

<h2>Fahranfänger und Fahrer unter 21</h2>
<p>Für sie gilt nach ${h.src('stvg24c', '§ 24c StVG')} ein absolutes Alkoholverbot: Weder darf während der Fahrt getrunken noch die Fahrt unter der Wirkung eines alkoholischen Getränks angetreten werden. Der Satz liegt bei ${h.eur(nov.fine)} und ${h.num(nov.points)} Punkt. In der Probezeit ist das ein A-Verstoß mit Aufbauseminar und ${PZ.verlaengerung_jahre} Jahren Verlängerung. Liegt der Wert bei 0,5 Promille oder mehr, greift zusätzlich die Nummer 241 mit Fahrverbot, und ab 1,1 Promille gilt auch für Fahranfänger das Strafrecht. Die Stufen der ${h.a('probezeit-fuehrerschein', 'Probezeit')} sind dort erklärt.</p>

<h2>Atemtest, Blutprobe und Messwert</h2>
<p>Bei einer Kontrolle bietet die Polizei meist zuerst einen Vortest mit einem Handgerät an. Er ist freiwillig und dient nur der Orientierung. Für die Ordnungswidrigkeit kann ein beweissicherer Atemalkoholtest auf der Wache genügen; deshalb nennt § 24a StVG neben dem Promillewert eigens die Atemalkoholgrenze in mg/l. Im Strafverfahren stützen sich die Gerichte dagegen in aller Regel auf eine Blutprobe. Seit einigen Jahren darf die Polizei diese bei Verkehrsdelikten selbst anordnen, ohne vorher einen Richter einzuschalten. Der Wert wird auf den Zeitpunkt der Fahrt zurückgerechnet, und genau diese Zahl entscheidet über die Stufe.</p>

<h2>Restalkohol und der Morgen danach</h2>
<p>Ein großer Teil der Fälle entsteht nicht auf dem Heimweg von der Feier, sondern am nächsten Morgen. Der Körper baut Alkohol langsam und gleichmäßig ab, und weder Kaffee noch Schlaf beschleunigen das. Wer bis spät in die Nacht getrunken hat, kann morgens auf dem Weg zur Arbeit noch über 0,5 Promille liegen, ohne es zu merken. Rechtlich macht das keinen Unterschied. Welche Werte für wen gelten, zeigt die Übersicht zur ${h.a('promillegrenze', 'Promillegrenze')}.</p>
<!--mini:alkohol-->
<h2>Alkohol und Cannabis zusammen</h2>
<p>Wer neben Alkohol auch THC im Blut hat, fällt unter eigene Regeln. Ab dem THC-Grenzwert verbietet § 24a Abs. 2a StVG jeden Alkoholkonsum vor oder während der Fahrt, mit höheren Regelsätzen als beim Alkohol allein. Einzelheiten stehen bei ${h.a('cannabis-am-steuer', 'Cannabis am Steuer')}. Den eigenen Wert mit Voreintragungen und Folgen rechnet der ${h.a('promillerechner', 'Promillerechner')} durch.</p>
<p>Zu den Kosten kommen bei allen Bescheiden die Gebühren nach § 107 OWiG. Gegen einen Bußgeldbescheid ist binnen ${V.einspruch_wochen} Wochen der Einspruch möglich; im Strafverfahren gelten die Fristen der Strafprozessordnung, über die der Strafbefehl oder das Urteil belehrt.</p>`,
  },
  en: {
    slug: 'drink-driving-germany',
    nav: 'Drink-driving',
    card: 'Fines, bans, repeat offences, criminal cases and the MPU after drink-driving.',
    title: 'Drink Driving Germany 2026: Fines, Bans, Crime and the MPU',
    description: `Drink-driving in Germany 2026: from 0.5 per mille ${mE(first.fine)} and a 1-month ban, ${mE(second.fine)} and 3 months the second time. From 1.1 a crime, from 1.6 a mandatory MPU.`,
    h1: 'Drink-driving in Germany: penalties and your licence',
    intro: 'Whether it is a fine or a crime depends on the reading, how you were driving and what is already on your record.',
    resume: `Driving with 0.5 per mille or more alcohol in your blood, or ${dE(A.aak_owi)} mg/l in your breath, is an administrative offence in Germany under Section 24a of the Road Traffic Act (StVG). The first time it costs ${first.fine} euros, a ${first.fv}-month driving ban (Fahrverbot) and ${first.points} points in Flensburg. With one earlier alcohol or drug entry on the register, the fine rises to ${second.fine} euros with a ${second.fv}-month ban, and with several entries to ${third.fine} euros. From 1.1 per mille every driver is treated as unfit to drive, which makes it a crime under Section 316 of the Criminal Code (StGB), as it is from 0.3 if you show impaired driving or cause an accident. A criminal conviction usually means losing your licence for at least six months, a fine or up to a year in prison, and three points. From 1.6 per mille you will need to pass an MPU assessment before you can drive again. New drivers and anyone under 21 must have zero alcohol: any amount costs ${nov.fine} euros.`,
    faqs: [
      { q: 'What happens if I am caught drink-driving in Germany on a foreign licence?', a: `The same rules apply as for residents: ${first.fine} euros, a ban and points from 0.5 per mille, a criminal case from 1.1. In a criminal case the court can withdraw your right to drive in Germany; a foreign licence is not cancelled abroad, but it loses its validity on German roads and receives a note. If you live here, the consequences follow you into any licence exchange.` },
      { q: 'How much is a second drink-driving fine in Germany?', a: `With one earlier entry for drink or drug driving, the catalogue sets ${second.fine} euros, a ${second.fv}-month ban and ${second.points} points, or ${mE(second.total, 2)} with fees. With several earlier entries it is ${third.fine} euros. Repeat offences under the influence of alcohol are also a reason for the licensing authority to order an MPU, whatever the readings were.` },
      { q: 'Can the police take my licence on the spot for drink-driving in Germany?', a: 'Yes, if they suspect a crime, typically from 1.1 per mille or with impaired driving. Officers can seize the licence and order a blood test. A court then decides on a provisional withdrawal, which often lasts until the trial. That time is later credited against the period before you may get a new licence. For an administrative offence alone, the licence stays with you until the ban takes effect.' },
      { q: 'Do German drink-driving rules apply the morning after a party?', a: 'Yes. Only the reading at the time of driving matters, not when you drank. Alcohol leaves the body slowly, and coffee, food or a few hours of sleep do not speed that up. Many offences are recorded on the way to work the next morning, at levels above 0.5 per mille. If in doubt, take public transport or a taxi.' },
    ],
    body: (h) => `
<h2>The administrative offence from 0.5 per mille</h2>
<p>Germany measures blood alcohol in per mille (Promille), parts per thousand. A reading of 0.5 per mille equals 0.05 per cent, the unit used in many English-speaking countries. Section 24a StVG sets two equivalent limits: ${h.num(A.aak_owi, 2)} mg of alcohol per litre of breath or 0.5 per mille in the blood. Reaching either is enough, with no need for signs of impairment.</p>
<p>What you pay depends on your record. The catalogue counts earlier decisions for drink or drug driving under Section 24a, and convictions under Sections 316 and 315c of the Criminal Code.</p>
${h.table(['Situation', 'Cat. no.', 'Fine', 'Ban', 'Points', 'With fees'], [
  ['first time, from 0.5 per mille', first.nr, h.eur(first.fine), `${first.fv} month`, h.num(first.points), h.eur(first.total, 2)],
  ['one earlier entry', second.nr, h.eur(second.fine), `${second.fv} months`, h.num(second.points), h.eur(second.total, 2)],
  ['several earlier entries', third.nr, h.eur(third.fine), `${third.fv} months`, h.num(third.points), h.eur(third.total, 2)],
  ['probation or under 21, any amount', nov.nr, h.eur(nov.fine), 'none', h.num(nov.points), h.eur(nov.total, 2)],
], 'Drink-driving as an administrative offence, Sections 24a and 24c StVG and the fine catalogue (BKatV), as amended August 2026', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The ban follows the usual rules. If it is your first ban in two years, you may choose when it starts within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final; the ${h.a('fahrverbot', 'driving ban page')} explains how. The legal maximum in Section 24a(3) is several times the catalogue amount, so the authority can go above it in unusual cases.</p>

<h2>When it becomes a crime</h2>
<p>${h.src('stgb316', 'Section 316 of the Criminal Code')} punishes anyone who drives a vehicle while unable to do so safely because of alcohol or other intoxicants. The statute has no number. Case law, which the ${h.src('propk', 'German police prevention programme')} summarises, sets 1.1 per mille as the point of absolute unfitness for drivers of motor vehicles: above it, no further proof is needed. From 0.3 per mille, relative unfitness applies if there are alcohol-related driving errors such as weaving, or an accident.</p>
<p>The penalty is a fine or up to one year in prison, and negligence is enough. Criminal fines in Germany are calculated in daily rates (Tagessätze) based on income, so there is no fixed sum to quote. If you endanger another person or valuable property, Section 315c applies instead, with a much higher maximum. Most first offences end with a penalty order (Strafbefehl) sent by post, without a trial; it becomes final unless you object within the period stated on it.</p>

<h2>Losing the licence</h2>
<p>For drink-driving as a crime, Section 69 of the Criminal Code says the offender is normally unfit to drive. The court withdraws the licence and sets a period of six months to five years during which no new licence may be issued (Section 69a). If such a period was imposed in the three years before, the minimum is one year. Police often seize the licence the same night, and a provisional withdrawal by the court counts towards the period.</p>
<p>When the period ends, the licence does not come back by itself. You apply for a new one, and the authority checks whether you are fit to drive. The conviction stays on the Flensburg register with three points for ${h.num(tilg3)} years under ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}.</p>

<h2>The MPU</h2>
<p>Germany's medical and psychological assessment (MPU), sometimes called the "idiot test" in English-language forums, is mandatory under ${h.src('fev13', 'Section 13 of the Driving Licence Ordinance')} in these cases:</p>
<ul>
<li>a drive with ${h.num(A.mpu_promille, 1)} per mille or ${h.num(A.mpu_aak, 1)} mg/l or more, in any vehicle, including a bicycle;</li>
<li>repeated offences under the influence of alcohol, even if each was only an administrative offence; breaches of the zero limit for new drivers alone do not count;</li>
<li>facts suggesting alcohol misuse, or an earlier withdrawal for that reason.</li>
</ul>
<p>Two fines for 0.6 per mille can therefore lead to an MPU without any crime. The ${h.a('mpu', 'MPU page')} covers the assessment itself.</p>

<h2>E-scooters and the cost of a new licence</h2>
<p>Rental e-scooters are motor vehicles under German law. The 0.5 per mille limit, the zero limit for new drivers and under-21s, and the criminal threshold of 1.1 all apply to them exactly as to a car, and a conviction can cost you your car licence. Many expats learn this the hard way after a night out, because the scooters feel like bicycles.</p>
<p>After a withdrawal, applying for a new licence brings its own costs. The official fee schedule sets ${h.eur(FS.neuerteilung_min, 2)} to ${h.eur(FS.neuerteilung_max, 2)} for reissuing a licence after a withdrawal, depending on the work involved. On top come any tests the authority requires and the fee of the assessment centre if an MPU is ordered; those prices are not fixed by law.</p>

<h2>Zero tolerance for new drivers</h2>
<p>${h.src('stvg24c', 'Section 24c StVG')} forbids any alcohol at the wheel during the probation period and for everyone under ${A.anfaenger_alter}, regardless of probation. The fine is ${h.eur(nov.fine)} plus ${h.num(nov.points)} point, and during probation it is an A offence, which means a remedial course and ${PZ.verlaengerung_jahre} more years on probation. If you moved to Germany with a recent EU licence, the probation applies to you with the time since your test credited; the ${h.a('probezeit-fuehrerschein', 'probationary licence page')} explains it.</p>
<!--mini:alkohol-->
<h2>Two tracks side by side</h2>
${h.table(['', 'Administrative offence', 'Crime'], [
  ['Threshold', `from ${h.num(A.promille_owi, 1)} per mille or ${h.num(A.aak_owi, 2)} mg/l`, `from ${h.num(A.straftat_promille, 1)}, or from ${h.num(A.relativ_promille, 1)} with impaired driving`],
  ['Decided by', 'fine authority (Bußgeldstelle)', 'prosecutor and court'],
  ['Penalty', `${h.eur(first.fine)} to ${h.eur(third.fine)} standard fine`, 'income-based fine or prison'],
  ['Licence', `ban of ${first.fv} to ${third.fv} months`, 'withdrawn, 6 months to 5 years before a new one'],
  ['Points', h.num(first.points), '3'],
  ['Afterwards', 'licence returned', 'new application, MPU from 1.6'],
], 'Drink-driving in Germany: administrative and criminal consequences', ['l', 'l', 'l'])}

<h2>Comparing with home</h2>
<p>Limits differ widely in Europe and beyond, and so do units. Germany's 0.5 per mille is the same as 50 mg of alcohol per 100 ml of blood. Other countries use other figures and units, sometimes with lower limits for new or professional drivers, so compare carefully. A licence from home does not carry its limit with it: on German roads, the German thresholds apply, including the zero limit if you are under ${A.anfaenger_alter} or in your first ${PZ.jahre} years of driving. People who drive for work should also check their employment contract, since many company car policies set their own zero rule.</p>

<h2>Cycling home instead</h2>
<p>Switching from the car to a bicycle after drinking is legal up to a point, but not without limits. A bicycle is not a motor vehicle, so the 0.5 per mille rule of Section 24a does not apply to it. The criminal law does: from ${h.num(A.rad_straftat_promille, 1)} per mille a cyclist is treated as absolutely unfit, and from 0.3 with unsafe riding. A ride at ${h.num(A.mpu_promille, 1)} or more also triggers an MPU order, which can put your car licence at risk even though you never touched a car that night.</p>

<h2>Practical points for expats</h2>
<p>German police run alcohol checks year-round, and more often around Carnival, Oktoberfest, Christmas markets and other festivals. A roadside breath test is voluntary, but refusing it usually leads to a blood test ordered by the police or a prosecutor. Readings are taken in per mille, and the limits are the same in every federal state. If you plan to drink, the simplest rule is the one many Germans follow: leave the car at home. The ${h.a('promillegrenze', 'page on alcohol limits')} shows which threshold applies to whom, the ${h.a('promillerechner', 'blood alcohol calculator')} shows the consequences of a reading, and the rules for combining alcohol and cannabis are on the ${h.a('cannabis-am-steuer', 'cannabis driving page')}.</p>`,
  },
});
