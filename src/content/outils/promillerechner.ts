import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { alcohol } from '../../lib/engine/bkat';
import { formatDecimal } from '../../lib/format';
const dD = (x: number) => formatDecimal(x, 2, 'de'), dE = (x: number) => formatDecimal(x, 2, 'en');

const A = P.alkohol;
const a06 = alcohol({ promille: 0.6, priorEntries: 0, novice: false });
const nov = alcohol({ promille: 0.2, priorEntries: 0, novice: true });

export default defineGuide({
  id: 'promillerechner',
  group: 'rechner',
  order: 40,
  tool: 'promille',
  related: ['promillegrenze', 'alkohol-am-steuer', 'cannabis-am-steuer', 'mpu', 'probezeit-fuehrerschein'],
  sources: ['stvg24a', 'stvg24c', 'stgb316', 'propk', 'fev13', 'bkatAnlage'],
  de: {
    slug: 'promillerechner',
    nav: 'Promillerechner',
    card: 'Folgen eines Promille- oder THC-Werts: Bußgeld, Fahrverbot, Straftat, MPU.',
    title: 'Promillerechner 2026: Folgen von 0,5, 1,1 und 1,6 Promille',
    description: `Promillerechner 2026: was ein Wert auslöst, ab 0,5 ‰ ${a06.fine} € und Fahrverbot, ab 1,1 ‰ Straftat, ab 1,6 ‰ MPU, 0,0 ‰ in der Probezeit und unter 21, nach StVG.`,
    h1: 'Promillerechner: was ein Wert rechtlich bedeutet',
    intro: 'Dieser Rechner schätzt keinen Blutalkohol aus Getränken, er zeigt die Folgen eines Werts: Bußgeld, Punkte, Fahrverbot, Strafverfahren, MPU.',
    resume: `Die meisten Promillerechner im Netz schätzen aus Getränken, Gewicht und Geschlecht einen Blutalkoholwert. Das tun wir bewusst nicht: Eine amtliche Formel dafür gibt es nicht, und auch das Bundesinstitut für Öffentliche Gesundheit nennt die Ergebnisse solcher Rechner nur ungefähre Werte für gesunde Erwachsene. Unser Rechner beginnt beim Wert selbst, gemessen oder angenommen, und zeigt, was das Recht daran knüpft. Ab ${dD(A.promille_owi)} Promille oder ${dD(A.aak_owi)} mg/l Atemalkohol sind es nach § 24a StVG ${a06.fine} Euro, ${a06.fv} Monat Fahrverbot und ${a06.points} Punkte, bei Voreintragungen deutlich mehr. Ab 1,1 Promille liegt eine Straftat nach § 316 StGB vor, ab 0,3 Promille schon bei Ausfallerscheinungen. Ab 1,6 Promille ordnet die Fahrerlaubnisbehörde eine MPU an. In der Probezeit und unter 21 Jahren gilt null: jeder Schluck kostet ${nov.fine} Euro und einen Punkt.`,
    faqs: [
      { q: 'Warum rechnet dieser Promillerechner nicht aus, wie viel ich getrunken habe?', a: 'Weil jede Rechnung aus Getränken nur eine grobe Schätzung ist: Aufnahme und Abbau schwanken mit Körperbau, Mahlzeit, Medikamenten und Tagesform, und eine amtliche Formel gibt es nicht. Wer sich auf eine solche Schätzung verlässt, um zu entscheiden, ob er noch fährt, geht ein Risiko ein, das kein Rechner abnimmt. Unser Werkzeug beantwortet die andere Frage: was ein Wert rechtlich bedeutet.' },
      { q: 'Was bedeutet der Atemalkoholwert in mg/l für das Bußgeld?', a: `§ 24a StVG nennt zwei gleichwertige Grenzen: ${dD(A.aak_owi)} mg/l in der Atemluft oder ${dD(A.promille_owi)} Promille im Blut. Wer eine davon erreicht, begeht die Ordnungswidrigkeit nach Nummer 241 des Katalogs. Für die MPU nennt § 13 FeV entsprechend ${dD(A.mpu_aak)} mg/l oder ${dD(A.mpu_promille)} Promille. Eine Umrechnung zwischen beiden Werten schreibt das Gesetz nicht vor.` },
      { q: 'Wie rechnet der Promillerechner Cannabis?', a: `Mit dem Grenzwert aus § 24a Abs. 1a StVG: ab ${dD(A.thc_ng)} ng/ml THC im Blutserum gilt Nummer 242 mit ${a06.fine} Euro, einem Monat Fahrverbot und zwei Punkten. Wer THC und Alkohol kombiniert, fällt unter Nummer 243a mit 1 000 Euro. Fahranfänger und Personen unter 21 dürfen überhaupt kein THC im Blut haben.` },
    ],
    body: (h) => `
<h2>Die Stufen, die der Rechner prüft</h2>
${h.table(['Wert', 'Folge', 'Rechtsgrundlage'], [
  ['ab 0,0 ‰ in der Probezeit oder unter 21', `${h.eur(nov.fine)}, 1 Punkt`, '§ 24c StVG, Nr. 243b'],
  ['ab 0,3 ‰ mit Ausfallerscheinungen', 'Straftat möglich', '§ 316 StGB'],
  ['ab 0,5 ‰ oder 0,25 mg/l', `${h.eur(a06.fine)}, ${a06.fv} Monat, ${a06.points} Punkte`, '§ 24a StVG, Nr. 241'],
  ['ab 1,1 ‰', 'Straftat, Entziehung', '§ 316 StGB'],
  ['ab 1,6 ‰ oder 0,8 mg/l', 'MPU wird angeordnet', '§ 13 FeV'],
], 'Promillegrenzen am Steuer eines Kraftfahrzeugs')}
<p>Die Grenzen 0,3 und 1,1 Promille stehen nicht im Gesetzestext, sondern ergeben sich aus der Rechtsprechung zu § 316 StGB; die ${h.src('propk', 'Polizeiliche Kriminalprävention')} nennt sie ausdrücklich. Für Radfahrer liegt die Strafbarkeitsgrenze bei 1,6 Promille. Die Seite zur ${h.a('promillegrenze', 'Promillegrenze')} erklärt, wer von welcher Grenze betroffen ist; die Sanktionen im Einzelnen stehen bei ${h.a('alkohol-am-steuer', 'Alkohol am Steuer')}.</p>
<h2>Was der Rechner nicht ersetzt</h2>
<p>Liegt ein Strafverfahren vor, entscheiden Staatsanwaltschaft und Gericht über Geld- oder Freiheitsstrafe und die Sperrfrist; dafür gibt es keinen Katalog. Der Rechner nennt dann nur die Grundlagen. Zur MPU, ihren Anlässen und Kosten führt die Seite zur ${h.a('mpu', 'MPU')}.</p>`,
  },
  en: {
    slug: 'blood-alcohol-calculator',
    nav: 'Alcohol limit calculator',
    card: 'What a blood alcohol or THC reading means: fine, ban, crime, MPU.',
    title: 'Blood Alcohol Calculator Germany 2026: Limits and Fines',
    description: `Blood alcohol rules in Germany 2026: from 0.5 per mille €${a06.fine}, a ban and 2 points, from 1.1 a crime, from 1.6 an MPU, zero for new drivers. Official limits.`,
    h1: 'What a blood alcohol reading means in Germany',
    intro: 'This tool does not estimate your blood alcohol from drinks; it shows what a given reading means under German law.',
    resume: `Most online calculators guess a blood alcohol level from drinks, weight and sex. We deliberately do not: there is no official formula, and Germany's Federal Institute for Public Health describes the results of such calculators as approximate values for healthy adults only. This tool starts from the reading itself, measured or assumed, and shows what German law attaches to it. From ${dE(A.promille_owi)} per mille in the blood, or ${dE(A.aak_owi)} mg/l in breath, Section 24a of the Road Traffic Act means a fine of ${a06.fine} euros, a ${a06.fv}-month driving ban and ${a06.points} points, more with earlier entries. From 1.1 per mille it is a crime under Section 316 of the Criminal Code, and from 0.3 if you show signs of impairment. From 1.6 the licensing authority orders an MPU assessment. Drivers on probation and anyone under 21 must have zero alcohol: any amount costs ${nov.fine} euros and a point.`,
    faqs: [
      { q: 'Is the German drink-driving limit lower than in my home country?', a: `The general limit for administrative fines in Germany is ${dE(A.promille_owi)} per mille in the blood or ${dE(A.aak_owi)} mg/l in breath, and zero for drivers on probation and under 21. A criminal case can start from 0.3 per mille if there are signs of impairment. Compare with your home rules carefully, since many countries use different thresholds and units.` },
      { q: 'Why will this tool not tell me how much I can drink?', a: 'Because no calculation from drinks is reliable enough to decide whether you can still drive: absorption and breakdown vary with body build, food, medication and other factors, and German authorities publish no formula. The tool answers a different question, namely what a reading means legally, with the fine, points, ban or criminal consequences.' },
      { q: 'What happens with a cannabis test in Germany?', a: `Since 2024 the limit is ${dE(A.thc_ng)} ng/ml of THC in blood serum (Section 24a(1a) Road Traffic Act). Above it, catalogue number 242 applies: ${a06.fine} euros, one month without driving and two points. Mixing cannabis and alcohol falls under number 243a, from 1,000 euros. New drivers and anyone under 21 must have no THC at all.` },
    ],
    body: (h) => `
<h2>The thresholds the tool checks</h2>
${h.table(['Reading', 'Consequence', 'Legal basis'], [
  ['any amount on probation or under 21', `${h.eur(nov.fine)}, 1 point`, 'Section 24c StVG, no. 243b'],
  ['from 0.3 with signs of impairment', 'possible crime', 'Section 316 StGB'],
  ['from 0.5 or 0.25 mg/l', `${h.eur(a06.fine)}, ${a06.fv} month, ${a06.points} points`, 'Section 24a StVG, no. 241'],
  ['from 1.1', 'crime, licence withdrawn', 'Section 316 StGB'],
  ['from 1.6 or 0.8 mg/l', 'MPU assessment ordered', 'Section 13 FeV'],
], 'Alcohol limits when driving a motor vehicle in Germany')}
<p>The 0.3 and 1.1 thresholds come from case law on Section 316 of the Criminal Code, not from the statute; the ${h.src('propk', 'German police prevention programme')} states them explicitly. For cyclists the criminal threshold is 1.6. Our page on the ${h.a('promillegrenze', 'alcohol limit')} explains who is affected by which limit, and ${h.a('alkohol-am-steuer', 'drink-driving penalties')} covers repeat offences.</p>
<h2>Where the tool stops</h2>
<p>In a criminal case, prosecutors and courts decide on a fine or prison and on the period before a new licence; there is no catalogue for that, so the tool only names the rule. For the assessment that often follows, see the ${h.a('mpu', 'MPU page')}.</p>`,
  },
});
