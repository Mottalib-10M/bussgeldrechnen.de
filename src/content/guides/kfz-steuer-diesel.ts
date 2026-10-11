import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pkw, co2Progressive, gewichtssteuer } from '../../lib/engine/kfzsteuer';
import { formatMoney } from '../../lib/format';

const K = P.kfz;
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
/** § 9a KraftStG (abgelaufen 31.3.2011) : Zuschlag je 100 cm³, absent de params-2026.json. */
const S9A = 1.2;
const EZ = '2024-04-01';
const faelle = [{ ccm: 1499, co2: 115 }, { ccm: 1598, co2: 125 }, { ccm: 1968, co2: 140 }, { ccm: 2993, co2: 180 }]
  .map((f) => ({ ...f, d: pkw({ ez: EZ, fuel: 'diesel', ...f }), b: pkw({ ez: EZ, fuel: 'benzin', ...f }) }));
const diff100 = K.hubraum_diesel - K.hubraum_benzin;
const faktor = K.hubraum_diesel / K.hubraum_benzin;
const zwei = faelle[2];
/** CO2-Wert, ab dem ein gleich großer Benziner so viel kostet wie der Diesel mit 140 g. */
let gleich = zwei.co2; while (pkw({ ez: EZ, fuel: 'benzin', ccm: zwei.ccm, co2: gleich }).raw < zwei.d.raw) gleich++;
const st1 = co2Progressive(115), st2 = co2Progressive(135) - st1, st3 = co2Progressive(140) - co2Progressive(135);
const van = Math.floor(gewichtssteuer(3000));
const bmf = pkw({ ez: '2023-05-01', fuel: 'diesel', ccm: 1968, co2: 145 });
const d15 = pkw({ ez: '2015-06-01', fuel: 'diesel', ccm: 1598, co2: 105 });
const b15 = pkw({ ez: '2015-06-01', fuel: 'benzin', ccm: 1598, co2: 105 });
const d06 = pkw({ ez: '2006-03-01', fuel: 'diesel', ccm: 1896, co2: 0, altKlasse: 'euro3plus' });
const b06 = pkw({ ez: '2006-03-01', fuel: 'benzin', ccm: 1896, co2: 0, altKlasse: 'euro3plus' });

