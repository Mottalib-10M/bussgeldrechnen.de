import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { alcohol } from '../../lib/engine/bkat';
import { formatDecimal } from '../../lib/format';

const A = P.alkohol, PZ = P.probezeit;
const owi = alcohol({ promille: A.promille_owi, priorEntries: 0, novice: false });
const nov = alcohol({ promille: 0.1, priorEntries: 0, novice: true });
const dD = (x: number) => formatDecimal(x, 2, 'de'), dE = (x: number) => formatDecimal(x, 2, 'en');

export default defineGuide({
  id: 'promillegrenze',
  group: 'verstoesse',
  order: 50,
  mini: 'promillegrenze',
  miniHref: 'promillerechner',
  related: ['alkohol-am-steuer', 'promillerechner', 'probezeit-fuehrerschein', 'mpu', 'cannabis-am-steuer'],
  sources: ['stvg24a', 'stvg24c', 'propk', 'stgb316', 'fev13'],
  de: {
    slug: 'promillegrenze',
    nav: 'Promillegrenze',
    card: 'Welche Promillegrenze für wen gilt: Auto, E-Scooter, Fahrrad, Fahranfänger.',
    title: 'Promillegrenze 2026: alle Grenzen von 0,0 bis 1,6 Promille',
    description: `Promillegrenze 2026: 0,0 ‰ für Fahranfänger und unter 21, ab 0,3 ‰ Strafbarkeit bei Fahrfehlern, ${dD(A.promille_owi)} ‰ Bußgeld, 1,1 ‰ Straftat, 1,6 ‰ für Radfahrer und MPU.`,
    h1: 'Promillegrenze: welche Grenze für wen gilt',
    intro: 'In Deutschland gibt es nicht eine Promillegrenze, sondern fünf, und welche zählt, hängt vom Fahrzeug, vom Alter und vom Führerschein ab.',
    resume: `Die bekannteste Promillegrenze liegt bei ${dD(A.promille_owi)} Promille oder ${dD(A.aak_owi)} mg/l Atemalkohol und gilt für alle Menschen, die ein Kraftfahrzeug führen, also Auto, Motorrad und E-Scooter. Wer sie erreicht, begeht schon ohne jede Auffälligkeit eine Ordnungswidrigkeit nach § 24a StVG. Darunter liegt die Schwelle von ${dD(A.relativ_promille)} Promille, ab der bei Fahrfehlern oder einem Unfall schon eine Straftat vorliegen kann, und für Fahranfänger in der Probezeit sowie alle unter ${A.anfaenger_alter} Jahren gilt praktisch null: Sie dürfen weder vor noch während der Fahrt trinken. Ab ${dD(A.straftat_promille)} Promille ist jeder Kraftfahrer absolut fahruntüchtig, ab ${dD(A.mpu_promille)} Promille ordnet die Behörde eine MPU an. Radfahrer haben keine 0,5-Grenze, weil das Fahrrad kein Kraftfahrzeug ist; für sie wird die Fahrt erst ab ${dD(A.rad_straftat_promille)} Promille strafbar, bei auffälliger Fahrweise schon ab ${dD(A.relativ_promille)}.`,
    faqs: [
      { q: 'Welche Promillegrenze gilt für Radfahrer in Deutschland?', a: `Für Radfahrer gibt es keine Bußgeldgrenze wie die ${dD(A.promille_owi)} Promille beim Auto, weil § 24a StVG nur Kraftfahrzeuge erfasst. Strafbar nach § 316 StGB wird es ab ${dD(A.rad_straftat_promille)} Promille, dem Wert der absoluten Fahruntüchtigkeit für Radfahrer. Wer darunter in Schlangenlinien fährt oder stürzt, kann schon ab ${dD(A.relativ_promille)} Promille belangt werden. Ab ${dD(A.mpu_promille)} Promille folgt zudem eine MPU-Anordnung.` },
      { q: 'Gilt die 0,5-Promille-Grenze auch für E-Scooter?', a: `Ja. E-Scooter sind Kraftfahrzeuge, deshalb gelten für sie dieselben Grenzen wie für das Auto: ${dD(A.promille_owi)} Promille für das Bußgeld von ${owi.fine} Euro mit Fahrverbot, ${dD(A.straftat_promille)} Promille für die Straftat und null für Fahranfänger und unter ${A.anfaenger_alter} Jahren. Pedelecs mit Tretunterstützung bis 25 km/h zählen dagegen rechtlich als Fahrräder.` },
      { q: 'Wie viel Promille darf die Begleitperson beim Führerschein mit 17 haben?', a: `Weniger als ${dD(A.promille_owi)} Promille. § 48a Abs. 6 FeV verbietet das Begleiten mit ${dD(A.aak_owi)} mg/l Atemalkohol, ${dD(A.promille_owi)} Promille im Blut oder mehr und ebenso ab ${dD(A.thc_ng)} ng/ml THC. Für den Fahrer selbst gilt als Jugendlichem unter ${A.anfaenger_alter} Jahren das absolute Alkoholverbot des § 24c StVG; schon ein Glas vor der Fahrt kostet ${nov.fine} Euro und einen Punkt.` },
      { q: 'Heißt die Grenze für Fahranfänger wirklich 0,0 Promille?', a: `Im Gesetz steht keine Zahl. § 24c StVG verbietet, während der Fahrt ein alkoholisches Getränk zu sich zu nehmen oder die Fahrt unter der Wirkung eines solchen Getränks anzutreten. Umgangssprachlich wird daraus die 0,0-Promille-Grenze. Wer am Abend getrunken hat, muss also bis zum vollständigen Abbau warten; Restalkohol am Morgen ist ebenso ein Verstoß mit ${nov.fine} Euro und einem Punkt.` },
    ],
    body: (h) => `
<h2>Die fünf Grenzen auf einen Blick</h2>
<p>Die Schwellen stammen aus zwei Quellen. Das Straßenverkehrsgesetz nennt ausdrücklich die ${h.num(A.promille_owi, 1)} Promille in § 24a und das Alkoholverbot für Fahranfänger in § 24c. Die Werte 0,3, 1,1 und 1,6 hat dagegen die Rechtsprechung zu § 316 StGB entwickelt; die ${h.src('propk', 'Polizeiliche Kriminalprävention')} führt sie in ihren Hinweisen auf. Die 1,6 kehrt außerdem in § 13 der Fahrerlaubnis-Verordnung als MPU-Schwelle wieder. Wer betroffen ist, zeigt die folgende Übersicht.</p>
${h.table(['Grenze', 'Pkw, Motorrad, E-Scooter', 'Fahranfänger, unter 21', 'Fahrrad, Pedelec'], [
  ['0,0 ‰', 'keine Folge', `verboten: ${h.eur(nov.fine)}, 1 Punkt`, 'keine Folge'],
  [`${h.num(A.relativ_promille, 1)} ‰`, 'Straftat bei Fahrfehlern', 'Straftat bei Fahrfehlern', 'Straftat bei Fahrfehlern'],
  [`${h.num(A.promille_owi, 1)} ‰ oder ${h.num(A.aak_owi, 2)} mg/l`, `Bußgeld ${h.eur(owi.fine)}, Fahrverbot`, `Bußgeld ${h.eur(owi.fine)}, Fahrverbot`, 'keine eigene Grenze'],
  [`${h.num(A.straftat_promille, 1)} ‰`, 'Straftat, immer', 'Straftat, immer', 'Straftat bei Fahrfehlern'],
  [`${h.num(A.mpu_promille, 1)} ‰ oder ${h.num(A.mpu_aak, 1)} mg/l`, 'Straftat, MPU', 'Straftat, MPU', 'Straftat, immer; MPU'],
], 'Promillegrenzen nach Fahrzeug und Fahrer, StVG, StGB und FeV', ['l', 'l', 'l', 'l'])}
<p>Was die einzelnen Stufen im Detail kosten, also Bußgelder bei Wiederholung, Sperrfristen und Punkte, steht auf der Seite zu ${h.a('alkohol-am-steuer', 'Alkohol am Steuer')}. Hier geht es darum, wo die Linien verlaufen und für wen.</p>

<h2>0,0 Promille: Fahranfänger und alle unter 21</h2>
<p>Das Alkoholverbot des ${h.src('stvg24c', '§ 24c StVG')} trifft zwei Gruppen. Erstens alle, die sich in der Probezeit befinden, also in den ersten ${PZ.jahre} Jahren nach dem ersten Führerschein; nach einem Aufbauseminar verlängert sich diese Zeit um ${PZ.verlaengerung_jahre} Jahre, und das Verbot läuft mit. Zweitens alle, die das ${A.anfaenger_alter}. Lebensjahr noch nicht vollendet haben, unabhängig davon, wie lange sie schon fahren. Wer mit 17 im begleiteten Fahren beginnt, ist also bis zum ${A.anfaenger_alter}. Geburtstag gebunden; wer mit 30 den ersten Führerschein macht, zwei Jahre lang.</p>
<p>Das Verbot gilt nur für Kraftfahrzeuge. Wer in der Probezeit nach einem Bier aufs Fahrrad steigt, verstößt nicht gegen § 24c. Für zugezogene Fahrer mit einem EU-Führerschein, der jünger als zwei Jahre ist, gilt die Probezeit mit der verbleibenden Dauer, und damit auch die Nullgrenze. Mehr dazu auf der Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>0,3 Promille: die relative Fahruntüchtigkeit</h2>
<p>Ab 0,3 Promille kann eine Straftat vorliegen, aber nicht automatisch. Es braucht zusätzlich ein Indiz dafür, dass der Alkohol die Fahrweise beeinträchtigt hat: Schlangenlinien, Abkommen von der Fahrbahn, ein Auffahrunfall, auffällig verzögerte Reaktionen bei der Kontrolle. Diese Schwelle gilt für alle Fahrzeuge, auch für das Fahrrad. Sie ist der Grund, warum die bekannte 0,5-Grenze kein „sicherer“ Wert ist: Wer mit 0,4 Promille einen Unfall verursacht, steht im Strafrecht, obwohl er die Bußgeldgrenze nicht erreicht hat.</p>

<h2>0,5 Promille und 0,25 mg/l: die Bußgeldgrenze</h2>
<p>${h.src('stvg24a', '§ 24a Abs. 1 StVG')} nennt zwei gleichwertige Werte: ${h.num(A.promille_owi, 1)} Promille im Blut oder ${h.num(A.aak_owi, 2)} Milligramm Alkohol je Liter Atemluft. Als Beweis reicht hier eine Messung mit einem geeichten Atemalkoholgerät; Blut muss dafür nicht abgenommen werden. Die Grenze gilt für Kraftfahrzeuge, also für Pkw, Lkw, Motorräder, Mofas, E-Scooter und S-Pedelecs mit Motorunterstützung bis 45 km/h. Ausfallerscheinungen spielen keine Rolle: Der Wert allein löst ${h.eur(owi.fine)}, ein Monat Fahrverbot und zwei Punkte aus.</p>
<p>Ein Sonderfall ist das begleitete Fahren ab 17. Nach § 48a Abs. 6 FeV darf die eingetragene Begleitperson nicht begleiten, wenn sie selbst ${h.num(A.promille_owi, 1)} Promille oder ${h.num(A.aak_owi, 2)} mg/l erreicht oder ${h.num(A.thc_ng, 1)} ng/ml THC im Blut hat. Für sie gilt also dieselbe Grenze, als säße sie selbst am Steuer.</p>

<h2>1,1 Promille: absolute Fahruntüchtigkeit am Steuer</h2>
<p>Ab ${h.num(A.straftat_promille, 1)} Promille nimmt die Rechtsprechung bei allen Kraftfahrern ohne weiteren Beweis an, dass sie nicht mehr sicher fahren können. Die Fahrt ist dann eine Straftat nach ${h.src('stgb316', '§ 316 StGB')}, auch wenn niemand etwas bemerkt hat und die Fahrt nur wenige Meter dauerte. Für E-Scooter-Fahrer gilt dieselbe Schwelle, weil sie ein Kraftfahrzeug führen. Für Radfahrer liegt sie höher.</p>

<h2>1,6 Promille: Radfahrer und die MPU</h2>
<p>Die Zahl 1,6 hat zwei Bedeutungen. Für Radfahrer ist sie die Grenze der absoluten Fahruntüchtigkeit: Darüber ist jede Fahrt strafbar, darunter nur bei Fahrfehlern ab 0,3 Promille. Und für alle gilt nach ${h.src('fev13', '§ 13 FeV')}: Wer ein Fahrzeug mit ${h.num(A.mpu_promille, 1)} Promille oder ${h.num(A.mpu_aak, 1)} mg/l Atemalkohol oder mehr geführt hat, muss vor der Erteilung oder Wiedererteilung einer Fahrerlaubnis ein medizinisch-psychologisches Gutachten vorlegen. Das Wort „Fahrzeug“ schließt das Fahrrad ein. Eine Radtour nach dem Fest mit 1,7 Promille kann deshalb dazu führen, dass die Behörde den Autoführerschein überprüft. Die Seite zur ${h.a('mpu', 'MPU')} beschreibt, wie das abläuft.</p>
<!--mini:promillegrenze-->
<h2>Promille, Atemalkohol und warum es zwei Werte gibt</h2>
<p>Promille misst Gramm Alkohol pro Kilogramm Blut, der Atemalkoholwert Milligramm pro Liter Atemluft. Beide hängen zusammen, sind aber nicht beliebig austauschbar. Das Gesetz hat deshalb bei der Bußgeldgrenze und bei der MPU-Schwelle jeweils beide Größen eigens festgelegt: ${h.num(A.promille_owi, 1)} Promille entsprechen dort ${h.num(A.aak_owi, 2)} mg/l, ${h.num(A.mpu_promille, 1)} Promille entsprechen ${h.num(A.mpu_aak, 1)} mg/l. Für die Strafbarkeitsgrenzen von 0,3 und 1,1 Promille gibt es kein gesetzliches Gegenstück in mg/l; hier stützen sich die Gerichte in der Regel auf eine Blutprobe.</p>
<p>Wer seinen Wert schätzen will, sollte wissen, dass Faustformeln aus Getränkemenge und Körpergewicht nur grobe Anhaltspunkte liefern. Der ${h.a('promillerechner', 'Promillerechner')} geht deshalb vom Wert aus und zeigt, welche der fünf Linien er überschreitet.</p>

<h2>Und Cannabis?</h2>
<p>Für THC gibt es einen eigenen Grenzwert von ${h.num(A.thc_ng, 1)} ng/ml im Blutserum, der wie die 0,5-Promille-Grenze in § 24a StVG steht. Wer beides kombiniert, für den gilt ab diesem Wert ein vollständiges Alkoholverbot am Steuer. Auch hier sind Fahranfänger und Personen unter ${A.anfaenger_alter} Jahren strenger gestellt: Für sie gilt null. Die Regeln im Einzelnen stehen bei ${h.a('cannabis-am-steuer', 'Cannabis am Steuer')}.</p>

<h2>Fünf Fälle aus dem Alltag</h2>
<ul>
<li><strong>Die 20-Jährige mit drei Jahren Fahrpraxis</strong> hat die Probezeit hinter sich, ist aber noch keine ${A.anfaenger_alter}. Für sie gilt null. Ein Glas Sekt beim Geburtstag und danach die Heimfahrt kosten ${h.eur(nov.fine)} und einen Punkt.</li>
<li><strong>Der 28-Jährige, der mit einem ein Jahr alten Führerschein aus Frankreich nach Köln zieht</strong>, ist für das verbleibende Jahr in der Probezeit und damit ebenfalls an die Nullgrenze gebunden.</li>
<li><strong>Die 45-Jährige mit 0,4 Promille</strong>, die beim Ausparken ein anderes Auto streift, liegt unter der Bußgeldgrenze. Der Unfall kann aber als alkoholbedingter Fahrfehler gewertet werden, und dann geht es um § 316 StGB.</li>
<li><strong>Der Radfahrer mit 1,2 Promille</strong>, der geradeaus und unauffällig fährt, begeht nach den Schwellen weder eine Ordnungswidrigkeit noch eine Straftat. Stürzt er oder fährt Schlangenlinien, sieht das anders aus.</li>
<li><strong>Der E-Scooter-Fahrer mit 0,6 Promille</strong> nach dem Stadtfest zahlt ${h.eur(owi.fine)}, bekommt zwei Punkte und einen Monat Fahrverbot, das auch für sein Auto gilt.</li>
</ul>
<p>Die Beispiele zeigen, dass die Frage „Wie viel darf ich trinken?“ ohne Alter, Führerscheindauer und Fahrzeug nicht zu beantworten ist. Für die meisten Erwachsenen bleibt die einfachste Regel, nach dem Trinken gar nicht zu fahren.</p>

<h2>Berufskraftfahrer und Dienstwagen</h2>
<p>Für Lkw-, Bus- und Taxifahrer nennt das Straßenverkehrsgesetz keine eigene, niedrigere Grenze; für sie gelten dieselben fünf Linien wie für alle anderen. In der Praxis verlangen viele Arbeitgeber, Dienstwagenregelungen und Betriebsvereinbarungen aber null Promille während der Arbeitszeit. Ein Verstoß dagegen ist dann keine Ordnungswidrigkeit, kann aber arbeitsrechtliche Folgen haben. Wer beruflich fährt, verliert mit einem Fahrverbot oder einer Entziehung zudem häufig die Grundlage seiner Tätigkeit.</p>

<h2>Wer keiner Grenze unterliegt</h2>
<p>Fußgänger haben keinen Promillegrenzwert im Verkehrsrecht. Wer betrunken eine Straße überquert und einen Unfall verursacht, haftet aber zivilrechtlich und kann sich je nach Lage wegen anderer Delikte strafbar machen. Auch Beifahrer unterliegen keiner Grenze, es sei denn, sie sind als Begleitperson beim Fahren ab 17 eingetragen. Fahrlehrer gelten bei Ausbildungsfahrten als Führer des Fahrzeugs und unterliegen damit denselben Grenzen wie der Fahrer am Steuer.</p>`,
  },
  en: {
    slug: 'alcohol-limit-germany',
    nav: 'Alcohol limit',
    card: 'Which blood alcohol limit applies to whom: car, e-scooter, bicycle, new drivers.',
    title: 'Alcohol Limit Germany 2026: 0.0 to 1.6 Per Mille Explained',
    description: `Alcohol limit in Germany 2026: zero for new drivers and under-21s, 0.3 with impaired driving, ${dE(A.promille_owi)} per mille for a fine, 1.1 for a crime, 1.6 for cyclists.`,
    h1: 'The alcohol limits in Germany: which one applies to you',
    intro: 'Germany has five alcohol thresholds rather than one, and the one that counts depends on your vehicle, your age and how long you have held a licence.',
    resume: `The main drink-driving limit in Germany is ${dE(A.promille_owi)} per mille in the blood, or ${dE(A.aak_owi)} mg/l in breath, and it applies to anyone driving a motor vehicle: a car, a motorbike or an e-scooter. Below it, there is a lower line at ${dE(A.relativ_promille)} per mille, from which a criminal case is possible if you drive erratically or cause an accident. Drivers in their ${PZ.jahre}-year probation and everyone under ${A.anfaenger_alter} must not drink at all before or while driving, which is usually described as a zero limit. From ${dE(A.straftat_promille)} per mille every driver of a motor vehicle is treated as unfit to drive, and from ${dE(A.mpu_promille)} the licensing authority orders an MPU assessment. Cyclists have no ${dE(A.promille_owi)} limit; for them, riding becomes a crime at ${dE(A.rad_straftat_promille)} per mille, or from ${dE(A.relativ_promille)} with unsafe riding. For comparison, ${dE(A.promille_owi)} per mille equals 50 mg per 100 ml of blood.`,
    faqs: [
      { q: 'What is the alcohol limit for cycling in Germany?', a: `There is no fine-based limit for cyclists, because the ${dE(A.promille_owi)} rule covers only motor vehicles. Cycling becomes a crime at ${dE(A.rad_straftat_promille)} per mille, or from ${dE(A.relativ_promille)} if you ride unsafely or fall. A ride at ${dE(A.mpu_promille)} or more also leads to an MPU order, which can affect your car licence. Ordinary e-bikes assisting up to 25 km/h count as bicycles.` },
      { q: 'Can I drink one beer and drive in Germany?', a: `If you are over ${A.anfaenger_alter} and past your probation, one beer usually keeps you below ${dE(A.promille_owi)} per mille, but there is no guarantee, and from ${dE(A.relativ_promille)} a crash or erratic driving can make it a crime. If you are under ${A.anfaenger_alter} or in your first ${PZ.jahre} years of driving, any amount is an offence costing ${nov.fine} euros and a point.` },
      { q: 'Does the German zero alcohol rule apply to my licence from abroad?', a: `It depends on your age and how long you have held a licence. Everyone under ${A.anfaenger_alter} is covered whatever licence they hold. If you move to Germany with an EU licence less than ${PZ.jahre} years old, you are on probation for the remaining time and the zero rule applies. Drivers visiting with an older licence are bound by the ${dE(A.promille_owi)} per mille limit.` },
      { q: 'Is the alcohol limit for e-scooters in Germany the same as for cars?', a: `Yes. E-scooters are motor vehicles under German law, so riders face the same limits: ${dE(A.promille_owi)} per mille for a fine of ${owi.fine} euros with a driving ban, ${dE(A.straftat_promille)} for a crime, and zero for under-${A.anfaenger_alter}s and new drivers. A conviction on a scooter can cost you your car licence too.` },
    ],
    body: (h) => `
<h2>Five lines, not one</h2>
<p>Visitors often ask what "the" German limit is. The honest answer is that there are several. Two come from the Road Traffic Act: the ${h.num(A.promille_owi, 1)} per mille line in Section 24a and the zero rule for new drivers in Section 24c. The 0.3, 1.1 and 1.6 lines were developed by the courts when applying Section 316 of the Criminal Code, and the ${h.src('propk', 'German police prevention programme')} lists them in its guidance. The 1.6 line also appears in the Driving Licence Ordinance as the trigger for an MPU.</p>
${h.table(['Line', 'Car, motorbike, e-scooter', 'New driver or under 21', 'Bicycle, e-bike'], [
  ['zero', 'no consequence', `offence: ${h.eur(nov.fine)}, 1 point`, 'no consequence'],
  [`${h.num(A.relativ_promille, 1)} per mille`, 'crime if driving impaired', 'crime if driving impaired', 'crime if riding impaired'],
  [`${h.num(A.promille_owi, 1)} per mille / ${h.num(A.aak_owi, 2)} mg/l`, `fine ${h.eur(owi.fine)}, ban`, `fine ${h.eur(owi.fine)}, ban`, 'no specific limit'],
  [`${h.num(A.straftat_promille, 1)} per mille`, 'crime in every case', 'crime in every case', 'crime if riding impaired'],
  [`${h.num(A.mpu_promille, 1)} per mille / ${h.num(A.mpu_aak, 1)} mg/l`, 'crime, MPU', 'crime, MPU', 'crime in every case, MPU'],
], 'Who is affected by which alcohol limit in Germany', ['l', 'l', 'l', 'l'])}
<p>This page is about where the lines fall and whom they bind. The fines for repeat offences, the period without a licence after a conviction and the points are covered on the ${h.a('alkohol-am-steuer', 'drink-driving penalties page')}.</p>

<h2>Units: per mille, per cent and mg/l</h2>
<p>Germany states blood alcohol in per mille (Promille), grams of alcohol per kilogram of blood. ${h.num(A.promille_owi, 1)} per mille is 0.05 per cent, or 50 mg per 100 ml, A limit quoted at home in milligrams per 100 millilitres or in per cent can be converted this way; check your home country's rule in its official source rather than in a summary. Breath readings are given in milligrams per litre. For the fine limit and the MPU threshold, the law sets both values side by side: ${h.num(A.aak_owi, 2)} mg/l alongside ${h.num(A.promille_owi, 1)} per mille, and ${h.num(A.mpu_aak, 1)} mg/l alongside ${h.num(A.mpu_promille, 1)}. The criminal thresholds have no breath equivalent, which is why a blood sample is taken in criminal cases. If you are used to reading a breathalyser at home in a different unit, convert before you compare, and remember that a home device is no evidence for a German authority.</p>

<h2>The zero rule: who exactly</h2>
<p>${h.src('stvg24c', 'Section 24c of the Road Traffic Act')} covers two groups. The first is everyone in the probation period (Probezeit), the first ${PZ.jahre} years after a first licence, extended by ${PZ.verlaengerung_jahre} years after a remedial course. The second is everyone under ${A.anfaenger_alter}, however long they have been driving. The text has no number; it forbids drinking while driving and starting a drive under the influence of alcohol. "Zero" is the practical result.</p>
<p>For newcomers, this has a twist. If you passed your test in another EU country less than ${PZ.jahre} years before moving, German probation applies for the remaining time, and with it the zero rule. The ${h.a('probezeit-fuehrerschein', 'probationary licence page')} explains how the remaining time is worked out. The rule covers motor vehicles only, so a new driver on a bicycle is bound by the general cycling lines instead.</p>

<h2>0.3: the line that catches people out</h2>
<p>Many drivers treat 0.5 as a safe ceiling. It is not. From 0.3 per mille, a criminal case is possible if there is evidence that alcohol affected the driving: drifting across lanes, hitting a parked car, slow reactions at a check. The line applies to every vehicle, including bicycles. A minor accident at 0.4 can therefore end in court even though no fine limit was reached.</p>

<h2>0.5 and the accompanied driver</h2>
<p>${h.src('stvg24a', 'Section 24a')} applies to all motor vehicles: cars, vans, motorbikes, mopeds, e-scooters and fast e-bikes with assistance up to 45 km/h. Reaching the limit is enough for ${h.eur(owi.fine)}, a one-month ban and two points, without any sign of impairment. A breath test on approved equipment at the police station is sufficient evidence for this offence.</p>
<p>Families using Germany's accompanied driving scheme from age 17 should know that the named adult companion is bound too. Under Section 48a(6) of the Driving Licence Ordinance, the companion may not accompany the young driver with ${h.num(A.promille_owi, 1)} per mille, ${h.num(A.aak_owi, 2)} mg/l or ${h.num(A.thc_ng, 1)} ng/ml of THC or more.</p>

<h2>1.1 and 1.6: absolute unfitness and the MPU</h2>
<p>From ${h.num(A.straftat_promille, 1)} per mille, anyone driving a motor vehicle is treated as unable to drive safely, with no further proof needed; driving is then a crime under ${h.src('stgb316', 'Section 316 of the Criminal Code')}. For cyclists the same line sits at ${h.num(A.rad_straftat_promille, 1)}. Separately, ${h.src('fev13', 'Section 13 of the Driving Licence Ordinance')} requires an MPU from anyone who drove "a vehicle" at ${h.num(A.mpu_promille, 1)} per mille or ${h.num(A.mpu_aak, 1)} mg/l or more. A bicycle is a vehicle, so a late ride home at 1.7 can lead to the authority reviewing your car licence. The ${h.a('mpu', 'MPU page')} explains the assessment.</p>
<!--mini:promillegrenze-->
<h2>Cannabis and mixed use</h2>
<p>THC has its own limit of ${h.num(A.thc_ng, 1)} ng/ml in blood serum, also in Section 24a. Above it, any alcohol at the wheel is banned, with higher fines than for alcohol alone, and under-${A.anfaenger_alter}s and new drivers must have no THC at all. See the ${h.a('cannabis-am-steuer', 'cannabis driving page')}.</p>

<h2>Five people, five answers</h2>
<ul>
<li><strong>A 20-year-old exchange student driving on a US licence</strong> is under ${A.anfaenger_alter}, so the zero rule applies whatever the home state allows. One beer before driving means ${h.eur(nov.fine)} and a point.</li>
<li><strong>A 29-year-old engineer who moved from Madrid with an 18-month-old licence</strong> is on probation for the remaining six months and bound by the zero rule until it ends.</li>
<li><strong>A 50-year-old manager at 0.4 per mille</strong> who clips a bollard leaving a restaurant car park is below the fine limit, but the collision can be treated as an alcohol-related driving error under the criminal law.</li>
<li><strong>A commuter on a rental e-scooter at 0.7 after a beer festival</strong> pays ${h.eur(owi.fine)}, gets two points and a one-month ban that covers the car as well.</li>
<li><strong>A parent acting as the named companion for a 17-year-old</strong> must stay below ${h.num(A.promille_owi, 1)} per mille, or the young driver is driving without a valid companion.</li>
</ul>
<p>The question "how much can I drink?" has no single answer in Germany. It depends on age, licence history and vehicle, which is why many residents simply separate drinking from driving altogether.</p>

<h2>Professional drivers and company cars</h2>
<p>German road traffic law has no separate, lower limit for lorry, bus or taxi drivers; the same five lines apply to them. Employers often go further. Company car policies and works agreements commonly set a zero rule during working hours, and breaking it can lead to a warning or dismissal even when no fine is due. If your contract comes with a car, read that clause, because it is easy to assume the national limit is the only one that matters. For anyone who drives for a living, a ban or the loss of a licence is also a direct threat to the job, which is one more reason the thresholds deserve a margin.</p>

<h2>Pedestrians and passengers</h2>
<p>German traffic law sets no alcohol limit for pedestrians or ordinary passengers. That does not remove liability: a drunk pedestrian who causes a crash can be held responsible for the damage. Passengers become relevant only as a named companion in accompanied driving. To check what a specific reading means, use the ${h.a('promillerechner', 'blood alcohol calculator')}, which starts from the value rather than from a list of drinks.</p>`,
  },
});
