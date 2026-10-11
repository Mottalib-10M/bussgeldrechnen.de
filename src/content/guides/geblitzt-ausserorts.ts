import { defineGuide } from '../../lib/guide-types';
import { P, BKAT } from '../../lib/engine/params';
import { speeding, toleranz } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const C = BKAT.speed.filter((r) => r.cls === 'c');
const A = BKAT.speed.filter((r) => r.cls === 'a');
/** Kleinster Messwert, der nach Toleranzabzug mindestens `over` km/h über `limit` liegt. */
const ab = (limit: number, over: number) => { let m = limit + over; while (toleranz(m) - limit < over) m++; return m; };
const stufen = C.map((r) => ({ r, o: speeding({ limit: 100, measured: 100 + Math.max(1, r.lo), inner: false, tolerance: false }) }));
const ptAb = C.find((r) => r.ptOuter > 0)!.lo;
const fvAb = C.find((r) => r.fvOuter > 0)!.lo;
const fv2 = C.find((r) => r.fvOuter >= 2)!.lo;
const fv3 = C.find((r) => r.fvOuter >= 3)!.lo;
const o35 = speeding({ limit: 100, measured: 135, inner: false, tolerance: false });
const o45 = speeding({ limit: 120, measured: 165, inner: false, tolerance: false });
const in35 = speeding({ limit: 50, measured: 85, inner: true, tolerance: false });
const bah = speeding({ limit: 120, measured: ab(120, 32), inner: false });
const beh = speeding({ limit: 100, measured: ab(100, 33), inner: false, prior26: true });
const gesp = speeding({ limit: 80, measured: 106, inner: false, cls: 'a' });
const gespPkw = speeding({ limit: 80, measured: 106, inner: false });
const fall = speeding({ limit: 100, measured: 147, inner: false });
const fallEn = speeding({ limit: 100, measured: 152, inner: false });
const lkw = speeding({ limit: 60, measured: 84, inner: false, cls: 'a' });
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

function label(lo: number, hi: number | null, lang: 'de' | 'en') {
  if (hi === null) return lang === 'de' ? `ab ${lo} km/h` : `${lo} km/h or more`;
  if (lo === 0) return lang === 'de' ? `bis ${hi} km/h` : `up to ${hi} km/h`;
  return lang === 'de' ? `${lo} bis ${hi} km/h` : `${lo} to ${hi} km/h`;
}

