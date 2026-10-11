import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { elektro, gewichtssteuer, pkw } from '../../lib/engine/kfzsteuer';
import { formatMoney, formatNumber } from '../../lib/format';

const K = P.kfz;
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
const KG = 2232;
const ezListe = ['2013-07-01', '2016-03-15', '2020-11-01', '2024-03-01', '2026-10-01', '2030-12-31'];
const ezRows = ezListe.map((ez) => ({ ez, r: elektro(ez, KG, 2026) }));
const gewichte = [1600, 1900, KG, 2500, 2900, 3400];
const nach = (kg: number) => elektro('2014-01-01', kg, 2026);
const typ = nach(KG);
const schwer = nach(2900);
const ab2026 = elektro('2026-10-01', KG, 2036);
const ab2024 = elektro('2024-03-01', KG, 2026);
const basis = gewichtssteuer(2000), rest = gewichtssteuer(KG) - basis;
const kauf2028 = elektro('2028-06-01', KG, 2026);
const hybrid = pkw({ ez: '2024-03-01', fuel: 'benzin', ccm: 1998, co2: 32 });
/** Erste Erstzulassung, für die die 10 Jahre über das Höchstdatum hinausreichen würden. */
const kappungAb = `${Number(K.elektro_befreiung_max.slice(0, 4)) - K.elektro_befreiung_jahre}${K.elektro_befreiung_max.slice(4)}`;

