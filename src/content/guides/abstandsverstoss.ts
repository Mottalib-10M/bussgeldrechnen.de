import { defineGuide } from '../../lib/guide-types';
import { P, BKAT } from '../../lib/engine/params';
import { entry, distance } from '../../lib/engine/bkat';
import { formatMoney, formatDecimal } from '../../lib/format';
import type { Helpers } from '../../lib/guide-types';

const V = P.verfahren, PZ = P.probezeit;
const e121 = entry('12.1'), e122 = entry('12.2'), e123 = entry('12.3'), e124 = entry('12.4');
const brems1 = entry('13.1'), brems2 = entry('13.2'), einscheren = entry('14'), lkw50 = entry('15');
const bands = [80, 100, 130] as const;
const row = (band: number, tenths: number) => BKAT.distance.find((r) => r.speedFrom === band && r.tenths === tenths)!;
const minFine = Math.min(...BKAT.distance.map((r) => r.fine)), maxFine = Math.max(...BKAT.distance.map((r) => r.fine));
const fvStart = Math.max(...BKAT.distance.filter((r) => r.speedFrom === 100 && r.fv > 0).map((r) => r.tenths));
const ex90 = distance(90, 20), ex120 = distance(120, 20), ex110 = distance(110, 15), ex140 = distance(140, 15), ex140b = distance(140, 10);
/** Le halber Tacho correspond à une durée fixe : (v/2 m) ÷ (v/3,6 m/s) = 1,8 s, quelle que soit la vitesse. */
const halfSec = 3.6 / 2;
const mD = (x: number, d = 0) => formatMoney(x, d, 'de'), mE = (x: number, d = 0) => formatMoney(x, d, 'en');
const dD = (x: number) => formatDecimal(x, 2, 'de'), dE = (x: number) => formatDecimal(x, 2, 'en');

