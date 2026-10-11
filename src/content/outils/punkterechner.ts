import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { tilgung } from '../../lib/engine/punkte';
import { formatDecimal } from '../../lib/format';
const yD = (m: number) => formatDecimal(m / 12, 1, 'de'), yE = (m: number) => formatDecimal(m / 12, 1, 'en');

const K = P.punkte;
const t1 = tilgung('2026-09-01', 1);
const fmt = (iso: string, l: 'de' | 'en') => new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default defineGuide({
  id: 'punkterechner',
  group: 'rechner',
  order: 30,
  tool: 'punkte',
  related: ['punkte-in-flensburg', 'punkte-abfragen', 'punkteabbau', 'probezeit-fuehrerschein', 'mpu'],
  sources: ['stvg4', 'stvg29', 'fevAnl13', 'kbaAuskunft'],
  de: {
    slug: 'punkterechner',
    nav: 'Punkterechner',
    card: 'Neuer Punktestand, Maßnahme der Behörde und Tilgungsdatum.',
    title: 'Punkterechner 2026: Punktestand, Maßnahme und Tilgung',
    description: `Punkterechner 2026 nach § 4 und § 29 StVG: neuer Punktestand, Ermahnung ab ${K.ermahnung_ab}, Verwarnung ab ${K.verwarnung_ab}, Entzug ab ${K.entzug_ab} Punkten, Seminar-Abzug und Datum der Tilgung.`,
    h1: 'Punkterechner: was der nächste Eintrag in Flensburg auslöst',
    intro: 'Aktuellen Stand und neuen Verstoß eintragen: der Rechner zeigt die Maßnahme der Behörde und wann der Eintrag wieder verschwindet.',
    resume: `Der Punkterechner setzt das Fahreignungs-Bewertungssystem aus § 4 StVG um. Er addiert die Punkte des neuen Verstoßes zum Stand, den Ihnen das Kraftfahrt-Bundesamt mitgeteilt hat, und ordnet das Ergebnis den vier Stufen zu: Vormerkung bis ${K.vormerkung_bis} Punkte, Ermahnung bei ${K.ermahnung_ab} oder 5, Verwarnung bei ${K.verwarnung_ab} oder 7, Entziehung ab ${K.entzug_ab}. Hat die Behörde eine Stufe noch nicht ausgesprochen, gilt die Regel aus Absatz 6: Sie holt die fehlende Maßnahme nach und setzt den Stand auf fünf oder sieben Punkte herab. Der Rechner zeigt außerdem, ob ein Fahreignungsseminar noch einen Punkt abzieht, und berechnet für den neuen Eintrag die Tilgungsreife nach § 29 StVG: Ein Punkt mit Rechtskraft am 1. September 2026 ist am ${fmt(t1.tilgungsreif, 'de')} tilgungsreif und nach der Überliegefrist am ${fmt(t1.geloescht, 'de')} gelöscht.`,
    faqs: [
      { q: 'Welchen Punktestand trage ich in den Punkterechner ein?', a: 'Den Stand aus der Auskunft des Kraftfahrt-Bundesamts, die kostenlos online mit dem Personalausweis, per Post oder vor Ort in Flensburg erhältlich ist. Schätzen Sie nicht aus der Erinnerung: Einträge verjähren einzeln, und ein alter Punkt kann bereits getilgt sein, während ein neuerer noch zählt. Die Auskunft nennt zu jedem Eintrag das Datum der Rechtskraft.' },
      { q: 'Warum zeigt der Punkterechner bei acht Punkten manchmal nur eine Ermahnung?', a: `Weil § 4 Abs. 6 StVG keine Stufe überspringen lässt. Hat die Behörde bei vier oder fünf Punkten noch nicht ermahnt, holt sie das nach und setzt den Stand auf ${K.ermahnung_reset} Punkte; fehlt nur die Verwarnung, auf ${K.verwarnung_reset}. Entzogen wird erst, wenn Ermahnung und Verwarnung erteilt sind. Deshalb fragt der Rechner nach der bisher erhaltenen Maßnahme.` },
      { q: 'Ab wann zählt die Tilgungsfrist im Punkterechner?', a: `Ab der Rechtskraft der Entscheidung, nicht ab dem Tag des Verstoßes (§ 29 Abs. 4 StVG). Ein Punkt wird nach ${yD(K.tilgung_1p_monate)} Jahren tilgungsreif, zwei Punkte nach ${yD(K.tilgung_2p_monate)}, drei nach ${yD(K.tilgung_3p_monate)} Jahren. Danach bleibt der Eintrag noch ein Jahr gespeichert, darf aber nur noch für bestimmte Zwecke verwendet werden.` },
      { q: 'Berücksichtigt der Punkterechner die Probezeit?', a: 'Nein, die Probezeit ist ein eigenes System nach § 2a StVG mit A- und B-Verstößen; beide Systeme gelten nebeneinander. Die Einstufung eines Verstoßes als A oder B zeigt der Bußgeldrechner. Die Folgen in der Probezeit, vom Aufbauseminar bis zur Entziehung, erklärt die Seite zur Probezeit.' },
    ],
    body: (h) => `
<h2>Was der Rechner nachbildet</h2>
<p>Die Stufen, die Herabsetzung bei übersprungenen Maßnahmen und der Seminar-Abzug stehen in ${h.src('stvg4', '§ 4 StVG')}, die Fristen in ${h.src('stvg29', '§ 29 StVG')}. Welcher Verstoß wie viele Punkte bringt, regelt ${h.src('fevAnl13', 'Anlage 13 der FeV')}; der ${h.a('bussgeldrechner', 'Bußgeldrechner')} zeigt die Punkte jeder Nummer. Maßgeblich für die Maßnahme ist der Stand am Tag des letzten Verstoßes, nicht am Tag des Bescheids: Wer kurz vor einem Seminar noch einen Punkt sammelt, kann deshalb eine Stufe höher landen, als er dachte.</p>
<h2>Das Fahreignungsseminar im Rechner</h2>
<p>Bei einem Stand von einem bis fünf Punkten zieht die Behörde nach § 4 Abs. 7 einen Punkt ab, wenn Sie innerhalb von zwei Wochen nach Seminarende die Teilnahmebescheinigung vorlegen. Das geht einmal in fünf Jahren. Ab sechs Punkten bringt das Seminar keinen Abzug mehr. Mehr dazu auf der Seite zum ${h.a('punkteabbau', 'Punkteabbau')}.</p>
<h2>Grenzen</h2>
<p>Der Rechner kennt nur die Angaben, die Sie machen. Mehrere Verstöße in Tateinheit zählen nur einmal mit der höchsten Punktzahl, Straftaten mit Entziehung bringen drei Punkte und lassen die Frist erst mit der Neuerteilung beginnen. Für den genauen Stand bleibt die ${h.a('punkte-abfragen', 'Auskunft beim KBA')} die einzige verlässliche Quelle; erklärt wird das System im Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>`,
  },
  en: {
    slug: 'points-calculator',
    nav: 'Points calculator',
    card: 'New Flensburg points total, the authority’s measure and expiry dates.',
    title: 'Points Calculator Flensburg 2026: Total, Measures, Expiry',
    description: `Flensburg points calculator 2026: new total after an offence, reminder from ${K.ermahnung_ab}, warning from ${K.verwarnung_ab}, licence withdrawn at ${K.entzug_ab} points, seminar deduction and expiry date.`,
    h1: 'Flensburg points calculator for drivers in Germany',
    intro: 'Enter your current points and the new offence to see what the licensing authority does next and when the entry expires.',
    resume: `Germany records traffic points in the driving aptitude register kept by the Federal Motor Transport Authority (KBA) in Flensburg, which is why drivers speak of Flensburg points. This calculator applies Section 4 of the Road Traffic Act: it adds the points of a new offence to your current total and maps the result to the four stages, noted at one to ${K.vormerkung_bis} points, a written reminder at ${K.ermahnung_ab} or 5, a written warning at ${K.verwarnung_ab} or 7 and withdrawal of the licence from ${K.entzug_ab}. If a stage was skipped, the authority issues the missing measure first and lowers the total to five or seven points, and the calculator does the same. It also tells you whether a driver improvement seminar would still remove a point and when the new entry expires: one point that became final on 1 September 2026 expires on ${fmt(t1.tilgungsreif, 'en')} and is deleted on ${fmt(t1.geloescht, 'en')}.`,
    faqs: [
      { q: 'Do Flensburg points apply to me if I hold a foreign licence?', a: 'Offences committed in Germany are recorded in the Flensburg register whatever licence you hold, and the stages lead to measures by the German authority when you live in Germany. If your licence is withdrawn, the withdrawal means you may no longer drive in Germany on that licence. Points from your home country are not transferred to Flensburg.' },
      { q: 'Why does the calculator lower my total to five or seven points?', a: `Section 4(6) of the Road Traffic Act does not allow the authority to skip a stage. If you never received the reminder, it is issued first and your total drops to ${K.ermahnung_reset}; if only the warning is missing, to ${K.verwarnung_reset}. The licence is withdrawn only after both measures were taken. The question about measures already received exists for this reason.` },
      { q: 'From which date does a German point start to expire?', a: `From the day the decision became final (Rechtskraft), usually two weeks after the fine notice was delivered if no objection was filed, not from the day of the offence. One point expires after ${yE(K.tilgung_1p_monate)} years, two after ${yE(K.tilgung_2p_monate)}, three after ${yE(K.tilgung_3p_monate)}. A further year follows before the entry is deleted for good.` },
      { q: 'Does this calculator cover the probation period?', a: 'No. New drivers in their two-year probation face a second system under Section 2a of the Road Traffic Act, built on A and B offences, which runs alongside the points. The fine calculator shows whether an offence is A or B, and the page on the probationary licence explains the remedial course and its consequences.' },
    ],
    body: (h) => `
<h2>The rules behind the result</h2>
<p>Stages, the lowering after skipped measures and the seminar deduction come from ${h.src('stvg4', 'Section 4 StVG')}; expiry periods from ${h.src('stvg29', 'Section 29 StVG')}. Which offence carries how many points is set by ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, and our ${h.a('bussgeldrechner', 'fine calculator')} shows them for each catalogue number. What counts for the measure is your total on the day of the latest offence, not on the day the notice arrives.</p>
<h2>The seminar option</h2>
<p>With one to five points, attending a driver improvement seminar (Fahreignungsseminar) removes one point if you hand in the certificate within two weeks of finishing, once every five years. From six points the seminar brings no deduction. The ${h.a('punkteabbau', 'page on reducing points')} has the details.</p>
<h2>Limits</h2>
<p>The calculator only knows what you enter. Several offences in one act count once, with the highest points; crimes with withdrawal bring three points and their expiry only starts when a new licence is issued. Your exact total comes from the free ${h.a('punkte-abfragen', 'KBA register extract')}; the system as a whole is explained in the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')}.</p>`,
  },
});
