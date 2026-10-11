import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding } from '../../lib/engine/bkat';
import { formatMoney, formatDecimal } from '../../lib/format';

const V = P.verfahren, T = P.toleranz, PZ = P.probezeit, PK = P.punkte;
const inn = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });
const out = speeding({ limit: 100, measured: 121, inner: false, tolerance: false });
const in20 = speeding({ limit: 50, measured: 70, inner: true, tolerance: false });
const out20 = speeding({ limit: 100, measured: 120, inner: false, tolerance: false });
const tilgungJahre = PK.tilgung_1p_monate / 12;
/** 20 und 21 km/h nebeneinander: der Unterschied von einem km/h. */
const paar = [
  { over: 20, i: in20, o: out20 },
  { over: 21, i: inn, o: out },
];
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-21',
  group: 'tempo',
  order: 130,
  mini: 'kmh21',
  related: ['kmh-20', 'kmh-26', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'probezeit-fuehrerschein', 'punkte-in-flensburg'],
  sources: ['bkatAnhang', 'fevAnl13', 'fevAnl12', 'stvg2a', 'stvg29'],
  de: {
    slug: '21-kmh-zu-schnell',
    nav: '21 km/h zu schnell',
    card: 'Ab hier gibt es den ersten Punkt, und in der Probezeit das Aufbauseminar.',
    title: '21 km/h zu schnell 2026: erster Punkt und Probezeit',
    description: `21 km/h zu schnell 2026: ${de(inn.fine)} innerorts, ${de(out.fine)} außerorts und ein Punkt in Flensburg. In der Probezeit ein A-Verstoß mit Aufbauseminar und Verlängerung.`,
    h1: '21 km/h zu schnell: der erste Punkt und die Folgen in der Probezeit',
    intro: 'Ein km/h über der 20er-Grenze reicht für einen Eintrag in Flensburg und, für Fahranfänger, für ein Aufbauseminar.',
    resume: `Wer mit dem Pkw 21 bis 25 km/h zu schnell war, zahlt innerorts ${de(inn.fine)} und außerorts ${de(out.fine)} und erhält einen Punkt im Fahreignungsregister. Mit Gebühr und Zustellung nach § 107 OWiG stehen innerorts ${de(inn.total, 2)} auf dem Bescheid. Bei 20 km/h wären es noch ${de(in20.fine)} ohne Punkt gewesen, ein einziger km/h trennt beide Fälle. Der Punkt wird ${formatDecimal(tilgungJahre, 1, 'de')} Jahre nach Rechtskraft tilgungsreif. Für Fahranfänger zählt die Überschreitung nach Anlage 12 der FeV als schwerwiegender A-Verstoß. Schon ein einziger A-Verstoß in der Probezeit führt zur Anordnung eines Aufbauseminars, und die Probezeit verlängert sich um ${PZ.verlaengerung_jahre} auf insgesamt ${PZ.jahre + PZ.verlaengerung_jahre} Jahre. Ein Fahrverbot gibt es in dieser Stufe nicht. In der 50er-Zone führt ein Messwert von 74 km/h nach ${T.kmh_bis_100} km/h Toleranz genau auf 21 km/h.`,
    faqs: [
      { q: 'Wie viel kostet 21 km/h zu schnell außerorts?', a: `${de(out.fine)} nach Tabelle 1 c des Bußgeldkatalogs, dazu ${de(out.fees, 2)} Gebühr und Zustellung, zusammen ${de(out.total, 2)}, und ein Punkt in Flensburg. Innerorts sind es ${de(inn.fine)}, insgesamt ${de(inn.total, 2)}. Ein Fahrverbot sieht der Katalog für 21 bis 25 km/h mit dem Pkw weder innerorts noch außerorts vor.` },
      { q: 'Muss ich nach 21 km/h zu schnell in der Probezeit zum Aufbauseminar?', a: `Ja, in der Regel. Überschreitungen ab 21 km/h sind in Anlage 12 der FeV als A-Verstoß aufgeführt, und nach § 2a Abs. 2 StVG genügt ein einziger A-Verstoß für die Anordnung des Aufbauseminars. Die Probezeit verlängert sich um ${PZ.verlaengerung_jahre} Jahre. Wer das Seminar nicht fristgerecht besucht, riskiert die Entziehung der Fahrerlaubnis.` },
      { q: 'Wann verschwindet der Punkt für 21 km/h zu schnell wieder?', a: `Ein Punkt wird nach § 29 StVG ${formatDecimal(tilgungJahre, 1, 'de')} Jahre nach Rechtskraft der Entscheidung getilgt. Danach bleibt der Eintrag noch ein Jahr in der sogenannten Überliegefrist gespeichert, bevor er endgültig gelöscht wird. Neue Verstöße verlängern die Frist alter Punkte seit 2014 nicht mehr: Jede Eintragung hat ihren eigenen Ablauf.` },
      { q: 'Ist 21 km/h zu schnell in der 30er-Zone schlimmer als in der 50er-Zone?', a: `Nein, der Katalog unterscheidet nur innerorts und außerorts. 51 km/h in der 30er-Zone kosten dasselbe wie 71 km/h in der 50er-Zone: ${de(inn.fine)} und einen Punkt. Die Behörde kann bei besonderen Umständen, etwa vor einer Schule während der Unterrichtszeit, vom Regelsatz abweichen, muss das aber begründen.` },
      { q: 'Wird die Probezeit bei 21 km/h zu schnell auch für einen EU-Führerschein verlängert?', a: `Ja, wenn Sie Ihren Wohnsitz in Deutschland haben und die Fahrerlaubnis jünger als ${PZ.jahre} Jahre ist. Für Inhaber eines Führerscheins aus einem anderen EU- oder EWR-Staat gilt die Probezeit ebenfalls, die seit dem Erwerb verstrichene Zeit wird angerechnet. Ein A-Verstoß löst dann dieselben Maßnahmen aus wie bei einem deutschen Führerschein.` },
    ],
    body: (h) => `
<h2>Ein km/h mit großer Wirkung</h2>
<p>Zwischen 20 und 21 km/h liegt die wichtigste Grenze der unteren Tempotabelle. Bis 20 km/h bleibt es bei einem Bescheid ohne Eintrag, ab 21 km/h steht der Verstoß in ${h.src('fevAnl13', 'Anlage 13 der FeV')} und erfüllt zugleich die Betragsgrenze von 60 Euro, also wird er im Fahreignungsregister gespeichert. Das Bußgeld steigt dabei um weniger als die Hälfte, die Folgen reichen aber Jahre weiter: ein Punkt mit eigener Tilgungsfrist und, für Fahranfänger, ein A-Verstoß. Wer im Anhörungsbogen 21 km/h liest, sollte deshalb als Erstes prüfen, ob der Toleranzabzug stimmt, denn bei einem km/h weniger wäre die Sache mit einer Zahlung erledigt.</p>
${h.table(['Zu schnell', 'Bußgeld innerorts', 'Gesamt innerorts', 'Bußgeld außerorts', 'Gesamt außerorts', 'Punkte', 'Probezeit'], paar.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), h.eur(i.total, 2), h.eur(o.fine), h.eur(o.total, 2), h.num(i.points), i.probe ? 'A-Verstoß' : 'kein Eintrag']), 'Pkw, Werte nach Toleranzabzug; Gesamtbetrag mit Kosten nach § 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r', 'l'])}

<h2>Der erste Eintrag in Flensburg</h2>
<p>Für viele Fahrer ist dies der erste Punkt überhaupt. Er hat zunächst nur eine Wirkung: Er steht im Register. Maßnahmen beginnen erst bei vier Punkten mit einer schriftlichen Ermahnung. Wichtiger ist die Frist. Nach ${h.src('stvg29', '§ 29 StVG')} wird ein Punkt ${h.num(PK.tilgung_1p_monate)} Monate nach Rechtskraft tilgungsreif, danach folgt eine Überliegefrist von ${h.num(PK.ueberliege_monate)} Monaten, in der die Eintragung noch gespeichert bleibt. Seit der Reform von 2014 hemmt ein neuer Verstoß diese Frist nicht mehr. Wer also in zwei Jahren erneut geblitzt wird, sammelt einen zweiten Punkt mit eigener Uhr, der erste läuft unverändert ab. Den eigenen Stand verrät der ${h.a('punkte-in-flensburg', 'Überblick zu den Punkten in Flensburg')}.</p>

<h2>Probezeit: warum 21 km/h ein A-Verstoß ist</h2>
<p>Anlage 12 der FeV teilt die Verstöße in der Probezeit in zwei Gruppen. A-Verstöße sind die schwerwiegenden, dazu gehört die Geschwindigkeit, sobald sie eingetragen wird. B-Verstöße sind die weniger schwerwiegenden, etwa ein Parkverstoß mit Behinderung oder abgefahrene Reifen. Nach ${h.src('stvg2a', '§ 2a StVG')} genügt ein A-Verstoß oder genügen zwei B-Verstöße, damit die Fahrerlaubnisbehörde ein Aufbauseminar anordnet. Gleichzeitig verlängert sich die Probezeit um ${PZ.verlaengerung_jahre} Jahre, also auf insgesamt ${PZ.jahre + PZ.verlaengerung_jahre} Jahre ab dem Erwerb. Die Kosten des Seminars trägt der Teilnehmer; Kursanbieter legen ihre Preise selbst fest. Die Anordnung kommt nicht von der Bußgeldstelle, sondern später von der Führerscheinstelle, oft erst Wochen nach Rechtskraft des Bescheids.</p>

<h2>Was ein zweiter Ausrutscher bedeutet</h2>
<p>Das Aufbauseminar ist die erste von drei Stufen. Wer nach dem Seminar noch innerhalb der verlängerten Probezeit erneut einen A-Verstoß oder zwei B-Verstöße begeht, erhält eine schriftliche Verwarnung, verbunden mit der Empfehlung, binnen ${PZ.beratung_frist_monate} Monaten eine verkehrspsychologische Beratung zu besuchen. Ein weiterer Verstoß danach führt zur Entziehung der Fahrerlaubnis; eine neue darf frühestens ${PZ.neuerteilung_sperre_monate} Monate später erteilt werden. Für Fahranfänger ist also schon der zweite Blitzer mit 21 km/h ein ernstes Thema. Die einzelnen Schritte beschreibt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Die Toleranz an der 20er-Grenze</h2>
<p>Weil hier ein einziger km/h über Punkt und Seminar entscheidet, ist der Abzug mehr als eine Formalie. Bis ${T.grenze_kmh} km/h Messwert werden ${T.kmh_bis_100} km/h abgezogen, darüber ${T.prozent_ueber_100 * 100} Prozent, abgerundet. Auf der Landstraße mit Tempo 100 bedeutet ein Messwert von 125 km/h nach Abzug ${h.num(speeding({ limit: 100, measured: 125, inner: false }).vorwerfbar)} km/h und damit ${h.num(speeding({ limit: 100, measured: 125, inner: false }).over)} km/h zu viel, ein Messwert von 126 km/h schon ${h.num(speeding({ limit: 100, measured: 126, inner: false }).over)} km/h. Im Anhörungsbogen stehen beide Werte, gemessen und vorgeworfen. Der ${h.a('bussgeldrechner', 'Bußgeldrechner')} macht die Gegenprobe.</p>

<h2>Welches Datum welche Frist startet</h2>
<p>Bei dieser Stufe laufen mehrere Uhren, und sie beginnen nicht am selben Tag. Für die Probezeit zählt der Tattag: Fiel der Blitzer in die Probezeit, ist der Verstoß relevant, auch wenn der Bescheid erst nach deren Ende rechtskräftig wird. Für die Tilgung des Punktes zählt dagegen die Rechtskraft, also bei einem Bescheid ohne Einspruch der Tag zwei Wochen nach Zustellung. Für die Verfolgung durch die Behörde zählt wiederum die Tat: Seit dem 1. Juli 2026 verjährt sie nach ${V.verjaehrung_monate} Monaten, sofern die Frist nicht etwa durch die Anhörung unterbrochen wurde. Wer seine Unterlagen sortiert, notiert sich deshalb alle drei Daten: Tattag, Zustellung und Rechtskraft. Aus ihnen ergibt sich später, wann der Punkt im Register verschwindet und ob die Führerscheinstelle ein Seminar anordnen darf.</p>

<h2>Ohne Probezeit: ein Punkt, mehr nicht</h2>
<p>Wer den Führerschein länger als zwei Jahre hat und keine weiteren Eintragungen, bekommt für diese Stufe einen Punkt, zahlt den Bescheid und hat danach keine weiteren Maßnahmen zu erwarten. Ein Fahreignungsseminar kann bei einem bis fünf Punkten einen Punkt abbauen, allerdings nur einmal in ${h.num(PK.seminar_sperre_jahre)} Jahren. Ob sich das bei einem einzelnen Punkt lohnt, hängt davon ab, wie oft man fährt; Einzelheiten stehen auf der Seite zum ${h.a('punkteabbau', 'Punkteabbau')}. Ab ${V.beharrlich_kmh} km/h kommt eine weitere Regel ins Spiel, die Wiederholung bestraft, mehr dazu unter ${h.a('kmh-26', '26 km/h zu schnell')}.</p>`,
  },
  en: {
    slug: '21-kmh-over-the-limit',
    nav: '21 km/h over',
    card: 'The first Flensburg point, and a remedial course for drivers on probation.',
    title: '21 km/h Over the Limit Germany 2026: Your First Point',
    description: `21 km/h over the limit in Germany 2026: ${en(inn.fine)} in town, ${en(out.fine)} outside towns, one Flensburg point. On probation it is an A offence with a remedial course.`,
    h1: '21 km/h over the limit in Germany: the first point and probation',
    intro: 'One km/h above the 20 km/h line is enough for an entry in the Flensburg register and, for new drivers, a mandatory course.',
    resume: `Driving a car 21 to 25 km/h too fast in Germany costs ${en(inn.fine)} in a built-up area and ${en(out.fine)} outside towns, and adds one point to the Fahreignungsregister, the national driver record kept in Flensburg. With the fee and delivery charge under Section 107 OWiG, the notice comes to ${en(inn.total, 2)} in town. At 20 km/h over the fine would have been ${en(in20.fine)} with no point, so a single km/h separates the two outcomes. The point becomes due for deletion ${formatDecimal(tilgungJahre, 1, 'en')} years after the decision is final. For drivers in their Probezeit, the two-year probation that follows a first licence, the offence counts as a serious A offence under annex 12 of the Driving Licence Ordinance. One A offence is enough for a mandatory remedial course (Aufbauseminar) and extends probation by ${PZ.verlaengerung_jahre} years. There is no driving ban in this band.`,
    faqs: [
      { q: 'I moved to Germany with a one-year-old EU licence. Does 21 km/h over put me on a course?', a: `Very likely. Residents with an EU or EEA licence are subject to German probation, with the time since you passed your test credited towards the ${PZ.jahre} years. An excess of 21 km/h or more is an A offence, and one A offence leads the licensing authority to order an Aufbauseminar and extend probation by ${PZ.verlaengerung_jahre} years (Section 2a StVG).` },
      { q: 'Does a Flensburg point from 21 km/h over expire if I leave Germany?', a: `Leaving does not delete it. The point stays in the register and expires on its own schedule: ${PK.tilgung_1p_monate} months after the decision became final, followed by a ${PK.ueberliege_monate}-month holding period before it is removed for good (Section 29 StVG). If you come back and drive in Germany, it is still counted until then.` },
      { q: 'Who orders the remedial course after 21 km/h over on probation?', a: `Not the fine office that sent the notice. The order comes later from the licensing authority (Fahrerlaubnisbehörde) where you live, once the fine has become final and been entered in the register. It sets a deadline for completing the Aufbauseminar. Probation is extended by ${PZ.verlaengerung_jahre} years at the same time. Ignoring the deadline can cost you the licence under Section 2a StVG.` },
      { q: 'How much is 21 km/h over the limit on a German motorway?', a: `On the Autobahn the out-of-town rates apply: ${en(out.fine)} plus ${en(out.fees, 2)} in fees and delivery, ${en(out.total, 2)} in total, and one point. Where no limit is signed, the advisory speed of 130 km/h is not a limit, so no fine applies for exceeding it, though liability after an accident can be affected.` },
      { q: 'How many mph is 21 km/h over the limit in Germany?', a: 'About 13 mph. German limits and fines are always expressed in km/h, so drivers of cars bought in the UK or the US should read the small inner scale on the speedometer or switch the display. The point threshold at 21 km/h means that roughly 13 mph over is enough for an entry in the Flensburg register.' },
    ],
    body: (h) => `
<h2>Why this is the line that matters</h2>
<p>For most drivers, 21 km/h over is where a German speeding ticket stops being just a bill. The offence is listed in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, and the fine passes 60 euros, which together mean an entry in the Flensburg register. The fine itself rises by less than half compared with 20 km/h. The consequences last years longer: a point with its own expiry date and, for anyone on probation, an A offence. Since one km/h makes the difference, check the tolerance on your hearing form before anything else.</p>
${h.table(['Over the limit', 'Fine in town', 'Total in town', 'Fine outside', 'Total outside', 'Points', 'On probation'], paar.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), h.eur(i.total, 2), h.eur(o.fine), h.eur(o.total, 2), h.num(i.points), i.probe ? 'A offence' : 'not recorded']), 'Car, speed after tolerance; totals include fees under Section 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r', 'l'])}

<h2>Probation rules for people who learned to drive abroad</h2>
<p>German probation (Probezeit) lasts ${PZ.jahre} years from a first licence. It is not only for teenagers who passed their test in Germany. If you hold an EU or EEA licence and move here, probation applies to you as a resident, minus the time since you passed. A 23-year-old who passed in Spain eighteen months ago and then moved to Munich is still on probation for six months. Under ${h.src('stvg2a', 'Section 2a StVG')}, a single A offence such as 21 km/h over leads the licensing office (Führerscheinstelle) to order a remedial course, the Aufbauseminar, and probation is extended by ${PZ.verlaengerung_jahre} years. Course providers set their own prices, so compare offers once the order arrives.</p>

<h2>What happens after the course</h2>
<p>A second A offence, or two B offences, after the course and still within the extended probation brings a written warning and a recommendation to attend a traffic-psychology consultation within ${PZ.beratung_frist_monate} months. One more after that and the licence is withdrawn; a new one cannot be issued for at least ${PZ.neuerteilung_sperre_monate} months. The full sequence is set out on the ${h.a('probezeit-fuehrerschein', 'probationary licence page')}.</p>

<h2>Living with one point</h2>
<p>Outside probation, a single point triggers nothing on its own. The German system only reacts at four points with a written reminder. The point expires ${PK.tilgung_1p_monate} months after the decision became final (${h.src('stvg29', 'Section 29 StVG')}), and later offences do not extend it. You can check your record for free with the Federal Motor Transport Authority; the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains how. A driver improvement seminar (Fahreignungsseminar) removes one point if you have between one and five, once every ${h.num(PK.seminar_sperre_jahre)} years.</p>

<h2>Checking the tolerance on a country road</h2>
<p>On a road limited to 100 km/h, readings above ${T.grenze_kmh} km/h lose ${T.prozent_ueber_100 * 100} per cent, rounded down. A reading of 125 km/h becomes ${h.num(speeding({ limit: 100, measured: 125, inner: false }).vorwerfbar)} km/h, which is ${h.num(speeding({ limit: 100, measured: 125, inner: false }).over)} km/h over; 126 km/h becomes ${h.num(speeding({ limit: 100, measured: 126, inner: false }).over)} km/h over and scores the point. In town the flat ${T.kmh_bis_100} km/h applies, so 74 km/h in a 50 zone is exactly 21 km/h over. The ${h.a('bussgeldrechner', 'fine calculator')} does this arithmetic from the measured figure.</p>

<h2>Three dates, three clocks</h2>
<p>Keep the paperwork, because different dates drive different consequences. For probation, the date of the offence counts: if you were flashed during your Probezeit, the offence matters even if the notice only becomes final after probation has ended. For the point, the clock starts when the decision becomes final, which without an objection is two weeks after the notice was delivered. And the authority itself must act within ${V.verjaehrung_monate} months of the offence, the limitation period in force since 1 July 2026, unless a step such as the hearing form interrupted it. Expats who move flats or leave the country for a while should note all three dates. They decide when the point drops off the record and whether a course order can still come.</p>

<h2>The next threshold to keep in mind</h2>
<p>This band carries no driving ban for cars. From ${V.beharrlich_kmh} km/h over, a different rule comes into play: a second offence of that size within a year can lead to a one-month ban even though neither offence would cause one alone. That rule is explained on the ${h.a('kmh-26', 'page on 26 km/h over')}. Commuters who drive the same route daily, and pass the same fixed camera, are the ones it catches most.</p>`,
  },
});
