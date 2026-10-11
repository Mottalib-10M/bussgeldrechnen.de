import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { limitationEnd, speeding } from '../../lib/engine/bkat';

const V = P.verfahren;
/** § 33 Abs. 3 Satz 2 OWiG : absolute Grenze = doppelte Frist, mindestens zwei Jahre (24 Monate). */
const absMonate = Math.max(2 * V.verjaehrung_monate, 24);
/** § 34 Abs. 2 OWiG : Vollstreckungsverjährung drei Jahre bis 1 000 €, fünf Jahre darüber. */
const voll = { grenze: 1000, kurz: 3, lang: 5 };
const addMonths = (iso: string, mo: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + mo, d)).toISOString().slice(0, 10);
};
const de = (iso: string) => iso.split('-').reverse().join('.');
const tat = '2026-07-15', tat2 = '2026-10-11', tat3 = '2026-12-15';
const anh = '2026-09-10';
const in21 = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });

export default defineGuide({
  id: 'verjaehrung-bussgeld',
  group: 'verstoesse',
  order: 110,
  mini: 'verjaehrung',
  related: ['bussgeldbescheid', 'bussgeldkatalog-aenderungen', 'bussgeldrechner', 'geblitzt', 'fahrverbot'],
  sources: ['stvg26', 'bgbl2026_142', 'owig107', 'bkatv'],
  de: {
    slug: 'verjaehrung-bussgeld',
    nav: 'Verjährung',
    card: 'Sechs Monate seit Juli 2026: wann ein Verkehrsverstoß verjährt und was die Frist unterbricht.',
    title: 'Verjährung Bußgeld 2026: sechs Monate und Unterbrechung',
    description: `Verjährung im Bußgeldverfahren 2026: ${V.verjaehrung_monate} Monate seit 1.7.2026 nach § 26 StVG, Unterbrechung nach § 33 OWiG, absolute Grenze ${absMonate / 12} Jahre. Mit Fristrechner und Tabelle.`,
    h1: 'Verjährung im Bußgeldverfahren: wann ein Verstoß verjährt',
    intro: 'Seit dem 1. Juli 2026 gilt für Verkehrsordnungswidrigkeiten eine Frist von sechs Monaten, und die alte Dreimonatsregel ist Geschichte.',
    resume: `Seit Juli 2026 verjähren Verkehrsordnungswidrigkeiten nach § 26 Abs. 3 StVG in ${V.verjaehrung_monate} Monaten, gerechnet ab dem Tag, an dem die Tat beendet ist. Bis Ende Juni 2026 galten drei Monate, solange kein Bußgeldbescheid ergangen war, und erst danach sechs Monate; diese Regel geben manche Seiten noch immer an. Die Frist läuft nicht ungestört: § 33 OWiG zählt Handlungen auf, die sie unterbrechen, darunter die erste Anhörung oder die Mitteilung, dass ein Verfahren eingeleitet ist, und den Erlass des Bescheids, wenn er binnen zwei Wochen zugestellt wird. Nach jeder Unterbrechung beginnt die Frist neu. Spätestens nach ${absMonate / 12} Jahren ab der Tat ist die Verfolgung aber in jedem Fall verjährt. Ist ein Bescheid rechtskräftig, gilt eine andere Frist: Die Vollstreckung verjährt nach § 34 OWiG in ${voll.kurz} Jahren bei Geldbußen bis ${voll.grenze} Euro und in ${voll.lang} Jahren darüber.`,
    faqs: [
      { q: 'Unterbricht ein Anhörungsbogen an den Halter die Verjährung gegenüber dem Fahrer?', a: 'Nicht ohne Weiteres. Nach § 33 Abs. 4 OWiG wirkt eine Unterbrechung nur gegenüber der Person, auf die sich die Handlung bezieht. Wird der Halter als Betroffener angehört, war aber eine andere Person am Steuer, läuft die Frist für diese andere Person weiter, bis gegen sie selbst eine unterbrechende Handlung vorgenommen wird, etwa ihre eigene Anhörung.' },
      { q: 'Wann ist ein Blitzer vom Oktober 2026 verjährt?', a: `Ohne jede Unterbrechung nach ${V.verjaehrung_monate} Monaten: Bei einer Tat am ${de(tat2)} endet die Frist am ${de(limitationEnd(tat2))}. In der Praxis verschickt die Behörde vorher einen Anhörungsbogen oder bestimmt die Bekanntgabe des Verfahrens, wodurch die Frist neu beginnt. Spätestens ${absMonate / 12} Jahre nach der Tat, hier am ${de(addMonths(tat2, absMonate))}, ist die Verfolgung aber immer verjährt.` },
      { q: 'Was ist die absolute Verjährung bei Verkehrsverstößen?', a: `§ 33 Abs. 3 Satz 2 OWiG setzt trotz aller Unterbrechungen eine Obergrenze: das Doppelte der gesetzlichen Frist, mindestens aber zwei Jahre ab Beendigung der Tat. Bei ${V.verjaehrung_monate} Monaten ergibt das Doppelte nur ein Jahr, also gilt die Mindestgrenze von zwei Jahren. Ist bis dahin kein rechtskräftiger Abschluss erreicht, darf der Verstoß nicht mehr geahndet werden.` },
      { q: 'Verjährt ein Bußgeld, wenn ich in Raten zahle?', a: `Die Vollstreckungsverjährung nach § 34 OWiG ruht, solange eine Zahlungserleichterung bewilligt ist. Ratenzahlung hält die Frist also an, statt sie ablaufen zu lassen. Ohne Raten verjährt die Vollstreckung einer Geldbuße bis ${voll.grenze} Euro nach ${voll.kurz} Jahren, einer höheren nach ${voll.lang} Jahren, jeweils ab Rechtskraft der Entscheidung.` },
      { q: 'Ab welchem Tag zählt die Verjährung beim Verkehrsverstoß?', a: 'Nach § 31 Abs. 3 OWiG ab dem Zeitpunkt, an dem die Handlung beendet ist. Bei einer Geschwindigkeitsüberschreitung ist das der Moment der Messung, bei einem Parkverstoß das Ende des verbotenen Parkens. Tritt ein zum Tatbestand gehörender Erfolg erst später ein, beginnt die Frist mit diesem Zeitpunkt. Der Tag, an dem der Brief ankommt, spielt dafür keine Rolle.' },
    ],
    body: (h) => `
<h2>Die Frist seit dem 1. Juli 2026</h2>
<p>Das ${h.src('bgbl2026_142', 'Fünfte Gesetz zur Änderung des Straßenverkehrsgesetzes')} vom 12. Mai 2026 hat § 26 Abs. 3 StVG neu gefasst. Seit dem 1. Juli 2026 lautet der erste Satz: Die Frist der Verfolgungsverjährung beträgt bei Ordnungswidrigkeiten nach § 24 Abs. 1 StVG ${V.verjaehrung_monate} Monate. Unter § 24 Abs. 1 fallen die gewöhnlichen Verkehrsverstöße, also Tempo, Rotlicht, Abstand, Handy oder Parken. Für Alkohol und Drogen nach § 24a StVG gilt die allgemeine Regel des OWiG, die sich nach der Höhe des angedrohten Bußgelds richtet. Zwei Sonderfristen stehen ebenfalls in § 26 Abs. 3: zwei Jahre für bestimmte Verstöße gegen Bauartvorschriften an Fahrzeugen und fünf Jahre für einige Ordnungswidrigkeiten, die das Kraftfahrt-Bundesamt verfolgt. Den Wortlaut zeigt ${h.src('stvg26', '§ 26 StVG')}.</p>
<p>Bis zum 30. Juni 2026 war die Regel zweistufig. Solange weder ein Bußgeldbescheid ergangen noch öffentliche Klage erhoben war, betrug die Frist drei Monate; danach sechs Monate. Wer heute auf Seiten liest, ein Blitzer sei nach drei Monaten ohne Post erledigt, liest den alten Stand.</p>

<h2>Beginn und Ende ohne Unterbrechung</h2>
<p>Die Frist beginnt nach § 31 Abs. 3 OWiG, sobald die Handlung beendet ist, und endet ${V.verjaehrung_monate} Monate später. Ohne jede Unterbrechung ergeben sich diese Daten:</p>
${h.table(['Tag der Tat', 'Verjährt ohne Unterbrechung am', 'Absolute Grenze'], [
  [de(tat), de(limitationEnd(tat)), de(addMonths(tat, absMonate))],
  [de(tat2), de(limitationEnd(tat2)), de(addMonths(tat2, absMonate))],
  [de(tat3), de(limitationEnd(tat3)), de(addMonths(tat3, absMonate))],
], `Frist nach § 26 Abs. 3 StVG (${V.verjaehrung_monate} Monate), absolute Grenze nach § 33 Abs. 3 Satz 2 OWiG`, ['l', 'r', 'r'])}
<p>In der Praxis endet kaum ein Verfahren so, denn die Behörde unterbricht die Frist fast immer mit dem ersten Schreiben. Die Tabelle zeigt aber, wie viel Zeit sie dafür hat: ${V.verjaehrung_monate} Monate statt früher drei.</p>

<h2>Was die Frist unterbricht</h2>
<p>§ 33 Abs. 1 OWiG zählt die Unterbrechungshandlungen abschließend auf. Für Verkehrsverstöße sind vor allem diese von Bedeutung:</p>
<ul>
<li>die erste Vernehmung des Betroffenen, die Bekanntgabe, dass gegen ihn ein Ermittlungsverfahren eingeleitet ist, oder schon die Anordnung dieser Vernehmung oder Bekanntgabe (Nr. 1), in der Praxis meist der Anhörungsbogen;</li>
<li>jede richterliche Vernehmung des Betroffenen oder eines Zeugen (Nr. 2);</li>
<li>die Beauftragung eines Sachverständigen, wenn der Betroffene vorher vernommen oder informiert wurde (Nr. 3);</li>
<li>der Erlass des Bußgeldbescheids, sofern er binnen zwei Wochen zugestellt wird, ansonsten die Zustellung (Nr. 9);</li>
<li>der Eingang der Akten beim Amtsgericht nach einem Einspruch (Nr. 10);</li>
<li>jede Anberaumung einer Hauptverhandlung (Nr. 11) und der Hinweis, ohne Hauptverhandlung zu entscheiden (Nr. 12).</li>
</ul>
<p>Bei schriftlichen Anordnungen kommt es nach § 33 Abs. 2 auf den Zeitpunkt an, in dem sie abgefasst werden, nicht auf den Zugang beim Betroffenen. Gelangt das Dokument nicht alsbald in den Geschäftsgang, zählt der Tag, an dem das tatsächlich geschieht. Nach § 33 Abs. 3 beginnt die Verjährung nach jeder Unterbrechung von neuem, also wieder mit voller Länge.</p>

<h2>Die Unterbrechung trifft nur die richtige Person</h2>
<p>Eine Besonderheit betrifft Halter, die nicht selbst gefahren sind. § 33 Abs. 4 OWiG bestimmt, dass die Unterbrechung nur gegenüber demjenigen wirkt, auf den sich die Handlung bezieht. Richtet sich der Anhörungsbogen an den Halter als Betroffenen, unterbricht er die Frist für ihn, nicht aber für die Person, die tatsächlich am Steuer saß. Ermittelt die Behörde den wahren Fahrer erst später, muss sie gegen diese Person innerhalb der noch laufenden Frist selbst tätig werden. Bei Halt- und Parkverstößen kann sie stattdessen dem Halter die Verfahrenskosten nach § 25a StVG auferlegen, wenn der Fahrer bis zur Verjährung nicht zu ermitteln ist; die Gebühr dafür beträgt nach ${h.src('owig107', '§ 107 Abs. 2 OWiG')} ${h.eur(V.halterkosten_25a)}.</p>

<h2>Ein Beispiel mit zwei Unterbrechungen</h2>
<p>Ein Blitzer misst am ${h.date(tat)} innerorts 21 km/h zu viel; der Katalog sieht ${h.eur(in21.fine)} und einen Punkt vor. Ohne Unterbrechung wäre die Tat am ${h.date(limitationEnd(tat))} verjährt. Die Behörde ordnet am ${h.date(anh)} die Anhörung des Fahrers an. Damit beginnt die Frist neu und endet nun am ${h.date(limitationEnd(anh))}. Erlässt die Behörde den Bescheid vor diesem Tag und wird er binnen zwei Wochen zugestellt, beginnt die Frist erneut. Wie lange sich das auch hinzieht: Am ${h.date(addMonths(tat, absMonate))}, ${absMonate / 12} Jahre nach der Tat, ist in jedem Fall Schluss, sofern bis dahin keine rechtskräftige Entscheidung vorliegt. Der Fristrechner auf dieser Seite zeigt den einfachen Fall ohne Unterbrechung für jedes Datum.</p>

<h2>Die absolute Grenze</h2>
<p>Damit Unterbrechungen ein Verfahren nicht endlos verlängern, setzt § 33 Abs. 3 Satz 2 OWiG eine Obergrenze: Die Verfolgung ist spätestens verjährt, wenn seit Beendigung der Tat das Doppelte der gesetzlichen Frist verstrichen ist, mindestens aber zwei Jahre. Bei ${V.verjaehrung_monate} Monaten wären das Doppelte zwölf Monate, also greift die Mindestgrenze von ${absMonate / 12} Jahren. Hängt ein Verfahren beim Gericht, das auch eine Straftat betrifft, gilt für diese Rechnung die längere Frist aus dem Strafrecht.</p>

<h2>Nach der Rechtskraft: Vollstreckungsverjährung</h2>
<p>Ist der ${h.a('bussgeldbescheid', 'Bußgeldbescheid')} rechtskräftig, spielt die Verfolgungsverjährung keine Rolle mehr. Dann gilt § 34 OWiG: Eine rechtskräftig festgesetzte Geldbuße darf nach Ablauf der Vollstreckungsverjährung nicht mehr vollstreckt werden. Die Frist beträgt ${voll.kurz} Jahre bei einer Geldbuße bis ${h.eur(voll.grenze)} und ${voll.lang} Jahre bei einer höheren und beginnt mit der Rechtskraft. Sie ruht, solange die Vollstreckung aus rechtlichen Gründen nicht beginnen oder fortgesetzt werden kann, solange sie ausgesetzt ist und solange eine Zahlungserleichterung bewilligt ist. Wer in Raten zahlt, lässt die Frist also nicht ablaufen.</p>

<h2>Die Daten im eigenen Schreiben lesen</h2>
<p>Wer wissen will, wie weit ein Verfahren ist, findet die wichtigen Daten auf den Schreiben selbst. Der Anhörungsbogen nennt den Tattag und trägt ein eigenes Datum; entscheidend für die Unterbrechung ist aber nicht der Tag, an dem er ankommt, sondern der Zeitpunkt, in dem die Anhörung angeordnet wurde. Dieser Zeitpunkt steht in der Akte, nicht immer auf dem Brief. Beim Bescheid zählt das Erlassdatum, wenn die Zustellung binnen zwei Wochen folgt; das Zustelldatum steht auf dem gelben Umschlag. Wer die Daten nebeneinanderlegt, sieht, ob zwischen zwei Schritten jeweils weniger als ${V.verjaehrung_monate} Monate lagen. Mehr als diese Rechnung leistet die Seite nicht; sie ersetzt keine Prüfung der Akte.</p>

<h2>Drei verbreitete Irrtümer</h2>
<p>Erstens: „Nach drei Monaten ohne Post ist alles verjährt.“ Das galt bis Juni 2026 für die Zeit bis zum Bescheid und gilt heute nicht mehr. Zweitens: „Die Frist läuft ab dem Tag, an dem ich den Brief bekomme.“ Sie läuft ab der Tat, und Unterbrechungen wirken ab ihrer Abfassung. Drittens: „Wer umzieht, entgeht dem Verfahren.“ Die Behörde kann die Frist auch dann unterbrechen, wenn das Schreiben erst über die neue Anschrift ermittelt werden muss, und sie hat dafür ${V.verjaehrung_monate} Monate, bei Abwesenheit des Betroffenen zudem eigene Unterbrechungsgründe nach § 33 Abs. 1 Nr. 5.</p>

<h2>Taten aus der Zeit vor Juli 2026</h2>
<p>Eine Verjährung, die vor dem 1. Juli 2026 schon eingetreten war, lebt durch die neue Fassung nicht wieder auf. Ob für eine ältere Tat, deren Frist am 1. Juli noch lief, die alte oder die neue Länge gilt, ist eine Frage des Übergangsrechts, die diese Seite nicht beantwortet. Für alle Verstöße, die seit dem 1. Juli 2026 begangen werden, gelten die ${V.verjaehrung_monate} Monate ohne Einschränkung. Was sich 2026 sonst geändert hat, fasst die Seite zum ${h.a('bussgeldkatalog-aenderungen', 'Bußgeldkatalog 2026')} zusammen.</p>

<h2>Verjährung und Fahrverbot</h2>
<p>Die Verjährung betrifft das gesamte Verfahren, also auch die Nebenfolgen. Ist die Verfolgung verjährt, kann weder ein Bußgeld noch ein ${h.a('fahrverbot', 'Fahrverbot')} angeordnet werden, und es entstehen keine Punkte. Wird das Verfahren dagegen rechtzeitig abgeschlossen, beginnt ab der Rechtskraft die Tilgungsfrist der Punkte, die mit der Verjährung nichts zu tun hat. Den Gesamtbetrag eines Verstoßes mit Gebühren liefert der ${h.a('bussgeldrechner', 'Bußgeldrechner')}; die Regelsätze stammen aus der ${h.src('bkatv', 'Bußgeldkatalog-Verordnung')}.</p>`,
  },
  en: {
    slug: 'limitation-period-traffic-fines',
    nav: 'Limitation period',
    card: 'Six months since July 2026: when a German traffic offence lapses and what restarts the clock.',
    title: 'Traffic Fine Limitation Germany 2026: 6 Months, Restarts',
    description: `Limitation period for German traffic fines 2026: ${V.verjaehrung_monate} months since 1 July 2026 (Section 26 StVG), restarted by hearing forms and notices, ceiling of ${absMonate / 12} years.`,
    h1: 'When a German traffic fine becomes time-barred',
    intro: 'Since 1 July 2026 the authority has six months to act on a traffic offence, twice as long as before for the first step.',
    resume: `German traffic offences become time-barred, or verjährt, ${V.verjaehrung_monate} months after the day of the offence under Section 26(3) of the Road Traffic Act, as amended with effect from 1 July 2026. Before that date the period was three months until a fine notice had been issued and six months afterwards, and some websites still quote the old figure. The clock is not fixed. Section 33 of the Administrative Offences Act (OWiG) lists events that interrupt it, including the first hearing or the notice that proceedings have begun, and the fine notice itself if it is delivered within two weeks. After each interruption the full period starts again. There is a ceiling, however: two years after the offence, prosecution is barred whatever happened in between. Once a fine notice is final, a separate enforcement period applies under Section 34 OWiG, ${voll.kurz} years for fines up to ${voll.grenze} euros and ${voll.lang} years above.`,
    faqs: [
      { q: 'I moved house after a speed camera flash. Can the German fine still reach me?', a: `Yes. The authority has ${V.verjaehrung_monate} months from the offence to take a step that interrupts the period, and the order to hear you counts from the moment it is drawn up, not when the letter arrives (Section 33(2) OWiG). Registering your new address with the local registration office helps the authority find you. The absolute limit is ${absMonate / 12} years after the offence.` },
      { q: 'Does the German limitation period stop while I am abroad?', a: 'Being abroad does not by itself pause the six months. But the authority can interrupt the period, for example by requesting an investigative step abroad or by provisionally suspending proceedings because you are absent and then ordering steps to find you (Section 33(1) nos. 5 and 6 OWiG). Each interruption restarts the period, up to the two-year ceiling.' },
      { q: 'How long can Germany collect a fine that is already final?', a: `Section 34 OWiG allows enforcement for ${voll.kurz} years if the fine is up to ${voll.grenze} euros and ${voll.lang} years if it is higher, counted from the day the decision became final. The period is suspended while instalments are granted or enforcement is postponed, so paying in instalments does not let the debt run out.` },
      { q: 'Is a German speeding ticket from June 2026 still subject to the three-month rule?', a: 'If the old three-month period had already run out before 1 July 2026, the new law does not revive the case. Whether a period that was still running on that date follows the old or the new length is a question of transitional law that this page does not answer. For every offence committed from 1 July 2026, six months apply.' },
    ],
    body: (h) => `
<h2>The new rule in one sentence</h2>
<p>Since 1 July 2026, Section 26(3) of the Road Traffic Act (StVG) reads: the limitation period for prosecuting offences under Section 24(1) is ${V.verjaehrung_monate} months. The change comes from the ${h.src('bgbl2026_142', 'Fifth Act amending the Road Traffic Act of 12 May 2026')}. Section 24(1) covers the everyday offences: speeding, red lights, tailgating, phones, parking. Alcohol and drug offences under Section 24a follow the general rules of the Administrative Offences Act, which depend on the maximum fine. The same paragraph sets two special periods, two years for certain breaches of vehicle type-approval rules and five years for some offences prosecuted by the Federal Motor Transport Authority. The text is in ${h.src('stvg26', 'Section 26 StVG')}.</p>
<p>Until 30 June 2026 the rule had two stages: three months as long as no fine notice had been issued and no charge brought, then six months. Advice built on the old figure, such as waiting three months for silence, still circulates online. That reasoning no longer holds.</p>

<h2>Dates without any interruption</h2>
<p>The period starts when the act is complete (Section 31(3) OWiG), which for a speed camera is the moment of measurement and for parking the moment the car is moved. Without interruptions:</p>
${h.table(['Date of offence', 'Time-barred if never interrupted', 'Absolute limit'], [
  [h.date(tat), h.date(limitationEnd(tat)), h.date(addMonths(tat, absMonate))],
  [h.date(tat2), h.date(limitationEnd(tat2)), h.date(addMonths(tat2, absMonate))],
  [h.date(tat3), h.date(limitationEnd(tat3)), h.date(addMonths(tat3, absMonate))],
], `Period under Section 26(3) StVG (${V.verjaehrung_monate} months); absolute limit under Section 33(3) OWiG`, ['l', 'r', 'r'])}
<p>Very few cases end like this, because the authority's first letter normally interrupts the period. The table shows how long it has to send that letter.</p>

<h2>What restarts the clock</h2>
<p>Section 33(1) OWiG lists the interrupting events exhaustively. Those that matter for drivers:</p>
<ul>
<li>the first questioning of the person concerned, notice that proceedings have been opened against them, or an order for either (no. 1), usually in the form of the hearing form (Anhörungsbogen);</li>
<li>a court hearing of the person concerned or of a witness (no. 2);</li>
<li>commissioning an expert after the person has been heard or informed (no. 3);</li>
<li>a provisional suspension because the person is absent, and later orders to trace them (no. 5), or a request for an investigative step abroad (no. 6);</li>
<li>issuing the fine notice, if it is delivered within two weeks, otherwise its delivery (no. 9);</li>
<li>the file reaching the local court after an objection (no. 10), and any court hearing being scheduled (no. 11).</li>
</ul>
<p>For written orders, what counts is when they are drawn up, not when you receive them (Section 33(2)). After each interruption the full ${V.verjaehrung_monate} months begin again.</p>

<h2>Only the right person is affected</h2>
<p>Section 33(4) OWiG says an interruption only works against the person it concerns. This matters in households and companies where several people use one car. If the hearing form goes to the keeper as the suspect but someone else was driving, the period keeps running for the actual driver until the authority acts against that person. For parking only, the authority can instead charge the keeper the procedure costs under Section 25a StVG when the driver cannot be identified in time, a flat fee of ${h.eur(V.halterkosten_25a)} under ${h.src('owig107', 'Section 107(2) OWiG')}.</p>

<h2>Reading the dates on your letters</h2>
<p>The letters themselves tell you how far a case has got. The hearing form states the date of the offence and has its own date, but what interrupts the period is the moment the hearing was ordered, which is recorded in the file and not always on the letter. For the fine notice, the date of issue counts if delivery follows within two weeks; the delivery date is written on the yellow envelope. Laying the dates side by side shows whether each step came less than ${V.verjaehrung_monate} months after the previous one. That is as far as a calculation can go; it is no substitute for looking at the file.</p>

<h2>Company cars, car sharing and shared households</h2>
<p>Many expats drive cars that are registered to someone else: an employer, a car-sharing operator, a partner. In all these cases the first letter usually goes to the keeper. A company will often name the driver from its booking records, and the authority then sends a new hearing form to that person. Because an interruption only works against the person it concerns, the second letter is what restarts the period for the driver. The authority still has ${V.verjaehrung_monate} months from the offence for that, which in practice leaves enough time for the detour via the keeper. Under the old three-month rule, the same detour left far less room.</p>

<h2>Three common misconceptions</h2>
<p>"No letter within three months means it has lapsed." That applied until June 2026 for the period before a notice, and no longer does. "The clock starts when I receive the letter." It starts with the offence, and interruptions take effect when the order is drawn up. "Moving away ends the case." The authority can still interrupt the period while it traces your new address, and the law has specific grounds for interruption when the person concerned is absent.</p>

<h2>A worked example</h2>
<p>A camera records you 21 km/h over the limit in town on ${h.date(tat)}; the catalogue sets ${h.eur(in21.fine)} and one point. Left alone, the case would lapse on ${h.date(limitationEnd(tat))}. On ${h.date(anh)} the authority orders your hearing, so the period restarts and now ends on ${h.date(limitationEnd(anh))}. A fine notice issued before then and delivered within two weeks restarts it once more. Whatever happens, the case cannot be pursued after ${h.date(addMonths(tat, absMonate))}, ${absMonate / 12} years after the offence, unless a final decision exists by then. The date tool on this page shows the simple case for any date.</p>

<h2>The two-year ceiling</h2>
<p>Section 33(3) OWiG prevents endless restarts: prosecution is barred once twice the statutory period has passed since the offence, and at least two years. Twice six months is only one year, so the two-year minimum applies. If a court case also involves a criminal offence, the longer criminal-law period is used for this calculation.</p>

<h2>After the notice is final</h2>
<p>Once the ${h.a('bussgeldbescheid', 'fine notice')} is final, the prosecution period no longer matters and Section 34 OWiG takes over. A final fine may not be enforced after ${voll.kurz} years if it is up to ${h.eur(voll.grenze)}, or ${voll.lang} years above that, counted from the date it became final. The period is suspended while enforcement legally cannot start or continue, while it is postponed and while a payment concession such as instalments is in place.</p>

<h2>Bans, points and the bigger picture</h2>
<p>If prosecution is time-barred, no fine, no ${h.a('fahrverbot', 'driving ban')} and no points can follow. If the case is concluded in time, a separate clock starts for the points: their deletion period runs from the date the decision became final and has nothing to do with the limitation period. A summary of everything else that changed in 2026 is on the page about the ${h.a('bussgeldkatalog-aenderungen', 'fine catalogue in 2026')}, and the ${h.a('bussgeldrechner', 'fine calculator')} shows what an offence costs with fees, based on the ${h.src('bkatv', 'Fine Catalogue Ordinance')}.</p>`,
  },
});
