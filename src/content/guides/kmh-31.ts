import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding } from '../../lib/engine/bkat';
import { formatMoney, formatDecimal } from '../../lib/format';

const V = P.verfahren, T = P.toleranz, PK = P.punkte;
const inn = speeding({ limit: 50, measured: 81, inner: true, tolerance: false });
const out = speeding({ limit: 100, measured: 131, inner: false, tolerance: false });
const tilgung = (pts: number) => (pts >= 2 ? PK.tilgung_2p_monate : PK.tilgung_1p_monate) / 12;
/** Innerorts und außerorts nebeneinander, an beiden Rändern der Stufe und davor. */
const vergleich = [30, 31, 40].map((over) => ({
  over,
  i: speeding({ limit: 50, measured: 50 + over, inner: true, tolerance: false }),
  o: speeding({ limit: 100, measured: 100 + over, inner: false, tolerance: false }),
}));
const anhInn = speeding({ limit: 50, measured: 81, inner: true, tolerance: false, cls: 'a' });
const anhOut = speeding({ limit: 80, measured: 111, inner: false, tolerance: false, cls: 'a' });
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-31',
  group: 'tempo',
  order: 150,
  mini: 'kmh31',
  related: ['kmh-26', 'kmh-41', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'geblitzt-innerorts', 'fahrverbot'],
  sources: ['bkatAnhang', 'fevAnl13', 'stvg29', 'stvg25', 'owig107'],
  de: {
    slug: '31-kmh-zu-schnell',
    nav: '31 km/h zu schnell',
    card: 'Innerorts Fahrverbot und zwei Punkte, außerorts ein Punkt: die ungleichste Stufe.',
    title: '31 km/h zu schnell 2026: innerorts Fahrverbot, sonst nicht',
    description: `31 km/h zu schnell 2026: innerorts ${de(inn.fine)}, zwei Punkte und ein Monat Fahrverbot, außerorts ${de(out.fine)} und ein Punkt ohne Fahrverbot. Der Ortsschild-Unterschied.`,
    h1: '31 km/h zu schnell: warum der Ort über das Fahrverbot entscheidet',
    intro: 'In keiner anderen Stufe der Tempotabelle liegen innerorts und außerorts so weit auseinander wie zwischen 31 und 40 km/h.',
    resume: `Wer mit dem Pkw 31 bis 40 km/h zu schnell war, erlebt die größte Asymmetrie des Bußgeldkatalogs. Innerorts kostet die Stufe ${de(inn.fine)}, bringt zwei Punkte und einen Monat Fahrverbot; mit Gebühren stehen ${de(inn.total, 2)} auf dem Bescheid. Außerorts sind es ${de(out.fine)}, ein Punkt und kein Fahrverbot, zusammen ${de(out.total, 2)}. Der Unterschied reicht über das Geld hinaus: Zwei Punkte werden erst nach ${formatDecimal(tilgung(2), 1, 'de')} Jahren tilgungsreif, ein Punkt nach ${formatDecimal(tilgung(1), 1, 'de')} Jahren. Entscheidend ist allein, ob die Messung innerhalb geschlossener Ortschaften lag, also hinter dem gelben Ortsschild, nicht das erlaubte Tempo. Außerorts bleibt eine Falle: Wer binnen eines Jahres nach einem rechtskräftigen Bescheid über mindestens ${V.beharrlich_kmh} km/h erneut 31 km/h zu schnell ist, bekommt auch dort einen Monat Fahrverbot. In der Probezeit ist die Stufe an beiden Orten ein A-Verstoß.`,
    faqs: [
      { q: 'Wie viel kostet 31 km/h zu schnell innerorts mit Fahrverbot?', a: `${de(inn.fine)} Bußgeld, ${de(inn.fees, 2)} Gebühr und Zustellung, zusammen ${de(inn.total, 2)}. Dazu kommen zwei Punkte in Flensburg und ein Monat Fahrverbot nach Tabelle 1 c der BKatV. Wer in den zwei Jahren davor kein Fahrverbot hatte, darf den Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft selbst wählen.` },
      { q: 'Warum gibt es für 31 km/h zu schnell außerorts kein Fahrverbot?', a: `Weil der Verordnungsgeber die Gefahr außerhalb geschlossener Ortschaften für diese Stufe geringer bewertet. Tabelle 1 c sieht dort ${de(out.fine)} und einen Punkt vor, das Fahrverbot setzt außerorts erst ab 41 km/h ein. Ausnahme: Gab es binnen eines Jahres vor der Tat einen rechtskräftigen Bescheid über mindestens ${V.beharrlich_kmh} km/h, wird nach § 4 Abs. 2 BKatV in der Regel doch ein Monat fällig.` },
      { q: 'Gilt eine Ortsdurchfahrt mit Tempo 70 als innerorts?', a: 'Das hängt vom Ortsschild ab, nicht vom Tempolimit. Liegt die Messstelle hinter dem gelben Ortsschild, gilt sie als innerorts, auch wenn dort 70 km/h erlaubt sind. Umgekehrt bleibt eine Landstraße mit Tempo 50 vor dem Ortsschild außerorts. Bei 31 km/h zu schnell entscheidet diese Frage über zwei Punkte und ein Fahrverbot oder einen Punkt ohne Fahrverbot.' },
      { q: 'Wie lange bleiben die zwei Punkte für 31 km/h innerorts in Flensburg?', a: `Ein Verstoß mit zwei Punkten wird nach § 29 StVG ${PK.tilgung_2p_monate} Monate nach Rechtskraft tilgungsreif, danach folgt noch eine Überliegefrist von ${PK.ueberliege_monate} Monaten. Die gleiche Überschreitung außerorts mit einem Punkt ist schon nach ${PK.tilgung_1p_monate} Monaten tilgungsreif. Der Ort der Messung wirkt also doppelt so lange nach.` },
      { q: 'Gelten für Motorräder bei 31 km/h zu schnell dieselben Sätze wie für Autos?', a: `Ja. Motorräder fallen wie Pkw unter Tabelle 1 c des Bußgeldkatalogs. Innerorts sind es also ebenfalls ${de(inn.fine)}, zwei Punkte und ein Monat Fahrverbot, außerorts ${de(out.fine)} und ein Punkt. Das Fahrverbot erfasst Kraftfahrzeuge aller Art, sofern der Bescheid es nicht auf bestimmte Fahrzeugarten beschränkt. Wer Auto und Motorrad fährt, muss in diesem Monat also beides stehen lassen.` },
    ],
    body: (h) => `
<h2>Gleiche Geschwindigkeit, zwei verschiedene Strafen</h2>
<p>Zwischen 31 und 40 km/h trennt der Bußgeldkatalog die beiden Spalten so deutlich wie nirgends sonst. Innerorts ist dies die erste Stufe mit Fahrverbot. Außerorts gilt die Stufe noch als gewöhnliche Ordnungswidrigkeit mit einem Punkt. Die Logik dahinter: In der Stadt treffen schnelle Autos auf Fußgänger, Radfahrer, Kinder und Ausfahrten, und 31 km/h über Tempo 50 bedeuten mehr als 60 Prozent über dem Limit. Auf der Landstraße mit Tempo 100 sind 31 km/h knapp ein Drittel. Für Betroffene bedeutet das: Wer dieselbe Überschreitung an zwei Tagen begeht, einmal im Dorf und einmal auf der Bundesstraße davor, bekommt zwei ganz unterschiedliche Bescheide.</p>
${h.table(['Zu schnell', 'Innerorts', 'Punkte / Fahrverbot', 'Außerorts', 'Punkte / Fahrverbot'], vergleich.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), `${h.num(i.points)} / ${i.fv ? `${h.num(i.fv)} Monat` : 'nein'}`, h.eur(o.fine), `${h.num(o.points)} / ${o.fv ? `${h.num(o.fv)} Monat` : 'nein'}`]), 'Pkw, Werte nach Toleranz, Tabelle 1 c des Anhangs zur BKatV', ['l', 'r', 'l', 'r', 'l'])}

<h2>Das Ortsschild als Grenze</h2>
<p>Ob eine Messung innerorts oder außerorts stattfand, bestimmt das Zeichen 310 der StVO, das gelbe Ortsschild. Dahinter beginnt die geschlossene Ortschaft, mit dem Ortsende-Schild endet sie. Das erlaubte Tempo spielt dafür keine Rolle. Auf einer gut ausgebauten Ortsdurchfahrt mit Tempo 70 gelten die Innerortssätze, auf einer Landstraße mit Tempo 50 vor einer Kreuzung die Außerortssätze. Für die Stufe 31 bis 40 km/h ist das die entscheidende Angabe im Anhörungsbogen, gleich nach der Geschwindigkeit. Steht dort »innerhalb geschlossener Ortschaften«, gehört ein Fahrverbot zum Regelfall. Die Seite ${h.a('geblitzt-innerorts', 'Geblitzt innerorts')} zeigt alle Stufen der linken Spalte.</p>

<h2>Zwei Punkte gegen einen: die Folgen über Jahre</h2>
<p>Ein Fahrverbot macht den Verstoß nach ${h.src('fevAnl13', 'Anlage 13 der FeV')} zu einer besonders verkehrssicherheitsbeeinträchtigenden Ordnungswidrigkeit, und die wird mit zwei Punkten bewertet. Das wirkt sich vor allem auf die Tilgung aus. Nach ${h.src('stvg29', '§ 29 StVG')} wird ein Eintrag mit zwei Punkten nach ${h.num(PK.tilgung_2p_monate)} Monaten tilgungsreif, ein Eintrag mit einem Punkt nach ${h.num(PK.tilgung_1p_monate)} Monaten. Wer mit 31 km/h innerorts geblitzt wird, trägt die Punkte also doppelt so lange wie jemand, der dieselbe Geschwindigkeit außerorts fuhr. Mit drei weiteren Punkten aus anderen Verstößen wäre die Marke von ${PK.ermahnung_ab} Punkten erreicht, ab der eine schriftliche Ermahnung folgt.</p>

<h2>Außerorts kein Fahrverbot, aber eine Vorbelastung</h2>
<p>Außerorts mag die Stufe glimpflich wirken. Sie zählt aber für die Wiederholungsregel des § 4 Abs. 2 BKatV, weil sie über ${V.beharrlich_kmh} km/h liegt. Zwei Folgen ergeben sich daraus. Erstens: Liegt bereits ein rechtskräftiger Bescheid über mindestens ${V.beharrlich_kmh} km/h vor, der weniger als ein Jahr alt ist, gibt es auch für 31 km/h außerorts einen Monat Fahrverbot (${h.eur(speeding({ limit: 100, measured: 131, inner: false, tolerance: false, prior26: true }).fine)}, Fahrverbot ${h.num(speeding({ limit: 100, measured: 131, inner: false, tolerance: false, prior26: true }).fv)} Monat). Zweitens: Der Bescheid für 31 km/h wird selbst zur Vorbelastung für das folgende Jahr. Die Einzelheiten stehen unter ${h.a('kmh-26', '26 km/h zu schnell')}.</p>

<h2>Wann aus 30 km/h 31 werden</h2>
<p>Innerorts gilt bis ${T.grenze_kmh} km/h Messwert der feste Abzug von ${T.kmh_bis_100} km/h. In der 50er-Zone ergeben 83 km/h genau ${h.num(speeding({ limit: 50, measured: 83, inner: true }).over)} km/h, 84 km/h schon ${h.num(speeding({ limit: 50, measured: 84, inner: true }).over)} km/h mit Fahrverbot. In der 30er-Zone liegt die Grenze bei einem Messwert von 64 km/h (${h.num(speeding({ limit: 30, measured: 64, inner: true }).over)} km/h nach Abzug). Außerorts rechnet die Behörde meist mit der Prozentregel: Auf der Landstraße mit Tempo 100 bleiben von 135 km/h Messwert ${h.num(speeding({ limit: 100, measured: 135, inner: false }).vorwerfbar)} km/h. Den eigenen Messwert prüft der ${h.a('bussgeldrechner', 'Bußgeldrechner')}.</p>

<h2>In der Probezeit zählt der Ort nicht</h2>
<p>Für Fahranfänger verschwindet die Asymmetrie zum Teil. Nach Anlage 12 der FeV ist jede eingetragene Geschwindigkeitsüberschreitung ein A-Verstoß, ob innerorts mit zwei Punkten oder außerorts mit einem. Beide Fälle führen in der Probezeit zur Anordnung eines Aufbauseminars und zur Verlängerung der Probezeit um ${P.probezeit.verlaengerung_jahre} Jahre. Innerorts kommt das Fahrverbot hinzu, das unabhängig von den Probezeitmaßnahmen läuft: Die Bußgeldstelle verhängt es mit dem Bescheid, die Führerscheinstelle ordnet später das Seminar an. Wer in der Probezeit innerorts mit 31 km/h zu viel gemessen wird, hat also mit zwei Behörden zu tun, die nacheinander handeln. Die Einzelheiten zur Reihenfolge der Maßnahmen beschreibt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Mit Anhänger kein Unterschied mehr</h2>
<p>Die Asymmetrie gilt nur für Pkw und Motorräder. Für Fahrzeuge mit Anhänger und Lkw über 3,5 Tonnen sieht Tabelle 1 a für 31 bis 40 km/h an beiden Orten ein Fahrverbot vor: innerorts ${h.eur(anhInn.fine)} und ${h.num(anhInn.fv)} Monat, außerorts ${h.eur(anhOut.fine)} und ${h.num(anhOut.fv)} Monat, jeweils mit ${h.num(anhOut.points)} Punkten. Wer mit dem Wohnwagen auf der Landstraße unterwegs ist, wo für Gespanne ohnehin meist 80 km/h gelten, erreicht diese Stufe schneller als gedacht. Die Regeln zur Abgabe des Führerscheins erklärt die Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>`,
  },
  en: {
    slug: '31-kmh-over-the-limit',
    nav: '31 km/h over',
    card: 'A ban and two points in town, one point outside: the most uneven band.',
    title: '31 km/h Over the Limit Germany 2026: Ban Only in Town',
    description: `31 km/h over the limit in Germany 2026: ${en(inn.fine)}, two points and a one-month ban in town; ${en(out.fine)} and one point outside towns. The town sign makes the difference.`,
    h1: '31 km/h over the limit in Germany: why location decides the ban',
    intro: 'Nowhere else in the German speeding table do the town and country columns drift as far apart as between 31 and 40 km/h over.',
    resume: `Driving a car 31 to 40 km/h too fast in Germany shows the biggest gap in the fine catalogue between towns and open roads. In a built-up area the band costs ${en(inn.fine)}, two Flensburg points and a one-month Fahrverbot (driving ban); with fees the notice comes to ${en(inn.total, 2)}. Outside towns it costs ${en(out.fine)} and one point with no ban, ${en(out.total, 2)} in total. The difference also lasts longer: two points stay until ${formatDecimal(tilgung(2), 1, 'en')} years after the decision is final, one point until ${formatDecimal(tilgung(1), 1, 'en')} years. What counts is whether the camera stood inside a built-up area, marked by the yellow town sign, not the speed limit itself. One trap remains outside towns: if a fine for at least ${V.beharrlich_kmh} km/h over became final less than a year before, 31 km/h outside towns also brings a one-month ban. For drivers on probation the band is an A offence everywhere.`,
    faqs: [
      { q: 'Why did I get a driving ban for 31 km/h over when my colleague did not?', a: `Probably because you were caught in a built-up area and your colleague outside one. In town the catalogue sets ${en(inn.fine)}, two points and one month; outside towns ${en(out.fine)}, one point and no ban. The location printed on the hearing form decides which column applies. A recent earlier fine for ${V.beharrlich_kmh} km/h or more can also add a ban outside towns.` },
      { q: 'Is a German village through-road with a 70 km/h limit counted as a built-up area?', a: 'Yes, if it lies past the yellow town sign (Ortsschild). The built-up area starts at that sign and ends at the sign with the red diagonal line, whatever the posted limit. A 50 km/h stretch before the sign remains out of town. For 31 km/h over, this decides between a ban with two points and a single point.' },
      { q: 'How much does 31 km/h over on a German country road cost in total?', a: `The fine is ${en(out.fine)}. Five per cent would be only ${en(out.fine * V.gebuehr_satz)}, so the minimum fee of ${en(V.gebuehr_min)} applies, plus ${en(V.zustellung, 2)} for delivery. The notice therefore asks for ${en(out.total, 2)}, and one point goes on the Flensburg record for ${PK.tilgung_1p_monate} months after the decision is final. There is no driving ban unless the repeat rule applies.` },
      { q: 'Does towing a caravan change the fine for 31 km/h over in Germany?', a: `Yes, considerably. With a trailer, table 1 a applies, and 31 to 40 km/h over carries a one-month ban both in town and outside: ${en(anhInn.fine)} in town and ${en(anhOut.fine)} outside towns, each with two points. Since car and caravan combinations are usually limited to 80 km/h on country roads, the band is reached sooner than many expect.` },
      { q: 'Can I keep driving in Germany while my 31 km/h in-town case is pending?', a: `Yes. The ban only takes effect once the decision is final, and for a first ban in two years you may then choose the start within ${V.fahrverbot_schonfrist_monate} months. Until you hand in your licence, you may drive. An objection (Einspruch) within the ${V.einspruch_wochen}-week period stops the notice becoming final, so no ban period runs while the case is open.` },
    ],
    body: (h) => `
<h2>Same speed, two different outcomes</h2>
<p>For a car, 31 to 40 km/h over is the first band with a driving ban in town and still an ordinary one-point offence outside. The reasoning is about who else is on the road. In a town, 31 km/h over a 50 limit means more than 60 per cent above it, close to schools, cyclists and driveways. On a 100 km/h road the same excess is under a third. Many expats first notice the split when two people in the same office get very different letters for what sounds like the same speed.</p>
${h.table(['Over the limit', 'In town', 'Points / ban', 'Outside towns', 'Points / ban'], vergleich.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), `${h.num(i.points)} / ${i.fv ? `${h.num(i.fv)} month` : 'none'}`, h.eur(o.fine), `${h.num(o.points)} / ${o.fv ? `${h.num(o.fv)} month` : 'none'}`]), 'Car, speed after tolerance, table 1 c of the BKatV annex', ['l', 'r', 'l', 'r', 'l'])}

<h2>Learning to read German town signs</h2>
<p>The legal line is the yellow town sign, sign 310 in the road traffic regulations, with the place name in black. The built-up area begins there and ends at the matching sign with a red diagonal stripe. Drivers from countries where the speed limit itself defines urban zones tend to misjudge this. A wide through-road posted at 70 km/h behind the yellow sign counts as in town; a 50 km/h approach before it counts as out of town. The hearing form states which applies. All the in-town bands are on the page about ${h.a('geblitzt-innerorts', 'speed cameras in town')}.</p>

<h2>Why two points last twice as long</h2>
<p>An offence with a driving ban is classed in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')} as particularly serious and scores two points. Under ${h.src('stvg29', 'Section 29 StVG')}, a two-point entry is due for deletion ${PK.tilgung_2p_monate} months after the decision is final, a one-point entry after ${PK.tilgung_1p_monate}. So the in-town version follows you for five years rather than two and a half. If you plan to exchange your foreign licence or apply for a job that involves driving, those years matter. The written reminder stage starts at ${PK.ermahnung_ab} points.</p>

<h2>The open-road trap</h2>
<p>Outside towns this band sits above ${V.beharrlich_kmh} km/h, which brings in the repeat rule. If a fine for ${V.beharrlich_kmh} km/h or more became final less than a year before this offence, a one-month ban usually follows here as well: the fine stays at ${h.eur(speeding({ limit: 100, measured: 131, inner: false, tolerance: false, prior26: true }).fine)}, with a ban of ${h.num(speeding({ limit: 100, measured: 131, inner: false, tolerance: false, prior26: true }).fv)} month. This notice also becomes the first strike for the next twelve months. The ${h.a('kmh-26', 'page on 26 km/h over')} walks through the timing.</p>

<h2>From 30 to 31: the readings that tip it</h2>
<p>In town, readings up to ${T.grenze_kmh} km/h lose a flat ${T.kmh_bis_100} km/h. In a 50 zone, 83 km/h on the device means ${h.num(speeding({ limit: 50, measured: 83, inner: true }).over)} km/h over; 84 km/h means ${h.num(speeding({ limit: 50, measured: 84, inner: true }).over)} km/h and a ban. In a 30 zone, 64 km/h is the reading that tips it. Out of town most readings exceed ${T.grenze_kmh} km/h, so three per cent comes off: 135 km/h becomes ${h.num(speeding({ limit: 100, measured: 135, inner: false }).vorwerfbar)} km/h. The ${h.a('bussgeldrechner', 'fine calculator')} works this out from the device reading.</p>

<h2>On probation, location matters less</h2>
<p>For drivers in their Probezeit, any recorded speeding offence is an A offence, whether it scored two points in town or one outside. Both lead to a remedial course and ${P.probezeit.verlaengerung_jahre} more years of probation. In town, the ban comes on top and is imposed by the fine office, while the course order follows later from the licensing office, so expect two separate letters from two authorities. The ${h.a('probezeit-fuehrerschein', 'probationary licence page')} has the sequence.</p>

<h2>Serving a ban as a newcomer</h2>
<p>If this is your first ban in two years, you can choose when to start it within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final (${h.src('stvg25', 'Section 25 StVG')}). An EU licence held by a resident goes to the authority for the month; a licence from outside the EU receives a note of the ban instead. The ${h.a('fahrverbot', 'driving ban guide')} has the details on sending in your licence and getting it back.</p>`,
  },
});
