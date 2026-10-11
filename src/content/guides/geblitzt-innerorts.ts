import { defineGuide } from '../../lib/guide-types';
import { P, BKAT } from '../../lib/engine/params';
import { speeding } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const C = BKAT.speed.filter((r) => r.cls === 'c');
/** Eine Zeile je Stufe der Tabelle 1 c, gerechnet am unteren Rand der Stufe, mit Kosten des Bescheids. */
const stufen = C.map((r) => ({ r, o: speeding({ limit: 50, measured: 50 + Math.max(1, r.lo), inner: true, tolerance: false }) }));
const fvAb = C.find((r) => r.fvInner > 0)!.lo;
const ptAb = C.find((r) => r.ptInner > 0)!.lo;
const fv2 = C.find((r) => r.fvInner >= 2)!.lo;
const fv3 = C.find((r) => r.fvInner >= 3)!.lo;
const m81 = speeding({ limit: 50, measured: 81, inner: true });
const z30 = speeding({ limit: 30, measured: 30 + fvAb + T.kmh_bis_100, inner: true });
const o55 = speeding({ limit: 50, measured: 105, inner: true, tolerance: false });
const in40 = speeding({ limit: 50, measured: 90, inner: true, tolerance: false });
const out40 = speeding({ limit: 100, measured: 140, inner: false, tolerance: false });
const bsp = speeding({ limit: 50, measured: 88, inner: true });
const bspEn = speeding({ limit: 50, measured: 96, inner: true });
const A = BKAT.speed.filter((r) => r.cls === 'a');
const aFv = A.find((r) => r.fvInner > 0)!.lo;
const k30 = speeding({ limit: 50, measured: 80, inner: true, tolerance: false });
const k31 = speeding({ limit: 50, measured: 81, inner: true, tolerance: false });
const maxDiff = Math.max(...C.map((r) => r.inner - r.outer));
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

function label(lo: number, hi: number | null, lang: 'de' | 'en') {
  if (hi === null) return lang === 'de' ? `ab ${lo} km/h` : `${lo} km/h or more`;
  if (lo === 0) return lang === 'de' ? `bis ${hi} km/h` : `up to ${hi} km/h`;
  return lang === 'de' ? `${lo} bis ${hi} km/h` : `${lo} to ${hi} km/h`;
}