export default defineGuide({
  id: 'kfz-steuer-diesel',
  group: 'steuer',
  order: 30,
  mini: 'diesel',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer', 'kfz-steuer-altfahrzeuge', 'kfz-steuer-elektroauto', 'umweltzone'],
  sources: ['kraftstg9', 'kraftstg', 'bmfRechner'],
  de: {
    slug: 'kfz-steuer-diesel',
    nav: 'Kfz-Steuer Diesel',
    card: `${eD(K.hubraum_diesel, 2)} je 100 cm³ statt ${eD(K.hubraum_benzin)}: der Vergleich mit dem Benziner.`,
    title: `Kfz-Steuer Diesel 2026: ${eD(K.hubraum_diesel, 2)} je 100 cm³ und der Vergleich`,
    description: `Kfz-Steuer Diesel 2026: ${eD(K.hubraum_diesel, 2)} je 100 cm³ statt ${eD(K.hubraum_benzin)} beim Benziner. Ein Diesel von 2024 mit 1 968 cm³ und 140 g zahlt ${eD(zwei.d.annual)} im Jahr, der gleiche Benziner ${eD(zwei.b.annual)}.`,
    h1: 'Kfz-Steuer beim Diesel: warum der Selbstzünder mehr zahlt',
    intro: 'Beim Diesel kostet jeder angefangene Hubraum-Hunderter fast das Fünffache, und der niedrigere CO2-Wert gleicht das selten aus.',
    resume: `Ein Diesel-Pkw zahlt in Deutschland ${eD(K.hubraum_diesel, 2)} Kfz-Steuer je angefangene 100 cm³ Hubraum, ein Benziner nur ${eD(K.hubraum_benzin)}. Dieser Satz gilt für alle seit Juli 2009 erstmals zugelassenen Autos, der CO2-Anteil kommt bei beiden Kraftstoffen nach denselben Regeln hinzu. Bei gleichem Hubraum und gleichem CO2-Wert kostet der Diesel deshalb je 100 cm³ genau ${eD(diff100, 2)} mehr. Ein Diesel von 2024 mit 1 968 cm³ und 140 g CO2 zahlt ${eD(zwei.d.annual)} im Jahr, ein gleich großer Benziner mit demselben Wert ${eD(zwei.b.annual)}. Erst wenn der Benziner rund ${gleich - zwei.co2} Gramm mehr ausstößt, sind beide gleich teuer. Bei Autos von vor Juli 2009 liegt der Diesel ebenfalls deutlich höher, je nach Schadstoffklasse bis ${eD(K.alt_saetze.sonstige[1], 2)} je 100 cm³. Euro-Norm und Partikelfilter spielen für neuere Diesel steuerlich keine Rolle mehr. Unser Rechner trifft für einen Diesel von 2023 mit 1 968 cm³ und 145 g dieselben ${eD(bmf.annual)} wie der Rechner des Bundesfinanzministeriums.`,
    faqs: [
      { q: 'Warum ist die Kfz-Steuer beim Diesel höher als beim Benziner?', a: `Weil § 9 Abs. 1 Nr. 2 KraftStG für Selbstzündungsmotoren ${eD(K.hubraum_diesel, 2)} je angefangene 100 cm³ ansetzt, für Fremdzündungsmotoren ${eD(K.hubraum_benzin)}. Eine Begründung enthält der Gesetzestext nicht. Üblicherweise wird der Aufschlag mit der niedrigeren Energiesteuer auf Dieselkraftstoff erklärt. Der CO2-Anteil folgt bei beiden Antrieben denselben Stufen, er macht den Unterschied also nicht.` },
      { q: 'Wie viel Kfz-Steuer zahlt ein Diesel mit 2,0 Litern Hubraum?', a: `Das hängt vom CO2-Wert und vom Jahr der Erstzulassung ab. Mit 1 968 cm³ sind es 20 Einheiten, also ${eD(20 * K.hubraum_diesel)} für den Hubraum. Bei Erstzulassung 2024 und 140 g kommen ${eD(zwei.d.lines[1].amount, 2)} für CO2 dazu, zusammen ${eD(zwei.d.annual)}. Mit 145 g und Erstzulassung 2023 ergibt sich ${eD(bmf.annual)}, derselbe Betrag wie im BMF-Rechner.` },
      { q: 'Spielt die Euro-Norm beim Diesel für die Kfz-Steuer noch eine Rolle?', a: 'Nur bei Erstzulassung bis zum 30. Juni 2009. Dann bestimmt die Schadstoffklasse den Satz je 100 cm³. Für spätere Autos zählen nur Hubraum und CO2, ein Euro-6-Diesel zahlt also so viel wie ein Euro-5-Diesel mit denselben Werten. Die befristete Befreiung für frühe Euro-6-Diesel nach § 3b galt nur für Erstzulassungen 2011 bis 2013 und endete spätestens Ende 2013.' },
      { q: 'Zahlt ein Diesel-Hybrid weniger Kfz-Steuer?', a: 'Nur über den CO2-Wert. Ein Hybrid mit Dieselmotor bleibt ein Pkw mit Selbstzündungsmotor und zahlt den vollen Diesel-Satz je 100 cm³. Die Elektro-Befreiung nach § 3d greift nicht, weil der Antrieb nicht ausschließlich elektrisch ist. Senkt der Elektroteil den Normverbrauch, fällt der CO2-Anteil kleiner aus; unter 96 g/km entfällt er ganz.' },
    ],
    body: (h) => `
<h2>Der Satz, der den Unterschied macht</h2>
<p>${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 2 KraftStG')} nennt für Pkw mit Erstzulassung ab Juli 2009 zwei Hubraumsätze: ${h.eur(K.hubraum_benzin)} je angefangene 100 cm³ für Fremdzündungsmotoren, ${h.eur(K.hubraum_diesel, 2)} für Selbstzündungsmotoren. Der Diesel zahlt also das ${h.num(faktor, 2)}-Fache. Gezählt wird in angefangenen Einheiten, ein Motor mit ${h.num(1968)} cm³ hat 20 davon, einer mit ${h.num(2993)} cm³ hat 30. Allein der Hubraum kostet beim Zweiliter-Diesel damit ${h.eur(20 * K.hubraum_diesel)}, beim Benziner ${h.eur(20 * K.hubraum_benzin)}.</p>
<p>Der CO2-Anteil ist für beide Antriebe gleich geregelt. Seit 2021 zugelassene Autos zahlen für jedes Gramm über ${K.co2_frei_2021} g/km einen gestaffelten Satz zwischen ${h.eur(K.co2_stufen_2021[0][1], 2)} und ${h.eur(K.co2_stufen_2021[5][1], 2)}. Dass Diesel oft weniger CO2 ausstoßen, mildert den Hubraum-Nachteil, hebt ihn aber selten auf.</p>

<h2>Diesel und Benziner bei gleichen Werten</h2>
<p>Die folgende Tabelle setzt beide Kraftstoffe auf denselben Hubraum und denselben CO2-Wert, Erstzulassung 2024. So wird sichtbar, was der Kraftstoff allein ausmacht:</p>
${h.table(['Hubraum', 'CO2', 'Diesel', 'Benziner', 'Mehr beim Diesel'], faelle.map((f) => [`${h.num(f.ccm)} cm³`, `${f.co2} g/km`, h.eur(f.d.annual), h.eur(f.b.annual), h.eur(f.d.annual - f.b.annual)]), 'Jahressteuer nach § 9 Abs. 1 Nr. 2 Buchst. c KraftStG, Erstzulassung 2024', ['l', 'r', 'r', 'r', 'r'])}
<p>Der Abstand wächst mit dem Hubraum: Jede angefangene Einheit kostet beim Diesel ${h.eur(diff100, 2)} mehr. Bei einem Dreiliter sind es schon über zweihundert Euro im Jahr, bei gleichem CO2-Wert. Der CO2-Anteil ist in jeder Zeile identisch, bei 140 g zum Beispiel ${h.eur(co2Progressive(140), 2)}.</p>

<h3>Wie viel CO2-Vorsprung braucht der Diesel?</h3>
<p>Realistischer ist der Vergleich, bei dem der Diesel sparsamer ist. Nimmt man den Zweiliter-Diesel mit 140 g, muss ein Benziner mit ${h.num(zwei.ccm)} cm³ rund ${gleich} g/km ausstoßen, um dieselbe Steuer zu zahlen, also etwa ${gleich - zwei.co2} Gramm mehr. Solche Abstände kommen bei Motoren derselben Leistung durchaus vor, vor allem bei schweren Autos. Beim kleinen Diesel dagegen gewinnt fast immer der Benziner, weil dessen Hubraumanteil kaum ins Gewicht fällt. Ein Vergleich lohnt deshalb mit den echten Werten aus Feld P.1 und V.7 beider Fahrzeuge; der ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')} rechnet beide nacheinander.</p>

<h3>Der Zweiliter-Diesel Schritt für Schritt</h3>
<p>Für den Diesel von 2024 mit ${h.num(1968)} cm³ und 140 g sieht die Rechnung so aus. Hubraum: 20 angefangene Einheiten zu ${h.eur(K.hubraum_diesel, 2)} ergeben ${h.eur(20 * K.hubraum_diesel, 2)}. CO2: Die ersten ${K.co2_frei_2021} g sind frei. Von 96 bis 115 g kosten 20 Gramm je ${h.eur(K.co2_stufen_2021[0][1], 2)}, zusammen ${h.eur(st1, 2)}. Von 116 bis 135 g kommen 20 Gramm zu ${h.eur(K.co2_stufen_2021[1][1], 2)} hinzu, also ${h.eur(st2, 2)}. Die letzten fünf Gramm liegen im Band zu ${h.eur(K.co2_stufen_2021[2][1], 2)} und kosten ${h.eur(st3, 2)}. Insgesamt sind das ${h.eur(zwei.d.raw, 2)}, abgerundet ${h.eur(zwei.d.annual)}. Der Benziner rechnet beim CO2 genauso, beim Hubraum aber mit ${h.eur(20 * K.hubraum_benzin)} statt ${h.eur(20 * K.hubraum_diesel)}.</p>

<h2>Gebrauchte Diesel von 2009 bis 2020</h2>
<p>Für diese Jahrgänge gilt derselbe Hubraumsatz, aber nur ein einziger CO2-Satz von ${h.eur(K.co2_satz_2009)} je Gramm über einer festen Grenze. Die Grenze lag bei ${K.co2_frei_bis_2011} g für Erstzulassungen bis 2011, bei ${K.co2_frei_2012_2013} g für 2012 und 2013 und bei ${K.co2_frei_ab_2014} g ab 2014. Ein Diesel von 2015 mit ${h.num(1598)} cm³ und 105 g zahlt ${h.eur(d15.annual)}, ein Benziner mit denselben Werten ${h.eur(b15.annual)}. Der Unterschied liegt auch hier vollständig im Hubraum.</p>
<p>Viele dieser Autos haben niedrige Normwerte, weil sie noch nach dem alten NEFZ-Zyklus gemessen wurden. Für die Steuer zählt der Wert, den die Zulassungsstelle eingetragen hat; ein neuerer WLTP-Wert desselben Modells ändert an einem bestehenden Auto nichts.</p>

<h2>Diesel von vor Juli 2009</h2>
<p>Hier fehlt der CO2-Anteil, dafür hängt der Hubraumsatz an der Schadstoffklasse. Die günstigste Stufe für Diesel kostet ${h.eur(K.alt_saetze.euro3plus[1], 2)} je 100 cm³, also mehr als das Doppelte des Benziners mit ${h.eur(K.alt_saetze.euro3plus[0], 2)}. Bei Autos ohne anerkannte Schadstoffminderung steigt der Satz auf ${h.eur(K.alt_saetze.sonstige[1], 2)}. Ein Diesel von 2006 mit Euro 4 und ${h.num(1896)} cm³ zahlt ${h.eur(d06.annual)}, ein gleich großer Benziner ${h.eur(b06.annual)}. Alle Stufen stehen auf der Seite zu ${h.a('kfz-steuer-altfahrzeuge', 'Altfahrzeugen')}.</p>
<!--mini:diesel-->
<h2>Was früher galt und heute nicht mehr</h2>
<p>Zwei Sonderregeln für Diesel stehen noch im Gesetz, wirken aber nicht mehr. § 9a erhöhte von April 2007 bis März 2011 den Satz für Diesel ohne Partikelminderungsstufe um ${h.eur(S9A, 2)} je 100 cm³. § 3b befreite Euro-6-Diesel mit Erstzulassung 2011 bis 2013, bis die Ersparnis 150 Euro erreichte, und endete spätestens am 31. Dezember 2013. Wer in alten Kaufunterlagen von diesen Regeln liest, kann sie für die heutige Steuer ignorieren.</p>
<p>Auch die Euro-Norm selbst spielt bei Dieseln ab Juli 2009 steuerlich keine Rolle mehr. Ein Euro-6d-Diesel zahlt bei gleichem Hubraum und CO2-Wert dasselbe wie ein Euro-5-Modell. Für Fahrverbote und Umweltplaketten sieht das anders aus, das regelt aber nicht die Kfz-Steuer, sondern das Immissionsschutzrecht; mehr dazu unter ${h.a('umweltzone', 'Umweltzone')}.</p>

<h2>Transporter und Wohnmobile mit Dieselmotor</h2>
<p>Der hohe Hubraumsatz gilt nur für Pkw, also Fahrzeuge der Klasse M1. Ein Transporter, der als Lkw (Klasse N1) zugelassen ist, wird nach § 8 Nr. 2 KraftStG nach dem zulässigen Gesamtgewicht besteuert, gleich ob Diesel oder Benziner. Ein Kastenwagen mit 3 000 kg zahlt so ${h.eur(van)} im Jahr, auch wenn ein großer Dieselmotor unter der Haube sitzt. Wohnmobile haben eine eigene Regel nach Gewicht und Schadstoffklasse, siehe ${h.a('kfz-steuer-wohnmobil', 'Kfz-Steuer für Wohnmobile')}. Entscheidend ist die Fahrzeugklasse, die die Zulassungsstelle in Feld J einträgt, nicht die Bauform. Ein Pkw-Kombi bleibt ein Pkw, auch wenn hinten keine Sitze mehr eingebaut sind, solange die Zulassung nicht geändert wird.</p>

<h2>Saisonkennzeichen für den Zweitwagen</h2>
<p>Wer einen Diesel nur im Sommer für Urlaubsfahrten oder mit Anhänger braucht, kann ihn mit Saisonkennzeichen zulassen. Die Steuer läuft dann nur für die Monate auf dem Schild, je Tag ein Dreihundertfünfundsechzigstel der Jahressteuer (§ 11 Abs. 4 KraftStG). Bei sechs Monaten zahlt der Zweiliter-Diesel aus dem Beispiel also etwa die Hälfte seines Jahresbetrags. Außerhalb des Zeitraums darf das Auto nicht auf öffentlichen Straßen stehen.</p>

<h2>Hybride mit Dieselmotor</h2>
<p>Mild- und Vollhybride mit Selbstzündungsmotor werden wie jeder Diesel besteuert: voller Satz je 100 cm³, CO2 nach Stufen. Die Befreiung für Elektroautos verlangt einen ausschließlich elektrischen Antrieb und greift deshalb nicht. Der Hybridanteil hilft nur indirekt, über einen niedrigeren CO2-Wert. Ein Plug-in-Diesel mit sehr niedrigem Normwert zahlt im Ergebnis fast nur den Hubraumanteil, und der ist beim Diesel eben hoch.</p>

<h2>Wer heute noch Diesel kauft</h2>
<p>Steuerlich kostet ein Zweiliter-Diesel aus dem aktuellen Jahrgang typischerweise zwischen zweihundert und dreihundert Euro im Jahr, ein vergleichbarer Benziner weniger als die Hälfte, ein ${h.a('kfz-steuer-elektroauto', 'Elektroauto')} bis 2035 nichts. Ob sich der Diesel trotzdem rechnet, entscheiden Kraftstoffpreis und Fahrleistung, nicht die Steuer allein. Für die Steuer gilt: Der Betrag steht mit dem Fahrzeugschein fest, wird nach § 11 Abs. 5 auf volle Euro abgerundet und vom Zoll jährlich im Voraus abgebucht, wie auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')} beschrieben. Wer seine Werte prüfen will, kann neben unserem Rechner den ${h.src('bmfRechner', 'Rechner des Bundesfinanzministeriums')} nutzen; beide kamen in unseren 21 Testfällen vom 11. Oktober 2026 auf denselben Euro.</p>
<p>Ein letzter Punkt betrifft den Wiederverkauf. Weil die Steuer am Fahrzeug hängt und sich mit dem Alter nicht ändert, zahlt auch der nächste Halter denselben Betrag. Beim Gebrauchtkauf lohnt deshalb der Blick in Feld P.1 und V.7 vor der Unterschrift, denn ein großer Diesel bleibt über seine gesamte Lebensdauer ein teurer Posten in der Haushaltsrechnung.</p>
<p>Zur Einordnung über die Haltedauer: Zehn Jahre mit dem Zweiliter-Diesel aus der Tabelle kosten bei unverändertem Recht ${h.eur(zwei.d.annual * 10)} Kfz-Steuer, der gleich große Benziner mit demselben CO2-Wert ${h.eur(zwei.b.annual * 10)}. Die Differenz von ${h.eur((zwei.d.annual - zwei.b.annual) * 10)} entsteht vollständig aus dem Hubraumsatz. Ob sie durch günstigeren Kraftstoff wieder hereinkommt, hängt an der Jahresfahrleistung, die jeder selbst am besten kennt.</p>`,
  },
  en: {
    slug: 'diesel-car-tax-germany',
    nav: 'Diesel car tax',
    card: `${eE(K.hubraum_diesel, 2)} per 100 cm³ instead of ${eE(K.hubraum_benzin)}: how diesel compares with petrol.`,
    title: `Diesel Car Tax Germany 2026: ${eE(K.hubraum_diesel, 2)} per 100 cm³ Explained`,
    description: `Diesel car tax in Germany 2026: ${eE(K.hubraum_diesel, 2)} per 100 cm³ against ${eE(K.hubraum_benzin)} for petrol. A 2024 diesel of 1,968 cm³ at 140 g pays ${eE(zwei.d.annual)} a year, an identical petrol car ${eE(zwei.b.annual)}.`,
    h1: 'Diesel car tax in Germany: why diesels pay more',
    intro: 'In Germany each started 100 cm³ of a diesel engine costs almost five times the petrol rate, and lower CO2 rarely makes up for it.',
    resume: `A diesel car in Germany pays ${eE(K.hubraum_diesel, 2)} of vehicle tax (Kfz-Steuer) per started 100 cm³ of engine size, while a petrol car pays ${eE(K.hubraum_benzin)}. That rate applies to every car first registered since July 2009. The CO2 charge on top works the same way for both fuels, so with identical engine size and CO2 the diesel costs exactly ${eE(diff100, 2)} more per 100 cm³ block. A 2024 diesel with 1,968 cm³ and 140 g of CO2 pays ${eE(zwei.d.annual)} a year; a petrol car with the same figures pays ${eE(zwei.b.annual)}. The petrol car would have to emit about ${gleich - zwei.co2} g/km more before both cost the same. For cars registered before July 2009 the diesel rate depends on the emission class and reaches ${eE(K.alt_saetze.sonstige[1], 2)} per 100 cm³. Euro 6 status, particle filters and mild-hybrid systems do not change the rate for newer diesels. If you are bringing a large diesel to Germany, expect the tax to be noticeably higher than for a comparable petrol car.`,
    faqs: [
      { q: 'Why is diesel car tax so much higher in Germany?', a: `Section 9(1) No. 2 KraftStG simply sets ${eE(K.hubraum_diesel, 2)} per started 100 cm³ for compression-ignition engines and ${eE(K.hubraum_benzin)} for petrol engines. The law gives no reason. It is usually explained as balancing the lower energy tax on diesel fuel at the pump. The CO2 part of the bill uses the same bands for both fuels, so the gap comes entirely from engine size.` },
      { q: 'How much tax does a 2.0-litre diesel pay in Germany?', a: `A typical 1,968 cm³ engine counts as 20 blocks, which is ${eE(20 * K.hubraum_diesel)} before CO2. First registered in 2024 with 140 g/km, the CO2 part adds ${eE(zwei.d.lines[1].amount, 2)}, for ${eE(zwei.d.annual)} a year. A 2015 diesel is cheaper on CO2 because of the older single rate, and a pre-2009 Euro 4 diesel of 1,896 cm³ pays ${eE(d06.annual)}.` },
      { q: 'Does my diesel\'s Euro 6 rating lower the German tax?', a: 'Not for cars first registered from July 2009. Only engine size and CO2 count, so a Euro 6d diesel pays the same as a Euro 5 one with identical figures. The Euro class still matters for low emission zones and for cars registered before July 2009. A temporary Euro 6 diesel exemption (Section 3b) existed for cars registered in 2011 to 2013 and ended in 2013.' },
      { q: 'Does a mild-hybrid diesel pay less German vehicle tax?', a: 'Only through its CO2 figure. A hybrid with a diesel engine is still a car with a compression-ignition engine, so it pays the full diesel rate per 100 cm³. The electric car exemption needs a purely electric drive and does not apply. If the hybrid system lowers the official CO2 value, the CO2 part shrinks, and below 96 g/km it disappears.' },
    ],
    body: (h) => `
<h2>One rate explains most of the bill</h2>
<p>Under ${h.src('kraftstg9', 'Section 9(1) No. 2 KraftStG')}, every car first registered from July 2009 pays a charge per started 100 cm³ of engine size: ${h.eur(K.hubraum_benzin)} for a petrol engine, ${h.eur(K.hubraum_diesel, 2)} for a diesel. That is ${h.num(faktor, 2)} times as much. The engine size is in field P.1 of your Zulassungsbescheinigung Teil I, the registration certificate, and the fuel in P.3. A 1,968 cm³ engine counts as 20 blocks, so the engine part alone is ${h.eur(20 * K.hubraum_diesel)} for a diesel and ${h.eur(20 * K.hubraum_benzin)} for petrol.</p>
<p>The CO2 charge is identical for both fuels. For cars first registered since 2021, each gram above ${K.co2_frei_2021} g/km costs between ${h.eur(K.co2_stufen_2021[0][1], 2)} and ${h.eur(K.co2_stufen_2021[5][1], 2)}, rising in bands. Diesels tend to emit less CO2, which narrows the gap, but rarely closes it.</p>

<h2>Same figures, different fuel</h2>
<p>To isolate the effect of the fuel, the table gives both versions the same engine size and the same CO2 value, first registered in 2024:</p>
${h.table(['Engine', 'CO2', 'Diesel', 'Petrol', 'Diesel pays more'], faelle.map((f) => [`${h.num(f.ccm)} cm³`, `${f.co2} g/km`, h.eur(f.d.annual), h.eur(f.b.annual), h.eur(f.d.annual - f.b.annual)]), 'Annual tax under Section 9(1) No. 2(c) KraftStG, first registration 2024', ['l', 'r', 'r', 'r', 'r'])}
<p>The extra cost is ${h.eur(diff100, 2)} per block, so it grows with the engine. With a three-litre unit the diesel pays over two hundred euros a year more than a petrol car with the same CO2. In every row the CO2 part is the same; at 140 g it is ${h.eur(co2Progressive(140), 2)}.</p>
<h3>The break-even point</h3>
<p>In real life the diesel usually has the lower CO2 figure. For the 1,968 cm³ diesel at 140 g, a petrol car with the same engine size would need about ${gleich} g/km before its tax matched, around ${gleich - zwei.co2} g more. Big, heavy cars can reach such gaps; small ones almost never do, which is why small diesels are rarely the cheaper choice on tax. Enter both candidates in the ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')} with their real figures.</p>

<h3>Working through the 2.0-litre example</h3>
<p>Here is the 2024 diesel with ${h.num(1968)} cm³ and 140 g, line by line. Engine: 20 started blocks at ${h.eur(K.hubraum_diesel, 2)} make ${h.eur(20 * K.hubraum_diesel, 2)}. CO2: nothing for the first ${K.co2_frei_2021} g; grams 96 to 115 at ${h.eur(K.co2_stufen_2021[0][1], 2)} add ${h.eur(st1, 2)}; grams 116 to 135 at ${h.eur(K.co2_stufen_2021[1][1], 2)} add ${h.eur(st2, 2)}; the last five grams at ${h.eur(K.co2_stufen_2021[2][1], 2)} add ${h.eur(st3, 2)}. The total is ${h.eur(zwei.d.raw, 2)}, rounded down to ${h.eur(zwei.d.annual)}. A petrol car repeats the CO2 steps exactly, but its engine part is only ${h.eur(20 * K.hubraum_benzin)}.</p>

<h2>Importing a diesel when you move</h2>
<p>Many people moving to Germany bring a diesel from countries where diesel is taxed lightly or not at all at registration. In Germany the annual tax follows the car for as long as it has German plates, and the first registration date decides which formula applies, wherever that registration happened. The CO2 value used is whatever the German registration office enters from your documents. If your foreign papers only show an older NEDC figure, the office records that; a later WLTP value for the same model does not change an existing car.</p>
<p>Diesels from 2009 to 2020 pay the same engine rate plus ${h.eur(K.co2_satz_2009)} per gram above a fixed threshold: ${K.co2_frei_bis_2011} g for cars registered up to 2011, ${K.co2_frei_2012_2013} g for 2012 and 2013, ${K.co2_frei_ab_2014} g from 2014. A 2015 diesel with ${h.num(1598)} cm³ and 105 g pays ${h.eur(d15.annual)}; the petrol twin pays ${h.eur(b15.annual)}. Cars registered before July 2009 are taxed by emission class instead, from ${h.eur(K.alt_saetze.euro3plus[1], 2)} to ${h.eur(K.alt_saetze.sonstige[1], 2)} per 100 cm³ for diesel; a 2006 Euro 4 diesel with ${h.num(1896)} cm³ pays ${h.eur(d06.annual)}. See the page on ${h.a('kfz-steuer-altfahrzeuge', 'older cars')} for every class.</p>
<!--mini:diesel-->
<h2>Rules you may read about but can ignore</h2>
<p>Two diesel-specific provisions are still printed in the law but no longer bite. Section 9a added ${h.eur(S9A, 2)} per 100 cm³ for diesels without a particle reduction level between April 2007 and March 2011. Section 3b exempted early Euro 6 diesels first registered in 2011 to 2013 until the saving reached 150 euros, and ended in 2013 at the latest. Neither affects any tax notice issued today.</p>
<p>Euro classes, particle filters and AdBlue systems likewise make no difference to the tax of a post-2009 diesel. They do matter for access to low emission zones, which follow environmental law rather than tax law; the ${h.a('umweltzone', 'low emission zone page')} explains the stickers.</p>

<h2>Diesel vans and campers</h2>
<p>The heavy diesel rate applies to passenger cars (vehicle class M1) only. A van registered as a light goods vehicle (class N1) is taxed by permitted total weight under Section 8 No. 2 KraftStG, whatever the fuel: a 3,000 kg panel van pays ${h.eur(van)} a year even with a big diesel. Motorhomes follow their own weight and emission class rules, covered on the ${h.a('kfz-steuer-wohnmobil', 'motorhome tax page')}. What counts is the class the registration office enters in field J, not how the vehicle looks. Tradespeople and families who move with a van sometimes find this the cheaper route, but the class is set by the vehicle's approval, not by choice.</p>

<h2>Seasonal plates for a second car</h2>
<p>If the diesel only comes out in summer, for towing a caravan or for the drive south, a seasonal plate (Saisonkennzeichen) limits the tax to the months shown on it. Each day costs one 365th of the annual amount (Section 11(4)), so six months cost roughly half. Outside that period the car may not be driven or parked on public roads.</p>

<h2>Hybrids with a diesel engine</h2>
<p>A diesel hybrid, mild or full, is taxed as a diesel car: full rate per 100 cm³ plus the CO2 bands. The electric car exemption requires a drive by electric motors only, so it is out of reach. The hybrid system helps only if it lowers the official CO2 figure. A diesel plug-in with a very low test value ends up paying little more than the engine part, which for a diesel is the expensive part anyway.</p>

<h2>Putting the numbers in context</h2>
<p>A current two-litre diesel typically costs two to three hundred euros a year in tax, a comparable petrol car less than half that, and an ${h.a('kfz-steuer-elektroauto', 'electric car')} nothing until 2035 at the latest. Whether a diesel still pays off depends on fuel prices and mileage more than on tax. The amount on your notice is rounded down to the euro and taken by SEPA direct debit once a year, as described in the ${h.a('kfz-steuer', 'vehicle tax overview')}. Our calculator gives the same result as the ${h.src('bmfRechner', 'Finance Ministry calculator')}: for a 2023 diesel with 1,968 cm³ and 145 g, both show ${h.eur(bmf.annual)}.</p>
<p>The tax stays with the car for its whole life and does not fall with age, so the next owner pays the same. If you plan to sell before leaving Germany, a buyer will look at the same figures. If you plan to keep the car for many years, the diesel premium adds up: over a decade, the 2.0-litre example above costs ${h.eur((zwei.d.annual - zwei.b.annual) * 10)} more than its petrol twin with identical CO2.</p>`,
  },
});
