import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, speeding } from '../../lib/engine/bkat';
import { probezeit } from '../../lib/engine/punkte';
import { formatMoney } from '../../lib/format';

const PZ = P.probezeit;
const A = P.alkohol;
const F = P.fuehrerschein;
const rot = entry('132'), handy = entry('246.1'), null0 = entry('243b'), gasse = entry('50'), ueberholen = entry('19.1'), geh = entry('52a.1'), reihe = entry('58.1'), reifen = entry('5a'), hoehe = entry('104');
const in21 = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });
const in20 = speeding({ limit: 50, measured: 70, inner: true, tolerance: false });
const out26 = speeding({ limit: 100, measured: 126, inner: false, tolerance: false });
const STEP_DE = { keine: 'keine Maßnahme', aufbauseminar: 'Aufbauseminar', verwarnung: 'Verwarnung, Beratung empfohlen', entzug: 'Entziehung' } as const;
const STEP_EN = { keine: 'no measure', aufbauseminar: 'remedial course (Aufbauseminar)', verwarnung: 'written warning, counselling advised', entzug: 'licence withdrawn' } as const;
const faelle: Array<[number, number]> = [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [3, 0]];
const s1 = probezeit(1, 0), s2 = probezeit(1, 2), s3 = probezeit(2, 0);
const kl = (p: 'A' | 'B' | null) => p ?? '–';