export default defineGuide({
  id: 'geblitzt-innerorts',
  group: 'tempo',
  order: 30,
  mini: 'innerorts',
  related: ['geblitzt', 'geblitzt-ausserorts', 'kmh-31', 'kmh-51', 'fahrverbot', 'bussgeldrechner'],
  sources: ['stvo3', 'bkatAnhang', 'owig107', 'fevAnl13', 'ptb'],
  de: {
    slug: 'geblitzt-innerorts',
    nav: 'Geblitzt innerorts',
    card: 'Tempo 50 und 30er-Zone: was ein Blitzer in der Stadt mit allen Kosten bedeutet.',
    title: 'Geblitzt innerorts 2026: Kosten mit Gebühr und Fahrverbot',
    description: `Geblitzt innerorts 2026: Tempo 50 nach § 3 StVO, 30er-Zone, Gesamtbetrag mit Gebühr je Stufe. Ab ${ptAb} km/h ein Punkt, ab ${fvAb} km/h zu schnell ein Monat Fahrverbot.`,
    h1: 'Geblitzt innerorts: Tempo 50, 30er-Zone und die Folgen',
    intro: 'In der Stadt kostet jede Stufe mehr als auf der Landstraße, und das Fahrverbot kommt zehn km/h früher.',
    resume: `Wer innerorts geblitzt wird, zahlt nach Tabelle 1 c des Bußgeldkatalogs die Sätze der Spalte innerorts, die in jeder Stufe über denen außerorts liegen. Ohne Schild gilt in geschlossenen Ortschaften nach § 3 Abs. 3 StVO Tempo 50 für alle Kraftfahrzeuge; in einer 30er-Zone wird die Überschreitung genauso nach der Spalte innerorts bewertet. Mit dem Pkw reicht die Spanne von ${de(C[0].inner)} bis ${de(C[C.length - 1].inner)}. Ab ${ptAb} km/h zu schnell gibt es einen Punkt, ab ${fvAb} km/h zwei Punkte und einen Monat Fahrverbot, ab ${fv2} km/h zwei Monate und ab ${fv3} km/h drei Monate. Über ${V.verwarnung_max} Euro kommen nach § 107 OWiG mindestens ${de(V.gebuehr_min)} Gebühr und ${de(V.zustellung, 2)} Zustellung hinzu. Bei gemessenen 81 km/h in der 50er-Zone bleiben nach Toleranzabzug ${m81.over} km/h Überschreitung, das macht mit Kosten ${de(m81.total, 2)} und einen Punkt.`,
    faqs: [
      { q: 'Was kostet es, innerorts mit 81 km/h in der 50er-Zone geblitzt zu werden?', a: `Nach Abzug von ${T.kmh_bis_100} km/h Toleranz bleiben ${m81.vorwerfbar} km/h, also ${m81.over} km/h zu viel. Das ist die Stufe ${label(m81.row!.lo, m81.row!.hi, 'de')} der Tabelle 1 c: ${de(m81.fine)} Bußgeld, ${de(m81.fees, 2)} Gebühr und Zustellung, zusammen ${de(m81.total, 2)}, dazu ein Punkt. Ein Fahrverbot gibt es noch nicht; dafür fehlen ${fvAb - m81.over} km/h.` },
      { q: 'Ab welchem Messwert droht in der 30er-Zone ein Fahrverbot?', a: `Ab einem Messwert von ${30 + fvAb + T.kmh_bis_100} km/h. Nach Abzug von ${T.kmh_bis_100} km/h Toleranz sind das ${fvAb} km/h zu viel, und ab dieser Stufe sieht Tabelle 1 c innerorts einen Monat Fahrverbot vor, dazu ${de(z30.fine)} und zwei Punkte. Der Katalog kennt keine eigene Spalte für die 30er-Zone; sie wird wie jede innerörtliche Strecke bewertet.` },
      { q: 'Gilt auf einer vierspurigen Hauptstraße in der Stadt auch Tempo 50?', a: 'Ja, wenn kein Schild etwas anderes anordnet. § 3 Abs. 3 StVO nennt innerhalb geschlossener Ortschaften 50 km/h für alle Kraftfahrzeuge, ohne Ausnahme für breite Straßen. Die Regel, dass bei zwei markierten Fahrstreifen je Richtung keine allgemeine Grenze von 100 km/h gilt, betrifft nur Straßen außerhalb geschlossener Ortschaften. Höhere Werte in der Stadt gibt es nur mit Schild.' },
      { q: 'Wie lange dauert das Fahrverbot bei 55 km/h zu schnell innerorts?', a: `Zwei Monate. ${o55.over} km/h über dem Limit fallen in die Stufe ${label(o55.row!.lo, o55.row!.hi, 'de')}, für die Tabelle 1 c innerorts ${de(o55.fine)}, zwei Punkte und ${o55.fv} Monate Fahrverbot vorsieht. Mit Gebühr und Zustellung stehen ${de(o55.total, 2)} auf dem Bescheid. Außerorts wäre dieselbe Überschreitung mit einem Monat belegt.` },
    ],
    body: (h) => `
<h2>Tempo 50: woher die Grenze kommt</h2>
<p>Die allgemeine Höchstgeschwindigkeit in Städten und Dörfern steht in ${h.src('stvo3', '§ 3 Abs. 3 Nr. 1 StVO')}: innerhalb geschlossener Ortschaften ${h.num(50)} km/h für alle Kraftfahrzeuge, „auch unter günstigsten Umständen“. Die geschlossene Ortschaft beginnt am gelben Ortsschild und endet an dessen Rückseite. Ob rechts und links Häuser stehen, spielt dafür keine Rolle; eine Umgehungsstraße durch freies Feld kann innerorts liegen, eine dicht bebaute Ausfallstraße hinter dem Ortsschild außerorts. Höhere Werte, etwa 60 oder 70 km/h auf großen Einfallstraßen, gelten nur, wenn sie ausgeschildert sind.</p>
<p>Niedrigere Grenzen sind in Städten häufig: Tempo-30-Zonen in Wohngebieten, einzelne Abschnitte mit Tempo 30 vor Schulen, Kitas oder Krankenhäusern, oft zeitlich begrenzt. Der Bußgeldkatalog unterscheidet aber nur zwischen innerorts und außerorts, nicht zwischen 30 und 50. Wer in der 30er-Zone ${h.num(21)} km/h zu schnell ist, zahlt dasselbe wie jemand, der mit ${h.num(21)} km/h zu viel durch eine 50er-Straße fährt.</p>

<h2>Die Tabelle für die Stadt mit allen Kosten</h2>
<p>Die folgenden Werte gelten für Pkw und Motorräder nach Tabelle 1 c im ${h.src('bkatAnhang', 'Anhang der BKatV')}, jeweils nach Toleranzabzug und ohne Vorsatz. Die Spalte „Gesamt“ enthält Gebühr und Zustellung nach ${h.src('owig107', '§ 107 OWiG')}; bis ${h.eur(V.verwarnung_max)} bleibt es beim Verwarnungsgeld ohne Kosten.</p>
${h.table(['Zu schnell', 'Bußgeld', 'Kosten', 'Gesamt', 'Punkte', 'Fahrverbot', 'Messwert 50er-Zone ab', 'Messwert 30er-Zone ab'], stufen.map(({ r, o }) => [label(r.lo, r.hi, 'de'), h.eur(o.fine), o.fees ? h.eur(o.fees, 2) : 'keine', h.eur(o.total, 2), h.num(o.points), o.fv ? `${h.num(o.fv)} Monat${o.fv > 1 ? 'e' : ''}` : 'nein', `${h.num(50 + Math.max(1, r.lo) + T.kmh_bis_100)} km/h`, `${h.num(30 + Math.max(1, r.lo) + T.kmh_bis_100)} km/h`]), 'Pkw innerorts, Tabelle 1 c (Nr. 11.3), Kosten nach § 107 OWiG, Stand 12.8.2026', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Messwert-Spalten zeigen, ab welcher angezeigten Geschwindigkeit eine Stufe beginnt, wenn ${h.num(T.kmh_bis_100)} km/h abgezogen werden. In der Stadt liegt fast jede Messung unter ${h.num(T.grenze_kmh)} km/h, deshalb gilt dort praktisch immer der feste Abzug. Erst wer innerorts mehr als ${h.num(T.grenze_kmh)} km/h fährt, bekommt den prozentualen Abzug; dann ist man aber längst in der höchsten Stufe.</p>

<p>Am unteren Ende der Tabelle liegt eine Schwelle, die mit Punkten nichts zu tun hat. Bis ${h.num(C[1].hi!)} km/h zu viel bleibt es innerorts bei ${h.eur(C[1].inner)} oder weniger, also bei einem Verwarnungsgeld, das ohne Gebühr erledigt ist, wenn es fristgerecht gezahlt wird. Ab ${h.num(C[2].lo)} km/h zu viel sind es ${h.eur(C[2].inner)}, damit wird ein Bußgeldbescheid fällig, und mit Gebühr und Zustellung stehen ${h.eur(stufen[2].o.total, 2)} auf dem Papier, noch ohne Punkt. In der 50er-Zone trennt ein Messwert von ${h.num(50 + C[1].hi! + T.kmh_bis_100)} km/h den einen Fall vom anderen.</p>

<h2>Punkte ab 21, Fahrverbot ab 31 km/h</h2>
<p>Zwei Grenzen bestimmen, wie lange ein Blitzer in der Stadt nachwirkt. Ab ${h.num(ptAb)} km/h zu viel wird der Verstoß nach ${h.src('fevAnl13', 'Anlage 13 der FeV')} mit einem Punkt bewertet. Ab ${h.num(fvAb)} km/h sind es zwei Punkte und ein Monat Fahrverbot, in der 50er-Zone also ab ${h.num(50 + fvAb + T.kmh_bis_100)} km/h Messwert. Wer genau an dieser Kante liegt, findet auf der Seite ${h.a('kmh-31', '31 km/h zu schnell')} das Beispiel mit allen Fristen. Die Dauer wächst innerorts schnell: ${h.num(fv2)} km/h zu viel bedeuten zwei Monate, ${h.num(fv3)} km/h drei Monate, mehr sieht der Katalog nicht vor. Die Stufe ab ${h.num(fv2)} km/h behandelt die Seite ${h.a('kmh-51', '51 km/h zu schnell')}.</p>
<p>Für den Beginn des Fahrverbots gilt die Viermonatsfrist, wenn in den zwei Jahren vor der Tat kein Fahrverbot rechtskräftig wurde: Sie können den Führerschein dann innerhalb von ${h.num(V.fahrverbot_schonfrist_monate)} Monaten nach Rechtskraft abgeben, wann es passt. Einzelheiten stehen unter ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Ein Fall von der Messung bis zur Abgabe</h2>
<p>Ein Pkw wird auf einer Hauptstraße mit Tempo 50 bei ${h.num(88)} km/h gemessen. Nach Abzug bleiben ${h.num(bsp.vorwerfbar)} km/h, die Überschreitung beträgt ${h.num(bsp.over)} km/h. Der Anhörungsbogen nennt diese Werte und die Nummer ${bsp.nr} des Katalogs. Der Bescheid setzt ${h.eur(bsp.fine)} fest, dazu ${h.eur(bsp.fees, 2)} Gebühr und Zustellung, zusammen ${h.eur(bsp.total, 2)}, ${h.num(bsp.points)} Punkte und ${h.num(bsp.fv)} Monat Fahrverbot. Zwei Wochen nach Zustellung wird er rechtskräftig, wenn kein Einspruch eingeht. Gab es in den zwei Jahren davor kein Fahrverbot, läuft ab diesem Tag die Frist von ${h.num(V.fahrverbot_schonfrist_monate)} Monaten, innerhalb derer der Führerschein abgegeben wird. Der Monat zählt ab dem Tag, an dem die Behörde ihn in Verwahrung nimmt.</p>

<h2>Ein km/h an der Kante</h2>
<p>Die Stufen haben harte Grenzen. Mit ${h.num(k30.over)} km/h zu viel kostet die Fahrt durch die Stadt ${h.eur(k30.fine)} und einen Punkt; mit ${h.num(k31.over)} km/h sind es ${h.eur(k31.fine)}, zwei Punkte und ein Monat ohne Führerschein. Der Bußgeldunterschied von ${h.eur(k31.fine - k30.fine)} ist dabei das Geringste. Gerade an diesen Kanten lohnt der Blick auf den Bogen: Stimmt der vorgeworfene Wert mit Messwert minus Toleranz überein, und ist der Ort richtig als innerorts angegeben?</p>

<h2>Motorrad, Transporter, Gespann</h2>
<p>Motorräder und Transporter bis 3,5 t ohne Anhänger zahlen in der Stadt dieselben Sätze wie ein Pkw, denn sie fallen unter Tabelle 1 c. Anders das Gespann: Wer mit Wohnwagen oder Anhänger durch den Ort fährt, wird nach Tabelle 1 a abgerechnet, ebenso Lkw über 3,5 t und Busse. Dort beginnt innerorts der Punkt bereits ab ${h.num(A.find((r) => r.ptInner > 0)!.lo)} km/h, das Fahrverbot ab ${h.num(aFv)} km/h, und schon die Stufe 16 bis 20 km/h kostet ${h.eur(A[2].inner)}. Auf dem Weg in den Urlaub ist das ein häufiger Grund für überraschend hohe Bescheide.</p>

<h2>Leere Straße, drei Uhr nachts</h2>
<p>§ 3 Abs. 3 StVO sagt ausdrücklich, dass die ${h.num(50)} km/h „auch unter günstigsten Umständen“ gelten. Eine leere Straße, trockener Asphalt und gute Sicht ändern an der Grenze nichts, und stationäre Anlagen messen rund um die Uhr. Umgekehrt kann es geboten sein, langsamer zu fahren: Nach § 3 Abs. 1 StVO ist die Geschwindigkeit den Straßen-, Verkehrs-, Sicht- und Wetterverhältnissen anzupassen. Bei Nebel mit weniger als ${h.num(50)} m Sicht sind auch außerorts höchstens ${h.num(50)} km/h erlaubt.</p>

<h2>Warum die Stadt teurer ist</h2>
<p>Der Katalog setzt innerorts in jeder Stufe einen höheren Betrag an als außerorts. Bei ${h.num(in40.over)} km/h zu viel sind es in der Stadt ${h.eur(in40.fine)}, zwei Punkte und ein Monat Fahrverbot, auf der Landstraße ${h.eur(out40.fine)}, ein Punkt und kein Fahrverbot. Der größte Abstand zwischen beiden Spalten beträgt ${h.eur(maxDiff)}. Der Grund liegt auf der Hand: In der Stadt sind Fußgänger, Radfahrer und Kinder unterwegs, und der Anhalteweg wächst mit jedem km/h überproportional. Wie die Spalte außerorts aussieht, zeigt die Seite ${h.a('geblitzt-ausserorts', 'geblitzt außerorts')}.</p>

<h2>Wiederholung in der Stadt</h2>
<p>Wer zwischen ${h.num(V.beharrlich_kmh)} und ${h.num(fvAb - 1)} km/h zu schnell war, bekommt innerorts einen Punkt, aber kein Fahrverbot. Das ändert sich, wenn innerhalb von ${h.num(V.beharrlich_monate)} Monaten nach Rechtskraft eines früheren Bescheids über mindestens ${h.num(V.beharrlich_kmh)} km/h eine zweite solche Überschreitung folgt. Dann sieht § 4 Abs. 2 BKatV in der Regel einen Monat Fahrverbot vor, egal ob die Taten in der Stadt oder auf der Landstraße lagen. Ein Pendler, der auf demselben Weg zweimal in die gleiche stationäre Anlage fährt, kann so ohne groben Einzelverstoß ein Fahrverbot bekommen.</p>

<h2>Besondere Orte in der Stadt</h2>
<p>Vor Schulen und Kitas ordnen Gemeinden oft Tempo 30 zu bestimmten Zeiten an, etwa werktags von 7 bis 17 Uhr. Außerhalb dieser Zeiten gilt die allgemeine Grenze. Die Zeit steht auf einem Zusatzzeichen unter dem Schild; maßgeblich ist der Zeitpunkt der Messung, der auf dem Foto vermerkt ist. Der Katalog sieht für diese Orte keinen Zuschlag vor. Behörden dürfen nach § 17 Abs. 3 OWiG die Bedeutung der Tat berücksichtigen, müssen eine Abweichung vom Regelsatz aber im Bescheid begründen.</p>
<p>Bei Baustellen in der Stadt gilt dasselbe: Das Schild ordnet die Grenze an, der Katalog bewertet nach der Spalte innerorts. Mobile Blitzer werden gerade an solchen Stellen aufgestellt, weil Arbeiter am Fahrbahnrand stehen.</p>

<h2>Fahranfänger in der Stadt</h2>
<p>In der Probezeit gilt jede Überschreitung ab ${h.num(ptAb)} km/h als A-Verstoß. Schon einer führt zum Aufbauseminar und verlängert die Probezeit um ${h.num(P.probezeit.verlaengerung_jahre)} Jahre. In der 30er-Zone liegt diese Grenze bei einem Messwert von ${h.num(30 + ptAb + T.kmh_bis_100)} km/h. Den eigenen Fall, mit Messwert, Tempolimit und Fahrzeug, rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')} durch.</p>`,
  },
  en: {
    slug: 'speeding-in-town-germany',
    nav: 'Speeding in town',
    card: 'Speeding in German towns and 30 zones: every band with the full amount due.',
    title: 'Speeding in Town Germany 2026: 50 km/h, 30 Zones, Fines',
    description: `Speeding in a German town 2026: 50 km/h by default, 30 zones priced alike, totals including fees. A point from ${ptAb} km/h over, a one-month ban from ${fvAb} km/h.`,
    h1: 'Speeding in German towns: 50 km/h, 30 zones and what you pay',
    intro: 'Inside a built-up area every band costs more than on the open road, and the driving ban starts 10 km/h sooner.',
    resume: `Speeding inside a German town is charged at the in-town rates of table 1 c of the national fine catalogue, which are higher in every band than the rates outside towns. Unless a sign says otherwise, the limit in a built-up area is 50 km/h for all motor vehicles under Section 3(3) of the Road Traffic Regulations (StVO), and the area begins at the yellow place-name sign. Excess speed in a 30 zone is priced from the same in-town column. For a car, fines run from ${en(C[0].inner)} to ${en(C[C.length - 1].inner)}. You collect one Flensburg point from ${ptAb} km/h over, and from ${fvAb} km/h over two points and a one-month driving ban (Fahrverbot), rising to two months at ${fv2} km/h and three at ${fv3} km/h. Above ${en(V.verwarnung_max)}, the notice adds a fee of at least ${en(V.gebuehr_min)} and ${en(V.zustellung, 2)} for delivery. At 40 km/h over, the bill comes to ${en(in40.total, 2)} with the ban.`,
    faqs: [
      { q: 'What is the speed limit in German towns when there is no sign?', a: `50 km/h for every motor vehicle, cars, vans, lorries and motorbikes alike, under Section 3(3) StVO. It applies from the yellow place-name sign at the entrance to the town until the same sign, crossed out, on the way out. Many residential streets are signed as 30 zones, and main roads are sometimes signed at 60 or 70 km/h; without a sign, 50 km/h applies.` },
      { q: 'How fast can I go in a German 30 zone before I lose my licence?', a: `A reading of ${30 + fvAb + T.kmh_bis_100} km/h is the threshold. After the ${T.kmh_bis_100} km/h deduction that is ${fvAb} km/h over, and the catalogue sets a one-month ban, two points and ${en(z30.fine)} from that band. At ${30 + fvAb + T.kmh_bis_100 - 1} km/h measured you would still keep your licence, with one point. A 30 zone has no separate column; it is treated like any other in-town street.` },
      { q: 'What does 40 km/h over in a German town cost in total with fees?', a: `${en(in40.fine)} fine, ${en(in40.fees, 2)} in fees and delivery, so ${en(in40.total, 2)}, plus two points and a one-month ban. The same excess outside a town would cost ${en(out40.fine)} with one point and no ban. In a 50 zone you reach 40 km/h over with a camera reading of ${50 + 40 + T.kmh_bis_100} km/h.` },
      { q: 'Does a time-limited 30 sign outside a German school apply at weekends?', a: 'Only if the extra plate under the sign says so. Many schools have 30 km/h on weekdays during set hours; outside those hours the general limit of the street applies, usually 50 km/h. The time on the camera photo decides which limit was in force. The fine catalogue adds no school surcharge, but an authority may weigh the circumstances when setting the amount.' },
    ],
    body: (h) => `
<h2>The default limit and where a town begins</h2>
<p>Under ${h.src('stvo3', 'Section 3(3) StVO')}, the limit inside a built-up area (geschlossene Ortschaft) is ${h.num(50)} km/h for every motor vehicle, "even under the most favourable conditions". The built-up area is defined by signs, not by houses: it begins at the yellow place-name sign with the town's name and ends where the same sign appears with a red diagonal line. A bypass through open fields can count as in town; a road lined with houses beyond the sign does not. Higher limits inside towns exist only where signed.</p>
<p>Lower limits are common. Residential districts are often 30 zones, marked by a sign reading "Zone 30" at every entry point, and individual stretches near schools, nurseries and hospitals may be 30 km/h at set times. For fines, the catalogue only asks whether the place was in town or outside, so 21 km/h over in a 30 zone costs the same as 21 km/h over on a 50 road.</p>

<h2>Every band with the full amount</h2>
<p>These are the in-town rates for cars and motorbikes under table 1 c of the ${h.src('bkatAnhang', 'BKatV annex')}, after the tolerance deduction and assuming no intent. The total column includes the fee and delivery charge set by ${h.src('owig107', 'Section 107 OWiG')}; up to ${h.eur(V.verwarnung_max)} you get a warning fine with no costs.</p>
${h.table(['Over the limit', 'Fine', 'Costs', 'Total', 'Points', 'Ban', 'Reading in a 50 zone from', 'Reading in a 30 zone from'], stufen.map(({ r, o }) => [label(r.lo, r.hi, 'en'), h.eur(o.fine), o.fees ? h.eur(o.fees, 2) : 'none', h.eur(o.total, 2), h.num(o.points), o.fv ? `${h.num(o.fv)} month${o.fv > 1 ? 's' : ''}` : 'no', `${h.num(50 + Math.max(1, r.lo) + T.kmh_bis_100)} km/h`, `${h.num(30 + Math.max(1, r.lo) + T.kmh_bis_100)} km/h`]), 'Car in town, table 1 c (no. 11.3), costs under Section 107 OWiG, as amended on 12 August 2026', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The reading columns show the speed on the camera at which each band begins once ${h.num(T.kmh_bis_100)} km/h has been deducted, the fixed margin set by the ${h.src('ptb', 'PTB')} for readings up to ${h.num(T.grenze_kmh)} km/h. In town almost every reading is below that line, so the fixed deduction is what you will see on your letter.</p>

<h2>The two lines that matter</h2>
<p>At ${h.num(ptAb)} km/h over, the offence is listed in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')} and you get a point in the Flensburg register. At ${h.num(fvAb)} km/h over, it becomes two points and a one-month ban; in a 50 zone that is a reading of ${h.num(50 + fvAb + T.kmh_bis_100)} km/h. The ${h.a('kmh-31', 'page on 31 km/h over')} follows one such case through to the return of the licence. Bans grow quickly in town: two months from ${h.num(fv2)} km/h over and three months from ${h.num(fv3)} km/h, which is also the maximum for speeding. The ${h.a('kmh-51', 'page on 51 km/h over')} covers the two-month band.</p>
<p>If you had no ban in the two years before the offence, you may choose when to hand in your licence within ${h.num(V.fahrverbot_schonfrist_monate)} months of the notice becoming final. A foreign licence is affected too: residents with an EU licence surrender it like a German one, and non-EU licences receive an entry about the ban. More on the ${h.a('fahrverbot', 'driving ban page')}.</p>

<h2>A worked example</h2>
<p>Say a camera on a 50 km/h main road reads ${h.num(96)} km/h. After the deduction you are charged with ${h.num(bspEn.vorwerfbar)} km/h, ${h.num(bspEn.over)} km/h over. The hearing form arrives first, then a fine notice for ${h.eur(bspEn.fine)} plus ${h.eur(bspEn.fees, 2)} in costs, ${h.eur(bspEn.total, 2)} in all, with ${h.num(bspEn.points)} points and a ${h.num(bspEn.fv)}-month ban. If you do not object within two weeks of delivery, the notice becomes final. With no ban in the previous two years, you then have ${h.num(V.fahrverbot_schonfrist_monate)} months to send in your licence at a time that suits you, for instance before a period of working from home. The ban counts from the day the authority receives the licence.</p>

<h2>One km/h at the edge</h2>
<p>The bands have hard edges, and in town the edge at ${h.num(fvAb)} km/h is the one people remember. At ${h.num(k30.over)} km/h over you pay ${h.eur(k30.fine)} and get one point; at ${h.num(k31.over)} km/h over it is ${h.eur(k31.fine)}, two points and a month without driving. The extra ${h.eur(k31.fine - k30.fine)} is the least of it. At these edges it pays to check that the charged speed equals the reading minus the tolerance and that the place is correctly marked as in town.</p>

<h2>Vans, motorbikes and caravans in town</h2>
<p>Motorbikes and vans of up to 3.5 tonnes without a trailer pay the car rates in town, because they fall under table 1 c. Hitch a caravan or trailer and things change: you are charged under table 1 a, like lorries and coaches. In town that table gives a point from ${h.num(A.find((r) => r.ptInner > 0)!.lo)} km/h over, a ban from ${h.num(aFv)} km/h, and ${h.eur(A[2].inner)} for 16 to 20 km/h over. Families driving through villages on the way to a holiday campsite are regularly caught out by this.</p>

<h2>Empty streets at night</h2>
<p>Section 3(3) StVO states that 50 km/h applies "even under the most favourable conditions". An empty road at three in the morning, dry tarmac and perfect visibility change nothing, and fixed cameras work around the clock. The rule also cuts the other way: Section 3(1) requires you to adapt your speed to the road, traffic, visibility and weather, so 50 km/h can be too fast. Fog that cuts visibility below ${h.num(50)} metres limits everyone to ${h.num(50)} km/h, in town or out.</p>

<h2>Town versus country</h2>
<p>The same excess speed always costs more in town. At ${h.num(in40.over)} km/h over, a town costs ${h.eur(in40.fine)}, two points and a month's ban; a country road ${h.eur(out40.fine)}, one point and no ban. The widest gap between the two columns is ${h.eur(maxDiff)}. The logic is about who else is on the road: pedestrians, cyclists and children are everywhere in a German town, and stopping distances grow faster than speed. The out-of-town figures are on the page about ${h.a('geblitzt-ausserorts', 'speeding outside towns')}.</p>

<h2>Schools, roadworks and time plates</h2>
<p>Time-limited limits are common outside schools and nurseries. A white plate under the sign gives the days and hours, and outside them the street's normal limit applies. Since the camera photo carries the exact time, there is rarely any doubt about which limit was in force. The catalogue adds no surcharge for these places; under Section 17(3) OWiG an authority may still take the circumstances into account, and has to explain in the notice if it departs from the standard rate.</p>
<p>Roadworks in town follow the same pattern. The sign sets the limit, and the in-town column sets the price. Mobile cameras are often parked at these sites because workers stand close to the traffic.</p>

<h2>Repeat offences on the daily commute</h2>
<p>Between ${h.num(V.beharrlich_kmh)} and ${h.num(fvAb - 1)} km/h over in town you get a point but no ban. That changes if, within ${h.num(V.beharrlich_monate)} months of an earlier notice for ${h.num(V.beharrlich_kmh)} km/h or more becoming final, you are caught again at that level. Section 4(2) BKatV then usually adds a one-month ban, wherever the two offences took place. Commuters who pass the same fixed camera every day are the typical case.</p>

<h2>New drivers and newcomers</h2>
<p>Drivers in their Probezeit, the two-year probation after a first licence, face an extra track: any excess of ${h.num(ptAb)} km/h or more is an A offence, triggering a remedial course and extending probation by ${h.num(P.probezeit.verlaengerung_jahre)} years. In a 30 zone, that line sits at a reading of ${h.num(30 + ptAb + T.kmh_bis_100)} km/h. The same applies to residents who brought an EU licence less than two years old. To run your own reading with the exact limit and vehicle, use the ${h.a('bussgeldrechner', 'fine calculator')}.</p>`,
  },
});
