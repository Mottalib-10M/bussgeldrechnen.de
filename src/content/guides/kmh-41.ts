import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, toleranz } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const out = speeding({ limit: 100, measured: 141, inner: false, tolerance: false });
const inn = speeding({ limit: 50, measured: 91, inner: true, tolerance: false });
const out40 = speeding({ limit: 100, measured: 140, inner: false, tolerance: false });
/** Kleinster Messwert, der nach Toleranz 41 km/h über dem Limit ergibt. */
const ab41 = (limit: number) => { let m = limit + 41; while (toleranz(m) - limit < 41) m++; return m; };
const strecken = [
  { de: 'Innerorts, Tempo 50', en: 'Built-up area, 50 km/h', limit: 50, inner: true },
  { de: 'Außerorts, Tempo 70', en: 'Outside towns, 70 km/h', limit: 70, inner: false },
  { de: 'Landstraße, Tempo 100', en: 'Country road, 100 km/h', limit: 100, inner: false },
  { de: 'Autobahn, Tempo 120', en: 'Autobahn, 120 km/h', limit: 120, inner: false },
  { de: 'Autobahn, Tempo 130', en: 'Autobahn, 130 km/h', limit: 130, inner: false },
].map((s) => { const m = ab41(s.limit); return { ...s, m, r: speeding({ limit: s.limit, measured: m, inner: s.inner }) }; });
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-41',
  group: 'tempo',
  order: 160,
  mini: 'kmh41',
  related: ['kmh-31', 'kmh-51', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'fahrverbot', 'geblitzt-ausserorts'],
  sources: ['bkatAnhang', 'stvg25', 'ptb', 'owig107', 'fevAnl13'],
  de: {
    slug: '41-kmh-zu-schnell',
    nav: '41 km/h zu schnell',
    card: 'Das erste Fahrverbot auch außerorts, und wie man die Viermonatsfrist plant.',
    title: '41 km/h zu schnell 2026: Fahrverbot auch außerorts',
    description: `41 km/h zu schnell 2026: außerorts ${de(out.fine)}, innerorts ${de(inn.fine)}, jeweils zwei Punkte und ein Monat Fahrverbot. So legen Sie den Beginn in die Viermonatsfrist.`,
    h1: '41 km/h zu schnell: das Fahrverbot auf Landstraße und Autobahn',
    intro: 'Ab 41 km/h kostet eine Überschreitung auch außerhalb geschlossener Ortschaften einen Monat ohne Führerschein.',
    resume: `Wer mit dem Pkw 41 bis 50 km/h zu schnell war, bekommt erstmals auch außerorts ein Fahrverbot. Der Bußgeldkatalog sieht dort ${de(out.fine)}, zwei Punkte und einen Monat vor; mit Gebühren stehen ${de(out.total, 2)} auf dem Bescheid. Innerorts kostet die Stufe ${de(inn.fine)}, ebenfalls mit zwei Punkten und einem Monat, zusammen ${de(inn.total, 2)}. Bei 40 km/h außerorts wären es noch ${de(out40.fine)} und ein Punkt ohne Fahrverbot gewesen. Weil auf Landstraße und Autobahn fast alle Messwerte über ${T.grenze_kmh} km/h liegen, rechnet die Behörde dort mit ${T.prozent_ueber_100 * 100} Prozent Toleranz: Bei Tempo 100 braucht es einen Messwert von ${ab41(100)} km/h für 41 km/h Überschreitung. Wer in den zwei Jahren vor der Tat kein Fahrverbot hatte, kann den Beginn nach § 25 Abs. 2a StVG innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft frei wählen. Die Verbotsfrist läuft ab dem Tag, an dem die Behörde den Führerschein in Verwahrung nimmt.`,
    faqs: [
      { q: 'Wie viel kostet 41 km/h zu schnell auf der Autobahn?', a: `Auf der Autobahn gelten die Außerortssätze: ${de(out.fine)} Bußgeld, ${de(out.fees, 2)} Gebühr und Zustellung, insgesamt ${de(out.total, 2)}. Dazu kommen zwei Punkte und ein Monat Fahrverbot. Bei Tempo 120 ist das ab einem Messwert von ${ab41(120)} km/h der Fall, bei Tempo 130 ab ${ab41(130)} km/h, weil ${T.prozent_ueber_100 * 100} Prozent Toleranz abgezogen werden.` },
      { q: 'Wann muss ich bei 41 km/h zu schnell den Führerschein abgeben?', a: `Ohne Fahrverbot in den zwei Jahren vor der Tat haben Sie ${V.fahrverbot_schonfrist_monate} Monate ab Rechtskraft Zeit. Innerhalb dieser Frist geben Sie den Führerschein ab, wann es passt; der Monat zählt ab dem Eingang bei der Behörde. Gab es in den zwei Jahren schon ein Fahrverbot, wird das neue mit der Abgabe wirksam, spätestens einen Monat nach Rechtskraft.` },
      { q: 'Kann ich das Fahrverbot für 41 km/h in den Urlaub legen?', a: `Ja, wenn Ihnen die Viermonatsfrist zusteht. Rechnen Sie rückwärts: Der Bescheid wird ${V.einspruch_wochen} Wochen nach Zustellung rechtskräftig, ab dann laufen die ${V.fahrverbot_schonfrist_monate} Monate. Schicken Sie den Führerschein so ab, dass er am ersten Urlaubstag bei der Behörde eingeht. Die Rückgabe erfolgt nach einem Monat; viele Behörden senden ihn auf Antrag per Post zurück.` },
      { q: 'Wie viel kostet 41 km/h zu schnell innerorts im Vergleich zu außerorts?', a: `Innerorts ${de(inn.fine)}, außerorts ${de(out.fine)}. Punkte und Fahrverbot sind an beiden Orten gleich: zwei Punkte, ein Monat. Mit Kosten nach § 107 OWiG ergeben sich ${de(inn.total, 2)} innerorts und ${de(out.total, 2)} außerorts. Innerorts gilt schon seit 31 km/h ein Monat, ab 51 km/h werden es dort zwei Monate.` },
      { q: 'Läuft die Viermonatsfrist weiter, wenn ich Einspruch einlege?', a: 'Nein, sie beginnt erst gar nicht. Die Frist zählt ab der Rechtskraft, und ein Einspruch innerhalb von zwei Wochen nach Zustellung verhindert die Rechtskraft, bis über ihn entschieden ist. Wird der Einspruch zurückgenommen oder verworfen, tritt die Rechtskraft zu diesem späteren Zeitpunkt ein, und erst dann beginnen die vier Monate.' },
    ],
    body: (h) => `
<h2>Die Schwelle für Landstraße und Autobahn</h2>
<p>Bis 40 km/h behandelt der Bußgeldkatalog Verstöße außerhalb geschlossener Ortschaften milder. Bei 41 km/h endet diese Schonung. Ab hier gibt es auch auf der Bundesstraße und der Autobahn einen Monat Fahrverbot, und die Bewertung springt von einem auf zwei Punkte. Der Sprung von 40 auf 41 km/h ist außerorts der teuerste der ganzen Tabelle: ${h.eur(out40.fine)} werden zu ${h.eur(out.fine)}, ein Punkt wird zu zwei, und ein Monat ohne Auto kommt dazu. Wer viel auf freien Strecken fährt, wo Tempo 100 oder 120 schnell überschritten ist, trifft diese Stufe häufiger als Stadtfahrer. Innerorts ist das Fahrverbot schon seit ${h.a('kmh-31', '31 km/h')} fällig; dort verteuert die Stufe nur das Bußgeld auf ${h.eur(inn.fine)}.</p>

<h2>Welche Messwerte zu 41 km/h führen</h2>
<p>Außerorts zieht die Behörde bei Messwerten über ${T.grenze_kmh} km/h ${T.prozent_ueber_100 * 100} Prozent ab und rundet zugunsten des Fahrers ab, so sehen es die Vorgaben der ${h.src('ptb', 'PTB')} vor. Die Tabelle zeigt für typische Strecken den kleinsten Messwert, der nach Abzug 41 km/h ergibt:</p>
${h.table(['Strecke', 'Messwert ab', 'Nach Toleranz', 'Bußgeld', 'Fahrverbot'], strecken.map((s) => [s.de, `${h.num(s.m)} km/h`, `${h.num(s.r.vorwerfbar)} km/h`, h.eur(s.r.fine), `${h.num(s.r.fv)} Monat`]), 'Pkw; Toleranz nach PTB, Werte aus Tabelle 1 c der BKatV', ['l', 'r', 'r', 'r', 'r'])}
<p>Auf der Autobahn mit Tempo 130 braucht es also einen Messwert von ${h.num(ab41(130))} km/h. Auf Abschnitten ohne Tempolimit gibt es keinen Bußgeldtatbestand für zu schnelles Fahren, die Richtgeschwindigkeit von 130 km/h ist keine Grenze.</p>

<h2>Die Viermonatsfrist planen</h2>
<p>Für die meisten Betroffenen ist dies das erste Fahrverbot überhaupt. Dann gilt ${h.src('stvg25', '§ 25 Abs. 2a StVG')}: Das Verbot wird spätestens ${V.fahrverbot_schonfrist_monate} Monate nach Rechtskraft wirksam, und bis dahin bestimmen Sie den Zeitpunkt selbst. So sieht ein typischer Ablauf aus:</p>
<ol>
<li>Zustellung des Bescheids im gelben Umschlag; das Datum steht auf dem Umschlag.</li>
<li>${V.einspruch_wochen} Wochen später wird der Bescheid rechtskräftig, sofern kein Einspruch eingeht.</li>
<li>Ab diesem Tag laufen die ${V.fahrverbot_schonfrist_monate} Monate. Sie dürfen weiter fahren.</li>
<li>Sie senden den Führerschein an die Behörde, die im Bescheid genannt ist, am besten per Einschreiben, oder geben ihn persönlich ab.</li>
<li>Mit dem Eingang beginnt der Monat. Danach bekommen Sie den Führerschein zurück.</li>
</ol>
<p>Wer nichts unternimmt, fährt nach Ablauf der vier Monate ohne Berechtigung, auch wenn der Führerschein noch in der Tasche ist. Ab diesem Tag gilt das Verbot, und die Monatsfrist beginnt trotzdem erst mit der Abgabe. Damit lässt sich der Monat etwa in eine Elternzeit legen, in der das Auto ohnehin seltener gebraucht wird.</p>

<h2>Wann die Wahlfreiheit fehlt</h2>
<p>Gab es in den zwei Jahren vor dem neuen Verstoß bereits ein rechtskräftiges Fahrverbot, entfällt die Schonfrist. Das neue Verbot wird mit der Abgabe des Führerscheins wirksam, spätestens einen Monat nach Rechtskraft. Wer zwei Verbote zu verbüßen hat, verbüßt sie nacheinander. Welche Variante gilt, steht im Bescheid selbst: Er muss belehren, wann das Verbot wirksam wird. Mehr zur Abgabe und Rückgabe erklärt die Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Mit Anhänger oder im Lkw: zwei Monate innerorts</h2>
<p>Die Werte oben gelten für Pkw und Motorräder nach Tabelle 1 c. Wer mit Anhänger fährt oder einen Lkw über 3,5 Tonnen steuert, wird nach Tabelle 1 a strenger behandelt. Dort kosten 41 bis 50 km/h innerorts ${h.eur(speeding({ limit: 50, measured: 91, inner: true, tolerance: false, cls: 'a' }).fine)} und ${h.num(speeding({ limit: 50, measured: 91, inner: true, tolerance: false, cls: 'a' }).fv)} Monate Fahrverbot, außerorts ${h.eur(speeding({ limit: 80, measured: 121, inner: false, tolerance: false, cls: 'a' }).fine)} und ${h.num(speeding({ limit: 80, measured: 121, inner: false, tolerance: false, cls: 'a' }).fv)} Monat. Weil Gespanne außerorts in der Regel nur 80 km/h fahren dürfen, liegt die Schwelle für sie auf der Autobahn bei einem Messwert von ${h.num(ab41(80))} km/h, also bei einer Geschwindigkeit, die mit dem Pkw allein noch erlaubt wäre. Wer im Sommer mit dem Wohnwagen in den Urlaub fährt, sollte diese Rechnung kennen.</p>

<h2>Punkte, die fünf Jahre bleiben</h2>
<p>Die zwei Punkte dieser Stufe stehen in ${h.src('fevAnl13', 'Anlage 13 der FeV')} bei den besonders verkehrssicherheitsbeeinträchtigenden Ordnungswidrigkeiten. Sie werden ${h.num(P.punkte.tilgung_2p_monate)} Monate nach Rechtskraft tilgungsreif. In der Probezeit ist der Verstoß ein A-Verstoß mit Aufbauseminar und Verlängerung. Die Kosten des Bescheids nach ${h.src('owig107', '§ 107 OWiG')} betragen bei ${h.eur(out.fine)} genau ${h.eur(out.fees, 2)}, weil fünf Prozent unter der Mindestgebühr bleiben. Den eigenen Fall rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')}, die nächste Stufe zeigt ${h.a('kmh-51', '51 km/h zu schnell')}.</p>`,
  },
  en: {
    slug: '41-kmh-over-the-limit',
    nav: '41 km/h over',
    card: 'The first ban on open roads too, and how to time the four-month window.',
    title: '41 km/h Over the Limit Germany 2026: Ban on Open Roads',
    description: `41 km/h over the limit in Germany 2026: ${en(out.fine)} outside towns, ${en(inn.fine)} in town, two points and a one-month ban either way. How to time the four-month window.`,
    h1: '41 km/h over the limit in Germany: a ban on the open road',
    intro: 'From 41 km/h over, a German speeding offence costs you a month without driving even on country roads and motorways.',
    resume: `Driving a car 41 to 50 km/h too fast in Germany is the first band with a driving ban outside built-up areas. The fine catalogue sets ${en(out.fine)}, two Flensburg points and a one-month Fahrverbot (driving ban) on open roads; with fees the notice comes to ${en(out.total, 2)}. In town the band costs ${en(inn.fine)}, also with two points and one month, ${en(inn.total, 2)} in total. At 40 km/h over outside towns it would still have been ${en(out40.fine)} and a single point. Because almost every reading on a country road or Autobahn is above ${T.grenze_kmh} km/h, ${T.prozent_ueber_100 * 100} per cent is deducted: on a 100 km/h road you need a reading of ${ab41(100)} km/h to reach 41 km/h over. If you had no ban in the two years before the offence, you may start it whenever suits you within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final. The month counts from the day the authority receives your licence.`,
    faqs: [
      { q: 'What reading does a German Autobahn camera need for 41 km/h over at a 130 limit?', a: `At least ${ab41(130)} km/h. Above ${T.grenze_kmh} km/h, ${T.prozent_ueber_100 * 100} per cent of the reading is deducted and the result rounded down, which leaves ${toleranz(ab41(130))} km/h. That is 41 km/h over: ${en(out.fine)}, two points and a one-month ban. At a 120 limit the threshold reading is ${ab41(120)} km/h. Stretches without a limit carry no speeding fine.` },
      { q: 'Can I time a German driving ban to match a trip back home?', a: `Yes, if it is your first ban in two years. You get ${V.fahrverbot_schonfrist_monate} months from the date the decision is final, which is ${V.einspruch_wochen} weeks after delivery without an objection. Send the licence so it reaches the authority on the day you want the month to start. Your German or EU licence is held by the authority for that month, so you will not have it with you abroad either; plan any car hire around that.` },
      { q: 'What happens if I forget to hand in my licence within the four months?', a: 'The ban takes effect anyway when the four months end, so from that day you may not drive in Germany. The one-month period, though, only starts when the authority receives the licence. Waiting therefore lengthens the time you are banned. Driving while banned is a criminal offence under Section 21 of the Road Traffic Act.' },
      { q: 'Is 41 km/h over in Germany more expensive in town or outside?', a: `In town: ${en(inn.fine)} against ${en(out.fine)} outside towns. The points and the ban are the same in both places, two points and one month. Including the fee and delivery costs, the totals are ${en(inn.total, 2)} and ${en(out.total, 2)}. In town, a ban already applies from 31 km/h over, and from 51 km/h it rises to two months.` },
      { q: 'I drive in Germany on a US licence. What happens to it during a ban for 41 km/h over?', a: `A licence issued outside the EU and EEA is not taken away. Instead the authority enters a note of the ban in it (Section 25 StVG), and you may not drive a motor vehicle in Germany for the month. Keep in mind that a US licence is only valid for ${P.fuehrerschein.drittstaat_monate} months after you take up residence, so the ban may coincide with the time to exchange it.` },
    ],
    body: (h) => `
<h2>The open-road cushion ends here</h2>
<p>Up to 40 km/h over, German law treats speeding on country roads and motorways more gently than in towns. At 41 km/h the cushion is gone: a one-month ban applies on the Autobahn too, and the offence scores two points instead of one. For a car, the step from 40 to 41 km/h over outside towns is the costliest in the whole table: ${h.eur(out40.fine)} becomes ${h.eur(out.fine)}, one point becomes two and a month without a licence is added. Drivers who commute on fast roads, or who drive long distances on weekends to visit family, meet this band more often than city drivers. In town the ban has applied since ${h.a('kmh-31', '31 km/h over')}; here the fine simply rises to ${h.eur(inn.fine)}.</p>

<h2>Camera readings that reach the band</h2>
<p>On fast roads, readings above ${T.grenze_kmh} km/h lose ${T.prozent_ueber_100 * 100} per cent, rounded down, according to the rules of the ${h.src('ptb', 'national metrology institute (PTB)')}. The table gives the lowest reading that leaves 41 km/h over on common types of road:</p>
${h.table(['Road', 'Lowest reading', 'After tolerance', 'Fine', 'Ban'], strecken.map((s) => [s.en, `${h.num(s.m)} km/h`, `${h.num(s.r.vorwerfbar)} km/h`, h.eur(s.r.fine), `${h.num(s.r.fv)} month`]), 'Car; tolerance as set by the PTB, fines from table 1 c of the BKatV', ['l', 'r', 'r', 'r', 'r'])}
<p>Germany's famous unrestricted Autobahn stretches carry an advisory speed of 130 km/h but no limit, so no speeding fine applies there. Variable signs above the lanes, though, are binding limits and are often enforced by cameras.</p>

<h2>Timing the ban around your life</h2>
<p>For most people this is a first ban, which brings the four-month window of ${h.src('stvg25', 'Section 25(2a) StVG')}. The ban takes effect at the latest ${V.fahrverbot_schonfrist_monate} months after the decision becomes final, and until then you choose. In practice:</p>
<ol>
<li>Note the delivery date printed on the yellow envelope.</li>
<li>Add ${V.einspruch_wochen} weeks: that is when the notice becomes final if nobody objects.</li>
<li>From then you have ${V.fahrverbot_schonfrist_monate} months and may keep driving.</li>
<li>Send your licence to the authority named in the notice by registered post, or hand it in in person.</li>
<li>The month starts when it arrives; the licence comes back at the end, by post if you ask.</li>
</ol>
<p>Expats often line the month up with a long visit home or a quieter month at work. If you rely on the car for school runs, look at the Deutschlandticket or a bike for the month before you pick the date.</p>

<h2>No window after a recent ban</h2>
<p>If you had a ban that became final in the two years before this offence, the window does not apply. The new ban starts when you hand in your licence and no later than one month after the decision becomes final. Separate bans run one after the other. The notice has to say which rule applies to you, so read that sentence first. The ${h.a('fahrverbot', 'driving ban guide')} covers what happens with EU and non-EU licences.</p>

<h2>Towing a trailer lowers the bar</h2>
<p>Hire a trailer for a move to a new flat or tow a caravan to the Alps, and table 1 a applies instead of the car table. A car with a trailer is usually limited to 80 km/h outside towns, even on the Autobahn, so 41 km/h over is reached at a reading of ${h.num(ab41(80))} km/h, a speed that would be legal for the car alone on many stretches. The fine in that table is ${h.eur(speeding({ limit: 80, measured: 121, inner: false, tolerance: false, cls: 'a' }).fine)} outside towns with ${h.num(speeding({ limit: 80, measured: 121, inner: false, tolerance: false, cls: 'a' }).fv)} month, and in town ${h.eur(speeding({ limit: 50, measured: 91, inner: true, tolerance: false, cls: 'a' }).fine)} with ${h.num(speeding({ limit: 50, measured: 91, inner: true, tolerance: false, cls: 'a' }).fv)} months.</p>

<h2>Five years of points</h2>
<p>Bans come with two points under ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, which stay until ${h.num(P.punkte.tilgung_2p_monate)} months after the decision is final. For drivers on probation it is an A offence with a remedial course. The costs under ${h.src('owig107', 'Section 107 OWiG')} are ${h.eur(out.fees, 2)} because five per cent of ${h.eur(out.fine)} is below the minimum fee. Try your own figures in the ${h.a('bussgeldrechner', 'fine calculator')}, or look at the next band on the ${h.a('kmh-51', 'page on 51 km/h over')}.</p>`,
  },
});
