import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { vignettePlan } from '../../lib/engine/kosten';
import { formatMoney } from '../../lib/format';

const G = P.vignette, C = G.pkw, M = G.krad;
const eD = (x: number) => formatMoney(x, 2, 'de'), eE = (x: number) => formatMoney(x, 2, 'en');
const urlaub = vignettePlan(1, 7);
const pendler = vignettePlan(10, 2);
const viele = vignettePlan(14, 3);
const nameDe = { tag1: '1-Tages-Vignetten', tag10: '10-Tages-Vignette', monat2: '2-Monats-Vignette', jahr: 'Jahresvignette' } as const;
const nameEn = { tag1: '1-day vignettes', tag10: '10-day vignette', monat2: '2-month vignette', jahr: 'annual vignette' } as const;

export default defineGuide({
  id: 'vignette-oesterreich',
  group: 'kosten',
  order: 20,
  mini: 'vignette',
  miniHref: 'fuehrerschein-kosten',
  related: ['kfz-steuer', 'tuev-kosten', 'bussgeldrechner', 'geblitzt-ausserorts'],
  sources: ['asfinag', 'asfinagFolder'],
  de: {
    slug: 'vignette-oesterreich',
    nav: 'Vignette Österreich',
    card: 'Preise 2026, Gültigkeit, 18-Tage-Frist und welche Vignette sich lohnt.',
    title: 'Vignette Österreich 2026: Preise, Gültigkeit, 18-Tage-Frist',
    description: `Vignette Österreich 2026: Pkw ab ${eD(C.tag1)} für einen Tag, ${eD(C.tag10)} für zehn Tage, Jahresvignette ${eD(C.jahr)}, gültig bis 31.1.2027. Mit Vergleich für Ihre Reisen.`,
    h1: 'Vignette für Österreich: Preise 2026 und welche sich lohnt',
    intro: 'Für Autobahnen und Schnellstraßen in Österreich braucht jeder Pkw eine Vignette, und 2026 ist das letzte Jahr der Klebevignette.',
    resume: `Wer mit dem Pkw auf österreichischen Autobahnen und Schnellstraßen fährt, braucht eine Vignette der ASFINAG. Die Tarife 2026 gelten seit dem 1. Dezember 2025 und enthalten 20 Prozent österreichische Umsatzsteuer: ${eD(C.tag1)} für einen Tag, ${eD(C.tag10)} für zehn Tage, ${eD(C.monat2)} für zwei Monate und ${eD(C.jahr)} für das ganze Jahr. Für Motorräder kosten die vier Varianten ${eD(M.tag1)}, ${eD(M.tag10)}, ${eD(M.monat2)} und ${eD(M.jahr)}. Die Jahresvignette 2026 gilt vom 1. Dezember 2025 bis einschließlich 31. Januar 2027. Beim Online-Kauf gilt eine Besonderheit: Ein- und Zehn-Tages-Vignetten können sofort gültig sein, Zwei-Monats- und Jahresvignetten erst ab dem 18. Tag nach dem Kauf, wegen des Rücktrittsrechts für Verbraucher. 2026 bietet die ASFINAG die Klebevignette zum letzten Mal an, ab 2027 gibt es nur noch die digitale, an das Kennzeichen gebundene Vignette.`,
    faqs: [
      { q: 'Ab wie vielen Fahrten nach Österreich lohnt sich die Jahresvignette?', a: `Rechnen Sie mit zwei Fahrtagen je Reise, hin und zurück: Eine Zehn-Tages-Vignette für ${eD(C.tag10)} deckt eine Reise bis zehn Tage. Bei ${eD(C.jahr)} für das Jahr lohnt sich die Jahresvignette ab neun solcher Reisen innerhalb ihrer Laufzeit. Wer öfter kurz über die Grenze pendelt, profitiert früher. Der Rechner oben vergleicht Ihre Zahl an Reisen.` },
      { q: 'Warum gilt meine online gekaufte Jahresvignette erst nach 18 Tagen?', a: 'Weil Verbraucher beim Online-Kauf ein Rücktrittsrecht haben und die ASFINAG Zwei-Monats- und Jahresvignetten aus Gründen des Konsumentenschutzes frühestens ab dem 18. Tag nach dem Kauf gültig schaltet. Ein- und Zehn-Tages-Vignetten können beim Online-Kauf sofort gelten. Wer kurzfristig fährt, kauft deshalb eine Zehn-Tages-Vignette oder die Klebevignette an einer Vertriebsstelle.' },
      { q: 'Wie lange ist die Jahresvignette 2026 gültig?', a: `Vom 1. Dezember 2025 bis einschließlich 31. Januar 2027, also 14 Monate, wie es im Vignettenfolder 2026 der ASFINAG steht. Wer sie erst im Sommer kauft, zahlt trotzdem den vollen Preis von ${eD(C.jahr)}, denn das Ende ist fest. Die Zwei-Monats-Vignette läuft dagegen ab dem gewählten Beginn zwei Monate.` },
      { q: 'Gibt es 2027 noch die Klebevignette?', a: 'Nein. Nach Angaben der ASFINAG wird die Klebevignette für das Jahr 2026 zum letzten Mal angeboten; ab dem Vignettenjahr 2027 steht nur noch die digitale Vignette zur Verfügung. Sie ist an das Kennzeichen gebunden, was besonders Haltern mit Wechselkennzeichen hilft, und wird im Webshop, in der App oder an Vertriebsstellen gekauft.' },
    ],
    body: (h) => `
<h2>Die Tarife 2026 im Überblick</h2>
${h.table(['Vignette', 'Pkw', 'Motorrad', 'Gültigkeit'], [
  ['1 Tag', h.eur(C.tag1, 2), h.eur(M.tag1, 2), 'ein Kalendertag, nur digital'],
  ['10 Tage', h.eur(C.tag10, 2), h.eur(M.tag10, 2), 'zehn aufeinanderfolgende Tage'],
  ['2 Monate', h.eur(C.monat2, 2), h.eur(M.monat2, 2), 'zwei Monate ab Beginn'],
  ['Jahr 2026', h.eur(C.jahr, 2), h.eur(M.jahr, 2), '1.12.2025 bis 31.1.2027'],
], 'ASFINAG, Tarife in Euro inklusive 20 % österreichischer Umsatzsteuer, gültig ab 1. Dezember 2025', ['l', 'r', 'r', 'l'])}
<p>Die Preise stammen von der ${h.src('asfinag', 'Vignetten-Seite der ASFINAG')}, die Gültigkeit der Jahresvignette aus dem ${h.src('asfinagFolder', 'Vignettenfolder 2026')}. Die Vignette gilt für Kraftfahrzeuge bis 3,5 Tonnen höchstzulässiges Gesamtgewicht; für schwerere Fahrzeuge erhebt Österreich eine fahrleistungsabhängige Maut, die GO-Maut, mit eigenem Gerät.</p>

<h2>Welche Vignette sich für welche Reise lohnt</h2>
<p>Die Rechnung hängt weniger von der Reisedauer ab als von der Zahl der Tage, an denen Sie tatsächlich auf Autobahn oder Schnellstraße fahren. Wer eine Woche am See verbringt und nur bei An- und Abreise die Autobahn nimmt, braucht zwei Fahrtage. Zwei Ein-Tages-Vignetten kosten zusammen ${h.eur(2 * C.tag1, 2)}, eine Zehn-Tages-Vignette ${h.eur(C.tag10, 2)}: Die Zehn-Tages-Vignette ist günstiger, sobald die Reise mehr als einen Tag dauert und in zehn Tage passt. Für unser Beispiel einer Urlaubswoche rechnet der Vergleich ${nameDe[urlaub[0].kind]} für ${h.eur(urlaub[0].cost, 2)}.</p>
<p>Anders bei Pendlern und Wochenendfahrern. Zehn Kurztrips mit je zwei Tagen ergeben als günstigste Wahl ${nameDe[pendler[0].kind]} für ${h.eur(pendler[0].cost, 2)}, vierzehn Reisen von drei Tagen ${nameDe[viele[0].kind]} für ${h.eur(viele[0].cost, 2)}. Die Grenze, ab der die Jahresvignette gewinnt, liegt bei neun Reisen von zwei bis zehn Tagen, denn ${h.eur(C.jahr, 2)} geteilt durch ${h.eur(C.tag10, 2)} ergibt gut acht Zehn-Tages-Vignetten. Weil die Jahresvignette 2026 bis Ende Januar 2027 gilt, zählen auch die Skireisen im Januar 2027 noch mit.</p>
<!--mini:vignette-->
<h2>Digital oder Klebevignette</h2>
<p>Die digitale Vignette ist an das Kennzeichen gebunden. Sie wird online, in der App der ASFINAG oder an Vertriebsstellen gekauft und bei der Kontrolle über das Kennzeichen erkannt. Wer ein neues Auto bekommt oder das Kennzeichen wechselt, kann die Zuordnung ändern lassen; wer Wechselkennzeichen fährt, braucht nur eine Vignette für beide Fahrzeuge. Die Klebevignette dagegen gehört zur Windschutzscheibe, auf die sie geklebt ist. Ihr Folder warnt ausdrücklich: Eine nicht ordnungsgemäß geklebte Vignette, etwa lose im Handschuhfach oder an der Scheibenhalterung, ist nicht gültig. Für 2026 gibt es beide Formen zum letzten Mal nebeneinander, ab 2027 nur noch die digitale.</p>

<h2>Die 18-Tage-Frist beim Online-Kauf</h2>
<p>Wer eine Jahres- oder Zwei-Monats-Vignette im Webshop oder in der App kauft, bekommt sie frühestens ab dem 18. Tag nach dem Kauf gültig. Der Grund ist das Rücktrittsrecht für Verbraucher: Die ASFINAG räumt beim Online-Kauf 14 Tage für den Rücktritt ein und schaltet die Vignette erst danach frei. Die Frist gilt nicht für Ein- und Zehn-Tages-Vignetten, die sofort gültig sein können, und nicht für Klebevignetten aus der Vertriebsstelle, etwa einer Tankstelle oder einem Automobilclub vor der Grenze. Wer spontan fährt und noch keine Jahresvignette hat, überbrückt die ersten Tage deshalb mit einer Zehn-Tages-Vignette.</p>

<h2>Kaufen und kleben: die Details aus dem Folder</h2>
<p>Die digitale Vignette kaufen Sie im Webshop shop.asfinag.at oder in der kostenlosen App in vier Schritten: Pkw oder Motorrad wählen, Gültigkeitsdauer wählen, Zulassungsstaat, Kennzeichen und E-Mail-Adresse eintragen, Beginn wählen und bezahlen. Ein Tippfehler im Kennzeichen macht die Vignette für Ihr Auto wertlos, prüfen Sie die Eingabe deshalb doppelt. Eine digitale Vignette gilt für bis zu drei Fahrzeuge mit Wechselkennzeichen, und im Abo verlängert sich die Jahresvignette automatisch bis auf Widerruf. Die 18 Tage setzen sich aus 14 Tagen Rücktrittsrecht und drei Tagen für einen möglichen Postweg zusammen; für Unternehmer gilt die Einschränkung nicht. Klebe- und digitale Vignetten gibt es an rund 6.000 Vertriebsstellen, darunter Tankstellen, Trafiken, Automobilclubs und Mautstellen. Die Klebevignette gehört innen auf die Windschutzscheibe, empfohlen links oben oder hinter dem Rückspiegel, gut sichtbar und nicht im Tönungsstreifen. Am Motorrad klebt sie auf einem nicht austauschbaren Teil wie dem Gabelholm, nicht am Koffer. Das Netz umfasst nach Angaben der ASFINAG rund 2.278 Kilometer Autobahnen und Schnellstraßen.</p>

<h2>Strecken mit eigener Maut</h2>
<p>Einige Alpenstrecken sind von der Vignettenpflicht ausgenommen, weil dort eine Streckenmaut erhoben wird. Der Vignettenfolder 2026 nennt Brenner, Arlberg, Tauern und Katschberg, Bosruck, Karawanken und Gleinalm. Die Vignette deckt diese Abschnitte nicht ab. Die ASFINAG bietet dafür eine digitale Streckenmaut an; die Preise stehen auf ihrer Seite und ändern sich zum Jahreswechsel. Wer regelmäßig über eine solche Strecke fährt, sollte die Kosten dort getrennt vergleichen.</p>

<h2>Was das für Autofahrer aus Deutschland bedeutet</h2>
<p>Deutsche Autobahnen sind für Pkw weiterhin ohne Vignette befahrbar. Die Kosten einer Österreich-Reise gehören deshalb zu den wenigen Straßengebühren, die deutsche Autofahrer überhaupt regelmäßig bezahlen. Planen Sie sie zusammen mit den festen Kosten des eigenen Autos, also der ${h.a('kfz-steuer', 'Kfz-Steuer')} und der ${h.a('tuev-kosten', 'Hauptuntersuchung')}. Und weil in Österreich andere Bußgelder und Toleranzen gelten als im deutschen Katalog, beziehen sich alle Rechner dieser Website, auch der ${h.a('bussgeldrechner', 'Bußgeldrechner')}, ausschließlich auf Verstöße in Deutschland.</p>

<h2>Kontrolle und fehlende Vignette</h2>
<p>Die Vignettenpflicht wird in Österreich kontrolliert, auch automatisch über die Kennzeichen. Wer ohne gültige Vignette fährt, muss mit einer Ersatzmaut rechnen. Deren aktuelle Höhe nennt die ASFINAG in ihrer Mautordnung; wir geben sie hier nicht an, weil wir sie für 2026 nicht im amtlichen Dokument nachgelesen haben. Der Kauf vor der ersten Auffahrt ist in jedem Fall die einfachere Lösung.</p>`,
  },
  en: {
    slug: 'austria-vignette',
    nav: 'Austria vignette',
    card: '2026 prices, validity, the 18-day rule and which vignette pays off.',
    title: 'Vignette Austria 2026: Prices, Validity, the 18-Day Rule',
    description: `Austrian motorway vignette 2026: cars ${eE(C.tag1)} for a day, ${eE(C.tag10)} for ten days, ${eE(C.jahr)} for the year valid to 31 Jan 2027. Compare options for your trips.`,
    h1: 'The Austrian vignette in 2026: prices and which one to buy',
    intro: 'Driving south from Germany? Austria charges a vignette for motorways and expressways, and 2026 is the last year of the sticker version.',
    resume: `Any car using Austria's motorways and expressways needs a vignette issued by ASFINAG, the state motorway company. The 2026 prices have applied since 1 December 2025 and include 20 per cent Austrian VAT: ${eE(C.tag1)} for one day, ${eE(C.tag10)} for ten days, ${eE(C.monat2)} for two months and ${eE(C.jahr)} for the year. Motorbikes pay ${eE(M.tag1)}, ${eE(M.tag10)}, ${eE(M.monat2)} and ${eE(M.jahr)}. The 2026 annual vignette is valid from 1 December 2025 up to and including 31 January 2027. One rule catches many visitors: bought online, a one-day or ten-day vignette can start immediately, but a two-month or annual vignette only becomes valid on the 18th day after purchase, because consumers have a right to withdraw. 2026 is also the last year ASFINAG sells the windscreen sticker; from 2027 only the digital vignette, linked to the number plate, will exist.`,
    faqs: [
      { q: 'Do I need an Austrian vignette just to drive through to Italy?', a: 'If your route uses Austrian motorways or expressways, yes, even for a transit of a few hours. Some Alpine routes, such as the Brenner or the Arlberg, charge a separate section toll instead, which the vignette does not cover. For a single transit day the one-day vignette, available only in digital form, is usually the cheapest choice.' },
      { q: 'Can I buy the Austrian vignette at the border?', a: 'Sticker vignettes are sold at sales points such as petrol stations and motoring clubs near the border, and the digital vignette can be bought online or in the ASFINAG app. If you buy an annual or two-month vignette online, remember it only becomes valid on the 18th day after purchase; one-day and ten-day vignettes bought online can start at once.' },
      { q: 'Is the Austrian annual vignette worth it for a German resident?', a: `Count two motorway days per trip, there and back. A ten-day vignette at ${eE(C.tag10)} covers one trip of up to ten days, so the annual vignette at ${eE(C.jahr)} pays off from nine such trips within its validity, which runs until 31 January 2027 and includes January ski weekends. Frequent short cross-border trips reach that point sooner.` },
      { q: 'What happens to my digital vignette if I change cars?', a: 'The digital vignette is linked to a number plate, not to a windscreen. If you change vehicle or plate, ASFINAG lets you change the assignment, and drivers with interchangeable plates (Wechselkennzeichen) need only one vignette for both vehicles. A sticker vignette, by contrast, stays with the windscreen it was stuck on and is invalid if not stuck on properly.' },
    ],
    body: (h) => `
<h2>2026 prices</h2>
${h.table(['Vignette', 'Car', 'Motorbike', 'Validity'], [
  ['1 day', h.eur(C.tag1, 2), h.eur(M.tag1, 2), 'one calendar day, digital only'],
  ['10 days', h.eur(C.tag10, 2), h.eur(M.tag10, 2), 'ten consecutive days'],
  ['2 months', h.eur(C.monat2, 2), h.eur(M.monat2, 2), 'two months from the start date'],
  ['Year 2026', h.eur(C.jahr, 2), h.eur(M.jahr, 2), '1 Dec 2025 to 31 Jan 2027'],
], 'ASFINAG prices in euros including 20% Austrian VAT, valid from 1 December 2025', ['l', 'r', 'r', 'l'])}
<p>Prices come from the ${h.src('asfinag', 'ASFINAG vignette page')}, the validity of the annual vignette from the ${h.src('asfinagFolder', 'official 2026 leaflet')}. The vignette applies to vehicles up to 3.5 tonnes; heavier vehicles pay a distance-based toll with an on-board unit instead.</p>

<h2>Choosing the right one</h2>
<p>What matters is the number of days you actually drive on Austrian motorways, not how long you stay. A week by a lake, reached by motorway and left by motorway, means two motorway days. Two one-day vignettes cost ${h.eur(2 * C.tag1, 2)}, a ten-day vignette ${h.eur(C.tag10, 2)}, so for any trip longer than one day that fits in ten days, the ten-day vignette wins; for our holiday week the comparison picks the ${nameEn[urlaub[0].kind]} at ${h.eur(urlaub[0].cost, 2)}.</p>
<p>Frequent travellers get a different answer. Ten two-day trips come out cheapest as the ${nameEn[pendler[0].kind]} at ${h.eur(pendler[0].cost, 2)}, and fourteen three-day trips as the ${nameEn[viele[0].kind]} at ${h.eur(viele[0].cost, 2)}. Divide ${h.eur(C.jahr, 2)} by ${h.eur(C.tag10, 2)} and you get just over eight ten-day vignettes, so the annual vignette wins from the ninth trip. Because the 2026 vignette runs to the end of January 2027, the first ski weekends of 2027 still count.</p>
<!--mini:vignette-->
<h2>Digital or sticker</h2>
<p>The digital vignette is tied to your number plate and checked by plate recognition. It can be bought online, in the ASFINAG app or at sales points. The sticker vignette belongs to the windscreen it is stuck on, and the official leaflet warns that a sticker kept loose, in the glove box or on a holder, is not valid. For 2026 both exist side by side for the last time; from the 2027 vignette year only the digital form will be sold.</p>

<h2>The 18-day rule for online purchases</h2>
<p>Annual and two-month vignettes bought online become valid on the 18th day after purchase at the earliest. ASFINAG gives online buyers fourteen days to withdraw and only activates the vignette after that. One-day and ten-day vignettes can be valid immediately, and stickers bought at a sales point are valid straight away. If you have to leave tomorrow and have no annual vignette yet, a ten-day vignette covers the first trip.</p>

<h2>Buying and fitting it: details from the leaflet</h2>
<p>The digital vignette is bought on shop.asfinag.at or in the free ASFINAG app in four steps: choose car or motorbike, choose the duration, enter the country of registration, your plate number and an email address, pick the start date and pay. A typo in the plate makes the vignette useless for your car, so check it twice; German plates are entered with the district letters first, as on the plate. One digital vignette covers up to three vehicles sharing interchangeable plates, and with a subscription the annual vignette renews automatically until cancelled. The 18 days consist of the 14-day right of withdrawal plus three days allowed for post; businesses are not subject to the delay. Sticker and digital vignettes are sold at around 6,000 sales points, including petrol stations, tobacconists, motoring clubs and toll stations. A sticker goes on the inside of the windscreen, ideally top left or behind the rear-view mirror, clearly visible and not on the tinted strip; on a motorbike it goes on a fixed part such as the fork, never on a pannier. ASFINAG gives the network as about 2,278 kilometres of motorways and expressways.</p>

<h2>Routes with their own toll</h2>
<p>A few Alpine routes are excluded from the vignette because they charge a section toll; the 2026 leaflet lists Brenner, Arlberg, Tauern and Katschberg, Bosruck, Karawanken and Gleinalm. The vignette does not cover them. ASFINAG sells a digital section toll for these; prices are on its site and change at the turn of the year.</p>

<h2>For drivers based in Germany</h2>
<p>Cars still use German motorways without any vignette, so a trip to Austria is one of the few road charges German residents pay regularly. Budget it alongside the fixed costs of the car: ${h.a('kfz-steuer', 'vehicle tax')} and the ${h.a('tuev-kosten', 'MOT (HU)')}. Austria also has its own traffic fines and tolerances; every calculator on this site, including the ${h.a('bussgeldrechner', 'fine calculator')}, covers offences in Germany only.</p>

<h2>Checks and driving without a vignette</h2>
<p>Austria checks the vignette, including automatically by number plate. Driving without one means paying a substitute toll (Ersatzmaut). ASFINAG publishes the current amount in its toll regulations; we do not state it here because we have not verified the 2026 figure in the official document. Buying the vignette before the first motorway slip road is the simpler path.</p>`,
  },
});