export default defineGuide({
  id: 'probezeit-fuehrerschein',
  group: 'punkte',
  order: 40,
  mini: 'probezeit',
  miniHref: 'bussgeldrechner',
  related: ['bussgeldrechner', 'punkte-in-flensburg', 'alkohol-am-steuer', 'cannabis-am-steuer', 'fuehrerschein-umschreiben', 'mpu'],
  sources: ['stvg2a', 'fevAnl12', 'stvg24c', 'fevAnl13'],
  de: {
    slug: 'probezeit-fuehrerschein',
    nav: 'Probezeit',
    card: 'A- und B-Verstöße, Aufbauseminar, Verlängerung und 0,0 Promille für Fahranfänger.',
    title: 'Probezeit Führerschein 2026: A- und B-Verstöße, Folgen',
    description: `Probezeit Führerschein 2026: ${PZ.jahre} Jahre ab Ersterwerb, ein A- oder zwei B-Verstöße bringen Aufbauseminar und ${PZ.verlaengerung_jahre} Jahre mehr. 0,0 Promille, sonst ${null0.fine} € und 1 Punkt.`,
    h1: 'Probezeit beim Führerschein: Regeln, Stufen, Verlängerung',
    intro: 'Die ersten zwei Jahre mit Führerschein laufen auf Probe, und ein einziger Rotlichtverstoß reicht, um daraus vier zu machen.',
    resume: `Die Probezeit beginnt mit dem ersten Erwerb einer Fahrerlaubnis und dauert ${PZ.jahre} Jahre (§ 2a StVG). Begeht der Fahranfänger in dieser Zeit einen schwerwiegenden A-Verstoß oder zwei weniger schwerwiegende B-Verstöße, ordnet die Fahrerlaubnisbehörde ein Aufbauseminar an, und die Probezeit verlängert sich um ${PZ.verlaengerung_jahre} Jahre. Folgt nach dem Seminar noch ein A- oder zwei B-Verstöße, kommt eine schriftliche Verwarnung mit der Empfehlung, binnen ${PZ.beratung_frist_monate} Monaten eine verkehrspsychologische Beratung zu besuchen; beim nächsten Mal wird die Fahrerlaubnis entzogen, und eine neue gibt es frühestens nach ${PZ.neuerteilung_sperre_monate} Monaten. Zu den A-Verstößen zählen nach Anlage 12 der FeV etwa Rotlicht, Handy am Steuer, 21 km/h zu schnell und jeder Alkohol- oder Cannabisverstoß; Parken mit Behinderung oder fehlende Winterreifen sind B-Verstöße. Für Fahranfänger und alle unter ${A.anfaenger_alter} Jahren gilt 0,0 Promille: ${null0.fine} Euro und ein Punkt.`,
    faqs: [
      { q: 'Reicht ein einziger Rotlichtverstoß für das Aufbauseminar in der Probezeit?', a: `Ja. Rotlicht gehört nach Anlage 12 der FeV zu den schwerwiegenden A-Verstößen, und schon ein A-Verstoß löst die Anordnung aus. Mit dem Bußgeld von ${rot.fine} Euro und einem Punkt kommt also das Aufbauseminar hinzu, und die Probezeit verlängert sich um ${PZ.verlaengerung_jahre} auf ${PZ.jahre + PZ.verlaengerung_jahre} Jahre. Entscheidend ist, dass der Verstoß rechtskräftig ins Fahreignungsregister eingetragen wurde.` },
      { q: 'Wie lange dauert das Aufbauseminar in der Probezeit?', a: 'Das normale Aufbauseminar besteht nach § 35 FeV aus vier Sitzungen zu je 135 Minuten in einem Zeitraum von zwei bis vier Wochen, dazu eine Fahrprobe zwischen der ersten und zweiten Sitzung. Pro Tag findet höchstens eine Sitzung statt, die Gruppe hat sechs bis zwölf Teilnehmer. Nach Alkohol oder Drogen gibt es das besondere Aufbauseminar mit Vorgespräch und drei Sitzungen zu je 180 Minuten.' },
      { q: 'Beginnt mit dem Motorradführerschein eine neue Probezeit?', a: 'Nein, wenn Sie schon eine Fahrerlaubnis außerhalb der Klassen AM, L und T besitzen. Die Probezeit knüpft an den erstmaligen Erwerb an; wer Klasse B hat und später Klasse A dazunimmt, erweitert nur. Anders ist es nach § 32 FeV bei der ersten Erweiterung von AM, L oder T auf eine andere Klasse: Die neue Klasse wird dann auf Probe erteilt.' },
      { q: 'Was passiert, wenn ich das angeordnete Aufbauseminar nicht mache?', a: 'Dann wird die Fahrerlaubnis entzogen. § 2a Abs. 3 StVG lässt der Behörde keinen Spielraum, wenn die vollziehbare Anordnung in der gesetzten Frist nicht befolgt wurde. Widerspruch und Klage gegen die Anordnung haben keine aufschiebende Wirkung. Für eine neue Fahrerlaubnis muss das Aufbauseminar trotzdem nachgewiesen werden, es lässt sich also nicht umgehen.' },
      { q: 'Zählt ein Verstoß, wenn der Bescheid erst nach dem Ende der Probezeit kommt?', a: 'Ja. Maßgeblich ist, dass die Tat innerhalb der Probezeit begangen wurde. § 2a Abs. 2 StVG verpflichtet die Behörde ausdrücklich auch dann zum Handeln, wenn die Probezeit inzwischen abgelaufen ist. Wer kurz vor Ende der zwei Jahre geblitzt wird, bekommt das Aufbauseminar also auch dann, wenn der Bescheid erst Monate später rechtskräftig wird.' },
    ],
    body: (h) => `
<h2>Wann die Probezeit beginnt und endet</h2>
<p>Nach ${h.src('stvg2a', '§ 2a StVG')} wird die Fahrerlaubnis beim erstmaligen Erwerb auf Probe erteilt, und die Probezeit läuft ${PZ.jahre} Jahre ab dem Tag der Erteilung. Ausgenommen sind nach § 32 FeV die Klassen AM, L und T; wer mit dem Rollerführerschein angefangen hat, bekommt die Probezeit erst mit der ersten Erweiterung, etwa auf Klasse B.</p>
<p>Die Frist steht nicht immer still im Kalender. Wird der Führerschein beschlagnahmt, sichergestellt oder vorläufig entzogen, ist die Probezeit so lange gehemmt. Wird die Fahrerlaubnis endgültig entzogen oder verzichtet jemand auf sie, endet die Probezeit vorzeitig; mit der neuen Fahrerlaubnis beginnt eine neue Probezeit, aber nur für die Restdauer der alten.</p>

<h2>A- und B-Verstöße</h2>
<p>Was in der Probezeit wie schwer wiegt, bestimmt ${h.src('fevAnl12', 'Anlage 12 der FeV')}. Schwerwiegend, also A, sind alle Straftaten im Straßenverkehr, die nicht schon zur Entziehung geführt haben, und eine lange Liste von Ordnungswidrigkeiten: Geschwindigkeit, Abstand, Überholen, Vorfahrt, Abbiegen und Wenden, Rettungsgasse, Verhalten an Bahnübergängen und Fußgängerüberwegen, Rotlicht, das Handy am Steuer sowie alle Verstöße gegen § 24a und § 24c StVG. Weniger schwerwiegend, also B, sind alle übrigen Ordnungswidrigkeiten mit Eintragung, etwa beim Parken, bei der Ladung oder bei der Bereifung.</p>
${h.table(['Verstoß', 'BKat-Nr.', 'Bußgeld', 'Punkte', 'Probezeit'], [
  ['16 bis 20 km/h zu schnell innerorts', in20.nr, h.eur(in20.fine), in20.points, kl(in20.probe)],
  ['21 bis 25 km/h zu schnell innerorts', in21.nr, h.eur(in21.fine), in21.points, kl(in21.probe)],
  ['26 bis 30 km/h zu schnell außerorts', out26.nr, h.eur(out26.fine), out26.points, kl(out26.probe)],
  ['Rotlicht missachtet', '132', h.eur(rot.fine!), rot.points, kl(rot.probe)],
  ['Handy am Steuer', '246.1', h.eur(handy.fine!), handy.points, kl(handy.probe)],
  ['Überholt trotz Überholverbot', '19.1', h.eur(ueberholen.fine!), ueberholen.points, kl(ueberholen.probe)],
  ['Keine Rettungsgasse', '50', h.eur(gasse.fine!), gasse.points, kl(gasse.probe)],
  ['Alkohol oder Cannabis als Fahranfänger', '243b', h.eur(null0.fine!), null0.points, kl(null0.probe)],
  ['Auf Geh- oder Radweg geparkt, mit Behinderung', '52a.1', h.eur(geh.fine!), geh.points, kl(geh.probe)],
  ['In zweiter Reihe geparkt, mit Behinderung', '58.1', h.eur(reihe.fine!), reihe.points, kl(reihe.probe)],
  ['Ohne Winterreifen bei Glätte', '5a', h.eur(reifen.fine!), reifen.points, kl(reifen.probe)],
  ['Fahrzeug samt Ladung höher als 4,20 m', '104', h.eur(hoehe.fine!), hoehe.points, kl(hoehe.probe)],
], 'Einstufung nach FeV Anlage 12, Bußgeld und Punkte nach BKatV und FeV Anlage 13, Stand 2026', ['l', 'l', 'r', 'r', 'r'])}
<p>Die erste Zeile zeigt die wichtigste Grenze. Zählen können nur Entscheidungen, die ins Fahreignungsregister eingetragen werden, und das sind bei Ordnungswidrigkeiten solche mit Punkten. 20 km/h zu schnell kosten auch einen Fahranfänger ${h.eur(in20.fine)}, bleiben für die Probezeit aber folgenlos. Ab 21 km/h innerorts ist der Verstoß ein A-Verstoß. Die Einstufung jeder Katalognummer zeigt der ${h.a('bussgeldrechner', 'Bußgeldrechner')}.</p>

<h2>Die drei Stufen</h2>
<p>§ 2a Abs. 2 StVG beschreibt eine Treppe mit drei Stufen. Gezählt wird in „Einheiten“: ein A-Verstoß oder zwei B-Verstöße ergeben jeweils eine Stufe.</p>
${h.table(['A-Verstöße', 'B-Verstöße', 'Maßnahme', 'Probezeit insgesamt'], faelle.map(([a, b]) => { const r = probezeit(a, b); return [a, b, STEP_DE[r.step], `${r.years} Jahre`]; }), 'Stufen nach § 2a Abs. 2 und 2a StVG, berechnet mit dem Probezeitmodul dieses Rechners', ['r', 'r', 'l', 'r'])}
<h3>Stufe 1: Aufbauseminar</h3>
<p>Die Behörde ordnet die Teilnahme schriftlich an, nennt die Verstöße und setzt eine Frist. Gleichzeitig verlängert sich die Probezeit um ${PZ.verlaengerung_jahre} Jahre. Das Seminar leitet ein Fahrlehrer mit besonderer Erlaubnis: vier Sitzungen zu je 135 Minuten in zwei bis vier Wochen mit sechs bis zwölf Teilnehmern, dazu eine Fahrprobe von mindestens 30 Minuten reiner Fahrzeit. Auf Antrag kann die Behörde ein Einzelseminar gestatten, das dann aus vier Gesprächen zu je 60 Minuten besteht. Wer wegen Alkohol oder Drogen auffällig geworden ist, kommt in ein besonderes Aufbauseminar bei einem amtlich anerkannten Seminarleiter.</p>
<h3>Stufe 2: Verwarnung</h3>
<p>Kommt nach dem Seminar noch innerhalb der Probezeit ein weiterer A- oder zwei weitere B-Verstöße hinzu, verwarnt die Behörde schriftlich und legt eine verkehrspsychologische Beratung binnen ${PZ.beratung_frist_monate} Monaten nahe. Die Beratung ist freiwillig, ein Einzelgespräch bei einem amtlich anerkannten Berater, und ihre Ergebnisse erfährt nur der Teilnehmer selbst. Für die Verwarnung berechnet die Behörde ${h.eur(F.verwarnung_fes, 2)}.</p>
<h3>Stufe 3: Entziehung</h3>
<p>Ein weiterer A- oder zwei weitere B-Verstöße nach Ablauf dieser zwei Monate führen zur Entziehung. Eine neue Fahrerlaubnis gibt es frühestens ${PZ.neuerteilung_sperre_monate} Monate nach Abgabe des Führerscheins, und nur mit Nachweis des Aufbauseminars. Verstößt jemand in der neuen Probezeit erneut, ordnet die Behörde in der Regel eine ${h.a('mpu', 'MPU')} an.</p>

<h2>Ein Beispiel</h2>
<p>Eine Fahranfängerin besteht im Frühjahr die Prüfung. Nach acht Monaten wird sie innerorts mit 21 km/h zu viel geblitzt: ${h.eur(in21.fine)}, ein Punkt, A-Verstoß. Die Behörde ordnet das Aufbauseminar an, die Probezeit wächst auf ${h.num(s1.years)} Jahre. Im dritten Jahr parkt sie zweimal mit Behinderung auf dem Radweg, jeweils ${h.eur(geh.fine!)} und ein Punkt, zwei B-Verstöße. Zusammen ergibt das die zweite Stufe: ${STEP_DE[s2.step]}. Hätte sie stattdessen einmal das Handy benutzt, wäre das Ergebnis dasselbe gewesen, denn ein A-Verstoß zählt so viel wie zwei B-Verstöße. Mit vier Punkten hätte sie zudem im allgemeinen Punktesystem die Ermahnung erreicht. Ein weiterer A-Verstoß vor Ablauf der verlängerten Probezeit, etwa ein Rotlicht, würde nach Ablauf der zweimonatigen Frist für die Beratung zur Entziehung führen.</p>

<h2>Was die Probezeit kostet</h2>
<p>Neben den Bußgeldern fallen Gebühren der Fahrerlaubnisbehörde an. Für die Anordnung des Aufbauseminars gibt es eine eigene Gebührennummer in der Gebührenordnung für Maßnahmen im Straßenverkehr (Nr. 210), für die Verwarnung in der zweiten Stufe ${h.eur(F.verwarnung_fes, 2)} (Nr. 209). Das Seminar selbst bezahlen Sie beim Fahrlehrer, und dessen Preis ist frei vereinbart; eine amtliche Taxe gibt es nicht. Wer die verkehrspsychologische Beratung wahrnimmt, zahlt auch sie selbst. Nach einer Entziehung kommt die Neuerteilung hinzu, für die die Behörde zwischen ${h.eur(F.neuerteilung_min, 2)} und ${h.eur(F.neuerteilung_max, 2)} berechnet.</p>

<h2>0,0 Promille und kein Cannabis</h2>
<p>Für Fahranfänger in der Probezeit und für alle unter ${A.anfaenger_alter} Jahren gilt nach ${h.src('stvg24c', '§ 24c StVG')} ein absolutes Verbot: kein alkoholisches Getränk und kein THC am Steuer, und auch keine Fahrt unter deren Wirkung. Das kostet ${h.eur(null0.fine!)} und einen Punkt und ist ein A-Verstoß, also mindestens Aufbauseminar und Verlängerung. Ausgenommen ist nur THC aus einem ärztlich verschriebenen Medikament, das bestimmungsgemäß eingenommen wurde. Ab ${h.num(A.promille_owi, 1)} Promille greift zusätzlich die allgemeine Grenze mit Fahrverbot. Mehr dazu auf den Seiten ${h.a('alkohol-am-steuer', 'Alkohol am Steuer')} und ${h.a('cannabis-am-steuer', 'Cannabis am Steuer')}.</p>

<h2>Wer zugezogen ist</h2>
<p>Die Probezeit gilt auch für Inhaber eines Führerscheins aus einem anderen EU- oder EWR-Staat, die ihren Wohnsitz nach Deutschland verlegen. Die Zeit seit dem Erwerb wird angerechnet: Wer in Österreich vor einem Jahr bestanden hat, hat in Deutschland noch ein Jahr Probezeit. Ähnlich bei Führerscheinen aus Drittstaaten, die nach § 31 FeV in einen deutschen umgeschrieben werden; hier zählt aber die Zeit nicht mit, in der jemand in Deutschland nicht fahren durfte, etwa nach Ablauf der sechs Monate ohne Umschreibung (§ 33 Abs. 2 FeV). Einzelheiten zur ${h.a('fuehrerschein-umschreiben', 'Umschreibung')} stehen auf der eigenen Seite.</p>

<h2>Verstöße im Ausland</h2>
<p>Die Stufen der Probezeit hängen an Entscheidungen, die ins Fahreignungsregister eingetragen werden müssen. Dort landen Bußgeldentscheidungen nach § 24, § 24a und § 24c StVG und Urteile deutscher Strafgerichte. Ein Strafzettel aus Italien oder den Niederlanden ist keine solche Entscheidung und löst deshalb weder Punkte noch ein Aufbauseminar aus, auch wenn das Bußgeld selbst bezahlt werden muss.</p>

<h2>Probezeit und Punkte</h2>
<p>Beide Systeme laufen nebeneinander. Jeder Verstoß in der Probezeit, der Punkte bringt, zählt auch im Fahreignungs-Bewertungssystem, und Punkte werden bei Fahranfängern erst gelöscht, wenn die Probezeit vorbei ist. Die Einträge über die Anordnung des Aufbauseminars und über die Verwarnung tilgt das KBA ein Jahr nach Ende der Probezeit, die Mitteilung über die Teilnahme am Seminar selbst nach fünf Jahren (§ 29 Abs. 1 StVG). Wer wissen will, was aktuell gespeichert ist, kann die Daten kostenlos beim KBA abfragen.</p>`,
  },
  en: {
    slug: 'probationary-licence-germany',
    nav: 'Probation',
    card: 'The two-year Probezeit for new drivers, A and B offences, and what it means if you move here.',
    title: 'Probationary Licence Germany 2026: Probezeit and A Offences',
    description: `Probationary licence in Germany 2026: ${PZ.jahre} years from your first licence, ${PZ.verlaengerung_jahre} more after one A offence, zero alcohol. EU licences: the time already held counts.`,
    h1: 'The German probationary licence (Probezeit)',
    intro: 'Germany treats every new driver as being on probation for two years, and people who move here with a recent licence are not exempt.',
    resume: `Germany puts every first driving licence on probation, the Probezeit, for ${PZ.jahre} years from the day it is issued (Section 2a of the Road Traffic Act, StVG). One serious A offence or two less serious B offences in that time lead to a compulsory remedial course (Aufbauseminar) and extend the probation by ${PZ.verlaengerung_jahre} years. Another A or two more B offences after the course bring a written warning with a recommendation to see a traffic psychologist within ${PZ.beratung_frist_monate} months, and one more leads to withdrawal of the licence, with a new one at the earliest ${PZ.neuerteilung_sperre_monate} months later. A offences, listed in annex 12 of the Driving Licence Ordinance, include running a red light, using a phone, going 21 km/h over in town and any alcohol or cannabis offence; parking that obstructs others is a B offence. New drivers and everyone under ${A.anfaenger_alter} must not drink at all before driving: ${null0.fine} euros and a point. If you move here with an EU licence, the rules apply too, with the time since your test credited.`,
    faqs: [
      { q: 'Does the German Probezeit apply if I passed my test in Spain three years ago?', a: `In practice, no longer. Section 2a StVG applies the probation rules to holders of an EU or EEA licence who move their residence to Germany, but the time since the licence was obtained is credited. With three years behind you, the ${PZ.jahre}-year period is already over. Someone who passed eight months before moving still has the remaining sixteen months to serve.` },
      { q: 'Can I drink a beer and then drive during my first two years with a licence?', a: `No. Section 24c StVG forbids drivers on probation and everyone under ${A.anfaenger_alter} from drinking alcohol while driving or setting off under its influence, and the same applies to cannabis. The fine is ${null0.fine} euros plus one point, and because it is an A offence, a remedial course and two more years of probation follow. There is no tolerance level such as the 0.5 per mille limit for other drivers.` },
      { q: 'Does probation restart when I exchange a US licence for a German one?', a: 'No new two years start from scratch. Section 2a StVG credits the time since you obtained the foreign licence. Section 33(2) of the Driving Licence Ordinance adds one catch: any period in which you were not entitled to drive in Germany, for instance after the six months on a non-EU licence ran out before the exchange, does not count towards the probation.' },
      { q: 'Is the Aufbauseminar available as a one-to-one course?', a: 'Yes, on application. Section 2b StVG allows the authority that ordered the course to permit an individual seminar instead of the group format. Section 35 FeV then sets four sessions of 60 minutes rather than four group sessions of 135 minutes, and a driving test drive is still part of it. Whether a provider can hold the conversations in English is a matter to ask them directly.' },
    ],
    body: (h) => `
<h2>Who is on probation</h2>
<p>Under ${h.src('stvg2a', 'Section 2a StVG')} every first licence in Germany is issued on probation for ${PZ.jahre} years. Licences for mopeds (class AM) and agricultural vehicles (L and T) are exempt; probation starts with the first upgrade from one of these to another class. Adding a class later, for example a motorbike licence on top of a car licence, does not start a new probation.</p>
<p>The rules also cover people who arrive from abroad. If you hold a licence from another EU or EEA country and make Germany your home, Section 2a StVG applies the probation to you, but counts the time since you obtained the licence. Someone who passed in Italy ten months before moving has fourteen months left. For licences from outside the EU that are exchanged for a German one, the time since the foreign licence was issued is credited too, minus any period in which you were not allowed to drive in Germany (Section 33(2) FeV). The page on ${h.a('fuehrerschein-umschreiben', 'exchanging a foreign licence')} explains when that gap arises.</p>

<h2>A offences and B offences</h2>
<p>${h.src('fevAnl12', 'Annex 12 of the Driving Licence Ordinance')} sorts offences into two groups. A, the serious ones, covers traffic crimes and a long list of regulatory offences: speed, distance, overtaking, right of way, turning, the emergency corridor, level crossings, pedestrian crossings, red lights, using a phone and every offence under the alcohol and cannabis rules. B covers the remaining offences that are entered in the register, such as obstructive parking, overloading or the wrong tyres.</p>
${h.table(['Offence', 'Catalogue no.', 'Fine', 'Points', 'Probation'], [
  ['16 to 20 km/h over in town', in20.nr, h.eur(in20.fine), in20.points, kl(in20.probe)],
  ['21 to 25 km/h over in town', in21.nr, h.eur(in21.fine), in21.points, kl(in21.probe)],
  ['26 to 30 km/h over outside towns', out26.nr, h.eur(out26.fine), out26.points, kl(out26.probe)],
  ['Red light ignored', '132', h.eur(rot.fine!), rot.points, kl(rot.probe)],
  ['Phone at the wheel', '246.1', h.eur(handy.fine!), handy.points, kl(handy.probe)],
  ['Overtaking where it is prohibited', '19.1', h.eur(ueberholen.fine!), ueberholen.points, kl(ueberholen.probe)],
  ['No emergency corridor', '50', h.eur(gasse.fine!), gasse.points, kl(gasse.probe)],
  ['Any alcohol or cannabis as a new driver', '243b', h.eur(null0.fine!), null0.points, kl(null0.probe)],
  ['Parked on pavement or cycle lane, obstructing', '52a.1', h.eur(geh.fine!), geh.points, kl(geh.probe)],
  ['Double-parked, obstructing', '58.1', h.eur(reihe.fine!), reihe.points, kl(reihe.probe)],
  ['Summer tyres on ice or snow', '5a', h.eur(reifen.fine!), reifen.points, kl(reifen.probe)],
  ['Vehicle and load higher than 4.20 m', '104', h.eur(hoehe.fine!), hoehe.points, kl(hoehe.probe)],
], 'Classification under FeV annex 12, fines and points under the 2026 fine catalogue and FeV annex 13', ['l', 'l', 'r', 'r', 'r'])}
<p>Only decisions recorded in the Flensburg register count, which for regulatory offences means those that carry points. Going 20 km/h over in town costs ${h.eur(in20.fine)} and has no effect on your probation; at 21 km/h it becomes an A offence. The ${h.a('bussgeldrechner', 'fine calculator')} shows the classification for each offence.</p>

<h2>Three steps</h2>
<p>Section 2a(2) StVG works like a staircase. One A offence or two B offences make one step.</p>
${h.table(['A offences', 'B offences', 'Measure', 'Total probation'], faelle.map(([a, b]) => { const r = probezeit(a, b); return [a, b, STEP_EN[r.step], `${r.years} years`]; }), 'Steps under Section 2a(2) and (2a) StVG, worked out with this site\'s probation module', ['r', 'r', 'l', 'r'])}
<h3>Step one: the remedial course</h3>
<p>The licensing office orders you in writing to attend an Aufbauseminar by a deadline, and your probation grows by ${PZ.verlaengerung_jahre} years. The standard course is run by a specially licensed driving instructor: four group sessions of 135 minutes over two to four weeks, six to twelve participants, and a test drive with at least 30 minutes at the wheel between the first and second session. After alcohol or drug offences you are sent to a special version with a preliminary interview and three sessions of 180 minutes. Ignoring the order is not an option: Section 2a(3) StVG requires the licence to be withdrawn if the deadline passes.</p>
<h3>Step two: the warning</h3>
<p>Another A offence, or two B offences, after the course and still within probation leads to a written warning, charged at ${h.eur(F.verwarnung_fes, 2)}, with a recommendation to attend traffic psychology counselling within ${PZ.beratung_frist_monate} months. The counselling is voluntary and confidential: the findings are shared with you alone, and you receive a certificate of attendance.</p>
<h3>Step three: withdrawal</h3>
<p>One more A offence or two more B offences after that point and the licence is withdrawn. A new one can be granted ${PZ.neuerteilung_sperre_monate} months after you hand the old one in at the earliest, and only with proof of the remedial course. Offending again in the new probation usually leads to an ${h.a('mpu', 'MPU assessment')}.</p>

<h2>Probation has nothing to do with age</h2>
<p>Many expats learn to drive only after moving here, often in their thirties, because a car was never needed in a big city back home. The Probezeit applies to them in full: what counts is the first licence, not the driver's age. Take someone who passes the test at 34. Eight months later a camera catches them at 21 km/h over in town, which costs ${h.eur(in21.fine)} and a point and is an A offence. The remedial course follows and the probation grows to ${h.num(s1.years)} years. A phone check at a red light the following year, another A offence, takes them to the second step: ${STEP_EN[s3.step]}. Age matters in one place only: the zero alcohol limit lasts for the whole probation, and for drivers under ${A.anfaenger_alter} it continues until their ${A.anfaenger_alter}st birthday even if the probation is already over.</p>

<h2>What it costs</h2>
<p>The fines are only part of it. The licensing office charges a fee of its own for ordering the remedial course (number 210 of the road traffic fee schedule) and ${h.eur(F.verwarnung_fes, 2)} for the written warning (number 209). The course is paid to the driving instructor who runs it, at a price they set themselves; there is no official rate. Counselling with a traffic psychologist is also at your own cost. If the licence is withdrawn, a new grant costs between ${h.eur(F.neuerteilung_min, 2)} and ${h.eur(F.neuerteilung_max, 2)} in authority fees alone.</p>

<h2>Zero alcohol, zero cannabis</h2>
<p>${h.src('stvg24c', 'Section 24c StVG')} applies to everyone on probation and to all drivers under ${A.anfaenger_alter}, whatever their probation status. You may not drink alcohol or take THC while driving, nor start a journey under their influence. The fine is ${h.eur(null0.fine!)} and a point, and it counts as an A offence. The only exception is THC from medicine prescribed for a specific illness and taken as directed. If you come from a country where a glass of wine with dinner is compatible with driving, this is the rule to remember. From ${h.num(A.promille_owi, 1)} per mille, the general limit with a driving ban applies on top; see the page on ${h.a('alkohol-am-steuer', 'drink-driving in Germany')}.</p>

<h2>Timing traps</h2>
<p>An offence counts if it was committed during probation, even when the decision becomes final after the two years are over. The probation is paused while your licence is seized or provisionally withdrawn, and it ends early if the licence is withdrawn for good; a new licence then carries a new probation for the time that was left. Points collected during probation also count in the general ${h.a('punkte-in-flensburg', 'Flensburg points system')}, and they are not deleted until the probation has ended.</p>
<p>Fines collected on holiday are a different matter. The steps of the German probation depend on decisions entered in the Flensburg register, which holds German fine decisions and German court judgments. A speeding ticket from France or a red-light fine from Spain does not count towards the Probezeit, however annoying it is to pay.</p>`,
  },
});
