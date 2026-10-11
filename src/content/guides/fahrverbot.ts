import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, speeding } from '../../lib/engine/bkat';

const V = P.verfahren;
const in31 = speeding({ limit: 50, measured: 81, inner: true, tolerance: false });
const out41 = speeding({ limit: 100, measured: 141, inner: false, tolerance: false });
const rot = entry('132.3'), handyG = entry('246.2'), gasse = entry('50'), alk = entry('241');

export default defineGuide({
  id: 'fahrverbot',
  group: 'verstoesse',
  order: 120,
  mini: 'fahrverbot',
  related: ['bussgeldrechner', 'geschwindigkeitsueberschreitung', 'kmh-31', 'punkte-in-flensburg', 'bussgeldbescheid', 'alkohol-am-steuer'],
  sources: ['stvg25', 'bkatv', 'bkatAnhang', 'fevAnl13'],
  de: {
    slug: 'fahrverbot',
    nav: 'Fahrverbot',
    card: 'Wann es droht, wie lange es dauert und wann es beginnt.',
    title: 'Fahrverbot 2026: Dauer, Viermonatsfrist und Regelfälle',
    description: `Fahrverbot 2026: ein bis drei Monate, Beginn nach Wahl binnen ${V.fahrverbot_schonfrist_monate} Monaten ohne Vorverbot, Regelfälle ab 31 km/h innerorts. Mit Rechner nach § 25 StVG und BKatV.`,
    h1: 'Fahrverbot: wann es droht und wie es abläuft',
    intro: 'Ein Fahrverbot ist keine Entziehung: der Führerschein kommt nach ein bis drei Monaten zurück, ohne neue Prüfung.',
    resume: `Ein Fahrverbot nach § 25 StVG untersagt für einen, zwei oder drei Monate das Führen von Kraftfahrzeugen, danach gilt die Fahrerlaubnis ohne weiteren Antrag wieder. Die Bußgeldkatalog-Verordnung sieht es als Regelfolge bei groben Verstößen vor: innerorts ab 31 km/h zu schnell mit dem Pkw, außerorts ab 41 km/h, bei Rotlicht nach mehr als einer Sekunde, beim Handy am Steuer mit Gefährdung, bei fehlender Rettungsgasse und bei 0,5 Promille. Wer in den zwei Jahren vor dem Verstoß kein Fahrverbot hatte, darf den Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft selbst legen, etwa in den Urlaub. Sonst beginnt die Frist mit der Abgabe des Führerscheins, spätestens einen Monat nach Rechtskraft. Zum Fahrverbot gehören immer zwei Punkte in Flensburg und das Bußgeld des jeweiligen Tatbestands.`,
    faqs: [
      { q: 'Ab wie viel km/h zu schnell gibt es ein Fahrverbot?', a: `Mit dem Pkw innerorts ab 31 km/h nach Toleranzabzug: ${in31.fine} Euro, ein Monat und zwei Punkte. Außerorts erst ab 41 km/h: ${out41.fine} Euro, ein Monat, zwei Punkte. Die Werte stehen in Tabelle 1 Buchstabe c des Anhangs zur BKatV. Dazu kommt das Fahrverbot wegen Beharrlichkeit, wenn innerhalb eines Jahres zweimal mindestens ${V.beharrlich_kmh} km/h gemessen wurden.` },
      { q: 'Kann ich den Beginn meines Fahrverbots selbst wählen?', a: `Ja, wenn in den zwei Jahren vor der Tat kein Fahrverbot rechtskräftig wurde. Dann bestimmt der Bescheid, dass das Verbot spätestens ${V.fahrverbot_schonfrist_monate} Monate nach Rechtskraft wirksam wird, und Sie geben den Führerschein innerhalb dieser Zeit ab, wann es Ihnen passt. Die Verbotsfrist läuft ab dem Tag, an dem die Behörde den Führerschein in Verwahrung nimmt (§ 25 Abs. 2a, 3 und 6 StVG).` },
      { q: 'Was passiert, wenn ich zwei Fahrverbote gleichzeitig habe?', a: 'Sie laufen nacheinander, nicht parallel. § 25 Abs. 4 StVG ordnet an, dass zuerst die Frist des früher wirksam gewordenen Verbots läuft; werden beide am selben Tag wirksam, zählt das früher angeordnete Verbot, bei gleichzeitiger Anordnung die frühere Tat. Zwei Monate und ein Monat ergeben also drei Monate ohne Führerschein.' },
      { q: 'Darf ich während des Fahrverbots Mofa oder E-Scooter fahren?', a: 'Das Verbot betrifft Kraftfahrzeuge jeder oder einer bestimmten Art, so steht es in § 25 Abs. 1 StVG und im Bescheid. Fahrrad und Pedelec bis 25 km/h sind keine Kraftfahrzeuge im Sinne der Fahrerlaubnis. Für Mofa und E-Scooter lohnt der genaue Blick in den Bescheid, weil die Behörde das Verbot auf bestimmte Fahrzeugarten beschränken oder auf alle erstrecken kann.' },
      { q: 'Wird das Fahrverbot gegen ein höheres Bußgeld erlassen?', a: 'Nur ausnahmsweise. § 4 Abs. 4 BKatV sagt, dass beim Absehen vom Regelfahrverbot das Bußgeld angemessen erhöht werden soll; einen festen Betrag nennt die Verordnung nicht. Ob ein Ausnahmefall vorliegt, entscheiden Behörde oder Amtsgericht im Einzelfall, häufig bei drohendem Verlust des Arbeitsplatzes. Ein Rechenwert lässt sich dafür seriös nicht angeben.' },
    ],
    body: (h) => `
<h2>Die Regelfälle aus dem Katalog</h2>
<p>Die Bußgeldkatalog-Verordnung legt in § 4 fest, bei welchen Nummern ein Fahrverbot in der Regel angeordnet wird. Behörde und Gericht dürfen davon abweichen, müssen das aber begründen. Die häufigsten Fälle mit ihren amtlichen Werten:</p>
${h.table(['Verstoß', 'BKat-Nr.', 'Bußgeld', 'Fahrverbot'], [
  ['31 bis 40 km/h zu schnell, innerorts, Pkw', '11.3.6', h.eur(in31.fine), `${in31.fv} Monat`],
  ['41 bis 50 km/h zu schnell, außerorts, Pkw', '11.3.7', h.eur(out41.fine), `${out41.fv} Monat`],
  ['Rotlicht länger als 1 Sekunde', '132.3', h.eur(rot.fine!), `${rot.fv} Monat`],
  ['Handy am Steuer mit Gefährdung', '246.2', h.eur(handyG.fine!), `${handyG.fv} Monat`],
  ['Keine Rettungsgasse gebildet', '50', h.eur(gasse.fine!), `${gasse.fv} Monat`],
  ['0,5 Promille oder mehr, erstmals', '241', h.eur(alk.fine!), `${alk.fv} Monat`],
], 'Regelsätze und Fahrverbote nach BKatV, Stand 12.8.2026', ['l', 'l', 'r', 'r'])}
<p>Bei der Geschwindigkeit steigt die Dauer mit der Überschreitung: innerorts zwei Monate ab 51 km/h, drei Monate ab 61 km/h; außerorts zwei Monate ab 61 km/h und drei Monate ab 71 km/h. Die vollständige Tabelle mit allen Stufen steht im ${h.a('geschwindigkeitsueberschreitung', 'Überblick zur Geschwindigkeitsüberschreitung')}.</p>

<h2>Beharrlichkeit: das Fahrverbot ohne groben Einzelfall</h2>
<p>Ein Fahrverbot kann auch bei Verstößen kommen, die für sich genommen keines auslösen. § 4 Abs. 2 BKatV beschreibt den Hauptfall: Gegen Sie wurde wegen einer Überschreitung von mindestens ${V.beharrlich_kmh} km/h ein Bußgeld rechtskräftig festgesetzt, und innerhalb eines Jahres ab dieser Rechtskraft sind Sie erneut mindestens ${V.beharrlich_kmh} km/h zu schnell. Dann gilt in der Regel ein Monat. Wer also außerorts zweimal 27 km/h zu schnell war, zahlt beim zweiten Mal nicht nur die ${h.eur(speeding({ limit: 100, measured: 127, inner: false, tolerance: false }).fine)} aus dem Katalog, sondern muss auch mit dem Führerscheinentzug auf Zeit rechnen. Der ${h.a('kmh-26', 'Fall 26 km/h zu schnell')} zeigt das an einem Beispiel.</p>

<h2>Wann das Fahrverbot beginnt</h2>
<p>Hier unterscheidet § 25 StVG zwei Lagen, und die Unterscheidung entscheidet über Ihre Planung.</p>
<h3>Erstes Fahrverbot seit zwei Jahren</h3>
<p>Ist in den zwei Jahren vor dem Verstoß kein Fahrverbot rechtskräftig geworden, gibt Ihnen das Gesetz eine Schonfrist. Der Bescheid legt fest, dass das Verbot spätestens ${V.fahrverbot_schonfrist_monate} Monate nach Eintritt der Rechtskraft wirksam wird. Bis dahin dürfen Sie fahren. Sie geben den Führerschein ab, wenn es in Ihren Kalender passt, zum Beispiel vor einem Urlaub mit dem Zug. Die Verbotsfrist zählt ab dem Tag, an dem die Behörde den Führerschein in amtliche Verwahrung nimmt.</p>
<h3>Wiederholungstäter</h3>
<p>Gab es in den zwei Jahren schon ein Fahrverbot, wird das neue mit der Abgabe des Führerscheins wirksam, spätestens aber einen Monat nach Rechtskraft. Wer den Führerschein dann nicht abgibt, verlängert das Verbot faktisch, denn die Frist läuft erst ab der Verwahrung (§ 25 Abs. 6). Fahren ohne gültige Berechtigung ist eine Straftat nach § 21 StVG.</p>

<h2>Was mit Ihrem Führerschein geschieht</h2>
<p>Deutsche Führerscheine werden für die Dauer des Verbots amtlich verwahrt, in der Regel bei der Bußgeldstelle, die den Bescheid erlassen hat. Das gilt auch für den Führerschein aus einem anderen EU-Staat, wenn Sie Ihren ordentlichen Wohnsitz in Deutschland haben. Führerscheine aus Staaten außerhalb von EU und EWR bekommen einen Vermerk eingetragen. Wird der Führerschein nicht freiwillig herausgegeben, darf er beschlagnahmt werden. Die Rückgabe erfolgt zum Ende der Frist; viele Behörden schicken ihn per Post zurück, wenn Sie das beantragen.</p>

<h2>Fahrverbot, Entziehung, MPU: drei verschiedene Dinge</h2>
<p>Das Fahrverbot ist eine Nebenfolge des Bußgeldes. Die Fahrerlaubnis bleibt bestehen und gilt nach Fristende automatisch wieder. Anders die Entziehung: Sie beendet die Fahrerlaubnis, und eine neue muss beantragt werden, oft mit ${h.a('mpu', 'medizinisch-psychologischer Untersuchung')}. Zur Entziehung kommt es bei acht Punkten in Flensburg, bei Straftaten wie Trunkenheit ab 1,1 Promille oder in der Probezeit nach der dritten Stufe. Wer ein Fahrverbot bekommt, sammelt dabei zwei Punkte, denn alle Regelfälle mit Fahrverbot stehen in Anlage 13 der FeV unter den besonders verkehrssicherheitsbeeinträchtigenden Ordnungswidrigkeiten. Wie viele Punkte Sie schon haben, zeigt der ${h.a('punkte-in-flensburg', 'Überblick zu den Punkten in Flensburg')}.</p>

<h2>Kosten neben dem Bußgeld</h2>
<p>Zum Regelsatz kommen die Kosten des Bescheids nach ${h.src('owig107', '§ 107 OWiG')}: fünf Prozent des Bußgelds, mindestens ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} für die Zustellung. Bei ${h.eur(in31.fine)} für 31 km/h innerorts ergibt das ${h.eur(in31.total, 2)}. Wer beruflich auf das Auto angewiesen ist, rechnet zusätzlich Taxi, Bahn oder Mietwagen für die Verbotszeit ein. Das Gesamtbild einschließlich Punkten liefert der ${h.a('bussgeldrechner', 'Bußgeldrechner')}.</p>

<h2>Mehrere Verstöße bei einer Fahrt</h2>
<p>Begeht jemand mit einer Handlung mehrere Verstöße, wird nach § 3 Abs. 5 BKatV nur ein Regelsatz angewendet, der höchste, und er kann angemessen erhöht werden. Für das Fahrverbot gilt sinngemäß dasselbe: Es wird nicht addiert, wenn alles auf derselben Fahrt in einem Zug geschah. Bei getrennten Taten, etwa zwei Blitzern an verschiedenen Tagen, laufen die Verbote dagegen nacheinander.</p>
<!--mini:fahrverbot-->
<h2>Was der Bescheid enthalten muss</h2>
<p>Ein Bußgeldbescheid mit Fahrverbot belehrt nach § 25 Abs. 9 StVG darüber, wann das Verbot wirksam wird und ab wann die Frist läuft. Steht dort die Viermonatsfrist, haben Sie die Wahl; steht dort die Monatsfrist, gab es aus Sicht der Behörde ein früheres Verbot. Gegen den Bescheid ist innerhalb von zwei Wochen nach Zustellung der Einspruch möglich, mehr dazu auf der Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}. Mit dem Einspruch tritt keine Rechtskraft ein, also beginnt auch keine Frist für das Fahrverbot.</p>`,
  },
  en: {
    slug: 'driving-ban-germany',
    nav: 'Driving ban',
    card: 'When a ban applies, how long it lasts and when it starts.',
    title: 'Driving Ban Germany 2026: Fahrverbot Length and Start',
    description: `Driving ban (Fahrverbot) in Germany 2026: one to three months, start chosen within ${V.fahrverbot_schonfrist_monate} months if it is your first in two years, usual cases from 31 km/h in town.`,
    h1: 'Driving bans in Germany: when they apply and how they work',
    intro: 'A Fahrverbot suspends your right to drive for one to three months; you keep your licence and need no new test afterwards.',
    resume: `A German driving ban, the Fahrverbot under Section 25 of the Road Traffic Act (StVG), stops you driving motor vehicles for one, two or three months and then ends on its own. The fine catalogue (BKatV) lists the standard cases: in a car, 31 km/h or more over the limit in a built-up area, 41 km/h or more outside towns, running a red light that had been red for over a second, using a phone and endangering someone, failing to form an emergency corridor, and driving with 0.5 per mille or more. If you had no ban in the two years before the offence, you may pick the start date yourself within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final. Otherwise the ban starts when you hand in your licence, at the latest one month after it becomes final. A ban always comes with two Flensburg points and the fine for the offence.`,
    faqs: [
      { q: 'Does a German driving ban apply to my foreign licence?', a: 'Yes. The ban forbids driving in Germany whatever licence you hold. If you live in Germany and hold an EU or EEA licence, it is held by the authority for the length of the ban, just like a German one. A licence from outside the EU and EEA receives an entry noting the ban instead (Section 25(2a) StVG). Driving during the ban is a criminal offence under Section 21 StVG.' },
      { q: 'How fast do you have to go in Germany to lose your licence for a month?', a: `In a car, 31 km/h over the limit in a built-up area after the tolerance deduction, which costs ${in31.fine} euros plus fees, or 41 km/h over outside towns (${out41.fine} euros). Both cases bring one month and two points. Two offences of ${V.beharrlich_kmh} km/h or more within a year can also lead to a one-month ban as persistent misconduct.` },
      { q: 'Can I serve a German driving ban during a holiday abroad?', a: `If it is your first ban in two years, you choose when to surrender your licence within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final, so you can line it up with a period when you do not need a car. The ban period counts from the day the authority receives your licence, not from the day you stop driving, so post it in good time.` },
      { q: 'Is a Fahrverbot the same as losing my licence?', a: 'No. A Fahrverbot is a temporary ban: your licence stays valid and is returned when the period ends. Losing the licence, called Entziehung, happens with eight Flensburg points, with crimes such as drink-driving from 1.1 per mille, or at the third stage during probation. After an Entziehung you must apply again, often after an MPU assessment.' },
    ],
    body: (h) => `
<h2>Which offences carry a ban</h2>
<p>Section 4 of the fine catalogue ordinance names the offence numbers for which a ban is the standard consequence. Authorities and courts can depart from the rule in exceptional cases, but the default is clear. The cases expats run into most often:</p>
${h.table(['Offence', 'BKat no.', 'Fine', 'Ban'], [
  ['31 to 40 km/h over, built-up area, car', '11.3.6', h.eur(in31.fine), `${in31.fv} month`],
  ['41 to 50 km/h over, outside towns, car', '11.3.7', h.eur(out41.fine), `${out41.fv} month`],
  ['Red light, red for more than 1 second', '132.3', h.eur(rot.fine!), `${rot.fv} month`],
  ['Phone at the wheel, endangering others', '246.2', h.eur(handyG.fine!), `${handyG.fv} month`],
  ['No emergency corridor (Rettungsgasse)', '50', h.eur(gasse.fine!), `${gasse.fv} month`],
  ['0.5 per mille or more, first time', '241', h.eur(alk.fine!), `${alk.fv} month`],
], 'Standard fines and bans, BKatV as amended on 12 August 2026', ['l', 'l', 'r', 'r'])}
<p>For speeding, the length grows with the excess: in town two months from 51 km/h over and three months from 61 km/h; outside towns two months from 61 km/h and three from 71 km/h. Every band is set out on the page about ${h.a('geschwindigkeitsueberschreitung', 'speeding fines in Germany')}.</p>

<h2>The repeat rule that surprises newcomers</h2>
<p>Germany also bans drivers who keep breaking the same rule. If a fine for going at least ${V.beharrlich_kmh} km/h too fast has become final and you exceed the limit by ${V.beharrlich_kmh} km/h or more again within twelve months, a one-month ban is the norm (Section 4(2) BKatV). Neither offence would trigger a ban on its own outside towns. Many people who commute on the Autobahn meet this rule after a second camera flash; the ${h.a('kmh-26', 'page on 26 km/h over')} walks through one such case.</p>

<h2>Timing: the four-month window</h2>
<p>For a first ban in two years, the notice says the ban takes effect at the latest ${V.fahrverbot_schonfrist_monate} months after it becomes final. Until you surrender the licence, you may drive. People use this to fit the ban into a stretch of parental leave, remote work or a long trip by train. If you had a ban in the previous two years, there is no window: the ban begins when you hand in your licence and no later than one month after the decision is final. Either way the clock only starts on the day the authority holds the licence.</p>
<h3>Two bans in a row</h3>
<p>Separate bans never run at the same time. Section 25(4) StVG makes them consecutive, so a two-month and a one-month ban mean three months without driving. Offences committed in one single act are treated differently: only the highest fine applies under Section 3(5) BKatV, and the bans are not stacked.</p>

<h2>Practical steps once the notice arrives</h2>
<p>The fine notice (Bußgeldbescheid) has to explain when the ban takes effect. Read that sentence first. If you do nothing, the notice becomes final two weeks after delivery and the window starts. Send the licence to the authority named in the notice, ideally by registered post, and keep proof of the date. Plan transport for the period: German public transport passes such as the monthly Deutschlandticket are an option many residents use. When the period ends, the licence is returned, by post if you ask for it.</p>
<!--mini:fahrverbot-->
<h2>Points and costs that come with it</h2>
<p>Every standard ban case is listed among the offences worth two points in annex 13 of the Driving Licence Ordinance, so a ban always adds two points in Flensburg. The fine itself is joined by the procedure costs under ${h.src('owig107', 'Section 107 OWiG')}: five per cent of the fine with a minimum of ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for delivery. For 31 km/h over in town this gives ${h.eur(in31.total, 2)}. To see where you stand, use the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} or run your own case in the ${h.a('bussgeldrechner', 'fine calculator')}.</p>

<h2>Bans and the probationary period</h2>
<p>New drivers in their Probezeit, the two-year probation that starts with a first licence, face a second track. Most ban offences are A offences under annex 12 of the ordinance, which means a remedial course and two extra years of probation on top of the ban. Moving to Germany with a licence from another EU country does not avoid this: the probation applies to residents and the time since you passed your test is credited. The rules are explained on the ${h.a('probezeit-fuehrerschein', 'probationary licence page')}.</p>`,
  },
});
