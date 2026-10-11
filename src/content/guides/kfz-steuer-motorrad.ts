import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { krad, pkw, elektro } from '../../lib/engine/kfzsteuer';
import { formatMoney, formatNumber } from '../../lib/format';

const K = P.kfz;
/** § 9 Abs. 4 KraftStG : Jahressteuer für Oldtimer- und rote Kennzeichen (absent de params-2026.json). */
const S94 = { krad: 46.02, sonst: 191.73 };
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
const hubraeume = [250, 390, 500, 689, 890, 1254, 1868];
const mot = krad(689), liter = krad(1000), gross = krad(1868), klein = krad(390);
const schwelle = Math.floor(S94.krad / K.krad_je_25ccm) * 25;
const k999 = krad(999), k1001 = krad(1001);
const SAISON_TAGE = 214; // 1. April bis 31. Oktober
const saison = Math.floor(mot.raw * SAISON_TAGE / 365);
const saisonGross = Math.floor(gross.raw * SAISON_TAGE / 365);
const auto = pkw({ ez: '2024-04-01', fuel: 'benzin', ccm: 999, co2: 110 });
const eMot = elektro('2018-05-01', 450, 2030);

export default defineGuide({
  id: 'kfz-steuer-motorrad',
  group: 'steuer',
  order: 40,
  mini: 'krad',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer', 'kfz-steuer-elektroauto', 'tuev-kosten', 'fuehrerschein-kosten'],
  sources: ['kraftstg9', 'kraftstg', 'bmfRechner', 'zoll'],
  de: {
    slug: 'kfz-steuer-motorrad',
    nav: 'Kfz-Steuer Motorrad',
    card: 'Jahressteuer je 25 cm³, Saisonkennzeichen und H-Kennzeichen.',
    title: 'Kfz-Steuer Motorrad 2026: Satz je 25 cm³ und Beispiele',
    description: `Kfz-Steuer fürs Motorrad 2026: ${eD(K.krad_je_25ccm, 2)} je angefangene 25 cm³, ohne CO2 und Euro-Norm. 689 cm³ kosten ${eD(mot.annual)} im Jahr, ein Motorrad mit 1 000 cm³ zahlt ${eD(liter.annual)}.`,
    h1: 'Kfz-Steuer fürs Motorrad: eine einfache Rechnung',
    intro: 'Beim Motorrad zählt für die Steuer nur der Hubraum, und die Beträge bleiben selbst bei großen Maschinen überschaubar.',
    resume: `Ein Motorrad mit Hubkolbenmotor zahlt in Deutschland ${eD(K.krad_je_25ccm, 2)} Kfz-Steuer je angefangene 25 cm³ Hubraum, so steht es in § 9 Abs. 1 Nr. 1 KraftStG. Weder der CO2-Ausstoß noch die Euro-Norm noch das Alter der Maschine spielen eine Rolle, anders als beim Pkw. Eine Mittelklasse mit 689 cm³ kommt auf 28 Einheiten und damit auf ${eD(mot.annual)} im Jahr, ein Literbike auf ${eD(liter.annual)}, ein großer Tourer mit 1 868 cm³ auf ${eD(gross.annual)}. Der Betrag wird nach § 11 Abs. 5 auf volle Euro abgerundet und vom Zoll jährlich per SEPA eingezogen. Viele Motorräder fahren mit Saisonkennzeichen; dann fällt die Steuer nur für die Monate auf dem Schild an, von April bis Oktober etwa ${eD(saison)} bei 689 cm³. Für Oldtimer mit H-Kennzeichen gilt nach § 9 Abs. 4 ein fester Jahresbetrag von ${eD(S94.krad, 2)}. Elektromotorräder sind zehn Jahre befreit und zahlen danach nach Gewicht, halbiert.`,
    faqs: [
      { q: 'Wie viel Kfz-Steuer kostet ein Motorrad mit 1 000 cm³?', a: `${eD(liter.annual)} im Jahr. 1 000 cm³ sind genau 40 Einheiten zu je 25 cm³, multipliziert mit ${eD(K.krad_je_25ccm, 2)} ergibt das ${eD(liter.raw, 2)}, abgerundet auf volle Euro nach § 11 Abs. 5 KraftStG. Hätte der Motor 1 001 cm³, käme eine angefangene Einheit hinzu. Baujahr, Leistung und Abgasnorm ändern an dem Betrag nichts.` },
      { q: 'Lohnt sich ein Saisonkennzeichen beim Motorrad steuerlich?', a: `Es spart anteilig: Die Steuer läuft nur für die Tage im Betriebszeitraum, je Tag ein 365stel der Jahressteuer (§ 11 Abs. 4 KraftStG). Bei 689 cm³ und April bis Oktober sind das etwa ${eD(saison)} statt ${eD(mot.annual)}. Weil die Motorradsteuer niedrig ist, geht es um wenige Euro; der größere Effekt liegt meist bei der Versicherung, die ebenfalls nur für die Saison läuft.` },
      { q: 'Was kostet die Kfz-Steuer für ein Motorrad mit H-Kennzeichen?', a: `Für Oldtimer-Kennzeichen setzt § 9 Abs. 4 KraftStG eine feste Jahressteuer an: ${eD(S94.krad, 2)}, wenn das Kennzeichen nur für Krafträder gilt, sonst ${eD(S94.sonst, 2)}. Der Hubraum spielt dann keine Rolle. Bei kleinen Oldtimern kann die normale Steuer sogar günstiger sein; bei großen Maschinen lohnt der Vergleich, ein Motorrad mit 1 868 cm³ zahlt regulär ${eD(gross.annual)}.` },
      { q: 'Zahlt ein Elektromotorrad Kfz-Steuer?', a: 'Zunächst nicht. § 3d KraftStG befreit alle Elektrofahrzeuge, nicht nur Autos, für zehn Jahre ab Erstzulassung bis Ende 2030, längstens bis 31.12.2035. Danach gilt nicht der Satz je 25 cm³, denn der ist auf Hubkolbenmotoren beschränkt, sondern die Steuer nach Gesamtgewicht, für Elektrofahrzeuge halbiert. Bei einem leichten Motorrad sind das nur wenige Euro im Jahr.' },
      { q: 'Spielt die Euro-Norm beim Motorrad für die Kfz-Steuer eine Rolle?', a: 'Nein. § 9 Abs. 1 Nr. 1 KraftStG kennt für Krafträder nur den Hubraum, gemessen in angefangenen 25 cm³. Eine Euro-5-Maschine zahlt also genauso viel wie eine Euro-3-Maschine mit gleichem Hubraum, und auch ein dreißig Jahre altes Motorrad zahlt den gleichen Satz. Das unterscheidet die Motorradsteuer deutlich von der Pkw-Steuer.' },
    ],
    body: (h) => `
<h2>Ein Satz für alle Krafträder</h2>
<p>${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 1 KraftStG')} ist kurz: Krafträder mit Hubkolbenmotor zahlen ${h.eur(K.krad_je_25ccm, 2)} für je 25 cm³ Hubraum oder einen Teil davon. Mehr steht dort nicht. Es gibt keine Stufen, keine Freigrenze, keinen CO2-Anteil und keine Unterscheidung nach Benzin oder Diesel. Ob die Maschine 1995 oder 2025 zugelassen wurde, ist gleichgültig. Den Hubraum finden Sie in Feld P.1 der Zulassungsbescheinigung Teil I.</p>
<p>Was ebenfalls nicht zählt: die Leistung in Kilowatt, das Gewicht, die Lautstärke und die Frage, ob ein Beiwagen oder Topcase montiert ist. Ein 48-PS-Motorrad für den Stufenführerschein A2 und eine gedrosselte Version derselben Maschine zahlen denselben Betrag, solange der Hubraum gleich bleibt. Geräuschklassen kennt das KraftStG nur bei schweren Fahrzeugen über 3,5 t. Auch für Motorräder mit Dieselmotor, die es vereinzelt gibt, gilt derselbe Satz je 25 cm³, denn § 9 Abs. 1 Nr. 1 unterscheidet nicht nach Kraftstoff.</p>
<p>Gerechnet wird in angefangenen Einheiten. Ein Motor mit 689 cm³ hat 27 volle Einheiten und eine angefangene, zusammen 28. Das ergibt ${h.eur(mot.raw, 2)}, nach § 11 Abs. 5 auf volle Euro abgerundet ${h.eur(mot.annual)}. Ein Kubikzentimeter über einer 25er-Grenze kostet also eine ganze Einheit, beim Motorrad aber nur ${h.eur(K.krad_je_25ccm, 2)}.</p>

<h2>Jahressteuer nach Hubraum</h2>
${h.table(['Hubraum', 'Einheiten zu 25 cm³', 'Jahressteuer'], hubraeume.map((c) => [`${h.num(c)} cm³`, h.num(Math.ceil(c / 25)), h.eur(krad(c).annual)]), `Krafträder mit Hubkolbenmotor, § 9 Abs. 1 Nr. 1 KraftStG, ${h.eur(K.krad_je_25ccm, 2)} je angefangene 25 cm³`, ['l', 'r', 'r'])}
<p>Selbst ein großer Tourer mit ${h.num(1868)} cm³ bleibt unter ${h.eur(Math.ceil(gross.annual / 10) * 10)} im Jahr. Zum Vergleich: Ein kleiner Benziner von 2024 mit ${h.num(999)} cm³ und 110 g CO2 zahlt ${h.eur(auto.annual)}, also in derselben Größenordnung wie ein Motorrad mit fast der doppelten Hubraumgröße. Die Motorradsteuer ist damit einer der günstigsten Posten im Fahrzeugbudget, deutlich unter Versicherung, Reifen und Wartung.</p>

<h2>Saisonkennzeichen: Steuer nur für die Fahrmonate</h2>
<p>Viele Motorräder fahren nur von Frühjahr bis Herbst und sind mit einem Saisonkennzeichen zugelassen. Darauf steht der Betriebszeitraum, etwa 04 bis 10. Steuerpflichtig ist das Motorrad nach § 5 Abs. 1 Nr. 5 KraftStG nur, solange das Kennzeichen geführt werden darf. § 11 Abs. 4 rechnet dann für jeden Tag ein Dreihundertfünfundsechzigstel der Jahressteuer; der 29. Februar zählt in Schaltjahren nicht mit.</p>
<p>Für die Maschine mit 689 cm³ und den Zeitraum April bis Oktober, ${SAISON_TAGE} Tage, ergibt das etwa ${h.eur(saison)} statt ${h.eur(mot.annual)}. Beim großen Tourer sind es rund ${h.eur(saisonGross)}. Die Ersparnis ist absolut gering. Ein Saisonkennzeichen lohnt sich eher wegen der Versicherung und weil das Motorrad im Winter ohnehin steht. Außerhalb des Zeitraums darf es nicht auf öffentlichen Straßen fahren oder parken.</p>
<p>Ein Saisonkennzeichen wird bei der Zulassung beantragt und gilt jedes Jahr wieder für dieselben Monate, ohne neue Anmeldung. Der Zoll setzt die Steuer nach § 12 Abs. 1 ab dem ersten Gültigkeitstag unbefristet fest und bucht sie zu Beginn jeder Saison ab. Einen gemeinsamen Fälligkeitstag mit anderen Fahrzeugen erlaubt das Gesetz bei Saisonkennzeichen nicht.</p>
<!--mini:krad-->
<h2>Oldtimer mit H-Kennzeichen</h2>
<p>Ein Oldtimer-Kennzeichen ändert die Rechnung vollständig. § 1 Abs. 1 Nr. 4 KraftStG macht die Zuteilung eines solchen Kennzeichens selbst zum Steuergegenstand, und § 9 Abs. 4 setzt dafür einen festen Jahresbetrag an: ${h.eur(S94.krad, 2)}, wenn das Kennzeichen nur für Krafträder gilt. Der Hubraum spielt dann keine Rolle mehr.</p>
<p>Ob sich das steuerlich lohnt, hängt vom Motor ab. Eine Maschine mit 390 cm³ zahlt regulär ${h.eur(klein.annual)}, mit H-Kennzeichen wäre sie teurer. Erst über ${h.num(schwelle)} cm³ ist der Festbetrag günstiger, und bei einer großen Maschine spart er einige Dutzend Euro. Für die meisten Besitzer ist das H-Kennzeichen ohnehin eine Frage der Anerkennung als historisches Fahrzeug, nicht der Steuer. Voraussetzungen und Begutachtung regelt das Zulassungsrecht, nicht das KraftStG.</p>

<h2>Elektromotorräder und andere Antriebe</h2>
<p>Der Satz je 25 cm³ gilt ausdrücklich nur für Hubkolbenmotoren. Elektromotorräder fallen unter § 3d KraftStG und sind zehn Jahre ab Erstzulassung befreit, wenn diese bis Ende 2030 liegt, längstens bis Ende 2035. Danach zahlen sie wie andere Fahrzeuge bis 3,5 t nach dem zulässigen Gesamtgewicht, für Elektrofahrzeuge halbiert. Ein E-Motorrad mit 450 kg zulässiger Gesamtmasse von 2018 zahlt nach Ablauf der Befreiung ${h.eur(eMot.annual)} im Jahr. Wie die Befreiung im Einzelnen läuft, erklärt die Seite zum ${h.a('kfz-steuer-elektroauto', 'Elektroauto')}; die Regeln sind dieselben.</p>
<p>Dreirädrige und leichte vierrädrige Kraftfahrzeuge mit Hubkolbenmotor, also bestimmte Trikes und Quads, haben nach § 9 Abs. 1 Nr. 2b eigene Sätze je 100 cm³, abhängig von Kraftstoff und Abgaswerten. Sie fallen nicht unter den Motorradsatz. Hier lohnt der Blick in den ${h.src('bmfRechner', 'Rechner des Bundesfinanzministeriums')}, weil die Einordnung von der Fahrzeugklasse in der Zulassungsbescheinigung abhängt.</p>

<h2>Welche Zweiräder keine Steuer zahlen</h2>
<p>Nach § 3 Nr. 1 KraftStG ist das Halten von Fahrzeugen steuerfrei, die nach § 3 Abs. 1 der Fahrzeug-Zulassungsverordnung von der Zulassungspflicht ausgenommen sind. Welche Zweiräder das sind, bestimmt die Fahrzeug-Zulassungsverordnung, nicht das Steuergesetz. Wer ein kleines Zweirad mit Versicherungskennzeichen statt amtlichem Kennzeichen fährt, bekommt deshalb keinen Steuerbescheid. Alles, was ein amtliches Kennzeichen von der Zulassungsstelle trägt, ist steuerpflichtig, sofern keine andere Befreiung greift.</p>

<h2>Grenzfälle und Rundung</h2>
<p>Weil jede angefangene Einheit voll zählt, liegen Motorräder mit fast gleichem Hubraum manchmal eine Stufe auseinander. Ein Motor mit ${h.num(999)} cm³ zahlt ${h.eur(k999.annual)}, einer mit ${h.num(1001)} cm³ ${h.eur(k1001.annual)}. Mehr als ein paar Euro macht das nie aus. Entscheidend ist der Wert, den die Zulassungsstelle in Feld P.1 eingetragen hat, nicht die Angabe im Prospekt; bei Umbauten mit größerem Zylinder muss der neue Hubraum eingetragen werden, und die Steuer ändert sich ab diesem Tag (§ 5 Abs. 3 KraftStG).</p>

<h2>Abmelden im Winter oder Saisonkennzeichen?</h2>
<p>Statt eines Saisonkennzeichens melden manche Fahrer ihr Motorrad im Herbst ab und im Frühjahr wieder an. Steuerlich ist der Unterschied gering, praktisch nicht: Jede Zulassung begründet nach § 5 Abs. 1 Nr. 1 eine Steuerpflicht von mindestens einem Monat, löst einen neuen Bescheid aus und kostet Zulassungsgebühren. Das Saisonkennzeichen erspart diesen Aufwand, weil es jedes Jahr automatisch für dieselben Monate gilt. Wer die Saison spontan verlängern will, muss den Betriebszeitraum ändern lassen; der Zoll setzt dann neu fest (§ 12 Abs. 2 Nr. 5).</p>

<h2>Mehrere Fahrzeuge, ein Fälligkeitstag</h2>
<p>Wer neben dem Motorrad ein ganzjährig zugelassenes Auto hält, bekommt zwei Bescheide mit unterschiedlichen Fälligkeitstagen. Auf Antrag lässt sich nach § 11 Abs. 4 Nr. 1 ein einheitlicher Tag festlegen; dafür wird für mindestens zwei Fahrzeuge einmal tageweise abgerechnet. Für ein Motorrad mit Saisonkennzeichen ist das ausgeschlossen.</p>

<h2>Mit dem eigenen Motorrad aus dem Ausland</h2>
<p>Motorradurlauber mit ausländischem Kennzeichen zahlen in Deutschland keine Kfz-Steuer, solange sie nur vorübergehend hier sind: § 3 Nr. 13 KraftStG befreit ausländische Personenfahrzeuge bis zu einem Jahr, solange kein regelmäßiger Standort im Inland begründet ist. Wer dagegen nach Deutschland zieht und das Motorrad hier dauerhaft nutzt, muss es umschreiben und zahlt ab der Zulassung den normalen Satz.</p>

<h2>Zahlung, Abmeldung, Halterwechsel</h2>
<p>Für Motorräder gelten dieselben Verfahrensregeln wie für Autos. Der ${h.src('zoll', 'Zoll')} zieht die Steuer per SEPA-Lastschrift jährlich im Voraus ein, bei Saisonkennzeichen für den Betriebszeitraum. Wer das Motorrad abmeldet, bekommt den zu viel gezahlten Anteil erstattet; der Tag der Abmeldung wird nicht mitgerechnet. Beim Verkauf endet die Steuerpflicht mit der Umschreibung auf den Käufer. Mehr zu Bescheid und Fristen steht auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')}, die Jahressteuer für jeden Hubraum rechnet der ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')}.</p>
<p>Neben der Steuer kommen beim Motorrad die Hauptuntersuchung alle zwei Jahre und die Versicherung hinzu. Was die HU kostet, steht unter ${h.a('tuev-kosten', 'TÜV-Kosten')}, die Prüfungsgebühren für den Motorradführerschein unter ${h.a('fuehrerschein-kosten', 'Führerscheinkosten')}.</p>`,
  },
  en: {
    slug: 'motorbike-tax-germany',
    nav: 'Motorbike tax',
    card: 'Annual tax per 25 cm³, seasonal plates and classic bikes.',
    title: 'Motorbike Tax Germany 2026: Kfz-Steuer per 25 cm³ Engine',
    description: `Motorbike tax in Germany 2026: ${eE(K.krad_je_25ccm, 2)} per started 25 cm³, no CO2 or Euro class involved. A 689 cm³ bike pays ${eE(mot.annual)} a year, a 1,000 cm³ litre bike pays ${eE(liter.annual)}.`,
    h1: 'Motorbike tax in Germany: what riders pay',
    intro: 'German motorbike tax depends on engine size alone, and even big touring bikes cost less than a small car.',
    resume: `Motorbikes with piston engines pay ${eE(K.krad_je_25ccm, 2)} of German vehicle tax (Kfz-Steuer) for every started 25 cm³ of engine capacity, under Section 9(1) No. 1 of the Motor Vehicle Tax Act. Nothing else counts: no CO2 figure, no Euro emission class, no age adjustment. A 689 cm³ middleweight is 28 blocks and pays ${eE(mot.annual)} a year, a 1,000 cm³ sports bike pays ${eE(liter.annual)} and a 1,868 cm³ cruiser ${eE(gross.annual)}. The amount is rounded down to the euro and collected once a year by German customs through SEPA direct debit. Many riders register their bike on a seasonal plate, which limits the tax to the months shown: April to October costs about ${eE(saison)} for the 689 cm³ bike. Classic bikes on a historic H plate pay a flat ${eE(S94.krad, 2)} a year. Electric motorbikes are exempt for up to ten years and then pay a small weight-based tax at half rate. If you bring a bike when you move to Germany, the tax is one of the smaller costs.`,
    faqs: [
      { q: 'How much is road tax on a motorbike in Germany?', a: `It is ${eE(K.krad_je_25ccm, 2)} per started 25 cm³, so the engine size in field P.1 of the registration certificate decides it. A 390 cm³ single pays ${eE(klein.annual)} a year, a 689 cm³ twin ${eE(mot.annual)} and a 1,000 cm³ four ${eE(liter.annual)}. Age, power and emission class make no difference, and the result is rounded down to whole euros (Section 11(5) KraftStG).` },
      { q: 'Can I keep my motorbike on a seasonal plate in Germany?', a: `Yes. A Saisonkennzeichen shows the months in which the bike may be used, for example 04 to 10, and the tax runs only for those days, one 365th of the annual amount per day (Section 11(4) KraftStG). For a 689 cm³ bike, April to October costs about ${eE(saison)} instead of ${eE(mot.annual)}. Out of season the bike must stay off public roads.` },
      { q: 'Do classic motorbikes with an H plate pay less tax in Germany?', a: `Not always. A historic plate carries a flat annual tax of ${eE(S94.krad, 2)} for motorbikes under Section 9(4) KraftStG, regardless of engine size. A small classic is cheaper on the normal rate: a 390 cm³ bike pays ${eE(klein.annual)}. Above ${formatNumber(schwelle, 0, 'en')} cm³ the flat rate wins, and for a 1,868 cm³ machine it saves about ${eE(gross.annual - S94.krad)} a year.` },
      { q: 'Is an electric motorbike tax-free in Germany?', a: 'For up to ten years. Section 3d KraftStG exempts every electric vehicle first registered between 18 May 2011 and the end of 2030, until 31 December 2035 at the latest. Afterwards the per-25 cm³ rate cannot apply, since it covers piston engines only, so the bike is taxed by permitted total weight and the electric reduction halves that amount.' },
    ],
    body: (h) => `
<h2>A flat rate per 25 cm³</h2>
<p>${h.src('kraftstg9', 'Section 9(1) No. 1 KraftStG')} fits in one line: motorbikes driven by piston engines pay ${h.eur(K.krad_je_25ccm, 2)} for each 25 cm³ of engine capacity or part of it. There are no bands, no CO2 charge and no distinction between petrol and diesel or between old and new. The engine size is printed in field P.1 of your Zulassungsbescheinigung Teil I, the registration certificate. Riders used to tax tiers by power, weight or emissions in their home country will find the German system refreshingly simple.</p>
<p>Partial blocks count in full. 689 cm³ is 27 complete blocks plus one started, so 28 in total, which gives ${h.eur(mot.raw, 2)}. Section 11(5) rounds that down to ${h.eur(mot.annual)}.</p>

<h2>What common engine sizes pay</h2>
${h.table(['Engine', 'Blocks of 25 cm³', 'Tax per year'], hubraeume.map((c) => [`${h.num(c)} cm³`, h.num(Math.ceil(c / 25)), h.eur(krad(c).annual)]), `Piston-engine motorbikes, Section 9(1) No. 1 KraftStG, ${h.eur(K.krad_je_25ccm, 2)} per started 25 cm³`, ['l', 'r', 'r'])}
<p>Even the biggest cruiser stays below ${h.eur(Math.ceil(gross.annual / 10) * 10)} a year. A small 2024 petrol car with ${h.num(999)} cm³ and 110 g of CO2 pays ${h.eur(auto.annual)}, about what a bike with nearly twice the engine size pays. For most riders, insurance, tyres and servicing cost far more than the tax.</p>

<h2>Bringing your bike to Germany</h2>
<p>Once you live in Germany and register the bike here, it gets a German plate and the tax starts from that day. At the registration office you sign a SEPA direct debit mandate, and about two weeks later customs, through the Hauptzollamt for your area, sends the tax notice. Because the rate depends only on engine size, the date of first registration does not matter for motorbikes, unlike for cars. An imported 2008 bike and a brand-new one with the same engine pay the same.</p>
<p>Before registration a bike from outside the EU usually needs a technical inspection, and later it joins the two-yearly roadworthiness test (HU); prices are on the ${h.a('tuev-kosten', 'TÜV cost page')}. Licence questions, such as whether your motorbike category carries over and what German test fees are, are covered under ${h.a('fuehrerschein-kosten', 'driving licence costs')}.</p>

<h2>Seasonal plates</h2>
<p>A Saisonkennzeichen is popular with riders: the plate shows a range such as 04 to 10, and the bike is registered only for those months each year, without re-registering. Section 5(1) No. 5 KraftStG limits the tax liability to that window, and Section 11(4) charges one 365th of the annual tax per day, ignoring 29 February.</p>
<p>For the 689 cm³ bike and the ${SAISON_TAGE} days from April to October, the tax comes to about ${h.eur(saison)}; for the 1,868 cm³ cruiser about ${h.eur(saisonGross)}. The saving is small in euros. Insurance follows the same season, which is where the real difference lies. Out of season the bike may not be ridden or parked on public roads. Customs cannot align a seasonal plate with the due date of your other vehicles.</p>
<!--mini:krad-->
<h2>Classic bikes on an H plate</h2>
<p>A historic plate (H-Kennzeichen, for vehicles recognised as classics) switches the bike to a flat tax. Section 1(1) No. 4 KraftStG makes the allocation of such a plate taxable in itself, and Section 9(4) sets ${h.eur(S94.krad, 2)} a year when the plate is for motorbikes only. Engine size no longer matters.</p>
<p>For small classics this is a little more expensive than the normal rate: a 390 cm³ single pays ${h.eur(klein.annual)} on the standard scale. Above ${h.num(schwelle)} cm³ the flat rate is cheaper. Most owners choose the H plate for what it says about the bike rather than for the tax, and the recognition itself is handled under vehicle registration law, with an expert inspection.</p>

<h2>Electric bikes, trikes and quads</h2>
<p>The 25 cm³ rate covers piston engines only. Electric motorbikes therefore fall under the electric vehicle exemption of Section 3d: tax-free for ten years from a first registration up to the end of 2030, and never beyond 31 December 2035. After that they pay the weight-based tax for vehicles up to 3.5 tonnes, halved. A 2018 electric motorbike with 450 kg permitted total weight would then pay ${h.eur(eMot.annual)} a year. The ${h.a('kfz-steuer-elektroauto', 'electric car tax page')} explains how the exemption runs, and the rules are identical.</p>
<p>Three-wheelers and light quads with piston engines have their own per-100 cm³ rates under Section 9(1) No. 2b, depending on fuel and emission limits. Which rule applies depends on the vehicle class on the registration certificate, so check the result with the ${h.src('bmfRechner', 'Finance Ministry calculator')}.</p>

<h2>Borderline engines</h2>
<p>Because every started block counts in full, two bikes with almost the same engine can land one step apart. A ${h.num(999)} cm³ engine pays ${h.eur(k999.annual)}, a ${h.num(1001)} cm³ one ${h.eur(k1001.annual)}. The value that counts is the one the registration office entered in field P.1, not the brochure figure. If you fit a big-bore kit, the new capacity has to be recorded, and the tax changes from that day (Section 5(3) KraftStG).</p>

<h2>Deregistering for winter instead</h2>
<p>Some riders take the bike off the road each autumn and register it again in spring. On tax alone the difference from a seasonal plate is small, but each registration starts a liability of at least one month (Section 5(1) No. 1), triggers a fresh tax notice and costs registration fees. A seasonal plate renews itself every year for the same months. If you want to extend the season, you have the period on the plate changed, and customs reassesses the tax (Section 12(2) No. 5).</p>

<h2>Visiting on a foreign-registered bike</h2>
<p>Touring Germany on a bike registered abroad costs no German vehicle tax as long as the stay is temporary. Section 3 No. 13 KraftStG exempts foreign private vehicles for up to a year, unless they acquire a regular base in Germany. The exemption is meant for visitors. Once you move here and keep the bike here, it needs German registration, and the normal rate applies from that day.</p>

<h2>A car and a bike</h2>
<p>If you also keep a car registered all year, you receive two notices with two due dates. On request, Section 11(4) No. 1 allows one common due date for two or more vehicles, with a one-off charge by the day to line them up. A bike on a seasonal plate cannot be included.</p>

<h2>Small two-wheelers and plates</h2>
<p>Section 3 No. 1 KraftStG exempts vehicles that do not need registration under the vehicle registration ordinance. Which two-wheelers those are is decided by that ordinance, not by the tax law. In practice, a small scooter that carries only an insurance plate (Versicherungskennzeichen) instead of an official registration plate receives no tax notice. Anything with an official plate from the registration office is taxable unless another exemption applies.</p>

<h2>Paying and deregistering</h2>
<p>Payment works as for cars: the ${h.src('zoll', 'customs administration')} debits the annual amount in advance, or the seasonal amount at the start of each season. When you deregister or sell, you get the unused part back, counted by the day. More on notices and refunds is on the ${h.a('kfz-steuer', 'vehicle tax overview')}, and the ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')} gives the figure for any engine size.</p>`,
  },
});
