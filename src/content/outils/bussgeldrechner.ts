import { defineGuide } from '../../lib/guide-types';
import { P, BKAT } from '../../lib/engine/params';
import { speeding, fees } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren;
const n = BKAT.entries.length;
const ex = speeding({ limit: 100, measured: 150, inner: false });
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');

export default defineGuide({
  id: 'bussgeldrechner',
  group: 'rechner',
  order: 10,
  tool: 'bussgeld',
  related: ['geschwindigkeitsueberschreitung', 'rotlichtverstoss', 'abstandsverstoss', 'handy-am-steuer', 'bussgeldbescheid', 'punkterechner'],
  sources: ['bkatAnlage', 'bkatAnhang', 'fevAnl13', 'fevAnl12', 'owig107', 'ptb'],
  de: {
    slug: 'bussgeldrechner',
    nav: 'Bußgeldrechner',
    card: 'Bußgeld, Gebühren, Punkte und Fahrverbot für jeden Verstoß.',
    title: 'Bußgeldrechner 2026: Bußgeld, Gebühren, Punkte, Fahrverbot',
    description: `Bußgeldrechner 2026 nach amtlicher BKatV: Tempo mit Toleranz, Rotlicht, Abstand, Handy, Alkohol und ${n} weitere Tatbestände, mit Gebühr ab ${V.gebuehr_min} € und Punkten.`,
    h1: 'Bußgeldrechner: der Betrag, den Sie wirklich zahlen',
    intro: 'Verstoß wählen, Werte eintragen: der Rechner zeigt Regelsatz, Gebühren, Gesamtbetrag, Punkte, Fahrverbot und die Einstufung in der Probezeit.',
    resume: `Der Rechner wendet die Bußgeldkatalog-Verordnung in der Fassung vom 12. August 2026 an, Zeile für Zeile aus dem amtlichen Text gelesen. Bei Geschwindigkeit zieht er zuerst die Messtoleranz ab, drei km/h bis 100 km/h und drei Prozent darüber, und sucht dann die Stufe in Tabelle 1 für Pkw, Lkw oder Gefahrgut, innerorts oder außerorts. Ein Beispiel: 150 km/h gemessen bei erlaubten 100 außerorts ergeben 45 km/h Überschreitung, ${eD(ex.fine)} Regelsatz, ${ex.points} Punkte und ${ex.fv} Monat Fahrverbot, mit Gebühren ${eD(ex.total, 2)}. Daneben rechnet er Rotlicht, Abstand nach dem halben Tacho, Handy am Steuer, Alkohol und Cannabis sowie jeden anderen der ${n} Tatbestände mit festem Betrag, auf Wunsch mit Gefährdung, Sachschaden oder Vorsatz. Das Ergebnis nennt die BKat-Nummer, damit Sie es mit dem Schreiben der Bußgeldstelle abgleichen können.`,
    faqs: [
      { q: 'Rechnet der Bußgeldrechner die Gebühren des Bescheids mit ein?', a: `Ja. Liegt der Regelsatz über ${V.verwarnung_max} Euro, ergeht ein Bußgeldbescheid, und der Rechner addiert die Gebühr nach § 107 OWiG: fünf Prozent, mindestens ${V.gebuehr_min} Euro, plus ${eD(V.zustellung, 2)} Zustellung. Bis ${V.verwarnung_max} Euro zeigt er ein Verwarnungsgeld ohne Gebühren. Weitere Auslagen, etwa für ein Gutachten im gerichtlichen Verfahren, kann er nicht kennen.` },
      { q: 'Muss ich im Rechner den gemessenen oder den vorgeworfenen Wert eingeben?', a: 'Den gemessenen Wert aus dem Anhörungsbogen, wenn der Schalter Toleranz abziehen auf Ja steht; der Rechner zieht dann drei km/h oder drei Prozent ab. Steht im Schreiben bereits die vorwerfbare Geschwindigkeit nach Abzug, stellen Sie den Schalter auf Nein. Welcher Wert gemeint ist, steht meist ausdrücklich im Schreiben.' },
      { q: 'Woher weiß der Rechner, ob ein Verstoß in der Probezeit zählt?', a: 'Aus Anlage 12 der Fahrerlaubnis-Verordnung. Wir haben jede punktbewehrte Nummer des Katalogs der Gruppe A, schwerwiegend, oder B, weniger schwerwiegend, zugeordnet, nach den dort genannten Vorschriften der StVO. Verstöße ohne Punkte werden nicht ins Register eingetragen und zählen deshalb in der Probezeit nicht.' },
      { q: 'Was kann der Rechner nicht abbilden?', a: 'Abweichungen im Einzelfall. Die BKatV nennt Regelsätze für gewöhnliche Umstände. Erhöhungen wegen Voreintragungen gibt es im Katalog nur beim Alkohol und bei Gefahrgutstrecken, und die bildet der Rechner ab. Ob eine Behörde wegen besonderer Umstände abweicht oder gegen ein höheres Bußgeld auf ein Fahrverbot verzichtet, lässt sich nicht vorhersagen.' },
    ],
    body: (h) => `
<h2>Was hinter dem Ergebnis steht</h2>
<p>Jede Zahl im Ergebnis hat eine Fundstelle. Der Regelsatz kommt aus der ${h.src('bkatAnlage', 'Anlage zur BKatV')} oder aus den Tabellen ihres ${h.src('bkatAnhang', 'Anhangs')}. Die Punkte stammen aus ${h.src('fevAnl13', 'Anlage 13 der FeV')}, die Probezeit-Einstufung aus Anlage 12. Die Gebühr folgt § 107 OWiG. Die BKat-Nummer steht im Ergebnis, damit Sie sie mit Ihrem Schreiben vergleichen können: Anhörungsbögen und Bescheide nennen sie oft als Tatbestandsnummer mit zusätzlicher Kennziffer.</p>
<h2>Die Zuschläge, die viele Rechner weglassen</h2>
<p>Vorsatz verdoppelt nach § 3 Abs. 4a BKatV jeden Regelsatz über ${h.eur(V.verwarnung_max)}. Bei Gefährdung oder Sachschaden steigt der Satz nach Tabelle 4, sofern der Tatbestand diese Folge nicht schon selbst enthält: aus 100 werden 120 oder 145 Euro. Bei der Geschwindigkeit kommt die Beharrlichkeit hinzu: Wer innerhalb eines Jahres nach einem rechtskräftigen Bußgeld wegen mindestens ${V.beharrlich_kmh} km/h erneut so schnell ist, bekommt in der Regel einen Monat Fahrverbot, auch dort, wo die Tabelle keins vorsieht. Alle drei Fälle lassen sich im Rechner einstellen.</p>
<h2>Alle Tatbestände, nicht nur die bekannten</h2>
<p>Die Auswahl Beliebiger Tatbestand durchsucht den ganzen Katalog nach Stichwort oder Nummer: Gurt, Winterreifen, Parkschein, Hauptuntersuchung, Rettungsgasse, Kennzeichen. Für die bekanntesten Fälle gibt es eigene Seiten mit Erklärungen, etwa zur ${h.a('geschwindigkeitsueberschreitung', 'Geschwindigkeitsüberschreitung')}, zum ${h.a('rotlichtverstoss', 'Rotlichtverstoß')} und zum ${h.a('abstandsverstoss', 'Abstand')}. Was nach dem Bescheid passiert, steht auf der Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}; wie die Punkte sich summieren, zeigt der ${h.a('punkterechner', 'Punkterechner')}.</p>
<p>Ihre Eingaben bleiben in Ihrem Browser. Ein Link mit Ihren Werten entsteht erst, wenn Sie etwas ändern, und lässt sich dann teilen.</p>`,
  },
  en: {
    slug: 'fine-calculator',
    nav: 'Fine calculator',
    card: 'Fine, fees, points and ban for any German traffic offence.',
    title: 'Fine Calculator Germany 2026: Bußgeld, Fees, Points, Ban',
    description: `Traffic fine calculator 2026 from the official BKatV: speeding with tolerance, red light, tailgating, phone, alcohol and ${n} more offences, fees from €${V.gebuehr_min}.`,
    h1: 'German traffic fine calculator: what you will actually pay',
    intro: 'Pick the offence and enter your figures to see the standard fine, fees, total, points, any driving ban and how it counts during probation.',
    resume: `This calculator applies Germany's Fine Catalogue Ordinance (BKatV) as amended on 12 August 2026, read line by line from the official text. For speeding it first deducts the measuring tolerance, three km/h up to 100 km/h and three per cent above, then finds the band in table 1 for cars, lorries or hazardous goods, in town or outside towns. Example: 150 km/h measured where 100 is allowed outside towns gives 45 km/h over, a standard fine of ${eE(ex.fine)}, ${ex.points} points and a ${ex.fv}-month driving ban, ${eE(ex.total, 2)} with fees. It also covers red lights, tailgating based on half the speedometer reading, phones at the wheel, alcohol and cannabis, and any of the other ${n} fixed-amount offences, with options for endangering others, damage or intent. Offence names stay in German, as on your letter.`,
    faqs: [
      { q: 'Does the calculator include the fees on a German fine notice?', a: `Yes. When the standard fine is above ${V.verwarnung_max} euros a formal notice (Bußgeldbescheid) is issued, and the calculator adds the fee under Section 107 of the Administrative Offences Act: five per cent, at least ${V.gebuehr_min} euros, plus ${eE(V.zustellung, 2)} for delivery. Up to ${V.verwarnung_max} euros it shows a warning fine with no fees. Costs of a court case are outside its scope.` },
      { q: 'Which speed should I type in: the one on the letter or the measured one?', a: 'Enter the measured speed from the hearing form and leave the tolerance switch on Yes; the calculator deducts three km/h or three per cent. If your letter already states the speed after the deduction, often called vorwerfbare Geschwindigkeit, set the switch to No so the tolerance is not taken off twice.' },
      { q: 'Can I search the catalogue in English?', a: 'The official catalogue only exists in German, and your letter quotes it in German, so the search uses German keywords such as Gurt (seatbelt), Parkschein (parking ticket) or Rettungsgasse (emergency corridor), or the BKat number printed on the letter. The result lines and explanations are in English.' },
      { q: 'What is outside what this calculator can tell me?', a: 'It shows the standard rates for ordinary circumstances. It cannot predict whether an authority or court departs from them, for instance raising the fine instead of imposing a driving ban, and it gives no view on whether a notice is correct. It is a calculation based on the published rules, not legal advice.' },
    ],
    body: (h) => `
<h2>Where each number comes from</h2>
<p>The standard fine is taken from the ${h.src('bkatAnlage', 'annex to the BKatV')} or the tables in its ${h.src('bkatAnhang', 'appendix')}. Points follow ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, the probation class annex 12, and the fee Section 107 OWiG. The result shows the BKat number so you can match it with the offence number on your letter, which usually adds a few digits of its own.</p>
<h2>Adjustments other calculators skip</h2>
<p>Intent doubles any standard fine above ${h.eur(V.verwarnung_max)} (Section 3(4a) BKatV). Endangering others or causing damage raises the fine under table 4 unless the offence already includes it. For speeding, repeating an excess of ${V.beharrlich_kmh} km/h or more within a year of a final fine normally adds a one-month ban even where the table has none. All three can be switched on in the form above.</p>
<h2>Every offence, not just the famous ones</h2>
<p>The option Any offence searches the whole catalogue, from seatbelts and winter tyres to number plates and overdue MOTs. The most common cases have their own explanations in English: ${h.a('geschwindigkeitsueberschreitung', 'speeding fines')}, ${h.a('rotlichtverstoss', 'red lights')} and ${h.a('abstandsverstoss', 'tailgating')}. What happens once the letter arrives is covered on the ${h.a('bussgeldbescheid', 'fine notice page')}, and the ${h.a('punkterechner', 'points calculator')} adds new points to your current total.</p>
<p>Nothing you type leaves your browser. A shareable link with your figures appears only after you change a value.</p>`,
  },
});
