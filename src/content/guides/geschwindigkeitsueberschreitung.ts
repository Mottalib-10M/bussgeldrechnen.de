import { defineGuide, type Helpers } from '../../lib/guide-types';
import { P, BKAT, type SpeedRow } from '../../lib/engine/params';
import { speeding } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren;
const rows = (cls: 'a' | 'b' | 'c') => BKAT.speed.filter((r) => r.cls === cls);
const C = rows('c'), A = rows('a'), B = rows('b');
const first = (t: SpeedRow[]) => t[0];
const last = (t: SpeedRow[]) => t[t.length - 1];
/** Erste Stufe mit Punkt bzw. mit Fahrverbot, aus der Tabelle gelesen. */
const fromPt = (t: SpeedRow[], inner: boolean) => t.find((r) => (inner ? r.ptInner : r.ptOuter) > 0)!.lo;
const fromFv = (t: SpeedRow[], inner: boolean) => t.find((r) => (inner ? r.fvInner : r.fvOuter) > 0)!.lo;
const vors = speeding({ limit: 100, measured: 141, inner: false, tolerance: false, intent: true });
const ohneVors = speeding({ limit: 100, measured: 141, inner: false, tolerance: false });
const beh = speeding({ limit: 100, measured: 128, inner: false, tolerance: false, prior26: true });
const ex = speeding({ limit: 50, measured: 78, inner: true });
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

