import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, fees } from '../../lib/engine/bkat';
import { formatMoney, formatDecimal } from '../../lib/format';

const V = P.verfahren, PK = P.punkte;
/** Beispielfälle Pkw innerorts (Überschreitung nach Toleranz) für die Kostentabelle. */
const faelle = [12, 18, 23, 28, 35, 45, 55].map((over) => ({ over, o: speeding({ limit: 50, measured: 50 + over, inner: true, tolerance: false }) }));
const ex = speeding({ limit: 100, measured: 128, inner: false });
const exFv = speeding({ limit: 50, measured: 85, inner: true });
const f100 = fees(100);
const tilg1 = PK.tilgung_1p_monate / 12, tilg2 = PK.tilgung_2p_monate / 12;
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'zu-schnell-gefahren',
  group: 'tempo',
  order: 50,
  mini: 'einspruch',
  related: ['geblitzt', 'bussgeldbescheid', 'verjaehrung-bussgeld', 'punkte-in-flensburg', 'fahrverbot', 'bussgeldrechner'],
  sources: ['stvg26', 'bgbl2026_142', 'owig107', 'stvg25', 'stvg29', 'bkatAnhang'],
  de: {
    slug: 'zu-schnell-gefahren',
    nav: 'Zu schnell gefahren',
    card: 'Der Ablauf nach dem Verstoß: Anhörung, Bescheid, Fristen, Zahlung, Punkte und Fahrverbot.',
    title: 'Zu schnell gefahren 2026: Ablauf, Fristen und Kosten',
    description: `Zu schnell gefahren 2026: Anhörung, Bescheid, ${V.einspruch_wochen} Wochen Einspruchsfrist, Rechtskraft, Zahlung, Punkt. Verjährung seit Juli ${V.verjaehrung_monate} Monate, Gebühr mindestens ${de(V.gebuehr_min)}.`,
    h1: 'Zu schnell gefahren: was nach dem Verstoß passiert',
    intro: 'Vom Messtag bis zur Rückgabe des Führerscheins vergehen oft Monate, und an jeder Station läuft eine eigene Frist.',
    resume: `Wer zu schnell gefahren ist, durchläuft ein Bußgeldverfahren mit festen Stationen: Messung, Anhörung, Bußgeldbescheid, Rechtskraft, Zahlung und gegebenenfalls Eintrag in Flensburg und Fahrverbot. Bis ${V.verwarnung_max} Euro endet alles mit einem Verwarnungsgeld ohne Kosten. Darüber erlässt die Bußgeldstelle einen Bescheid mit Gebühr von fünf Prozent, mindestens ${de(V.gebuehr_min)}, und ${de(V.zustellung, 2)} Zustellung nach § 107 OWiG; aus ${de(100)} werden so ${de(100 + f100.total, 2)}. Gegen den Bescheid ist binnen ${V.einspruch_wochen} Wochen nach Zustellung der Einspruch möglich. Geht keiner ein, wird der Bescheid rechtskräftig, und die Geldbuße ist in der Regel binnen zwei weiteren Wochen zu zahlen. Erst mit der Rechtskraft wird ein Punkt eingetragen und beginnt seine Tilgungsfrist. Seit dem 1. Juli 2026 hat die Behörde nach § 26 Abs. 3 StVG ${V.verjaehrung_monate} Monate Zeit, die Tat zu verfolgen; vorher waren es drei Monate bis zum Erlass eines Bescheids.`,
    faqs: [
      { q: 'Wann wird ein Bußgeldbescheid wegen zu schnellen Fahrens rechtskräftig?', a: `Zwei Wochen nach der Zustellung, wenn bis dahin kein Einspruch bei der Behörde eingegangen ist (§ 67 OWiG). Maßgeblich ist das Datum, an dem der Bescheid zugestellt wurde; bei der förmlichen Zustellung steht es auf dem gelben Umschlag. Ab der Rechtskraft laufen die Zahlungsfrist, die Tilgungsfrist für Punkte und, bei einem Fahrverbot, die Frist von höchstens ${V.fahrverbot_schonfrist_monate} Monaten für die Abgabe des Führerscheins.` },
      { q: 'Wie viel Zeit habe ich nach der Rechtskraft, um das Bußgeld zu bezahlen?', a: 'Der Bescheid fordert in der Regel auf, die Geldbuße und die Kosten spätestens zwei Wochen nach Rechtskraft zu zahlen, so verlangt es § 66 Abs. 2 OWiG für seinen Inhalt. Wer nicht zahlt, wird gemahnt, danach wird vollstreckt. Als letztes Mittel kann das Gericht Erzwingungshaft anordnen (§ 96 OWiG), wenn jemand zahlen könnte, es aber nicht tut. Die Schuld selbst erlischt durch die Haft nicht.' },
      { q: 'Kann ich das Bußgeld für zu schnelles Fahren in Raten zahlen?', a: `Ja, wenn die wirtschaftlichen Verhältnisse eine sofortige Zahlung nicht zulassen. § 18 OWiG erlaubt der Behörde, eine Zahlungsfrist zu bewilligen oder Teilbeträge festzusetzen. Der Antrag geht an die Stelle, die den Bescheid erlassen hat, am besten mit einer kurzen Begründung. Bei einem Bescheid von ${de(exFv.total, 2)} für ${exFv.over} km/h zu schnell innerorts ist das keine Seltenheit.` },
      { q: 'Wann taucht der Punkt nach zu schnellem Fahren in Flensburg auf?', a: `Erst nach der Rechtskraft des Bescheids. Dann meldet die Bußgeldstelle die Entscheidung an das Kraftfahrt-Bundesamt, das sie im Fahreignungsregister speichert. Die Tilgungsfrist beginnt mit dem Tag der Rechtskraft: ${formatDecimal(tilg1, 1, 'de')} Jahre für einen Punkt, ${formatDecimal(tilg2, 1, 'de')} Jahre für zwei Punkte, jeweils mit einem weiteren Jahr Überliegefrist. Ein Einspruch verschiebt den Eintrag, weil die Rechtskraft später eintritt.` },
      { q: 'Was ändert sich 2026 bei der Verjährung, wenn ich zu schnell gefahren bin?', a: `Für Taten seit dem 1. Juli 2026 beträgt die Verfolgungsverjährung nach § 26 Abs. 3 StVG ${V.verjaehrung_monate} Monate, unabhängig davon, ob schon ein Bescheid erlassen wurde. Vorher galten drei Monate bis zum Bescheid und sechs Monate danach. Unterbrochen wird die Frist weiterhin durch Handlungen nach § 33 OWiG, etwa die Anhörung; danach läuft sie neu.` },
    ],
    body: (h) => `
<h2>Die Stationen im Überblick</h2>
<p>Ein Bußgeldverfahren wegen zu schnellen Fahrens folgt dem Gesetz über Ordnungswidrigkeiten (OWiG) und dem Straßenverkehrsgesetz. Die Reihenfolge ist fast immer gleich, die Abstände dazwischen nicht.</p>
<ol>
<li><strong>Tattag:</strong> Messung durch Blitzer, Laser oder Nachfahren. Ab hier läuft die Verfolgungsverjährung.</li>
<li><strong>Anhörung:</strong> Anhörungsbogen oder Zeugenfragebogen an den Halter. Die Frist der Verjährung wird dadurch unterbrochen und beginnt neu.</li>
<li><strong>Bußgeldbescheid:</strong> förmlich zugestellt, meist im gelben Umschlag. Er nennt Betrag, Kosten, Punkte und gegebenenfalls das Fahrverbot.</li>
<li><strong>Einspruchsfrist:</strong> ${h.num(V.einspruch_wochen)} Wochen ab Zustellung.</li>
<li><strong>Rechtskraft:</strong> ohne Einspruch am Tag nach Ablauf der Frist.</li>
<li><strong>Zahlung:</strong> in der Regel binnen zwei Wochen nach Rechtskraft.</li>
<li><strong>Eintrag:</strong> Meldung an das Fahreignungsregister, Beginn der Tilgungsfrist.</li>
<li><strong>Fahrverbot:</strong> Abgabe des Führerscheins innerhalb der im Bescheid genannten Frist.</li>
</ol>
<p>Bis ${h.eur(V.verwarnung_max)} endet das Verfahren schon nach der zweiten Station: Die Behörde bietet ein Verwarnungsgeld an, und mit der fristgerechten Zahlung ist alles erledigt. Wie die Anhörung abläuft und wer sie bekommt, steht auf der Seite ${h.a('geblitzt', 'Geblitzt')}.</p>

<h2>Verjährung: die neue Frist seit dem 1. Juli 2026</h2>
<p>Mit dem ${h.src('bgbl2026_142', 'Fünften Gesetz zur Änderung des StVG')} hat der Gesetzgeber die Verfolgungsverjährung vereinfacht. Nach ${h.src('stvg26', '§ 26 Abs. 3 StVG')} in der neuen Fassung verjähren Verkehrsordnungswidrigkeiten in ${h.num(V.verjaehrung_monate)} Monaten. Früher waren es drei Monate, solange weder ein Bescheid erlassen noch öffentliche Klage erhoben war, und sechs Monate danach. Für Bußgeldstellen bedeutet das mehr Zeit für die Ermittlung des Fahrers, gerade bei Firmen- und Mietwagen.</p>
<p>Die Frist beginnt mit der Tat. Bestimmte Handlungen unterbrechen sie, aufgezählt in § 33 OWiG, darunter die erste Vernehmung oder die Bekanntgabe, dass ein Verfahren eingeleitet ist, und der Erlass des Bescheids. Nach jeder Unterbrechung läuft die Frist von vorn. Ob eine Tat verjährt ist, lässt sich also nur mit allen Daten der Akte beurteilen, nicht allein mit dem Abstand zwischen Tattag und Bescheid. Mehr dazu auf der Seite ${h.a('verjaehrung-bussgeld', 'Verjährung im Bußgeldverfahren')}.</p>

<h2>Der Bescheid und seine Kosten</h2>
<p>Liegt der Regelsatz über ${h.eur(V.verwarnung_max)}, ergeht ein Bußgeldbescheid. Zum Bußgeld kommen nach ${h.src('owig107', '§ 107 OWiG')} eine Gebühr von fünf Prozent, mindestens ${h.eur(V.gebuehr_min)} und höchstens ${h.eur(V.gebuehr_max)}, und ${h.eur(V.zustellung, 2)} für die Zustellung. Bei allen üblichen Tempoverstößen greift die Mindestgebühr, denn fünf Prozent übersteigen ${h.eur(V.gebuehr_min)} erst bei einem Bußgeld über ${h.eur(V.gebuehr_min / V.gebuehr_satz)}. Für Pkw innerorts nach ${h.src('bkatAnhang', 'Tabelle 1 c')} sieht das so aus:</p>
${h.table(['Zu schnell innerorts', 'Bußgeld', 'Gebühr', 'Zustellung', 'Gesamt', 'Punkte', 'Fahrverbot'], faelle.map(({ over, o }) => { const f = fees(o.fine); return [`${h.num(over)} km/h`, h.eur(o.fine), f.verwarnung ? 'keine' : h.eur(f.gebuehr, 2), f.verwarnung ? 'keine' : h.eur(f.auslagen, 2), h.eur(o.total, 2), h.num(o.points), o.fv ? `${h.num(o.fv)} Monat${o.fv > 1 ? 'e' : ''}` : 'nein']; }), 'Pkw innerorts, Werte nach Toleranzabzug; Kosten nach § 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Ein Bescheid wird förmlich zugestellt, meist mit Postzustellungsurkunde. Der Zusteller vermerkt das Datum auf dem Umschlag; ist niemand zu Hause, gilt der Bescheid mit dem Einwurf in den Briefkasten oder der Benachrichtigung über die Niederlegung als zugestellt. Dieses Datum ist der Ausgangspunkt für alle weiteren Fristen. Wie man einen Bescheid Zeile für Zeile liest, zeigt die Seite ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}.</p>

<h2>Zwei Wochen: Einspruch oder Rechtskraft</h2>
<p>Nach § 67 OWiG kann der Betroffene innerhalb von ${h.num(V.einspruch_wochen)} Wochen nach Zustellung schriftlich oder zur Niederschrift bei der Behörde Einspruch einlegen. Eine Begründung ist nicht vorgeschrieben. Der Einspruch ist ein Recht, keine Pflicht, und seine Folgen sind nüchtern zu betrachten: Die Behörde prüft den Fall erneut und kann den Bescheid aufrechterhalten oder zurücknehmen. Hält sie ihn aufrecht, gibt sie die Akte über die Staatsanwaltschaft an das Amtsgericht. Das Gericht entscheidet dann selbst über die Höhe der Geldbuße und ist an den Betrag des Bescheids nicht gebunden. Kosten des gerichtlichen Verfahrens können hinzukommen. Bis zur Entscheidung tritt keine Rechtskraft ein, also werden auch kein Punkt eingetragen und kein Fahrverbot wirksam.</p>
<p>Geht kein Einspruch ein, wird der Bescheid mit Ablauf der zwei Wochen rechtskräftig. Ein Beispiel: Zustellung am Montag, dem 2. November 2026; die Frist endet mit Ablauf des Montags, 16. November; ab dem 17. November ist der Bescheid rechtskräftig. Fällt das Fristende auf einen Samstag, Sonntag oder Feiertag, endet sie am nächsten Werktag.</p>

<h2>Zahlung: Frist, Raten, Vollstreckung</h2>
<p>Der Bescheid enthält nach § 66 Abs. 2 OWiG die Aufforderung, spätestens zwei Wochen nach Rechtskraft zu zahlen. Wer das nicht sofort kann, darf nach § 18 OWiG eine Zahlungsfrist oder Raten beantragen; die Behörde bewilligt das, wenn die wirtschaftlichen Verhältnisse es erfordern. Bleibt die Zahlung ohne Antrag aus, folgen Mahnung und Vollstreckung, etwa durch Kontopfändung. Als letztes Mittel sieht § 96 OWiG Erzwingungshaft vor, wenn jemand zahlen könnte, es aber nicht tut. Die Haft ersetzt die Zahlung nicht.</p>

<h2>Akteneinsicht und Messprotokoll</h2>
<p>Wer wissen will, worauf der Vorwurf beruht, kann nach § 49 OWiG die Akten bei der Verwaltungsbehörde unter Aufsicht einsehen, soweit keine überwiegenden schutzwürdigen Interessen Dritter entgegenstehen. In der Akte liegen in der Regel das Messfoto, das Messprotokoll mit Gerätetyp und Aufstellort und gegebenenfalls Angaben zur Eichung. Die Einsicht ändert an keiner Frist etwas: Die zwei Wochen für den Einspruch laufen weiter, auch wenn die Akte noch nicht vorliegt.</p>

<h2>Probezeit: die zweite Schiene</h2>
<p>Für Fahranfänger läuft neben dem Bußgeldverfahren ein zweites Verfahren, und zwar bei der Fahrerlaubnisbehörde. Sobald ein Verstoß mit Punkt rechtskräftig im Register steht, erfährt sie davon. Eine eingetragene Geschwindigkeitsüberschreitung ist ein A-Verstoß, und schon einer führt zur Anordnung eines Aufbauseminars und zur Verlängerung der Probezeit um ${h.num(P.probezeit.verlaengerung_jahre)} Jahre. Diese Anordnung kommt oft erst Wochen nach der Zahlung des Bußgelds, mit einer eigenen Frist und eigenen Kosten. Die Gebühren des Bescheids und die Kosten des Seminars sind zwei getrennte Rechnungen.</p>

<h2>Umzug während des Verfahrens</h2>
<p>Die Bußgeldstelle schreibt an die Anschrift aus dem Fahrzeugregister oder dem Melderegister. Wer während eines laufenden Verfahrens umzieht, meldet sich ohnehin innerhalb der gesetzlichen Frist um; ein Nachsendeauftrag bei der Post schließt die Lücke bis dahin. Die Fristen laufen ab der Zustellung, nicht ab dem Tag, an dem man den Brief tatsächlich liest. Ein Bescheid, der im Urlaub zugestellt wird, beginnt seine zwei Wochen also am Tag des Einwurfs.</p>

<h2>Punkte: ab der Rechtskraft</h2>
<p>Ein Punkt entsteht nicht am Tattag. Erst wenn der Bescheid rechtskräftig ist, meldet die Behörde die Entscheidung an das Kraftfahrt-Bundesamt. Nach ${h.src('stvg29', '§ 29 StVG')} beginnt dann die Tilgungsfrist: ${h.num(PK.tilgung_1p_monate)} Monate für einen Punkt, ${h.num(PK.tilgung_2p_monate)} Monate für zwei Punkte, danach ein Jahr Überliegefrist. Für den Punktestand, bei dem Maßnahmen ergriffen werden, zählt dagegen der Tattag: Wer am Tag der Tat schon Punkte hatte, wird mit diesem Stand bewertet, auch wenn die Eintragung erst Monate später erfolgt. Den eigenen Stand erläutert die Seite ${h.a('punkte-in-flensburg', 'Punkte in Flensburg')}.</p>

<h2>Fahrverbot: wann der Monat beginnt</h2>
<p>Enthält der Bescheid ein Fahrverbot, entscheidet ${h.src('stvg25', '§ 25 StVG')} über den Beginn. Gab es in den zwei Jahren vor der Tat kein Fahrverbot, wird es spätestens ${h.num(V.fahrverbot_schonfrist_monate)} Monate nach Rechtskraft wirksam, und Sie bestimmen innerhalb dieses Zeitraums selbst, wann Sie den Führerschein abgeben. Sonst wird es mit der Abgabe wirksam, spätestens einen Monat nach Rechtskraft. Die Verbotsfrist zählt ab dem Tag, an dem die Behörde den Führerschein in Verwahrung nimmt. Bei ${h.num(exFv.over)} km/h zu schnell innerorts sind das ${h.eur(exFv.fine)}, ${h.num(exFv.points)} Punkte und ${h.num(exFv.fv)} Monat; Einzelheiten unter ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Ein Zeitstrahl in Zahlen</h2>
<p>Eine Messung außerorts mit ${h.num(128)} km/h bei Tempo 100 ergibt nach Abzug ${h.num(ex.over)} km/h zu viel und ${h.eur(ex.fine)} Bußgeld. Liegt der Tattag im Oktober, kommt die Anhörung vielleicht im November, der Bescheid im Dezember. Mit Zustellung kurz vor Weihnachten wird er Anfang Januar rechtskräftig; die Zahlung von ${h.eur(ex.total, 2)} ist dann zwei Wochen später fällig. Der Punkt wird ab der Rechtskraft gezählt und ist ${formatDecimal(tilg1, 1, 'de')} Jahre später tilgungsreif. Den eigenen Fall mit allen Beträgen liefert der ${h.a('bussgeldrechner', 'Bußgeldrechner')}.</p>`,
  },
  en: {
    slug: 'caught-speeding-what-next',
    nav: 'Caught speeding',
    card: 'The German fine procedure step by step: letters, deadlines, payment, points, bans.',
    title: 'Caught Speeding 2026: German Fine Procedure and Deadlines',
    description: `Caught speeding in Germany 2026: hearing form, fine notice, ${V.einspruch_wochen}-week objection period, payment, points. ${V.verjaehrung_monate}-month limitation since July, fees from ${en(V.gebuehr_min)} per notice.`,
    h1: 'Caught speeding in Germany: what happens next, step by step',
    intro: 'Between the camera and the end of the matter lie several letters and deadlines, each one counted from a different date.',
    resume: `If you are caught speeding in Germany, the case runs through a fixed sequence: the measurement, a hearing form, a formal fine notice, the notice becoming final, payment and, where applicable, a Flensburg point and a driving ban. Amounts up to ${en(V.verwarnung_max)} are settled with a warning fine and no costs. Above that, the fine office issues a Bußgeldbescheid, the formal fine notice, adding a fee of five per cent, at least ${en(V.gebuehr_min)}, and ${en(V.zustellung, 2)} for delivery under Section 107 OWiG, so a ${en(100)} fine costs ${en(100 + f100.total, 2)}. You have ${V.einspruch_wochen} weeks from delivery to lodge an objection (Einspruch). If you do not, the notice becomes final (rechtskräftig) and payment is normally due within two further weeks. Points are entered and start to expire only from that date. Since 1 July 2026 the authority has ${V.verjaehrung_monate} months to pursue the offence under Section 26(3) StVG.`,
    faqs: [
      { q: 'How long do I have to pay a German speeding fine once the notice is final?', a: 'Normally two weeks. Section 66(2) OWiG requires the notice to ask for payment of the fine and costs no later than two weeks after it becomes final. Bank details and a reference number are printed on it; use the reference so the payment is matched. If nothing arrives, reminders and enforcement follow, and as a last resort a court can order coercive detention against someone who could pay but does not.' },
      { q: 'Can I pay a German speeding fine in instalments?', a: `Yes, if your finances do not allow you to pay at once. Section 18 OWiG lets the authority grant more time or set instalments. Write to the office that issued the notice, quote the reference and explain briefly why. A notice of ${en(exFv.total, 2)} for ${exFv.over} km/h over in town is a common reason to ask. Missing an agreed instalment can make the whole remaining amount due.` },
      { q: 'Can I ask the German authority for instalments on a speeding fine?', a: 'Yes. Section 18 of the Administrative Offences Act allows the authority to grant more time or payment by instalments if paying at once cannot reasonably be expected of you. Ask in writing before the payment date and give the notice reference. The decision is the authority’s; until it agrees, the normal deadline of two weeks after the notice becomes final still applies.' },
      { q: 'When does a speeding offence appear on my Flensburg record?', a: `Only once the fine notice is final. The fine office then reports the decision to the Federal Motor Transport Authority (KBA), which records it. The expiry period starts on that date: ${formatDecimal(tilg1, 1, 'en')} years for one point, ${formatDecimal(tilg2, 1, 'en')} for two, followed by a further year before deletion. Lodging an objection delays the entry, because the decision becomes final later.` },
    ],
    body: (h) => `
<h2>The sequence at a glance</h2>
<p>German speeding cases are administrative offences, handled under the Administrative Offences Act (OWiG) and the Road Traffic Act (StVG). The steps are almost always the same; the gaps between them vary from one authority to the next.</p>
${h.table(['Step', 'What arrives or happens', 'Deadline'], [
  ['1', 'Offence measured', `Limitation period of ${h.num(V.verjaehrung_monate)} months starts`],
  ['2', 'Hearing form or witness questionnaire', 'Restarts the limitation period'],
  ['3', 'Formal fine notice, delivered by registered post', `${h.num(V.einspruch_wochen)} weeks to object`],
  ['4', 'Notice becomes final', 'Day after the objection period ends'],
  ['5', 'Payment', 'Normally two weeks after step 4'],
  ['6', 'Point entered in the Flensburg register', `Expires after ${h.num(PK.tilgung_1p_monate)} months (one point)`],
  ['7', 'Driving ban, if any', `Licence handed in within up to ${h.num(V.fahrverbot_schonfrist_monate)} months`],
], 'The German fine procedure for speeding')}
<p>Below ${h.eur(V.verwarnung_max)}, the case stops after step 2: you are offered a warning fine (Verwarnungsgeld), and paying it on time closes the matter with no record. The first letters and who receives them are explained on the page about ${h.a('geblitzt', 'speed cameras')}.</p>

<h2>How long Germany has to pursue you</h2>
<p>The ${h.src('bgbl2026_142', 'fifth amendment to the Road Traffic Act')} simplified the limitation rules. Since 1 July 2026, ${h.src('stvg26', 'Section 26(3) StVG')} gives authorities ${h.num(V.verjaehrung_monate)} months for traffic offences. Before, it was three months until a notice was issued and six months after. The period runs from the date of the offence, but steps listed in Section 33 OWiG, such as the first hearing or the notice itself, interrupt it, and each interruption starts the clock again. A notice that arrives five months after the camera is therefore not automatically late. The details are on the page about the ${h.a('verjaehrung-bussgeld', 'limitation period')}.</p>

<h2>The fine notice and what it costs</h2>
<p>A formal notice is delivered with a postal certificate, usually in a yellow envelope. The postal worker writes the delivery date on the envelope. If nobody is home, the notice counts as delivered when it is put in your letterbox or when you are notified that it is waiting at a post office. Keep the envelope: every deadline after this point is counted from that date.</p>
<p>The costs come from ${h.src('owig107', 'Section 107 OWiG')}: five per cent of the fine, at least ${h.eur(V.gebuehr_min)} and at most ${h.eur(V.gebuehr_max)}, plus ${h.eur(V.zustellung, 2)} for delivery. The minimum applies to virtually every speeding case, because five per cent only exceeds ${h.eur(V.gebuehr_min)} on fines above ${h.eur(V.gebuehr_min / V.gebuehr_satz)}. For a car in town under ${h.src('bkatAnhang', 'table 1 c')}:</p>
${h.table(['Over the limit in town', 'Fine', 'Fee', 'Delivery', 'Total', 'Points', 'Ban'], faelle.map(({ over, o }) => { const f = fees(o.fine); return [`${h.num(over)} km/h`, h.eur(o.fine), f.verwarnung ? 'none' : h.eur(f.gebuehr, 2), f.verwarnung ? 'none' : h.eur(f.auslagen, 2), h.eur(o.total, 2), h.num(o.points), o.fv ? `${h.num(o.fv)} month${o.fv > 1 ? 's' : ''}` : 'no']; }), 'Car in town, after the tolerance deduction; costs under Section 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The ${h.a('bussgeldbescheid', 'fine notice page')} walks through each line of a real notice, in German with English explanations.</p>

<h2>The two-week window</h2>
<p>Section 67 OWiG gives you ${h.num(V.einspruch_wochen)} weeks from delivery to lodge an objection, in writing or in person at the authority. No reasons are required. It is a right, not an obligation, and its effects are worth knowing in advance. The authority reviews the case and either keeps or withdraws the notice. If it keeps it, the file goes via the public prosecutor to the local court (Amtsgericht), which decides the amount afresh and is not bound by the figure in the notice. Court costs can be added. Until the court decides, the notice is not final, so no point is entered and no ban takes effect.</p>
<p>With no objection, the notice becomes final when the two weeks have run. Example: delivered on Monday 2 November 2026, the period ends at midnight on Monday 16 November, and the notice is final from 17 November. If the last day falls on a Saturday, Sunday or public holiday, the period runs to the next working day. Public holidays differ between German states, so the state of the authority counts.</p>

<h2>Paying, and paying from abroad</h2>
<p>The notice asks for payment within two weeks of becoming final (Section 66(2) OWiG). It shows a German IBAN and a reference number; international transfers within the SEPA area cost the same as domestic ones from most banks. If you cannot pay at once, Section 18 OWiG allows the authority to grant time or instalments on request. Ignoring the payment leads to reminders and enforcement, for example by seizing a German bank account, and, as a last resort, to coercive detention under Section 96 OWiG. Detention does not cancel the debt.</p>

<h2>Seeing the file</h2>
<p>Under Section 49 OWiG, the person concerned may inspect the case file at the authority under supervision, unless overriding interests of third parties stand in the way. The file usually holds the camera photo, the measurement record with the device type and location, and details of its calibration. Asking to see it does not stop any clock: the two weeks for an objection keep running whether or not you have seen the file.</p>

<h2>The probation track for new drivers</h2>
<p>If you are in your Probezeit, a second procedure runs alongside the fine, handled by the driving licence authority (Fahrerlaubnisbehörde) where you live. Once a speeding offence with a point is final and on the register, that authority is informed. Speeding with a point is an A offence, and a single one leads to an order to attend a remedial course and extends probation by ${h.num(P.probezeit.verlaengerung_jahre)} years. The order often arrives weeks after you have paid the fine, with its own deadline and its own cost. Residents with an EU licence less than two years old are on the same track.</p>

<h2>Moving house or leaving Germany mid-case</h2>
<p>Fine offices write to the address in the vehicle register or the residents' register. Germans and foreigners alike must register a move (Anmeldung) and deregister when leaving the country (Abmeldung); a mail-forwarding order with Deutsche Post bridges the gap. Deadlines run from delivery, not from the day you open the envelope. A notice delivered while you are on holiday starts its two weeks on the day it went into your letterbox, which is why some residents ask a neighbour to check their post during long trips.</p>

<h2>Points: counted from the final date</h2>
<p>No point exists on the day of the offence. When the notice becomes final, the fine office reports it to the Federal Motor Transport Authority (KBA). Under ${h.src('stvg29', 'Section 29 StVG')}, the expiry period starts then: ${h.num(PK.tilgung_1p_monate)} months for one point and ${h.num(PK.tilgung_2p_monate)} months for two, followed by a further year before the entry is deleted for good. For the measures triggered by your total, however, the date of the offence decides. More on the ${h.a('punkte-in-flensburg', 'Flensburg points page')}.</p>

<h2>A ban: choosing your month</h2>
<p>If the notice includes a ban, ${h.src('stvg25', 'Section 25 StVG')} sets the start. With no ban in the two years before the offence, the ban takes effect at the latest ${h.num(V.fahrverbot_schonfrist_monate)} months after the notice is final, and you decide when within that window to hand in your licence. Otherwise it starts when you hand it in, no later than one month after the notice is final. At ${h.num(exFv.over)} km/h over in town that means ${h.eur(exFv.fine)}, ${h.num(exFv.points)} points and ${h.num(exFv.fv)} month. Practical steps, including for foreign licences, are on the ${h.a('fahrverbot', 'driving ban page')}.</p>

<h2>A sample timeline</h2>
<p>A car is measured at ${h.num(128)} km/h on a 100 road: ${h.num(ex.over)} km/h over after the deduction, ${h.eur(ex.fine)} fine. Offence in October, hearing form in November, notice in December. Delivered just before Christmas, it becomes final in early January, and ${h.eur(ex.total, 2)} is due two weeks later. The point counts from the January date and is due for deletion ${formatDecimal(tilg1, 1, 'en')} years after it. To work out your own case, use the ${h.a('bussgeldrechner', 'fine calculator')}.</p>`,
  },
});
