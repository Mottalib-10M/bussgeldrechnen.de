import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, toleranz } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const inn = speeding({ limit: 50, measured: 60, inner: true, tolerance: false });
const out = speeding({ limit: 100, measured: 110, inner: false, tolerance: false });
const in11 = speeding({ limit: 50, measured: 61, inner: true, tolerance: false });
const out11 = speeding({ limit: 100, measured: 111, inner: false, tolerance: false });
/** Messwerte in einer 50er-Zone rund um die Grenze von 10 km/h. */
const messreihe = [60, 62, 63, 64, 65, 66].map((m) => ({ m, r: speeding({ limit: 50, measured: m, inner: true }) }));
const de = (n: number) => formatMoney(n, 0, 'de');
const en = (n: number) => formatMoney(n, 0, 'en');

export default defineGuide({
  id: 'kmh-10',
  group: 'tempo',
  order: 110,
  mini: 'kmh10',
  related: ['kmh-20', 'kmh-21', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'geblitzt'],
  sources: ['bkatAnhang', 'bkatv', 'ptb', 'owig107'],
  de: {
    slug: '10-kmh-zu-schnell',
    nav: '10 km/h zu schnell',
    card: 'Verwarnungsgeld statt Bescheid: was bis 10 km/h wirklich anfällt.',
    title: '10 km/h zu schnell 2026: Verwarnungsgeld ohne Punkte',
    description: `10 km/h zu schnell 2026: ${de(inn.fine)} innerorts, ${de(out.fine)} außerorts, keine Gebühren, kein Punkt in Flensburg. Warum 63 km/h in der 50er-Zone genau 10 km/h zu viel sind.`,
    h1: '10 km/h zu schnell: das Verwarnungsgeld und die Toleranz',
    intro: 'Bis 10 km/h über dem Limit bleibt es beim Verwarnungsgeld, ohne Bescheid, ohne Gebühren und ohne Eintrag in Flensburg.',
    resume: `Wer mit dem Pkw bis zu 10 km/h zu schnell gemessen wurde, zahlt innerorts ${de(inn.fine)} und außerorts ${de(out.fine)}. Gemeint ist der Wert nach Abzug der Messtoleranz: Bis ${T.grenze_kmh} km/h Messwert zieht die Behörde ${T.kmh_bis_100} km/h ab, darüber ${T.prozent_ueber_100 * 100} Prozent, stets zugunsten des Fahrers abgerundet. Ein Blitzer, der in der 50er-Zone 63 km/h zeigt, ergibt also genau 10 km/h Überschreitung. Weil beide Beträge unter der Grenze von ${de(V.verwarnung_max)} liegen, handelt es sich um ein Verwarnungsgeld nach § 56 OWiG. Es gibt keinen Bußgeldbescheid, keine Gebühr nach § 107 OWiG, keine Zustellkosten und keinen Punkt im Fahreignungsregister. Auch in der Probezeit zählt der Verstoß nicht, weil er nicht eingetragen wird. Ab 11 km/h steigt der Satz auf ${de(in11.fine)} beziehungsweise ${de(out11.fine)}, bleibt aber noch eine Verwarnung.`,
    faqs: [
      { q: 'Wie viel kostet 10 km/h zu schnell innerorts mit dem Auto?', a: `${de(inn.fine)} nach Tabelle 1 c des Bußgeldkatalogs, außerorts ${de(out.fine)}. Mehr kommt nicht dazu: Unterhalb von ${de(V.verwarnung_max)} erhebt die Behörde ein Verwarnungsgeld ohne Gebühren und ohne Auslagen. Den Betrag überweisen Sie mit dem Aktenzeichen aus dem Schreiben innerhalb der dort genannten Frist, meist eine Woche.` },
      { q: 'Gibt es für 10 km/h zu schnell einen Punkt in der Probezeit?', a: 'Nein. In der Probezeit zählen nur Verstöße, die im Fahreignungsregister eingetragen werden, und ein Verwarnungsgeld wird dort nicht eingetragen. Geschwindigkeitsverstöße mit dem Pkw stehen in Anlage 13 der FeV erst ab mehr als 20 km/h. Ein Aufbauseminar oder eine Verlängerung der Probezeit löst eine Überschreitung von 10 km/h deshalb nicht aus.' },
      { q: 'Ich wurde mit 63 km/h in der 50er-Zone geblitzt: Was zahle ich?', a: `Vom Messwert 63 km/h werden ${T.kmh_bis_100} km/h Toleranz abgezogen, vorgeworfen werden 60 km/h, also 10 km/h zu viel. Das kostet ${de(inn.fine)} Verwarnungsgeld. Bei 64 km/h Messwert wären es 11 km/h und ${de(in11.fine)}. Die Toleranz von ${T.kmh_bis_100} km/h gilt nach den Vorgaben der PTB für Messwerte bis ${T.grenze_kmh} km/h.` },
      { q: 'Was passiert, wenn ich das Verwarnungsgeld nicht bezahle?', a: 'Die Verwarnung wird nach § 56 Abs. 2 OWiG erst mit der fristgerechten Zahlung wirksam. Bleibt sie unbezahlt, kann die Behörde ein reguläres Bußgeldverfahren eröffnen und einen Bescheid erlassen. Dann kommen die Gebühr von mindestens 25 Euro und 3,50 Euro Zustellung hinzu, und der Betrag liegt deutlich über dem ursprünglichen Verwarnungsgeld.' },
      { q: 'Muss ich bei 10 km/h zu schnell den Fahrer benennen?', a: 'Das Schreiben zum Verwarnungsgeld richtet sich oft an den Halter. Zahlt der Halter, ist die Sache erledigt, ohne dass ein Fahrer festgestellt wird. Wer nicht zahlen will, weil er nicht gefahren ist, kann das im Anhörungsbogen angeben. Seit Juli 2026 verbietet § 4c StVG ausdrücklich, die Behörde über die Person am Steuer zu täuschen.' },
    ],
    body: (h) => `
<h2>Warum diese Stufe eine Sonderstellung hat</h2>
<p>Die erste Zeile der Tempotabelle ist die einzige, bei der fast alle Nebenkosten entfallen. Das liegt nicht am Bußgeldkatalog selbst, sondern an der Schwelle des Ordnungswidrigkeitenrechts: Bis ${h.eur(V.verwarnung_max)} darf die Behörde verwarnen, statt einen Bescheid zu erlassen. ${h.eur(inn.fine)} innerorts und ${h.eur(out.fine)} außerorts liegen weit darunter. In der Praxis kommt ein Brief mit Foto oder ein Anhörungsbogen mit Zahlungsangebot, und wer bezahlt, hat das Verfahren beendet. Keine Akte im Fahreignungsregister, kein Bescheid, gegen den eine Einspruchsfrist läuft. Dieselbe Ersparnis gilt noch für 11 bis 15 km/h, nicht mehr für 16 km/h, und an der ${h.a('kmh-20', 'Grenze von 20 km/h')} wird aus der Verwarnung ein kostenpflichtiger Bescheid.</p>

<h2>Gemessen, vorgeworfen, bezahlt: die Rolle der Toleranz</h2>
<p>Auf dem Foto steht der gemessene Wert, im Schreiben der vorwerfbare. Dazwischen liegt der Toleranzabzug, den die ${h.src('ptb', 'Physikalisch-Technische Bundesanstalt')} für zugelassene Messgeräte vorgibt: ${T.kmh_bis_100} km/h bis ${T.grenze_kmh} km/h Messwert, darüber ${T.prozent_ueber_100 * 100} Prozent. Die Brandenburger Polizei weist darauf hin, dass der Abzug vom Messverfahren abhängt; maßgeblich ist der Wert, der im Schreiben steht. In einer 50er-Zone sieht die Reihe so aus:</p>
${h.table(['Messwert', 'Nach Toleranz', 'Zu schnell', 'Verwarnungsgeld'], messreihe.map(({ m, r }) => [`${h.num(m)} km/h`, `${h.num(r.vorwerfbar)} km/h`, `${h.num(r.over)} km/h`, h.eur(r.fine)]), 'Pkw innerorts, Tempo 50, Werte aus dem Bußgeldkatalog (Tabelle 1 c)', ['l', 'r', 'r', 'r'])}
<p>Ein Messwert von 63 km/h ist der höchste, der in der 50er-Zone noch in dieser Stufe bleibt. Auf der Landstraße mit Tempo 100 liegt jeder relevante Messwert über ${T.grenze_kmh} km/h, dort greift die Prozentregel: Aus 110 km/h werden ${h.num(toleranz(110))} km/h, und selbst ein Messwert von 114 km/h bleibt mit ${h.num(toleranz(114))} km/h vorgeworfen noch in dieser Stufe.</p>

<h2>Tempo 30: wo die kleine Stufe am häufigsten fällt</h2>
<p>In Wohngebieten, vor Schulen und Kitas stehen viele stationäre und mobile Messgeräte in Tempo-30-Zonen. Dort sind 10 km/h ein Drittel über dem Limit, und der Tacho zeigt bei 40 km/h kaum etwas Auffälliges. Ein Messwert von 43 km/h ergibt nach Abzug ${h.num(speeding({ limit: 30, measured: 43, inner: true }).over)} km/h Überschreitung und kostet ${h.eur(speeding({ limit: 30, measured: 43, inner: true }).fine)}. Bei 44 km/h sind es schon ${h.eur(speeding({ limit: 30, measured: 44, inner: true }).fine)}. Für die Höhe des Verwarnungsgeldes spielt es keine Rolle, ob das Schild wegen einer Schule, wegen Lärmschutz oder wegen einer Baustelle steht: Die Tabelle kennt nur die Differenz in km/h und die Frage, ob die Messung innerhalb oder außerhalb geschlossener Ortschaften stattfand. Maßgeblich dafür ist das Ortsschild, nicht die Bebauung am Straßenrand. Eine Landstraße mit Tempo 70 vor dem Ortseingang bleibt außerorts, auch wenn dort schon Häuser stehen, und wird mit den niedrigeren Beträgen der rechten Spalte berechnet.</p>

<h2>Was ein Verwarnungsgeld rechtlich ist</h2>
<p>Die Verwarnung nach § 56 OWiG ist ein Angebot. Sie wird wirksam, wenn Sie einverstanden sind und fristgerecht zahlen. Erst dann ist der Fall abgeschlossen. Bis zur Zahlung besteht kein Titel, den die Behörde vollstrecken könnte. Wer die Frist verstreichen lässt, gibt der Behörde die Möglichkeit, ein Bußgeldverfahren mit Bescheid zu eröffnen; dann fallen nach ${h.src('owig107', '§ 107 OWiG')} mindestens ${h.eur(V.gebuehr_min)} Gebühr und ${h.eur(V.zustellung, 2)} Zustellung an. Aus ${h.eur(inn.fine)} würden so ${h.eur(inn.fine + V.gebuehr_min + V.zustellung, 2)}. Zahlen lohnt sich also schneller als Liegenlassen, wenn der Vorwurf stimmt.</p>

<h2>Halter, Fahrer und Firmenwagen</h2>
<p>Bei kleinen Tempoverstößen geht das Schreiben oft an den Halter, weil das Kennzeichen auf dem Foto zuerst zum Fahrzeug führt. Bei Firmenwagen landet es in der Fuhrparkverwaltung, bei Mietwagen beim Vermieter, der die Daten des Mieters weitergibt und für diesen Aufwand nicht selten eine eigene Bearbeitungsgebühr laut Mietvertrag berechnet. Diese Gebühr steht in keinem Katalog. Wer im Ausland wohnt, bekommt das Schreiben unter Umständen über die Halterabfrage im Heimatstaat. Seit dem 1. Juli 2026 gilt außerdem § 4c StVG: Die Behörde über die Person am Steuer zu täuschen ist verboten und kann bis zu ${h.eur(V.taeuschung_bussgeld_max)} kosten.</p>

<h2>Kein Punkt, aber ein Zeitstempel</h2>
<p>Ein Verwarnungsgeld wird im Fahreignungsregister nicht eingetragen. Es zählt weder für den ${h.a('punkte-in-flensburg', 'Punktestand in Flensburg')} noch für die Probezeit noch für die Wiederholungsregel ab 26 km/h. Ganz ohne Folgen ist es trotzdem nicht: Die Behörde muss innerhalb der Verfolgungsverjährung handeln, die seit dem 1. Juli 2026 einheitlich ${V.verjaehrung_monate} Monate beträgt. Eine Anhörung unterbricht diese Frist nach § 33 OWiG. Mehr dazu auf der Seite zur ${h.a('verjaehrung-bussgeld', 'Verjährung')}.</p>

<h2>Lkw, Bus und Anhänger</h2>
<p>Die Beträge oben gelten für Pkw und Motorräder. Für Lkw über 3,5 Tonnen, Kraftfahrzeuge mit Anhänger und Busse gilt Tabelle 1 a, für Gefahrguttransporte und Busse mit Fahrgästen Tabelle 1 b. Dort kostet schon die erste Stufe ${h.eur(speeding({ limit: 50, measured: 60, inner: true, tolerance: false, cls: 'a' }).fine)} beziehungsweise ${h.eur(speeding({ limit: 50, measured: 60, inner: true, tolerance: false, cls: 'b' }).fine)} innerorts, und der Betrag aus Tabelle 1 b überschreitet die Verwarnungsgrenze. Wer mit Wohnwagen unterwegs ist, rechnet deshalb besser im ${h.a('bussgeldrechner', 'Bußgeldrechner')} mit der passenden Fahrzeugklasse.</p>`,
  },
  en: {
    slug: '10-kmh-over-the-limit',
    nav: '10 km/h over',
    card: 'A warning fine, no fees and no points: what 10 km/h over costs.',
    title: '10 km/h Over the Limit Germany 2026: Warning Fine Only',
    description: `10 km/h over the limit in Germany 2026: ${en(inn.fine)} in town, ${en(out.fine)} outside towns, no fees, no points. Why a 63 km/h camera reading in a 50 zone counts as exactly 10 km/h.`,
    h1: '10 km/h over the limit in Germany: the warning fine explained',
    intro: 'Up to 10 km/h too fast, Germany only issues a warning fine: no formal notice, no fees, nothing on your Flensburg record.',
    resume: `Driving a car up to 10 km/h above the limit in Germany costs ${en(inn.fine)} in a built-up area and ${en(out.fine)} elsewhere. The figure that counts is the speed after the tolerance deduction: ${T.kmh_bis_100} km/h comes off readings up to ${T.grenze_kmh} km/h and ${T.prozent_ueber_100 * 100} per cent off anything faster, always rounded in your favour. So a camera showing 63 km/h in a 50 zone means exactly 10 km/h over. Both amounts sit below the ${en(V.verwarnung_max)} line for a Verwarnungsgeld, a warning fine under Section 56 of the Administrative Offences Act. You receive no formal fine notice, pay no processing fee or postage and get no point in the Flensburg register. Drivers on probation are not affected either, since nothing is recorded. From 11 km/h the rate rises to ${en(in11.fine)} or ${en(out11.fine)}, still as a warning fine.`,
    faqs: [
      { q: 'I got a letter asking for 30 euros for speeding in Germany. Is that all I owe?', a: `If it covers 10 km/h or less in town in a car, yes: ${en(inn.fine)} is the full warning fine and no fees are added. Outside towns the same band costs ${en(out.fine)}. Pay it with the reference number on the letter before the deadline it gives, usually one week. Paying ends the case without any entry in the Flensburg register.` },
      { q: 'Will 10 km/h over in Germany affect my probationary licence?', a: 'No. Probation measures in Germany only follow offences recorded in the Flensburg register, and a warning fine is never recorded. Speeding in a car only reaches the register at more than 20 km/h over (annex 13 of the Driving Licence Ordinance). A small excess will not trigger the remedial course or extend your Probezeit, the two-year probation for new drivers.' },
      { q: 'How do German cameras subtract the tolerance from my speed?', a: `The PTB, Germany's national metrology institute, sets the deduction for approved devices: ${T.kmh_bis_100} km/h off readings up to ${T.grenze_kmh} km/h, ${T.prozent_ueber_100 * 100} per cent off higher readings, rounded down in your favour. A reading of 63 km/h becomes 60 km/h, a reading of 110 km/h becomes ${toleranz(110)} km/h. The fine is based on the reduced figure, which is the one printed in the letter.` },
      { q: 'Does an unpaid German warning fine follow me home abroad?', a: 'An unpaid warning fine is not enforceable on its own. The authority can then open ordinary proceedings and issue a Bußgeldbescheid, a formal fine notice, with at least 25 euros in fees and 3.50 euros postage. Within the EU, final fines can in many cases be enforced across borders, so ignoring the letter tends to cost more.' },
      { q: 'My rental company charged me a fee for a German speeding letter. Is that legal?', a: 'The fine and the rental company fee are two separate things. The authority asks the company who was driving, and the company passes on your details. Any handling charge comes from your rental contract, not from the German fine catalogue, which knows no such fee. The 30 or 20 euro warning fine itself stays the same.' },
    ],
    body: (h) => `
<h2>The one band where Germany waives the paperwork</h2>
<p>German speeding fines climb in bands, and the first band is the only one where nearly all side costs disappear. The reason is procedural. Under ${h.eur(V.verwarnung_max)}, the authority may issue a warning fine (Verwarnungsgeld) instead of a formal fine notice (Bußgeldbescheid). At ${h.eur(inn.fine)} in town and ${h.eur(out.fine)} outside towns, this band stays well below that line. What lands in your letterbox is a short letter or a hearing form (Anhörungsbogen) with a payment offer. Pay it and the case is closed. The neighbouring bands up to 15 km/h work the same way, but from 16 km/h a formal notice with fees takes over, as the ${h.a('kmh-20', 'page on 20 km/h over')} shows.</p>

<h2>Reading the numbers on your letter</h2>
<p>Newcomers often compare the speed in the letter with what they remember seeing on the speedometer and find a gap. Three numbers are in play: what your car showed, what the device measured and what you are charged with. Car speedometers tend to read slightly high, so your real speed was probably a little lower than the dial suggested. The device reading then loses the tolerance set by the ${h.src('ptb', 'national metrology institute (PTB)')}. Here is how readings in a 50 zone translate:</p>
${h.table(['Device reading', 'After tolerance', 'Over the limit', 'Warning fine'], messreihe.map(({ m, r }) => [`${h.num(m)} km/h`, `${h.num(r.vorwerfbar)} km/h`, `${h.num(r.over)} km/h`, h.eur(r.fine)]), 'Car in a built-up area, 50 km/h limit, catalogue table 1 c', ['l', 'r', 'r', 'r'])}
<p>On a country road limited to 100 km/h, readings above ${T.grenze_kmh} km/h lose ${T.prozent_ueber_100 * 100} per cent rather than a flat ${T.kmh_bis_100} km/h. A reading of 110 km/h is reduced to ${h.num(toleranz(110))} km/h, and even 114 km/h on the device stays in this band at ${h.num(toleranz(114))} km/h.</p>

<h2>Where the small band catches people</h2>
<p>Most 10 km/h letters come from 30 km/h zones near schools and in residential streets, where 40 km/h on the dial feels slow to anyone used to wider roads. A device reading of 43 km/h there counts as ${h.num(speeding({ limit: 30, measured: 43, inner: true }).over)} km/h over and costs ${h.eur(speeding({ limit: 30, measured: 43, inner: true }).fine)}. Whether a stretch counts as a built-up area depends on the yellow town sign (Ortsschild), not on how many houses you can see.</p>

<h2>Paying from a foreign bank account</h2>
<p>The letter gives an IBAN, the amount and a reference (Aktenzeichen). International transfers in euros within the SEPA area usually cost nothing; from outside, check what your bank charges so the authority receives the full amount. A short payment can leave the case open. Paying late is the costlier mistake: the warning only takes effect once paid in time, and without payment the authority may switch to a formal notice with at least ${h.eur(V.gebuehr_min)} in fees plus ${h.eur(V.zustellung, 2)} postage under ${h.src('owig107', 'Section 107 OWiG')}. The ${h.eur(inn.fine)} then becomes ${h.eur(inn.fine + V.gebuehr_min + V.zustellung, 2)}.</p>

<h2>Company cars, rentals and the person behind the wheel</h2>
<p>Camera letters go to the registered keeper first. With a company car that is your employer's fleet desk; with a rental, the rental firm, which forwards your details and may bill its own handling charge under the rental contract. If you borrowed a friend's car, they receive the letter and the hearing form asks who was driving. Since 1 July 2026, Section 4c of the Road Traffic Act forbids misleading the authority about the driver, with fines of up to ${h.eur(V.taeuschung_bussgeld_max)}. A warning fine is cheap enough that paying is rarely in doubt; naming someone else falsely is not worth the risk.</p>

<h2>What stays off your record</h2>
<p>A warning fine is not entered in the Fahreignungsregister, the national driver record in Flensburg. It does not add to your ${h.a('punkte-in-flensburg', 'Flensburg points')}, does not count for probation and does not feed the repeat-offence rule that starts at 26 km/h. It also has no effect when you later exchange a foreign licence for a German one. The authority must act within ${V.verjaehrung_monate} months of the offence, the time limit that applies to all traffic offences since July 2026.</p>

<h2>Vans, motorhomes and trailers</h2>
<p>The figures above apply to cars and motorcycles. Towing a caravan, driving a lorry over 3.5 tonnes or a bus puts you in table 1 a, where the first band costs ${h.eur(speeding({ limit: 50, measured: 60, inner: true, tolerance: false, cls: 'a' }).fine)} in town. Hazardous goods and buses with passengers fall under table 1 b at ${h.eur(speeding({ limit: 50, measured: 60, inner: true, tolerance: false, cls: 'b' }).fine)}, which is above the warning limit. To check a specific case, the ${h.a('bussgeldrechner', 'fine calculator')} lets you choose the vehicle class.</p>`,
  },
});
