import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber } from '../../lib/format';

const A = P.alkohol;
const K = P.punkte;
const F = P.fuehrerschein;
const pd = (x: number) => formatNumber(x, 1, 'de');
const pe = (x: number) => formatNumber(x, 1, 'en');

export default defineGuide({
  id: 'mpu',
  group: 'punkte',
  order: 50,
  mini: 'mpu',
  miniHref: 'fuehrerschein-kosten',
  related: ['alkohol-am-steuer', 'cannabis-am-steuer', 'punkte-in-flensburg', 'probezeit-fuehrerschein', 'fuehrerschein-kosten', 'promillegrenze'],
  sources: ['fev13', 'stvg4', 'gebost', 'stvg2a'],
  de: {
    slug: 'mpu',
    nav: 'MPU',
    card: 'Wann die medizinisch-psychologische Untersuchung angeordnet wird, wer sie macht und was sie kostet.',
    title: 'MPU 2026: wann sie angeordnet wird und was sie kostet',
    description: `MPU 2026: Pflicht ab ${pd(A.mpu_promille)} Promille, bei wiederholtem Alkohol oder Cannabis, meist nach ${K.entzug_ab} Punkten. Preise legen die Stellen fest, Neuerteilung ab ${formatMoney(F.neuerteilung_min, 2, 'de')}.`,
    h1: 'MPU: Anlass, Ablauf und Kosten der Fahreignungsbegutachtung',
    intro: 'Die MPU ist keine Strafe, sondern ein Gutachten, das die Fahrerlaubnisbehörde verlangt, wenn sie an der Eignung zweifelt.',
    resume: `Die MPU, die medizinisch-psychologische Untersuchung, ist ein Gutachten einer amtlich anerkannten Begutachtungsstelle für Fahreignung, das die Fahrerlaubnisbehörde anordnet, wenn sie an der Eignung zum Führen von Kraftfahrzeugen zweifelt. Zwingend ist sie nach § 13 FeV, wenn jemand mit ${pd(A.mpu_promille)} Promille oder ${pd(A.mpu_aak)} mg/l Atemalkohol oder mehr gefahren ist, wenn wiederholt Verstöße unter Alkohol vorliegen oder die Fahrerlaubnis deswegen entzogen war; für Cannabis (§ 13a) und andere Drogen (§ 14) gelten eigene Anlässe. Nach dem Entzug bei ${K.entzug_ab} Punkten verlangt die Behörde sie in der Regel (§ 4 Abs. 10 StVG), ebenso bei erneuten Verstößen in einer neuen Probezeit. Die Untersuchung bezahlen Sie selbst, und einen amtlichen Preis gibt es seit dem Wegfall des alten Gebührentarifs nicht mehr: Die Begutachtungsstellen legen ihn fest. Amtlich ist nur die Gebühr der Behörde für die Neuerteilung, ${formatMoney(F.neuerteilung_min, 2, 'de')} bis ${formatMoney(F.neuerteilung_max, 2, 'de')}. Wer das Gutachten nicht fristgerecht vorlegt, gilt als ungeeignet.`,
    faqs: [
      { q: 'Ab welchem Promillewert ordnet die Fahrerlaubnisbehörde zwingend eine MPU an?', a: `Ab ${pd(A.mpu_promille)} Promille Blutalkohol oder ${pd(A.mpu_aak)} mg/l Atemalkohol, so steht es in § 13 Satz 1 Nr. 2 Buchstabe c FeV. Das gilt für jedes Fahrzeug, also auch für das Fahrrad. Unterhalb dieses Werts kann eine MPU trotzdem folgen, etwa bei wiederholten Verstößen unter Alkoholeinfluss oder wenn sonst Tatsachen auf Alkoholmissbrauch hindeuten. Verstöße allein gegen das Alkoholverbot für Fahranfänger zählen dabei nicht als Wiederholung.` },
      { q: 'Was passiert, wenn ich das MPU-Gutachten nicht fristgerecht vorlege?', a: 'Dann darf die Behörde nach § 11 Abs. 8 FeV auf Ihre Nichteignung schließen. In der Praxis heißt das: Die Fahrerlaubnis wird entzogen oder ein Antrag auf Neuerteilung abgelehnt. Gleiches gilt, wenn Sie die Untersuchung verweigern. Auf diese Folge muss die Behörde schon in der Anordnung hinweisen, und dort steht auch die Frist, die sie Ihnen gesetzt hat.' },
      { q: 'Darf ich die Begutachtungsstelle für die MPU selbst auswählen?', a: 'Ja, im Rahmen dessen, was die Behörde nennt. Nach § 11 Abs. 6 FeV gibt die Anordnung die in Betracht kommenden Stellen an. Sie beauftragen eine davon selbst und teilen der Behörde mit, welche es ist; die Behörde schickt dann die Fragestellung und die Unterlagen dorthin. Weil Sie Auftraggeber sind, erhalten Sie das Gutachten und entscheiden, ob Sie es vorlegen.' },
      { q: 'Gibt es einen amtlichen Preis für die MPU?', a: `Nein. Die Gebührenordnung für Maßnahmen im Straßenverkehr enthielt früher Sätze für die medizinisch-psychologische Untersuchung; diese Nummern sind weggefallen. § 6f StVG würde es dem Verkehrsministerium erlauben, Entgelte per Verordnung festzusetzen; einen geltenden Tarif enthält die GebOSt nicht mehr. Die Stellen nennen ihre Preise selbst. Amtlich sind nur die Behördengebühren, etwa ${formatMoney(F.neuerteilung_min, 2, 'de')} bis ${formatMoney(F.neuerteilung_max, 2, 'de')} für die Neuerteilung.` },
      { q: 'Muss ich nach acht Punkten in Flensburg immer zur MPU?', a: `Nicht ausnahmslos, aber in aller Regel. § 4 Abs. 10 StVG sagt, dass die Behörde zum Nachweis der wiederhergestellten Eignung „in der Regel“ ein Gutachten einer Begutachtungsstelle für Fahreignung anordnet. Vorher gilt eine Sperre: Eine neue Fahrerlaubnis gibt es frühestens ${K.neuerteilung_sperre_monate} Monate nach Abgabe des Führerscheins. Ein Kurs zur Wiederherstellung der Eignung ersetzt die MPU in diesem Fall nicht.` },
    ],
    body: (h) => `
<h2>Was die MPU ist</h2>
<p>Hinter der Abkürzung steht ein Gutachten, kein Test im Sinne einer Prüfung mit Punktzahl. Die Fahrerlaubnis-Verordnung nennt es medizinisch-psychologisches Gutachten einer amtlich anerkannten Begutachtungsstelle für Fahreignung (§ 11 Abs. 3 FeV). Ein Arzt und ein Psychologe untersuchen, ob die Zweifel an Ihrer Eignung berechtigt sind, und beantworten dabei genau die Fragen, die die Behörde gestellt hat. Die Anlage 4a der FeV stellt klar, dass nicht die gesamte Persönlichkeit Gegenstand ist, sondern nur Eigenschaften und Verhaltensweisen, die für das Fahren eine Rolle spielen.</p>
<p>Maßstab der Begutachtung sind die Begutachtungsleitlinien zur Kraftfahreignung, auf die Anlage 4a verweist, in der Fassung vom 12. Dezember 2025. Sie beschreiben für jede Fragestellung, welche Befunde für oder gegen die Eignung sprechen. Die Untersuchung darf nur nach anerkannten wissenschaftlichen Grundsätzen erfolgen, der Gutachter muss Sie vorab über Gegenstand und Zweck aufklären und Aufzeichnungen anfertigen.</p>
<p>Die Stellen brauchen eine amtliche Anerkennung der nach Landesrecht zuständigen Behörde, die auf höchstens zehn Jahre befristet ist (§ 66 FeV). Gutachter dürfen nicht mit Unternehmen verbunden sein, die auf die Begutachtung vorbereiten oder Kurse zur Wiederherstellung der Eignung anbieten, und solche Leistungen auch nicht selbst anbieten. Vorbereitung und Begutachtung sind also strikt getrennt.</p>

<h2>Wann die Behörde sie anordnet</h2>
<p>Man unterscheidet Fälle, in denen die Behörde die MPU anordnen muss, und solche, in denen sie es kann. Die wichtigsten Anlässe:</p>
${h.table(['Anlass', 'Rechtsgrundlage', 'Anordnung'], [
  [`Fahrt mit ${h.num(A.mpu_promille, 1)} Promille oder ${h.num(A.mpu_aak, 1)} mg/l Atemalkohol oder mehr`, '§ 13 Satz 1 Nr. 2 c FeV', 'zwingend'],
  ['Wiederholte Verstöße unter Alkoholeinfluss (ohne reine Fahranfänger-Verstöße)', '§ 13 Satz 1 Nr. 2 b FeV', 'zwingend'],
  ['Anzeichen für Alkoholmissbrauch, Entziehung wegen Alkohol', '§ 13 Satz 1 Nr. 2 a, d, e FeV', 'zwingend'],
  ['Cannabismissbrauch, wiederholte Verstöße unter Cannabis, Entziehung deswegen', '§ 13a Satz 1 Nr. 2 FeV', 'zwingend'],
  ['Entziehung wegen Drogen, wiederholte Verstöße nach § 24a StVG', '§ 14 Abs. 2 FeV', 'zwingend'],
  [`Neuerteilung nach Entzug bei ${K.entzug_ab} Punkten`, '§ 4 Abs. 10 StVG', 'in der Regel'],
  ['Erneute Verstöße in der neuen Probezeit nach Entziehung', '§ 2a Abs. 5 StVG', 'in der Regel'],
  ['Erhebliche oder wiederholte Verkehrsverstöße, Straftaten, Aggressionspotenzial', '§ 11 Abs. 3 Nr. 4 bis 7 FeV', 'möglich'],
  ['Neuerteilung nach wiederholter Entziehung', '§ 11 Abs. 3 Nr. 9 FeV', 'möglich'],
], 'Anlässe für ein medizinisch-psychologisches Gutachten nach FeV und StVG, Stand 2026', ['l', 'l', 'l'])}
<p>Beim Alkohol ist der Schwellenwert von ${h.num(A.mpu_promille, 1)} Promille der bekannteste Anlass, und er gilt für jedes Fahrzeug, auch für das Fahrrad. Wer darunter bleibt, aber zum zweiten Mal mit ${h.num(A.promille_owi, 1)} Promille auffällt, landet ebenfalls bei der Begutachtung, weil die Wiederholung genügt. Nur Verstöße gegen das Null-Promille-Gebot für Fahranfänger nach § 24c StVG werden dabei nicht mitgezählt. Die Grenzwerte und ihre Folgen erklärt die Seite zur ${h.a('promillegrenze', 'Promillegrenze')}, die Bußgelder stehen unter ${h.a('alkohol-am-steuer', 'Alkohol am Steuer')}.</p>
<p>Beim Cannabis hat § 13a FeV eigene Regeln, die sich am Missbrauch orientieren, also an der Frage, ob jemand Konsum und Fahren trennen kann. Eine einmalige Fahrt über dem THC-Grenzwert von ${h.num(A.thc_ng, 1)} ng/ml ist eine Ordnungswidrigkeit; wiederholte Fahrten unter Cannabiseinfluss führen zur MPU. Mehr dazu unter ${h.a('cannabis-am-steuer', 'Cannabis am Steuer')}.</p>
<p>Bei den Punkten kommt die Begutachtung erst nach dem Entzug, als Voraussetzung für die neue Fahrerlaubnis. Wie man dorthin gelangt, zeigt der Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>

<h2>Der Ablauf von der Anordnung bis zum Gutachten</h2>
<p>§ 11 Abs. 6 FeV beschreibt die Schritte. Die Behörde legt in der Anordnung fest, welche Fragen zu klären sind, begründet ihre Zweifel, nennt die in Betracht kommenden Stellen und setzt eine Frist. Sie weist darauf hin, dass Sie die Unterlagen einsehen können, die sie an die Stelle schickt. Sie beauftragen dann selbst eine Begutachtungsstelle und teilen der Behörde mit, welche. Die Behörde übersendet dorthin die Fragestellung und die Akten, soweit sie verwertet werden dürfen.</p>
<p>Die Untersuchung selbst hat einen medizinischen und einen psychologischen Teil. Bei Alkohol, Cannabis und Drogen geht es nach Anlage 4a ausdrücklich auch um das künftige Verhalten: ob zu erwarten ist, dass Sie nicht mehr unter Einfluss fahren. War eine Abhängigkeit festgestellt, muss eine stabile Abstinenz bestehen; bei Missbrauch ohne Abhängigkeit kommt es darauf an, ob Sie Konsum und Fahren zuverlässig trennen. In beiden Fällen verlangt die Anlage einen grundlegenden Wandel der Einstellung und Bedingungen, die einen Rückfall unwahrscheinlich machen.</p>
<p>Abstinenznachweise werden nur anerkannt, wenn sie von Stellen stammen, die Terminvergabe, Identitätskontrolle und Probenentnahme nach dem Stand der Wissenschaft sicherstellen, etwa Fachärzte mit verkehrsmedizinischer Qualifikation, Rechtsmediziner, Ärzte einer Begutachtungsstelle oder akkreditierte forensisch-toxikologische Labore. Befunde müssen im Original und unterschrieben vorliegen.</p>
<h3>Das Gutachten</h3>
<p>Es muss allgemeinverständlich, nachvollziehbar und nachprüfbar sein und zwischen Vorgeschichte und aktuellem Befund unterscheiden. Da Sie der Auftraggeber sind, geht es zunächst an Sie. Ein negatives Gutachten müssen Sie nicht vorlegen, dann bleibt es aber bei den Zweifeln der Behörde, und nach Fristablauf gilt § 11 Abs. 8 FeV. Das Gutachten kann einen anerkannten Kurs zur Wiederherstellung der Kraftfahreignung empfehlen, allerdings nur Personen, die zu diesem Zeitpunkt keine Fahrerlaubnis besitzen. In bestimmten Fällen ersetzt die Kursbescheinigung dann ein zweites Gutachten, nicht aber nach dem Punkteentzug oder bei Anordnungen wegen Verkehrsverstößen und Straftaten nach § 11 Abs. 3 Nr. 4 bis 7 FeV.</p>

<h2>Ärztliches Gutachten oder MPU</h2>
<p>Nicht jeder Zweifel führt sofort zur MPU. Begründen Tatsachen die Annahme einer Alkohol- oder Cannabisabhängigkeit, verlangt die Behörde nach § 13 und § 13a FeV zunächst ein ärztliches Gutachten, etwa von einem Facharzt mit verkehrsmedizinischer Qualifikation oder einem Arzt des Gesundheitsamts. Stellt dieser keine Abhängigkeit, aber Anzeichen für Missbrauch fest, folgt die MPU. Bei anderen Drogen ist der ärztliche Befund nach § 14 Abs. 1 FeV der erste Schritt, wenn Tatsachen auf Einnahme oder Abhängigkeit hindeuten.</p>

<h2>Welche Vorgeschichte zählen darf</h2>
<p>Die Behörde übersendet der Begutachtungsstelle nur Unterlagen, die sie unter Beachtung der gesetzlichen Verwertungsverbote verwenden darf. Ist eine Eintragung im Fahreignungsregister gelöscht, dürfen Tat und Entscheidung nach § 29 Abs. 7 StVG nicht mehr zu Ihrem Nachteil verwertet werden. Eine Ausnahme gilt, solange die Tat als Grundlage einer noch gespeicherten Entziehung oder Versagung genannt ist. Wer wissen will, was aktuell gespeichert ist, kann vor der Begutachtung eine kostenlose Auskunft beim KBA anfordern.</p>

<h2>Was die MPU kostet</h2>
<p>Hier hilft nur Ehrlichkeit: Einen amtlichen Preis gibt es nicht mehr. Die ${h.src('gebost', 'Gebührenordnung für Maßnahmen im Straßenverkehr')} enthielt früher eigene Sätze für die medizinisch-psychologische Untersuchung, diese Nummern sind weggefallen. § 6f StVG ermächtigt das Verkehrsministerium, Entgelte per Verordnung festzusetzen, mit Mindest- und Höchstsätzen; in der geltenden GebOSt steht ein solcher Tarif nicht mehr. Die Begutachtungsstellen nennen ihre Preise selbst, und sie hängen von der Fragestellung ab. Lassen Sie sich den Preis für Ihre konkrete Fragestellung vor der Beauftragung schriftlich geben.</p>
<p>Amtlich festgelegt sind dagegen die Gebühren der Fahrerlaubnisbehörde:</p>
${h.table(['Posten', 'Gebühr', 'GebOSt-Nr.'], [
  ['Prüfung des Antrags auf Erteilung', h.eur(F.antrag_pruefung, 2), '201'],
  ['Neuerteilung nach Entziehung oder Verzicht', `${h.eur(F.neuerteilung_min, 2)} bis ${h.eur(F.neuerteilung_max, 2)}`, '202.3'],
  ['Ermahnung oder Verwarnung im Punktesystem', h.eur(F.verwarnung_fes, 2), '209'],
], 'Gebühren der Fahrerlaubnisbehörde nach GebOSt, Stand 2026; Preise der Begutachtungsstellen sind frei', ['l', 'r', 'r'])}
<p>Hinzu kommen je nach Fall Abstinenznachweise, ein freiwilliger Vorbereitungskurs, Fahrstunden oder eine erneute Prüfung. Der Rechner unten zählt Ihre eigenen Angaben zusammen und ergänzt die Behördengebühr; den Rest der Führerscheinkosten zeigt der ${h.a('fuehrerschein-kosten', 'Führerscheinkosten-Rechner')}.</p>

<h2>MPU in der Probezeit</h2>
<p>Für Fahranfänger nennt ${h.src('stvg2a', '§ 2a StVG')} zwei eigene Fälle. Die Behörde kann die Begutachtung schon während der Probezeit anordnen, wenn die Verstöße nach den Umständen den Schluss auf fehlende Eignung nahelegen. Und wer nach einer Entziehung in der Probezeit eine neue Fahrerlaubnis bekommt und dann erneut einen A- oder zwei B-Verstöße begeht, muss in der Regel ein Gutachten beibringen. Die Stufen davor erklärt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>`,
  },
  en: {
    slug: 'mpu-assessment-germany',
    nav: 'MPU assessment',
    card: 'When Germany orders the medical and psychological assessment, who runs it and what it costs.',
    title: 'MPU Assessment Germany 2026: Triggers, Process and Cost',
    description: `MPU in Germany 2026: required from ${pe(A.mpu_promille)} per mille, after repeated alcohol or cannabis offences, usually after ${K.entzug_ab} points. Centres set prices; interpreters allowed.`,
    h1: 'The German MPU: what it is and when you need one',
    intro: 'The MPU is the assessment German authorities order when they doubt someone is fit to drive, and it applies to foreign licence holders too.',
    resume: `The MPU, short for medizinisch-psychologische Untersuchung (medical and psychological assessment), is an expert report from an officially recognised driving aptitude assessment centre (Begutachtungsstelle für Fahreignung) that the licensing authority demands when it doubts your fitness to drive. Under Section 13 of the Driving Licence Ordinance (FeV) it is compulsory after driving any vehicle with ${pe(A.mpu_promille)} per mille or more in the blood, or ${pe(A.mpu_aak)} mg/l in breath, after repeated alcohol offences, and when a licence was withdrawn for alcohol; Sections 13a and 14 set similar triggers for cannabis and other drugs. After a withdrawal at ${K.entzug_ab} Flensburg points the authority normally requires it before granting a new licence (Section 4(10) StVG). You pay for it yourself, and there is no official price: the old fee scale was abolished, so each centre sets its own. The examination may be held with a sworn interpreter at your expense. Not handing in the report by the deadline allows the authority to treat you as unfit.`,
    faqs: [
      { q: 'Can I do the German MPU with an interpreter?', a: 'Yes. Annex 4a of the Driving Licence Ordinance allows the medical and psychological examination to be carried out with a sworn or officially appointed interpreter or translator, who is engaged by the assessment centre, not by you. The cost is borne by the person being examined. Ask the centre about this when you book, because the interpreter has to be arranged in advance.' },
      { q: 'Does a German MPU order apply to my foreign licence?', a: 'Yes, as far as driving in Germany is concerned. If the authority withdraws a foreign licence, Section 3(1) StVG gives this the effect of removing your right to use it in Germany. To regain that right, the rules for a new grant after withdrawal apply, MPU included where the law requires it (Section 3(6) StVG). The licence itself remains valid in the issuing country unless that country acts.' },
      { q: 'Can my MPU preparation coach also be my assessor?', a: 'No. Annex 4a FeV bars anyone who prepares people for the assessment, advises or treats them on typical MPU questions, or runs courses to restore driving fitness from examining or assessing anyone at an assessment centre. The ban also covers people who are contractually linked to companies offering such services. Preparation and assessment are kept strictly apart.' },
      { q: 'What proof of abstinence does a German MPU accept?', a: 'Only results from bodies that guarantee proper appointment scheduling, identity checks and sample collection according to current science. Annex 4a FeV names specialists with traffic medicine qualifications who are not your treating doctor, public health doctors, forensic medicine specialists, occupational physicians, doctors at an assessment centre and accredited forensic toxicology laboratories. Results must be originals signed by the issuer.' },
    ],
    body: (h) => `
<h2>What the assessment is for</h2>
<p>The MPU is not a punishment and not a driving test. It is an expert opinion that answers questions the licensing authority (Fahrerlaubnisbehörde) has about your fitness to drive. A doctor and a psychologist at an officially recognised centre examine you, but only on what matters for driving: annex 4a of the Driving Licence Ordinance rules out looking at your personality as a whole. The authority decides afterwards, on the basis of the questions it asked.</p>
<p>Assessors work to the official assessment guidelines on driving fitness (Begutachtungsleitlinien zur Kraftfahreignung), to which annex 4a refers in the version of 12 December 2025. They describe, for each type of question, which findings speak for or against fitness. Before starting, the assessor must explain what the examination covers and why, and must keep records of it.</p>
<p>Centres need official recognition from the state authority, granted for ten years at most (Section 66 FeV). To keep assessments independent, nobody who prepares candidates, treats them for MPU-related problems or runs rehabilitation courses may examine people at a centre, and the same applies to anyone contractually linked to such businesses.</p>

<h2>When an MPU is ordered</h2>
<p>Some triggers oblige the authority to order an assessment, others allow it. For people who live here and drive on a foreign licence, the same rules apply as for German licence holders.</p>
${h.table(['Trigger', 'Legal basis', 'Order'], [
  [`Driving with ${h.num(A.mpu_promille, 1)} per mille or ${h.num(A.mpu_aak, 1)} mg/l breath alcohol or more`, 'Section 13 no. 2(c) FeV', 'compulsory'],
  ['Repeated offences under the influence of alcohol', 'Section 13 no. 2(b) FeV', 'compulsory'],
  ['Signs of alcohol misuse, or withdrawal for alcohol', 'Section 13 no. 2(a), (d), (e) FeV', 'compulsory'],
  ['Cannabis misuse, repeated cannabis offences, withdrawal for cannabis', 'Section 13a no. 2 FeV', 'compulsory'],
  ['Withdrawal for drugs, repeated drug-driving offences', 'Section 14(2) FeV', 'compulsory'],
  [`New licence after withdrawal at ${K.entzug_ab} points`, 'Section 4(10) StVG', 'as a rule'],
  ['New offences in the fresh probation after a withdrawal', 'Section 2a(5) StVG', 'as a rule'],
  ['Serious or repeated traffic offences, crimes, signs of aggression', 'Section 11(3) nos. 4 to 7 FeV', 'possible'],
], 'Grounds for an MPU under the Driving Licence Ordinance and Road Traffic Act, 2026', ['l', 'l', 'l'])}
<p>The ${h.num(A.mpu_promille, 1)} per mille threshold applies to every vehicle, bicycles included. A cyclist stopped on the way home from a beer garden can therefore end up with an MPU order for a car licence. Below that value, a second offence at ${h.num(A.promille_owi, 1)} per mille is enough on its own, because repetition triggers the assessment. The legal limits are set out on the page about the ${h.a('promillegrenze', 'German alcohol limit')}, and the fines on ${h.a('alkohol-am-steuer', 'drink-driving')}.</p>
<p>Cannabis has a section of its own. Section 13a FeV looks at misuse, meaning whether someone can keep use and driving apart, rather than at a single positive test. Driving once above ${h.num(A.thc_ng, 1)} ng/ml THC is a regulatory offence with a fine and a ban; repeated cases lead to an MPU. Details are on ${h.a('cannabis-am-steuer', 'cannabis and driving')}.</p>

<h2>From the order to the report</h2>
<p>Section 11(6) FeV sets out the procedure. The order states which questions are to be answered, why the authority has doubts, which centres come into consideration and by when the report is due. You choose one of those centres, commission it yourself, and tell the authority which one; the authority then sends the questions and your file to the centre. You may inspect the documents it sends.</p>
<p>The examination has a medical part and a psychological interview. In alcohol, cannabis and drug cases, annex 4a requires the assessor to judge your likely future behaviour. If dependence was diagnosed, stable abstinence must be shown; if there was misuse without dependence, the question is whether you reliably separate consumption from driving. The report has to describe a fundamental change in attitude and conditions that make a relapse unlikely.</p>
<h3>Language</h3>
<p>For many expats the psychological interview is the real hurdle, because it is a long conversation about your own behaviour. Annex 4a allows the examination to take place with a sworn or officially appointed interpreter or translator. The centre appoints the interpreter, and you pay. Raise it when you first contact a centre, since the appointment depends on it.</p>
<h3>The report</h3>
<p>It must be written in plain language, be logically consistent and verifiable, and keep the history separate from the current findings. Because you commissioned it, it comes to you first. You are not obliged to submit an unfavourable report, but if nothing reaches the authority by the deadline, Section 11(8) FeV allows it to conclude that you are unfit. A report may recommend a recognised rehabilitation course to people who hold no licence at the time; in some cases the course certificate then replaces a second assessment, though not after a points withdrawal or an order based on traffic offences and crimes under Section 11(3) nos. 4 to 7.</p>

<h2>A medical report may come first</h2>
<p>Where the facts point to dependence on alcohol or cannabis rather than misuse, Sections 13 and 13a FeV start with a medical report (ärztliches Gutachten), for example from a specialist in traffic medicine or a public health doctor. Only if that doctor finds no dependence but signs of misuse does the full MPU follow. For other drugs, Section 14(1) FeV also begins with the medical report when there are signs of use or dependence.</p>

<h2>Old offences that no longer count</h2>
<p>The centre receives your file only as far as the authority may lawfully use it. Once an entry has been deleted from the Flensburg register, Section 29(7) StVG forbids using the offence and the decision against you, unless it is cited as the basis of a withdrawal or refusal that is still on record. If you are unsure what is stored, a free extract from the KBA shows it before you book the assessment, and it helps you prepare for the questions the psychologist will ask about your history.</p>

<h2>What it costs</h2>
<p>There is no official price. The ${h.src('gebost', 'road traffic fee schedule (GebOSt)')} once contained rates for MPU examinations; those entries have been deleted. Section 6f StVG would allow the transport ministry to set fees by regulation, with minimum and maximum rates, but the current fee schedule contains no such tariff. Each centre sets its own prices, which vary with the questions to be answered. Ask for a written quote for your specific case before you commission the assessment.</p>
<p>What is fixed are the authority's own fees: ${h.eur(F.antrag_pruefung, 2)} for checking the application and between ${h.eur(F.neuerteilung_min, 2)} and ${h.eur(F.neuerteilung_max, 2)} for granting a licence again after withdrawal (GebOSt nos. 201 and 202.3). Abstinence tests, optional preparation, an interpreter and possibly new driving lessons or tests come on top. The budget tool below adds up your own figures and the authority fee; the ${h.a('fuehrerschein-kosten', 'licence cost calculator')} covers the rest.</p>

<h2>Where the points system leads</h2>
<p>An MPU after Flensburg points only comes at the end of the road: the licence has been withdrawn at ${K.entzug_ab} points, ${K.neuerteilung_sperre_monate} months have passed since you handed it in, and you apply again. Section 4(10) StVG says the authority will normally require the assessment, and a rehabilitation course cannot replace it in that case. The ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} shows how the stages before it work. New drivers face a separate route under ${h.src('stvg2a', 'Section 2a StVG')}: an assessment can be ordered during probation when the offences themselves suggest unfitness.</p>`,
  },
});