const table2 = (h: Helpers, de: boolean) => h.table(
  [de ? 'Abstand' : 'Gap', de ? 'über 80 km/h' : 'over 80 km/h', de ? 'über 100 km/h' : 'over 100 km/h', de ? 'über 130 km/h' : 'over 130 km/h'],
  [5, 4, 3, 2, 1].map((t) => [
    de ? `weniger als ${t}/10 des halben Tachowerts` : `less than ${t}/10 of half the speed`,
    ...bands.map((b) => { const r = row(b, t); return `${h.eur(r.fine)}, ${r.points} ${de ? (r.points > 1 ? 'Punkte' : 'Punkt') : (r.points > 1 ? 'points' : 'point')}${r.fv ? `, ${r.fv} ${de ? (r.fv > 1 ? 'Monate' : 'Monat') : (r.fv > 1 ? 'months' : 'month')} FV` : ''}<br><small>${r.nr}</small>`; }),
  ]),
  de ? 'Tabelle 2 des Anhangs zur BKatV (Nr. 12.5 bis 12.7), FV = Fahrverbot, Stand August 2026' : 'Table 2 of the BKatV appendix (nos. 12.5 to 12.7), FV = driving ban, as amended August 2026',
  ['l', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'abstandsverstoss',
  group: 'verstoesse',
  order: 20,
  mini: 'abstand',
  related: ['bussgeldrechner', 'fahrverbot', 'geschwindigkeitsueberschreitung', 'probezeit-fuehrerschein', 'punkte-in-flensburg', 'bussgeldbescheid'],
  sources: ['bkatAnhang', 'bkatAnlage', 'bkatv', 'fevAnl13', 'fevAnl12'],
  de: {
    slug: 'abstandsverstoss',
    nav: 'Abstandsverstoß',
    card: 'Halber Tacho, Zehntelstufen und ab wann der Führerschein für drei Monate weg ist.',
    title: 'Abstandsverstoß 2026: Bußgeld, Punkte und Fahrverbot',
    description: `Abstandsverstoß 2026: bis 80 km/h ${e121.fine} €, darüber nach Zehnteln des halben Tachowerts ${minFine} bis ${maxFine} €, ab 100 km/h mit bis zu 3 Monaten Fahrverbot und 2 Punkten.`,
    h1: 'Abstandsverstoß: was zu dichtes Auffahren kostet',
    intro: 'Das Bußgeld hängt an zwei Zahlen: der gefahrenen Geschwindigkeit und dem Abstand in Metern, gemessen am halben Tachowert.',
    resume: `Den richtigen Abstand beschreibt die Faustregel vom halben Tacho: bei 100 km/h mindestens 50 Meter, bei 130 km/h 65 Meter, was bei jeder Geschwindigkeit etwa ${dD(halfSec)} Sekunden Fahrzeit entspricht. Wer bis 80 km/h zu dicht auffährt, zahlt ${e121.fine} Euro, mit Gefährdung ${e122.fine} und mit Sachbeschädigung ${e123.fine} Euro. Über 80 km/h bleibt es bei ${e124.fine} Euro, solange der Abstand mindestens ein Viertel des Tachowerts beträgt. Darunter greift die Tabelle 2 im Anhang der Bußgeldkatalog-Verordnung: ${minFine} bis ${maxFine} Euro je nach Zehntelstufe und Tempo, immer mit Punkt. Ab 100 km/h und weniger als drei Zehnteln des halben Tachowerts kommen ein bis drei Monate Fahrverbot und zwei Punkte hinzu. In der Probezeit zählt jeder Abstandsverstoß mit Punkt als A-Verstoß, der ein Aufbauseminar nach sich zieht.`,
    faqs: [
      { q: 'Wie viele Meter Abstand sind auf der Autobahn bei Tempo 130 Pflicht?', a: `Die Straßenverkehrs-Ordnung nennt keine Meterzahl, sondern verlangt, dass man auch bei plötzlichem Bremsen des Vordermanns halten kann. Bußgeldstellen und Gerichte messen das am halben Tachowert, bei 130 km/h also 65 Meter. Unter einem Viertel des Tachowerts, hier 32,5 Meter, beginnt die Tabelle mit Punkt; unter drei Zehnteln des halben Tachowerts droht bei diesem Tempo ein Fahrverbot.` },
      { q: 'Was kostet zu dichtes Auffahren bei 120 km/h mit 20 Metern Abstand?', a: `Der halbe Tachowert beträgt 60 Meter, 20 Meter sind gut ein Drittel davon und damit weniger als vier Zehntel. Bei mehr als 100 km/h gilt dann ein Regelsatz von ${ex120.fine} Euro und ${ex120.points} Punkt, ohne Fahrverbot. Mit Bescheidgebühr und Zustellung ergibt das ${mD(ex120.total, 2)}. Bei 15 Metern läge der Wert unter drei Zehnteln, und ein Monat Fahrverbot käme hinzu.` },
      { q: 'Gibt es ein Bußgeld, wenn der Vordermann grundlos stark bremst?', a: `Ja, auch der Vorausfahrende hat Pflichten: Er darf nicht ohne zwingenden Grund stark bremsen (§ 4 Abs. 1 StVO). Der Katalog sieht dafür ${brems1.fine} Euro mit Gefährdung und ${brems2.fine} Euro mit Sachbeschädigung vor, ohne Punkt. Bei bewusstem Ausbremsen, um jemanden zu maßregeln, kann der Fall zur Straftat werden; der Katalog regelt dann nichts mehr.` },
      { q: 'Wie viel Abstand muss ein Lkw auf der Autobahn halten?', a: `Für Lkw über 3,5 Tonnen und Busse schreibt § 4 Abs. 3 StVO auf Autobahnen ab mehr als 50 km/h mindestens 50 Meter vor. Wer das unterschreitet, zahlt ${lkw50.fine} Euro und erhält einen Punkt. Außerorts müssen Fahrzeuge mit besonderer Geschwindigkeitsbegrenzung und lange Züge außerdem Platz zum Einscheren lassen; ein Verstoß dagegen kostet ${einscheren.fine} Euro.` },
      { q: 'Verdoppelt sich das Bußgeld bei absichtlichem Drängeln?', a: `Ja, wenn die Behörde Vorsatz annimmt. § 3 Abs. 4a BKatV verdoppelt dann Regelsätze über ${V.verwarnung_max} Euro. Aus ${row(100, 3).fine} Euro für weniger als drei Zehntel bei über 100 km/h werden so ${distance(110, 15, true).fine} Euro, Fahrverbot und Punkte bleiben gleich. Als Hinweise auf Vorsatz werten Behörden etwa Lichthupe, Blinken links und dichtes Auffahren über eine längere Strecke.` },
    ],
    body: (h) => `
<h2>Was die Straßenverkehrs-Ordnung verlangt</h2>
<p>§ 4 Abs. 1 StVO verlangt einen Abstand, der auch bei plötzlichem Bremsen des Vorausfahrenden ein Anhalten erlaubt. Eine Meterzahl steht dort nicht. Die Bußgeldkatalog-Verordnung rechnet deshalb mit dem halben Tachowert: Bei 80 km/h sind das 40 Meter, bei 100 km/h 50 Meter, bei 160 km/h 80 Meter. Diese Größe ist kein Zufall. Rechnet man die Meter in Fahrzeit um, entspricht der halbe Tacho bei jeder Geschwindigkeit ungefähr ${h.num(halfSec, 1)} Sekunden. Die oft genannte Zwei-Sekunden-Regel liegt also knapp darüber und erfüllt die Vorgabe sicher.</p>
<p>Ein Viertel des Tachowerts, also die Hälfte des halben Tachos, ist die Schwelle, ab der es teuer wird. Wer darunter liegt, fährt weniger als eine Sekunde hinter dem Vordermann. Die Tabelle des Katalogs arbeitet dann in Zehnteln des halben Tachowerts: fünf Zehntel entsprechen dem Viertel, ein Zehntel sind bei 100 km/h gerade noch fünf Meter.</p>

<h2>Unter und über 80 km/h</h2>
<p>Bis einschließlich 80 km/h gibt es keine Tabelle. Der Grundtatbestand 12.1 kostet ${h.eur(e121.fine!)}, mit Gefährdung (12.2) ${h.eur(e122.fine!)} und mit Sachbeschädigung (12.3) ${h.eur(e123.fine!)}. Alle drei bleiben Verwarnungsgelder ohne Gebühr und ohne Punkt. Typisch ist das dichte Auffahren im Stadtverkehr oder auf der Landstraße, oft am Ende einer Kolonne.</p>
<p>Über 80 km/h unterscheidet der Katalog zwei Lagen. Liegt der Abstand zwar unter dem halben Tacho, aber noch bei mindestens einem Viertel des Tachowerts, gilt 12.4 mit ${h.eur(e124.fine!)}, ebenfalls ohne Punkt. Erst unterhalb dieses Viertels beginnen die Nummern 12.5 (über 80 km/h), 12.6 (über 100 km/h) und 12.7 (über 130 km/h), und mit ihnen Punkte und gegebenenfalls Fahrverbot.</p>

<h2>Tabelle 2: alle Stufen</h2>
<p>Die Werte stammen aus dem ${h.src('bkatAnhang', 'Anhang zur Bußgeldkatalog-Verordnung')}. Gelesen wird die Tabelle von oben nach unten: Je kleiner der Bruchteil des halben Tachowerts, desto dichter das Auffahren und desto höher der Betrag.</p>
${table2(h, true)}
<p>Zwei Beobachtungen aus der Tabelle. Zwischen 80 und 100 km/h gibt es nie ein Fahrverbot, selbst bei einem Zehntel des halben Tachos nicht; der Betrag erreicht dort aber ${h.eur(row(80, 1).fine)}. Ab 100 km/h kommt das Fahrverbot ab weniger als ${fvStart} Zehnteln, also deutlich früher, als viele vermuten. Über 130 km/h liegen die Beträge in jeder Stufe höher, die Fahrverbotsdauer bleibt gleich.</p>

<h2>Beispiele in Metern</h2>
${h.table(['Tempo', 'Abstand', 'halber Tacho', 'Nr.', 'Bußgeld', 'Punkte', 'Fahrverbot'], [
  ['90 km/h', '20 m', '45 m', ex90.nr, h.eur(ex90.fine), h.num(ex90.points), ex90.fv ? `${ex90.fv} Monat` : 'nein'],
  ['120 km/h', '20 m', '60 m', ex120.nr, h.eur(ex120.fine), h.num(ex120.points), ex120.fv ? `${ex120.fv} Monat` : 'nein'],
  ['110 km/h', '15 m', '55 m', ex110.nr, h.eur(ex110.fine), h.num(ex110.points), ex110.fv ? `${ex110.fv} Monat` : 'nein'],
  ['140 km/h', '15 m', '70 m', ex140.nr, h.eur(ex140.fine), h.num(ex140.points), ex140.fv ? `${ex140.fv} Monat` : 'nein'],
  ['140 km/h', '10 m', '70 m', ex140b.nr, h.eur(ex140b.fine), h.num(ex140b.points), ex140b.fv ? `${ex140b.fv} Monate` : 'nein'],
], 'Berechnet mit dem Abstandsmodul unseres Bußgeldrechners nach Tabelle 2', ['r', 'r', 'r', 'l', 'r', 'r', 'r'])}
<p>Bei 140 km/h und 10 Metern liegt der Wert knapp über einem Siebtel des halben Tachos, also unter zwei Zehnteln. Zehn Meter sind auf der Autobahn etwa zwei Wagenlängen. Wer bei diesem Tempo so nah fährt, hat bei einer Bremsung des Vordermanns praktisch keine Reaktionszeit. Daher die drastische Abstufung.</p>

<h2>Kurz zu dicht oder dauerhaft zu dicht</h2>
<p>Nicht jeder Moment mit zu wenig Abstand ist ein Bußgeldfall. Nach der Rechtsprechung muss der zu geringe Abstand über eine gewisse Strecke bestanden haben. Wer auf der Autobahn plötzlich einen Einscherenden vor sich hat und dadurch für einen Augenblick zu dicht auffährt, hat den Abstand nicht selbst verkürzt. Anders sieht es aus, wenn jemand minutenlang an der Stoßstange des Vordermanns klebt, um ihn von der linken Spur zu drängen. Für die Einstufung zählt außerdem das Tempo, das die Behörde dem Fall zugrunde legt; liegt es knapp über 100 oder knapp über 130 km/h, entscheidet das über die Spalte der Tabelle und damit über Fahrverbot und Betrag.</p>
<p>Wer den Bescheid in der Hand hält, findet beide Werte in der Begründung: das angesetzte Tempo und den Abstand in Metern. Mit ihnen lässt sich die Nummer selbst nachvollziehen, und ein Abgleich mit der Tabelle oben zeigt, ob Spalte und Zeile zusammenpassen. Wie viele Punkte schon auf dem Konto stehen und was ein weiterer bedeutet, zeigt der Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>

<h2>Punkte, Fahrverbot und Probezeit</h2>
<p>Alle Tabellenwerte ohne Fahrverbot bringen einen Punkt, alle mit Fahrverbot zwei. So ordnet es die ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')} ein. Ein Punkt verjährt im Register nach zweieinhalb Jahren, zwei Punkte nach fünf Jahren. Wie der Monat, die zwei oder die drei Monate ohne Führerschein ablaufen, erklärt die Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>
<p>Für Fahranfänger sind die Abstandsnummern mit Punkt A-Verstöße nach der ${h.src('fevAnl12', 'Anlage 12')}. Schon der erste führt zum Aufbauseminar und zu ${PZ.verlaengerung_jahre} zusätzlichen Jahren Probezeit. Die Verwarnungsgelder nach 12.1 bis 12.4 bleiben dagegen ohne Folgen für die Probezeit, weil sie nicht ins Register kommen. Wie das Aufbauseminar abläuft, erklärt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Lkw, Busse und lange Züge</h2>
<p>Für schwere Fahrzeuge gelten zusätzliche Regeln. Lkw über 3,5 Tonnen und Kraftomnibusse müssen auf der Autobahn ab mehr als 50 km/h mindestens 50 Meter Abstand halten; ein Verstoß kostet ${h.eur(lkw50.fine!)} und einen Punkt. In der Probezeit ist das ein B-Verstoß. Außerorts müssen Fahrzeuge mit besonderer Geschwindigkeitsgrenze und Züge über sieben Meter so viel Platz lassen, dass ein Überholender einscheren kann, wenn nur ein Fahrstreifen pro Richtung vorhanden ist. Dafür sieht der Katalog ${h.eur(einscheren.fine!)} vor.</p>

<h2>Der Vorausfahrende und das Ausbremsen</h2>
<p>Abstand ist keine Einbahnstraße. Wer vorausfährt, darf nach § 4 Abs. 1 Satz 2 StVO nicht ohne zwingenden Grund stark bremsen. Der Katalog kennt dafür ${h.eur(brems1.fine!)} bei Gefährdung und ${h.eur(brems2.fine!)} bei Sachbeschädigung. Das gezielte Ausbremsen eines Drängelnden ist damit selbst ein Verstoß, und je nach Ablauf kommt eine Strafbarkeit in Betracht, für die der Katalog nicht mehr gilt.</p>
<!--mini:abstand-->
<h2>Messung, Bescheid und Gebühren</h2>
<p>Abstandsverstöße werden meist auf der Autobahn festgestellt. Die genaue Messmethode steht in der Bußgeldakte; nach ihr richtet sich auch, welche Werte für Tempo und Abstand angesetzt wurden. Der Bescheid nennt die Nummer aus der Tabelle, und daraus lässt sich ablesen, welche Zehntelstufe die Behörde angenommen hat.</p>
<p>Ab einem Regelsatz über ${h.eur(V.verwarnung_max)} kommen die Kosten nach ${h.src('owig107', '§ 107 OWiG')} hinzu, also mindestens ${h.eur(V.gebuehr_min)} plus ${h.eur(V.zustellung, 2)}. Für ${h.eur(row(130, 3).fine)} mit Fahrverbot (über 130 km/h, weniger als drei Zehntel) zahlt man zusammen ${h.eur(distance(140, 20).total, 2)}. Den eigenen Fall mit Tempo und Metern rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')} durch. Wer gleichzeitig zu schnell war, findet die passende Stufe im Überblick zur ${h.a('geschwindigkeitsueberschreitung', 'Geschwindigkeitsüberschreitung')}; begeht man mit einer Handlung beide Verstöße, wendet die Behörde nach § 3 Abs. 5 BKatV nur den höchsten Regelsatz an und kann ihn angemessen erhöhen.</p>
<p>Seit Juli 2026 verjährt ein Abstandsverstoß nach sechs Monaten, wenn die Behörde die Frist nicht vorher unterbricht. Gegen den Bescheid steht binnen ${V.einspruch_wochen} Wochen nach Zustellung der Einspruch offen.</p>`,
  },
  en: {
    slug: 'tailgating-fine-germany',
    nav: 'Tailgating fine',
    card: 'Half the speedometer rule, the tenths table and when tailgating means a ban.',
    title: 'Tailgating Fine Germany 2026: Distance Table and Driving Ban',
    description: `Tailgating fine in Germany 2026: ${mE(e121.fine!)} up to 80 km/h, then ${mE(minFine)} to ${mE(maxFine)} by tenths of half the speed, plus a ban of up to 3 months above 100 km/h. Official table.`,
    h1: 'Tailgating in Germany: the distance rules and fines',
    intro: 'The fine depends on your speed and on how many metres you left, compared with half the number on your speedometer.',
    resume: `German traffic law expects a gap large enough to stop if the car ahead brakes suddenly, and fine authorities measure it with the "halber Tacho" rule: half your speed in metres, so 50 metres at 100 km/h and 65 metres at 130 km/h, which works out at about ${dE(halfSec)} seconds at any speed. Tailgating up to 80 km/h costs ${e121.fine} euros, ${e122.fine} euros with danger to others and ${e123.fine} euros with property damage. Above 80 km/h you pay ${e124.fine} euros as long as the gap is at least a quarter of your speed in metres. Below that, Table 2 of the fine catalogue applies: ${minFine} to ${maxFine} euros depending on speed and on how many tenths of the half-speed gap you kept, always with points. Above 100 km/h and under three tenths, a driving ban (Fahrverbot) of one to three months and two points follow. Drivers on probation commit an A offence with any tailgating entry that carries a point.`,
    faqs: [
      { q: 'What is the halber Tacho rule on German motorways?', a: `It means keeping a gap in metres of at least half your speed in km/h: 60 metres at 120 km/h. The Road Traffic Regulations do not state a figure, but fine authorities and courts use this measure. Converted into time, it equals about ${dE(halfSec)} seconds whatever your speed. Falling below a quarter of your speed in metres moves you into the table with points.` },
      { q: 'How much is a tailgating fine at 140 km/h on the Autobahn?', a: `It depends on the gap. Half the speed is 70 metres. At 15 metres, which is under three tenths of that, the fine is ${ex140.fine} euros, ${ex140.points} points and a ${ex140.fv}-month ban. At 10 metres it is ${ex140b.fine} euros and ${ex140b.fv} months. With fees under Section 107 of the Administrative Offences Act, the first case totals ${mE(ex140.total, 2)}.` },
      { q: 'Can I be fined in Germany for brake-checking a tailgater?', a: `Yes. The driver in front may not brake hard without a compelling reason (Section 4(1) StVO). The catalogue sets ${brems1.fine} euros if someone was endangered and ${brems2.fine} euros if there was damage. Braking deliberately to teach someone a lesson can also be treated as a crime, and then the catalogue no longer applies. Two wrongs simply produce two cases.` },
      { q: 'Does a tailgating fine count as an A offence for new drivers in Germany?', a: `Yes, if it carries a point, which every row of Table 2 does. During the ${P.probezeit.jahre}-year probation, one such entry means a compulsory remedial course and ${PZ.verlaengerung_jahre} extra years of probation. The small fines of ${e121.fine} to ${e124.fine} euros for slightly short gaps carry no point and do not affect probation.` },
    ],
    body: (h) => `
<h2>Where the rule comes from</h2>
<p>Section 4 of the Road Traffic Regulations (StVO) only says your gap must let you stop if the vehicle ahead brakes suddenly. The fine catalogue (BKatV) turns this into numbers by using half your speedometer reading in metres. At 100 km/h that is 50 metres, at 160 km/h 80 metres. Do the arithmetic and you get roughly ${h.num(halfSec, 1)} seconds of travel at every speed, which is why the familiar two-second rule from many driving courses keeps you on the safe side.</p>
<p>A practical way to check it on the Autobahn: pick a fixed point such as a roadside post, a sign or a bridge, and start counting when the car ahead passes it. Counting seconds is far easier than estimating metres at speed. If you reach two before your own car passes the same point, your gap meets the rule at any speed.</p>

<h2>Up to 80 km/h and just over</h2>
<p>At up to 80 km/h, tailgating costs ${h.eur(e121.fine!)} (catalogue no. 12.1), ${h.eur(e122.fine!)} if you endangered someone (12.2) and ${h.eur(e123.fine!)} if there was damage (12.3). These are warning fines: no fees, no points, nothing on the Flensburg register.</p>
<p>Above 80 km/h, a gap below half the speed but still at least a quarter of it costs ${h.eur(e124.fine!)} under no. 12.4, again without a point. Only when the gap drops below a quarter of your speed in metres does the table begin, split into three speed bands: over 80, over 100 and over 130 km/h.</p>

<h2>Table 2 in full</h2>
<p>This is the official table from the ${h.src('bkatAnhang', 'appendix to the fine catalogue ordinance')}. "Five tenths of half the speed" is the same as a quarter of the speed; one tenth at 100 km/h is just five metres.</p>
${table2(h, false)}
<p>The pattern matters for anyone who drives long distances. Between 80 and 100 km/h, often the speed of lorry traffic and roadworks, there is no ban even at the closest tier, though the fine reaches ${h.eur(row(80, 1).fine)}. Above 100 km/h, a ban starts at less than ${fvStart} tenths. Above 130 km/h, where there is no general speed limit on many motorway sections, the fines are higher at every tier while the ban lengths stay the same.</p>

<h2>Worked examples</h2>
${h.table(['Speed', 'Gap', 'Half speed', 'No.', 'Fine', 'Points', 'Ban'], [
  ['90 km/h', '20 m', '45 m', ex90.nr, h.eur(ex90.fine), h.num(ex90.points), ex90.fv ? `${ex90.fv} month` : 'none'],
  ['120 km/h', '20 m', '60 m', ex120.nr, h.eur(ex120.fine), h.num(ex120.points), ex120.fv ? `${ex120.fv} month` : 'none'],
  ['110 km/h', '15 m', '55 m', ex110.nr, h.eur(ex110.fine), h.num(ex110.points), ex110.fv ? `${ex110.fv} month` : 'none'],
  ['140 km/h', '15 m', '70 m', ex140.nr, h.eur(ex140.fine), h.num(ex140.points), ex140.fv ? `${ex140.fv} month` : 'none'],
  ['140 km/h', '10 m', '70 m', ex140b.nr, h.eur(ex140b.fine), h.num(ex140b.points), ex140b.fv ? `${ex140b.fv} months` : 'none'],
], 'Worked out with the distance module of our fine calculator', ['r', 'r', 'r', 'l', 'r', 'r', 'r'])}
<p>The examples show how quickly a small change in metres moves you up a tier. At 110 km/h, five metres less (from 20 to 15) is the difference between ${h.eur(distance(110, 20).fine)} with no ban and ${h.eur(ex110.fine)} with a month off the road.</p>

<h2>Cut-ins, convoys and what counts</h2>
<p>Not every brief moment too close is an offence. Case law generally requires the short gap to have lasted over a certain distance. If a car pulls into your lane just ahead of you, your gap shrinks without any fault on your side, and you are expected to drop back, not to be fined on the spot. What the authorities pursue is the driver who sits a few metres behind someone for a long stretch, typically in the left lane, to push them aside.</p>
<p>Drivers from the UK or Ireland, used to slower motorway speeds, sometimes underestimate how fast the gap closes when a car ahead at 120 km/h is approached from 180 km/h. Speed differences on unrestricted sections can be large, and the halber Tacho rule is calculated on your own speed, not on the difference. Points from any of these offences go onto the same Flensburg register as any other; the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains when they add up to a warning and when they expire.</p>
<p>A short note on rented and company cars: the hearing form goes to the keeper, who passes it on to whoever was driving. For a lease or company car, that usually means the fleet office forwards the letter to you, and the clock for your reply starts when you receive it.</p>

<h2>Points, bans and probation</h2>
<p>Every row of Table 2 without a ban carries one point; every row with a ban carries two, as listed in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}. A ban of one, two or three months follows the general rules on the ${h.a('fahrverbot', 'driving ban page')}, including the option to choose when it starts if you had no ban in the previous two years.</p>
<p>If you are in the first ${PZ.jahre} years of driving, or moved to Germany with a recent EU licence, any of these point-carrying entries is an A offence under ${h.src('fevAnl12', 'annex 12')}. That means a remedial course and longer probation, explained on the ${h.a('probezeit-fuehrerschein', 'probationary licence page')}.</p>

<h2>Lorries, buses and the driver in front</h2>
<p>Lorries over 3.5 tonnes and buses must keep at least 50 metres on the motorway above 50 km/h; failing to do so costs ${h.eur(lkw50.fine!)} and a point. Outside towns, slower vehicles with their own speed limit and combinations longer than seven metres must leave room for overtaking cars to pull in on single-lane roads, or pay ${h.eur(einscheren.fine!)}.</p>
<p>The person in front has duties too. Braking hard without a compelling reason costs ${h.eur(brems1.fine!)} with danger and ${h.eur(brems2.fine!)} with damage. Germans have a word for aggressive tailgating, Drängeln, and it is taken seriously: pressing up behind a slower car in the left lane does not make your own short gap lawful, even if that driver should have moved over.</p>
<!--mini:abstand-->
<h2>The notice and the fees</h2>
<p>Tailgating is usually recorded on motorways, and the method used appears in the case file. The notice names the catalogue number, so you can see which tier the authority applied. Above ${h.eur(V.verwarnung_max)}, fees under ${h.src('owig107', 'Section 107 of the Administrative Offences Act')} are added: five per cent of the fine, at least ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for delivery. If you were also speeding in the same act, only the higher fine applies and may be raised under Section 3(5) BKatV; the ${h.a('geschwindigkeitsueberschreitung', 'speeding fines page')} shows those bands.</p>
<p>The ${h.a('bussgeldrechner', 'fine calculator')} works out your total from speed and metres. An objection (Einspruch) must reach the authority within ${V.einspruch_wochen} weeks of delivery, and since July 2026 a traffic offence becomes time-barred after six months unless that period is interrupted.</p>`,
  },
});
