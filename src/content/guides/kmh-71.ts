import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, increase } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const inn = speeding({ limit: 50, measured: 121, inner: true, tolerance: false });
const out = speeding({ limit: 100, measured: 171, inner: false, tolerance: false });
const innV = speeding({ limit: 50, measured: 121, inner: true, tolerance: false, intent: true });
const outV = speeding({ limit: 100, measured: 171, inner: false, tolerance: false, intent: true });
/** Die offene letzte Stufe: 71, 90 und 120 km/h zu schnell kosten dasselbe. */
const plateau = [61, 71, 90, 120].map((over) => ({
  over,
  i: speeding({ limit: 50, measured: 50 + over, inner: true, tolerance: false }),
  o: speeding({ limit: 100, measured: 100 + over, inner: false, tolerance: false }),
}));
const klasse = (cls: 'a' | 'b' | 'c') => ({
  i: speeding({ limit: 50, measured: 121, inner: true, tolerance: false, cls }),
  o: speeding({ limit: 80, measured: 151, inner: false, tolerance: false, cls }),
});
const STGB315D = 'https://www.gesetze-im-internet.de/stgb/__315d.html';
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'kmh-71',
  group: 'tempo',
  order: 180,
  mini: 'kmh71',
  related: ['kmh-51', 'kmh-41', 'geschwindigkeitsueberschreitung', 'bussgeldrechner', 'fahrverbot', 'punkte-in-flensburg'],
  sources: ['bkatAnhang', 'bkatv', 'stvg25', 'fevAnl13', 'owig107'],
  de: {
    slug: '71-kmh-zu-schnell',
    nav: '71 km/h zu schnell',
    card: 'Das Ende der Tabelle: Höchstsatz, drei Monate, und wo das Strafrecht beginnt.',
    title: '71 km/h zu schnell 2026: Höchstsatz und drei Monate',
    description: `71 km/h zu schnell 2026: innerorts ${de(inn.fine)}, außerorts ${de(out.fine)}, je drei Monate Fahrverbot und zwei Punkte. Wo der Katalog endet und § 315d StGB beginnen kann.`,
    h1: '71 km/h zu schnell: das obere Ende des Bußgeldkatalogs',
    intro: 'Mit 71 km/h über dem Limit ist die letzte Zeile der Tempotabelle erreicht; darüber steigt im Katalog nichts mehr.',
    resume: `Wer mit dem Pkw mehr als 70 km/h zu schnell war, erreicht die höchste Stufe der Tabelle 1 c. Innerorts kostet sie ${de(inn.fine)}, außerorts ${de(out.fine)}, an beiden Orten mit zwei Punkten und drei Monaten Fahrverbot. Mit Gebühren und Zustellung stehen ${de(inn.total, 2)} beziehungsweise ${de(out.total, 2)} auf dem Bescheid. Die Stufe ist nach oben offen: 71, 90 oder 120 km/h zu schnell führen zum selben Regelsatz. Höher wird es bei Vorsatz, den § 3 Abs. 4a BKatV mit der Verdoppelung auf ${de(innV.fine)} innerorts und ${de(outV.fine)} außerorts belegt. Drei Monate sind die Höchstdauer eines Fahrverbots nach § 25 StVG. Eine bestimmte Geschwindigkeit macht die Fahrt nicht automatisch zur Straftat. Strafbar nach § 315d Abs. 1 Nr. 3 StGB ist, wer sich mit nicht angepasster Geschwindigkeit grob verkehrswidrig und rücksichtslos fortbewegt, um eine höchstmögliche Geschwindigkeit zu erreichen. Ob das vorliegt, entscheiden Staatsanwaltschaft und Gericht.`,
    faqs: [
      { q: 'Wie viel kostet 71 km/h zu schnell innerorts?', a: `${de(inn.fine)} nach Tabelle 1 c der BKatV. Die Gebühr beträgt fünf Prozent, also ${de(inn.fees - V.zustellung)}, dazu ${de(V.zustellung, 2)} Zustellung, insgesamt ${de(inn.total, 2)}. Außerdem zwei Punkte und drei Monate Fahrverbot. Bei Vorsatz verdoppelt sich das Bußgeld auf ${de(innV.fine)}, der Bescheid lautet dann über ${de(innV.total, 2)}. Die Dauer des Fahrverbots bleibt gleich.` },
      { q: 'Ist 100 km/h zu schnell teurer als 71 km/h zu schnell?', a: `Nicht nach dem Katalog. Die letzte Zeile gilt für jede Überschreitung über 70 km/h, deshalb kosten 71 und 100 km/h zu schnell innerorts gleichermaßen ${de(inn.fine)}. Behörden und Gerichte können aber von besonderen Umständen ausgehen und abweichen. Außerdem prüfen Polizei und Staatsanwaltschaft bei extremen Werten, ob ein Fall des § 315d StGB vorliegt.` },
      { q: 'Ab wie viel km/h ist zu schnelles Fahren eine Straftat?', a: 'Eine feste Grenze gibt es nicht. § 315d Abs. 1 Nr. 3 StGB stellt das Fahren mit nicht angepasster Geschwindigkeit unter Strafe, wenn es grob verkehrswidrig und rücksichtslos geschieht, um eine höchstmögliche Geschwindigkeit zu erreichen. Diese Merkmale müssen im Einzelfall festgestellt werden. Die Strafe reicht bis zu zwei Jahren Freiheitsstrafe oder Geldstrafe, mit Gefährdung anderer bis zu fünf Jahren.' },
      { q: 'Gibt es mehr als drei Monate Fahrverbot für 71 km/h zu schnell?', a: `Nicht in einem einzelnen Bußgeldverfahren. § 25 StVG begrenzt das Fahrverbot auf drei Monate. Mehrere Fahrverbote aus verschiedenen Taten laufen allerdings nacheinander, sodass die Gesamtzeit länger werden kann. Eine Entziehung der Fahrerlaubnis ist etwas anderes: Sie folgt aus Strafurteilen oder aus dem Punktesystem ab ${P.punkte.entzug_ab} Punkten, nicht aus dem Bußgeldkatalog.` },
      { q: 'Wie viele Punkte gibt es für 71 km/h zu schnell?', a: `Als Ordnungswidrigkeit mit Fahrverbot zwei Punkte nach Anlage 13 der FeV, getilgt ${P.punkte.tilgung_2p_monate} Monate nach Rechtskraft. Wird die Fahrt dagegen als Straftat verurteilt, bewertet Anlage 13 sie mit zwei Punkten, oder mit drei Punkten, wenn das Gericht die Fahrerlaubnis entzieht oder eine isolierte Sperre anordnet. Die Tilgungsfrist für drei Punkte beträgt ${P.punkte.tilgung_3p_monate / 12} Jahre.` },
    ],
    body: (h) => `
<h2>Eine Stufe ohne Obergrenze</h2>
<p>Tabelle 1 c des Bußgeldkatalogs endet mit der Zeile »mehr als 70 km/h«. Wer sie erreicht, zahlt den Höchstsatz der Tabelle, und der Satz bleibt derselbe, gleichgültig wie weit die Überschreitung darüber hinausgeht. Auch das Fahrverbot ist mit drei Monaten am Ende angekommen, denn ${h.src('stvg25', '§ 25 StVG')} lässt nicht mehr zu. Innerorts hat sich gegenüber der Stufe darunter nur der Betrag verändert, die drei Monate gelten dort schon ab 61 km/h. Außerorts kommt mit 71 km/h der dritte Monat hinzu. Der Katalog hat damit seine Mittel ausgeschöpft. Was darüber hinaus geschieht, regelt nicht mehr die Tabelle, sondern das Gesetz an anderer Stelle: der Vorsatz in § 3 Abs. 4a BKatV, die Abweichung im Einzelfall und, bei bestimmten Fahrweisen, das Strafgesetzbuch.</p>
${h.table(['Zu schnell', 'Innerorts', 'Fahrverbot', 'Außerorts', 'Fahrverbot'], plateau.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), `${h.num(i.fv)} Monate`, h.eur(o.fine), `${h.num(o.fv)} Monate`]), 'Pkw, Werte nach Toleranz, Tabelle 1 c; ab 71 km/h gleichbleibend', ['l', 'r', 'r', 'r', 'r'])}

<h2>Vorsatz als einzige feste Steigerung</h2>
<p>Die Regelsätze gelten nach ${h.src('bkatv', '§ 1 Abs. 2 BKatV')} für fahrlässiges Handeln. Bei Überschreitungen dieser Größe prüfen Bußgeldstellen häufig, ob Vorsatz vorlag. Wird er festgestellt, verdoppelt sich das Bußgeld: innerorts auf ${h.eur(innV.fine)} mit ${h.eur(innV.total, 2)} Gesamtbetrag, außerorts auf ${h.eur(outV.fine)} mit ${h.eur(outV.total, 2)}. Fahrverbot und Punkte ändern sich nicht. Eine km/h-Grenze, ab der Vorsatz gilt, nennt die Verordnung nicht.</p>

<h2>Wo das Strafrecht beginnen kann</h2>
<p><a href="${STGB315D}" target="_blank" rel="nofollow noopener noreferrer">§ 315d StGB</a> stellt verbotene Kraftfahrzeugrennen unter Strafe. Absatz 1 Nummer 3 erfasst auch den Einzelnen ohne Gegner: Strafbar ist, wer sich als Kraftfahrzeugführer »mit nicht angepasster Geschwindigkeit und grob verkehrswidrig und rücksichtslos fortbewegt, um eine höchstmögliche Geschwindigkeit zu erreichen«. Das Bundesverfassungsgericht hat diese Vorschrift 2022 für mit dem Grundgesetz vereinbar erklärt. Wichtig ist, was darin fehlt: eine Zahl. Ob eine Fahrt strafbar ist, hängt von allen Merkmalen zusammen ab, also von der Absicht, so schnell wie möglich zu fahren, vom groben Verstoß gegen Verkehrsregeln und von der Rücksichtslosigkeit. Eine Messung von 71 km/h zu viel genügt dafür für sich nicht, und umgekehrt kann eine Fahrt mit geringerer Überschreitung den Tatbestand erfüllen, wenn diese Merkmale vorliegen.</p>
<p>Die Strafdrohung lautet Freiheitsstrafe bis zu zwei Jahren oder Geldstrafe. Werden dabei Leib oder Leben eines anderen oder fremde Sachen von bedeutendem Wert gefährdet, steigt sie auf bis zu fünf Jahre (Absatz 2). Mit Todesfolge oder schwerer Gesundheitsschädigung sieht Absatz 5 ein Jahr bis zehn Jahre vor. Über einen solchen Vorwurf entscheiden Staatsanwaltschaft und Strafgericht, nicht die Bußgeldstelle, und der Bußgeldkatalog gibt dafür keine Werte vor.</p>

<h2>Gefährdung und Sachschaden: Tabelle 4</h2>
<p>Neben dem Vorsatz kennt die Verordnung eine zweite feste Erhöhung. Nach § 3 Abs. 3 BKatV steigt ein Regelsatz von mehr als ${h.eur(V.verwarnung_max)}, wenn andere gefährdet wurden oder eine Sache beschädigt wurde, nach den Werten der Tabelle 4. Außerorts wird aus ${h.eur(out.fine)} bei Gefährdung ${h.eur(increase(out.fine, 'danger'))}, bei Sachbeschädigung ${h.eur(increase(out.fine, 'damage'))}. Für den Innerortssatz von ${h.eur(inn.fine)} enthält Tabelle 4 keine Zeile mehr; ihre höchsten Ausgangswerte liegen darunter. Der Rechner lässt diesen Betrag deshalb unverändert, eine Erhöhung bleibt dann der Einzelfallentscheidung überlassen. Mit Vorsatz zusammen wird zuerst erhöht und dann verdoppelt, so ordnet es § 3 Abs. 4a an. Außerorts mit Gefährdung und Vorsatz ergäbe das ${h.eur(increase(out.fine, 'danger') * 2)}.</p>

<h2>Schwere Fahrzeuge an der Spitze</h2>
<p>Die oberste Stufe sieht je nach Fahrzeugklasse unterschiedlich aus. Tabelle 1 a und 1 b haben ihre letzte Zeile schon bei mehr als 60 km/h:</p>
${h.table(['Fahrzeug', 'Innerorts', 'Außerorts', 'Fahrverbot'], [
  ['Pkw, Motorrad (Tabelle 1 c)', h.eur(klasse('c').i.fine), h.eur(klasse('c').o.fine), `${h.num(klasse('c').i.fv)} Monate`],
  ['Lkw über 3,5 t, mit Anhänger (Tabelle 1 a)', h.eur(klasse('a').i.fine), h.eur(klasse('a').o.fine), `${h.num(klasse('a').i.fv)} Monate`],
  ['Bus mit Fahrgästen, Gefahrgut (Tabelle 1 b)', h.eur(klasse('b').i.fine), h.eur(klasse('b').o.fine), `${h.num(klasse('b').i.fv)} Monate`],
], '71 km/h zu schnell nach Toleranz, Regelsätze der BKatV', ['l', 'r', 'r', 'r'])}
<p>Auffällig: Für Lkw und Gespanne ist der Höchstsatz derselbe wie für Pkw, nur wird er früher erreicht.</p>

<h2>Drei Monate und das Register</h2>
<p>Für die Ordnungswidrigkeit gibt es zwei Punkte nach ${h.src('fevAnl13', 'Anlage 13 der FeV')}, getilgt ${h.num(P.punkte.tilgung_2p_monate)} Monate nach Rechtskraft. Die drei Monate Fahrverbot lassen sich, wenn es das erste in zwei Jahren ist, innerhalb von ${V.fahrverbot_schonfrist_monate} Monaten nach Rechtskraft antreten. Bei Messwerten über ${T.grenze_kmh} km/h zieht die Behörde ${T.prozent_ueber_100 * 100} Prozent ab; den eigenen Wert prüft der ${h.a('bussgeldrechner', 'Bußgeldrechner')}. Zur Abgabe des Führerscheins siehe ${h.a('fahrverbot', 'Fahrverbot')}, zum Punktestand ${h.a('punkte-in-flensburg', 'Punkte in Flensburg')}, zur Stufe darunter ${h.a('kmh-51', '51 km/h zu schnell')}.</p>`,
  },
  en: {
    slug: '71-kmh-over-the-limit',
    nav: '71 km/h over',
    card: 'The top of the table: maximum fine, three months, and where criminal law can start.',
    title: '71 km/h Over the Limit Germany 2026: Top Fine, 3-Month Ban',
    description: `71 km/h over the limit in Germany 2026: ${en(inn.fine)} in town, ${en(out.fine)} outside, a three-month ban and two points. Where the catalogue ends and criminal law may begin.`,
    h1: '71 km/h over the limit in Germany: the top of the fine table',
    intro: 'At 71 km/h over, you reach the last line of the German speeding table; beyond it, the catalogue adds nothing more.',
    resume: `Driving a car more than 70 km/h too fast in Germany reaches the highest band of table 1 c in the fine catalogue. It costs ${en(inn.fine)} in a built-up area and ${en(out.fine)} outside towns, with two Flensburg points and a three-month Fahrverbot (driving ban) in both places. With the fee and delivery costs, the notice comes to ${en(inn.total, 2)} or ${en(out.total, 2)}. The band has no upper end: 71, 90 or 120 km/h over all carry the same standard fine. It only rises if intent is found, which doubles it under Section 3(4a) BKatV to ${en(innV.fine)} in town and ${en(outV.fine)} outside. Three months is the longest ban Section 25 of the Road Traffic Act allows. No particular speed turns a drive into a crime by itself. Section 315d(1) no. 3 of the Criminal Code punishes driving at an inappropriate speed, grossly against traffic rules and recklessly, in order to reach the highest possible speed. Prosecutors and courts decide whether that applies.`,
    faqs: [
      { q: 'Can I be prosecuted in Germany just for driving 71 km/h over the limit?', a: 'Not on the speed alone. Section 315d(1) no. 3 of the Criminal Code requires driving at an inappropriate speed, grossly against traffic rules and recklessly, in order to reach the highest possible speed. All of these must be established in the individual case. Without them, 71 km/h over remains an administrative offence with a fine, two points and a three-month ban.' },
      { q: 'What is the highest speeding fine for a car in Germany?', a: `Under the standard catalogue, ${en(inn.fine)} in town and ${en(out.fine)} outside towns, for anything above 70 km/h over. If the authority finds intent, Section 3(4a) BKatV doubles these to ${en(innV.fine)} and ${en(outV.fine)}. Fees of five per cent plus ${en(V.zustellung, 2)} delivery come on top. Authorities may also depart from the standard rate in unusual circumstances.` },
      { q: 'Is driving fast on an unrestricted Autobahn ever a crime in Germany?', a: 'Where no limit is signed, there is no speeding fine at all, because there is no limit to exceed. Section 315d of the Criminal Code does not depend on a signed limit, though: it targets driving at an inappropriate speed, grossly against traffic rules and recklessly, to reach the highest possible speed. Whether a specific drive meets that test is for prosecutors and courts.' },
      { q: 'Can a German court ban me for longer than three months for speeding?', a: `In administrative proceedings, no. Section 25 StVG caps a Fahrverbot at three months. Separate bans for separate offences run one after another, so the total can be longer. Losing the licence altogether (Entziehung) is a different measure that follows from criminal convictions or from reaching ${P.punkte.entzug_ab} points, not from the fine catalogue.` },
    ],
    body: (h) => `
<h2>The band without a ceiling</h2>
<p>Table 1 c of the fine catalogue ends with the line "more than 70 km/h". Reach it and you pay the table's highest amount, which stays the same however far above 70 you were. The ban, too, has reached its maximum of three months, the most that ${h.src('stvg25', 'Section 25 StVG')} allows. In town the three months already applied from 61 km/h over, so only the fine rises; outside towns, 71 km/h adds the third month. Anything beyond this is governed elsewhere: by the intent rule, by departures in individual cases and, for certain kinds of driving, by the Criminal Code.</p>
${h.table(['Over the limit', 'In town', 'Ban', 'Outside towns', 'Ban'], plateau.map(({ over, i, o }) => [`${h.num(over)} km/h`, h.eur(i.fine), `${h.num(i.fv)} months`, h.eur(o.fine), `${h.num(o.fv)} months`]), 'Car, speed after tolerance, table 1 c; flat from 71 km/h', ['l', 'r', 'r', 'r', 'r'])}

<h2>Intent: the only fixed increase</h2>
<p>The catalogue figures assume negligence (${h.src('bkatv', 'Section 1(2) BKatV')}). At these speeds, fine offices often consider whether the speeding was deliberate. If they find intent, the fine doubles to ${h.eur(innV.fine)} in town, ${h.eur(innV.total, 2)} with costs, or ${h.eur(outV.fine)} outside towns, ${h.eur(outV.total, 2)} with costs. The ban and points stay as they are. The ordinance gives no speed at which intent is presumed.</p>

<h2>The line to criminal law</h2>
<p>Many expats arrive with the idea that German law has a fixed speed above which speeding becomes a crime, as some other countries do. It does not. <a href="${STGB315D}" target="_blank" rel="nofollow noopener noreferrer">Section 315d of the Criminal Code</a>, deals with prohibited motor races. Its paragraph 1 no. 3 also covers a single driver racing against nobody: it punishes anyone who drives "at an inappropriate speed and grossly against traffic rules and recklessly, in order to reach the highest possible speed". The Federal Constitutional Court upheld this provision in 2022. The offence turns on those elements together, not on a reading. A camera showing 71 km/h over is not enough by itself, and a drive at a lower excess can still meet the test if the elements are present.</p>
<p>The penalty is imprisonment of up to two years or a criminal fine, rising to five years if another person's life or limb, or property of significant value, is endangered (paragraph 2). Where death or serious injury results, paragraph 5 provides for one to ten years. Such cases go to the public prosecutor and the criminal courts, not the fine office, and the catalogue sets no figures for them.</p>

<h2>Endangering others or causing damage</h2>
<p>A second fixed increase exists besides intent. Under Section 3(3) BKatV, standard fines above ${h.eur(V.verwarnung_max)} rise according to table 4 when someone was put in danger or property was damaged. Outside towns, ${h.eur(out.fine)} becomes ${h.eur(increase(out.fine, 'danger'))} with danger and ${h.eur(increase(out.fine, 'damage'))} with damage. Table 4 has no line for the in-town amount of ${h.eur(inn.fine)}, as its highest starting values are lower, so any increase there is left to the individual decision. When intent is also found, the increased amount is then doubled: danger plus intent outside towns would give ${h.eur(increase(out.fine, 'danger') * 2)}. Damage to a third party's car, of course, also leads to a civil claim through your liability insurance, which the fine notice does not cover.</p>

<h2>Heavy vehicles reach the top sooner</h2>
<p>For lorries, trailers and buses, the last line of the table starts at more than 60 km/h over:</p>
${h.table(['Vehicle', 'In town', 'Outside towns', 'Ban'], [
  ['Car, motorcycle (table 1 c)', h.eur(klasse('c').i.fine), h.eur(klasse('c').o.fine), `${h.num(klasse('c').i.fv)} months`],
  ['Lorry over 3.5 t, with trailer (table 1 a)', h.eur(klasse('a').i.fine), h.eur(klasse('a').o.fine), `${h.num(klasse('a').i.fv)} months`],
  ['Bus with passengers, hazardous goods (table 1 b)', h.eur(klasse('b').i.fine), h.eur(klasse('b').o.fine), `${h.num(klasse('b').i.fv)} months`],
], '71 km/h over after tolerance, standard fines under the BKatV', ['l', 'r', 'r', 'r'])}
<p>For lorries and towing combinations, the maximum fine is the same as for cars; it is simply reached at a lower excess.</p>

<h2>Three months in practice</h2>
<p>The offence adds two points under ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, which stay until ${h.num(P.punkte.tilgung_2p_monate)} months after the decision is final. If it is your first ban in two years, you may start the three months at any point within ${V.fahrverbot_schonfrist_monate} months of the decision becoming final. Three months without a car is long enough to affect a job that needs one, so many people plan the period around leave. A licence from outside the EU is marked rather than held. See the ${h.a('fahrverbot', 'driving ban guide')}, the ${h.a('punkte-in-flensburg', 'Flensburg points guide')} and the ${h.a('bussgeldrechner', 'fine calculator')}; the band below is on the ${h.a('kmh-51', 'page on 51 km/h over')}.</p>`,
  },
});
