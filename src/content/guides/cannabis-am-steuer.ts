import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { alcohol, fromEntry } from '../../lib/engine/bkat';
import { formatMoney, formatDecimal } from '../../lib/format';

const A = P.alkohol, V = P.verfahren, PZ = P.probezeit;
const thc = (prior: 0 | 1 | 2) => alcohol({ promille: 0, thc: A.thc_ng, priorEntries: prior, novice: false });
const mix = (prior: 0 | 1 | 2) => alcohol({ promille: 0.2, thc: A.thc_ng, priorEntries: prior, novice: false, withAlcoholAndThc: true });
const t0 = thc(0), t1 = thc(1), t2 = thc(2), m0 = mix(0), m1 = mix(1), m2 = mix(2);
const nov = alcohol({ promille: 0, thc: 1, priorEntries: 0, novice: true });
const other = fromEntry('243');
const mD = (x: number, d = 0) => formatMoney(x, d, 'de'), mE = (x: number, d = 0) => formatMoney(x, d, 'en');
const dD = (x: number) => formatDecimal(x, 2, 'de'), dE = (x: number) => formatDecimal(x, 2, 'en');

export default defineGuide({
  id: 'cannabis-am-steuer',
  group: 'verstoesse',
  order: 60,
  mini: 'cannabis',
  miniHref: 'promillerechner',
  related: ['promillerechner', 'alkohol-am-steuer', 'promillegrenze', 'mpu', 'probezeit-fuehrerschein', 'fahrverbot'],
  sources: ['stvg24a', 'stvg24c', 'bkatAnlage', 'fevAnl13', 'stgb316'],
  de: {
    slug: 'cannabis-am-steuer',
    nav: 'Cannabis am Steuer',
    card: 'THC-Grenzwert, Bußgeld, Mischkonsum mit Alkohol, Fahranfänger und MPU.',
    title: 'Cannabis am Steuer 2026: THC-Grenzwert, Bußgeld und MPU',
    description: `Cannabis am Steuer 2026: ab ${dD(A.thc_ng)} ng/ml THC ${t0.fine} €, 1 Monat Fahrverbot, 2 Punkte. Mit Alkohol ${mD(m0.fine)}, für Fahranfänger und unter 21 gilt 0,0. Regeln im StVG.`,
    h1: 'Cannabis am Steuer: Grenzwert und Folgen',
    intro: 'Maßgeblich ist der THC-Wert im Blutserum, nicht der Zeitpunkt des Konsums und nicht das eigene Gefühl.',
    resume: `Wer mit ${dD(A.thc_ng)} Nanogramm THC je Milliliter Blutserum oder mehr ein Kraftfahrzeug führt, begeht nach § 24a Abs. 1a StVG eine Ordnungswidrigkeit. Der Bußgeldkatalog sieht dafür ${t0.fine} Euro, ${t0.fv} Monat Fahrverbot und ${t0.points} Punkte vor, bei einer Voreintragung wegen Alkohol oder Drogen ${mD(t1.fine)} und ${t1.fv} Monate, bei mehreren ${mD(t2.fine)}. Wer über dem Grenzwert liegt und zusätzlich Alkohol getrunken hat, fällt unter ein eigenes Verbot: ${mD(m0.fine)} und ein Monat Fahrverbot schon beim ersten Mal, im Wiederholungsfall bis zu ${mD(m2.fine)}. Fahranfänger in der Probezeit und alle unter ${A.anfaenger_alter} Jahren dürfen überhaupt kein THC im Blut haben; der Verstoß kostet ${nov.fine} Euro und einen Punkt. Eine MPU ordnet die Behörde nach § 13a FeV bei Hinweisen auf Missbrauch oder bei wiederholten Fahrten unter Cannabiseinfluss an. Ausgenommen ist die bestimmungsgemäße Einnahme eines ärztlich verschriebenen Cannabis-Arzneimittels.`,
    faqs: [
      { q: 'Was passiert beim zweiten Mal mit THC über dem Grenzwert am Steuer?', a: `Steht schon eine Entscheidung nach § 24a StVG, § 316 oder § 315c StGB im Fahreignungsregister, steigt der Regelsatz auf ${mD(t1.fine)} und ${t1.fv} Monate Fahrverbot, bei mehreren Voreintragungen auf ${mD(t2.fine)}. Dazu kommen je ${t1.points} Punkte. Wiederholte Zuwiderhandlungen unter Cannabiseinfluss sind außerdem ein ausdrücklicher Anlass für eine MPU nach § 13a FeV.` },
      { q: 'Darf ich als Cannabispatient Auto fahren?', a: 'Die THC-Grenze und das Verbot für Fahranfänger gelten nicht, wenn das THC aus der bestimmungsgemäßen Einnahme eines für einen konkreten Krankheitsfall verschriebenen Arzneimittels stammt (§ 24a Abs. 4, § 24c Abs. 3 StVG). Strafbar bleibt aber jede Fahrt, bei der man tatsächlich nicht sicher fahren kann. Die Fahrerlaubnisbehörde darf zudem die Fahreignung prüfen, wenn Zweifel bestehen.' },
      { q: 'Wie hoch ist das Bußgeld, wenn ich Cannabis und Alkohol gemischt habe?', a: `Liegt der THC-Wert bei ${dD(A.thc_ng)} ng/ml oder mehr und wurde zusätzlich Alkohol getrunken, greift § 24a Abs. 2a StVG mit eigenem Regelsatz: ${mD(m0.fine)}, ${m0.fv} Monat Fahrverbot und ${m0.points} Punkte. Mit einer Voreintragung sind es ${mD(m1.fine)}, mit mehreren ${mD(m2.fine)}, jeweils mit drei Monaten Fahrverbot. Eine Promillegrenze gibt es hier nicht: Schon ein Glas reicht.` },
      { q: 'Gibt es für Cannabis eine Grenze der absoluten Fahruntüchtigkeit wie bei 1,1 Promille?', a: 'Nein. Für Alkohol hat die Rechtsprechung feste Werte entwickelt, für Cannabis und andere Drogen nicht. Eine Straftat nach § 316 StGB setzt deshalb immer konkrete Hinweise voraus, dass der Fahrer nicht sicher fahren konnte, etwa Fahrfehler oder deutliche Ausfallerscheinungen bei der Kontrolle. Ohne solche Hinweise bleibt es bei der Ordnungswidrigkeit nach dem THC-Grenzwert.' },
      { q: 'Muss ich nach einer Fahrt mit THC automatisch zur MPU?', a: 'Nicht automatisch. § 13a FeV nennt keinen THC-Wert, ab dem eine MPU fällig wird. Die Behörde ordnet sie an, wenn Tatsachen auf Cannabismissbrauch hindeuten, wenn wiederholt Verstöße unter Cannabiseinfluss vorliegen oder wenn die Fahrerlaubnis deswegen schon entzogen war. Verstöße nur gegen das Verbot für Fahranfänger zählen bei der Wiederholung nicht mit.' },
    ],
    body: (h) => `
<h2>Der Grenzwert im Gesetz</h2>
<p>${h.src('stvg24a', '§ 24a Abs. 1a StVG')} ist kurz: Ordnungswidrig handelt, wer vorsätzlich oder fahrlässig ein Kraftfahrzeug führt, obwohl er ${h.num(A.thc_ng, 1)} ng/ml oder mehr Tetrahydrocannabinol im Blutserum hat. Gemessen wird also nicht im Vollblut und nicht im Speichel, sondern im Serum, das aus der Blutprobe gewonnen wird. Ausfallerscheinungen muss die Behörde nicht nachweisen. Der Wert allein entscheidet.</p>
<p>Wichtig ist, was der Wert nicht sagt. Er verrät nicht, wann konsumiert wurde, und er ist kein Maß für die eigene Fahrtüchtigkeit. Wer regelmäßig konsumiert, kann auch nach längerer Pause noch messbare Werte haben, wer selten konsumiert, baut schneller ab. Eine verlässliche Wartezeit lässt sich deshalb nicht angeben. Ein Vortest am Straßenrand dient der Polizei nur als Anhaltspunkt; für das Verfahren zählt die Blutprobe.</p>

<h2>Bußgeld, Fahrverbot und Punkte</h2>
<p>Die Regelsätze stehen im ${h.src('bkatAnlage', 'Bußgeldkatalog')} unter den Nummern 242 bis 243b. Beim THC-Grenzwert allein sind sie genauso hoch wie bei 0,5 Promille Alkohol. Als Voreintragung zählen Entscheidungen nach § 24a StVG, also auch frühere Alkoholfahrten, sowie Verurteilungen nach § 316 und § 315c StGB.</p>
${h.table(['Lage', 'BKat-Nr.', 'Bußgeld', 'Fahrverbot', 'Punkte', 'mit Gebühren'], [
  [`THC ab ${h.num(A.thc_ng, 1)} ng/ml, erstmals`, t0.nr, h.eur(t0.fine), `${t0.fv} Monat`, h.num(t0.points), h.eur(t0.total, 2)],
  ['THC, eine Voreintragung', t1.nr, h.eur(t1.fine), `${t1.fv} Monate`, h.num(t1.points), h.eur(t1.total, 2)],
  ['THC, mehrere Voreintragungen', t2.nr, h.eur(t2.fine), `${t2.fv} Monate`, h.num(t2.points), h.eur(t2.total, 2)],
  ['THC und Alkohol, erstmals', m0.nr, h.eur(m0.fine), `${m0.fv} Monat`, h.num(m0.points), h.eur(m0.total, 2)],
  ['THC und Alkohol, eine Voreintragung', m1.nr, h.eur(m1.fine), `${m1.fv} Monate`, h.num(m1.points), h.eur(m1.total, 2)],
  ['THC und Alkohol, mehrere Voreintragungen', m2.nr, h.eur(m2.fine), `${m2.fv} Monate`, h.num(m2.points), h.eur(m2.total, 2)],
  ['Probezeit oder unter 21, jeder THC-Konsum', nov.nr, h.eur(nov.fine), 'nein', h.num(nov.points), h.eur(nov.total, 2)],
], 'Cannabis am Steuer nach §§ 24a, 24c StVG und BKatV, Stand August 2026', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Alle Fälle mit Fahrverbot bringen nach der ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')} zwei Punkte, die nach fünf Jahren tilgungsreif werden. Das Fahrverbot läuft nach den üblichen Regeln: Beim ersten seit zwei Jahren darf der Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft gewählt werden. Einzelheiten stehen auf der Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Cannabis und Alkohol: das Mischkonsumverbot</h2>
<p>§ 24a Abs. 2a StVG verbietet Fahrern, die über dem THC-Grenzwert liegen, jeden Alkohol: Sie dürfen weder während der Fahrt trinken noch die Fahrt unter der Wirkung eines alkoholischen Getränks antreten. Eine Promillegrenze nennt die Vorschrift nicht. Der Hintergrund ist, dass sich die Wirkungen beider Stoffe verstärken können. Entsprechend höher liegen die Sätze: ${h.eur(m0.fine)} schon beim ersten Mal, bis ${h.eur(m2.fine)} bei mehreren Voreintragungen. Auch der gesetzliche Bußgeldrahmen ist für diesen Fall höher als beim THC-Grenzwert allein. Liegt der Alkoholwert ohnehin bei 0,5 Promille oder mehr, kommt die Promillegrenze hinzu; was dann gilt, beschreibt die Seite zu ${h.a('alkohol-am-steuer', 'Alkohol am Steuer')}.</p>

<h2>Fahranfänger und unter 21: kein THC</h2>
<p>Für die Probezeit und für alle unter ${A.anfaenger_alter} Jahren erweitert ${h.src('stvg24c', '§ 24c StVG')} das Alkoholverbot auf Cannabis. Verboten ist, als Fahrer THC zu sich zu nehmen oder die Fahrt unter seiner Wirkung anzutreten. Einen Grenzwert gibt es für diese Gruppe nicht. Der Verstoß kostet ${h.eur(nov.fine)} und ${h.num(nov.points)} Punkt und ist in der Probezeit ein A-Verstoß: Aufbauseminar und ${PZ.verlaengerung_jahre} Jahre Verlängerung. Liegt der Wert zugleich über ${h.num(A.thc_ng, 1)} ng/ml, gilt zusätzlich die Nummer 242 mit Fahrverbot. Die Stufen der ${h.a('probezeit-fuehrerschein', 'Probezeit')} sind dort beschrieben.</p>

<h2>Fahrrad, E-Scooter und Begleitperson</h2>
<p>Der THC-Grenzwert betrifft nur Kraftfahrzeuge. Dazu gehören Auto, Motorrad, Mofa und E-Scooter, ebenso das S-Pedelec mit Unterstützung bis 45 km/h. Das normale Pedelec bis 25 km/h zählt rechtlich als Fahrrad und fällt nicht unter § 24a. Für Radfahrer bleibt nur das Strafrecht, wenn sie tatsächlich nicht sicher fahren können.</p>
<p>Beim begleiteten Fahren ab 17 ist auch die Begleitperson gebunden. § 48a Abs. 6 FeV verbietet ihr das Begleiten, wenn sie ${h.num(A.thc_ng, 1)} ng/ml THC oder mehr im Blutserum hat. Für den jugendlichen Fahrer selbst gilt ohnehin das Verbot für unter ${A.anfaenger_alter}-Jährige.</p>

<h2>Verbreitete Irrtümer</h2>
<ul>
<li><strong>„Ich merke nichts mehr, also darf ich fahren.“</strong> Das Gefühl spielt für den Grenzwert keine Rolle. Gemessen wird der Serumwert, und der kann noch erhöht sein, wenn die Wirkung längst abgeklungen scheint.</li>
<li><strong>„Der Besitz ist erlaubt, also auch das Fahren danach.“</strong> Besitz und Verkehr sind getrennt geregelt. Für das Fahren gilt der eigene Grenzwert im Straßenverkehrsgesetz, ganz gleich, ob der Besitz erlaubt war.</li>
<li><strong>„Es war nur ein THC-armes Produkt.“</strong> Auch Produkte, die als arm an THC verkauft werden, können messbare Mengen enthalten. Maßgeblich ist allein der Wert in der Blutprobe.</li>
<li><strong>„Ein Bier dazu ist bei unter 0,5 Promille unproblematisch.“</strong> Wer über dem THC-Grenzwert liegt, darf überhaupt keinen Alkohol trinken. Das Mischkonsumverbot kennt keine Promillegrenze.</li>
<li><strong>„Mit 22 und nach der Probezeit gilt für mich nichts Besonderes.“</strong> Richtig ist: Das Nullverbot fällt dann weg, der Grenzwert von ${h.num(A.thc_ng, 1)} ng/ml und die Regelsätze ab ${h.eur(t0.fine)} gelten aber für alle.</li>
</ul>

<h2>Andere Drogen</h2>
<p>Für die übrigen berauschenden Mittel, die in der Anlage zu § 24a StVG aufgeführt sind, gilt ein strengerer Maßstab: Schon der Nachweis der Substanz im Blut gilt als Wirkung. Der Regelsatz nach Nummer 243 liegt bei ${h.eur(other.fine!)}, ${other.fv} Monat Fahrverbot und ${other.points} Punkten, mit denselben Stufen bei Voreintragungen. Auch hier gilt die Ausnahme für verschriebene Arzneimittel.</p>

<h2>Wann es eine Straftat wird</h2>
<p>${h.src('stgb316', '§ 316 StGB')} erfasst nicht nur Alkohol, sondern auch andere berauschende Mittel. Anders als beim Alkohol gibt es für Cannabis aber keinen Wert, ab dem Fahruntüchtigkeit ohne Weiteres feststeht. Strafbar ist die Fahrt deshalb nur, wenn konkrete Anzeichen hinzukommen: Fahrfehler, ein Unfall, auffällige Reaktionen bei der Kontrolle. Dann drohen Geld- oder Freiheitsstrafe bis zu einem Jahr und in der Regel die Entziehung der Fahrerlaubnis mit Sperrfrist. Für Radfahrer gilt der THC-Grenzwert des § 24a nicht, weil er nur Kraftfahrzeuge betrifft; § 316 StGB gilt für sie aber ebenso.</p>

<h2>Die MPU nach § 13a FeV</h2>
<p>Ob nach einer Fahrt mit THC eine Begutachtung folgt, entscheidet die Fahrerlaubnisbehörde nach § 13a FeV. Die Vorschrift nennt keinen Messwert. Sie unterscheidet zwei Wege: ein ärztliches Gutachten, wenn Tatsachen die Annahme einer Cannabisabhängigkeit begründen, und ein medizinisch-psychologisches Gutachten in diesen Fällen:</p>
<ul>
<li>das ärztliche Gutachten findet keine Abhängigkeit, aber Anzeichen für Missbrauch, oder andere Tatsachen sprechen für Missbrauch;</li>
<li>es wurden wiederholt Verkehrsverstöße unter Cannabiseinfluss begangen; reine Verstöße gegen das Verbot für Fahranfänger zählen dabei nicht;</li>
<li>die Fahrerlaubnis war aus einem dieser Gründe entzogen;</li>
<li>es ist zu klären, ob Missbrauch oder Abhängigkeit nicht mehr bestehen.</li>
</ul>
<p>Missbrauch meint dabei, dass jemand Konsum und Fahren nicht sicher trennt. Eine einmalige Fahrt knapp über dem Grenzwert führt deshalb nicht zwangsläufig zur MPU, eine zweite kann es. Wie die Begutachtung abläuft, steht auf der Seite zur ${h.a('mpu', 'MPU')}.</p>
<!--mini:cannabis-->
<h2>Kontrolle und Verfahren</h2>
<p>Bei einer Verkehrskontrolle kann die Polizei einen freiwilligen Vortest anbieten. Erhärtet sich der Verdacht, ordnet sie eine Blutprobe an. Das Ergebnis kommt einige Zeit später, und erst danach erhält der Halter oder Fahrer den Anhörungsbogen. Der Bescheid nennt die Nummer und den gemessenen Wert. Gegen ihn ist binnen ${V.einspruch_wochen} Wochen nach Zustellung der Einspruch möglich. Zu den Regelsätzen kommen die Gebühren nach § 107 OWiG hinzu, die in der Tabelle oben schon eingerechnet sind. Wie der eigene Wert einzuordnen ist, zeigt der ${h.a('promillerechner', 'Promillerechner')}, der auch THC-Werte auswertet.</p>
<p>Neben Bußgeld und Gebühren können im Bescheid Auslagen für Blutentnahme und Laboranalyse auftauchen, die je nach Fall einen spürbaren Betrag ausmachen. Wer ein Fahrverbot erhält, sollte außerdem die Monate ohne Führerschein einplanen; beim ersten Verbot seit zwei Jahren lässt sich der Beginn verschieben. Seit Juli 2026 verjährt der Verstoß nach sechs Monaten, sofern die Frist nicht unterbrochen wird, was bei Drogenfahrten wegen der Laborzeit häufig früh durch die Anhörung geschieht.</p>`,
  },
  en: {
    slug: 'cannabis-driving-germany',
    nav: 'Cannabis and driving',
    card: 'THC limit, fines, mixing with alcohol, new drivers and the MPU.',
    title: 'Cannabis Driving Germany 2026: THC Limit, Fines and MPU',
    description: `Cannabis and driving in Germany 2026: from ${dE(A.thc_ng)} ng/ml THC ${mE(t0.fine)}, a 1-month ban and 2 points; ${mE(m0.fine)} if mixed with alcohol; zero for new drivers and under-21s.`,
    h1: 'Driving after cannabis in Germany: the THC limit and penalties',
    intro: 'Cannabis may be legal to possess within limits, but on the road what counts is the THC level in your blood serum.',
    resume: `Driving a motor vehicle in Germany with ${dE(A.thc_ng)} nanograms of THC per millilitre of blood serum or more is an administrative offence under Section 24a(1a) of the Road Traffic Act (StVG). The fine catalogue sets ${t0.fine} euros, a ${t0.fv}-month driving ban (Fahrverbot) and ${t0.points} points for a first offence. With one earlier entry for drink or drug driving it is ${mE(t1.fine)} and ${t1.fv} months, with several ${mE(t2.fine)}. If you are over the THC limit and have also drunk alcohol, a separate ban applies: ${mE(m0.fine)} and one month from the first offence, up to ${mE(m2.fine)} for repeat offenders. Drivers on probation and everyone under ${A.anfaenger_alter} must have no THC at all; that costs ${nov.fine} euros and a point. The licensing authority can order an MPU assessment under Section 13a of the Driving Licence Ordinance if there are signs of misuse or repeated offences. Prescribed medical cannabis taken as directed is exempt from the limit, though not from the duty to drive safely.`,
    faqs: [
      { q: 'How long after smoking cannabis can I drive legally in Germany?', a: `There is no safe waiting time in German law. What counts is whether your serum level is below ${dE(A.thc_ng)} ng/ml when you drive, and that depends on how much and how often you use. Regular users can stay above the limit long after the effect has gone. A home or saliva test does not tell you your serum level, so it gives no legal certainty.` },
      { q: 'Does the German THC limit apply to medical cannabis patients?', a: 'The limit and the zero rule for new drivers do not apply if the THC comes from taking a medicine prescribed for a specific illness as directed (Section 24a(4) and Section 24c(3) StVG). You can still be prosecuted if you are actually unfit to drive, and the licensing authority may check your fitness. Carrying the prescription when you drive makes a roadside check easier.' },
      { q: 'What is the fine for cannabis and a beer before driving in Germany?', a: `If your THC level is ${dE(A.thc_ng)} ng/ml or more and you have drunk any alcohol, Section 24a(2a) applies: ${mE(m0.fine)}, a ${m0.fv}-month ban and ${m0.points} points the first time. With earlier entries it rises to ${mE(m1.fine)} or ${mE(m2.fine)}, with three months' ban. There is no alcohol threshold here; a single beer is enough.` },
      { q: 'Can I cycle in Germany after using cannabis?', a: 'The THC limit in Section 24a applies only to motor vehicles, so it does not cover ordinary bicycles or e-bikes assisting up to 25 km/h. Cycling under the influence can still be a crime under Section 316 of the Criminal Code if you cannot ride safely, for example if you weave or fall. E-scooters are motor vehicles, so the THC limit does apply to them.' },
    ],
    body: (h) => `
<h2>Legal to own, not to drive with</h2>
<p>Germany has allowed adults to possess and grow limited amounts of cannabis, and many newcomers assume that driving rules relaxed at the same pace. They did not disappear. ${h.src('stvg24a', 'Section 24a(1a) of the Road Traffic Act')} sets a limit of ${h.num(A.thc_ng, 1)} ng/ml of THC in blood serum for anyone driving a motor vehicle. Serum is the liquid part of a blood sample, so the value comes from a lab test, not from a roadside device. No sign of impairment is needed: reaching the value is the offence.</p>
<p>The number tells you nothing about when you last used cannabis or how you feel. Regular users build up THC and may test above the limit a long time after the effect has faded. For that reason there is no reliable rule of thumb for how long to wait, and no responsible source will give you one.</p>

<h2>Fines, bans and points</h2>
<p>The amounts come from the official ${h.src('bkatAnlage', 'fine catalogue')}, numbers 242 to 243b. For THC alone they match the 0.5 per mille alcohol offence, and earlier entries for drink driving count as previous offences just as earlier drug entries do.</p>
${h.table(['Situation', 'Cat. no.', 'Fine', 'Ban', 'Points', 'With fees'], [
  [`THC from ${h.num(A.thc_ng, 1)} ng/ml, first time`, t0.nr, h.eur(t0.fine), `${t0.fv} month`, h.num(t0.points), h.eur(t0.total, 2)],
  ['THC, one earlier entry', t1.nr, h.eur(t1.fine), `${t1.fv} months`, h.num(t1.points), h.eur(t1.total, 2)],
  ['THC, several earlier entries', t2.nr, h.eur(t2.fine), `${t2.fv} months`, h.num(t2.points), h.eur(t2.total, 2)],
  ['THC with alcohol, first time', m0.nr, h.eur(m0.fine), `${m0.fv} month`, h.num(m0.points), h.eur(m0.total, 2)],
  ['THC with alcohol, one earlier entry', m1.nr, h.eur(m1.fine), `${m1.fv} months`, h.num(m1.points), h.eur(m1.total, 2)],
  ['THC with alcohol, several earlier entries', m2.nr, h.eur(m2.fine), `${m2.fv} months`, h.num(m2.points), h.eur(m2.total, 2)],
  ['probation or under 21, any THC', nov.nr, h.eur(nov.fine), 'none', h.num(nov.points), h.eur(nov.total, 2)],
], 'Cannabis and driving under Sections 24a and 24c StVG and the fine catalogue, as amended August 2026', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Every case with a ban carries two points under ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, and they stay on the register for five years. If it is your first ban in two years, you can choose when it starts within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final, which the ${h.a('fahrverbot', 'driving ban page')} explains.</p>

<h2>Cannabis plus alcohol</h2>
<p>Section 24a(2a) adds a total alcohol ban for anyone over the THC limit. You may not drink while driving or start a journey under the influence of alcohol, and no per mille threshold applies. The reason is that the two substances can reinforce each other. The fines are higher from the start, ${h.eur(m0.fine)} for a first offence, and the legal maximum for this offence is also higher than for THC alone. If your alcohol level is at 0.5 per mille or above anyway, the drink-driving rules on the ${h.a('alkohol-am-steuer', 'drink-driving page')} apply as well.</p>

<h2>New drivers and under-21s</h2>
<p>${h.src('stvg24c', 'Section 24c of the Road Traffic Act')} extends the zero rule for new drivers to cannabis. During the ${PZ.jahre}-year probation, and for everyone under ${A.anfaenger_alter}, it is an offence to take THC as a driver or to start driving under its influence. No limit value applies to this group. The fine is ${h.eur(nov.fine)} and ${h.num(nov.points)} point, and on probation it is an A offence with a remedial course and ${PZ.verlaengerung_jahre} more years of probation. Young expats and students should note that a licence from home does not change this; the rule depends on age and on probation, which the ${h.a('probezeit-fuehrerschein', 'probationary licence page')} explains.</p>

<h2>Misconceptions newcomers bring with them</h2>
<ul>
<li><strong>"Possession is legal now, so driving after a joint is fine."</strong> Possession rules and road rules are separate. Driving is governed by its own THC limit in the Road Traffic Act, whatever the possession rules say.</li>
<li><strong>"I feel completely sober."</strong> The offence is defined by the serum level, not by how you feel. A level above ${h.num(A.thc_ng, 1)} ng/ml is an offence even with perfect driving.</li>
<li><strong>"Back home this is legal."</strong> Some countries and US states have different limits or none at all. On German roads, German limits apply to everyone, residents and visitors alike.</li>
<li><strong>"It was a low-THC product."</strong> Products sold as low in THC can still contain measurable amounts. Only the lab value counts.</li>
<li><strong>"One beer is fine below 0.5 per mille."</strong> Not if you are over the THC limit: then no alcohol at all is allowed.</li>
</ul>

<h2>E-scooters, foreign licences and accompanied driving</h2>
<p>Rental e-scooters are motor vehicles, so the THC limit, the zero rule for under-${A.anfaenger_alter}s and the catalogue fines apply to them exactly as to a car. A ban imposed after a scooter ride covers driving a car too. If you drive on a licence from outside the EU, the points are still recorded in Germany, and a ban applies on German roads. Under Section 48a(6) of the Driving Licence Ordinance, the named adult companion in Germany's accompanied driving scheme from 17 may not accompany a young driver with ${h.num(A.thc_ng, 1)} ng/ml of THC or more.</p>

<h2>Other drugs</h2>
<p>For the other substances listed in the annex to Section 24a, Germany takes a stricter line: any detectable amount in the blood counts as being under the influence. Number 243 sets ${h.eur(other.fine!)}, a ${other.fv}-month ban and ${other.points} points for a first offence, with the same steps for earlier entries. Prescribed medicines taken as directed are exempt here too.</p>

<h2>When it becomes a crime</h2>
<p>${h.src('stgb316', 'Section 316 of the Criminal Code')} covers driving under alcohol or other intoxicants. For cannabis there is no fixed value at which a driver is automatically unfit, unlike the 1.1 per mille line for alcohol. A criminal case therefore needs concrete evidence of impairment: driving errors, an accident or clear signs at the check. The penalty is a fine or up to a year in prison, and the licence is normally withdrawn for at least six months.</p>

<h2>The MPU and cannabis</h2>
<p>Section 13a of the Driving Licence Ordinance governs fitness checks after cannabis. It contains no threshold value. A medical report is required where facts suggest dependence; an MPU (medical and psychological assessment) is required where a medical report finds signs of misuse, where facts otherwise suggest misuse, where offences under cannabis influence have been repeated, where a licence was withdrawn for these reasons, or where the authority must check that misuse or dependence has ended. Offences only against the zero rule for new drivers are left out when counting repeats. Misuse here means failing to separate use from driving. A single drive just over the limit does not automatically lead to an MPU; a second one may. See the ${h.a('mpu', 'MPU page')}.</p>
<!--mini:cannabis-->
<h2>At a roadside check</h2>
<p>Police may offer a voluntary preliminary test. If suspicion remains, they can order a blood sample, which is taken by a doctor, often at the police station or a hospital. Lab results take time, so the hearing form arrives weeks later. The fine notice names the catalogue number and the measured value; an objection is possible within ${V.einspruch_wochen} weeks of delivery. The ${h.a('promillerechner', 'blood alcohol and THC calculator')} shows what a given value means.</p>
<p>Besides the fine and the standard fees, the notice can list expenses for taking and analysing the blood sample, which can add a noticeable sum. If a ban follows, plan for the months without a car; a first ban in two years can be timed within the window described above. Since July 2026, an offence of this kind becomes time-barred after six months unless the authority interrupts that period, usually by sending the hearing form once the lab result is in.</p>`,
  },
});
