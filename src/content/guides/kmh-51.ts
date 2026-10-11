import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, toleranz } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const inn = speeding({ limit: 50, measured: 101, inner: true, tolerance: false });
const out = speeding({ limit: 100, measured: 151, inner: false, tolerance: false });
const innV = speeding({ limit: 50, measured: 101, inner: true, tolerance: false, intent: true });
const outV = speeding({ limit: 100, measured: 151, inner: false, tolerance: false, intent: true });
/** Fahrlässig und vorsätzlich, innerorts und außerorts (§ 3 Abs. 4a BKatV). */
const faelle = [
  { de: 'Innerorts, fahrlässig', en: 'In town, negligent', r: inn },
  { de: 'Innerorts, vorsätzlich', en: 'In town, intentional', r: innV },
  { de: 'Außerorts, fahrlässig', en: 'Outside towns, negligent', r: out },
  { de: 'Außerorts, vorsätzlich', en: 'Outside towns, intentional', r: outV },
];
/** Kleinster Messwert, der nach Toleranz 51 km/h über dem Limit ergibt. */
const ab51 = (limit: number) => { let m = limit + 51; while (toleranz(m) - limit < 51) m++; return m; };
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-51',
  group: 'tempo',
  order: 170,
  mini: 'kmh51',
  related: ['kmh-41', 'kmh-71', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'fahrverbot', 'bussgeldbescheid'],
  sources: ['bkatv', 'bkatAnhang', 'owig107', 'stvg25', 'fevAnl13'],
  de: {
    slug: '51-kmh-zu-schnell',
    nav: '51 km/h zu schnell',
    card: 'Zwei Monate Fahrverbot innerorts, einer außerorts, und was Vorsatz am Betrag ändert.',
    title: '51 km/h zu schnell 2026: zwei Monate Fahrverbot innerorts',
    description: `51 km/h zu schnell 2026: innerorts ${de(inn.fine)} und zwei Monate Fahrverbot, außerorts ${de(out.fine)} und ein Monat. Bei Vorsatz verdoppelt sich das Bußgeld nach BKatV.`,
    h1: '51 km/h zu schnell: zwei Monate innerorts und die Frage des Vorsatzes',
    intro: 'Ab 51 km/h verdoppelt sich innerorts die Dauer des Fahrverbots, und bei so deutlichen Überschreitungen rückt der Vorsatz in den Blick.',
    resume: `Wer mit dem Pkw 51 bis 60 km/h zu schnell war, bekommt innerorts ${de(inn.fine)}, zwei Punkte und zwei Monate Fahrverbot. Außerorts sind es ${de(out.fine)}, zwei Punkte und ein Monat. Mit den Kosten nach § 107 OWiG ergeben sich ${de(inn.total, 2)} innerorts und ${de(out.total, 2)} außerorts. Innerorts ist dies die erste Stufe, bei der die Gebühr von fünf Prozent über der Mindestgebühr von ${de(V.gebuehr_min)} liegt. Alle Beträge des Katalogs gehen von fahrlässigem Handeln aus. Stellt die Behörde Vorsatz fest, verdoppelt § 3 Abs. 4a BKatV den Regelsatz: innerorts auf ${de(innV.fine)}, außerorts auf ${de(outV.fine)}. Die Dauer des Fahrverbots bleibt dabei unverändert. Wer in den zwei Jahren vor der Tat kein Fahrverbot hatte, kann den Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft wählen; die zwei Monate laufen am Stück. In der 50er-Zone braucht es dafür einen Messwert von ${ab51(50)} km/h, weil über ${T.grenze_kmh} km/h ${T.prozent_ueber_100 * 100} Prozent abgezogen werden.`,
    faqs: [
      { q: 'Wie viel kostet 51 km/h zu schnell innerorts insgesamt?', a: `${de(inn.fine)} Bußgeld, dazu ${de(inn.fees, 2)} Kosten. Fünf Prozent von ${de(inn.fine)} sind ${de(inn.fine * V.gebuehr_satz)}, das liegt über der Mindestgebühr von ${de(V.gebuehr_min)}, plus ${de(V.zustellung, 2)} Zustellung. Zusammen ${de(inn.total, 2)}, zwei Punkte und zwei Monate Fahrverbot nach Tabelle 1 c der BKatV. Bei Vorsatz wären es ${de(innV.total, 2)}.` },
      { q: 'Was bedeutet Vorsatz bei einer Geschwindigkeitsüberschreitung?', a: 'Der Bußgeldkatalog geht nach § 1 Abs. 2 BKatV von Fahrlässigkeit und gewöhnlichen Umständen aus. Vorsatz liegt vor, wenn jemand das Limit kennt und es bewusst überschreitet oder die Überschreitung billigend in Kauf nimmt. Die Verordnung nennt dafür keine feste km/h-Grenze; ob Vorsatz vorliegt, entscheiden Behörde oder Gericht im Einzelfall anhand der Umstände.' },
      { q: 'Verlängert Vorsatz das Fahrverbot bei 51 km/h zu schnell?', a: `Nein. § 3 Abs. 4a BKatV verdoppelt nur den Regelsatz, wenn dieser über ${de(V.verwarnung_max)} liegt, und rundet auf volle Euro ab. Die Dauer des Fahrverbots steht im Katalog getrennt und bleibt bei zwei Monaten innerorts und einem Monat außerorts. Auch die Punkte ändern sich nicht. Höher werden mit dem Bußgeld allerdings die Gebühren, weil sie fünf Prozent des Betrags ausmachen.` },
      { q: 'Wie viel kostet 51 km/h zu schnell außerorts mit Gebühren?', a: `${de(out.fine)} Bußgeld. Fünf Prozent davon wären ${de(out.fine * V.gebuehr_satz)}, deshalb gilt die Mindestgebühr von ${de(V.gebuehr_min)}; mit ${de(V.zustellung, 2)} Zustellung kommen ${de(out.total, 2)} zusammen. Dazu zwei Punkte und ein Monat Fahrverbot. Wird Vorsatz festgestellt, verdoppelt sich das Bußgeld auf ${de(outV.fine)}, und der Bescheid lautet dann auf ${de(outV.total, 2)}.` },
      { q: 'Kann ich zwei Monate Fahrverbot auf zweimal einen Monat aufteilen?', a: `Nein. Das Fahrverbot läuft als zusammenhängender Zeitraum ab dem Tag, an dem die Behörde den Führerschein in Verwahrung nimmt. Wählen können Sie nur den Beginn, und das auch nur, wenn in den zwei Jahren vor der Tat kein Fahrverbot rechtskräftig wurde. Dann haben Sie dafür ${V.fahrverbot_schonfrist_monate} Monate ab Rechtskraft Zeit (§ 25 Abs. 2a StVG).` },
    ],
    body: (h) => `
<h2>Wo die Dauer sich verdoppelt</h2>
<p>Zwischen 50 und 51 km/h ändert sich innerorts nicht nur der Betrag. Der Bußgeldkatalog verlängert das Fahrverbot von einem auf zwei Monate, das Bußgeld steigt von ${h.eur(speeding({ limit: 50, measured: 100, inner: true, tolerance: false }).fine)} auf ${h.eur(inn.fine)}. Außerorts bleibt es bei einem Monat, der Betrag wächst auf ${h.eur(out.fine)}. Wer innerorts in diese Stufe fällt, fuhr in einer 50er-Zone mehr als doppelt so schnell wie erlaubt, in einer 30er-Zone mit über 80 km/h. Bei solchen Werten fragen Bußgeldstellen genauer nach, ob das Überschreiten noch ein Versehen war. Deshalb ist dies die Stufe, an der die Unterscheidung zwischen Fahrlässigkeit und Vorsatz praktisch wird.</p>

<h2>Fahrlässig oder vorsätzlich: was die Verordnung sagt</h2>
<p>Die Regelsätze gelten nach ${h.src('bkatv', '§ 1 Abs. 2 BKatV')} für fahrlässige Begehung unter gewöhnlichen Tatumständen. Für den Vorsatz enthält § 3 Abs. 4a eine feste Rechenregel: Ist der Regelsatz höher als ${h.eur(V.verwarnung_max)}, wird er verdoppelt und auf den nächsten vollen Euro abgerundet. Das gilt auch dann, wenn er vorher schon wegen Gefährdung oder Sachbeschädigung erhöht wurde. Wann Vorsatz anzunehmen ist, steht nicht in der Verordnung. Eine km/h-Grenze, ab der er automatisch gilt, gibt es nicht. Behörde oder Gericht stützen sich auf die Umstände, etwa wie deutlich das Limit beschildert war. Die Auswirkung auf die Zahlen ist dagegen eindeutig:</p>
${h.table(['Fall', 'Bußgeld', 'Kosten', 'Gesamt', 'Punkte', 'Fahrverbot'], faelle.map((f) => [f.de, h.eur(f.r.fine), h.eur(f.r.fees, 2), h.eur(f.r.total, 2), h.num(f.r.points), `${h.num(f.r.fv)} Mon.`]), 'Pkw, 51 bis 60 km/h nach Toleranz; Vorsatz nach § 3 Abs. 4a BKatV, Kosten nach § 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Auffällig ist die Spalte der Kosten. Weil die Gebühr fünf Prozent des Bußgelds beträgt, steigt sie mit dem Vorsatz mit. Fahrverbot und Punkte bleiben dagegen gleich, der Vorsatz wirkt nur auf das Geld.</p>

<h2>Wo der Bescheid den Vorsatz zeigt</h2>
<p>Ob die Behörde von Vorsatz ausgeht, ergibt sich aus der Tatbeschreibung des Bescheids und aus dem Betrag. Steht dort für 51 km/h innerorts ${h.eur(innV.fine)} statt ${h.eur(inn.fine)}, wurde verdoppelt. Ein Bescheid wird ${V.einspruch_wochen} Wochen nach Zustellung rechtskräftig; bis dahin ist der Einspruch möglich (§ 67 OWiG). Wie die einzelnen Teile eines Bescheids zu lesen sind, erklärt die Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}.</p>

<h2>Zwei Monate am Stück organisieren</h2>
<p>Zwei Monate ohne Führerschein sind mehr als eine Urlaubslösung. Die Frist läuft ohne Unterbrechung ab dem Tag, an dem die Behörde den Führerschein verwahrt, und lässt sich nicht stückeln. Wer in den zwei Jahren vor der Tat kein Fahrverbot hatte, wählt den Beginn innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft (${h.src('stvg25', '§ 25 Abs. 2a StVG')}). Sinnvoll ist ein Zeitraum, in dem Arbeitsweg und Familie ohne Auto funktionieren. Gab es dagegen ein früheres Verbot in diesem Zeitraum, beginnt das neue spätestens einen Monat nach Rechtskraft. Hinzu kommt: Wer zusätzlich eine weitere Strafe mit Fahrverbot erhält, verbüßt beide nacheinander. Mehr zur Abgabe steht auf der Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Messwerte an der Grenze</h2>
<p>Über ${T.grenze_kmh} km/h gilt die Prozentregel auch innerorts, und das verschiebt die Grenze. In der 50er-Zone ergibt ein Messwert von ${h.num(ab51(50))} km/h nach Abzug von ${T.prozent_ueber_100 * 100} Prozent ${h.num(toleranz(ab51(50)))} km/h, also ${h.num(speeding({ limit: 50, measured: ab51(50), inner: true }).over)} km/h zu viel. Ein Messwert von ${h.num(ab51(50) - 1)} km/h führt erst zu ${h.num(speeding({ limit: 50, measured: ab51(50) - 1, inner: true }).over)} km/h und damit zu einem Monat. Wer nur mit dem festen Abzug von ${T.kmh_bis_100} km/h rechnet, schätzt den vorgeworfenen Wert in diesem Bereich zu hoch ein. Auf der Landstraße mit Tempo 100 braucht es für 51 km/h einen Messwert von ${h.num(ab51(100))} km/h (${h.num(speeding({ limit: 100, measured: ab51(100), inner: false }).over)} km/h nach Abzug). Der ${h.a('bussgeldrechner', 'Bußgeldrechner')} rechnet beide Varianten, mit und ohne Vorsatz.</p>

<h2>Lkw, Gespann und Bus: drei Monate schon hier</h2>
<p>Für Fahrzeuge der Tabelle 1 a, also Lkw über 3,5 Tonnen und Kraftfahrzeuge mit Anhänger, ist die Stufe 51 bis 60 km/h deutlich härter. Innerorts sieht der Katalog ${h.eur(speeding({ limit: 50, measured: 101, inner: true, tolerance: false, cls: 'a' }).fine)} und ${h.num(speeding({ limit: 50, measured: 101, inner: true, tolerance: false, cls: 'a' }).fv)} Monate Fahrverbot vor, außerorts ${h.eur(speeding({ limit: 80, measured: 131, inner: false, tolerance: false, cls: 'a' }).fine)} und ${h.num(speeding({ limit: 80, measured: 131, inner: false, tolerance: false, cls: 'a' }).fv)} Monate. Für Busse mit Fahrgästen und Gefahrgut nach Tabelle 1 b sind es innerorts ${h.eur(speeding({ limit: 50, measured: 101, inner: true, tolerance: false, cls: 'b' }).fine)}. Für Berufskraftfahrer ist das Fahrverbot dabei oft die schwerere Folge als das Bußgeld, weil es auch den Arbeitsplatz berührt. Auch hier gilt: Vorsatz verdoppelt den Betrag, nicht die Dauer.</p>

<h2>Punkte und die nächste Stufe</h2>
<p>Die Stufe bringt zwei Punkte nach ${h.src('fevAnl13', 'Anlage 13 der FeV')}, getilgt ${h.num(P.punkte.tilgung_2p_monate)} Monate nach Rechtskraft. In der Probezeit ist sie ein A-Verstoß. Innerorts folgen ab 61 km/h drei Monate Fahrverbot, außerorts zwei Monate; ab 71 km/h gilt an beiden Orten das Höchstmaß, beschrieben unter ${h.a('kmh-71', '71 km/h zu schnell')}.</p>`,
  },
  en: {
    slug: '51-kmh-over-the-limit',
    nav: '51 km/h over',
    card: 'Two months in town, one outside, and what intent does to the fine.',
    title: '51 km/h Over the Limit Germany 2026: Two-Month Town Ban',
    description: `51 km/h over the limit in Germany 2026: ${en(inn.fine)} and a two-month ban in town, ${en(out.fine)} and one month outside. If intent is found, the standard fine is doubled.`,
    h1: '51 km/h over the limit in Germany: two months and the question of intent',
    intro: 'From 51 km/h over, a ban in town doubles to two months, and at this level authorities start asking whether the speeding was deliberate.',
    resume: `Driving a car 51 to 60 km/h too fast in Germany costs ${en(inn.fine)}, two Flensburg points and a two-month Fahrverbot (driving ban) in a built-up area. Outside towns it is ${en(out.fine)}, two points and one month. With the costs under Section 107 OWiG, the notices come to ${en(inn.total, 2)} and ${en(out.total, 2)}. In town this is the first band where five per cent of the fine exceeds the ${en(V.gebuehr_min)} minimum fee. Every catalogue amount assumes negligence. If the authority finds that you sped deliberately, Section 3(4a) of the fine catalogue ordinance doubles the standard fine, to ${en(innV.fine)} in town and ${en(outV.fine)} outside towns. The length of the ban stays the same. If you had no ban in the two years before the offence, you can choose the start within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final; the two months then run without a break.`,
    faqs: [
      { q: 'Why is my German fine for 51 km/h over twice the catalogue amount?', a: `Because the authority treated the offence as intentional. The catalogue rate for 51 to 60 km/h over in town is ${en(inn.fine)}, and Section 3(4a) BKatV doubles any rate above ${en(V.verwarnung_max)} for intent, giving ${en(innV.fine)}. The fee rises with it, to ${en(innV.fees, 2)} including delivery. The two-month ban and the two points stay the same as for negligence.` },
      { q: 'Is there a speed at which German authorities automatically assume intent?', a: 'No. The ordinance contains no km/h threshold for intent. The catalogue assumes negligence and ordinary circumstances (Section 1(2) BKatV), and intent has to be established from the facts of the case, such as how the limit was signed. Whether it is found is decided by the authority or, after an objection, the local court.' },
      { q: 'How do people manage a two-month driving ban in Germany?', a: `The two months run in one block from the day the authority receives your licence and cannot be split. With no ban in the previous two years, you choose the start within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final. Residents often combine public transport passes, cycling and car-sharing with a passenger, or pick a period of leave.` },
      { q: 'Is 51 km/h over outside towns treated like 51 km/h over in town?', a: `No. Outside towns this band carries ${en(out.fine)}, two points and one month, compared with ${en(inn.fine)}, two points and two months in town. The totals with fees are ${en(out.total, 2)} and ${en(inn.total, 2)}. Outside towns the two-month ban only starts from 61 km/h over, and three months from 71 km/h.` },
      { q: 'Does a two-month German ban for 51 km/h over stop me riding my motorbike too?', a: 'Usually yes. A Fahrverbot under Section 25 StVG forbids driving motor vehicles of every kind or of a certain kind, and the notice says which. Most speeding notices cover all motor vehicles, so a motorbike, a moped or a car are all off limits for the two months. Bicycles and pedal-assist e-bikes up to 25 km/h are not motor vehicles in this sense.' },
    ],
    body: (h) => `
<h2>Double the ban in town</h2>
<p>At 51 km/h over, German speeding fines change character in town. The ban doubles from one month to two, and the fine rises from ${h.eur(speeding({ limit: 50, measured: 100, inner: true, tolerance: false }).fine)} to ${h.eur(inn.fine)}. Outside towns the ban stays at one month and the fine is ${h.eur(out.fine)}. In a 50 zone, this band means more than twice the limit; in a 30 zone, over 80 km/h past houses and pavements. At these speeds, fine offices look harder at whether it can still have been a lapse, which is why intent becomes a practical question here.</p>

<h2>Negligence, intent and the doubling rule</h2>
<p>The catalogue figures are set, under ${h.src('bkatv', 'Section 1(2) BKatV')}, for negligent offences in ordinary circumstances. For intent, Section 3(4a) has a fixed rule: any standard fine above ${h.eur(V.verwarnung_max)} is doubled and rounded down to the whole euro, even if it was already increased for endangering others or causing damage. The ordinance does not say when intent applies, and there is no speed at which it is automatic. The effect on the numbers, though, is exact:</p>
${h.table(['Case', 'Fine', 'Costs', 'Total', 'Points', 'Ban'], faelle.map((f) => [f.en, h.eur(f.r.fine), h.eur(f.r.fees, 2), h.eur(f.r.total, 2), h.num(f.r.points), `${h.num(f.r.fv)} mo.`]), 'Car, 51 to 60 km/h after tolerance; intent under Section 3(4a) BKatV, costs under Section 107 OWiG', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Only money changes with intent. The fee grows because it is five per cent of the fine, while the ban and the points are identical in both columns.</p>

<h2>Spotting intent on the notice</h2>
<p>A notice that treats the offence as deliberate says so in the description and shows the doubled amount, ${h.eur(innV.fine)} instead of ${h.eur(inn.fine)} for this band in town. If your German is not yet fluent, look for the words "vorsätzlich" (intentional) and "fahrlässig" (negligent) in the text. The notice becomes final ${V.einspruch_wochen} weeks after delivery, and until then an objection is possible under Section 67 OWiG. The ${h.a('bussgeldbescheid', 'fine notice page')} explains the layout line by line.</p>

<h2>Living without a car for two months</h2>
<p>One month can often be absorbed by a holiday. Two months take planning. The ban runs as one block from the day the authority holds your licence (${h.src('stvg25', 'Section 25 StVG')}); it cannot be split into two separate months. With no ban in the previous two years, you choose the start within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final. If you had a ban in that period, the new one starts no later than one month after it becomes final. For an EU licence held by a resident, the licence itself goes to the authority. The ${h.a('fahrverbot', 'driving ban guide')} covers the handover.</p>

<h2>Readings near the line</h2>
<p>In town, readings above ${T.grenze_kmh} km/h lose ${T.prozent_ueber_100 * 100} per cent, not the flat ${T.kmh_bis_100} km/h. In a 50 zone, ${h.num(ab51(50))} km/h on the device becomes ${h.num(toleranz(ab51(50)))} km/h, which is ${h.num(speeding({ limit: 50, measured: ab51(50), inner: true }).over)} km/h over; ${h.num(ab51(50) - 1)} km/h gives only ${h.num(speeding({ limit: 50, measured: ab51(50) - 1, inner: true }).over)} and a one-month ban. On a 100 km/h road you need a reading of ${h.num(ab51(100))} km/h to reach the band. The ${h.a('bussgeldrechner', 'fine calculator')} shows both the negligent and the intentional figure.</p>

<h2>Lorries, trailers and buses</h2>
<p>Professional drivers face a stricter scale. In a lorry over 3.5 tonnes or a car towing a trailer (table 1 a), 51 to 60 km/h over costs ${h.eur(speeding({ limit: 50, measured: 101, inner: true, tolerance: false, cls: 'a' }).fine)} with a ${h.num(speeding({ limit: 50, measured: 101, inner: true, tolerance: false, cls: 'a' }).fv)}-month ban in town and ${h.eur(speeding({ limit: 80, measured: 131, inner: false, tolerance: false, cls: 'a' }).fine)} with ${h.num(speeding({ limit: 80, measured: 131, inner: false, tolerance: false, cls: 'a' }).fv)} months outside. A bus carrying passengers or a hazardous goods vehicle (table 1 b) pays ${h.eur(speeding({ limit: 50, measured: 101, inner: true, tolerance: false, cls: 'b' }).fine)} in town. For anyone who drives for a living, the ban hits harder than the money, and intent doubles only the fine, never the ban.</p>

<h2>What comes next in the table</h2>
<p>This band scores two points under ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, deleted ${h.num(P.punkte.tilgung_2p_monate)} months after the decision is final. In town the ban grows to three months from 61 km/h over; outside towns to two months from 61 and three months from 71. The top of the table is on the ${h.a('kmh-71', 'page on 71 km/h over')}.</p>`,
  },
});
