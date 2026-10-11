import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { wohnmobil, anhaenger, pkw } from '../../lib/engine/kfzsteuer';
import { formatMoney, formatNumber } from '../../lib/format';

const K = P.kfz, W = K.wohnmobil;
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 0, 'de'), nE = (x: number) => formatNumber(x, 0, 'en');
const gewichte = [2800, 3500, 4250, 5500, 7490];
const t35 = { s4: wohnmobil(3500, 's4'), s3: wohnmobil(3500, 's3'), so: wohnmobil(3500, 'sonst') };
const t75 = { s4: wohnmobil(7490, 's4'), s3: wohnmobil(7490, 's3'), so: wohnmobil(7490, 'sonst') };
/** Gewicht, ab dem die Höchstbeträge greifen: 2 000 kg plus (Höchstbetrag − Satz bis 2 000 kg × 10) / Satz über 2 000 kg × 200 kg. */
const kappung = (w: { bis2000: number; ueber2000: number; max: number }) => 2000 + Math.ceil((w.max - w.bis2000 * 10) / w.ueber2000) * 200;
const capS4 = kappung(W.s4), capS3 = kappung(W.s3);
/** § 11 Abs. 2 KraftStG : halbjährliche Zahlung ab einer Jahressteuer über diesem Betrag (absent de params-2026.json). */
const HALBJAHR_AB = 500;
const caravan = anhaenger(1500), caravanGross = anhaenger(2500);
const kasten = pkw({ ez: '2022-05-01', fuel: 'diesel', ccm: 2287, co2: 215 });

