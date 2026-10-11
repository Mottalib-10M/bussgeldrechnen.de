import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, fees } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const inn = speeding({ limit: 50, measured: 70, inner: true, tolerance: false });
const out = speeding({ limit: 100, measured: 120, inner: false, tolerance: false });
const in21 = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });
const fIn = fees(inn.fine), fOut = fees(out.fine);
/** Vergleich der Stufen rund um die Grenze, innerorts und außerorts, ohne Toleranz (vorgeworfene Werte). */
const stufen = [15, 16, 20, 21].map((over) => ({
  over,
  i: speeding({ limit: 50, measured: 50 + over, inner: true, tolerance: false }),
  o: speeding({ limit: 100, measured: 100 + over, inner: false, tolerance: false }),
}));
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-20',
  group: 'tempo',
  order: 120,
  mini: 'kmh20',
  related: ['kmh-10', 'kmh-21', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'bussgeldbescheid'],
  sources: ['bkatAnhang', 'owig107', 'fevAnl13', 'ptb'],
  de: {
    slug: '20-kmh-zu-schnell',
    nav: '20 km/h zu schnell',
    card: 'Die letzte Stufe ohne Punkt, aber schon mit Bescheid und Gebühren.',
    title: '20 km/h zu schnell 2026: Bescheid mit Gebühr, kein Punkt',
    description: `20 km/h zu schnell 2026: ${de(inn.fine)} innerorts plus Gebühren, zusammen ${de(inn.total, 2)}. Kein Punkt, kein Eintrag in Flensburg, aber ein förmlicher Bußgeldbescheid mit Kosten.`,
    h1: '20 km/h zu schnell: Bescheid mit Kosten, aber noch ohne Punkt',
    intro: 'Zwischen 16 und 20 km/h zu schnell kommt ein förmlicher Bußgeldbescheid mit Gebühren, ein Punkt in Flensburg aber noch nicht.',
    resume: `Wer mit dem Pkw 16 bis 20 km/h zu schnell war, zahlt innerorts ${de(inn.fine)} und außerorts ${de(out.fine)} nach Tabelle 1 c des Bußgeldkatalogs. Beide Beträge liegen über der Verwarnungsgrenze von ${de(V.verwarnung_max)}, deshalb ergeht ein Bußgeldbescheid. Nach § 107 OWiG kommen eine Gebühr von fünf Prozent, mindestens ${de(V.gebuehr_min)}, und ${de(V.zustellung, 2)} Zustellung hinzu: Innerorts stehen am Ende ${de(inn.total, 2)} auf dem Bescheid, außerorts ${de(out.total, 2)}. Einen Punkt gibt es nicht, denn Anlage 13 der FeV führt Geschwindigkeitsverstöße mit dem Pkw erst ab mehr als 20 km/h. Damit entsteht auch kein Eintrag im Fahreignungsregister und keine Folge in der Probezeit. Schon ein km/h mehr ändert das: Bei 21 km/h innerorts werden ${de(in21.fine)} fällig, dazu ein Punkt. Wer ${T.kmh_bis_100} km/h Toleranz einrechnet, landet mit 73 km/h Messwert in der 50er-Zone genau auf 20 km/h.`,
    faqs: [
      { q: 'Wie viel kostet 20 km/h zu schnell innerorts mit allen Gebühren?', a: `Der Regelsatz beträgt ${de(inn.fine)}. Fünf Prozent davon wären ${de(inn.fine * V.gebuehr_satz, 2)}, also greift die Mindestgebühr von ${de(V.gebuehr_min)}. Mit ${de(V.zustellung, 2)} Zustellung ergibt das ${de(inn.total, 2)}. Außerorts sind es ${de(out.fine)} plus dieselben ${de(fOut.total, 2)} Kosten, zusammen ${de(out.total, 2)}. Grundlage sind Tabelle 1 c der BKatV und § 107 OWiG.` },
      { q: 'Warum gibt es für 20 km/h zu schnell keinen Punkt, obwohl es mehr als 55 Euro kostet?', a: 'Für einen Eintrag verlangt § 28 Abs. 3 StVG zweierlei: mindestens 60 Euro Bußgeld und einen Tatbestand aus Anlage 13 der Fahrerlaubnis-Verordnung. Dort stehen Geschwindigkeitsverstöße mit dem Pkw erst ab mehr als 20 km/h. Die Grenze von 55 Euro entscheidet nur über Verwarnung oder Bescheid. Deshalb kostet die Stufe 16 bis 20 km/h Gebühren, bleibt aber ohne Eintrag in Flensburg.' },
      { q: 'Steht 20 km/h zu schnell im Fahreignungsregister?', a: `Nein. Eingetragen werden nur Entscheidungen, die mit Punkten bewertet sind. Ein Bescheid über ${de(inn.fine)} oder ${de(out.fine)} für 16 bis 20 km/h wird zwar rechtskräftig, landet aber nicht in Flensburg. Er zählt weder für den Punktestand noch für die Probezeit noch für die Beharrlichkeitsregel, die erst bei mindestens ${V.beharrlich_kmh} km/h ansetzt.` },
      { q: 'Lohnt sich bei 20 km/h zu schnell ein Blick auf den Messwert?', a: `Ja, weil die Grenze zur nächsten Stufe nur ein km/h entfernt ist. Bis ${T.grenze_kmh} km/h Messwert werden ${T.kmh_bis_100} km/h abgezogen: 73 km/h in der 50er-Zone ergeben 20 km/h, 74 km/h schon 21 km/h mit Punkt. Ob der Abzug richtig angewendet wurde, lässt sich aus dem Anhörungsbogen ablesen, denn dort stehen gemessener und vorgeworfener Wert.` },
      { q: 'Wie lange habe ich bei einem Bescheid über 20 km/h für den Einspruch Zeit?', a: `${V.einspruch_wochen} Wochen ab Zustellung, so steht es in § 67 OWiG. Der Tag der Zustellung ist auf dem gelben Umschlag vermerkt. Nach Ablauf der Frist wird der Bescheid rechtskräftig, und der Betrag von ${de(inn.total, 2)} innerorts ist zu zahlen. Der Einspruch ist ein Recht und kostet zunächst nichts; ob er sinnvoll ist, hängt vom Einzelfall ab.` },
    ],
    body: (h) => `
<h2>Die teuerste Stufe ohne Punkt</h2>
<p>Bei 16 bis 20 km/h trennen sich zwei Schwellen, die viele für dieselbe halten. Die erste ist die Verwarnungsgrenze von ${h.eur(V.verwarnung_max)}: Sie entscheidet, ob ein Verwarnungsgeld genügt oder ein Bescheid mit Kosten ergeht. Diese Schwelle ist hier überschritten, innerorts mit ${h.eur(inn.fine)}, außerorts mit ${h.eur(out.fine)}. Die zweite Schwelle ist die Punkteliste in ${h.src('fevAnl13', 'Anlage 13 der FeV')}. Sie nennt Tempoverstöße mit dem Pkw erst ab mehr als 20 km/h. Wer genau in dieser Stufe liegt, bekommt also ein förmliches Verfahren mit Gebühren, aber keinen Eintrag. Das macht sie zur teuersten Stufe ohne Folgen für den Führerschein, und zur letzten. Wie knapp die Grenze ist, zeigt die Seite ${h.a('kmh-21', '21 km/h zu schnell')}.</p>

<h2>Woraus sich die Summe auf dem Bescheid zusammensetzt</h2>
<p>Ein Bußgeldbescheid enthält drei Posten. Der Regelsatz kommt aus dem Katalog. Die Gebühr regelt ${h.src('owig107', '§ 107 OWiG')}: fünf Prozent des Bußgelds, aber mindestens ${h.eur(V.gebuehr_min)}. Bei ${h.eur(inn.fine)} wären fünf Prozent nur ${h.eur(inn.fine * V.gebuehr_satz, 2)}, also gilt die Mindestgebühr. Die Auslagen für die förmliche Zustellung betragen ${h.eur(V.zustellung, 2)}. Die Kosten machen damit gut ein Drittel des Bußgelds aus, ein Verhältnis, das erst bei höheren Stufen kleiner wird. Die folgende Tabelle stellt die Stufen um die Grenze nebeneinander:</p>
${h.table(['Zu schnell', 'Innerorts', 'Gesamt innerorts', 'Außerorts', 'Gesamt außerorts', 'Punkte'], stufen.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), i.verwarnung ? 'ohne Gebühr' : h.eur(i.total, 2), h.eur(o.fine), o.verwarnung ? 'ohne Gebühr' : h.eur(o.total, 2), h.num(i.points)]), 'Pkw, vorgeworfene Werte nach Toleranz; Gebühren nach § 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Der Sprung von 15 auf 16 km/h ist im Verhältnis der größte der ganzen Tabelle: Innerorts wird aus einem Verwarnungsgeld ohne Nebenkosten fast der doppelte Betrag, weil Bußgeld und Kosten zugleich steigen.</p>

<h2>Warum 60 Euro außerorts keinen Punkt bringen</h2>
<p>Die verbreitete Faustregel lautet, ab 60 Euro gebe es einen Punkt. Sie ist nur die halbe Wahrheit. § 28 Abs. 3 Nr. 3 StVG verlangt für einen Eintrag zweierlei: einen Tatbestand, der in Anlage 13 der FeV aufgeführt ist, und ein Bußgeld von mindestens 60 Euro oder ein Fahrverbot. Außerorts kostet die Stufe 16 bis 20 km/h genau ${h.eur(out.fine)}, die Betragsgrenze ist also erreicht. Weil die Stufe aber in Anlage 13 fehlt, bleibt das Register leer. Umgekehrt reicht die Nennung in der Liste allein ebenfalls nicht, wenn der Betrag darunter bleibt. Wer seinen Punktestand prüfen will, findet die Regeln im ${h.a('punkte-in-flensburg', 'Überblick zu den Punkten in Flensburg')}.</p>

<h2>Vom Blitzer bis zur Rechtskraft</h2>
<p>Nach dem Blitzer kommt in der Regel zuerst ein Anhörungsbogen. Er nennt Tatort, Zeit, gemessenen und vorgeworfenen Wert. Angaben zur Sache sind freiwillig, die Angaben zur Person nicht. Danach erlässt die Bußgeldstelle den Bescheid, der in einem gelben Umschlag förmlich zugestellt wird; das Datum darauf startet die Frist. Innerhalb von ${V.einspruch_wochen} Wochen ist der Einspruch möglich (§ 67 OWiG). Lässt man die Frist verstreichen, wird der Bescheid rechtskräftig und vollstreckbar. Seit dem 1. Juli 2026 hat die Behörde für den ersten verjährungsunterbrechenden Schritt ${V.verjaehrung_monate} Monate Zeit (§ 26 Abs. 3 StVG). Wie ein Bescheid aufgebaut ist und welche Angaben er enthalten muss, erklärt die Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}.</p>

<h2>Wenn der Messwert knapp über der Grenze liegt</h2>
<p>Gerade in dieser Stufe lohnt der genaue Blick auf die Zahlen. Bis ${T.grenze_kmh} km/h Messwert zieht die Behörde ${T.kmh_bis_100} km/h ab. In der 50er-Zone führt ein Messwert von 73 km/h zu ${h.num(speeding({ limit: 50, measured: 73, inner: true }).over)} km/h, ein Messwert von 74 km/h zu ${h.num(speeding({ limit: 50, measured: 74, inner: true }).over)} km/h und damit zu einem Punkt. Auf der Autobahn mit Tempo 120 gilt die Prozentregel: Ein Messwert von 144 km/h wird auf ${h.num(speeding({ limit: 120, measured: 144, inner: false }).vorwerfbar)} km/h abgerundet, das sind ${h.num(speeding({ limit: 120, measured: 144, inner: false }).over)} km/h zu viel und ${h.eur(speeding({ limit: 120, measured: 144, inner: false }).fine)}. Der ${h.a('bussgeldrechner', 'Bußgeldrechner')} rechnet den Abzug automatisch, wenn Sie den gemessenen Wert eingeben.</p>

<h2>Lkw und Gespanne liegen anders</h2>
<p>Für Pkw ist dies die letzte punktfreie Stufe. In Tabelle 1 a, also für Lkw über 3,5 Tonnen und Fahrzeuge mit Anhänger, kostet dieselbe Überschreitung ${h.eur(speeding({ limit: 50, measured: 70, inner: true, tolerance: false, cls: 'a' }).fine)} innerorts und bringt bereits ${h.num(speeding({ limit: 50, measured: 70, inner: true, tolerance: false, cls: 'a' }).points)} Punkt. Wer mit Wohnwagen oder Bootsanhänger unterwegs ist, kann sich also nicht auf die Pkw-Werte verlassen.</p>
<p>Motorräder werden dagegen wie Pkw behandelt und bleiben in Tabelle 1 c. Busse mit Fahrgästen und Gefahrguttransporte fallen unter Tabelle 1 b, wo 16 bis 20 km/h innerorts ${h.eur(speeding({ limit: 50, measured: 70, inner: true, tolerance: false, cls: 'b' }).fine)} kosten. Wer beruflich solche Fahrzeuge fährt, sollte die Unterschiede kennen, denn auch die Punkte setzen dort früher ein als beim Pkw.</p>`,
  },
  en: {
    slug: '20-kmh-over-the-limit',
    nav: '20 km/h over',
    card: 'The last band without a point, but already with a formal notice and fees.',
    title: '20 km/h Over the Limit Germany 2026: Fees but No Point',
    description: `20 km/h over the limit in Germany 2026: ${en(inn.fine)} in town plus fees, ${en(inn.total, 2)} in total. No Flensburg point, but a formal fine notice instead of a simple warning.`,
    h1: '20 km/h over the limit in Germany: a formal notice, still no point',
    intro: 'Between 16 and 20 km/h over, you get a formal fine notice with fees, but nothing goes on your Flensburg record yet.',
    resume: `Driving a car 16 to 20 km/h too fast in Germany costs ${en(inn.fine)} in a built-up area and ${en(out.fine)} outside towns under table 1 c of the fine catalogue. Both amounts exceed the ${en(V.verwarnung_max)} limit for a simple warning, so you receive a Bußgeldbescheid, the formal fine notice. Section 107 of the Administrative Offences Act adds a fee of five per cent with a minimum of ${en(V.gebuehr_min)}, plus ${en(V.zustellung, 2)} for delivery. The bill therefore reaches ${en(inn.total, 2)} in town and ${en(out.total, 2)} outside. No point is added, because annex 13 of the Driving Licence Ordinance only lists car speeding from more than 20 km/h over. Nothing is entered in the Flensburg register and new drivers on probation face no extra measures. One more km/h changes that: at 21 km/h over in town the fine is ${en(in21.fine)} with one point.`,
    faqs: [
      { q: 'Why does my German speeding fine notice show more than the catalogue amount?', a: `Because a formal notice carries costs. On top of the ${en(inn.fine)} fine for 16 to 20 km/h over in town, Section 107 OWiG adds a fee of at least ${en(V.gebuehr_min)} and ${en(V.zustellung, 2)} for delivery by registered post, giving ${en(inn.total, 2)}. Outside towns the total is ${en(out.total, 2)}. Fines of ${en(V.verwarnung_max)} or less are warnings and carry no such costs.` },
      { q: 'Does 20 km/h over count against my licence when I exchange it for a German one?', a: `No. Offences in the 16 to 20 km/h band are not entered in the Flensburg register, so there is nothing to carry over when you exchange a foreign licence. The register only holds decisions that score points, and car speeding only scores from 21 km/h over. The ${en(inn.fine)} notice becomes final and is paid, but leaves no lasting trace.` },
      { q: 'Is 20 km/h over the limit treated more harshly in a German 30 zone?', a: `The catalogue only looks at the excess in km/h and whether you were inside a built-up area. Driving 50 in a 30 zone costs the same ${en(inn.fine)} as 70 in a 50 zone. Proportionally it is a much larger excess, so the authority may examine whether the circumstances were unusual, but the standard rate stays the same.` },
      { q: 'Can I pay a German fine notice before the two-week objection period ends?', a: `Yes. Paying early is possible and common. The notice becomes final when the ${V.einspruch_wochen}-week period for an objection (Einspruch) ends, counted from the delivery date written on the envelope. Paying does not withdraw your right to object within that period, but most people who pay accept the notice. For this band the amount is ${en(inn.total, 2)} in town.` },
      { q: 'Does a 20 km/h fine count towards the German repeat-offence rule?', a: `No. The repeat rule in Section 4(2) of the fine catalogue ordinance only looks at excesses of at least ${V.beharrlich_kmh} km/h: two of them within a year of the first becoming final usually mean a one-month driving ban. An offence of 16 to 20 km/h is below that line and is not entered in the Flensburg register, so it cannot feed any later escalation.` },
    ],
    body: (h) => `
<h2>The jump from a warning to a formal notice</h2>
<p>For drivers new to Germany, this band is often the first time a speeding letter looks official. Up to 15 km/h over, you get a warning fine with no extras. From 16 km/h, the fine passes the ${h.eur(V.verwarnung_max)} line, the authority must issue a formal Bußgeldbescheid, and fees appear. What does not appear yet is a point. The Driving Licence Ordinance lists car speeding in ${h.src('fevAnl13', 'annex 13')} only from more than 20 km/h, so this is the most expensive band that leaves your record clean. It is also the last one: the ${h.a('kmh-21', 'page on 21 km/h over')} shows what one more km/h brings.</p>

<h2>What the bill adds up to</h2>
<p>Under ${h.src('owig107', 'Section 107 OWiG')}, every formal notice carries a fee of five per cent of the fine, at least ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for formal delivery. Five per cent of ${h.eur(inn.fine)} is only ${h.eur(inn.fine * V.gebuehr_satz, 2)}, so the minimum applies and the extras come to ${h.eur(fIn.total, 2)}. The comparison shows how the totals move across the bands around this line:</p>
${h.table(['Over the limit', 'In town', 'Total in town', 'Outside towns', 'Total outside', 'Points'], stufen.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), i.verwarnung ? 'no fees' : h.eur(i.total, 2), h.eur(o.fine), o.verwarnung ? 'no fees' : h.eur(o.total, 2), h.num(i.points)]), 'Car, speed after tolerance; fees under Section 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The step from 15 to 16 km/h roughly doubles what you pay in town, the steepest relative rise anywhere in the table.</p>

<h2>The old "60 euros means a point" rule</h2>
<p>Expat forums often repeat that any fine of 60 euros or more brings a Flensburg point. That is only half the rule. Section 28(3) of the Road Traffic Act requires both a fine of at least 60 euros (or a driving ban) and an offence listed in annex 13. Outside towns, this band costs exactly ${h.eur(out.fine)}, so the amount is reached, yet it scores nothing because the band is missing from the list. The rules for the points that do apply are on the page about ${h.a('punkte-in-flensburg', 'Flensburg points')}.</p>

<h2>How the letters arrive</h2>
<p>A camera offence usually starts with an Anhörungsbogen, a hearing form, sent to the registered keeper. It shows the place, time, measured speed and the speed after tolerance. You must give your personal details; anything about the offence itself is voluntary. The formal notice follows in a yellow envelope with the delivery date printed on it. From that date you have ${V.einspruch_wochen} weeks to lodge an objection (Einspruch) under Section 67 OWiG. After that, the notice is final. If you moved house in the meantime, register your new address promptly: German authorities send notices to the address in the population register, and the deadline runs from delivery there. The anatomy of a notice is explained on the ${h.a('bussgeldbescheid', 'fine notice page')}.</p>

<h2>Close to the line: checking the tolerance</h2>
<p>Because 21 km/h scores a point, it is worth checking the arithmetic. Readings up to ${T.grenze_kmh} km/h lose ${T.kmh_bis_100} km/h, so in a 50 zone a reading of 73 km/h means ${h.num(speeding({ limit: 50, measured: 73, inner: true }).over)} km/h over and 74 km/h means ${h.num(speeding({ limit: 50, measured: 74, inner: true }).over)}. On an Autobahn section limited to 120 km/h, the three per cent rule applies: a reading of 144 km/h becomes ${h.num(speeding({ limit: 120, measured: 144, inner: false }).vorwerfbar)} km/h, ${h.num(speeding({ limit: 120, measured: 144, inner: false }).over)} km/h over, costing ${h.eur(speeding({ limit: 120, measured: 144, inner: false }).fine)}. Enter the measured figure in the ${h.a('bussgeldrechner', 'fine calculator')} and it applies the deduction for you.</p>

<h2>Towing changes the picture</h2>
<p>The point-free band only exists for cars and motorcycles. With a trailer or caravan, or in a lorry over 3.5 tonnes, table 1 a applies: the same excess in town costs ${h.eur(speeding({ limit: 50, measured: 70, inner: true, tolerance: false, cls: 'a' }).fine)} and scores ${h.num(speeding({ limit: 50, measured: 70, inner: true, tolerance: false, cls: 'a' }).points)} point. A van under 3.5 tonnes counts as a car, but many expats tow a rented trailer for a house move without knowing the stricter table exists.</p>`,
  },
});