export default defineGuide({
  id: 'geblitzt-ausserorts',
  group: 'tempo',
  order: 40,
  mini: 'ausserorts',
  related: ['geblitzt', 'geblitzt-innerorts', 'kmh-41', 'kmh-26', 'fahrverbot', 'bussgeldrechner'],
  sources: ['stvo3', 'bkatAnhang', 'owig107', 'ptb', 'bkatv'],
  de: {
    slug: 'geblitzt-ausserorts',
    nav: 'Geblitzt außerorts',
    card: 'Landstraße und Autobahn: Tempo 100, die Spalte außerorts und das Fahrverbot ab 41 km/h.',
    title: 'Geblitzt außerorts 2026: Landstraße, Autobahn, Bußgeld',
    description: `Geblitzt außerorts 2026: Tempo 100 für Pkw nach § 3 StVO, Autobahn ohne allgemeine Grenze. ${label(C[5].lo, C[5].hi, 'de')} zu schnell ${de(C[5].outer)} und ein Punkt, Fahrverbot ab ${fvAb} km/h.`,
    h1: 'Geblitzt außerorts: Landstraße, Autobahn und die Sätze',
    intro: 'Außerhalb geschlossener Ortschaften sind die Sätze niedriger, das Fahrverbot kommt später, und die Toleranz wächst mit dem Tempo.',
    resume: `Wer außerorts geblitzt wird, zahlt nach Tabelle 1 c des Bußgeldkatalogs die Sätze der Spalte außerorts, die in jeder Stufe unter denen innerorts liegen. Ohne Schild gilt außerhalb geschlossener Ortschaften nach § 3 Abs. 3 StVO für Pkw und andere Kraftfahrzeuge bis 3,5 Tonnen Tempo 100. Diese Grenze gilt nicht auf Autobahnen und nicht auf Straßen mit baulich getrennten Richtungsfahrbahnen oder mindestens zwei markierten Fahrstreifen je Richtung; dort gibt es für Pkw keine allgemeine Höchstgeschwindigkeit, ein ausgeschildertes Limit gilt aber wie jedes andere außerorts. Mit dem Pkw kostet eine Überschreitung ${de(C[0].outer)} bis ${de(C[C.length - 1].outer)}. Ab ${ptAb} km/h zu schnell gibt es einen Punkt. Zwischen ${C[5].lo} und ${C[5].hi} km/h bleibt es bei ${de(C[5].outer)} und einem Punkt ohne Fahrverbot; ab ${fvAb} km/h folgen zwei Punkte und ein Monat, ab ${fv2} km/h zwei und ab ${fv3} km/h drei Monate. Über 100 km/h Messwert zieht die Behörde ${T.prozent_ueber_100 * 100} Prozent Toleranz ab statt ${T.kmh_bis_100} km/h.`,
    faqs: [
      { q: 'Gibt es für 35 km/h zu schnell außerorts ein Fahrverbot?', a: `Nein, nicht nach dem Regelsatz. ${o35.over} km/h zu viel fallen außerorts in die Stufe ${label(o35.row!.lo, o35.row!.hi, 'de')}: ${de(o35.fine)} Bußgeld, mit Kosten ${de(o35.total, 2)}, und ein Punkt. Innerorts gäbe es für dieselbe Überschreitung ${de(in35.fine)}, zwei Punkte und einen Monat. Ein Fahrverbot kann außerorts trotzdem kommen, wenn binnen zwölf Monaten schon einmal mindestens ${V.beharrlich_kmh} km/h rechtskräftig geahndet wurden.` },
      { q: 'Gilt auf einer vierspurigen Bundesstraße außerorts Tempo 100?', a: 'Nicht als allgemeine Grenze. § 3 Abs. 3 StVO nimmt Straßen mit mindestens zwei markierten Fahrstreifen je Richtung und Straßen mit baulich getrennten Richtungsfahrbahnen von den 100 km/h für Pkw aus. Auf solchen Strecken gilt für Pkw, wie auf der Autobahn, nur ein ausgeschildertes Limit. Für Gespanne und schwere Fahrzeuge bleiben die niedrigeren Werte aus derselben Vorschrift bestehen.' },
      { q: 'Wird ein Blitzer auf der Autobahn wie außerorts abgerechnet?', a: `Ja. Die Autobahn liegt außerhalb geschlossener Ortschaften, also gilt die Spalte außerorts der Tabelle 1 c. Bei einem Limit von 120 km/h und einem Messwert ab ${ab(120, o45.over)} km/h bleiben nach Abzug ${o45.over} km/h Überschreitung. Das sind ${de(o45.fine)}, zwei Punkte und ${o45.fv} Monat Fahrverbot, mit Kosten ${de(o45.total, 2)}.` },
      { q: 'Ab welchem Messwert gibt es auf der Landstraße mit Tempo 100 ein Fahrverbot?', a: `Ab ${ab(100, fvAb)} km/h. Über 100 km/h werden ${T.prozent_ueber_100 * 100} Prozent abgezogen und abgerundet; erst bei diesem Messwert bleiben ${fvAb} km/h Überschreitung, die Grenze für einen Monat Fahrverbot außerorts. Bei ${ab(100, fvAb) - 1} km/h Messwert bleibt es bei ${de(C[5].outer)} und einem Punkt. Mit dem Anhänger gelten auf derselben Straße 80 km/h und strengere Sätze.` },
    ],
    body: (h) => `
<h2>Welche Grenze außerorts gilt</h2>
<p>${h.src('stvo3', '§ 3 Abs. 3 Nr. 2 StVO')} staffelt die Höchstgeschwindigkeit außerhalb geschlossener Ortschaften nach Fahrzeugart. Für Pkw und andere Kraftfahrzeuge bis 3,5 t zulässiger Gesamtmasse gilt ${h.num(100)} km/h. ${h.num(80)} km/h gelten unter anderem für Kraftfahrzeuge über 3,5 t bis 7,5 t (ausgenommen Pkw), Pkw mit Anhänger, Lkw und Wohnmobile bis 3,5 t mit Anhänger und Busse. ${h.num(60)} km/h gelten für Fahrzeuge über 7,5 t, für Kraftfahrzeuge mit Anhänger, soweit sie nicht schon genannt sind, und für Busse mit stehenden Fahrgästen.</p>
<p>Die ${h.num(100)} km/h für Pkw haben zwei Ausnahmen, die im Satz danach stehen. Sie gelten nicht auf Autobahnen und nicht auf anderen Straßen mit Fahrbahnen für eine Richtung, die durch Mittelstreifen oder sonstige bauliche Einrichtungen getrennt sind. Sie gelten ferner nicht auf Straßen mit mindestens zwei markierten Fahrstreifen für jede Richtung. Auf solchen Strecken gibt es für Pkw keine allgemeine Höchstgeschwindigkeit nach § 3 StVO. Wo dort ein Schild 120 oder 80 anordnet, gilt dieses Limit genau wie jede andere Grenze außerorts, und ein Verstoß wird nach derselben Spalte abgerechnet.</p>

<h2>Die Tabelle außerorts mit allen Kosten</h2>
<p>Pkw und Motorräder, Tabelle 1 c im ${h.src('bkatAnhang', 'Anhang der BKatV')}, nach Toleranzabzug und ohne Vorsatz. „Gesamt“ enthält Gebühr und Zustellung nach ${h.src('owig107', '§ 107 OWiG')}. Die beiden rechten Spalten zeigen, ab welchem Messwert die Stufe beginnt, einmal auf der Landstraße mit Tempo 100 und einmal unter einem Schild mit 120 km/h.</p>
${h.table(['Zu schnell', 'Bußgeld', 'Kosten', 'Gesamt', 'Punkte', 'Fahrverbot', 'Messwert bei 100 ab', 'Messwert bei 120 ab'], stufen.map(({ r, o }) => [label(r.lo, r.hi, 'de'), h.eur(o.fine), o.fees ? h.eur(o.fees, 2) : 'keine', h.eur(o.total, 2), h.num(o.points), o.fv ? `${h.num(o.fv)} Monat${o.fv > 1 ? 'e' : ''}` : 'nein', `${h.num(ab(100, Math.max(1, r.lo)))} km/h`, `${h.num(ab(120, Math.max(1, r.lo)))} km/h`]), 'Pkw außerorts, Tabelle 1 c (Nr. 11.3), Kosten nach § 107 OWiG, Stand 12.8.2026', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}

<h2>Ein Fall von der Landstraße</h2>
<p>Ein Pkw wird auf einer Bundesstraße ohne Schild, also bei Tempo 100, mit ${h.num(147)} km/h gemessen. Die Behörde zieht ${h.num(T.prozent_ueber_100 * 100)} Prozent ab und rundet ab: vorgeworfen werden ${h.num(fall.vorwerfbar)} km/h, ${h.num(fall.over)} km/h zu viel. Das ist die erste Stufe mit Fahrverbot. Der Bescheid lautet auf ${h.eur(fall.fine)}, ${h.eur(fall.fees, 2)} Gebühr und Zustellung, zusammen ${h.eur(fall.total, 2)}, dazu ${h.num(fall.points)} Punkte und ${h.num(fall.fv)} Monat Fahrverbot. Hätte das Gerät ${h.num(ab(100, fvAb) - 1)} km/h angezeigt, wäre es bei ${h.eur(C[5].outer)} und einem Punkt geblieben. Gerade auf der Landstraße liegen viele Messungen nahe an dieser Kante, weshalb der Blick auf Messwert und Abzug im Anhörungsbogen sich lohnt.</p>

<h2>Ortsausgang: wo außerorts beginnt</h2>
<p>Die Spalte außerorts gilt ab der Rückseite der gelben Ortstafel. Wer schon vor dem Schild beschleunigt, fährt rechtlich noch innerorts, und dort gelten die höheren Sätze. Umgekehrt beginnt die innerörtliche Grenze erst mit der Vorderseite der Ortstafel am Ortseingang, auch wenn davor schon Häuser stehen. Steht am Ortsausgang ein Schild mit 70 km/h, ist das eine angeordnete Grenze außerorts; eine Überschreitung dort wird nach der Spalte außerorts bewertet. Ob die Behörde den Messpunkt richtig eingeordnet hat, steht im Anhörungsbogen; beim Unterschied zwischen den Spalten von bis zu ${h.eur(Math.max(...C.map((r) => r.inner - r.outer)))} ist das keine Kleinigkeit.</p>

<h2>Lkw und Transporter über 3,5 t</h2>
<p>Für schwere Fahrzeuge gelten außerorts niedrigere Grenzen und eine strengere Tabelle. Über 3,5 t bis 7,5 t sind es ${h.num(80)} km/h, über 7,5 t ${h.num(60)} km/h, und beide fallen unter Tabelle 1 a. Ein Lkw über 7,5 t, der auf der Landstraße mit ${h.num(84)} km/h gemessen wird, liegt nach Abzug ${h.num(lkw.over)} km/h über seiner Grenze: ${h.eur(lkw.fine)}, ${h.num(lkw.points)} Punkt${lkw.points > 1 ? 'e' : ''}${lkw.fv ? ` und ${h.num(lkw.fv)} Monat Fahrverbot` : ''}. Ein Transporter bis 3,5 t ohne Anhänger zählt dagegen wie ein Pkw.</p>

<h2>Warum die Toleranz außerorts größer wird</h2>
<p>Die ${h.src('ptb', 'PTB')} setzt die Verkehrsfehlergrenze bis ${h.num(T.grenze_kmh)} km/h Messwert auf ${h.num(T.kmh_bis_100)} km/h, darüber auf ${h.num(T.prozent_ueber_100 * 100)} Prozent. Innerorts spielt das kaum eine Rolle, außerorts ständig. Auf der Landstraße liegt fast jeder Verstoß über ${h.num(T.grenze_kmh)} km/h, auf der Autobahn sowieso. Die Folge sieht man in der Tabelle: Bei Tempo 120 braucht es für 21 km/h zu viel einen Messwert von ${h.num(ab(120, 21))} km/h, nicht ${h.num(120 + 21 + T.kmh_bis_100)}. Je höher das Tempo, desto mehr Spielraum bleibt nach dem Abrunden zugunsten des Fahrers. Die Rechnung im Einzelnen steht auf der Seite ${h.a('geblitzt', 'Geblitzt')}.</p>

<h2>31 bis 40 km/h: Punkt ja, Fahrverbot nein</h2>
<p>Die Stufe ${label(C[5].lo, C[5].hi, 'de')} zeigt den Unterschied zwischen Stadt und Land am deutlichsten. Innerorts bedeutet sie ${h.eur(C[5].inner)}, zwei Punkte und einen Monat Fahrverbot. Außerorts bleibt es bei ${h.eur(C[5].outer)} und ${h.num(C[5].ptOuter)} Punkt; der Führerschein bleibt im Portemonnaie. Wer auf der Landstraße mit Tempo 100 bei ${h.num(ab(100, C[5].hi!))} km/h gemessen wird, liegt nach Abzug bei ${h.num(C[5].hi!)} km/h zu viel und damit noch in dieser Stufe. Einen km/h mehr, und es beginnt die Stufe mit Fahrverbot, die auf der Seite ${h.a('kmh-41', '41 km/h zu schnell')} beschrieben ist.</p>
<p>Diese Stufe hat aber eine Falle: Sie liegt über ${h.num(V.beharrlich_kmh)} km/h. Wer innerhalb von ${h.num(V.beharrlich_monate)} Monaten nach Rechtskraft eines Bescheids über mindestens ${h.num(V.beharrlich_kmh)} km/h erneut so schnell ist, bekommt nach § 4 Abs. 2 der ${h.src('bkatv', 'BKatV')} in der Regel einen Monat Fahrverbot. Mit ${h.num(beh.over)} km/h zu viel und einer solchen Voreintragung lautet der Bescheid auf ${h.eur(beh.fine)}, ${h.num(beh.points)} Punkt und ${h.num(beh.fv)} Monat. Den Fall erklärt die Seite ${h.a('kmh-26', '26 km/h zu schnell')}.</p>

<h2>Ab 41 km/h: der Monat ohne Führerschein</h2>
<p>Ab ${h.num(fvAb)} km/h zu viel sieht die Spalte außerorts ein Fahrverbot vor: ein Monat bis ${h.num(fv2 - 1)} km/h, zwei Monate ab ${h.num(fv2)} km/h, drei Monate ab ${h.num(fv3)} km/h. Die Stufen liegen jeweils zehn km/h später als innerorts. Die Punkte springen auf zwei. Für das erste Fahrverbot seit zwei Jahren gilt die Viermonatsfrist: Der Führerschein wird innerhalb von ${h.num(V.fahrverbot_schonfrist_monate)} Monaten nach Rechtskraft abgegeben, zu einem selbst gewählten Zeitpunkt. Was beim Abgeben zu beachten ist, steht unter ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Autobahn: das Schild entscheidet</h2>
<p>Viele Autobahnabschnitte sind dauerhaft begrenzt, andere über elektronische Anzeigen je nach Verkehr und Wetter. Eine leuchtende Anzeige ist ein Verkehrszeichen wie ein Blechschild. Baustellen ordnen oft 80 oder 60 km/h an, und gerade dort stehen mobile Anlagen. Abgerechnet wird immer nach der Spalte außerorts. Ein Beispiel: Limit 120, gemessen ${h.num(ab(120, 32))} km/h, vorgeworfen ${h.num(bah.vorwerfbar)} km/h, also ${h.num(bah.over)} km/h zu viel. Das ergibt ${h.eur(bah.fine)}, mit Kosten ${h.eur(bah.total, 2)}, und ${h.num(bah.points)} Punkt, aber kein Fahrverbot.</p>
<p>Auf Abschnitten ohne Schild gibt es für Pkw keine Höchstgeschwindigkeit, die geblitzt werden könnte. Anders ist es für Fahrzeuge, für die § 3 Abs. 3 StVO eine niedrigere Grenze festlegt, etwa Gespanne: Deren Werte aus Nummer 2 Buchstabe a und b sind von der Ausnahme für Autobahnen nicht erfasst.</p>

<h2>Mit Anhänger auf der Landstraße</h2>
<p>Wer einen Wohnwagen zieht, fährt außerorts mit höchstens ${h.num(80)} km/h und wird nach Tabelle 1 a abgerechnet. Gemessene ${h.num(106)} km/h ergeben nach Abzug ${h.num(gesp.over)} km/h zu viel. Mit dem Gespann kostet das ${h.eur(gesp.fine)} und ${h.num(gesp.points)} Punkt. Ein Pkw ohne Anhänger wäre bei derselben Messung unter einem 80er-Schild mit ${h.eur(gespPkw.fine)} davongekommen. In Tabelle 1 a beginnt der Punkt außerorts schon ab ${h.num(A.find((r) => r.ptOuter > 0)!.lo)} km/h, das Fahrverbot ab ${h.num(A.find((r) => r.fvOuter > 0)!.lo)} km/h.</p>

<h2>Was außerorts sonst gilt</h2>
<p>Unabhängig von jedem Schild gilt: Bei Sichtweiten unter ${h.num(50)} m durch Nebel, Schneefall oder Regen höchstens ${h.num(50)} km/h, mit Schneeketten ebenfalls ${h.num(50)} km/h (§ 3 Abs. 1 und 4 StVO). Wer also bei dichtem Nebel auf der Autobahn mit 90 km/h gemessen wird, kann eine Überschreitung begangen haben, obwohl dort kein Schild stand. Für Fahranfänger zählt jede eingetragene Überschreitung außerorts genauso als A-Verstoß wie in der Stadt, also ab ${h.num(ptAb)} km/h zu viel. Den eigenen Fall rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')}.</p>`,
  },
  en: {
    slug: 'speeding-outside-towns-germany',
    nav: 'Speeding outside towns',
    card: 'Country roads and the Autobahn: 100 km/h by default, lower fines, a ban from 41 km/h over.',
    title: 'Speeding Outside Towns Germany 2026: Country Roads, Autobahn',
    description: `Speeding outside towns in Germany 2026: 100 km/h for cars on country roads, no general Autobahn limit. ${C[5].lo} to ${C[5].hi} km/h over costs ${en(C[5].outer)}; a ban from ${fvAb} km/h.`,
    h1: 'Speeding outside German towns: country roads and the Autobahn',
    intro: 'Outside built-up areas the fines are lower, the ban comes later, and the tolerance grows with your speed.',
    resume: `Speeding outside a German town is charged from the out-of-town column of table 1 c in the national fine catalogue, which is cheaper in every band than the in-town column. Without a sign, the limit on country roads is 100 km/h for cars and other vehicles up to 3.5 tonnes under Section 3(3) of the Road Traffic Regulations (StVO). That default does not apply on the Autobahn or on roads with physically separated carriageways or at least two marked lanes in each direction; there, cars have no general limit, but any limit shown on a sign binds you like every other out-of-town limit. Fines for a car run from ${en(C[0].outer)} to ${en(C[C.length - 1].outer)}. You get a Flensburg point from ${ptAb} km/h over. At ${C[5].lo} to ${C[5].hi} km/h over it stays at ${en(C[5].outer)} and one point with no ban; from ${fvAb} km/h over, two points and a one-month driving ban follow, two months from ${fv2} km/h and three from ${fv3} km/h. Above 100 km/h measured, the tolerance deducted is ${T.prozent_ueber_100 * 100} per cent rather than ${T.kmh_bis_100} km/h.`,
    faqs: [
      { q: 'Is there a general speed limit for cars on the German Autobahn?', a: 'Not under the general rules. Section 3(3) StVO sets 100 km/h for cars outside towns but expressly excludes motorways and roads with separated carriageways or two marked lanes each way. Many motorway stretches are nevertheless signed, permanently or through electronic gantries, and a signed limit is binding. Fines for breaking it come from the out-of-town column of the catalogue.' },
      { q: 'What is the speed limit on a German country road when towing a trailer?', a: `80 km/h for a car with a trailer under Section 3(3) StVO, unless a sign sets something lower. Speeding with the trailer is also charged under table 1 a, with higher rates than a car alone: a camera reading of 106 km/h on an 80 road gives ${gesp.over} km/h over, ${en(gesp.fine)} and ${gesp.points} point, against ${en(gespPkw.fine)} for the same excess in a car without a trailer.` },
      { q: 'How far over the limit can I be on a German country road before I get a ban?', a: `Up to ${C[5].hi} km/h over after the deduction, the regular rate outside towns is ${en(C[5].outer)} and one point, with no ban. From ${fvAb} km/h over, a one-month ban applies. On a 100 road, that line is crossed at a camera reading of ${ab(100, fvAb)} km/h. A second offence of ${V.beharrlich_kmh} km/h or more within a year can still bring a ban below that line.` },
      { q: 'Why does the tolerance deduction get bigger on German motorways?', a: `Because above a reading of ${T.grenze_kmh} km/h the deduction is ${T.prozent_ueber_100 * 100} per cent of the measured speed rather than a fixed ${T.kmh_bis_100} km/h, rounded down in your favour. At 165 km/h measured, ${165 - toleranz(165)} km/h are subtracted. These margins are the error limits that the national metrology institute (PTB) sets for approved speed meters.` },
    ],
    body: (h) => `
<h2>Default limits outside towns</h2>
<p>${h.src('stvo3', 'Section 3(3) StVO')} sets limits outside built-up areas by type of vehicle. Cars and other vehicles up to 3.5 tonnes permitted total weight: ${h.num(100)} km/h. Cars towing a trailer, vans and motorhomes up to 3.5 tonnes with a trailer, vehicles from 3.5 to 7.5 tonnes and coaches: ${h.num(80)} km/h. Vehicles over 7.5 tonnes, other vehicles with trailers and buses with standing passengers: ${h.num(60)} km/h.</p>
<p>The 100 km/h car limit does not apply on the Autobahn, on other roads whose carriageways are separated by a central reservation or other structure, or on roads with at least two marked lanes in each direction. That means many dual carriageways have no general limit for cars, just like motorways. Where a sign sets a limit on such a road, it binds you exactly like any other out-of-town limit and is charged from the same column. The lower limits for vehicles with trailers and heavy vehicles are not affected by the motorway exception.</p>

<h2>Every band outside towns</h2>
<p>Cars and motorbikes, table 1 c of the ${h.src('bkatAnhang', 'BKatV annex')}, after the deduction and assuming no intent. The total includes fees under ${h.src('owig107', 'Section 107 OWiG')}. The two right-hand columns show the camera reading at which each band starts, on a 100 km/h country road and under a 120 km/h sign.</p>
${h.table(['Over the limit', 'Fine', 'Costs', 'Total', 'Points', 'Ban', 'Reading at 100 from', 'Reading at 120 from'], stufen.map(({ r, o }) => [label(r.lo, r.hi, 'en'), h.eur(o.fine), o.fees ? h.eur(o.fees, 2) : 'none', h.eur(o.total, 2), h.num(o.points), o.fv ? `${h.num(o.fv)} month${o.fv > 1 ? 's' : ''}` : 'no', `${h.num(ab(100, Math.max(1, r.lo)))} km/h`, `${h.num(ab(120, Math.max(1, r.lo)))} km/h`]), 'Car outside towns, table 1 c (no. 11.3), costs under Section 107 OWiG, as amended on 12 August 2026', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}

<h2>A worked example from a country road</h2>
<p>A car is measured at ${h.num(152)} km/h on a main road with no sign, so the limit is 100. The authority deducts ${h.num(T.prozent_ueber_100 * 100)} per cent and rounds down: ${h.num(fallEn.vorwerfbar)} km/h charged, ${h.num(fallEn.over)} km/h over. The notice reads ${h.eur(fallEn.fine)} plus ${h.eur(fallEn.fees, 2)} in costs, ${h.eur(fallEn.total, 2)} in total, ${h.num(fallEn.points)} points and a ${h.num(fallEn.fv)}-month ban. Under the old habit of thinking in mph, that is a little over 90 mph on a road where about 62 mph is allowed. Many people new to Germany assume that open country roads are generous. They are not: 100 km/h is the default on most of them, and fixed and mobile cameras are common on long straights.</p>

<h2>Leaving a town</h2>
<p>The out-of-town column starts at the back of the yellow place-name sign, the side with a red diagonal line. Accelerate before you pass it and you are still legally in town, where the rates are higher. Coming the other way, the town limit starts at the sign itself, even if houses appear earlier. A 70 km/h sign just outside a village is an out-of-town limit, and breaking it is priced from the out-of-town column. The hearing form states which column applies; with gaps of up to ${h.eur(Math.max(...C.map((r) => r.inner - r.outer)))} between them, that line deserves a careful read.</p>

<h2>Vans, lorries and moving day</h2>
<p>Heavier vehicles have lower limits outside towns and a stricter table. From 3.5 to 7.5 tonnes the limit is ${h.num(80)} km/h, above 7.5 tonnes ${h.num(60)} km/h, and both are charged under table 1 a. A lorry over 7.5 tonnes measured at ${h.num(84)} km/h on a country road is ${h.num(lkw.over)} km/h over its limit: ${h.eur(lkw.fine)} and ${h.num(lkw.points)} point${lkw.points > 1 ? 's' : ''}${lkw.fv ? ` with a ${h.num(lkw.fv)}-month ban` : ''}. A hire van of up to 3.5 tonnes without a trailer, the usual choice for moving house, counts as a car.</p>

<h2>The tolerance at higher speeds</h2>
<p>The ${h.src('ptb', 'PTB')}, Germany's metrology institute, sets an error limit of ${h.num(T.kmh_bis_100)} km/h for readings up to ${h.num(T.grenze_kmh)} km/h and ${h.num(T.prozent_ueber_100 * 100)} per cent above. Outside towns most readings are above ${h.num(T.grenze_kmh)} km/h, so the percentage is what you will see on your letter. Under a 120 sign, 21 km/h over needs a reading of ${h.num(ab(120, 21))} km/h rather than ${h.num(120 + 21 + T.kmh_bis_100)}. In mph terms, the margin at motorway speeds is roughly 2 to 3 mph. The full method is on the page about ${h.a('geblitzt', 'speed cameras')}.</p>

<h2>The band that keeps your licence</h2>
<p>At ${label(C[5].lo, C[5].hi, 'en')} over, the difference between town and country is starkest. In town it means ${h.eur(C[5].inner)}, two points and a month's ban. Outside towns it is ${h.eur(C[5].outer)} and ${h.num(C[5].ptOuter)} point, and you keep driving. On a 100 road a reading of ${h.num(ab(100, C[5].hi!))} km/h still falls in this band; one more km/h and you are in the ban band covered on the ${h.a('kmh-41', 'page on 41 km/h over')}.</p>
<p>The catch is the repeat rule. This band is above ${h.num(V.beharrlich_kmh)} km/h, so if a fine for ${h.num(V.beharrlich_kmh)} km/h or more became final in the previous ${h.num(V.beharrlich_monate)} months, Section 4(2) of the ${h.src('bkatv', 'fine catalogue ordinance')} usually adds a one-month ban. With ${h.num(beh.over)} km/h over and such a previous entry, the notice reads ${h.eur(beh.fine)}, ${h.num(beh.points)} point and ${h.num(beh.fv)} month. The ${h.a('kmh-26', 'page on 26 km/h over')} explains how the twelve months are counted.</p>

<h2>From 41 km/h over</h2>
<p>From ${h.num(fvAb)} km/h over, the out-of-town column brings a ban: one month up to ${h.num(fv2 - 1)} km/h, two months from ${h.num(fv2)} km/h and three months from ${h.num(fv3)} km/h, each step ten km/h later than in town, always with two points. For a first ban in two years you choose when to hand in your licence within ${h.num(V.fahrverbot_schonfrist_monate)} months of the notice becoming final. Residents with an EU licence surrender it to the authority; holders of non-EU licences get an entry noting the ban. The ${h.a('fahrverbot', 'driving ban page')} explains the practical steps.</p>

<h2>Motorway signs and roadworks</h2>
<p>Expect limits on the Autobahn more often than its reputation suggests. Many stretches are signed permanently, and overhead gantries can show a lower figure when traffic or weather calls for it. A lit gantry sign is a traffic sign. Roadworks typically drop to 80 or 60 km/h, and mobile cameras are common there. Example: limit 120, reading ${h.num(ab(120, 32))} km/h, charged ${h.num(bah.vorwerfbar)} km/h, ${h.num(bah.over)} km/h over. That costs ${h.eur(bah.fine)}, ${h.eur(bah.total, 2)} with fees, and ${h.num(bah.points)} point, with no ban.</p>
<p>On unrestricted stretches there is no limit for a car to break. That is not true for everyone: a car with a caravan stays at its ${h.num(80)} km/h limit on the motorway, because the exception in Section 3(3) only lifts the car limit.</p>

<h2>Towing on country roads</h2>
<p>With a caravan or trailer you are charged under table 1 a. A reading of ${h.num(106)} km/h on an 80 road gives ${h.num(gesp.over)} km/h over: ${h.eur(gesp.fine)} and ${h.num(gesp.points)} point with the trailer, against ${h.eur(gespPkw.fine)} for a solo car under the same sign. In table 1 a, points outside towns start at ${h.num(A.find((r) => r.ptOuter > 0)!.lo)} km/h over and bans at ${h.num(A.find((r) => r.fvOuter > 0)!.lo)} km/h.</p>

<h2>Weather and new drivers</h2>
<p>Some limits need no sign. When fog, snow or rain cuts visibility below ${h.num(50)} metres, the maximum is ${h.num(50)} km/h, and the same applies with snow chains fitted (Section 3(1) and (4) StVO). A driver measured at 90 km/h on the Autobahn in thick fog may therefore have broken the limit with no sign in sight. For drivers on probation, any out-of-town offence from ${h.num(ptAb)} km/h over counts as an A offence, exactly as in town. To check your own case, use the ${h.a('bussgeldrechner', 'fine calculator')}.</p>`,
  },
});
