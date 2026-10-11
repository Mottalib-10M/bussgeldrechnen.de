import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pkw, elektro, krad } from '../../lib/engine/kfzsteuer';
import { formatMoney } from '../../lib/format';

const K = P.kfz;
/** § 11 Abs. 2 KraftStG : seuils et Aufgeld des paiements fractionnés (absents de params-2026.json). */
const S11 = { halbjahr_ab: 500, vierteljahr_ab: 1000, aufgeld_halb: 0.03, aufgeld_viertel: 0.06 };

const neu = pkw({ ez: '2024-04-01', fuel: 'benzin', ccm: 1498, co2: 118 });
const mitte = pkw({ ez: '2016-09-01', fuel: 'diesel', ccm: 1968, co2: 115 });
const alt = pkw({ ez: '2006-03-01', fuel: 'benzin', ccm: 1598, co2: 0, altKlasse: 'euro3plus' });
const gross = pkw({ ez: '2022-06-01', fuel: 'benzin', ccm: 2998, co2: 214 });
const ev = elektro('2022-05-01', 2100, 2026);
const mot = krad(689);
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
const halb = Math.floor(gross.annual / 2 * (1 + S11.aufgeld_halb));

export default defineGuide({
  id: 'kfz-steuer',
  group: 'steuer',
  order: 10,
  mini: 'kfz',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer-diesel', 'kfz-steuer-elektroauto', 'kfz-steuer-altfahrzeuge', 'kfz-steuer-motorrad', 'kfz-steuer-schwerbehinderung'],
  sources: ['kraftstg', 'kraftstg9', 'zoll', 'bmfRechner'],
  de: {
    slug: 'kfz-steuer',
    nav: 'Kfz-Steuer',
    card: 'Berechnung nach Erstzulassung, Zahlung an den Zoll, Beginn und Ende.',
    title: 'Kfz-Steuer 2026: Berechnung, Zahlung und Zuständigkeit',
    description: `Kfz-Steuer 2026: Pkw ab 2021 zahlen ${eD(K.hubraum_benzin)} (Benzin) oder ${eD(K.hubraum_diesel, 2)} (Diesel) je 100 cm³ plus CO2 über ${K.co2_frei_2021} g/km. Das Hauptzollamt bucht jährlich im Voraus per SEPA ab.`,
    h1: 'Kfz-Steuer: wie sie berechnet und bezahlt wird',
    intro: 'Wer ein Auto in Deutschland zulässt, schuldet ab dem Tag der Zulassung Kraftfahrzeugsteuer, und das Datum der Erstzulassung entscheidet über die Formel.',
    resume: `Die Kfz-Steuer für einen Pkw richtet sich nach dem Tag, an dem das Fahrzeug zum ersten Mal zugelassen wurde. Seit dem 1. Januar 2021 zugelassene Autos zahlen ${eD(K.hubraum_benzin)} je angefangene 100 cm³ Hubraum beim Benziner und ${eD(K.hubraum_diesel, 2)} beim Diesel, dazu einen gestaffelten Betrag für jedes Gramm CO2 über ${K.co2_frei_2021} g/km. Ein Benziner von 2024 mit 1 498 cm³ und 118 g kostet damit ${eD(neu.annual)} im Jahr. Zwischen Juli 2009 und Ende 2020 zugelassene Autos zahlen ${eD(K.co2_satz_2009)} je Gramm über einer festen Schwelle, ältere Autos einen Satz je 100 cm³ nach Schadstoffklasse. Erhoben wird die Steuer vom Zoll: Das zuständige Hauptzollamt schickt etwa zwei Wochen nach der Zulassung den Bescheid und bucht den Jahresbetrag im Voraus per SEPA-Lastschrift ab. Der Betrag wird nach § 11 Abs. 5 KraftStG auf volle Euro abgerundet. Mit der Abmeldung oder der Umschreibung auf einen Käufer endet die Steuerpflicht.`,
    faqs: [
      { q: 'Welches Hauptzollamt ist für meine Kfz-Steuer zuständig?', a: 'Das Hauptzollamt, in dessen Bezirk Sie als Halter wohnen. Sie müssen es nicht selbst suchen: Die Zulassungsstelle meldet die Zulassung samt SEPA-Mandat an die Zollverwaltung, die dann den Bescheid schickt. Adresse und Bankverbindung des Amts stehen auf dem Bescheid; der Zoll nennt beide auch in seiner Dienststellensuche. Seit Juli 2014 verwaltet der Bund die Steuer, nicht mehr das Finanzamt (§ 18 Abs. 7 KraftStG).' },
      { q: 'Schickt der Zoll jedes Jahr eine neue Rechnung für die Kfz-Steuer?', a: 'Nein. Der erste Steuerbescheid gilt unbefristet weiter, solange sich am Fahrzeug nichts ändert (§ 12 Abs. 1 KraftStG). Der Zoll schreibt ausdrücklich, dass er vor der Fälligkeit keine jährlichen Zahlungserinnerungen verschickt. Die Lastschrift kommt am Fälligkeitstag, der sich aus dem Tag der Zulassung ergibt. Wer kein Mandat erteilt hat, muss selbst rechtzeitig überweisen.' },
      { q: 'Kann ich die Kfz-Steuer halbjährlich oder vierteljährlich zahlen?', a: `Nur bei hohen Beträgen. Halbjährlich geht ab einer Jahressteuer von mehr als ${eD(S11.halbjahr_ab)}, vierteljährlich ab mehr als ${eD(S11.vierteljahr_ab)}. Dafür verlangt § 11 Abs. 2 KraftStG einen Aufschlag von 3 beziehungsweise 6 Prozent auf die Rate. Ein Wechsel ist schriftlich anzuzeigen, spätestens mit der Fälligkeit des neuen Betrags. Für einen typischen Pkw kommt das selten in Frage.` },
      { q: 'Was passiert, wenn die Lastschrift für die Kfz-Steuer platzt?', a: 'Nach Angaben des Zolls ruht das Lastschriftverfahren nach einer Rücklastschrift, bis es wieder aktiviert wird. Es folgen Mahnung und Säumniszuschläge. Bleibt die Steuer offen, darf das Hauptzollamt die Zulassungsstelle bitten, das Fahrzeug von Amts wegen außer Betrieb zu setzen (§ 14 KraftStG). Außerdem lässt die Zulassungsstelle kein weiteres Fahrzeug zu, solange Rückstände von 5 Euro oder mehr bestehen (§ 13 Abs. 2).' },
      { q: 'Zahle ich Kfz-Steuer für den ganzen Monat, wenn ich am 3. abmelde?', a: 'Nein, die Steuer wird tageweise abgerechnet. Der Tag, an dem die Steuerpflicht endet, zählt nicht mit (§ 9 Abs. 5 KraftStG). Weil Sie im Voraus gezahlt haben, entsteht meist ein Guthaben, das der Zoll nach eigenen Angaben in der Regel drei Wochen nach der Abmeldung erstattet. Eine Mindestdauer von einem Monat gilt nur, wenn ein Fahrzeug insgesamt kürzer zugelassen war (§ 5 Abs. 1 Nr. 1).' },
    ],
    body: (h) => `
<h2>Drei Formeln, ein Stichtag</h2>
<p>Das ${h.src('kraftstg', 'Kraftfahrzeugsteuergesetz')} kennt für Pkw drei Rechenwege, und welcher gilt, steht in Feld B der Zulassungsbescheinigung Teil I: das Datum der Erstzulassung. Nicht der Tag, an dem Sie das Auto gekauft haben, und auch nicht der Tag der Umschreibung. Ein Gebrauchter von 2016 bleibt steuerlich ein Auto von 2016, egal wie oft er den Halter wechselt.</p>
${h.table(['Erstzulassung', 'Bemessung', 'Beispiel', 'Jahressteuer'], [
  ['ab 1.1.2021', `Hubraum + CO2 gestaffelt ab ${K.co2_frei_2021} g`, `Benziner, ${h.num(1498)} cm³, 118 g`, h.eur(neu.annual)],
  ['1.7.2009 bis 31.12.2020', `Hubraum + ${h.eur(K.co2_satz_2009)} je g über ${K.co2_frei_bis_2011}/${K.co2_frei_2012_2013}/${K.co2_frei_ab_2014} g`, `Diesel 2016, ${h.num(1968)} cm³, 115 g`, h.eur(mitte.annual)],
  ['bis 30.6.2009', 'Hubraum nach Schadstoffklasse', `Benziner 2006, Euro 4, ${h.num(1598)} cm³`, h.eur(alt.annual)],
], 'Jahressteuer nach § 9 Abs. 1 Nr. 2 KraftStG, berechnet mit unserem Rechner', ['l', 'l', 'l', 'r'])}
<p>Bei allen drei Wegen wird der Hubraum in angefangenen 100 cm³ gezählt. Ein Motor mit ${h.num(1498)} cm³ zählt also wie einer mit ${h.num(1500)} cm³: 15 Einheiten. Beim Benziner kostet jede Einheit ${h.eur(K.hubraum_benzin)}, beim Diesel ${h.eur(K.hubraum_diesel, 2)}. Der Unterschied ist so groß, dass die ${h.a('kfz-steuer-diesel', 'Kfz-Steuer beim Diesel')} eine eigene Seite hat.</p>

<h3>Seit 2021: der Stufentarif für CO2</h3>
<p>Für jüngere Autos zählt jedes Gramm über ${K.co2_frei_2021} g/km, und zwar umso teurer, je höher der Wert ist. Die ersten 20 Gramm kosten je ${h.eur(K.co2_stufen_2021[0][1], 2)}, das letzte Band oberhalb von 195 g kostet ${h.eur(K.co2_stufen_2021[5][1], 2)} je Gramm. Die Sätze gelten nicht für das ganze Fahrzeug, sondern nur für die Gramm im jeweiligen Band, ähnlich wie bei der Einkommensteuer. Ein Benziner von 2022 mit ${h.num(2998)} cm³ und 214 g landet so bei ${h.eur(gross.annual)}, davon ${h.eur(gross.lines[1].amount, 2)} allein für das CO2.</p>
<h3>2009 bis 2020: eine feste Freigrenze</h3>
<p>Hier gibt es nur einen CO2-Satz, ${h.eur(K.co2_satz_2009)} je Gramm. Die Freigrenze hängt vom Jahr der Erstzulassung ab: ${K.co2_frei_bis_2011} g bis Ende 2011, ${K.co2_frei_2012_2013} g für 2012 und 2013, ${K.co2_frei_ab_2014} g ab 2014. Zwei baugleiche Autos können also unterschiedlich viel kosten, nur weil eines im Dezember 2011 und das andere im Januar 2012 zugelassen wurde.</p>
<h3>Vor Juli 2009: die Schadstoffklasse</h3>
<p>Ältere Autos zahlen nur nach Hubraum, aber mit einem Satz, der von der Abgasnorm abhängt. Die Spanne reicht beim Benziner von ${h.eur(K.alt_saetze.euro3plus[0], 2)} bis ${h.eur(K.alt_saetze.sonstige[0], 2)} je 100 cm³. Alle Stufen und den Übergangsfall Ende 2008 erklärt die Seite zu ${h.a('kfz-steuer-altfahrzeuge', 'Altfahrzeugen')}.</p>

<h2>Andere Fahrzeuge, andere Bemessung</h2>
<p>Nicht jedes Fahrzeug wird nach Hubraum besteuert. Reine Elektroautos sind bei Erstzulassung bis Ende 2030 befreit; danach zahlen sie die Hälfte einer Steuer nach Gewicht. Für ein E-Auto mit ${h.num(2100)} kg von Mai 2022 läuft die Befreiung bis ${h.date(ev.exemptUntil!)}, danach wären es ${h.eur(Math.floor(ev.raw))} pro Jahr. Motorräder zahlen ${h.eur(K.krad_je_25ccm, 2)} je angefangene 25 cm³, bei ${h.num(689)} cm³ sind das ${h.eur(mot.annual)}. Wohnmobile und Anhänger werden nach zulässigem Gesamtgewicht besteuert.</p>

<h2>Wer die Steuer erhebt</h2>
<p>Die Kraftfahrzeugsteuer ist eine Bundessteuer, und seit Juli 2014 verwaltet sie die Zollverwaltung. Zuständig ist das Hauptzollamt Ihres Wohnorts. Mit dem Finanzamt haben Sie dafür nichts zu tun, auch wenn ältere Ratgeber das noch so darstellen. Steuerschuldner ist nach § 7 KraftStG die Person, für die das Fahrzeug zugelassen ist, also der Halter, nicht unbedingt der Eigentümer oder die Person, die am meisten fährt.</p>
<p>Die Zulassungsstelle wirkt mit: Sie trägt die Bemessungsgrundlagen in die Zulassungsbescheinigung ein, und diese Feststellungen binden den Zoll (§ 2 Abs. 2 Nr. 2). Der Zoll prüft also nicht selbst nach, wie viel CO2 Ihr Auto ausstößt. Stimmt ein Wert im Fahrzeugschein nicht, ist die Zulassungsstelle der erste Ansprechpartner. Wird die Eintragung berichtigt, setzt der Zoll die Steuer nach § 12 Abs. 2 KraftStG neu fest; bei einem Fehler zu Ihren Lasten gilt die Korrektur ab dem Zeitraum, in dem der Fehler dem Zoll bekannt wird.</p>

<h2>Zahlung: SEPA ist Voraussetzung der Zulassung</h2>
<p>Ohne Lastschriftmandat kein Kennzeichen. § 13 Abs. 1 KraftStG macht die Zulassung davon abhängig, dass eine Einzugsermächtigung für ein Konto des Halters oder eines Dritten vorliegt. Der ${h.src('zoll', 'Zoll')} schreibt dazu, dass das Mandat bei der Zulassungsbehörde oder über deren Online-Portal abgegeben wird. Abgebucht wird am Tag der Fälligkeit, jährlich im Voraus (§ 11 Abs. 1). Nur wenn das Hauptzollamt wegen einer erheblichen Härte auf das Mandat verzichtet, ist Überweisung der reguläre Weg.</p>
<p>Ratenzahlung sieht das Gesetz nur bei hohen Beträgen vor. Halbjährlich geht ab einer Jahressteuer von mehr als ${h.eur(S11.halbjahr_ab)}, vierteljährlich ab mehr als ${h.eur(S11.vierteljahr_ab)}, jeweils mit Aufgeld. Für den großen Benziner aus dem Beispiel wären zwei Raten zu je ${h.eur(halb)} fällig statt einmal ${h.eur(gross.annual)}.</p>
<h3>Abrundung</h3>
<p>Nach § 11 Abs. 5 KraftStG wird der zu entrichtende Betrag auf volle Euro nach unten abgerundet. Aus rechnerisch ${h.eur(neu.raw, 2)} für den Benziner von 2024 werden ${h.eur(neu.annual)}. Das gilt auch für den Teilbetrag der ersten Festsetzung.</p>

<h2>Beginn und Ende der Steuerpflicht</h2>
<p>Die Pflicht beginnt mit der Zulassung, nicht mit der ersten Fahrt. Etwa zwei Wochen später verschickt der Zoll den Bescheid. Er gilt für die Folgejahre weiter, eine jährliche Erinnerung gibt es nicht. Ändert sich etwas, das die Steuer beeinflusst, etwa durch einen Umbau mit neuem Eintrag in der Zulassungsbescheinigung, setzt der Zoll neu fest (§ 5 Abs. 3, § 12 Abs. 2).</p>
<p>Enden kann die Pflicht auf zwei Arten: durch Abmeldung oder durch Umschreibung auf einen Käufer. Beim Verkauf zählt das Datum, an dem der Erwerber das Auto auf sich zulässt. Bis dahin bleiben Sie Steuerschuldner, auch wenn der Wagen schon vor einer fremden Tür steht. Wer verkauft, sollte die Umschreibung deshalb im Blick behalten. Den Abmeldebescheid und eine Erstattung des zu viel Gezahlten verschickt der Zoll in den Wochen danach.</p>
<h2>Halterwechsel: was Käufer und Verkäufer tun müssen</h2>
<p>Wer einen Gebrauchten kauft, gibt bei der Umschreibung eine neue Steuererklärung ab; nach § 12a Abs. 2 KraftStG genügt dafür die Fahrzeuganmeldung mit dem entsprechenden Hinweis. Dazu gehört ein eigenes SEPA-Mandat, denn der Zoll verlangt bei einem neuen Steuerschuldner ein neues Mandat und keine bloße Änderung des alten. Der Verkäufer erhält nach der Umschreibung einen Bescheid über das Ende seiner Steuerpflicht und das Guthaben. Eine bereits laufende Befreiung, etwa beim Elektroauto, geht auf den Käufer über, soweit sie noch nicht abgelaufen ist.</p>

<h2>Saisonkennzeichen und Wechsel zwischen Fahrzeugen</h2>
<p>Ein Saisonkennzeichen begrenzt die Steuer auf die Monate, die auf dem Schild stehen. § 11 Abs. 4 KraftStG rechnet dann für jeden Tag des Betriebszeitraums ein Dreihundertfünfundsechzigstel der Jahressteuer; der 29. Februar zählt in Schaltjahren nicht mit. Ein Cabrio, das von April bis Oktober angemeldet ist, kostet also etwa sieben Zwölftel des Jahresbetrags. Einen gemeinsamen Fälligkeitstag mit anderen Fahrzeugen erlaubt das Gesetz bei Saisonkennzeichen ausdrücklich nicht. Wer dagegen mehrere ganzjährig zugelassene Fahrzeuge hält, kann auf Antrag einen einheitlichen Fälligkeitstag bekommen; dafür wird für mindestens zwei Fahrzeuge tageweise abgerechnet.</p>

<h2>Wann keine Kfz-Steuer anfällt</h2>
<p>§ 3 KraftStG listet die Ausnahmen. Für Privatleute sind nur wenige relevant: Fahrzeuge, die nach der Fahrzeug-Zulassungsverordnung gar nicht zugelassen werden müssen, sind steuerfrei, ebenso Fahrzeuge, die ausschließlich im Rettungsdienst oder bei der Feuerwehr fahren und als solche erkennbar sind. Ausländische Pkw, die nur vorübergehend in Deutschland sind, bleiben bis zu einem Jahr befreit, solange hier kein regelmäßiger Standort begründet ist. Daneben stehen die beiden großen Vergünstigungen außerhalb von § 3: die Befreiung für Elektroautos nach § 3d und die Hilfen für schwerbehinderte Halter nach § 3a. Beide sind befristet beziehungsweise an Bedingungen geknüpft und werden im Bescheid nur berücksichtigt, wenn die Voraussetzungen festgestellt oder beantragt sind.</p>
<!--mini:kfz-->
<h2>Wie genau ist eine eigene Berechnung?</h2>
<p>Für die Jahressteuer sehr genau, weil das Gesetz keine Ermessensspielräume lässt. Unser ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')} kam am 11. Oktober 2026 in 21 Testfällen auf denselben Euro wie der ${h.src('bmfRechner', 'Rechner des Bundesfinanzministeriums')}. Abweichungen zum ersten Bescheid entstehen fast immer durch den Teilzeitraum: Wer im Juni zulässt, bekommt zunächst eine Festsetzung bis zum nächsten Fälligkeitstag, nicht den glatten Jahresbetrag. Wer schwerbehindert ist, kann eine ${h.a('kfz-steuer-schwerbehinderung', 'Befreiung oder halbe Steuer')} beantragen, die im Bescheid erst nach dem Antrag erscheint.</p>`,
  },
  en: {
    slug: 'vehicle-tax-germany',
    nav: 'Vehicle tax',
    card: 'How German car tax is worked out, who collects it and how you pay.',
    title: 'Vehicle Tax Germany 2026: Kfz-Steuer Rules for Car Owners',
    description: `Vehicle tax in Germany 2026: cars from 2021 on pay ${eE(K.hubraum_benzin)} (petrol) or ${eE(K.hubraum_diesel, 2)} (diesel) per 100 cm³ plus CO2 above ${K.co2_frei_2021} g/km, debited yearly in advance by customs.`,
    h1: 'Vehicle tax in Germany: what you pay once your car has German plates',
    intro: 'Registering a car in Germany makes you liable for Kfz-Steuer from that day, and the date the car was first registered decides the formula.',
    resume: `German vehicle tax, the Kraftfahrzeugsteuer or Kfz-Steuer, is an annual tax on keeping a registered vehicle, and for cars it depends on the date of first registration anywhere. Cars first registered since 1 January 2021 pay ${eE(K.hubraum_benzin)} per started 100 cm³ of engine size for petrol and ${eE(K.hubraum_diesel, 2)} for diesel, plus a charge for every gram of CO2 above ${K.co2_frei_2021} g/km that rises in bands. A 2016 diesel with 1,968 cm³ and 115 g costs ${eE(mitte.annual)} a year under the 2009 to 2020 rules; a 2024 petrol car with 1,498 cm³ and 118 g costs ${eE(neu.annual)}. The tax is run by German customs (Zoll): the main customs office for your area, the Hauptzollamt, sends a tax notice about two weeks after registration and takes the annual amount in advance by SEPA direct debit. You cannot register a car without signing that mandate. The amount is rounded down to whole euros, and the liability ends when the car is deregistered or re-registered to a buyer.`,
    faqs: [
      { q: 'I just moved to Germany with my car. When do I start paying Kfz-Steuer?', a: 'Once the car gets German plates. A foreign-registered private car brought in for a temporary stay is exempt for up to one year, but the exemption ends as soon as the car has a regular base in Germany (Section 3 No. 13 KraftStG), which is normally the case once you live here. From the day of German registration the tax runs, and the first notice follows about two weeks later.' },
      { q: 'Can I pay German car tax by bank transfer instead of direct debit?', a: 'Normally not. Section 13(1) KraftStG makes registration conditional on a SEPA direct debit mandate from your own account or someone else\'s, so a German or other SEPA IBAN is needed at the registration office. Customs can waive the mandate only for considerable hardship. If a debit fails, the procedure is suspended and you transfer the amount to the Hauptzollamt yourself, with reminders and late charges added.' },
      { q: 'Does the German tax office send a car tax reminder every year?', a: 'No, and not the tax office either: customs handles it. The first notice stays valid for later years, and customs states that it sends no yearly reminder before the due date. The debit simply arrives on the anniversary-based due date. Keep the account you gave at registration funded, and report a new IBAN or address to the Hauptzollamt in good time.' },
      { q: 'Do I get vehicle tax back when I leave Germany and deregister my car?', a: 'Yes. Because the tax is paid a year in advance, deregistering usually leaves a credit, counted by the day; the day the liability ends is not charged (Section 9(5) KraftStG). Customs says refunds normally arrive about three weeks after deregistration. Make sure the refund account still works, since a closed German account is a common problem for people moving away.' },
    ],
    body: (h) => `
<h2>The date that decides everything</h2>
<p>Look at field B of your Zulassungsbescheinigung Teil I, the small registration certificate that stays in the car. It shows the date of first registration, and the ${h.src('kraftstg', 'Motor Vehicle Tax Act (KraftStG)')} uses it to sort cars into three regimes. For an imported car this is the date it was first registered in its home country, not the date it got German plates. A 2016 car shipped from Spain is taxed exactly like a 2016 car bought in Munich.</p>
${h.table(['First registered', 'Basis', 'Example', 'Tax per year'], [
  ['from 1 Jan 2021', `engine size + banded CO2 above ${K.co2_frei_2021} g`, `petrol, ${h.num(1498)} cm³, 118 g`, h.eur(neu.annual)],
  ['1 Jul 2009 to 31 Dec 2020', `engine size + ${h.eur(K.co2_satz_2009)} per g above a fixed threshold`, `diesel 2016, ${h.num(1968)} cm³, 115 g`, h.eur(mitte.annual)],
  ['up to 30 Jun 2009', 'engine size by emission class', `petrol 2006, Euro 4, ${h.num(1598)} cm³`, h.eur(alt.annual)],
], 'Annual tax under Section 9(1) No. 2 KraftStG, worked out with our calculator', ['l', 'l', 'l', 'r'])}

<h2>How the 2021 formula works in practice</h2>
<p>Engine size is counted in started blocks of 100 cm³, so 1,498 cm³ counts as 15 blocks. Petrol cars pay ${h.eur(K.hubraum_benzin)} a block and diesels ${h.eur(K.hubraum_diesel, 2)}. On top comes CO2, taken from field V.7 under the WLTP test. Grams up to ${K.co2_frei_2021} g/km are free. Beyond that each band has its own rate, from ${h.eur(K.co2_stufen_2021[0][1], 2)} per gram for the first band to ${h.eur(K.co2_stufen_2021[5][1], 2)} above 195 g, and each rate applies only to the grams inside its band.</p>
<p>This is why large engines get expensive fast. A 2022 petrol car with ${h.num(2998)} cm³ and 214 g pays ${h.eur(gross.annual)} a year, of which ${h.eur(gross.lines[1].amount, 2)} is the CO2 part. People coming from countries where car tax is a flat fee often find the first notice for a big SUV or a pick-up a surprise. Check the figure before you buy, using our ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')}.</p>
<h3>Cars from 2009 to 2020</h3>
<p>Same engine charge, but a single CO2 rate of ${h.eur(K.co2_satz_2009)} per gram above a threshold that depends on the year: ${K.co2_frei_bis_2011} g for cars registered up to 2011, ${K.co2_frei_2012_2013} g for 2012 and 2013, ${K.co2_frei_ab_2014} g from 2014. A used diesel from this period is often cheaper to tax than a new one, but its engine charge still dominates; the ${h.a('kfz-steuer-diesel', 'diesel tax page')} compares both fuels.</p>

<h2>Vehicles taxed differently</h2>
<p>Fully electric cars first registered by the end of 2030 pay nothing for ten years, and the ${h.a('kfz-steuer-elektroauto', 'electric car tax page')} shows when that ends for your car. Hybrids are not covered: they are taxed like any petrol or diesel car. Motorbikes pay ${h.eur(K.krad_je_25ccm, 2)} per started 25 cm³, which gives ${h.eur(mot.annual)} for a ${h.num(689)} cm³ middleweight. Motorhomes and trailers are taxed by permitted total weight.</p>

<h2>Customs, not the Finanzamt</h2>
<p>Since July 2014 the federal customs administration has run vehicle tax. Your contact is the Hauptzollamt, the main customs office covering your home address. You never file a vehicle tax return yourself: the registration office passes your details and the bank mandate on, and Section 2(2) KraftStG makes the figures it enters binding on customs. The person liable is the registered keeper (Halter), which matters for company cars, leased cars and cars registered in a partner's name.</p>
<p>One consequence for imported cars: customs taxes whatever the registration office records. If the CO2 value or engine size on your new German certificate looks wrong, perhaps because a foreign document gave an NEDC figure instead of WLTP, raise it with the registration office (Zulassungsstelle), not with customs. A corrected certificate leads to a new tax assessment from the date of the change.</p>

<h2>Paying: the SEPA mandate</h2>
<p>At the registration office you sign a SEPA direct debit mandate; without it Section 13(1) KraftStG does not allow the car to be registered. The ${h.src('zoll', 'customs website')} confirms that the debit is taken on the due date, once a year and in advance. If you are new to Germany and still waiting for a local bank account, any SEPA account in your name or someone else's will do.</p>
<p>Instalments exist only for high bills. Above ${h.eur(S11.halbjahr_ab)} a year you may pay half-yearly, above ${h.eur(S11.vierteljahr_ab)} quarterly, each with a surcharge of 3 or 6 per cent (Section 11(2)). For the large petrol car above, two half-yearly payments would be ${h.eur(halb)} each.</p>
<h3>Rounding</h3>
<p>Every amount due is rounded down to the full euro (Section 11(5)). The 2024 petrol example works out at ${h.eur(neu.raw, 2)} and is billed at ${h.eur(neu.annual)}.</p>

<h2>When liability starts and stops</h2>
<p>It starts on the day of registration, even if the car stays in the garage. The notice arrives about two weeks later and covers the period up to the next due date, so the first amount is often not a full year. It stops on deregistration or, when you sell, on the day the buyer registers the car in their name. Until then you remain liable, so follow up with a private buyer. Moving within Germany does not change the notice; a change of address only has to be reported.</p>
<h2>Exemptions an expat may meet</h2>
<p>Section 3 KraftStG lists the cases where no tax is due. Three matter to people arriving from abroad. A private car registered in another country and brought in for a temporary stay is exempt for up to a year, but only until it has a regular base in Germany (No. 13). If your normal residence stays in another EU country, the EU rules on temporarily imported private vehicles can keep it tax-free in Germany (No. 12). Cars registered for accredited diplomatic and consular staff are exempt where the sending state grants the same in return (No. 10). For everyone else the tax applies from the day German plates go on.</p>

<h2>Buying or selling a used car</h2>
<p>When you buy, the re-registration counts as your tax declaration, and you sign a fresh SEPA mandate: customs asks for a new mandate whenever the person liable changes, not an edit of the seller's. Any exemption still running, such as an electric car's, passes to you. When you sell, your liability ends on the day the buyer registers the car; customs then sends a closing notice and refunds the balance. Hand over the car with a written sales contract that records date and time, because until the transfer you remain the keeper on file.</p>

<h2>Seasonal plates and several cars</h2>
<p>A Saisonkennzeichen, a seasonal plate valid for set months such as April to October, limits the tax to that period. Each day costs one 365th of the annual tax, with 29 February ignored in leap years (Section 11(4)). Customs may not align a seasonal car with your other vehicles. If you keep two or more cars registered all year, you can ask for one common due date instead; the gap is then charged by the day.</p>

<h2>Company cars and leasing</h2>
<p>With a company car or a leased car registered in the leasing company's name, the tax notice goes to the registered keeper, not to you. It is usually built into the leasing rate or paid by the employer. Only if the car is registered in your own name, as with some private leasing contracts, do you deal with the Hauptzollamt directly.</p>
<!--mini:kfz-->
<h2>Checking your bill</h2>
<p>Our calculator matched the ${h.src('bmfRechner', 'Federal Finance Ministry calculator')} to the euro in 21 cases tested on 11 October 2026. If your notice differs, the usual reasons are a part-year first period, a figure on the registration certificate that is not what you expected, or a relief such as the one for ${h.a('kfz-steuer-schwerbehinderung', 'severely disabled keepers')} that only applies after an application.</p>`,
  },
});
