import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, speeding } from '../../lib/engine/bkat';
import { applyMeasure } from '../../lib/engine/punkte';
import { formatMoney } from '../../lib/format';

const K = P.punkte;
const F = P.fuehrerschein;
const rad = entry('132a'), radHandy = entry('246.4');
const rot = entry('132'), handy = entry('246.1'), geh = entry('52a.1'), reifen = entry('5a'), alk = entry('241'), gasse = entry('50'), gurt = entry('100');
const in21 = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });
const in31 = speeding({ limit: 50, measured: 81, inner: true, tolerance: false });
const skipE = applyMeasure(6, 'vormerkung');
const skipV = applyMeasure(8, 'ermahnung');
const minEintrag = 60;

export default defineGuide({
  id: 'punkte-in-flensburg',
  group: 'punkte',
  order: 10,
  mini: 'punkte',
  miniHref: 'punkterechner',
  related: ['punkterechner', 'punkte-abfragen', 'punkteabbau', 'probezeit-fuehrerschein', 'mpu', 'fahrverbot'],
  sources: ['stvg4', 'fevAnl13', 'kbaFaer', 'stvg29'],
  de: {
    slug: 'punkte-in-flensburg',
    nav: 'Punkte in Flensburg',
    card: 'Wofür es einen, zwei oder drei Punkte gibt und was bei 4, 6 und 8 Punkten passiert.',
    title: 'Punkte in Flensburg 2026: Bewertung, Stufen und Entzug',
    description: `Punkte in Flensburg 2026: ein, zwei oder drei Punkte je Verstoß, Ermahnung ab ${K.ermahnung_ab}, Verwarnung ab ${K.verwarnung_ab}, Entzug ab ${K.entzug_ab} Punkten. Mit Tabelle und Rechner nach § 4 StVG.`,
    h1: 'Punkte in Flensburg: wie das Fahreignungsregister zählt',
    intro: 'Ein Rotlichtverstoß bringt einen Punkt, ein Fahrverbot zwei, eine Trunkenheitsfahrt mit Entziehung drei: so rechnet das Register beim Kraftfahrt-Bundesamt.',
    resume: `Punkte in Flensburg sind Eintragungen im Fahreignungsregister, das das Kraftfahrt-Bundesamt (KBA) nach § 28 StVG führt. Gespeichert werden nur Verstöße, die in Anlage 13 der Fahrerlaubnis-Verordnung stehen und mit mindestens ${minEintrag} Euro Bußgeld oder einem Fahrverbot geahndet wurden; ein Verwarnungsgeld bis ${P.verfahren.verwarnung_max} Euro landet nie im Register. Eine einfache Ordnungswidrigkeit wie Rotlicht (${rot.fine} Euro) oder Handy am Steuer (${handy.fine} Euro) bringt einen Punkt, eine grobe mit Fahrverbot oder eine Straftat ohne Entziehung zwei, eine Straftat mit Entziehung der Fahrerlaubnis drei. Wer ${K.ermahnung_ab} oder ${K.ermahnung_reset} Punkte erreicht, wird schriftlich ermahnt, bei ${K.verwarnung_ab} oder ${K.verwarnung_reset} verwarnt, ab ${K.entzug_ab} Punkten wird die Fahrerlaubnis entzogen (§ 4 Abs. 5 StVG). Eine neue gibt es frühestens nach ${K.neuerteilung_sperre_monate} Monaten, in der Regel erst nach einer MPU. Jede Eintragung verfällt nach ihrer eigenen Frist.`,
    faqs: [
      { q: 'Ab wie vielen Punkten in Flensburg ist der Führerschein weg?', a: `Ab ${K.entzug_ab} Punkten gilt man nach § 4 Abs. 5 Satz 1 Nr. 3 StVG als ungeeignet, und die Behörde entzieht die Fahrerlaubnis. Vorher müssen Ermahnung und Verwarnung ausgesprochen worden sein, sonst wird der Stand zunächst auf ${K.verwarnung_reset} Punkte gesetzt. Eine neue Fahrerlaubnis gibt es frühestens ${K.neuerteilung_sperre_monate} Monate nach Abgabe des Führerscheins, und die Behörde ordnet in der Regel eine medizinisch-psychologische Untersuchung an (§ 4 Abs. 10 StVG).` },
      { q: 'Gibt es für Falschparken Punkte in Flensburg?', a: `Normalerweise nicht, weil die meisten Parkverstöße unter ${minEintrag} Euro bleiben. Punkte gibt es erst, wenn eine Behinderung dazukommt: Parken auf dem Geh- oder Radweg mit Behinderung kostet ${geh.fine} Euro und einen Punkt, Parken in zweiter Reihe mit Behinderung ${entry('58.1').fine} Euro und einen Punkt. Das reine Parken auf dem Gehweg für ${entry('52a').fine} Euro bleibt ohne Eintrag.` },
      { q: 'Zählt bei den Punkten in Flensburg der Tattag oder der Tag des Bescheids?', a: 'Beides spielt eine Rolle. Die Punkte entstehen nach § 4 Abs. 2 StVG mit der Begehung der Tat, aber nur, wenn sie rechtskräftig geahndet wird. Für Ermahnung, Verwarnung und Entziehung zählt der Stand am Tag der letzten Tat, die zur Maßnahme führt. Die Tilgungsfrist dagegen beginnt erst mit der Rechtskraft der Entscheidung, also meist zwei Wochen nach Zustellung des Bescheids, wenn kein Einspruch eingelegt wird.' },
      { q: 'Was kostet die schriftliche Ermahnung bei vier Punkten?', a: `Die Fahrerlaubnisbehörde berechnet für die Ermahnung wie für die Verwarnung eine Gebühr von ${formatMoney(F.verwarnung_fes, 2, 'de')} nach Nummer 209 der Gebührenordnung für Maßnahmen im Straßenverkehr. Dazu kommen gegebenenfalls Zustellkosten. Mit der Ermahnung erhalten Sie den Hinweis, dass ein freiwilliges Fahreignungsseminar einen Punkt abzieht, solange der Stand zwischen eins und ${K.seminar_abzug_bis} liegt.` },
      { q: 'Werden Punkte in Flensburg bei einem neuen Führerschein gelöscht?', a: 'Ja, wenn die Fahrerlaubnis nach einer Entziehung, einer isolierten Sperre oder einem Verzicht neu erteilt wird. § 4 Abs. 3 StVG ordnet dann an, dass die Punkte aus der Zeit davor gelöscht werden. Das gilt ausdrücklich nicht bei der Erweiterung um eine Klasse, bei einer Verlängerung und bei der vereinfachten Erteilung an Inhaber einer ausländischen Fahrerlaubnis.' },
    ],
    body: (h) => `
<h2>Was im Fahreignungsregister steht</h2>
<p>Das Register, das umgangssprachlich nur „Flensburg“ heißt, führt das ${h.src('kbaFaer', 'Kraftfahrt-Bundesamt')} mit Sitz in der Stadt an der Förde. § 28 StVG legt fest, was hineinkommt: rechtskräftige Urteile wegen Verkehrsstraftaten, Entziehungen und Sperren, Bußgeldentscheidungen zu Ordnungswidrigkeiten aus Anlage 13 der FeV, außerdem die Maßnahmen der Fahrerlaubnisbehörde und die Teilnahme an Seminaren. Bei Ordnungswidrigkeiten gilt eine doppelte Schwelle. Der Verstoß muss in Anlage 13 bezeichnet sein, und gegen Sie muss entweder ein Fahrverbot oder eine Geldbuße von mindestens ${h.eur(minEintrag)} festgesetzt worden sein.</p>
<p>Daraus folgt eine einfache Faustregel: Was mit einem Verwarnungsgeld bis ${h.eur(P.verfahren.verwarnung_max)} erledigt ist, erscheint nie im Register. Der vergessene Gurt (${h.eur(gurt.fine!)}) oder 15 km/h zu schnell innerorts bleiben folgenlos für den Punktestand. Senkt eine Behörde das Bußgeld nur wegen geringen Einkommens unter ${h.eur(minEintrag)}, zählt für die Eintragung trotzdem der Regelsatz aus dem Katalog (§ 28a StVG).</p>

<p>Neben den Taten speichert das Register auch, was danach geschah: eine Ermahnung oder Verwarnung, die Teilnahme an einem Fahreignungsseminar, ein Aufbauseminar in der Probezeit. Diese Einträge bringen selbst keine Punkte, sie dokumentieren nur, welche Stufe schon erreicht wurde. Ermahnung und Verwarnung verschwinden, sobald die letzte Eintragung wegen einer Tat getilgt ist; die Mitteilung über ein Seminar bleibt fünf Jahre stehen. So weiß die Behörde, ob der Punktabzug für ein weiteres Seminar schon verbraucht ist.</p>

<h2>Ein, zwei oder drei Punkte</h2>
<p>§ 4 Abs. 2 StVG kennt drei Gewichte. Einen Punkt bringen verkehrssicherheitsbeeinträchtigende Ordnungswidrigkeiten, das ist die große Masse der Einträge. Zwei Punkte gibt es für besonders verkehrssicherheitsbeeinträchtigende Ordnungswidrigkeiten, in der Praxis alle Regelfälle mit Fahrverbot, und für Straftaten ohne Entziehung, etwa eine Unfallflucht, bei der das Gericht den Führerschein nicht einzieht. Drei Punkte sind Straftaten vorbehalten, bei denen das Gericht die Fahrerlaubnis entzieht oder eine isolierte Sperre verhängt. Welche Tat wie viel wiegt, steht verbindlich in ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')}.</p>
${h.table(['Verstoß', 'BKat-Nr.', 'Bußgeld', 'Punkte'], [
  ['Winterreifenpflicht missachtet', '5a', h.eur(reifen.fine!), reifen.points],
  ['Auf Geh- oder Radweg geparkt, mit Behinderung', '52a.1', h.eur(geh.fine!), geh.points],
  ['Rotes Ampellicht missachtet', '132', h.eur(rot.fine!), rot.points],
  ['Handy am Steuer benutzt', '246.1', h.eur(handy.fine!), handy.points],
  ['21 bis 25 km/h zu schnell innerorts, Pkw', in21.nr, h.eur(in21.fine), in21.points],
  ['31 bis 40 km/h zu schnell innerorts, Pkw', in31.nr, h.eur(in31.fine), in31.points],
  ['Keine Rettungsgasse gebildet', '50', h.eur(gasse.fine!), gasse.points],
  ['0,5 Promille oder mehr, erstmals', '241', h.eur(alk.fine!), alk.points],
], 'Beispiele aus dem Bußgeldkatalog mit Punkten nach FeV Anlage 13, Stand 2026', ['l', 'l', 'r', 'r'])}
<p>Begeht jemand mit einer Handlung mehrere Verstöße, zählt nur der mit der höchsten Punktzahl. Wer also mit dem Handy in der Hand bei Rot über die Kreuzung fährt, bekommt in einem einheitlichen Bescheid nicht automatisch zwei Einträge à einem Punkt; maßgeblich ist, ob die Behörde Tateinheit annimmt.</p>

<h2>Die Stufen des Punktesystems</h2>
<p>Das Fahreignungs-Bewertungssystem arbeitet mit festen Schwellen. Die Behörde muss bei Erreichen der Stufe handeln, ein Ermessen hat sie dabei nicht.</p>
${h.table(['Punktestand', 'Folge', 'Rechtsgrundlage'], [
  [`1 bis ${K.vormerkung_bis}`, 'Vormerkung, keine Maßnahme', '§ 4 Abs. 4 StVG'],
  [`${K.ermahnung_ab} oder ${K.ermahnung_reset}`, `schriftliche Ermahnung, Gebühr ${h.eur(F.verwarnung_fes, 2)}`, '§ 4 Abs. 5 Nr. 1 StVG'],
  [`${K.verwarnung_ab} oder ${K.verwarnung_reset}`, `schriftliche Verwarnung, Gebühr ${h.eur(F.verwarnung_fes, 2)}`, '§ 4 Abs. 5 Nr. 2 StVG'],
  [`ab ${K.entzug_ab}`, `Entziehung, Neuerteilung frühestens nach ${K.neuerteilung_sperre_monate} Monaten`, '§ 4 Abs. 5 Nr. 3, Abs. 10 StVG'],
], 'Maßnahmen nach § 4 StVG, Gebühr nach GebOSt Nr. 209', ['l', 'l', 'l'])}
<p>Die Ermahnung weist auf das freiwillige Fahreignungsseminar hin, das bis ${K.seminar_abzug_bis} Punkte einen Punkt abzieht. Die Verwarnung erwähnt das Seminar ebenfalls, sagt aber dazu, dass es ab dieser Stufe keinen Abzug mehr gibt, und kündigt an, dass bei ${K.entzug_ab} Punkten die Fahrerlaubnis entzogen wird. Wie das Seminar abläuft, steht auf der Seite zum ${h.a('punkteabbau', 'Punkteabbau')}.</p>

<h2>Wenn eine Stufe übersprungen wird</h2>
<p>Ein einziger Bescheid kann mehrere Punkte auf einmal bringen. Damit niemand ohne Vorwarnung den Führerschein verliert, verlangt § 4 Abs. 6 StVG, dass die Maßnahmen der Reihe nach ergriffen werden. Fehlt die vorherige Stufe, wird sie nachgeholt, und der Punktestand sinkt mit dem Ausstellungstag dieses Schreibens. Zwei typische Fälle:</p>
<ul>
<li>Sie haben drei Punkte und bekommen für eine Straftat mit Entziehung drei weitere. Statt der Verwarnung bei sechs Punkten erhalten Sie zuerst die Ermahnung, und Ihr Stand wird auf ${skipE.points} gesetzt.</li>
<li>Sie wurden bei fünf Punkten ermahnt, und ein Fahrverbot sowie ein weiterer Eintrag bringen Sie auf acht. Die Behörde spricht zunächst die Verwarnung aus, der Stand sinkt auf ${skipV.points}, und der Führerschein bleibt.</li>
</ul>
<p>Die Absenkung greift nur, wenn der Stand nicht schon durch Tilgungen oder einen Seminarabzug niedriger ist. Punkte aus Taten vor der Absenkung, von denen die Behörde erst später erfährt, kommen auf den abgesenkten Wert oben drauf.</p>

<h2>Der Stand am Tattag entscheidet</h2>
<p>Eine Regel aus § 4 Abs. 5 StVG überrascht viele: Für eine Maßnahme zählt der Punktestand am Tag der letzten Tat, die zu ihr führt. Spätere Tilgungen bleiben dabei unberücksichtigt. Wer mit sieben Punkten noch einmal geblitzt wird und abwartet, bis während des Bußgeldverfahrens ein alter Eintrag verfällt, landet trotzdem bei acht Punkten. Umgekehrt zählen nur Einträge, deren Tilgungsfrist am Tattag noch lief. Deshalb gibt es die Überliegefrist von einem Jahr: Eine Eintragung bleibt nach Ablauf ihrer Frist noch zwölf Monate gespeichert, damit eine vorher begangene, aber erst später rechtskräftige Tat richtig bewertet werden kann. Die Fristen selbst regelt ${h.src('stvg29', '§ 29 StVG')}.</p>

<h2>Punkte und Probezeit laufen nebeneinander</h2>
<p>Für Fahranfänger gibt es zusätzlich die Regeln der Fahrerlaubnis auf Probe. § 4 Abs. 1 StVG stellt klar, dass beide Systeme parallel gelten. Ein Rotlichtverstoß bringt in der Probezeit also einen Punkt und gleichzeitig als A-Verstoß das Aufbauseminar mit zwei Jahren Verlängerung. Die Einzelheiten stehen bei der ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Nach der Entziehung</h2>
<p>Ist die Fahrerlaubnis wegen ${K.entzug_ab} Punkten entzogen, darf eine neue frühestens ${K.neuerteilung_sperre_monate} Monate nach der Abgabe des Führerscheins erteilt werden. Dieselbe Sperre gilt, wenn jemand kurz vorher auf die Fahrerlaubnis verzichtet und dabei mindestens zwei Entscheidungen gespeichert waren; der Verzicht ist also kein Ausweg. Zum Nachweis, dass die Eignung wiederhergestellt ist, ordnet die Behörde in der Regel ein Gutachten einer amtlich anerkannten Begutachtungsstelle an, die ${h.a('mpu', 'MPU')}. Mit der Neuerteilung werden die alten Punkte gelöscht, und das Konto beginnt bei null.</p>

<h2>Punkte ohne Auto: Fahrrad und E-Scooter</h2>
<p>Das Register kennt nicht nur Autofahrer. Wer mit dem Fahrrad oder einem Elektrokleinstfahrzeug, also etwa einem E-Scooter, bei Rot fährt, zahlt nach Nummer 132a ${h.eur(rad.fine!)} und bekommt einen Punkt, auch ohne jeden Führerschein. Bei länger als einer Sekunde Rot sind es ${h.eur(entry('132a.3').fine!)}, ebenfalls mit einem Punkt. Das Handy am Lenker kostet Radfahrer dagegen ${h.eur(radHandy.fine!)} und bleibt unter der Eintragungsschwelle. Für Inhaber einer Fahrerlaubnis zählen sie genauso wie Punkte aus dem Auto. Wer erst später eine Fahrerlaubnis erwirbt, beginnt dagegen bei null, denn mit der Erteilung werden Punkte aus Entscheidungen vor diesem Tag gelöscht (§ 4 Abs. 3 StVG).</p>

<h2>Halter oder Fahrer: wer die Punkte bekommt</h2>
<p>Punkte treffen immer die Person, die gefahren ist. Gehört das Auto der Firma oder dem Partner, bekommt der Halter zunächst den Anhörungsbogen und soll den Fahrer benennen. Kann bei einem Parkverstoß niemand ermittelt werden, trägt der Halter nur die Verfahrenskosten (§ 25a StVG), Punkte gibt es dann für niemanden. Bei einem Fahrverbot oder einem Bußgeld ab ${h.eur(minEintrag)} lohnt deshalb ein genauer Blick, ob das Foto zur benannten Person passt. Seit dem 1. Juli 2026 verbietet § 4c StVG ausdrücklich, die Behörde über den Fahrer zu täuschen oder so etwas gegen Geld anzubieten; die Geldbuße reicht bis ${h.eur(P.verfahren.taeuschung_bussgeld_max)}. Mehr zu den Folgen eines Fahrverbots steht auf der Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>So finden Sie Ihren eigenen Stand</h2>
<p>Das KBA erteilt jedem Betroffenen kostenlos Auskunft über seine Eintragungen und die Zahl der Punkte. Online geht das mit dem elektronischen Ausweis, schriftlich mit Ausweiskopie. Wie das im Einzelnen funktioniert und wie Sie die Daten in der Auskunft lesen, erklärt die Seite ${h.a('punkte-abfragen', 'Punkte abfragen')}. Wer mehrere Einträge mit unterschiedlichen Fristen hat, rechnet den Stand an einem bestimmten Tag am einfachsten im ${h.a('punkterechner', 'Punkterechner')} nach.</p>`,
  },
  en: {
    slug: 'flensburg-points',
    nav: 'Flensburg points',
    card: 'How Germany scores offences with one, two or three points and what happens at 4, 6 and 8.',
    title: 'Flensburg Points 2026: How Germany Scores Your Driving',
    description: `Flensburg points 2026: one to three points per offence, a reminder at ${K.ermahnung_ab}, a warning at ${K.verwarnung_ab}, withdrawal at ${K.entzug_ab}. Valid for foreign licence holders living here.`,
    h1: 'Flensburg points: the German driving register explained',
    intro: 'Germany keeps a central record of serious traffic offences in Flensburg, and it counts against you whichever country issued your licence.',
    resume: `Flensburg points are entries in the Fahreignungsregister, the driving aptitude register kept by the Federal Motor Transport Authority (Kraftfahrt-Bundesamt, KBA) in the northern town of Flensburg. Only offences listed in annex 13 of the Driving Licence Ordinance (FeV) are recorded, and only when the fine is at least ${minEintrag} euros or a driving ban was imposed; a small on-the-spot fine of up to ${P.verfahren.verwarnung_max} euros never reaches the register. Running a red light (${rot.fine} euros) or holding a phone at the wheel (${handy.fine} euros) costs one point, an offence with a driving ban or a crime without licence withdrawal two, a crime where the court takes the licence away three. At ${K.ermahnung_ab} points you receive a written reminder, at ${K.verwarnung_ab} a warning, and at ${K.entzug_ab} the licence is withdrawn under Section 4 of the Road Traffic Act (StVG). A new one follows after ${K.neuerteilung_sperre_monate} months at the earliest, usually after an MPU assessment.`,
    faqs: [
      { q: 'Do speeding tickets from France or Austria add Flensburg points?', a: 'No. The register stores decisions taken under German law: offences under Sections 24, 24a and 24c of the Road Traffic Act and traffic crimes judged by German courts (Section 28 StVG). A fine issued by French or Austrian authorities for driving there is a matter for that country and does not turn into German points, even if you live in Germany and drive a German-registered car.' },
      { q: 'Can I get Flensburg points if I drive in Germany on a US licence?', a: `Yes. The register records the person, not the plastic card, so an offence committed in Germany is stored whatever licence you hold. Reaching ${K.entzug_ab} points leads to withdrawal, which for a foreign licence means losing the right to use it in Germany (Section 3(1) StVG). The points also follow you if you later exchange the licence for a German one.` },
      { q: 'What happens when I reach four Flensburg points?', a: `The licensing office sends a written reminder, called Ermahnung, which costs ${formatMoney(F.verwarnung_fes, 2, 'en')} under fee number 209 of the road traffic fee schedule. Nothing else changes: you keep driving. The letter points out that a voluntary driver improvement seminar (Fahreignungsseminar) removes one point while you have between one and ${K.seminar_abzug_bis}. At ${K.verwarnung_ab} points the next letter is a formal warning.` },
      { q: 'Do Flensburg points reset when I exchange my licence for a German one?', a: 'No. Section 4(3) StVG wipes points when a licence is granted again after withdrawal or a court ban, but it names exceptions, and the simplified grant to holders of a foreign licence is one of them. Swapping a US, UK or Japanese licence for a German card therefore leaves every existing entry and its expiry date exactly as it was.' },
    ],
    body: (h) => `
<h2>A register that follows the driver</h2>
<p>Newcomers often assume points belong to a German licence. They do not. The ${h.src('kbaFaer', 'driving aptitude register')} kept by the KBA stores decisions about people who commit traffic offences in Germany, whether they hold a German card, an EU licence or a licence from Texas. If you live here and drive on a foreign licence, an offence with points is recorded against your name and date of birth, and the licensing authority (Fahrerlaubnisbehörde) of your town takes the same measures it would take against a German driver.</p>
<p>What gets in is defined by Section 28 of the Road Traffic Act. Court decisions on traffic crimes, licence withdrawals and fine decisions for offences listed in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')} are recorded, provided the fine is at least ${h.eur(minEintrag)} or a driving ban was imposed. Anything settled with a warning fine (Verwarnungsgeld) of up to ${h.eur(P.verfahren.verwarnung_max)}, such as most parking tickets or a seat belt left off for ${h.eur(gurt.fine!)}, never appears.</p>

<p>The register also notes what followed each offence: reminders and warnings from the licensing office, a completed driver improvement seminar, a remedial course during probation. These entries carry no points of their own. They show which stage you have reached, and the seminar entry, kept for five years, tells the authority whether you have already used the one point deduction allowed in that period. Reminders and warnings disappear when the last offence entry expires.</p>

<h2>How offences are weighted</h2>
<p>There are only three weights. One point for an offence that affects road safety, which covers most entries. Two points for a particularly serious offence, in practice every case that carries a Fahrverbot (driving ban), and for a traffic crime where the court leaves you the licence. Three points for a crime where the court withdraws the licence or imposes a ban on getting one. The table shows offences that expats run into in the first years of driving here.</p>
${h.table(['Offence', 'Catalogue no.', 'Fine', 'Points'], [
  ['Summer tyres on snow or ice', '5a', h.eur(reifen.fine!), reifen.points],
  ['Parked on a pavement or cycle lane, obstructing', '52a.1', h.eur(geh.fine!), geh.points],
  ['Red traffic light ignored', '132', h.eur(rot.fine!), rot.points],
  ['Phone used while driving', '246.1', h.eur(handy.fine!), handy.points],
  ['21 to 25 km/h over in town, car', in21.nr, h.eur(in21.fine), in21.points],
  ['31 to 40 km/h over in town, car', in31.nr, h.eur(in31.fine), in31.points],
  ['No emergency corridor in a traffic jam', '50', h.eur(gasse.fine!), gasse.points],
  ['0.5 per mille or more, first offence', '241', h.eur(alk.fine!), alk.points],
], 'Selected offences from the German fine catalogue with points under FeV annex 13, 2026', ['l', 'l', 'r', 'r'])}
<p>Winter tyres catch many people from warmer countries. Germany has no fixed date, but driving in wintry conditions on summer tyres is an offence with a point, and with a car rented abroad it is still your responsibility at the wheel.</p>

<h2>The four stages</h2>
<p>The authority has no discretion once a threshold is reached. With one to ${K.vormerkung_bis} points you are merely noted (Vormerkung). At ${K.ermahnung_ab} or ${K.ermahnung_reset} points comes a written reminder, at ${K.verwarnung_ab} or ${K.verwarnung_reset} a written warning, each charged at ${h.eur(F.verwarnung_fes, 2)}. At ${K.entzug_ab} points the law treats you as unfit to drive and the licence is withdrawn. The reminder mentions the voluntary seminar that knocks off one point up to ${K.seminar_abzug_bis}; the warning mentions it too but says that it no longer reduces your total. Details are on the page about ${h.a('punkteabbau', 'reducing Flensburg points')}.</p>

<h2>No jumping straight to withdrawal</h2>
<p>A single decision can add three points. Section 4(6) StVG protects drivers from losing the licence without notice: if the previous letter was never sent, the authority sends it first and lowers your score from the day it is issued. Someone at three points who picks up a three-point conviction gets the reminder and is reset to ${skipE.points}. Someone who had the reminder at five and climbs to eight gets the warning and is reset to ${skipV.points}. The reset does not apply if expiries or a seminar have already brought you lower.</p>

<h2>The date of the offence counts</h2>
<p>When deciding on a measure, the authority looks at your total on the day of the last offence that triggered it. An older entry that expires while the new case is still being processed does not rescue you. This is why each entry stays in the register for a further year after its expiry date, the Überliegefrist (holding period) set out in ${h.src('stvg29', 'Section 29 StVG')}: an offence committed in March but decided in October can still be counted correctly. One point expires two and a half years after the decision became final, two points after five years, three points after ten.</p>

<h2>Points, probation and new drivers</h2>
<p>If your licence is less than two years old, a second set of rules applies on top. The Probezeit (probationary period) treats most point offences as A offences, so a single red light means a remedial course and two more years of probation alongside the point. EU licence holders who move to Germany fall under it too, with the time since their test credited. The ${h.a('probezeit-fuehrerschein', 'probationary licence guide')} explains the steps.</p>

<h2>After a withdrawal</h2>
<p>A licence withdrawn at ${K.entzug_ab} points can be granted again ${K.neuerteilung_sperre_monate} months after you hand it in at the earliest. Giving it up voluntarily just before does not help if two or more decisions were stored at that moment. In most cases the authority wants proof that you are fit to drive again, in the form of a medical and psychological assessment, the ${h.a('mpu', 'MPU')}. Once the new licence is granted, the old points are deleted.</p>

<h2>Bikes and e-scooters count too</h2>
<p>You can collect a point without being anywhere near a car. Cyclists and riders of e-scooters (Elektrokleinstfahrzeuge) who ignore a red light pay ${h.eur(rad.fine!)} and receive one point under catalogue number 132a, rising to ${h.eur(entry('132a.3').fine!)} when the light had been red for more than a second. A phone on the handlebars costs a cyclist ${h.eur(radHandy.fine!)}, which stays below the recording threshold. If you do not hold a licence at all, the entry still sits in the register; it is deleted only if you later obtain a first licence, because points from decisions made before that grant are wiped.</p>

<h2>Company cars and the question of who drove</h2>
<p>Many expats drive a leased company car. When a speed camera flashes, the hearing form (Anhörungsbogen) goes to the registered keeper, usually the employer, who passes it to the person behind the wheel. The points go to the driver only. For a parking offence where nobody can be identified, the keeper pays the procedure costs under Section 25a StVG and no one receives points. Since 1 July 2026, Section 4c StVG forbids deceiving the authority about who was driving for any offence listed in annex 13, as well as offering or arranging such a deception for others. The fine reaches ${h.eur(P.verfahren.taeuschung_bussgeld_max)}. A ban that comes with the points is explained on the page about the ${h.a('fahrverbot', 'German driving ban')}.</p>
<!--mini:tilgung-->
<h2>Checking your own record</h2>
<p>You do not need a German ID card to see your file. The KBA answers written requests from anyone with proof of identity, and the online service also accepts the electronic residence permit. The steps are on the page about ${h.a('punkte-abfragen', 'checking your Flensburg points')}. To see when each entry drops off, or what a pending fine would do to your total, enter the dates in the ${h.a('punkterechner', 'points calculator')}.</p>`,
  },
});