function band(r: SpeedRow, lang: 'de' | 'en'): string {
  if (r.hi === null) return lang === 'de' ? `mehr als ${r.lo - 1} km/h` : `over ${r.lo - 1} km/h`;
  if (r.lo === 0) return lang === 'de' ? `bis ${r.hi} km/h` : `up to ${r.hi} km/h`;
  return lang === 'de' ? `${r.lo} bis ${r.hi} km/h` : `${r.lo} to ${r.hi} km/h`;
}
function fv(n: number, lang: 'de' | 'en'): string {
  if (!n) return lang === 'de' ? 'nein' : 'no';
  return lang === 'de' ? `${n} ${n === 1 ? 'Monat' : 'Monate'}` : `${n} ${n === 1 ? 'month' : 'months'}`;
}
function tab(h: Helpers, t: SpeedRow[], caption: string): string {
  const l = h.lang;
  const head = l === 'de'
    ? ['Zu schnell', 'Nr.', 'Innerorts', 'Punkte', 'Fahrverbot', 'Außerorts', 'Punkte', 'Fahrverbot']
    : ['Over the limit', 'No.', 'In town', 'Points', 'Ban', 'Outside towns', 'Points', 'Ban'];
  return h.table(head, t.map((r) => [band(r, l), r.nr, h.eur(r.inner), h.num(r.ptInner), fv(r.fvInner, l), h.eur(r.outer), h.num(r.ptOuter), fv(r.fvOuter, l)]), caption, ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r']);
}

export default defineGuide({
  id: 'geschwindigkeitsueberschreitung',
  group: 'tempo',
  order: 10,
  mini: 'tempo',
  related: ['bussgeldrechner', 'geblitzt', 'kmh-21', 'kmh-31', 'fahrverbot', 'punkte-in-flensburg'],
  sources: ['bkatAnhang', 'bkatv', 'stvo3', 'fevAnl13', 'owig107'],
  de: {
    slug: 'geschwindigkeitsueberschreitung',
    nav: 'Geschwindigkeitsüberschreitung',
    card: 'Die drei Tempotabellen des Bußgeldkatalogs, für Pkw, Lkw, Gespanne und Busse.',
    title: 'Geschwindigkeitsüberschreitung 2026: Tabellen und Punkte',
    description: `Geschwindigkeitsüberschreitung 2026: Pkw innerorts ${de(first(C).inner)} bis ${de(last(C).inner)}, Punkt ab ${fromPt(C, true)} km/h, dazu Lkw, Gespann und Bus. Alle drei Tabellen der BKatV im Überblick.`,
    h1: 'Geschwindigkeitsüberschreitung: alle Sätze des Bußgeldkatalogs',
    intro: 'Was eine Überschreitung kostet, entscheiden drei Dinge: das Fahrzeug, der Ort und die Zahl der km/h nach Toleranzabzug.',
    resume: `Eine Geschwindigkeitsüberschreitung kostet nach dem Bußgeldkatalog so viel, wie die passende Tabelle im Anhang der BKatV für das Fahrzeug, den Ort und die vorgeworfenen km/h vorsieht. Für Pkw und Motorräder gilt Tabelle 1 Buchstabe c: innerorts von ${de(first(C).inner)} bis ${de(last(C).inner)}, außerorts von ${de(first(C).outer)} bis ${de(last(C).outer)}. Einen Punkt in Flensburg gibt es ab ${fromPt(C, true)} km/h, ein Regelfahrverbot innerorts ab ${fromFv(C, true)} km/h und außerorts ab ${fromFv(C, false)} km/h. Schwere Kraftfahrzeuge über 3,5 Tonnen, Pkw mit Anhänger und Busse fallen unter Tabelle 1 Buchstabe a mit höheren Sätzen; kennzeichnungspflichtige Gefahrguttransporte und Busse mit Fahrgästen unter Buchstabe b, wo innerorts schon ${de(last(B).inner)} erreicht werden. Wer zweimal binnen zwölf Monaten mindestens ${V.beharrlich_kmh} km/h zu schnell war, bekommt in der Regel einen Monat Fahrverbot. Vorsatz verdoppelt jeden Regelsatz über ${V.verwarnung_max} Euro. Über ${V.verwarnung_max} Euro kommen Gebühr und Zustellung hinzu.`,
    faqs: [
      { q: 'Welche Tempotabelle des Bußgeldkatalogs gilt für ein Auto mit Wohnwagen?', a: `Tabelle 1 Buchstabe a. Die BKatV verweist für diese Tabelle auf § 3 Abs. 3 StVO, und dort sind Personenkraftwagen mit Anhänger ausdrücklich genannt. Das Gespann zahlt also nicht die Pkw-Sätze: Bei 21 bis 25 km/h zu schnell innerorts werden ${de(A[3].inner)} fällig statt ${de(C[3].inner)}, dazu ein Punkt. Außerorts gilt für das Gespann zudem in der Regel Tempo 80 statt 100.` },
      { q: 'Ab wie viel km/h zu schnell gibt es mit dem Lkw einen Punkt?', a: `Mit einem Fahrzeug aus Tabelle 1 a, also etwa einem Lkw über 3,5 Tonnen, schon ab ${fromPt(A, true)} km/h, innerorts wie außerorts: ${de(A[2].inner)} beziehungsweise ${de(A[2].outer)} und ein Punkt. Beim Pkw beginnt die Punktegrenze erst bei ${fromPt(C, true)} km/h. Für Gefahrguttransporte und vollbesetzte Busse nach Tabelle 1 b gibt es innerorts bereits ab ${fromPt(B, true)} km/h einen Punkt.` },
      { q: 'Was kostet eine vorsätzliche Geschwindigkeitsüberschreitung?', a: `Nach § 3 Abs. 4a BKatV wird bei Vorsatz ein Regelsatz von mehr als ${V.verwarnung_max} Euro verdoppelt. Außerorts mit 41 km/h zu viel werden aus ${de(ohneVors.fine)} also ${de(vors.fine)}, Punkte und Fahrverbot bleiben gleich. Vorsatz nehmen Behörden und Gerichte oft bei sehr hohen Überschreitungen oder bei mehreren hintereinander stehenden Schildern an; ein Automatismus ist das nicht.` },
      { q: 'Zählt eine Geschwindigkeitsüberschreitung mit dem Motorrad wie mit dem Pkw?', a: `Ja. Krafträder sind in den Tabellen 1 a und 1 b nicht genannt und fallen deshalb unter Tabelle 1 c, die für alle anderen Kraftfahrzeuge gilt. Ein Motorrad zahlt innerorts bei 26 bis 30 km/h zu schnell ${de(C[4].inner)} und erhält einen Punkt, genau wie ein Auto. Außerorts gilt auch für Motorräder Tempo 100, solange kein Schild etwas anderes anordnet.` },
      { q: 'Wann wird die Geschwindigkeitsüberschreitung als beharrlich gewertet?', a: `Wenn gegen Sie wegen mindestens ${V.beharrlich_kmh} km/h zu schnell bereits ein Bußgeld rechtskräftig festgesetzt wurde und Sie innerhalb von ${V.beharrlich_monate} Monaten nach dieser Rechtskraft erneut mindestens ${V.beharrlich_kmh} km/h zu schnell sind. Dann sieht § 4 Abs. 2 BKatV in der Regel ein Fahrverbot von einem Monat vor, auch wenn die neue Überschreitung für sich allein keines auslösen würde.` },
    ],
    body: (h) => `
<h2>Drei Tabellen, ein Tatbestand</h2>
<p>Im Bußgeldkatalog steht die Geschwindigkeit unter Nummer 11: „Zulässige Höchstgeschwindigkeit überschritten mit“, gefolgt von drei Unterfällen. Jeder verweist auf eine eigene Tabelle im ${h.src('bkatAnhang', 'Anhang der BKatV')}. Welche davon gilt, hängt allein vom Fahrzeug ab, nicht vom Fahrer und nicht von der Straße.</p>
<ul>
<li><strong>Nr. 11.1, Tabelle 1 a:</strong> Kraftfahrzeuge der in § 3 Absatz 3 Nummer 2 Buchstabe a oder b StVO genannten Art. Das sind Kraftfahrzeuge über 3,5 t bis 7,5 t (ausgenommen Pkw), Pkw mit Anhänger, Lkw und Wohnmobile bis 3,5 t mit Anhänger, Kraftomnibusse, Fahrzeuge über 7,5 t und alle Kraftfahrzeuge mit Anhänger, soweit sie nicht schon genannt sind.</li>
<li><strong>Nr. 11.2, Tabelle 1 b:</strong> kennzeichnungspflichtige Fahrzeuge der Art aus Nr. 11.1, die gefährliche Güter befördern, sowie Kraftomnibusse mit Fahrgästen.</li>
<li><strong>Nr. 11.3, Tabelle 1 c:</strong> alle anderen Kraftfahrzeuge. Das ist der Pkw ohne Anhänger, das Motorrad, der Transporter und das Wohnmobil bis 3,5 t ohne Anhänger.</li>
</ul>
<p>Die Zuordnung übernimmt die Verordnung wörtlich aus ${h.src('stvo3', '§ 3 Absatz 3 StVO')}, der auch die Höchstgeschwindigkeiten außerorts nach Fahrzeugart staffelt. Wer also wissen will, ob ein Gespann oder ein Kleinbus anders behandelt wird, liest beide Vorschriften zusammen.</p>

<h2>Tabelle 1 c: Pkw und Motorrad</h2>
<p>Die Tabelle, nach der die meisten Bescheide in Deutschland ergehen. Die Werte gelten nach Abzug der Messtoleranz und ohne Vorsatz.</p>
${tab(h, C, 'Tabelle 1 c (Nr. 11.3), Regelsätze nach BKatV, Stand 12.8.2026')}
<p>Zwei Stufen verdienen einen zweiten Blick. Bis ${C[2].hi} km/h bleibt es ohne Eintrag in Flensburg, obwohl der Betrag innerorts ab der Stufe ${band(C[2], 'de')} über der Grenze von ${V.verwarnung_max} Euro liegt und damit ein Bescheid mit Gebühr ergeht. Ab ${fromPt(C, true)} km/h steht die Überschreitung in ${h.src('fevAnl13', 'Anlage 13 der FeV')}, und es gibt einen Punkt. Die zweite Kante liegt bei ${fromFv(C, true)} km/h: Innerorts beginnt dort das Fahrverbot, außerorts bleibt es in derselben Stufe bei ${h.eur(C[5].outer)} und ${h.num(C[5].ptOuter)} Punkt. Die einzelnen Stufen behandeln eigene Seiten, etwa ${h.a('kmh-21', '21 km/h zu schnell')} und ${h.a('kmh-31', '31 km/h zu schnell')}.</p>

<h2>Tabelle 1 a: Lkw, Busse und Gespanne</h2>
<p>Hier liegt das Niveau deutlich höher, und die Punkte setzen früher ein. Das trifft nicht nur Berufskraftfahrer. Wer im Sommer mit Wohnwagen oder Bootsanhänger unterwegs ist, fährt ein Fahrzeug nach Nr. 11.1 und wird bei einem Blitzer nach dieser Tabelle abgerechnet.</p>
${tab(h, A, 'Tabelle 1 a (Nr. 11.1), Regelsätze nach BKatV, Stand 12.8.2026')}
<p>Auffällig ist der Sprung bei ${band(A[2], 'de')}: Mit ${h.eur(A[2].inner)} innerorts kostet diese Stufe mehr als das Doppelte der darunter liegenden, und sie bringt bereits einen Punkt. Innerorts beginnt das Fahrverbot schon ab ${fromFv(A, true)} km/h, außerorts ab ${fromFv(A, false)} km/h. Die Tabelle endet anders als die Pkw-Tabelle bereits mit der Stufe ${band(last(A), 'de')}.</p>

<h2>Tabelle 1 b: Gefahrgut und Busse mit Fahrgästen</h2>
<p>Die strengste Stufe gilt, wenn Menschen oder gefährliche Güter an Bord sind. Ein kennzeichnungspflichtiger Tankwagen und ein Linienbus mit Fahrgästen werden gleich behandelt.</p>
${tab(h, B, 'Tabelle 1 b (Nr. 11.2), Regelsätze nach BKatV, Stand 12.8.2026')}
<p>Schon bei ${band(B[1], 'de')} innerorts gibt es hier ${h.eur(B[1].inner)} und einen Punkt, und ein Fahrverbot droht innerorts ab ${fromFv(B, true)} km/h. Der Bescheid richtet sich auch hier an die Person am Steuer, nicht an das Unternehmen, dem das Fahrzeug gehört; die Punkte landen im Register des Fahrers.</p>

<h2>Welche Grenze überhaupt gilt</h2>
<p>Ohne Schild gelten die allgemeinen Werte aus § 3 Abs. 3 StVO: innerhalb geschlossener Ortschaften ${h.num(50)} km/h für alle Kraftfahrzeuge. Außerorts sind es ${h.num(100)} km/h für Pkw und andere Kraftfahrzeuge bis 3,5 t, ${h.num(80)} km/h unter anderem für Fahrzeuge über 3,5 t bis 7,5 t, Pkw mit Anhänger und Busse, ${h.num(60)} km/h für Fahrzeuge über 7,5 t und Busse mit stehenden Fahrgästen. Die Grenze für Pkw gilt nicht auf Autobahnen und nicht auf Straßen mit baulich getrennten Richtungsfahrbahnen oder mit mindestens zwei markierten Fahrstreifen je Richtung. Zwei Sonderwerte gelten unabhängig vom Schild: Bei Sichtweiten unter ${h.num(50)} m durch Nebel, Schnee oder Regen höchstens ${h.num(50)} km/h, mit Schneeketten ebenfalls höchstens ${h.num(50)} km/h (§ 3 Abs. 4 StVO).</p>
<p>Das Ortsschild markiert den Wechsel zwischen innerorts und außerorts, nicht die Bebauung. Ob ein Verstoß nach dem innerörtlichen oder dem außerörtlichen Satz abgerechnet wird, steht im Anhörungsbogen; der Unterschied macht in Tabelle 1 c bis zu ${h.eur(Math.max(...C.map((r) => r.inner - r.outer)))} aus.</p>

<h2>Vom Messwert zur vorgeworfenen Überschreitung</h2>
<p>Die Tabellen arbeiten mit der Überschreitung nach Toleranzabzug. Gemessen werden etwa 78 km/h in einer 50er-Zone; abgezogen werden ${h.num(P.toleranz.kmh_bis_100)} km/h, vorgeworfen werden also ${h.num(ex.vorwerfbar)} km/h und damit ${h.num(ex.over)} km/h zu viel. Das ergibt ${h.eur(ex.fine)} und ${h.num(ex.points)} Punkt. Wie der Abzug bei höheren Werten funktioniert und was nach dem Blitzer geschieht, erklärt die Seite ${h.a('geblitzt', 'Geblitzt: was jetzt passiert')}.</p>

<h2>Zone 30, Baustelle, Wechselverkehrszeichen</h2>
<p>Der Katalog fragt nur, ob die Tat innerhalb oder außerhalb einer geschlossenen Ortschaft geschah. Eine 30er-Zone vor der Grundschule wird daher nach der Spalte innerorts abgerechnet, eine Baustelle mit Tempo 60 auf der Autobahn nach der Spalte außerorts. Wer in der 30er-Zone mit gemessenen 64 km/h unterwegs war, landet nach Abzug bei ${h.num(speeding({ limit: 30, measured: 64, inner: true }).over)} km/h zu viel und damit bei ${h.eur(speeding({ limit: 30, measured: 64, inner: true }).fine)}, ${h.num(speeding({ limit: 30, measured: 64, inner: true }).points)} Punkten und ${h.num(speeding({ limit: 30, measured: 64, inner: true }).fv)} Monat Fahrverbot. Elektronische Anzeigen über der Autobahn sind Verkehrszeichen wie jedes Blechschild; eine dort angezeigte Grenze gilt, solange sie leuchtet.</p>

<h2>Punkte und Probezeit</h2>
<p>Jede Stufe mit Punkt wird im Fahreignungsregister beim Kraftfahrt-Bundesamt gespeichert. Ein Punkt wird nach ${h.num(P.punkte.tilgung_1p_monate)} Monaten ab Rechtskraft tilgungsreif, zwei Punkte nach ${h.num(P.punkte.tilgung_2p_monate)} Monaten. Für Fahranfänger zählt jede eingetragene Geschwindigkeitsüberschreitung als A-Verstoß nach Anlage 12 der FeV. Schon ein einziger führt zum Aufbauseminar und verlängert die Probezeit um ${h.num(P.probezeit.verlaengerung_jahre)} Jahre. Einen Gesamtüberblick über Stufen, Ermahnung und Entziehung gibt die Seite zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>

<h2>Wann der Regelsatz nicht passt</h2>
<p>Die Tabellen gehen von gewöhnlichen Tatumständen aus. Für die Zumessung nennt § 17 Abs. 3 OWiG die Bedeutung der Tat, den Vorwurf gegen den Täter und, bei höheren Beträgen, seine wirtschaftlichen Verhältnisse. Behörden erhöhen den Satz daher etwa bei einschlägigen Voreintragungen und senken ihn selten. Eine Abweichung steht im Bescheid und muss begründet sein; der Katalogwert bleibt der Ausgangspunkt. Wer den Bescheid neben die Tabelle legt, sieht sofort, ob und warum der Betrag davon abweicht.</p>

<h2>Beharrlichkeit: das Fahrverbot ohne grobe Einzeltat</h2>
<p>§ 4 Abs. 2 BKatV kennt einen Regelfall, der in keiner Tabelle steht. Wurde gegen Sie wegen einer Überschreitung von mindestens ${V.beharrlich_kmh} km/h ein Bußgeld rechtskräftig festgesetzt, und sind Sie innerhalb von ${V.beharrlich_monate} Monaten nach dieser Rechtskraft erneut mindestens ${V.beharrlich_kmh} km/h zu schnell, kommt in der Regel ein Monat Fahrverbot hinzu. Die Uhr beginnt mit der Rechtskraft des ersten Bescheids, nicht mit dem ersten Blitzer. Außerorts mit ${h.num(beh.over)} km/h zu viel heißt das: ${h.eur(beh.fine)}, ${h.num(beh.points)} Punkt und ${h.num(beh.fv)} Monat Fahrverbot, obwohl die Tabelle für diese Stufe keines vorsieht.</p>

<h2>Vorsatz verdoppelt den Satz</h2>
<p>Die Tabellensätze unterstellen Fahrlässigkeit, so steht es in § 1 Abs. 2 der ${h.src('bkatv', 'Bußgeldkatalog-Verordnung')}. Bei vorsätzlicher Begehung wird ein Regelsatz von mehr als ${V.verwarnung_max} Euro nach § 3 Abs. 4a verdoppelt. Für ${h.num(ohneVors.over)} km/h zu schnell außerorts bedeutet das ${h.eur(vors.fine)} statt ${h.eur(ohneVors.fine)}; Punkte und Fahrverbot ändern sich nicht. Ob Vorsatz vorliegt, ist eine Frage des Einzelfalls und muss im Bescheid begründet sein.</p>

<h2>Was neben dem Regelsatz anfällt</h2>
<p>Liegt der Betrag über ${V.verwarnung_max} Euro, ergeht ein Bußgeldbescheid. Nach ${h.src('owig107', '§ 107 OWiG')} kommen fünf Prozent Gebühr hinzu, mindestens ${h.eur(V.gebuehr_min)}, und ${h.eur(V.zustellung, 2)} Zustellung. Für ${h.eur(ex.fine)} stehen damit ${h.eur(ex.total, 2)} auf dem Bescheid. Bis ${V.verwarnung_max} Euro bleibt es beim Verwarnungsgeld ohne Kosten. Den eigenen Fall mit Fahrzeugart, Ort und Messwert rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')}; was ein Monat ohne Führerschein praktisch bedeutet, steht unter ${h.a('fahrverbot', 'Fahrverbot')}.</p>`,
  },
  en: {
    slug: 'speeding-fines-germany',
    nav: 'Speeding fines',
    card: 'All three German speeding tables: cars, lorries, caravans and buses.',
    title: 'Speeding Fines Germany 2026: Every Band, Points and Bans',
    description: `Speeding fines in Germany 2026: ${en(first(C).inner)} to ${en(last(C).inner)} in town for a car, a point from ${fromPt(C, true)} km/h over, higher rates for vans with trailers, lorries and buses. Full tables.`,
    h1: 'Speeding fines in Germany: the complete tables',
    intro: 'Germany prices speeding by vehicle type, by where it happened and by the km/h left after the tolerance deduction.',
    resume: `Speeding fines in Germany come from the national fine catalogue, the Bußgeldkatalog, which sets one fixed amount for each band of excess speed rather than leaving it to a local court. For cars and motorbikes, table 1 c applies: from ${en(first(C).inner)} to ${en(last(C).inner)} in a built-up area and from ${en(first(C).outer)} to ${en(last(C).outer)} outside towns. Your first point in the Flensburg driver register comes at ${fromPt(C, true)} km/h over; a driving ban (Fahrverbot) is the norm from ${fromFv(C, true)} km/h over in town and ${fromFv(C, false)} km/h outside. Towing a caravan or trailer with your car moves you to table 1 a, the same as lorries and coaches, with higher fines and earlier points. Vehicles carrying labelled dangerous goods and buses with passengers use table 1 b. Two offences of ${V.beharrlich_kmh} km/h or more within a year usually bring a one-month ban, and deliberate speeding doubles any fine above ${V.verwarnung_max} euros.`,
    faqs: [
      { q: 'Are speeding fines in Germany higher when towing a caravan?', a: `Yes. A car with a trailer falls under table 1 a of the German catalogue, not the car table. At 16 to 20 km/h over in town you pay ${en(A[2].inner)} and get a point, against ${en(C[2].inner)} and no point without the caravan. The general limit outside towns is also lower for a car with a trailer: 80 km/h instead of 100 km/h under Section 3(3) StVO.` },
      { q: 'Do motorbike riders pay the same speeding fines as car drivers in Germany?', a: `Yes. Motorbikes are not named in tables 1 a or 1 b, so they fall into table 1 c with cars. Riding 31 to 40 km/h too fast in a built-up area costs ${en(C[5].inner)}, two points and a ${C[5].fvInner}-month ban, exactly as in a car. The general limits are also the same for both: 50 km/h in town and 100 km/h outside unless signs say otherwise.` },
      { q: 'What is the highest speeding fine in the German catalogue?', a: `${en(last(B).inner)}, for a vehicle in table 1 b, meaning labelled dangerous goods or a bus with passengers, driven more than ${last(B).lo - 1} km/h too fast in town. For a car the top band is ${en(last(C).inner)} in town for more than ${last(C).lo - 1} km/h over. Deliberate speeding doubles these regular rates under Section 3(4a) BKatV, and fees under Section 107 OWiG come on top.` },
      { q: 'Does the van I rent for a house move count as a car for German speeding fines?', a: `Usually yes, if its permitted total weight is 3.5 tonnes or less and it has no trailer. Then table 1 c applies, with the same fines and the 100 km/h limit outside towns that cars have. A heavier van, or a van pulling a trailer, falls under table 1 a, where fines are higher and points start at ${fromPt(A, true)} km/h over.` },
    ],
    body: (h) => `
<h2>Why Germany has three speeding tables</h2>
<p>Many newcomers expect one list of speeding fines. The German catalogue has three, all in the ${h.src('bkatAnhang', 'annex to the fine catalogue ordinance (BKatV)')}. The vehicle you drive picks the table; your nationality, your licence and the kind of road do not. Entry 11 of the catalogue reads, in translation, "permitted maximum speed exceeded with", and then splits into three cases:</p>
<ul>
<li><strong>11.1, table 1 a:</strong> heavier vehicles and anything towing. That covers motor vehicles over 3.5 tonnes (cars excepted), cars with a trailer, vans and motorhomes up to 3.5 tonnes with a trailer, coaches and heavy goods vehicles.</li>
<li><strong>11.2, table 1 b:</strong> vehicles from 11.1 that must display orange hazard plates because they carry dangerous goods, and buses with passengers on board.</li>
<li><strong>11.3, table 1 c:</strong> everything else, which in practice means your car, your motorbike and the hire van for moving flat, as long as it stays at 3.5 tonnes and tows nothing.</li>
</ul>
<p>The definitions are lifted from ${h.src('stvo3', 'Section 3(3) of the Road Traffic Regulations (StVO)')}, the same rule that sets default limits by vehicle type.</p>

<h2>Table 1 c: cars and motorbikes</h2>
<p>Most expats will only ever see this table. Amounts apply after the tolerance has been deducted and assume carelessness, not intent.</p>
${tab(h, C, 'Table 1 c (no. 11.3), standard rates under the BKatV as amended on 12 August 2026')}
<p>A notice for up to ${C[1].hi} km/h over in town is a warning fine (Verwarnungsgeld): pay it and the matter is closed, with no fee and nothing on your record. From ${C[2].lo} km/h over in town the amount passes ${en(V.verwarnung_max)}, so a formal fine notice (Bußgeldbescheid) with fees follows, still without a point. Points start at ${fromPt(C, true)} km/h, listed in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}. The ${h.a('kmh-21', 'page on 21 km/h over')} explains why that line matters so much for anyone still on probation.</p>

<h2>Table 1 a: the caravan trap</h2>
<p>Holidays are where many residents meet this table for the first time. Hitch a caravan, a horse box or a trailer for the garden waste to your car and you are driving an 11.1 vehicle. The same camera flash now costs much more.</p>
${tab(h, A, 'Table 1 a (no. 11.1), standard rates under the BKatV as amended on 12 August 2026')}
<p>The point arrives at ${fromPt(A, true)} km/h over instead of ${fromPt(C, true)}, and a ban is the norm in town from ${fromFv(A, true)} km/h. Remember too that the default limit outside towns drops to ${h.num(80)} km/h with a trailer behind a car, so a speed that would be legal solo can already sit in one of these bands.</p>

<h2>Table 1 b: dangerous goods and full buses</h2>
<p>This is the professional end of the scale, relevant if you drive a coach or a tanker for a living or work in logistics.</p>
${tab(h, B, 'Table 1 b (no. 11.2), standard rates under the BKatV as amended on 12 August 2026')}
<p>At ${band(B[1], 'en')} over in town the fine is already ${h.eur(B[1].inner)} with a point. Drivers with a foreign licence and a German job are treated exactly like local drivers here.</p>

<h2>Which limit applies when there is no sign</h2>
<p>Section 3(3) StVO sets the defaults. In built-up areas the limit is ${h.num(50)} km/h for every motor vehicle; the yellow place-name sign marks where that starts and ends. Outside towns it is ${h.num(100)} km/h for cars and other vehicles up to 3.5 tonnes, ${h.num(80)} km/h for, among others, cars with trailers, vehicles of 3.5 to 7.5 tonnes and buses, and ${h.num(60)} km/h for vehicles over 7.5 tonnes. The 100 km/h default does not apply on the Autobahn or on roads with physically separated carriageways or at least two marked lanes in each direction. Fog, snow or rain that cuts visibility below ${h.num(50)} metres caps you at ${h.num(50)} km/h whatever the signs say, and so do snow chains.</p>
<p>Coming from the UK or the US, the conversions are worth memorising: 50 km/h is about 31 mph, 100 km/h about 62 mph. German fines are always worked out in km/h, so a car with an mph speedometer needs the small inner scale.</p>

<h2>From the camera reading to your band</h2>
<p>The tables use the speed after the tolerance deduction. Measured at 78 km/h in a 50 zone, a driver is charged with ${h.num(ex.vorwerfbar)} km/h, so ${h.num(ex.over)} km/h over: ${h.eur(ex.fine)} and ${h.num(ex.points)} point. The deduction and the letters that follow a flash are covered on the page about ${h.a('geblitzt', 'being caught by a speed camera')}.</p>

<h2>Roadworks, 30 zones and overhead signs</h2>
<p>The catalogue only asks whether the offence happened inside or outside a built-up area. A 30 km/h zone outside a school is charged at the in-town rate; a roadworks section on the Autobahn with a 60 limit is charged at the out-of-town rate. Caught at 64 km/h in a 30 zone, a driver is charged with ${h.num(speeding({ limit: 30, measured: 64, inner: true }).over)} km/h over after the deduction, which means ${h.eur(speeding({ limit: 30, measured: 64, inner: true }).fine)}, ${h.num(speeding({ limit: 30, measured: 64, inner: true }).points)} points and a ${h.num(speeding({ limit: 30, measured: 64, inner: true }).fv)}-month ban. The electronic gantry signs on motorways are traffic signs in their own right. A limit shown there binds you while it is lit, even if the stretch was unrestricted yesterday.</p>

<h2>What a point means for an expat</h2>
<p>Points go into the Fahreignungsregister, the driver record held by the Federal Motor Transport Authority (KBA) in Flensburg. One point expires ${h.num(P.punkte.tilgung_1p_monate)} months after the decision becomes final, two points after ${h.num(P.punkte.tilgung_2p_monate)} months. If you moved to Germany with a licence from another EU country that you have held for less than two years, the German probation rules apply to you. Any speeding offence that carries a point then counts as a serious A offence, which leads to a remedial course and adds ${h.num(P.probezeit.verlaengerung_jahre)} years to the probation. Exchanging a non-EU licence for a German one does not wipe existing entries either.</p>

<h2>When the standard rate is not the final word</h2>
<p>The amounts in the tables are meant for ordinary circumstances. Section 17(3) of the Administrative Offences Act (OWiG) tells the authority to weigh how serious the offence was, how much blame attaches to the driver and, for larger sums, the driver's finances. In practice that means a higher fine for someone with relevant previous entries far more often than a lower one for anyone else. Any departure has to be stated and explained in the notice, so comparing your letter with the table above shows straight away whether the authority has moved away from the standard rate.</p>

<h2>Repeat offences and intent</h2>
<p>Section 4(2) BKatV adds a ban that is in none of the tables. Once a fine for ${V.beharrlich_kmh} km/h or more over has become final, a second offence of ${V.beharrlich_kmh} km/h or more within ${V.beharrlich_monate} months normally brings a one-month ban. Outside towns at ${h.num(beh.over)} km/h over, that means ${h.eur(beh.fine)}, ${h.num(beh.points)} point and ${h.num(beh.fv)} month off the road. Separately, all amounts assume negligence (Section 1(2) of the ${h.src('bkatv', 'fine catalogue ordinance')}). Where the authority finds you sped on purpose, any rate above ${en(V.verwarnung_max)} is doubled: ${h.eur(vors.fine)} rather than ${h.eur(ohneVors.fine)} for ${h.num(ohneVors.over)} km/h over outside towns.</p>

<h2>Fees on top of the fine</h2>
<p>A formal notice adds a fee of five per cent of the fine, at least ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for delivery, under ${h.src('owig107', 'Section 107 OWiG')}. Our example of ${h.eur(ex.fine)} therefore comes to ${h.eur(ex.total, 2)}. To run your own reading with vehicle type and location, use the ${h.a('bussgeldrechner', 'fine calculator')}; what a ban means in practice, including for a foreign licence, is on the ${h.a('fahrverbot', 'driving ban page')}.</p>`,
  },
});
