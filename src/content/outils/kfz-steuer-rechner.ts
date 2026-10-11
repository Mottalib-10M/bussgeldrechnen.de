import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pkw, elektro } from '../../lib/engine/kfzsteuer';
import { formatMoney } from '../../lib/format';

const K = P.kfz;
const d23 = pkw({ ez: '2023-05-01', fuel: 'diesel', ccm: 1968, co2: 145 });
const b23 = pkw({ ez: '2023-05-01', fuel: 'benzin', ccm: 1498, co2: 128 });
const ev = elektro('2024-03-01', 2232, 2026);
const eD = (x: number) => formatMoney(x, 0, 'de'), eE = (x: number) => formatMoney(x, 0, 'en');

export default defineGuide({
  id: 'kfz-steuer-rechner',
  group: 'rechner',
  order: 20,
  tool: 'kfzsteuer',
  related: ['kfz-steuer', 'kfz-steuer-elektroauto', 'kfz-steuer-diesel', 'kfz-steuer-altfahrzeuge', 'kfz-steuer-motorrad', 'kfz-steuer-wohnmobil'],
  sources: ['kraftstg9', 'kraftstg3d', 'kraftstg', 'bmfRechner', 'zoll'],
  de: {
    slug: 'kfz-steuer-rechner',
    nav: 'Kfz-Steuer-Rechner',
    card: 'Jahressteuer für Pkw, E-Auto, Motorrad, Wohnmobil und Anhänger.',
    title: 'Kfz-Steuer-Rechner 2026: Hubraum, CO2, E-Auto, Wohnmobil',
    description: `Kfz-Steuer-Rechner 2026 nach KraftStG: Pkw nach Hubraum und CO2, E-Auto mit Ende der Befreiung, Motorrad, Wohnmobil. In 21 Fällen gleich dem BMF-Rechner.`,
    h1: 'Kfz-Steuer-Rechner: Jahressteuer mit jedem Anteil',
    intro: 'Daten aus dem Fahrzeugschein eintragen und sehen, wie sich die Steuer aus Hubraum, CO2 oder Gewicht zusammensetzt.',
    resume: `Die Kraftfahrzeugsteuer für Pkw hängt vom Datum der Erstzulassung ab, und genau das fragt der Rechner zuerst. Seit 2021 zugelassene Autos zahlen ${eD(K.hubraum_benzin)} je angefangene 100 cm³ beim Benziner und ${formatMoney(K.hubraum_diesel, 2, 'de')} beim Diesel, dazu für jedes Gramm CO2 über ${K.co2_frei_2021} je Kilometer einen Satz, der stufenweise von 2,00 auf 4,00 Euro steigt. Ein Diesel von 2023 mit 1 968 cm³ und 145 g kostet so ${eD(d23.annual)} im Jahr, ein Benziner mit 1 498 cm³ und 128 g ${eD(b23.annual)}. Für ältere Autos gelten die Regeln von 2009 oder die Schadstoffklassen von vor 2009. Elektroautos sind bei Erstzulassung bis Ende 2030 zehn Jahre befreit, längstens bis Ende 2035, und zahlen danach die Hälfte einer Gewichtssteuer. In 21 Prüffällen kommt der Rechner auf denselben Euro wie das Bundesfinanzministerium.`,
    faqs: [
      { q: 'Welche Felder aus dem Fahrzeugschein braucht der Kfz-Steuer-Rechner?', a: 'Für einen Pkw das Datum der Erstzulassung (Feld B), den Hubraum (P.1), die Kraftstoffart (P.3) und den CO2-Wert (V.7). Bei Elektroauto, Wohnmobil und Anhänger zählt die zulässige Gesamtmasse aus Feld F.2. Bei Autos mit Erstzulassung vor Juli 2009 fragt der Rechner statt des CO2-Werts nach der Schadstoffklasse, die sich aus der Emissionsschlüsselnummer ergibt.' },
      { q: 'Stimmt das Ergebnis mit dem Bescheid des Hauptzollamts überein?', a: 'Für die Jahressteuer in aller Regel ja: Unser Rechner und der Rechner des Bundesfinanzministeriums kamen in 21 Fällen vom Diesel bis zum Anhänger auf denselben Euro (Abgleich vom 11.10.2026). Verbindlich ist aber nur der Steuerbescheid. Bei Zulassung im Lauf des Jahres setzt der Zoll zusätzlich den Anteil bis zum nächsten Fälligkeitstag fest, den der Rechner nicht zeigt.' },
      { q: 'Warum zeigt der Rechner beim E-Auto ein Steuerjahr zur Auswahl?', a: `Weil die Befreiung nach § 3d KraftStG zeitlich endet: zehn Jahre ab Erstzulassung, aber nicht über den 31.12.2035 hinaus. Wählen Sie ein Jahr nach dem Ende, zeigt der Rechner die dann fällige Steuer: Gewichtssteuer nach § 9 Abs. 1 Nr. 3, halbiert. Für ein E-Auto mit 2 232 kg sind das ${eD(ev.raw)} pro Jahr, gerundet auf volle Euro abwärts.` },
      { q: 'Rechnet der Kfz-Steuer-Rechner auch Lkw und Saisonkennzeichen?', a: 'Nein. Er deckt Pkw, Elektroautos, Motorräder, Wohnmobile und Anhänger ab. Lkw über 3,5 Tonnen mit Schadstoff- und Geräuschklassen, Saisonkennzeichen und Wechselkennzeichen rechnet der Rechner des Bundesfinanzministeriums. Für Fahrzeuge schwerbehinderter Halter wendet er § 3a an, mit Befreiung oder halber Steuer.' },
    ],
    body: (h) => `
<h2>Wie der Rechner zum Betrag kommt</h2>
<p>Er wendet ${h.src('kraftstg9', '§ 9 KraftStG')} so an, wie der Text es vorschreibt: Hubraum in angefangenen 100 cm³, CO2 in vollen Gramm je Kilometer, Gewicht in angefangenen 200 kg, und am Ende die Abrundung auf volle Euro nach § 11 Abs. 5. Das Ergebnis zeigt jeden Anteil einzeln. So sehen Sie, dass beim Benziner von 2023 der CO2-Anteil den Hubraumanteil übertrifft, während beim Diesel die 9,50 Euro je 100 cm³ das meiste ausmachen. Hintergründe zu den einzelnen Fällen: ${h.a('kfz-steuer-diesel', 'Diesel')}, ${h.a('kfz-steuer-elektroauto', 'Elektroauto')}, ${h.a('kfz-steuer-altfahrzeuge', 'Autos von vor 2009')}.</p>
<h2>Abgleich mit dem Bundesfinanzministerium</h2>
<p>Bevor wir den Rechner veröffentlicht haben, haben wir am 11. Oktober 2026 21 Fälle in den ${h.src('bmfRechner', 'Kfz-Steuer-Rechner des BMF')} eingegeben: Benziner und Diesel aus allen drei Zulassungszeiträumen, Altfahrzeuge mit Euro 1, 2 und 3, den Übergangsfall von 2008/2009, Elektroautos mit zwei Gewichten, ein Motorrad und zwei Anhänger. Alle 21 Ergebnisse stimmen auf den Euro überein. Die Fälle laufen als automatische Tests bei jeder Änderung mit.</p>
<h2>Was der Rechner nicht weiß</h2>
<p>Er rechnet die Jahressteuer. Die erste Festsetzung nach der Zulassung umfasst oft einen Teilzeitraum, und bei Abmeldung erstattet der Zoll anteilig. Beides hängt von Tagen ab, die der Rechner nicht abfragt. Nicht abgebildet sind außerdem Lkw über 3,5 t und Saisonkennzeichen. Wie die Steuer bezahlt wird und welche Behörde zuständig ist, steht auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')} und beim ${h.src('zoll', 'Zoll')}.</p>`,
  },
  en: {
    slug: 'vehicle-tax-calculator',
    nav: 'Vehicle tax calculator',
    card: 'Annual tax for cars, EVs, motorbikes, motorhomes and trailers.',
    title: 'Vehicle Tax Calculator Germany 2026: Kfz-Steuer by CO2',
    description: `Kfz-Steuer calculator 2026 for Germany: cars by engine size and CO2, EV exemption end date, motorbikes, motorhomes. Same result as the ministry in 21 tests.`,
    h1: 'German vehicle tax calculator, with every part of the bill',
    intro: 'Enter the figures from your registration certificate and see how engine size, CO2 or weight make up the annual tax.',
    resume: `German car tax, the Kraftfahrzeugsteuer, is set by the Motor Vehicle Tax Act (KraftStG) and depends first on when the car was first registered, so that is the first question here. Cars registered since 2021 pay ${eE(K.hubraum_benzin)} per started 100 cm³ for petrol and ${formatMoney(K.hubraum_diesel, 2, 'en')} for diesel, plus a charge for every gram of CO2 above ${K.co2_frei_2021} g/km that rises in steps from 2.00 to 4.00 euros. A 2023 diesel with 1,968 cm³ and 145 g costs ${eE(d23.annual)} a year; a petrol car with 1,498 cm³ and 128 g costs ${eE(b23.annual)}. Older cars follow the 2009 rules or the pre-2009 emission classes. Electric cars first registered by the end of 2030 are exempt for ten years, until 2035 at the latest, and then pay half of a weight-based tax. In 21 test cases our result equals the Federal Finance Ministry calculator to the euro.`,
    faqs: [
      { q: 'Where do I find the values for this tax calculator on a German registration document?', a: 'On the Zulassungsbescheinigung Teil I, the small registration certificate you carry: first registration date in field B, engine size in P.1, fuel type in P.3 and CO2 in V.7. For electric cars, motorhomes and trailers the permitted total weight in field F.2 matters. For cars registered before July 2009 the emission class replaces the CO2 value.' },
      { q: 'I imported my car to Germany. Which date counts for the tax?', a: 'The date of first registration of the vehicle, which the registration office enters in field B, not the date you registered it in Germany. A car first registered abroad in 2019 is taxed under the 2009 to 2020 rules. For electric cars the ten-year exemption also counts from the first registration, and it ends on 31 December 2035 at the latest.' },
      { q: 'Who sends the vehicle tax bill in Germany?', a: 'The customs administration (Zoll), through the main customs office (Hauptzollamt) responsible for your area. Registration and the SEPA direct debit mandate are usually handled at the vehicle registration office when you register the car. The annual amount shown here is what the tax notice sets for a full year; the first notice may cover a shorter period.' },
      { q: 'Does the calculator handle vans, lorries and seasonal plates?', a: 'Not lorries above 3.5 tonnes, seasonal plates or interchangeable plates; the Federal Finance Ministry calculator covers those. It does cover cars, electric cars, motorbikes, motorhomes and trailers, and applies the relief for severely disabled keepers under Section 3a, either full exemption or half the tax.' },
    ],
    body: (h) => `
<h2>How the result is built</h2>
<p>The calculator follows ${h.src('kraftstg9', 'Section 9 KraftStG')} literally: engine size in started 100 cm³ units, CO2 in whole grams per kilometre, weight in started 200 kg units, then rounding down to whole euros. Each part is listed, so you can see that for a 2023 petrol car the CO2 part outweighs the engine part, while for a diesel most of the bill comes from the €9.50 per 100 cm³. Background for each case: ${h.a('kfz-steuer-diesel', 'diesel cars')}, ${h.a('kfz-steuer-elektroauto', 'electric cars')}, ${h.a('kfz-steuer-altfahrzeuge', 'cars registered before 2009')}.</p>
<h2>Checked against the Finance Ministry</h2>
<p>On 11 October 2026 we entered 21 cases into the ${h.src('bmfRechner', 'Federal Finance Ministry calculator')}: petrol and diesel cars from all three registration periods, Euro 1, 2 and 3 cars, the late-2008 transition case, two electric cars, a motorbike and two trailers. All 21 results match ours to the euro, and they run as automated tests whenever the code changes.</p>
<h2>Limits</h2>
<p>The figure is the annual tax. The first notice after registration often covers part of a year, and customs refunds a share when a car is deregistered; both depend on exact days. Lorries over 3.5 t and seasonal plates are not covered. Payment and the authority in charge are explained on the ${h.a('kfz-steuer', 'vehicle tax page')} and by ${h.src('zoll', 'German customs')}.</p>`,
  },
});