export default defineGuide({
  id: 'kfz-steuer-elektroauto',
  group: 'steuer',
  order: 20,
  mini: 'elektro',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer', 'kfz-steuer-diesel', 'kfz-steuer-schwerbehinderung', 'tuev-kosten'],
  sources: ['kraftstg3d', 'kraftstg9', 'kraftstg', 'bmfRechner'],
  de: {
    slug: 'kfz-steuer-elektroauto',
    nav: 'Kfz-Steuer Elektroauto',
    card: 'Zehn Jahre steuerfrei, längstens bis 2035, danach halbe Gewichtssteuer.',
    title: 'Kfz-Steuer Elektroauto 2026: Befreiung bis 2035 und danach',
    description: `Kfz-Steuer fürs Elektroauto 2026: zehn Jahre befreit bei Erstzulassung bis Ende 2030, längstens bis 31.12.2035. Danach etwa ${eD(typ.annual)} im Jahr bei ${formatNumber(KG, 0, 'de')} kg.`,
    h1: 'Kfz-Steuer beim Elektroauto: wie lange es steuerfrei bleibt',
    intro: 'Ein reines Elektroauto zahlt in Deutschland zunächst keine Kfz-Steuer, doch das Ende der Befreiung steht schon im Gesetz.',
    resume: `Reine Elektroautos sind nach § 3d KraftStG von der Kfz-Steuer befreit, wenn sie zwischen dem 18. Mai 2011 und dem 31. Dezember 2030 erstmals zugelassen werden. Die Befreiung dauert zehn Jahre ab dem Tag der Erstzulassung, endet aber spätestens am 31. Dezember 2035. Wer also nach dem ${kappungAb.split('-').reverse().join('.')} zulässt, bekommt weniger als zehn Jahre. Die Befreiung hängt am Fahrzeug, nicht am Halter: Ein Käufer übernimmt die Restlaufzeit. Danach zahlt das Auto Steuer nach dem zulässigen Gesamtgewicht, ${eD(K.gewicht_stufen_bis_3500[0][1], 2)} je angefangene 200 kg bis 2 000 kg und etwas mehr darüber, und diese Steuer halbiert sich nach § 9 Abs. 2 für Elektrofahrzeuge. Bei ${formatNumber(KG, 0, 'de')} kg Gesamtgewicht sind das ${eD(typ.annual)} im Jahr. Plug-in-Hybride gelten nicht als Elektrofahrzeug und zahlen ab dem ersten Tag nach Hubraum und CO2. Auch umgerüstete Verbrenner können befreit sein, wenn die Umrüstung bis Ende 2030 erfolgt.`,
    faqs: [
      { q: 'Wie lange ist ein Elektroauto von der Kfz-Steuer befreit?', a: `Zehn Jahre ab dem Tag der Erstzulassung, wenn diese zwischen dem 18.5.2011 und dem 31.12.2030 liegt, aber nie über den 31.12.2035 hinaus (§ 3d Abs. 1 KraftStG). Ein E-Auto vom März 2024 ist bis ${ab2024.exemptUntil!.split('-').reverse().join('.')} befreit. Eines vom Oktober 2026 erreicht die zehn Jahre nicht mehr, seine Befreiung endet mit dem Höchstdatum am 31.12.2035.` },
      { q: 'Gilt die Steuerbefreiung auch für ein gebrauchtes E-Auto?', a: 'Ja, mit der Restlaufzeit. § 3d Abs. 2 KraftStG gewährt die Befreiung einmal je Fahrzeug, und wenn sie beim Halterwechsel noch läuft, bekommt sie der neue Halter. Maßgeblich bleibt das Datum der Erstzulassung in Feld B des Fahrzeugscheins. Ein vier Jahre altes E-Auto bringt also noch rund sechs steuerfreie Jahre mit, sofern das Höchstdatum 2035 nicht früher greift.' },
      { q: 'Sind Plug-in-Hybride von der Kfz-Steuer befreit?', a: `Nein. § 9 Abs. 2 KraftStG verlangt einen Antrieb ausschließlich durch Elektromotoren. Ein Plug-in-Hybrid hat zusätzlich einen Verbrenner und wird wie jeder Pkw nach Hubraum und CO2 besteuert. Wegen des niedrigen Normwerts fällt das oft gering aus: Ein Benzin-Hybrid von 2024 mit 1 998 cm³ und 32 g zahlt ${eD(hybrid.annual)}, nur den Hubraumanteil.` },
      { q: 'Verlängert eine Abmeldung die Steuerbefreiung des E-Autos?', a: 'Nein. § 3d Abs. 3 KraftStG stellt klar, dass Zeiten der Außerbetriebsetzung und Zeiten außerhalb eines Saisonkennzeichens die Befreiung nicht beeinflussen. Die zehn Jahre laufen ab der Erstzulassung kalendarisch durch, ob das Auto fährt oder in der Garage steht. Wer ein E-Auto ein Jahr abmeldet, verschiebt das Ende der Befreiung also nicht.' },
      { q: 'Wie viel Kfz-Steuer zahlt ein E-Auto nach Ablauf der Befreiung?', a: `Die Hälfte der Gewichtssteuer nach § 9 Abs. 1 Nr. 3 KraftStG. Bei ${formatNumber(KG, 0, 'de')} kg zulässiger Gesamtmasse sind das ${eD(typ.annual)} im Jahr, bei 2 900 kg ${eD(schwer.annual)}. Das Gewicht steht in Feld F.2 der Zulassungsbescheinigung. Gerechnet wird in angefangenen 200 kg, abgerundet auf volle Euro. Solange der Gesetzgeber die Sätze nicht ändert, gilt das auch nach 2035.` },
    ],
    body: (h) => `
<h2>Die Regel in § 3d KraftStG</h2>
<p>${h.src('kraftstg3d', '§ 3d KraftStG')} befreit das Halten von Elektrofahrzeugen. Zwei Daten begrenzen die Befreiung: Die Erstzulassung muss zwischen dem ${h.date(K.elektro_ez_von)} und dem ${h.date(K.elektro_ez_bis)} liegen, und die Befreiung läuft ${K.elektro_befreiung_jahre} Jahre ab diesem Tag, längstens bis zum ${h.date(K.elektro_befreiung_max)}. Es zählt nur die erste Zulassung überhaupt. Wer ein E-Auto aus dem Ausland einführt, rechnet also ab dem Datum, an dem es dort zum ersten Mal zugelassen wurde.</p>
<p>Was ein Elektrofahrzeug ist, definiert § 9 Abs. 2: ein Antrieb ausschließlich durch Elektromotoren, gespeist ganz oder überwiegend aus mechanischen oder elektrochemischen Speichern oder aus emissionsfrei betriebenen Energiewandlern. Batterieautos fallen darunter, Brennstoffzellenautos mit Wasserstoff ebenfalls. Ein Auto mit zusätzlichem Verbrennungsmotor fällt heraus, gleichgültig wie groß die Batterie ist.</p>
<p>Einen eigenen Antrag beim Hauptzollamt braucht es für die Befreiung in aller Regel nicht. § 12a Abs. 6 KraftStG lässt in der Steuererklärung, die bei der Zulassung abgegeben wird, einen entsprechenden Hinweis genügen, und als Steuererklärung gilt nach Abs. 2 schon die Fahrzeuganmeldung. Die Zulassungsstelle übermittelt die Daten, der Zoll erlässt in der Regel einen Bescheid, der das Ende der Befreiung nennt. Diesen Bescheid sollten Sie aufheben: Er nennt das Datum, ab dem gezahlt wird, und erspart später das Nachrechnen.</p>

<h2>Wann die Befreiung für Ihr Auto endet</h2>
<p>Für Erstzulassungen bis Ende 2025 reichen die zehn Jahre nicht an das Höchstdatum heran. Für jede spätere Erstzulassung als den ${h.date(kappungAb)} schneidet der 31. Dezember 2035 die Frist ab, und je später die Erstzulassung, desto kürzer die Befreiung. Die Tabelle zeigt typische Daten für ein Auto mit ${h.num(KG)} kg zulässiger Gesamtmasse:</p>
${h.table(['Erstzulassung', 'Steuerfrei bis', 'Steuer 2026', 'Danach pro Jahr'], ezRows.map(({ ez, r }) => [h.date(ez), h.date(r.exemptUntil!), h.eur(r.annual), h.eur(Math.floor(r.raw))]), `Elektro-Pkw mit ${h.num(KG)} kg, § 3d und § 9 Abs. 1 Nr. 3, Abs. 2 KraftStG`, ['l', 'l', 'r', 'r'])}
<p>Das Auto von 2013 zahlt 2026 also bereits Steuer, seine zehn Jahre sind abgelaufen. Ein Auto, das Ende 2030 als eines der letzten noch unter die Regel fällt, bekommt nur rund fünf Jahre. Wer nach dem ${h.date(K.elektro_ez_bis)} erstmals zulässt, erhält nach heutigem Stand keine Befreiung mehr und zahlt sofort die halbe Gewichtssteuer.</p>

<h2>Was danach kommt: halbe Gewichtssteuer</h2>
<p>Elektroautos werden nicht nach Hubraum besteuert, denn sie haben keinen. § 8 Nr. 2 KraftStG nimmt stattdessen das verkehrsrechtlich zulässige Gesamtgewicht, und ${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 3')} setzt den Satz je angefangene 200 kg: ${h.eur(K.gewicht_stufen_bis_3500[0][1], 2)} bis 2 000 kg, ${h.eur(K.gewicht_stufen_bis_3500[1][1], 2)} von 2 000 bis 3 000 kg, ${h.eur(K.gewicht_stufen_bis_3500[2][1], 2)} bis 3 500 kg. Wie bei der Einkommensteuer gilt jeder Satz nur für die Kilogramm in seinem Band. Vom Ergebnis zieht § 9 Abs. 2 für Elektrofahrzeuge die Hälfte ab.</p>
${h.table(['Zulässige Gesamtmasse', 'Gewichtssteuer voll', 'Elektro, halbiert'], gewichte.map((kg) => [`${h.num(kg)} kg`, h.eur(gewichtssteuer(kg), 2), h.eur(nach(kg).annual)]), 'Jahressteuer nach Ablauf der Befreiung, abgerundet nach § 11 Abs. 5 KraftStG', ['l', 'r', 'r'])}
<p>Selbst schwere E-SUV kommen damit selten über hundert Euro im Jahr. Zum Vergleich: Ein Benziner mit zwei Litern Hubraum und durchschnittlichem CO2-Wert zahlt meist ein Vielfaches. Die ermäßigte Steuer gilt unbefristet; das Gesetz sieht kein Ende der Halbierung vor. Für ein Auto, das im Oktober 2026 zugelassen wird, rechnet der Rechner für das Jahr 2036 mit ${h.eur(ab2026.annual)}.</p>
<!--mini:elektro-->
<h2>Rechenweg am Beispiel</h2>
<p>Für ein E-Auto mit ${h.num(KG)} kg zulässiger Gesamtmasse geht die Rechnung so: Die ersten 2 000 kg sind zehn Einheiten zu ${h.eur(K.gewicht_stufen_bis_3500[0][1], 2)}, zusammen ${h.eur(basis, 2)}. Die übrigen ${h.num(KG - 2000)} kg ergeben zwei angefangene Einheiten zu ${h.eur(K.gewicht_stufen_bis_3500[1][1], 2)}, also ${h.eur(rest, 2)}. Die volle Gewichtssteuer betrüge ${h.eur(basis + rest, 2)}. Halbiert sind es ${h.eur((basis + rest) * K.elektro_ermaessigung, 2)}, und nach der Abrundung auf volle Euro bleiben ${h.eur(typ.annual)}. Ein Kilogramm über einer 200er-Grenze kostet damit eine ganze Einheit mehr; bei der Gewichtsangabe in F.2 lohnt sich deshalb kein Streit um Kleinigkeiten, wohl aber ein Blick auf grobe Fehler.</p>

<h2>Auch E-Motorräder und E-Transporter</h2>
<p>§ 3d spricht von Elektrofahrzeugen im Sinne von § 9 Abs. 2, nicht nur von Pkw. Die Befreiung gilt deshalb ebenso für elektrische Motorräder, Roller mit amtlichem Kennzeichen und Transporter. Weil der Satz für Krafträder in § 9 Abs. 1 Nr. 1 nur für Hubkolbenmotoren gilt, zahlt ein E-Motorrad nach Ablauf der Befreiung ebenfalls nach Gewicht, halbiert. Bei Fahrzeugen über 3 500 kg halbiert § 9 Abs. 2 den Satz nach Nr. 4 Buchstabe a. Für die meisten Privatleute bleibt es aber beim Pkw.</p>

<h2>Kaufzeitpunkt und Restlaufzeit</h2>
<p>Wer heute ein neues E-Auto plant, kann die steuerfreie Zeit genau ausrechnen. Bei Erstzulassung im Juni 2028 endet die Befreiung am ${h.date(kauf2028.exemptUntil!)}, nach gut siebeneinhalb Jahren statt zehn. Der Unterschied wirkt groß, macht beim Geld aber wenig aus: Die fehlenden Jahre kosten bei mittlerem Gewicht jeweils nur den halben Gewichtssatz. Beim Gebrauchtkauf zählt die Restlaufzeit ab der Erstzulassung, nicht ab dem Kauf. Händler nennen sie oft nicht von sich aus; sie lässt sich aber direkt aus Feld B ablesen.</p>
<p>Bei der Zulassung verlangt § 13 Abs. 1 KraftStG das SEPA-Mandat nur im Fall einer Steuerpflicht; bei einem befreiten Fahrzeug genügt es, dass die Voraussetzungen der Befreiung nachgewiesen sind. Spätestens wenn die Befreiung endet, braucht der Zoll aber einen Zahlungsweg. Wer kein Mandat erteilt hat, sollte dann mit Post vom Hauptzollamt rechnen.</p>

<h2>Halterwechsel: die Befreiung reist mit</h2>
<p>§ 3d Abs. 2 gewährt die Befreiung einmal je Fahrzeug. Läuft sie beim Verkauf noch, übernimmt sie der Käufer. Für den Gebrauchtwagenmarkt ist das ein Argument: Ein drei Jahre altes E-Auto bringt die verbleibenden Jahre mit, und im Bescheid des neuen Halters erscheint keine Steuer bis zum Ende der Frist. Umgekehrt beginnt die Frist nicht neu, wenn das Auto den Besitzer wechselt oder aus dem Ausland zurückkommt.</p>
<p>Auch Pausen ändern nichts. Nach § 3d Abs. 3 wirken sich Zeiten der Außerbetriebsetzung und die Monate außerhalb eines Saisonkennzeichens nicht auf die Befreiung aus. Die Frist läuft kalendarisch weiter, ob das Auto zugelassen ist oder nicht.</p>

<h2>Umgerüstete Verbrenner</h2>
<p>Wer einen Benziner oder Diesel zum reinen Elektroauto umbaut, kann ebenfalls befreit werden. § 3d Abs. 4 verlangt zweierlei: Die Umrüstung muss zwischen dem 18. Mai 2016 und dem ${h.date(K.elektro_ez_bis)} erfolgt sein, und für die verwendeten Teile muss eine Allgemeine Betriebserlaubnis nach §§ 20, 22 StVZO vorliegen. Die Befreiung beginnt hier nicht mit der Erstzulassung des Autos, sondern an dem Tag, an dem die Zulassungsbehörde die Voraussetzungen feststellt. Die zehn Jahre und das Höchstdatum 2035 gelten entsprechend.</p>

<h2>Was die Zulassungsstelle festhält</h2>
<p>Ob ein Auto als Elektrofahrzeug gilt, entscheidet nicht der Zoll, sondern die Eintragung in der Zulassungsbescheinigung: Die Feststellungen der Zulassungsbehörde sind nach § 2 Abs. 2 KraftStG verbindlich. Kraftstoffart und Antrieb stehen in Feld P.3, das Gesamtgewicht in F.2. Beim Import lohnt ein Blick darauf, ob die Daten richtig übernommen wurden, denn ein falscher Eintrag führt zu einem falschen Bescheid.</p>
<p>Für vor dem 18. Mai 2011 zugelassene Elektroautos gilt nach § 18 Abs. 4b weiterhin § 3d in der Fassung vom 5. November 2008. Solche Fahrzeuge sind selten; ihre Steuer prüft man am besten mit dem ${h.src('bmfRechner', 'Rechner des Bundesfinanzministeriums')}.</p>

<h2>Wenn die Befreiung endet</h2>
<p>Am Tag nach dem Ende der Befreiung beginnt die Steuerpflicht von selbst (§ 5 Abs. 2 KraftStG); einen Antrag braucht es nicht. Der Zoll setzt die Steuer neu fest und bucht per SEPA ab, wie bei jedem anderen Fahrzeug. Die Mindestdauer von einem Monat gilt hier nicht, weil das Auto nur befristet befreit war. Den Jahresbetrag für Ihr Gewicht zeigt der ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')}, die allgemeinen Regeln zu Bescheid und Zahlung stehen auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')}. Wer schwerbehindert ist, kann die halbe Steuer nach Ablauf nochmals halbieren oder ganz vermeiden, siehe ${h.a('kfz-steuer-schwerbehinderung', 'Kfz-Steuer bei Schwerbehinderung')}.</p>
<p>Steuer ist allerdings nur ein Posten. Auch das E-Auto muss zur Hauptuntersuchung, die Abgasuntersuchung entfällt dabei mangels Auspuff; was die HU kostet, steht unter ${h.a('tuev-kosten', 'TÜV-Kosten')}. Gegenüber dem ${h.a('kfz-steuer-diesel', 'Diesel')} spart ein E-Auto bei der Steuer über zehn Jahre leicht vierstellige Beträge.</p>`,
  },
  en: {
    slug: 'electric-car-tax-germany',
    nav: 'Electric car tax',
    card: 'Ten tax-free years at most, never past 2035, then half a weight-based tax.',
    title: 'Electric Car Tax Germany 2026: Exemption Until 2035',
    description: `Electric car tax in Germany 2026: no Kfz-Steuer for ten years if first registered by end-2030, until 31 Dec 2035 at most, then about ${eE(typ.annual)} a year at ${formatNumber(KG, 0, 'en')} kg.`,
    h1: 'Electric car tax in Germany: how long your EV stays tax-free',
    intro: 'A battery car registered in Germany pays no vehicle tax at first, and the law already fixes the date when that stops.',
    resume: `Fully electric cars are exempt from German vehicle tax under Section 3d of the Motor Vehicle Tax Act (KraftStG) if they were first registered between 18 May 2011 and 31 December 2030. The exemption lasts ten years from the first registration date but ends on 31 December 2035 at the latest, so an EV first registered in 2027 gets fewer than nine years. The date that counts is the first registration anywhere, which matters if you bring an EV from another country: one first registered in March 2024 stays tax-free until ${ab2024.exemptUntil!.split('-').reverse().join('.')}. The exemption belongs to the car and passes to the next owner. After it ends, the car pays a tax based on permitted total weight, ${eE(K.gewicht_stufen_bis_3500[0][1], 2)} per started 200 kg up to 2,000 kg and slightly more above, and electric cars pay only half of it: ${eE(typ.annual)} a year at ${formatNumber(KG, 0, 'en')} kg. Plug-in hybrids do not qualify and pay the normal car tax from day one.`,
    faqs: [
      { q: 'My EV was first registered abroad in 2021. How long is it tax-free in Germany?', a: 'Ten years from its first registration abroad, so until the same date in 2031, provided the date falls between 18 May 2011 and 31 December 2030 (Section 3d KraftStG). The German registration date does not restart the clock, and the exemption covers only the time left. Field B of your German registration certificate shows the date customs will use.' },
      { q: 'Does a plug-in hybrid count as an electric car for German tax?', a: `No. Section 9(2) KraftStG requires a drive exclusively by electric motors, so any car that also has a combustion engine is taxed like a normal car on engine size and CO2. Because hybrids have low test CO2 figures the bill is often small: a 2024 petrol plug-in with 1,998 cm³ and 32 g pays ${eE(hybrid.annual)}, the engine part only.` },
      { q: 'What will my electric car cost in tax after 2035?', a: `Under the current law, half the weight-based tax of Section 9(1) No. 3, with no end date for the reduction. At ${formatNumber(KG, 0, 'en')} kg permitted total weight, field F.2 on the registration certificate, that is ${eE(typ.annual)} a year; at 2,900 kg it is ${eE(schwer.annual)}. Weight counts in started 200 kg blocks and the result is rounded down to whole euros.` },
      { q: 'Is a hydrogen fuel cell car exempt from German vehicle tax?', a: 'Yes, if it is driven only by electric motors. Section 9(2) KraftStG includes cars fed from emission-free energy converters, which covers fuel cells, alongside battery cars. The same Section 3d exemption therefore applies: ten years from first registration between 18 May 2011 and the end of 2030, no later than 31 December 2035, and half the weight-based tax afterwards.' },
    ],
    body: (h) => `
<h2>What the law says</h2>
<p>${h.src('kraftstg3d', 'Section 3d KraftStG')} exempts electric vehicles from vehicle tax if they were first registered between ${h.date(K.elektro_ez_von)} and ${h.date(K.elektro_ez_bis)}. The exemption runs for ${K.elektro_befreiung_jahre} years from that date and ends on ${h.date(K.elektro_befreiung_max)} at the latest. Nothing has to be applied for: the registration office records the drive type in field P.3 of the registration certificate, and customs, which runs the tax, follows that entry.</p>
<p>An electric vehicle, for tax purposes, is one driven exclusively by electric motors fed mainly from batteries, other mechanical or electrochemical storage, or emission-free energy converters such as fuel cells. Range extenders and plug-in hybrids have an engine, so they are out. If you are choosing between a plug-in and a full EV partly for tax reasons, this is the dividing line.</p>
<p>You do not need to file anything separately. Under Section 12a(2) and (6) KraftStG the vehicle registration itself counts as the tax declaration, and a note in it is enough to claim the exemption. Customs then normally sends a notice that states when the exemption ends. Keep that letter with your car papers; it is the simplest way to know the date your first bill will arrive, years from now, perhaps after you have changed address or bank twice.</p>

<h2>Find your end date</h2>
<p>For cars first registered up to the end of 2025 the full ten years fit before the 2035 cut-off. For any first registration after ${h.date(kappungAb)} the cut-off bites, and every later registration gets a shorter exemption. Here are sample dates for a car with ${h.num(KG)} kg permitted total weight, a typical figure for a mid-size battery SUV:</p>
${h.table(['First registered', 'Tax-free until', 'Tax in 2026', 'Afterwards per year'], ezRows.map(({ ez, r }) => [h.date(ez), h.date(r.exemptUntil!), h.eur(r.annual), h.eur(Math.floor(r.raw))]), `Electric car at ${h.num(KG)} kg, Section 3d and Section 9(1) No. 3, (2) KraftStG`, ['l', 'l', 'r', 'r'])}
<p>The 2013 car is already paying in 2026. An EV first registered on the last day of 2030 gets just five years. A car first registered in 2031 or later gets no exemption at all under the law as it stands today.</p>

<h2>Bringing an EV to Germany</h2>
<p>People relocating from the Netherlands, Norway, the UK or further afield often bring their electric car. The exemption is tied to the first registration date of the vehicle, wherever that was, and it is granted only once per vehicle (Section 3d(2)). Your German registration simply inherits whatever is left. A Norwegian EV first registered in 2015 used up its ten years in 2025; since then it pays the reduced weight tax in Germany like any other.</p>
<p>Check the converted figures on your new German certificate. Field F.2 should show the permitted total weight from the original documents. A wrong weight or a missing electric drive code means a wrong tax notice, and corrections go through the registration office, because Section 2(2) KraftStG makes its records binding on customs.</p>

<h2>After the exemption: half the weight tax</h2>
<p>Electric cars have no engine size, so Section 8 No. 2 KraftStG taxes them by permitted total weight under ${h.src('kraftstg9', 'Section 9(1) No. 3')}: ${h.eur(K.gewicht_stufen_bis_3500[0][1], 2)} per started 200 kg up to 2,000 kg, ${h.eur(K.gewicht_stufen_bis_3500[1][1], 2)} from 2,000 to 3,000 kg and ${h.eur(K.gewicht_stufen_bis_3500[2][1], 2)} up to 3,500 kg, each rate only for the kilos in its band. Section 9(2) then halves the result for electric vehicles.</p>
${h.table(['Permitted total weight', 'Full weight tax', 'Electric, halved'], gewichte.map((kg) => [`${h.num(kg)} kg`, h.eur(gewichtssteuer(kg), 2), h.eur(nach(kg).annual)]), 'Annual tax once the exemption has ended, rounded down to the euro', ['l', 'r', 'r'])}
<p>Even a heavy electric SUV stays below a hundred euros a year. The reduction has no end date in the current text. For a car first registered in October 2026, the bill in 2036 would be ${h.eur(ab2026.annual)}.</p>
<!--mini:elektro-->
<h2>The sum, step by step</h2>
<p>Take an EV with ${h.num(KG)} kg permitted total weight. The first 2,000 kg are ten blocks at ${h.eur(K.gewicht_stufen_bis_3500[0][1], 2)}, which makes ${h.eur(basis, 2)}. The remaining ${h.num(KG - 2000)} kg are two started blocks at ${h.eur(K.gewicht_stufen_bis_3500[1][1], 2)}, adding ${h.eur(rest, 2)}. The full weight tax would be ${h.eur(basis + rest, 2)}; halved it is ${h.eur((basis + rest) * K.elektro_ermaessigung, 2)}, and rounding down gives ${h.eur(typ.annual)}. One kilo over a 200 kg step adds a whole block, but at these rates that is only a few euros.</p>

<h2>Electric motorbikes and vans</h2>
<p>Section 3d covers every electric vehicle within the meaning of Section 9(2), not just cars. An electric motorbike or scooter with official registration plates, or an electric van, gets the same ten years. Afterwards an e-motorbike is taxed by weight too, because the per-25 cm³ rate for motorbikes applies only to piston engines; the result is again halved. Above 3,500 kg the halving applies to the heavy vehicle rates of Section 9(1) No. 4(a).</p>

<h2>Timing a purchase</h2>
<p>If you are planning to buy new, the remaining exemption is easy to work out. A car first registered in June 2028 is tax-free until ${h.date(kauf2028.exemptUntil!)}, roughly seven and a half years. That sounds like a big loss, but the missing years only cost the halved weight rate, so the difference is small in euros. When buying used, the clock runs from field B, not from your purchase date, and dealers do not always mention it. Leasing an EV for three years usually means the whole contract falls within the exemption.</p>
<p>At registration Section 13(1) KraftStG requires the SEPA mandate only where tax is due; for an exempt car proof of the exemption conditions is enough. Once the exemption ends, customs needs a way to collect, so expect a letter from the Hauptzollamt if no mandate is on file. Newcomers who registered the car before opening a German account should bear this in mind.</p>

<h2>Selling, buying used, pausing</h2>
<p>When you sell an EV whose exemption is still running, the buyer takes over the remaining years. When you buy one, its first registration date tells you how long you will pay nothing, which makes three- or four-year-old EVs good value on the tax side. Taking the car off the road does not stretch the exemption: Section 3d(3) says time spent deregistered or outside a seasonal plate period has no effect. If you leave Germany for a year and deregister the car, the clock keeps running.</p>

<h2>Converted cars</h2>
<p>A petrol or diesel car converted into a fully electric one can also qualify. Section 3d(4) requires the conversion to be done between 18 May 2016 and ${h.date(K.elektro_ez_bis)}, with a general type approval (Allgemeine Betriebserlaubnis) for the conversion parts under the German vehicle registration rules (StVZO). The exemption then starts on the day the registration office confirms these conditions, not on the car's original registration date, and it is capped by the same 2035 deadline.</p>

<h2>When the bill starts</h2>
<p>The day after the exemption ends, liability begins automatically (Section 5(2) KraftStG). Customs issues a new notice and uses your SEPA mandate as for any other car, and the one-month minimum does not apply. To check the figure for your exact weight, use the ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')}; for notices, deadlines and refunds see the ${h.a('kfz-steuer', 'German vehicle tax overview')}. Very old EVs registered before 18 May 2011 still fall under an earlier version of Section 3d (Section 18(4b)); the ${h.src('bmfRechner', 'Finance Ministry calculator')} handles those.</p>
<p>Keepers with a severe disability can reduce or remove even the post-exemption tax, as explained under ${h.a('kfz-steuer-schwerbehinderung', 'vehicle tax relief for disabled drivers')}. Compared with a ${h.a('kfz-steuer-diesel', 'diesel car')}, the tax saving over ten years easily reaches four figures. An EV still needs the regular roadworthiness test (HU), without the exhaust check; prices are on the ${h.a('tuev-kosten', 'TÜV cost page')}.</p>`,
  },
});
