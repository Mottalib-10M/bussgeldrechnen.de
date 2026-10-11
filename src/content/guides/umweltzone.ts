import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, fees, fromEntry } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren;
const uz = entry('153');
const fine = uz.fine!;
const f = fees(fine);
const vors = fromEntry('153', { intent: true });
/** Angaben des Umweltbundesamts, Seite „Umweltzonen in Deutschland“, zuletzt aktualisiert am 10.12.2025. */
const UBA = { zonen: 35, stand: '10.12.2025', standEn: '10 December 2025', gruppen: 4, farben: 3, seit: 2008, nurGruen: 2012, gruenAnteil: 90, strenger: 2030 };
const m = (x: number, l: 'de' | 'en', d = 0) => formatMoney(x, d, l);

export default defineGuide({
  id: 'umweltzone',
  group: 'verstoesse',
  order: 80,
  mini: 'umweltzone',
  related: ['bussgeldrechner', 'bussgeldbescheid', 'kfz-steuer-diesel', 'kfz-steuer-altfahrzeuge', 'tuev-ueberzogen', 'falschparken'],
  sources: ['bkatAnlage', 'bkatv', 'owig107'],
  de: {
    slug: 'umweltzone',
    nav: 'Umweltzone',
    card: 'Grüne Plakette, Bußgeld ohne Punkt, Ausnahmen und wie viele Zonen es noch gibt.',
    title: 'Umweltzone 2026: grüne Plakette, Bußgeld und Ausnahmen',
    description: `Umweltzone 2026: ohne grüne Plakette ${fine} € nach BKat-Nr. 153, kein Punkt, mit Bescheidkosten ${m(fine + f.total, 'de', 2)}. Ausnahmen nach 35. BImSchV und Stand der Zonen.`,
    h1: 'Umweltzone: Plakette, Bußgeld und Ausnahmen',
    intro: 'Wer ohne passende Plakette in eine Umweltzone fährt, zahlt ein Bußgeld, aber bekommt keinen Punkt in Flensburg.',
    resume: `Wer 2026 ohne grüne Plakette oder Ausnahmegenehmigung in eine Umweltzone fährt, zahlt nach Nummer 153 des Bußgeldkatalogs ${fine} Euro, Punkte gibt es dafür nicht. Weil der Betrag über der Grenze des Verwarnungsgeldes von ${V.verwarnung_max} Euro liegt, ergeht ein Bußgeldbescheid mit ${m(f.gebuehr, 'de')} Gebühr und ${m(V.zustellung, 'de', 2)} Zustellung, zusammen ${m(fine + f.total, 'de', 2)}. Anfang und Ende einer Zone sind mit eigenen Verkehrszeichen beschildert, die das Wort „Umwelt“ in einem roten Ring zeigen. Rechtsgrundlage der Plaketten ist die 35. BImSchV, die jedes Fahrzeug anhand des Emissionsschlüssels in den Fahrzeugpapieren einer von ${UBA.gruppen} Schadstoffgruppen zuordnet. Betroffen sind nur Pkw, Lkw und Busse. Motorräder, Oldtimer, Fahrzeuge schwerbehinderter Menschen und einige weitere Gruppen sind ausgenommen. Nach Angaben des Umweltbundesamts gab es mit Stand vom ${UBA.stand} noch ${UBA.zonen} Umweltzonen, weil viele Städte ihre Zone aufgehoben haben.`,
    faqs: [
      { q: 'Gibt es Punkte in Flensburg, wenn ich ohne Plakette in die Umweltzone fahre?', a: `Nein. Nummer 153 des Bußgeldkatalogs sieht ${fine} Euro vor, aber keinen Punkt, weil der Verstoß nicht in Anlage 13 der Fahrerlaubnis-Verordnung steht. Er wird deshalb auch nicht ins Fahreignungsregister eingetragen und zählt in der Probezeit weder als A- noch als B-Verstoß. Zu zahlen sind trotzdem die Kosten des Bescheids, insgesamt ${m(fine + f.total, 'de', 2)}.` },
      { q: 'Wie viele Umweltzonen gibt es 2026 noch in Deutschland?', a: `Das Umweltbundesamt nennt auf seiner Seite zu den Umweltzonen, zuletzt aktualisiert am ${UBA.stand}, noch ${UBA.zonen} Zonen. Viele Städte haben ihre Umweltzone aufgehoben, weil im Jahr 2024 erstmals an allen deutschen Messstationen die geltenden Grenzwerte eingehalten wurden. Ob eine bestimmte Zone noch besteht, zeigen die Liste und die Karte des Umweltbundesamts und die Beschilderung vor Ort.` },
      { q: 'Brauchen Motorräder eine Umweltplakette?', a: 'Nein. Nach Anhang 3 der 35. BImSchV sind Motorräder und dreirädrige Kraftfahrzeuge von der Umweltzonenregelung ausgenommen, ebenso Arbeitsmaschinen, land- und forstwirtschaftliche Zugmaschinen, Oldtimer, Kraftfahrzeuge schwerbehinderter Menschen und Fahrzeuge mit Sonderrechten. Die Regel betrifft nach Darstellung des Umweltbundesamts nur Pkw, Lkw und Busse.' },
      { q: 'Was kostet die Umweltzone ohne Plakette, wenn ich das Schild bewusst ignoriere?', a: `Bei Vorsatz verdoppelt § 3 Abs. 4a BKatV jeden Regelsatz über ${V.verwarnung_max} Euro. Aus ${fine} Euro werden dann ${vors.fine} Euro, mit Gebühr und Zustellung ${m(vors.total, 'de', 2)}. Ob Vorsatz vorliegt, entscheiden Behörde oder Gericht nach den Umständen des Einzelfalls; der Katalog selbst nennt dafür keine Beispiele. Punkte entstehen auch dann nicht.` },
      { q: 'Gilt meine grüne Plakette aus München auch in anderen Städten?', a: `Ja. Die Plakette ist bundesweit einheitlich und gilt nach Angaben des Umweltbundesamts in jeder Umweltzone in Deutschland, nicht nur in der Stadt, in der sie ausgegeben wurde. Seit ${UBA.nurGruen} ist in den bestehenden Zonen nur noch die grüne Plakette zugelassen. Sie muss gut sichtbar an der Windschutzscheibe kleben.` },
    ],
    body: (h) => `
<h2>Was die Nummer 153 regelt</h2>
<p>Der Bußgeldkatalog formuliert den Verstoß so: mit einem Kraftfahrzeug trotz Verkehrsverbotes zur Verminderung schädlicher Luftverunreinigungen am Verkehr teilgenommen, Zeichen 270.1 und 270.2. Zeichen 270.1 zeigt den Beginn der Zone, ein Schild mit rotem Ring und dem Wort „Umwelt“ sowie einem Zusatzzeichen, das die zugelassenen Plaketten nennt. Zeichen 270.2 steht am Ende. Dazwischen gilt das Verbot für jedes Fahrzeug, das die geforderte Plakette nicht trägt und keine Ausnahme hat.</p>
${h.table(['Fall', 'Regelsatz', 'Gebühr und Zustellung', 'Zu zahlen', 'Punkte'], [
  ['Ohne passende Plakette, fahrlässig', h.eur(fine), h.eur(f.total, 2), h.eur(fine + f.total, 2), uz.points],
  ['Ohne passende Plakette, vorsätzlich', h.eur(vors.fine), h.eur(vors.fees, 2), h.eur(vors.total, 2), vors.points],
], 'BKat-Nr. 153; Gebühren nach § 107 OWiG, Vorsatz nach § 3 Abs. 4a BKatV', ['l', 'r', 'r', 'r', 'r'])}
<p>Mit ${h.eur(fine)} liegt der Regelsatz deutlich über der Grenze von ${h.eur(V.verwarnung_max)}. Ein Verwarnungsgeld ohne Kosten ist deshalb nicht vorgesehen; die Behörde erlässt einen Bescheid, und nach ${h.src('owig107', '§ 107 OWiG')} kommen fünf Prozent Gebühr hinzu, mindestens ${h.eur(V.gebuehr_min)}, sowie ${h.eur(V.zustellung, 2)} Auslagen. Da fünf Prozent von ${h.eur(fine)} unter der Mindestgebühr bleiben, zahlt man genau ${h.eur(fine + f.total, 2)}. Wie ein solcher Bescheid aufgebaut ist und welche Fristen er auslöst, steht auf der Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}.</p>

<h2>Kein Punkt, kein Registereintrag</h2>
<p>Punkte gibt es nur für Verstöße, die Anlage 13 der Fahrerlaubnis-Verordnung aufzählt, und die Umweltzone gehört nicht dazu. Das hat zwei praktische Folgen. Erstens wird nichts ins Fahreignungsregister in Flensburg eingetragen, auch nicht bei Wiederholung. Zweitens zählt der Verstoß in der Probezeit nicht, weil dort nur eingetragene Entscheidungen berücksichtigt werden. Teuer wird es allein über das Geld: Wer mehrfach in dieselbe Zone fährt, kann jedes Mal einen eigenen Bescheid bekommen. Bei Wiederholung kann die Behörde zudem prüfen, ob Vorsatz vorliegt, was den Regelsatz verdoppelt.</p>

<h2>Plaketten und Schadstoffgruppen</h2>
<p>Die rechtliche Grundlage ist die 35. Verordnung zur Durchführung des Bundes-Immissionsschutzgesetzes, kurz 35. BImSchV, auch Kennzeichnungs- oder Plakettenverordnung genannt. Sie ordnet jedes Fahrzeug einer von ${UBA.gruppen} Schadstoffgruppen zu. Maßgeblich ist der Emissionsschlüssel, der in den Fahrzeugpapieren steht. Für drei Gruppen gibt es eine Plakette in je einer Farbe, die Fahrzeuge der Schadstoffgruppe 1 bekommen keine. In den bestehenden Umweltzonen ist seit ${UBA.nurGruen} nur noch die grüne Plakette zugelassen, so beschreibt es das Umweltbundesamt. Wer also eine andere Farbe an der Scheibe hat, fährt in einer Zone genauso verbotswidrig wie ohne Plakette.</p>
<p>Die Plakette gehört gut sichtbar an die Windschutzscheibe. Sie ist an das Kennzeichen gebunden, das auf ihr eingetragen ist, und gilt bundesweit in jeder Zone. Ein neues Kennzeichen bedeutet deshalb in der Regel auch eine neue Plakette.</p>

<h2>Wer ausgenommen ist</h2>
<p>Die Umweltzonenregelung betrifft nach Darstellung des Umweltbundesamts nur Pkw, Lkw und Busse. Anhang 3 der 35. BImSchV nimmt mehrere Gruppen ausdrücklich aus:</p>
<ul>
<li>Motorräder und dreirädrige Kraftfahrzeuge,</li>
<li>Arbeitsmaschinen, land- und forstwirtschaftliche Zugmaschinen sowie mobile Maschinen und Geräte,</li>
<li>Oldtimer,</li>
<li>Kraftfahrzeuge schwerbehinderter Menschen,</li>
<li>Kraftfahrzeuge, die mit Sonderrechten unterwegs sind.</li>
</ul>
<p>Für Elektrofahrzeuge arbeitet die Bundesregierung laut Umweltbundesamt an einer eigenen Ausnahmeregelung. Daneben können für einzelne Fahrzeuge auf Antrag Ausnahmegenehmigungen erteilt werden; zuständig sind die örtlichen Behörden. Wer eine solche Genehmigung hat, sollte sie im Fahrzeug mitführen, denn bei einer Kontrolle ist sie der einzige Beleg.</p>

<h2>Fahrzeuge mit ausländischem Kennzeichen</h2>
<p>Die Regel unterscheidet nach der Fahrzeugart, nicht nach dem Land der Zulassung: Betroffen sind nach Darstellung des Umweltbundesamts Pkw, Lkw und Busse. Ein Auto mit ausländischem Kennzeichen ohne grüne Plakette, das an Zeichen 270.1 vorbei in die Zone fährt, erfüllt deshalb ebenso den Tatbestand der Nummer 153. Welche Unterlagen die ausgebende Stelle für ein im Ausland zugelassenes Fahrzeug verlangt, um die Schadstoffgruppe festzustellen, erfragt man am besten vor der Reise.</p>

<h2>Wie viele Zonen es noch gibt</h2>
<p>Die ersten Umweltzonen entstanden ${UBA.seit}, weil in verkehrsreichen Innenstädten die europäischen Grenzwerte für Feinstaub und Stickstoffdioxid regelmäßig überschritten wurden. Inzwischen hat sich das Bild gewandelt. Laut Umweltbundesamt erfüllen über ${UBA.gruenAnteil} Prozent der Fahrzeuge die Anforderungen der grünen Plakette, und im Jahr 2024 wurden erstmals an allen deutschen Messstationen alle geltenden Grenzwerte eingehalten. Viele Städte haben ihre Zone daraufhin aufgehoben. Mit Stand vom ${UBA.stand} nennt das Umweltbundesamt noch ${UBA.zonen} Umweltzonen und führt dazu eine Liste und eine Karte.</p>
<p>Für die Planung einer Fahrt heißt das: Ein Navigationsgerät oder ein älterer Reiseführer kann Zonen zeigen, die es nicht mehr gibt, und umgekehrt. Verbindlich ist das Schild an der Einfahrt. Steht dort Zeichen 270.1, gilt die Zone, gleich was die App meldet.</p>

<h2>Warum das Thema 2030 zurückkommen kann</h2>
<p>Ab ${UBA.strenger} gelten die strengeren Grenzwerte der EU-Luftqualitätsrichtlinie 2024/2881. Der Jahresgrenzwert für Feinstaub PM10 und der für Stickstoffdioxid halbieren sich jeweils von 40 auf 20 Mikrogramm je Kubikmeter, für die feineren Partikel PM2,5 sinkt er von 25 auf 10. Das Umweltbundesamt hält es für möglich, dass Umweltzonen dann wieder an Bedeutung gewinnen, und nennt als denkbare Weiterentwicklungen strengere Ausnahmen oder modernere Verfahren als die Plakette. Beschlossen ist davon nichts; für 2026 bleiben Nummer 153 und die grüne Plakette die geltende Regel.</p>

<h2>Rechenbeispiel: dreimal in die Innenstadt</h2>
<p>Angenommen, jemand pendelt mit einem Fahrzeug ohne grüne Plakette an drei verschiedenen Tagen durch dieselbe Zone und wird jedes Mal festgestellt. Jede Fahrt ist eine eigene Tat, also kann jede einen eigenen Bescheid nach sich ziehen: dreimal ${h.eur(fine + f.total, 2)} ergibt ${h.eur(3 * (fine + f.total), 2)}. Nimmt die Behörde bei der dritten Fahrt Vorsatz an, steigt allein dieser Bescheid auf ${h.eur(vors.total, 2)}. Eine grüne Plakette, sofern das Fahrzeug die Voraussetzungen erfüllt, oder eine Ausnahmegenehmigung beendet die Reihe. Punkte entstehen in keinem der Fälle, und auch ein Fahrverbot sieht der Katalog für Nummer 153 nicht vor.</p>

<h2>Umweltplakette und HU-Plakette nicht verwechseln</h2>
<p>Am Auto kleben zwei runde Plaketten mit ganz unterschiedlicher Aufgabe. Die Umweltplakette sitzt innen an der Windschutzscheibe und zeigt die Schadstoffgruppe. Die Prüfplakette der Hauptuntersuchung klebt auf dem hinteren Kennzeichen und zeigt, bis wann die nächste HU fällig ist. Eine abgelaufene HU-Plakette hat mit der Umweltzone nichts zu tun, sie wird nach einer eigenen Nummer des Katalogs geahndet; die Staffel steht auf der Seite ${h.a('tuev-ueberzogen', 'TÜV überzogen')}. Umgekehrt ersetzt eine frische HU keine fehlende grüne Plakette.</p>

<h2>Was im Bescheid stehen muss</h2>
<p>Ein Bescheid wegen der Umweltzone folgt denselben Regeln wie jeder andere. Nach § 66 OWiG nennt er die Tat mit Zeit und Ort, die angewendeten Vorschriften, die Beweismittel und die Geldbuße. Er enthält außerdem den Hinweis, dass er rechtskräftig wird, wenn kein Einspruch eingelegt wird, und die Aufforderung, spätestens zwei Wochen nach Rechtskraft zu zahlen. Der Einspruch selbst ist binnen ${V.einspruch_wochen} Wochen nach Zustellung möglich. Wer eine Ausnahmegenehmigung hatte, aber nicht mitführte, findet im Bescheid den Tatort und kann die Unterlagen der Behörde zuordnen.</p>

<h2>Ältere Diesel und Benziner im Blick behalten</h2>
<p>Die Umweltzone ist nicht der einzige Bereich, in dem das Alter eines Fahrzeugs Geld kostet. Auch die Kfz-Steuer hängt bei älteren Autos von der Schadstoffklasse ab, und Diesel zahlen je Hubraum deutlich mehr als Benziner. Wie sich das rechnet, zeigen die Seiten zur ${h.a('kfz-steuer-altfahrzeuge', 'Kfz-Steuer für Altfahrzeuge')} und zur ${h.a('kfz-steuer-diesel', 'Kfz-Steuer für Diesel')}. Wer ohnehin über ein neueres Fahrzeug nachdenkt, kann beide Kosten zusammen betrachten.</p>

<h2>Fahrer, nicht Halter</h2>
<p>Das Bußgeld richtet sich an die Person, die gefahren ist. Die besondere Kostenpflicht des Halters nach § 25a StVG gilt nur für Halt- und Parkverstöße und greift bei der Umweltzone nicht. Wird ein Verstoß festgestellt, bekommt der Halter zunächst einen Anhörungsbogen und kann angeben, wer am Steuer saß. Die Verfolgung verjährt wie bei anderen Verkehrsordnungswidrigkeiten nach ${V.verjaehrung_monate} Monaten, wenn die Frist nicht unterbrochen wird. Den Gesamtbetrag für jeden anderen Verstoß liefert der ${h.a('bussgeldrechner', 'Bußgeldrechner')}; die Grundlage aller Beträge ist die ${h.src('bkatAnlage', 'Anlage zur Bußgeldkatalog-Verordnung')}.</p>`,
  },
  en: {
    slug: 'low-emission-zones-germany',
    nav: 'Low-emission zones',
    card: 'The green sticker, the fine without points, exemptions and how many zones remain.',
    title: 'Low Emission Zones Germany 2026: Green Sticker and Fines',
    description: `Low-emission zone (Umweltzone) in Germany 2026: driving without a green sticker costs ${m(fine, 'en')}, no points, ${m(fine + f.total, 'en', 2)} with fees. Exemptions and how many zones remain.`,
    h1: 'Low-emission zones in Germany: sticker, fine and exemptions',
    intro: 'Entering an Umweltzone without the green windscreen sticker brings a fine, but no Flensburg points.',
    resume: `Driving into a German low-emission zone, an Umweltzone, without a green sticker or an exemption costs ${fine} euros under number 153 of the fine catalogue in 2026, and no points are added to your record. Since that amount is above the ${V.verwarnung_max}-euro limit for warning fines, you receive a formal fine notice with a ${m(f.gebuehr, 'en')} fee and ${m(V.zustellung, 'en', 2)} for delivery, ${m(fine + f.total, 'en', 2)} in total. Zones start at traffic sign 270.1, a white sign with a red ring around the word Umwelt and a panel showing the sticker allowed, and end at sign 270.2. The stickers come from a federal ordinance, the 35th BImSchV, which sorts each vehicle into one of ${UBA.gruppen} pollutant groups using the emissions code in its registration papers. Only cars, lorries and buses are covered; motorbikes, classic cars and vehicles of disabled people are exempt. According to the Federal Environment Agency, ${UBA.zonen} zones were still in place as of ${UBA.standEn}.`,
    faqs: [
      { q: 'Do I need a German emissions sticker for a car with foreign plates?', a: `The rules distinguish by vehicle type, not by country of registration: the Federal Environment Agency says the zones apply to cars, lorries and buses. A car without the green sticker that enters a zone marked with sign 270.1 commits the offence under number 153, which costs ${fine} euros and fees. Ask the issuing office which papers it needs for a foreign-registered vehicle.` },
      { q: 'Is the German low-emission zone fine the same in every city?', a: `Yes. The amount comes from the national fine catalogue, not from the city: ${fine} euros under number 153, plus ${m(f.total, 'en', 2)} in fees and delivery costs, without points. Intentional offences are doubled under Section 3(4a) BKatV to ${vors.fine} euros. The green sticker itself is also valid nationwide, so one sticker covers every zone in Germany.` },
      { q: 'Are electric cars exempt from German environmental zones?', a: 'The Federal Environment Agency states that the federal government is preparing a specific exemption for electric vehicles. Until it is in force, the list in annex 3 of the 35th BImSchV applies, which exempts motorbikes, three-wheelers, classic cars, vehicles of disabled people, vehicles with special rights and certain machines. Individual exemptions can also be granted on application by the local authority.' },
      { q: 'How can I tell if a German city still has an Umweltzone?', a: `Look for traffic sign 270.1 at the entry roads; it is the only binding signal. The Federal Environment Agency keeps a list and a map and reported ${UBA.zonen} remaining zones as of ${UBA.standEn}, after many cities lifted theirs once air-quality limits were met everywhere in 2024. Older sat-nav data may still show zones that have gone.` },
    ],
    body: (h) => `
<h2>The fine in figures</h2>
<p>Number 153 of the catalogue describes the offence as taking part in traffic with a motor vehicle despite a ban to reduce harmful air pollution, signs 270.1 and 270.2. It is a flat amount with no points and no driving ban.</p>
${h.table(['Case', 'Fine', 'Fee and delivery', 'Total', 'Points'], [
  ['No valid sticker, careless', h.eur(fine), h.eur(f.total, 2), h.eur(fine + f.total, 2), uz.points],
  ['No valid sticker, intentional', h.eur(vors.fine), h.eur(vors.fees, 2), h.eur(vors.total, 2), vors.points],
], 'Catalogue no. 153; fees under Section 107 OWiG; intent doubles the fine under Section 3(4a) BKatV', ['l', 'r', 'r', 'r', 'r'])}
<p>Because ${h.eur(fine)} is more than ${h.eur(V.verwarnung_max)}, there is no on-the-spot warning fine. The authority sends a fine notice, and ${h.src('owig107', 'Section 107 of the Administrative Offences Act')} adds five per cent with a minimum of ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for delivery. Five per cent of ${h.eur(fine)} is below that minimum, so the bill is exactly ${h.eur(fine + f.total, 2)}. What such a notice contains is set out on the page about the ${h.a('bussgeldbescheid', 'German fine notice')}.</p>

<h2>What the sticker is</h2>
<p>The Umweltplakette, also called Feinstaubplakette, is a round sticker for the inside of the windscreen with your number plate written on it. It comes from the 35th Ordinance implementing the Federal Immission Control Act (35. BImSchV), which sorts vehicles into ${UBA.gruppen} pollutant groups based on the emissions code (Emissionsschlüssel) printed in the registration papers. Three of the groups get a sticker in their own colour; group 1 gets none. Since ${UBA.nurGruen}, the existing zones admit only the green sticker, according to the Federal Environment Agency (Umweltbundesamt, UBA). Any other colour is treated the same as no sticker at all.</p>
<p>Because the plate number is written on it, a sticker belongs to one registration. If you re-register the car, for example after moving to a district with a different plate prefix and choosing a new number, plan on a new sticker as well.</p>

<h2>Exempt vehicles</h2>
<p>Only cars, lorries and buses fall under the zone rules. Annex 3 of the ordinance exempts motorbikes and three-wheeled vehicles, working machines, agricultural and forestry tractors, mobile machinery, classic cars, vehicles used by disabled people and vehicles using special rights such as police and ambulances. The UBA reports that the federal government is working on an exemption for electric vehicles; until that exists, an electric car is not on the exemption list. Separate exemptions for a single vehicle can be granted on application by the local authority, and the permit should travel in the car, since it is the only proof you can show at a check.</p>

<h2>A shrinking map</h2>
<p>German cities began introducing zones in ${UBA.seit}, when fine dust and nitrogen dioxide levels in busy centres regularly broke EU limits. The UBA now says more than ${UBA.gruenAnteil} per cent of vehicles meet the green-sticker standard and that in 2024, for the first time, every measuring station in Germany met all current limits. Many cities therefore lifted their zones. The agency's list counted ${UBA.zonen} zones as of ${UBA.standEn}. For drivers new to Germany, this means older guidebooks and navigation data can be out of date in both directions. The sign at the entry road decides: where sign 270.1 stands, the zone applies.</p>

<h2>Why zones may matter again after 2030</h2>
<p>From ${UBA.strenger}, the stricter limits of EU Air Quality Directive 2024/2881 apply. The annual limits for PM10 particles and for nitrogen dioxide fall from 40 to 20 micrograms per cubic metre, and the limit for the finer PM2.5 particles from 25 to 10. The UBA expects that cities may need further measures and sees low-emission zones as one tool that could regain relevance, possibly with tighter exemptions or a more modern check than the sticker. None of this has been decided, so for 2026 the green sticker and number 153 remain the rule.</p>

<h2>A worked example: the weekly commute</h2>
<p>Picture someone who drives an older car without the green sticker into the same city zone on three separate days and is recorded each time. Each journey is a separate offence, so each can lead to its own notice: three times ${h.eur(fine + f.total, 2)} makes ${h.eur(3 * (fine + f.total), 2)}. If the authority treats the third trip as intentional, that notice alone rises to ${h.eur(vors.total, 2)}. No points accumulate and the catalogue sets no driving ban for number 153, but the money adds up quickly for anyone who commutes. A green sticker, if the vehicle qualifies, or an individual exemption ends the series.</p>

<h2>Two round stickers, two jobs</h2>
<p>Newcomers often confuse the two stickers a German car carries. The emissions sticker sits inside the windscreen and shows the pollutant group. The inspection sticker (Prüfplakette) sits on the rear number plate and shows when the next roadworthiness test, the Hauptuntersuchung or HU, is due. They are checked under different catalogue numbers and one never replaces the other. If the plate sticker has run out, the steps and amounts are on the page about an ${h.a('tuev-ueberzogen', 'overdue MOT in Germany')}.</p>

<h2>Reading the notice</h2>
<p>Under Section 66 of the Administrative Offences Act, a fine notice must state the offence with its time and place, the rules applied, the evidence and the amount. It also explains that it becomes final if you lodge no objection (Einspruch) and asks you to pay within two weeks of it becoming final. The objection itself must reach the authority within ${V.einspruch_wochen} weeks of delivery. These dates run while you are on holiday too, so post sent to your German address deserves attention even when you are away. If you held an exemption permit but did not carry it, the date and place in the notice let you match it to your papers.</p>

<h2>Hire cars and car sharing</h2>
<p>If you rent a car or use car sharing, look for the green sticker on the windscreen before you drive into a city centre. The fine is addressed to the driver, not to the company that owns the car, and the operator will usually pass your details on. If a notice arrives later via the rental firm, the amounts are the same as for a private car: ${h.eur(fine)} plus fees, and no points.</p>

<h2>Bringing a car to Germany</h2>
<p>Expats who import a car face several German formalities at once: registration, the roadworthiness test, vehicle tax and, for city driving, the sticker. The order matters little for the zone itself, but the sticker needs the vehicle's German registration data, so it usually comes last. Older diesels deserve a second look before shipping, since the vehicle tax on them is also high; the pages on ${h.a('kfz-steuer-diesel', 'diesel car tax')} and on ${h.a('kfz-steuer-altfahrzeuge', 'tax for older cars')} show the figures.</p>

<h2>Driver, not keeper</h2>
<p>The fine is addressed to the person who drove. The special keeper rule of Section 25a of the Road Traffic Act applies only to stopping and parking, not to the zone, so the keeper first receives a hearing form (Anhörungsbogen) and can name the driver. Like other traffic offences, the case becomes time-barred after ${V.verjaehrung_monate} months unless the authority interrupts the period. The legal basis for every amount on this site is the ${h.src('bkatAnlage', 'annex to the fine catalogue ordinance')}, and the ${h.a('bussgeldrechner', 'fine calculator')} adds up any other offence with its fees.</p>`,
  },
});