export default defineGuide({
  id: 'kfz-steuer-wohnmobil',
  group: 'steuer',
  order: 50,
  mini: 'wohnmobil',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer', 'kfz-steuer-diesel', 'tuev-kosten', 'umweltzone'],
  sources: ['kraftstg9', 'kraftstg', 'bmfRechner'],
  de: {
    slug: 'kfz-steuer-wohnmobil',
    nav: 'Kfz-Steuer Wohnmobil',
    card: 'Steuer nach Gewicht und Schadstoffklasse, mit Höchstbeträgen.',
    title: 'Kfz-Steuer Wohnmobil 2026: Gewicht, Schadstoffklasse, Deckel',
    description: `Kfz-Steuer fürs Wohnmobil 2026: je 200 kg nach Schadstoffklasse, höchstens ${eD(W.s4.max)} (S 4) oder ${eD(W.s3.max)} (S 3 bis S 1). 3 500 kg mit S 4 kosten ${eD(t35.s4.annual)} im Jahr.`,
    h1: 'Kfz-Steuer fürs Wohnmobil: Gewicht und Schadstoffklasse',
    intro: 'Wohnmobile zahlen weder nach Hubraum noch nach CO2, sondern nach Gesamtgewicht, und die Schadstoffklasse entscheidet über den Satz.',
    resume: `Ein Wohnmobil wird nach § 9 Abs. 1 Nr. 2a KraftStG je angefangene 200 kg zulässiges Gesamtgewicht besteuert, und der Satz hängt von der Schadstoffklasse ab. Erfüllt es mindestens S 4, kosten die ersten 2 000 kg je ${eD(W.s4.bis2000)} pro 200 kg, jedes weitere Kilo-Paket ${eD(W.s4.ueber2000)}, höchstens aber ${eD(W.s4.max)} im Jahr. Bei S 3, S 2 oder S 1 sind es ${eD(W.s3.bis2000)} und ${eD(W.s3.ueber2000)}, höchstens ${eD(W.s3.max)}. Ohne diese Klassen gelten ${eD(W.sonst.bis2000)} je 200 kg bis 2 000 kg und steigende Sätze darüber, ohne Deckel. Ein typisches Reisemobil mit 3 500 kg zahlt damit ${eD(t35.s4.annual)} bei S 4, ${eD(t35.s3.annual)} bei S 3 und ${eD(t35.so.annual)} ohne Klasse. Hubraum und CO2-Wert spielen keine Rolle. Voraussetzung ist, dass die Zulassungsstelle das Fahrzeug als Wohnmobil eingetragen hat. Ein Wohnwagen dagegen ist ein Anhänger und zahlt ${eD(K.anhaenger_je_200kg, 2)} je 200 kg, höchstens ${eD(K.anhaenger_max, 2)}.`,
    faqs: [
      { q: 'Wie viel Kfz-Steuer zahlt ein Wohnmobil mit 3 500 kg?', a: `Mit Schadstoffklasse S 4 oder besser ${eD(t35.s4.annual)} im Jahr: zehn Einheiten bis 2 000 kg zu ${eD(W.s4.bis2000)} und acht Einheiten darüber zu ${eD(W.s4.ueber2000)}. Mit S 3, S 2 oder S 1 sind es ${eD(t35.s3.annual)}, ohne diese Klassen ${eD(t35.so.annual)}. Das Gewicht ist die zulässige Gesamtmasse aus Feld F.2, nicht das Leergewicht (§ 9 Abs. 1 Nr. 2a KraftStG).` },
      { q: `Ab welchem Gewicht zahlt ein Wohnmobil nur noch den Höchstbetrag von ${eD(W.s4.max)}?`, a: `Bei Schadstoffklasse S 4 oder besser ab ${nD(capS4)} kg zulässiger Gesamtmasse; darüber steigt die Steuer nicht mehr. Bei S 3 bis S 1 greift der Deckel von ${eD(W.s3.max)} erst ab ${nD(capS3)} kg. Reisemobile erreichen diese Gewichte praktisch nie, der Deckel betrifft vor allem sehr schwere Liner und umgebaute Busse. Für Fahrzeuge ohne Schadstoffklasse gibt es keinen Deckel.` },
      { q: 'Wird ein ausgebauter Kastenwagen als Wohnmobil besteuert?', a: `Nur wenn die Zulassungsstelle ihn als Wohnmobil einträgt. Maßgeblich ist nach § 2 Abs. 2 KraftStG die Feststellung der Behörde zur Fahrzeugklasse und Aufbauart. Bleibt ein ausgebauter Van als Pkw eingetragen, zahlt er nach Hubraum und CO2; ein Diesel von 2022 mit 2 287 cm³ und 215 g käme so auf ${eD(kasten.annual)}. Als Wohnmobil mit S 4 und 3 500 kg wären es ${eD(t35.s4.annual)}.` },
      { q: 'Was kostet die Kfz-Steuer für einen Wohnwagen?', a: `Ein Wohnwagen ist ein Anhänger und zahlt nach § 9 Abs. 1 Nr. 5 KraftStG ${eD(K.anhaenger_je_200kg, 2)} je angefangene 200 kg Gesamtgewicht, höchstens ${eD(K.anhaenger_max, 2)} im Jahr. Bei 1 500 kg sind das ${eD(caravan.annual)}, bei 2 500 kg ${eD(caravanGross.annual)}. Die Schadstoffklasse spielt beim Anhänger keine Rolle. Die Befreiung grüner Kennzeichen nach § 10 gilt für Wohnwagen ausdrücklich nicht.` },
      { q: 'Wie viel spart ein Wohnmobil mit S 4 gegenüber S 3 an Kfz-Steuer?', a: `Der Unterschied liegt nur im Satz für die ersten 2 000 kg: ${eD(W.s4.bis2000)} statt ${eD(W.s3.bis2000)} je 200 kg, über 2 000 kg ist der Satz gleich. Bis zum jeweiligen Deckel sind das immer ${eD(t35.s3.annual - t35.s4.annual)} im Jahr, egal wie schwer das Fahrzeug ist. Gegenüber einem Wohnmobil ohne Schadstoffklasse ist die Ersparnis deutlich größer.` },
    ],
    body: (h) => `
<h2>Gewicht statt Hubraum</h2>
<p>Für Wohnmobile gilt eine eigene Bemessung. § 8 Nr. 1a KraftStG stellt auf das verkehrsrechtlich zulässige Gesamtgewicht und zusätzlich auf die Schadstoffemissionen ab, ${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 2a')} legt die Sätze fest. Hubraum und CO2-Wert, die beim Pkw die Steuer bestimmen, sind beim Wohnmobil bedeutungslos. Das Gewicht steht in Feld F.2 der Zulassungsbescheinigung Teil I. Es ist die zulässige Gesamtmasse, nicht das Leergewicht und nicht das tatsächliche Gewicht beim Urlaubsstart.</p>
<p>Gerechnet wird in angefangenen 200 kg. Ein Fahrzeug mit ${h.num(3500)} kg hat zehn Einheiten bis 2 000 kg und acht darüber. Die Schadstoffklasse bestimmt dann, welcher Satz je Einheit gilt:</p>
<ul>
<li>mindestens S 4: ${h.eur(W.s4.bis2000)} je 200 kg bis 2 000 kg, ${h.eur(W.s4.ueber2000)} darüber, insgesamt höchstens ${h.eur(W.s4.max)};</li>
<li>S 3, S 2 oder S 1: ${h.eur(W.s3.bis2000)} bis 2 000 kg, ${h.eur(W.s3.ueber2000)} darüber, höchstens ${h.eur(W.s3.max)};</li>
<li>keine dieser Klassen: ${h.eur(W.sonst.bis2000)} bis 2 000 kg, ${h.eur(W.sonst.bis5000)} bis 5 000 kg, ${h.eur(W.sonst.bis12000)} bis 12 000 kg, ${h.eur(W.sonst.ueber12000)} darüber, ohne Höchstbetrag.</li>
</ul>

<h2>Jahressteuer nach Gewicht und Klasse</h2>
${h.table(['Zulässige Gesamtmasse', 'S 4 oder besser', 'S 3 bis S 1', 'ohne Klasse'], gewichte.map((kg) => [`${h.num(kg)} kg`, h.eur(wohnmobil(kg, 's4').annual), h.eur(wohnmobil(kg, 's3').annual), h.eur(wohnmobil(kg, 'sonst').annual)]), 'Wohnmobile nach § 9 Abs. 1 Nr. 2a KraftStG, abgerundet nach § 11 Abs. 5', ['l', 'r', 'r', 'r'])}
<p>Zwischen S 4 und S 3 liegen bei jedem Gewicht genau ${h.eur(t35.s3.annual - t35.s4.annual)} im Jahr, denn nur der Satz für die ersten 2 000 kg unterscheidet sich. Viel größer ist der Sprung zur Gruppe ohne Schadstoffklasse: Bei ${h.num(3500)} kg verdoppelt sich die Steuer gegenüber S 4, bei ${h.num(7490)} kg zahlt ein solches Fahrzeug ${h.eur(t75.so.annual)} statt ${h.eur(t75.s4.annual)}.</p>

<h3>Rechenweg ohne Schadstoffklasse</h3>
<p>Am schweren Wohnmobil ohne Klasse sieht man, wie die Stufen zusammenwirken. Bei ${h.num(7490)} kg kosten die ersten 2 000 kg zehn Einheiten zu ${h.eur(W.sonst.bis2000)}, also ${h.eur(10 * W.sonst.bis2000)}. Von 2 000 bis 5 000 kg folgen 15 Einheiten zu ${h.eur(W.sonst.bis5000)}, zusammen ${h.eur(15 * W.sonst.bis5000)}. Die restlichen ${h.num(7490 - 5000)} kg sind 13 angefangene Einheiten zu ${h.eur(W.sonst.bis12000)}, also ${h.eur(13 * W.sonst.bis12000)}. In der Summe ergibt das ${h.eur(t75.so.annual)}. Mit Schadstoffklasse S 4 zahlte dasselbe Fahrzeug ${h.eur(t75.s4.annual)}, weil oberhalb von 2 000 kg durchgehend ${h.eur(W.s4.ueber2000)} je Einheit gelten.</p>

<h3>Die Höchstbeträge</h3>
<p>Die Deckel von ${h.eur(W.s4.max)} und ${h.eur(W.s3.max)} klingen nach einer wichtigen Grenze, spielen bei normalen Reisemobilen aber keine Rolle. Bei S 4 wird der Höchstbetrag erst ab ${h.num(capS4)} kg erreicht, bei S 3 bis S 1 ab ${h.num(capS3)} kg. Das betrifft umgebaute Reisebusse und sehr schwere Liner. Für Fahrzeuge ohne Schadstoffklasse gibt es keinen Deckel; dort steigt der Satz oberhalb von 5 000 kg sogar.</p>

<h2>Woher die Schadstoffklasse kommt</h2>
<p>Die Klassen S 1 bis S 4 stammen aus Anlage XIV zu § 48 StVZO, und zwar in der Fassung vom 1. September 2023, auf die das Gesetz ausdrücklich verweist. Welche Klasse ein Fahrzeug erfüllt, stellt die Zulassungsbehörde fest, und diese Feststellung ist für die Steuer verbindlich (§ 2 Abs. 2 Nr. 2 KraftStG). Ablesen lässt sie sich aus der Emissionsschlüsselnummer in der Zulassungsbescheinigung. Neuere Reisemobile auf Transporterbasis erreichen in aller Regel mindestens S 4. Ältere Fahrzeuge, besonders aus den Neunzigerjahren, landen dagegen oft bei S 1 oder in der Gruppe ohne Klasse.</p>
<p>Wird ein Fahrzeug nachgerüstet und die Zulassungsstelle trägt eine bessere Klasse ein, ändert sich die Steuer ab diesem Tag. § 5 Abs. 3 KraftStG lässt die neue Steuerpflicht mit der Änderung beginnen, spätestens mit der Aushändigung der geänderten Zulassungsbescheinigung, und der Zoll setzt neu fest.</p>
<!--mini:wohnmobil-->
<h2>Wohnmobil oder Pkw: die Eintragung entscheidet</h2>
<p>Steuerlich ist ein Wohnmobil ein Fahrzeug der Klasse M1 mit der besonderen Zweckbestimmung Wohnmobil, so definiert es § 8 Nr. 1 KraftStG. Ob ein Fahrzeug diese Zweckbestimmung hat, ergibt sich aus der Eintragung der Zulassungsstelle zu Fahrzeugklasse und Aufbauart. Das ist vor allem für selbst ausgebaute Kastenwagen wichtig. Bleibt der Van als normaler Pkw eingetragen, zahlt er nach Hubraum und CO2, und das kann bei einem großen Diesel teuer werden: Ein Kastenwagen von 2022 mit ${h.num(2287)} cm³ und 215 g käme auf ${h.eur(kasten.annual)}. Als Wohnmobil mit S 4 und ${h.num(3500)} kg wären es ${h.eur(t35.s4.annual)}. Welche Ausstattung für die Eintragung als Wohnmobil verlangt wird, regelt das Zulassungsrecht, nicht das Steuergesetz.</p>
<p>Umgekehrt zählt ein Transporter, der als Lkw (N1) eingetragen ist, weder als Pkw noch als Wohnmobil; er zahlt die allgemeine Gewichtssteuer nach § 9 Abs. 1 Nr. 3. Wie stark der Hubraumsatz beim Diesel-Pkw ins Gewicht fällt, zeigt die Seite zur ${h.a('kfz-steuer-diesel', 'Kfz-Steuer beim Diesel')}.</p>

<h2>Der Wohnwagen als Anhänger</h2>
<p>Ein Wohnwagen hat keinen Motor und ist steuerlich ein Kraftfahrzeuganhänger. § 9 Abs. 1 Nr. 5 setzt ${h.eur(K.anhaenger_je_200kg, 2)} je angefangene 200 kg Gesamtgewicht an, höchstens ${h.eur(K.anhaenger_max, 2)} im Jahr. Ein Wohnwagen mit ${h.num(1500)} kg zahlt ${h.eur(caravan.annual)}, einer mit ${h.num(2500)} kg ${h.eur(caravanGross.annual)}. Die Schadstoffklasse des Zugfahrzeugs spielt keine Rolle. Die Sonderregel des § 10, nach der Anhänger mit grünem Kennzeichen hinter bestimmten Zugmaschinen steuerfrei bleiben, nimmt Wohnwagenanhänger ausdrücklich aus.</p>

<h2>Import, Kauf und Verkauf</h2>
<p>Wer ein Wohnmobil im Ausland kauft und in Deutschland zulässt, sollte die Übereinstimmungsbescheinigung des Herstellers zur Zulassungsstelle mitnehmen. Fehlen Angaben zur Abgasnorm, kann die Behörde nur eine schlechtere oder gar keine Schadstoffklasse eintragen, und die Steuer folgt dieser Eintragung. Bei einem Gebrauchtkauf in Deutschland übernimmt der Käufer die eingetragene Klasse; ein Blick in die Zulassungsbescheinigung vor dem Kauf zeigt also schon, welche Spalte der Tabelle gilt. Beim Verkauf endet die Steuerpflicht mit der Umschreibung auf den Käufer, und der Zoll erstattet das im Voraus gezahlte Guthaben anteilig.</p>

<h2>Saisonkennzeichen und Winterpause</h2>
<p>Viele Wohnmobile stehen im Winter. Mit einem Saisonkennzeichen ist das Fahrzeug nur in den Monaten auf dem Schild zugelassen, und die Steuer läuft nur in dieser Zeit: je Tag ein Dreihundertfünfundsechzigstel der Jahressteuer nach § 11 Abs. 4. Bei einer Saison von März bis Oktober zahlt das Wohnmobil mit S 4 und ${h.num(3500)} kg also rund zwei Drittel von ${h.eur(t35.s4.annual)}. Die Saison gilt jedes Jahr wieder, ohne neue Zulassung. Wer stattdessen abmeldet, muss nach § 5 Abs. 1 Nr. 1 bei jeder neuen Zulassung mindestens einen Monat Steuer zahlen und bekommt jedes Mal einen neuen Bescheid.</p>

<h2>Schwere Wohnmobile über 3,5 Tonnen</h2>
<p>Für Wohnmobile über ${h.num(3500)} kg gilt dieselbe Vorschrift wie für leichtere; die Sätze über 2 000 kg bleiben bei S 4 und S 3 gleich. Das macht schwere Reisemobile steuerlich überraschend günstig, solange sie eine Schadstoffklasse haben: ${h.num(7490)} kg kosten bei S 4 ${h.eur(t75.s4.annual)} im Jahr. Für die Fahrerlaubnis, die Hauptuntersuchung und die Maut im Ausland gelten über 3,5 t allerdings andere Regeln als beim Pkw. Die HU-Kosten stehen unter ${h.a('tuev-kosten', 'TÜV-Kosten')}. Wohnmobile von Schaustellern über 3,5 t sind nach § 3 Nr. 8 Buchst. b KraftStG befreit, solange sie ausschließlich dem Schaustellergewerbe dienen.</p>

<h2>Bescheid, Zahlung und Umweltzone</h2>
<p>Für Wohnmobile gelten die allgemeinen Verfahrensregeln: Zoll und Hauptzollamt erheben die Steuer, die Zahlung läuft per SEPA-Lastschrift jährlich im Voraus, der Betrag wird auf volle Euro abgerundet. Halbjährliche Zahlung ist erst ab einer Jahressteuer von mehr als ${h.eur(HALBJAHR_AB)} möglich, was bei Wohnmobilen ohne Schadstoffklasse vorkommen kann. Mehr dazu auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')}. Den Betrag für Ihr Gewicht und Ihre Klasse liefert der ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')}; er stimmt in unseren Tests mit dem ${h.src('bmfRechner', 'Rechner des Bundesfinanzministeriums')} überein.</p>
<p>Die Schadstoffklasse für die Steuer ist nicht dasselbe wie die Feinstaubplakette für Umweltzonen. Ein Wohnmobil mit S 4 hat nicht automatisch die grüne Plakette. Was in Umweltzonen gilt und was ein Verstoß kostet, steht unter ${h.a('umweltzone', 'Umweltzone')}.</p>`,
  },
  en: {
    slug: 'motorhome-tax-germany',
    nav: 'Motorhome tax',
    card: 'Taxed by weight and emission class, with annual caps.',
    title: 'Motorhome Tax Germany 2026: Weight, Emission Class, Caps',
    description: `Motorhome tax in Germany 2026: charged per 200 kg by emission class, capped at ${eE(W.s4.max)} (S 4) or ${eE(W.s3.max)} (S 3 to S 1). A 3,500 kg S 4 camper pays ${eE(t35.s4.annual)} a year.`,
    h1: 'Motorhome tax in Germany: weight and emission class',
    intro: 'A motorhome registered in Germany is taxed on its permitted total weight, and its emission class sets the rate.',
    resume: `Motorhomes (Wohnmobile) are taxed in Germany under Section 9(1) No. 2a of the Motor Vehicle Tax Act on each started 200 kg of permitted total weight, at a rate set by the emission class. With class S 4 or better the first 2,000 kg cost ${eE(W.s4.bis2000)} per 200 kg and every block above costs ${eE(W.s4.ueber2000)}, up to ${eE(W.s4.max)} a year. With S 3, S 2 or S 1 the rates are ${eE(W.s3.bis2000)} and ${eE(W.s3.ueber2000)}, capped at ${eE(W.s3.max)}. Vehicles without one of these classes pay ${eE(W.sonst.bis2000)} per 200 kg up to 2,000 kg and rising rates above, with no cap. A typical 3,500 kg camper therefore pays ${eE(t35.s4.annual)} with S 4, ${eE(t35.s3.annual)} with S 3 and ${eE(t35.so.annual)} without a class. Engine size and CO2 do not matter, but the vehicle must be registered as a motorhome. A converted van left registered as a passenger car pays car tax instead. A towed caravan counts as a trailer and pays ${eE(K.anhaenger_je_200kg, 2)} per 200 kg, at most ${eE(K.anhaenger_max, 2)}.`,
    faqs: [
      { q: 'How is motorhome tax calculated in Germany?', a: `By permitted total weight in started 200 kg blocks and by emission class. A 3,500 kg motorhome with S 4 has ten blocks up to 2,000 kg at ${eE(W.s4.bis2000)} and eight above at ${eE(W.s4.ueber2000)}, so ${eE(t35.s4.annual)} a year. The weight is field F.2 on the registration certificate. The S class is recorded by the registration office and binds customs (Section 2(2) KraftStG).` },
      { q: 'Is my converted camper van taxed as a motorhome in Germany?', a: `Only if the registration office records it as a motorhome. Otherwise it stays a passenger car and pays engine-size and CO2 tax: a 2022 diesel van with 2,287 cm³ and 215 g would pay ${eE(kasten.annual)}, against ${eE(t35.s4.annual)} as a 3,500 kg S 4 motorhome. The fit-out needed for that entry is a matter of registration law, not tax law.` },
      { q: 'How much tax does a caravan pay in Germany?', a: `A caravan is a trailer, so Section 9(1) No. 5 KraftStG applies: ${eE(K.anhaenger_je_200kg, 2)} per started 200 kg of permitted total weight, never more than ${eE(K.anhaenger_max, 2)} a year. A 1,500 kg caravan pays ${eE(caravan.annual)}, a 2,500 kg one ${eE(caravanGross.annual)}. Emission classes play no part, and caravans are expressly excluded from the green-plate trailer exemption.` },
      { q: 'Does a heavy motorhome over 7 tonnes pay much more tax in Germany?', a: `Not if it has an emission class. Above 2,000 kg the rate stays at ${eE(W.s4.ueber2000)} per 200 kg for S 4 and S 3, so a 7,490 kg S 4 motorhome pays ${eE(t75.s4.annual)} a year. Without a class it pays ${eE(t75.so.annual)}, because the rates rise above 5,000 kg and there is no cap. The caps for S 4 and S 3 only apply from ${nE(capS4)} and ${nE(capS3)} kg.` },
    ],
    body: (h) => `
<h2>Weight, not engine size</h2>
<p>Germany taxes motorhomes differently from cars. Section 8 No. 1a KraftStG bases the tax on permitted total weight plus pollutant emissions, and ${h.src('kraftstg9', 'Section 9(1) No. 2a')} sets the rates. Engine size and CO2, which drive car tax, are ignored. The weight that counts is the permitted total weight in field F.2 of the Zulassungsbescheinigung Teil I, the registration certificate, not the empty weight and not what the camper weighs fully loaded on the ferry.</p>
<p>Weight is counted in started blocks of 200 kg. The emission class then picks the rate per block:</p>
<ul>
<li>S 4 or better: ${h.eur(W.s4.bis2000)} per 200 kg up to 2,000 kg, ${h.eur(W.s4.ueber2000)} above, at most ${h.eur(W.s4.max)} a year;</li>
<li>S 3, S 2 or S 1: ${h.eur(W.s3.bis2000)} up to 2,000 kg, ${h.eur(W.s3.ueber2000)} above, at most ${h.eur(W.s3.max)};</li>
<li>none of these: ${h.eur(W.sonst.bis2000)} up to 2,000 kg, ${h.eur(W.sonst.bis5000)} to 5,000 kg, ${h.eur(W.sonst.bis12000)} to 12,000 kg, ${h.eur(W.sonst.ueber12000)} above, with no cap.</li>
</ul>

<h2>What typical motorhomes pay</h2>
${h.table(['Permitted total weight', 'S 4 or better', 'S 3 to S 1', 'no class'], gewichte.map((kg) => [`${h.num(kg)} kg`, h.eur(wohnmobil(kg, 's4').annual), h.eur(wohnmobil(kg, 's3').annual), h.eur(wohnmobil(kg, 'sonst').annual)]), 'Motorhomes under Section 9(1) No. 2a KraftStG, rounded down to the euro', ['l', 'r', 'r', 'r'])}
<p>S 4 and S 3 differ by exactly ${h.eur(t35.s3.annual - t35.s4.annual)} a year at every weight, because only the rate for the first 2,000 kg changes. The real jump is to the no-class group: at ${h.num(3500)} kg the tax doubles compared with S 4, and at ${h.num(7490)} kg it reaches ${h.eur(t75.so.annual)} against ${h.eur(t75.s4.annual)}.</p>
<h3>A worked example without a class</h3>
<p>Take a 7,490 kg motorhome with no S class. The first 2,000 kg are ten blocks at ${h.eur(W.sonst.bis2000)}, which is ${h.eur(10 * W.sonst.bis2000)}. From 2,000 to 5,000 kg come 15 blocks at ${h.eur(W.sonst.bis5000)}, adding ${h.eur(15 * W.sonst.bis5000)}. The last ${h.num(7490 - 5000)} kg are 13 started blocks at ${h.eur(W.sonst.bis12000)}, adding ${h.eur(13 * W.sonst.bis12000)}. The total is ${h.eur(t75.so.annual)}. With S 4, every block above 2,000 kg would cost ${h.eur(W.s4.ueber2000)}, and the bill would drop to ${h.eur(t75.s4.annual)}.</p>

<p>The caps rarely matter. With S 4 the ${h.eur(W.s4.max)} ceiling is reached only from ${h.num(capS4)} kg, with S 3 to S 1 the ${h.eur(W.s3.max)} ceiling from ${h.num(capS3)} kg. Converted coaches and the heaviest liners get there; ordinary campers do not.</p>

<h2>Bringing a motorhome when you move</h2>
<p>Expats sometimes arrive with a camper registered in the UK, the Netherlands or Scandinavia. When it is registered in Germany, the registration office records two things that settle the tax: the vehicle class and body type, which decide whether it is a motorhome at all, and the S emission class under annex XIV to Section 48 StVZO, in the version of 1 September 2023 that the tax law refers to. Section 2(2) KraftStG makes both entries binding on customs. Recent motorhomes built on a van chassis usually meet at least S 4; vehicles from the 1990s often end up in S 1 or in the no-class group.</p>
<p>If the foreign papers do not show the emission standard clearly, the office may record a worse class than the vehicle actually meets, and the tax follows the record. It is worth bringing the manufacturer's certificate of conformity to the appointment. If a retrofit later earns a better class, the tax changes from the day of the change or, at the latest, from the day you receive the amended certificate (Section 5(3)).</p>
<!--mini:wohnmobil-->
<h2>Leaving Germany with the motorhome</h2>
<p>If you move on and take the camper with you, deregistering it ends the tax liability, and customs refunds the unused part of the year by the day. Export plates (Ausfuhrkennzeichen), used to drive a vehicle out of the country, are taxed for as long as they may be used, with a minimum of one month (Section 5(1) No. 4). Check that the refund account you gave customs will still work after you leave; a closed German account is the usual reason refunds go astray.</p>

<h2>Reading the certificate</h2>
<p>Before buying a used motorhome in Germany, look at the registration certificate rather than the advert. Field F.2 gives the permitted total weight, and the emission key number shows the class the registration office recorded. Together they tell you which column of the table above applies. A seller's claim that the vehicle is cleaner than its entry does not change the tax until the entry itself is changed.</p>

<h2>Self-built camper vans</h2>
<p>For tax purposes a motorhome is a vehicle of class M1 with the special purpose motorhome (Section 8 No. 1). Whether a converted van has that status depends on the registration entry, not on the bed and the cooker in the back. A van that stays registered as an ordinary car pays car tax on engine size and CO2, which for a big diesel is expensive: a 2022 van with ${h.num(2287)} cm³ and 215 g would pay ${h.eur(kasten.annual)}, compared with ${h.eur(t35.s4.annual)} as a 3,500 kg S 4 motorhome. A van registered as a goods vehicle (N1) is taxed by weight under the general rule instead. The ${h.a('kfz-steuer-diesel', 'diesel tax page')} shows how quickly the car formula adds up.</p>

<h2>Caravans</h2>
<p>A towed caravan is a trailer. Section 9(1) No. 5 charges ${h.eur(K.anhaenger_je_200kg, 2)} per started 200 kg of permitted total weight, capped at ${h.eur(K.anhaenger_max, 2)} a year. A ${h.num(1500)} kg caravan pays ${h.eur(caravan.annual)}, a ${h.num(2500)} kg one ${h.eur(caravanGross.annual)}. No emission class applies. Section 10, which lets some trailers with green plates go untaxed behind certain towing vehicles, expressly excludes caravans.</p>

<h2>Seasonal plates</h2>
<p>Motorhomes are the classic case for a Saisonkennzeichen, a plate valid only for set months each year. Tax runs only within that window, at one 365th of the annual amount per day (Section 11(4)), and the season repeats automatically every year. With a March to October season, the 3,500 kg S 4 camper pays roughly two thirds of ${h.eur(t35.s4.annual)}. Deregistering each winter instead means at least one month of tax for every new registration (Section 5(1) No. 1) and a new notice each time.</p>

<h2>Heavy motorhomes</h2>
<p>The same rule covers motorhomes above 3.5 tonnes, and for S 4 and S 3 the rate per block above 2,000 kg does not rise. That makes heavy campers cheap to tax as long as they have a class: ${h.num(7490)} kg with S 4 costs ${h.eur(t75.s4.annual)} a year. Licence category, inspection intervals and tolls abroad are a different matter above 3.5 tonnes; inspection prices are on the ${h.a('tuev-kosten', 'TÜV cost page')}. Showmen's motorhomes above 3.5 tonnes used only for the fairground trade are exempt under Section 3 No. 8(b).</p>

<h2>Paying and checking</h2>
<p>Motorhomes follow the general procedure: customs collects the tax through the local Hauptzollamt, by SEPA direct debit, once a year in advance, rounded down to the euro. Half-yearly payment is allowed only above ${h.eur(HALBJAHR_AB)} a year, which a no-class motorhome can exceed. The ${h.a('kfz-steuer', 'vehicle tax overview')} explains notices and refunds, and the ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')} gives your figure; it matches the ${h.src('bmfRechner', 'Finance Ministry calculator')} in our tests.</p>
<p>The S class used for tax is not the same thing as the particulate sticker needed for German low emission zones. An S 4 motorhome does not automatically get a green sticker; the ${h.a('umweltzone', 'low emission zone page')} explains what applies there.</p>`,
  },
});
