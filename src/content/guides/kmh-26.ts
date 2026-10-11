import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const out = speeding({ limit: 100, measured: 126, inner: false, tolerance: false });
const inn = speeding({ limit: 50, measured: 76, inner: true, tolerance: false });
const outRep = speeding({ limit: 100, measured: 126, inner: false, tolerance: false, prior26: true });
/** Szenarien der Wiederholungsregel (§ 4 Abs. 2 Satz 2 BKatV), Pkw, Werte nach Toleranz. */
const szenarien = [
  { de: 'Erstmals 26 km/h, außerorts', en: 'First offence, 26 km/h, outside towns', r: out },
  { de: 'Erneut 26 km/h binnen eines Jahres, außerorts', en: 'Second 26 km/h within a year, outside towns', r: outRep },
  { de: 'Erneut 25 km/h binnen eines Jahres, außerorts', en: 'Second offence, only 25 km/h, outside towns', r: speeding({ limit: 100, measured: 125, inner: false, tolerance: false, prior26: true }) },
  { de: 'Erneut 26 km/h binnen eines Jahres, innerorts', en: 'Second 26 km/h within a year, in town', r: speeding({ limit: 50, measured: 76, inner: true, tolerance: false, prior26: true }) },
  { de: 'Erneut 35 km/h binnen eines Jahres, außerorts', en: 'Second offence, 35 km/h, outside towns', r: speeding({ limit: 100, measured: 135, inner: false, tolerance: false, prior26: true }) },
];
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-26',
  group: 'tempo',
  order: 140,
  mini: 'kmh26',
  related: ['kmh-21', 'kmh-31', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'fahrverbot', 'geblitzt-ausserorts'],
  sources: ['bkatv', 'bkatAnhang', 'stvg25', 'fevAnl13', 'owig107'],
  de: {
    slug: '26-kmh-zu-schnell',
    nav: '26 km/h zu schnell',
    card: 'Einmal kein Fahrverbot, zweimal binnen eines Jahres schon: die Beharrlichkeit.',
    title: '26 km/h zu schnell 2026: Bußgeld und Wiederholungsregel',
    description: `26 km/h zu schnell 2026: außerorts ${de(out.fine)} und ein Punkt. Wer binnen eines Jahres erneut ab ${V.beharrlich_kmh} km/h zu schnell ist, riskiert einen Monat Fahrverbot nach BKatV.`,
    h1: '26 km/h zu schnell: Bußgeld, Punkt und die Wiederholungsregel',
    intro: 'Für sich allein kostet diese Stufe Geld und einen Punkt; beim zweiten Mal innerhalb eines Jahres droht ein Fahrverbot.',
    resume: `Wer mit dem Pkw 26 bis 30 km/h zu schnell war, zahlt außerorts ${de(out.fine)} und innerorts ${de(inn.fine)}, jeweils mit einem Punkt in Flensburg. Ein Fahrverbot sieht der Katalog für diese Stufe nicht vor. Das ändert sich mit § 4 Abs. 2 Satz 2 BKatV: Wurde gegen Sie schon einmal wegen mindestens ${V.beharrlich_kmh} km/h ein Bußgeld rechtskräftig festgesetzt und sind Sie innerhalb eines Jahres seit dieser Rechtskraft erneut mindestens ${V.beharrlich_kmh} km/h zu schnell, gilt das als beharrliche Pflichtverletzung. Die Regelfolge ist ein Fahrverbot von einem Monat zusätzlich zum Bußgeld. Außerorts kostet der zweite Verstoß dann ${de(outRep.total, 2)} einschließlich Gebühren, einen weiteren Punkt und einen Monat ohne Führerschein. Zählt der erste Verstoß nur 25 km/h, greift die Regel nicht. Ein Messwert von 129 km/h auf einer Landstraße mit Tempo 100 ergibt nach ${T.prozent_ueber_100 * 100} Prozent Toleranz genau 25 km/h, 130 km/h dagegen 26 km/h.`,
    faqs: [
      { q: 'Gibt es für 26 km/h zu schnell außerorts ein Fahrverbot?', a: `Beim ersten Mal nicht. Der Katalog sieht ${de(out.fine)} und einen Punkt vor. Ein Fahrverbot kommt erst in Betracht, wenn schon ein Bußgeld wegen mindestens ${V.beharrlich_kmh} km/h rechtskräftig ist und der neue Verstoß innerhalb eines Jahres nach dieser Rechtskraft begangen wurde. Dann gilt nach § 4 Abs. 2 Satz 2 BKatV in der Regel ein Monat Fahrverbot.` },
      { q: 'Ab wann läuft die Jahresfrist bei zweimal 26 km/h zu schnell?', a: 'Ab der Rechtskraft der ersten Entscheidung, nicht ab dem ersten Blitzer. Maßgeblich ist, ob der zweite Verstoß innerhalb eines Jahres nach diesem Datum begangen wurde. Ein zweiter Blitzer, der noch vor der Rechtskraft des ersten Bescheids liegt, erfüllt diese Regel deshalb nicht. Das Datum der Rechtskraft ergibt sich aus der Zustellung des Bescheids plus zwei Wochen Einspruchsfrist.' },
      { q: 'Zählt ein Verstoß mit 26 km/h innerorts und einer außerorts zusammen?', a: `Ja. Die Regel fragt nur nach der Höhe der Überschreitung, nicht nach dem Ort. Ein rechtskräftiger Bescheid über 26 km/h innerorts und ein neuer Verstoß über 26 km/h auf der Landstraße innerhalb eines Jahres erfüllen sie genauso wie zwei Autobahnblitzer. Innerorts kostet die Stufe ${de(inn.fine)}, außerorts ${de(out.fine)}, jeweils mit einem Punkt.` },
      { q: 'Kann das Fahrverbot wegen Beharrlichkeit entfallen?', a: 'Die Verordnung spricht von einem Regelfall, nicht von einem Automatismus. Behörde oder Gericht können in Ausnahmefällen davon absehen, dann soll das Bußgeld nach § 4 Abs. 4 BKatV angemessen erhöht werden. Einen festen Betrag nennt die Verordnung nicht. Ob ein Ausnahmefall vorliegt, wird im Einzelfall entschieden; ein Rechenwert lässt sich dafür nicht angeben.' },
      { q: 'Wie viele Punkte habe ich nach zweimal 26 km/h zu schnell?', a: `Zwei, je einen pro Verstoß, und jeder hat seine eigene Tilgungsfrist von ${P.punkte.tilgung_1p_monate} Monaten ab Rechtskraft. Das Fahrverbot wegen Beharrlichkeit bringt keinen zusätzlichen Punkt, weil der Tatbestand der Geschwindigkeit bewertet wird. Mit zwei Punkten bleibt es bei der Vormerkung; Maßnahmen beginnen erst bei ${P.punkte.ermahnung_ab} Punkten.` },
    ],
    body: (h) => `
<h2>Die Stufe mit Gedächtnis</h2>
<p>Bei 26 km/h hat der Bußgeldkatalog zwei Gesichter. Für sich betrachtet ist die Stufe außerorts eine Steigerung der vorherigen: ${h.eur(out.fine)} statt ${h.eur(speeding({ limit: 100, measured: 121, inner: false, tolerance: false }).fine)}, weiterhin ein Punkt, kein Fahrverbot. Zugleich ist ${V.beharrlich_kmh} km/h die Schwelle, ab der ${h.src('bkatv', '§ 4 Abs. 2 BKatV')} die Vorgeschichte berücksichtigt. Ein zweiter Verstoß dieser Größe innerhalb eines Jahres nach Rechtskraft des ersten gilt als beharrliche Pflichtverletzung, und dann wird ein Monat Fahrverbot zur Regel, obwohl keiner der beiden Verstöße es allein auslösen würde. Für Pendler, die täglich dieselbe Landstraße oder Autobahn fahren, ist das die eigentliche Gefahr dieser Stufe: nicht der Betrag, sondern die Wiederholung.</p>

<h2>Fünf Fälle im Vergleich</h2>
<p>Die Tabelle rechnet mit derselben Logik wie der Bußgeldrechner; in jedem Fall außer dem ersten liegt bereits ein rechtskräftiger Bescheid über mindestens ${V.beharrlich_kmh} km/h vor, der weniger als ein Jahr alt ist.</p>
${h.table(['Fall', 'Bußgeld', 'Gesamt mit Kosten', 'Punkte', 'Fahrverbot'], szenarien.map((s) => [s.de, h.eur(s.r.fine), h.eur(s.r.total, 2), h.num(s.r.points), s.r.fv ? `${h.num(s.r.fv)} Monat` : 'nein']), 'Pkw, Werte nach Toleranz; Fahrverbot nach § 4 Abs. 2 Satz 2 BKatV', ['l', 'r', 'r', 'r', 'r'])}
<p>Die dritte Zeile zeigt die Grenze: Mit 25 km/h beim zweiten Mal bleibt es beim normalen Satz, die Vorgeschichte spielt keine Rolle. Die letzte Zeile zeigt, dass die Regel auch Stufen erfasst, die außerorts für sich kein Fahrverbot haben, etwa 31 bis 40 km/h. Wo der Katalog ohnehin ein Fahrverbot vorsieht, verlängert die Beharrlichkeit es nicht.</p>

<h2>Wie die Jahresfrist gezählt wird</h2>
<p>Die Frist beginnt mit der Rechtskraft der ersten Entscheidung. Ein Bescheid wird rechtskräftig, wenn die Einspruchsfrist von ${V.einspruch_wochen} Wochen ab Zustellung abläuft, ohne dass jemand Einspruch eingelegt hat. Ab diesem Tag zählt ein Jahr, und entscheidend ist, wann der zweite Verstoß begangen wurde, nicht wann er entschieden wird. Daraus folgt eine Lücke, die viele überrascht: Wer zweimal kurz hintereinander geblitzt wird, etwa auf Hin- und Rückfahrt derselben Reise, erfüllt diese Regel nicht, weil beim zweiten Blitzer noch kein Bescheid rechtskräftig war. Umgekehrt kann ein Verstoß aus dem Frühjahr mit einem aus dem nächsten Frühjahr zusammentreffen, wenn der erste Bescheid erst im Sommer rechtskräftig wurde.</p>

<h2>Rechenbeispiel: die Pendlerstrecke</h2>
<p>Eine Pendlerin wird im Februar auf der Bundesstraße mit 129 km/h bei Tempo 100 gemessen. Nach Abzug von ${T.prozent_ueber_100 * 100} Prozent bleiben ${h.num(speeding({ limit: 100, measured: 129, inner: false }).vorwerfbar)} km/h, also ${h.num(speeding({ limit: 100, measured: 129, inner: false }).over)} km/h zu viel: ${h.eur(speeding({ limit: 100, measured: 129, inner: false }).fine)}, ein Punkt, keine Vorbelastung im Sinne der Regel. Wäre der Messwert 130 km/h gewesen, hätte er ${h.num(speeding({ limit: 100, measured: 130, inner: false }).over)} km/h ergeben. Nehmen wir an, der Bescheid über 26 km/h wird im April rechtskräftig. Im März des Folgejahres misst ein Blitzer auf derselben Strecke erneut 26 km/h. Jetzt stehen auf dem zweiten Bescheid ${h.eur(outRep.fine)}, ${h.eur(outRep.fees, 2)} Kosten, ein Punkt und ein Monat Fahrverbot. Liegt der zweite Verstoß erst im Mai, nach Ablauf der Jahresfrist, bleibt es beim Bußgeld.</p>

<h2>Was die Regel nicht erfasst</h2>
<p>Satz 2 des § 4 Abs. 2 BKatV ist eng gefasst. Er betrifft nur Geschwindigkeit, nur Überschreitungen ab ${V.beharrlich_kmh} km/h und nur einen zweiten Verstoß nach Rechtskraft des ersten. Ein Rotlichtverstoß oder ein Handyverstoß zählt nicht als erste Stufe für einen späteren Blitzer. Auch ein Verwarnungsgeld oder ein Bescheid über 21 bis 25 km/h bleibt außen vor, selbst wenn es mehrere davon gibt. Daneben kennt Satz 1 derselben Vorschrift die beharrliche Pflichtverletzung als allgemeinen Gedanken: Behörde und Gericht dürfen bei einer auffälligen Häufung von Verstößen auch außerhalb dieses Regelbeispiels ein Fahrverbot prüfen. Das ist allerdings Einzelfallentscheidung und lässt sich nicht aus einer Tabelle ablesen. Der Rechner bildet deshalb nur das Regelbeispiel ab.</p>

<h2>Wann das Fahrverbot beginnt</h2>
<p>Für das Fahrverbot wegen Beharrlichkeit gelten dieselben Regeln wie für jedes andere nach ${h.src('stvg25', '§ 25 StVG')}. Gab es in den zwei Jahren vor der Tat kein Fahrverbot, darf der Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft gewählt werden. Beim typischen Pendler, der bisher nur Bußgelder hatte, ist das der Normalfall. Die Einzelheiten zur Abgabe und Rückgabe des Führerscheins stehen auf der Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Innerorts: dieselbe Regel, höhere Beträge</h2>
<p>Innerorts kostet die Stufe ${h.eur(inn.fine)} und ebenfalls einen Punkt. Die Wiederholungsregel gilt hier genauso, denn sie fragt nur nach der Überschreitung in km/h. Ein Verstoß in einer Tempo-30-Zone mit 56 km/h nach Toleranz zählt also ebenso als Vorbelastung wie 126 km/h auf der Landstraße. Wer beide Stufen vergleichen will, findet die Übersicht im Beitrag ${h.a('geblitzt-ausserorts', 'Geblitzt außerorts')} und die nächste Stufe unter ${h.a('kmh-31', '31 km/h zu schnell')}. Den eigenen Fall mit Vorbelastung rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')}, wenn Sie die Option zur früheren Überschreitung anklicken.</p>`,
  },
  en: {
    slug: '26-kmh-over-the-limit',
    nav: '26 km/h over',
    card: 'No ban the first time, a likely ban the second time within a year.',
    title: '26 km/h Over the Limit Germany 2026: The Repeat Rule',
    description: `26 km/h over the limit in Germany 2026: ${en(out.fine)} outside towns, one point. Repeat it within a year of the first fine becoming final and a one-month ban is usual.`,
    h1: '26 km/h over the limit in Germany: fine, point and the repeat rule',
    intro: 'On its own this band costs money and a point; a second offence of the same size within a year usually adds a driving ban.',
    resume: `Driving a car 26 to 30 km/h too fast in Germany costs ${en(out.fine)} outside towns and ${en(inn.fine)} in a built-up area, each with one Flensburg point and no driving ban. The catch is Section 4(2) of the fine catalogue ordinance (BKatV). If a fine for at least ${V.beharrlich_kmh} km/h over has already become final and you exceed the limit by ${V.beharrlich_kmh} km/h or more again within one year of that date, German law treats it as persistent misconduct. The usual result is a one-month Fahrverbot, a temporary driving ban, on top of the fine. Outside towns the second notice then comes to ${en(outRep.total, 2)} with fees, another point and a month without driving. A first offence of only 25 km/h does not count. On a 100 km/h road, a reading of 129 km/h becomes 25 km/h over after the ${T.prozent_ueber_100 * 100} per cent tolerance, while 130 km/h becomes 26.`,
    faqs: [
      { q: 'I was flashed twice on the same trip at 26 km/h over. Do I get a German driving ban?', a: 'Not under the repeat rule. It requires that the first fine had already become final when you committed the second offence. Two camera flashes on one journey happen before either notice is final, so each is fined separately, with one point each. The one-year window only opens once the first decision is final, two weeks after delivery if nobody objects.' },
      { q: 'Does a speeding fine from another country count for the German repeat rule?', a: `The rule in Section 4(2) BKatV refers to fines imposed for speeding of at least ${V.beharrlich_kmh} km/h, and in practice the authority relies on decisions recorded in the Flensburg register. Foreign fines are not entered there, even when they are enforced in Germany, so a ticket from France or Austria normally leaves the authority nothing to count as a first strike.` },
      { q: 'What does a second 26 km/h offence outside towns cost in Germany?', a: `The fine stays at the catalogue rate of ${en(outRep.fine)}, plus ${en(outRep.fees, 2)} in fees and postage, ${en(outRep.total, 2)} in total. What changes is the one-month driving ban that usually comes with it, and a second point in Flensburg. The ban follows the normal Section 25 rules, so a first ban in two years can be started within ${V.fahrverbot_schonfrist_monate} months.` },
      { q: 'Can I pay more instead of serving a repeat-offence driving ban in Germany?', a: 'The ordinance says the ban applies as a rule, and that if the authority or court exceptionally waives it, the fine should be raised appropriately (Section 4(4) BKatV). No fixed amount is set. Whether an exception applies, for example a serious threat to someone\'s job, is decided case by case, so no reliable figure can be calculated in advance.' },
      { q: 'How long does a 26 km/h fine count as a first strike in Germany?', a: `For one year from the day the decision became final. The point itself stays on your record for ${P.punkte.tilgung_1p_monate} months, but that longer period plays no role for the repeat rule. Once twelve months have passed since finality, a new offence of ${V.beharrlich_kmh} km/h or more is fined at the normal rate again, with one point and no ban.` },
    ],
    body: (h) => `
<h2>A band that remembers your history</h2>
<p>Viewed alone, 26 km/h over is just another step up the table: ${h.eur(out.fine)} outside towns, one point, no ban. It is also the threshold at which German law starts looking at what you did before. Under ${h.src('bkatv', 'Section 4(2) BKatV')}, two offences of at least ${V.beharrlich_kmh} km/h within a year count as persistent misconduct (beharrliche Pflichtverletzung), and the standard result is a one-month ban, even though neither offence would earn one on its own. People who commute long distances on the Autobahn or on fast country roads meet this rule more than anyone.</p>

<h2>How each case plays out</h2>
<p>Every row except the first assumes an earlier final fine for at least ${V.beharrlich_kmh} km/h over, less than a year old:</p>
${h.table(['Case', 'Fine', 'Total with fees', 'Points', 'Ban'], szenarien.map((s) => [s.en, h.eur(s.r.fine), h.eur(s.r.total, 2), h.num(s.r.points), s.r.fv ? `${h.num(s.r.fv)} month` : 'none']), 'Car, speed after tolerance; ban under Section 4(2) BKatV', ['l', 'r', 'r', 'r', 'r'])}
<p>The rule needs both offences to reach ${V.beharrlich_kmh} km/h. A second offence at 25 km/h is fined normally. A second offence at 35 km/h outside towns, a band that carries no ban of its own, picks one up through this rule. Where the catalogue already sets a ban, the repeat rule does not lengthen it.</p>

<h2>When the twelve months start</h2>
<p>The window opens on the day the first decision becomes final. For a fine notice that nobody objects to, that is the end of the ${V.einspruch_wochen}-week objection period after delivery. What then matters is the date of the second offence. This produces a gap that surprises people: two flashes on the outward and return legs of the same trip do not trigger the rule, because neither notice was final yet. It also means a fine from last spring can still count against an offence this spring if the first notice only became final in summer. If your post goes to an old address or to an employer for a company car, delivery and therefore finality may happen without your noticing, so keep track.</p>

<h2>A worked example on the commute</h2>
<p>Take an engineer who drives from Wiesbaden to Frankfurt each day. In February a camera on a 100 km/h stretch records 129 km/h. After the ${T.prozent_ueber_100 * 100} per cent deduction that is ${h.num(speeding({ limit: 100, measured: 129, inner: false }).vorwerfbar)} km/h, ${h.num(speeding({ limit: 100, measured: 129, inner: false }).over)} km/h over: ${h.eur(speeding({ limit: 100, measured: 129, inner: false }).fine)} and a point, but not a first strike. Had the reading been 130 km/h, it would have been ${h.num(speeding({ limit: 100, measured: 130, inner: false }).over)} km/h over. Suppose that 26 km/h notice became final in April. If the same camera catches 26 km/h again the following March, the second notice lists ${h.eur(outRep.fine)}, ${h.eur(outRep.fees, 2)} in costs, one point and a one-month ban. In May, the window would have closed.</p>

<h2>What the rule leaves out</h2>
<p>The repeat rule is narrow. It covers speeding only, both offences at ${V.beharrlich_kmh} km/h or more, the second after the first became final. A red-light fine or a phone fine does not count as a first strike for a later camera. Several fines in the 21 to 25 km/h band do not add up to one either. The ordinance does contain a broader notion of persistent misconduct in the sentence before, which lets an authority consider a ban when someone keeps offending, but that is a case-by-case judgement and no table can predict it.</p>

<h2>Serving the ban</h2>
<p>A repeat-rule ban works like any other under ${h.src('stvg25', 'Section 25 StVG')}. With no ban in the two years before the offence, you may choose when to start it within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final, which suits most commuters who had only fines before. You hand your licence to the authority; an EU licence held by a German resident is handed in too. The ${h.a('fahrverbot', 'driving ban guide')} covers the practical side.</p>

<h2>In town and elsewhere</h2>
<p>In a built-up area the band costs ${h.eur(inn.fine)} with one point, and the repeat rule applies in exactly the same way, since it only counts km/h. A town offence can be the first strike for a motorway offence and the other way round. For the out-of-town picture, see ${h.a('geblitzt-ausserorts', 'speed cameras outside towns')}, and the next band on the ${h.a('kmh-31', 'page on 31 km/h over')}. The ${h.a('bussgeldrechner', 'fine calculator')} has an option for an earlier offence of ${V.beharrlich_kmh} km/h or more.</p>`,
  },
});
