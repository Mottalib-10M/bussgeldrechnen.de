import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pkw, type AltKlasse } from '../../lib/engine/kfzsteuer';
import { formatMoney } from '../../lib/format';

const K = P.kfz, A = K.alt_saetze;
/** § 9 Abs. 4 KraftStG : Jahressteuer für Oldtimer-Kennzeichen, nicht nur Krafträder (absent de params-2026.json). */
const H_KENNZEICHEN = 191.73;
/** § 13 Abs. 2 KraftStG : Rückstand, ab dem die Zulassung verweigert wird. */
const RUECKSTAND_MIN = 5;
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
const klassen: AltKlasse[] = ['euro3plus', 'euro2', 'euro1', 'ozonfrei', 'sonstige'];
const nameDe: Record<AltKlasse, string> = { euro3plus: 'Euro 3 und besser', euro2: 'Euro 2', euro1: 'Euro 1 (schadstoffarm)', ozonfrei: 'ohne Klasse, ozonfrei', sonstige: 'alle übrigen' };
const nameEn: Record<AltKlasse, string> = { euro3plus: 'Euro 3 and better', euro2: 'Euro 2', euro1: 'Euro 1 (low-emission)', ozonfrei: 'no class, exempt from ozone bans', sonstige: 'all others' };
const alt = (k: AltKlasse, fuel: 'benzin' | 'diesel', ccm: number) => pkw({ ez: '2004-05-01', fuel, ccm, co2: 0, altKlasse: k });
const BZ = 1598, DZ = 1896;
const e4 = alt('euro3plus', 'benzin', BZ), e4d = alt('euro3plus', 'diesel', DZ);
const oldie = pkw({ ez: '1986-04-01', fuel: 'benzin', ccm: 1997, co2: 0, altKlasse: 'sonstige' });
const ueB = pkw({ ez: '2009-02-01', fuel: 'benzin', ccm: 1998, co2: 150, altKlasse: 'euro3plus' });
const ueBa = pkw({ ez: '2008-10-01', fuel: 'benzin', ccm: 1998, co2: 150, altKlasse: 'euro3plus' });
const ueD = pkw({ ez: '2009-03-01', fuel: 'diesel', ccm: 1968, co2: 140, altKlasse: 'euro3plus' });
const jahre = ['2010-06-01', '2012-06-01', '2015-06-01', '2019-06-01'];
const b = (ez: string) => pkw({ ez, fuel: 'benzin', ccm: BZ, co2: 140 });
const d2 = alt('euro2', 'diesel', DZ);
const b11 = b(jahre[0]), b15 = b(jahre[2]);

export default defineGuide({
  id: 'kfz-steuer-altfahrzeuge',
  group: 'steuer',
  order: 60,
  mini: 'altauto',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer', 'kfz-steuer-diesel', 'umweltzone', 'tuev-kosten'],
  sources: ['kraftstg9', 'kraftstg', 'bmfRechner'],
  de: {
    slug: 'kfz-steuer-altfahrzeuge',
    nav: 'Kfz-Steuer Altfahrzeuge',
    card: 'Autos von vor Juli 2009 und von 2009 bis 2020: Sätze und Sonderfälle.',
    title: 'Kfz-Steuer Altfahrzeuge 2026: vor 2009 und bis Ende 2020',
    description: `Kfz-Steuer für ältere Autos 2026: vor Juli 2009 je 100 cm³ nach Schadstoffklasse, von ${eD(A.euro3plus[0], 2)} bis ${eD(A.sonstige[1], 2)}. Von 2009 bis 2020 gilt CO2 über ${K.co2_frei_bis_2011}, ${K.co2_frei_2012_2013} oder ${K.co2_frei_ab_2014} g.`,
    h1: 'Kfz-Steuer für ältere Autos: die Regeln vor 2021',
    intro: 'Wer ein Auto mit Erstzulassung vor 2021 fährt, zahlt nach einer von zwei älteren Formeln, und beim Jahrgang vor Juli 2009 zählt die Schadstoffklasse.',
    resume: `Für Pkw mit Erstzulassung bis zum 30. Juni 2009 berechnet sich die Kfz-Steuer nur nach Hubraum, aber mit einem Satz je angefangene 100 cm³, der von der Schadstoffklasse abhängt. Ein Benziner mit Euro 3 oder besser zahlt ${eD(A.euro3plus[0], 2)} je 100 cm³, ein Diesel ${eD(A.euro3plus[1], 2)}. Bei Euro 2 sind es ${eD(A.euro2[0], 2)} und ${eD(A.euro2[1], 2)}, bei Euro 1 ${eD(A.euro1[0], 2)} und ${eD(A.euro1[1], 2)}, ohne anerkannte Schadstoffminderung bis ${eD(A.sonstige[0], 2)} und ${eD(A.sonstige[1], 2)}. Ein Benziner mit 1 598 cm³ und Euro 4 kostet so ${eD(e4.annual)} im Jahr, ein Diesel mit 1 896 cm³ ${eD(e4d.annual)}. Für Erstzulassungen vom 1. Juli 2009 bis Ende 2020 gilt dagegen Hubraum plus ${eD(K.co2_satz_2009)} je Gramm CO2 über ${K.co2_frei_bis_2011} g (bis 2011), ${K.co2_frei_2012_2013} g (2012 und 2013) oder ${K.co2_frei_ab_2014} g (ab 2014). Autos, die zwischen dem 5. November 2008 und dem 30. Juni 2009 erstmals zugelassen wurden, zahlen nach § 18 Abs. 4a die günstigere der beiden Formeln. Für Oldtimer mit H-Kennzeichen gilt ein Festbetrag von ${eD(H_KENNZEICHEN, 2)}.`,
    faqs: [
      { q: 'Wie wird die Kfz-Steuer für ein Auto mit Erstzulassung vor Juli 2009 berechnet?', a: `Nur nach Hubraum, je angefangene 100 cm³, mit einem Satz nach Schadstoffklasse (§ 9 Abs. 1 Nr. 2 Buchst. a KraftStG). Der CO2-Wert spielt keine Rolle. Ein Benziner mit Euro 4 und 1 598 cm³ hat 16 Einheiten zu ${eD(A.euro3plus[0], 2)}, das sind ${eD(e4.annual)} im Jahr. Derselbe Hubraum ohne anerkannte Schadstoffminderung kostet ${eD(alt('sonstige', 'benzin', BZ).annual)}.` },
      { q: 'Was bedeutet ozonfrei bei der Kfz-Steuer für ältere Autos?', a: `Es bezeichnet Autos, die nicht als schadstoffarm anerkannt sind, für die aber kein Fahrverbot bei erhöhten Ozonwerten nach dem früheren § 40c Bundes-Immissionsschutzgesetz galt. Sie zahlen ${eD(A.ozonfrei[0], 2)} (Benzin) oder ${eD(A.ozonfrei[1], 2)} (Diesel) je 100 cm³. Wer auch das nicht erfüllt, fällt in die teuerste Stufe mit ${eD(A.sonstige[0], 2)} oder ${eD(A.sonstige[1], 2)}.` },
      { q: 'Lohnt sich ein H-Kennzeichen für die Kfz-Steuer?', a: `Bei großen und schmutzigen Motoren fast immer. Mit Oldtimer-Kennzeichen zahlt ein Pkw nach § 9 Abs. 4 KraftStG pauschal ${eD(H_KENNZEICHEN, 2)} im Jahr. Ein Benziner von 1986 mit 1 997 cm³ ohne Schadstoffklasse käme regulär auf ${eD(oldie.annual)}. Bei einem kleinen Auto mit Euro-Klasse kann der Festbetrag dagegen höher sein als die normale Steuer.` },
      { q: 'Warum zahlt ein Auto von 2011 weniger CO2-Steuer als eines von 2015?', a: `Weil die Freigrenze mit dem Jahr der Erstzulassung gesunken ist: ${K.co2_frei_bis_2011} g bis Ende 2011, ${K.co2_frei_2012_2013} g für 2012 und 2013, ${K.co2_frei_ab_2014} g ab 2014. Ein Benziner mit 1 598 cm³ und 140 g zahlt mit Erstzulassung 2010 ${eD(b11.annual)}, mit Erstzulassung 2015 ${eD(b15.annual)}. Die Grenze bleibt für das Auto dauerhaft gleich.` },
      { q: 'Welche Regel gilt für Autos mit Erstzulassung zwischen November 2008 und Juni 2009?', a: `Die günstigere von zwei Formeln. § 18 Abs. 4a KraftStG wendet nach Ablauf der damaligen Steuerbefreiung die CO2-Regel von 2009 an, wenn sie niedriger ist als die Steuer nach Schadstoffklasse. Ein Benziner vom Februar 2009 mit 1 998 cm³ und 150 g zahlt so ${eD(ueB.annual)} statt ${eD(ueBa.annual)}. Für Autos von vor dem 5.11.2008 gilt die Wahl nicht.` },
    ],
    body: (h) => `
<h2>Vor dem 1. Juli 2009: Hubraum mal Schadstoffklasse</h2>
<p>Für ältere Pkw kennt ${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 2 Buchst. a KraftStG')} keinen CO2-Anteil. Besteuert wird der Hubraum in angefangenen 100 cm³, aber mit fünf verschiedenen Sätzen. Welcher gilt, hängt davon ab, welche Abgasvorschriften das Auto erfüllt. Das Gesetz beschreibt die Stufen mit Verweisen auf alte EG-Richtlinien; vereinfacht entsprechen sie den Euro-Normen:</p>
${h.table(['Schadstoffklasse', 'Benzin je 100 cm³', 'Diesel je 100 cm³', `Benziner ${h.num(BZ)} cm³`, `Diesel ${h.num(DZ)} cm³`], klassen.map((k) => [nameDe[k], h.eur(A[k][0], 2), h.eur(A[k][1], 2), h.eur(alt(k, 'benzin', BZ).annual), h.eur(alt(k, 'diesel', DZ).annual)]), 'Pkw mit Erstzulassung bis 30.6.2009, § 9 Abs. 1 Nr. 2 Buchst. a KraftStG', ['l', 'r', 'r', 'r', 'r'])}
<p>Die Spanne ist groß. Ein Benziner ohne anerkannte Schadstoffminderung zahlt fast das Vierfache eines Euro-4-Benziners mit gleichem Hubraum. Beim Diesel ist schon die günstigste Stufe teurer als die Euro-1-Stufe beim Benziner. Der Hubraum steht in Feld P.1, die Schadstoffklasse ergibt sich aus der Emissionsschlüsselnummer in der Zulassungsbescheinigung.</p>

<h3>Was hinter den Stufen steht</h3>
<p>Die günstigste Stufe (Doppelbuchstabe aa) erreichen Autos, die die Grenzwerte der Zeile A der Richtlinie 70/220/EWG einhalten, praktisch Euro 3 und strenger, oder deren CO2-Ausstoß 90 g/km nicht übersteigt. Die zweite Stufe (bb) betrifft als schadstoffarm anerkannte Autos nach der Richtlinie 94/12/EG, also Euro 2. Die dritte (cc) umfasst schadstoffarme oder bedingt schadstoffarme Autos der Stufe C, für die kein Fahrverbot bei Ozonalarm galt, was meist Euro 1 entspricht. Die vierte (dd) erfasst Autos ohne Anerkennung als schadstoffarm, die aber von den früheren Ozon-Fahrverboten nach § 40c Bundes-Immissionsschutzgesetz ausgenommen waren. Alles andere fällt in die teuerste Stufe (ee).</p>
<p>Für einige sehr alte Typgenehmigungen von vor dem 11. Dezember 1999 bleibt nach § 18 Abs. 4 die frühere Fassung von § 9 anwendbar. Solche Sonderfälle prüft man am sichersten mit dem ${h.src('bmfRechner', 'Rechner des Bundesfinanzministeriums')}, mit dem unser Rechner in den getesteten Fällen mit Euro 1, 2 und 3 übereinstimmte.</p>

<h3>Ein Beispiel Schritt für Schritt</h3>
<p>Ein Diesel von 2001 mit Euro 2 und ${h.num(DZ)} cm³ hat 19 angefangene Einheiten zu 100 cm³. Mit ${h.eur(A.euro2[1], 2)} je Einheit ergibt das ${h.eur(d2.raw, 2)}, nach § 11 Abs. 5 abgerundet ${h.eur(d2.annual)}. Ein Halterwechsel ändert daran nichts, denn die Schadstoffklasse gehört zum Fahrzeug. Auch das Alter senkt die Steuer nicht: Ein Auto von 1998 mit Euro 2 zahlt denselben Satz wie eines von 2003 mit derselben Klasse.</p>

<h2>Nachrüstung und Umschlüsselung</h2>
<p>Viele Altfahrzeuge wurden in den Neunziger- und Nullerjahren mit Katalysator oder Partikelfilter nachgerüstet und dadurch in eine bessere Klasse eingestuft. Maßgeblich ist allein, was die Zulassungsstelle eingetragen hat; ihre Feststellungen zu den Schadstoffemissionen sind für den Zoll verbindlich (§ 2 Abs. 2 Nr. 2). Wird eine Nachrüstung heute eingetragen und ändert sich dadurch die Steuer, beginnt die neue Steuerpflicht mit der Änderung, spätestens mit der Aushändigung der geänderten Zulassungsbescheinigung (§ 5 Abs. 3). Der Unterschied zwischen zwei Stufen kann bei einem großen Diesel mehrere Hundert Euro im Jahr ausmachen.</p>
<p>Ein historischer Zuschlag spielt heute keine Rolle mehr: § 9a erhöhte die Steuer für Diesel ohne Partikelminderungsstufe nur von April 2007 bis März 2011. Wer in alten Bescheiden einen solchen Posten findet, muss ihn für die aktuelle Steuer nicht mehr berücksichtigen.</p>
<!--mini:altauto-->
<h2>Der Übergang Ende 2008: § 18 Abs. 4a</h2>
<p>Für Autos, die zwischen dem 5. November 2008 und dem 30. Juni 2009 erstmals zugelassen wurden, gab es damals eine befristete Steuerbefreiung nach § 10a KraftStG, die spätestens Ende 2010 auslief. Für die Zeit danach bestimmt § 18 Abs. 4a: Es gilt die CO2-Regel für Erstzulassungen ab Juli 2009, wenn sie eine niedrigere Steuer ergibt als die Schadstoffklassen-Regel. Diese Autos zahlen also die günstigere von zwei Formeln.</p>
<p>Ein Benziner vom Februar 2009 mit ${h.num(1998)} cm³, Euro 4 und 150 g zahlt nach Schadstoffklasse rechnerisch ${h.eur(ueBa.annual)}, nach der neuen Regel ${h.eur(ueB.annual)}, und der Zoll setzt ${h.eur(ueB.annual)} fest. Beim Diesel vom März 2009 mit ${h.num(1968)} cm³ und 140 g sind es ${h.eur(ueD.annual)}. Ein baugleiches Auto mit Erstzulassung im Oktober 2008 bekommt diese Wahl nicht und zahlt ${h.eur(ueBa.annual)}. Ausgenommen sind außerdem die Fälle des § 10a Abs. 3, also ältere Autos, die damals nur über eine Halterregel begünstigt waren.</p>

<h2>Juli 2009 bis Dezember 2020: eine CO2-Freigrenze je Jahrgang</h2>
<p>Für diese Jahrgänge gilt der heutige Hubraumsatz, ${h.eur(K.hubraum_benzin)} beim Benziner und ${h.eur(K.hubraum_diesel, 2)} beim Diesel je angefangene 100 cm³, plus ${h.eur(K.co2_satz_2009)} für jedes Gramm CO2 über einer Freigrenze. Die Grenze hängt am Jahr der Erstzulassung und bleibt für das Auto für immer gleich:</p>
${h.table(['Erstzulassung', 'CO2-Freigrenze', `Benziner ${h.num(BZ)} cm³, 140 g`], jahre.map((ez) => [ez.slice(0, 4), `${ez <= '2011-12-31' ? K.co2_frei_bis_2011 : ez <= '2013-12-31' ? K.co2_frei_2012_2013 : K.co2_frei_ab_2014} g/km`, h.eur(b(ez).annual)]), '§ 9 Abs. 1 Nr. 2 Buchst. b KraftStG, gleiches Auto, verschiedene Jahrgänge', ['l', 'r', 'r'])}
<p>Zwei baugleiche Autos können sich also nur durch den Tag der Erstzulassung unterscheiden. Beim Gebrauchtkauf lohnt deshalb ein Blick auf Feld B: Ein Auto vom Dezember 2011 hat dauerhaft eine um 25 g höhere Freigrenze als eines vom Januar 2014.</p>
<p>Für Erstzulassungen vor dem 1. September 2018 legt § 18 Abs. 5 fest, nach welcher Messvorschrift der CO2-Wert gilt: Es ist der Wert nach dem älteren Prüfzyklus, der meist niedriger ausfällt als die heutigen WLTP-Werte. Bei diesen Autos wird also nicht nachträglich neu gemessen; es bleibt bei dem Wert, der in der Zulassungsbescheinigung steht.</p>

<h2>Stilllegen und wieder zulassen</h2>
<p>Altfahrzeuge stehen oft monatelang in der Garage. Wer abmeldet, beendet die Steuerpflicht am Tag der Außerbetriebsetzung und bekommt den im Voraus gezahlten Rest anteilig zurück. Bei der Wiederzulassung beginnt eine neue Steuerpflicht, nach § 5 Abs. 1 Nr. 1 für mindestens einen Monat. Die Schadstoffklasse bleibt dabei erhalten, sie ist in den Fahrzeugdaten gespeichert. Voraussetzung für jede neue Zulassung ist nach § 13 Abs. 2 KraftStG, dass beim Halter keine Kfz-Steuerrückstände von ${h.eur(RUECKSTAND_MIN)} oder mehr bestehen; offene Beträge aus früheren Bescheiden sollten also vorher beglichen sein.</p>

<h2>Oldtimer: der Festbetrag</h2>
<p>Für Autos mit Oldtimer-Kennzeichen, dem H-Kennzeichen, gilt die ganze Rechnung nicht. § 1 Abs. 1 Nr. 4 KraftStG macht die Zuteilung des Kennzeichens zum Steuergegenstand, und § 9 Abs. 4 setzt ${h.eur(H_KENNZEICHEN, 2)} im Jahr fest, unabhängig von Hubraum und Abgas. Ein Benziner von 1986 mit ${h.num(1997)} cm³ ohne Schadstoffklasse zahlt regulär ${h.eur(oldie.annual)}; mit H-Kennzeichen spart er mehr als die Hälfte. Bei einem kleinen Euro-1-Auto kann der Festbetrag dagegen teurer sein. Die Voraussetzungen für das H-Kennzeichen regelt das Zulassungsrecht, mit einem Gutachten über den Erhaltungszustand.</p>

<p>Denselben Festbetrag zahlen nach § 9 Abs. 4 rote Kennzeichen, die die Zulassungsbehörde zur wiederkehrenden Verwendung ausgibt, etwa für Sammler, die mehrere Fahrzeuge abwechselnd bewegen. Für Fahrzeuge mit Saisonkennzeichen, die kein H-Kennzeichen haben, bleibt es dagegen bei der normalen Rechnung, nur zeitlich begrenzt: Ein Liebhaberauto, das nur von April bis September zugelassen ist, zahlt je Tag ein Dreihundertfünfundsechzigstel der Jahressteuer nach Schadstoffklasse. Bei einem großen Motor ohne Klasse kann das H-Kennzeichen trotzdem günstiger sein als die halbe Jahressteuer.</p>

<h2>Umweltzone, HU und Kosten im Alltag</h2>
<p>Bei alten Autos ist die Steuer oft nicht der größte Kostenpunkt. In vielen Städten entscheidet die Feinstaubplakette darüber, ob ein Auto überhaupt in die Innenstadt darf, und diese Plakette folgt anderen Regeln als die Steuerklassen. Was in der ${h.a('umweltzone', 'Umweltzone')} gilt, steht auf einer eigenen Seite, die Prüfgebühren der Hauptuntersuchung unter ${h.a('tuev-kosten', 'TÜV-Kosten')}. Für die Steuer selbst gelten die allgemeinen Regeln zu Bescheid, Zahlung und Abmeldung, beschrieben auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')}. Den Betrag für Ihre Schadstoffklasse zeigt der ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')}; beim Diesel lohnt außerdem der Vergleich auf der Seite zur ${h.a('kfz-steuer-diesel', 'Diesel-Steuer')}.</p>`,
  },
  en: {
    slug: 'older-car-tax-germany',
    nav: 'Older car tax',
    card: 'Cars from before July 2009 and from 2009 to 2020: rates and special cases.',
    title: 'Older Car Tax Germany 2026: Pre-2009 and 2009-2020 Rules',
    description: `Older car tax in Germany 2026: before July 2009 charged per 100 cm³ by emission class, ${eE(A.euro3plus[0], 2)} to ${eE(A.sonstige[1], 2)}; 2009-2020 cars pay CO2 above ${K.co2_frei_bis_2011}, ${K.co2_frei_2012_2013} or ${K.co2_frei_ab_2014} g.`,
    h1: 'Tax on older cars in Germany: the rules before 2021',
    intro: 'A car first registered before 2021 is taxed under one of two older formulas, and for pre-July 2009 cars the emission class decides.',
    resume: `Cars first registered up to 30 June 2009 pay German vehicle tax on engine size only, per started 100 cm³, at a rate set by their emission class. A petrol car meeting Euro 3 or better pays ${eE(A.euro3plus[0], 2)} per 100 cm³ and a diesel ${eE(A.euro3plus[1], 2)}; Euro 2 cars pay ${eE(A.euro2[0], 2)} or ${eE(A.euro2[1], 2)}, Euro 1 cars ${eE(A.euro1[0], 2)} or ${eE(A.euro1[1], 2)}, and cars with no recognised emission reduction up to ${eE(A.sonstige[0], 2)} or ${eE(A.sonstige[1], 2)}. A 1,598 cm³ Euro 4 petrol car costs ${eE(e4.annual)} a year; a 1,896 cm³ Euro 4 diesel ${eE(e4d.annual)}. Cars first registered from July 2009 to the end of 2020 pay the current engine rate plus ${eE(K.co2_satz_2009)} per gram of CO2 above ${K.co2_frei_bis_2011} g if registered up to 2011, ${K.co2_frei_2012_2013} g in 2012 and 2013, or ${K.co2_frei_ab_2014} g from 2014. Cars registered between 5 November 2008 and 30 June 2009 pay whichever of the two formulas is cheaper. A classic car on an H plate pays a flat ${eE(H_KENNZEICHEN, 2)}.`,
    faqs: [
      { q: 'How is tax worked out for a car registered before July 2009 in Germany?', a: `On engine size alone, in started 100 cm³ blocks, at a rate that depends on the emission class (Section 9(1) No. 2(a) KraftStG). CO2 plays no part. A 1,598 cm³ Euro 4 petrol car has 16 blocks at ${eE(A.euro3plus[0], 2)}, giving ${eE(e4.annual)} a year; the same engine with no recognised emission reduction pays ${eE(alt('sonstige', 'benzin', BZ).annual)}.` },
      { q: 'Is an H plate worth it for vehicle tax on a classic car in Germany?', a: `For large engines without an emission class, usually yes. A car on a historic plate pays a flat ${eE(H_KENNZEICHEN, 2)} a year under Section 9(4) KraftStG, whatever the engine. A 1986 petrol car with 1,997 cm³ and no class would otherwise pay ${eE(oldie.annual)}. A small car with a Euro class can pay less on the normal scale, so compare both figures first.` },
      { q: 'Why does my 2011 car pay less CO2 tax than a 2015 one?', a: `The CO2 allowance depends on the year of first registration and stays fixed for the car: ${K.co2_frei_bis_2011} g/km up to 2011, ${K.co2_frei_2012_2013} g for 2012 and 2013, ${K.co2_frei_ab_2014} g from 2014. A 1,598 cm³ petrol car with 140 g pays ${eE(b11.annual)} if first registered in 2010 and ${eE(b15.annual)} if first registered in 2015, with identical engines.` },
      { q: 'What is the special rule for cars first registered in late 2008 and early 2009?', a: `Cars first registered between 5 November 2008 and 30 June 2009 pay the lower of two amounts: the emission-class tax or the 2009 CO2 formula (Section 18(4a) KraftStG). A February 2009 petrol car with 1,998 cm³ and 150 g therefore pays ${eE(ueB.annual)} instead of ${eE(ueBa.annual)}. A twin first registered in October 2008 gets no such choice.` },
    ],
    body: (h) => `
<h2>Before July 2009: engine size times emission class</h2>
<p>For older cars, ${h.src('kraftstg9', 'Section 9(1) No. 2(a) KraftStG')} has no CO2 element. It charges per started 100 cm³ of engine size at one of five rates, chosen by the emissions rules the car meets. The law describes the classes by reference to old EC directives; in everyday terms they line up with the Euro standards:</p>
${h.table(['Emission class', 'Petrol per 100 cm³', 'Diesel per 100 cm³', `Petrol ${h.num(BZ)} cm³`, `Diesel ${h.num(DZ)} cm³`], klassen.map((k) => [nameEn[k], h.eur(A[k][0], 2), h.eur(A[k][1], 2), h.eur(alt(k, 'benzin', BZ).annual), h.eur(alt(k, 'diesel', DZ).annual)]), 'Cars first registered up to 30 June 2009, Section 9(1) No. 2(a) KraftStG', ['l', 'r', 'r', 'r', 'r'])}
<p>The range is wide: a petrol car with no recognised emission reduction pays almost four times as much as a Euro 4 car with the same engine, and even the cheapest diesel rate is higher than most petrol rates. Engine size is in field P.1 of the registration certificate; the class follows from the emission key number recorded there.</p>
<h3>What the classes mean</h3>
<p>The cheapest rate (aa) applies to cars meeting the limits in row A of Directive 70/220/EEC, in practice Euro 3 or stricter, or emitting no more than 90 g of CO2 per km. The second (bb) covers cars recognised as low-emission under Directive 94/12/EC, which is Euro 2. The third (cc) covers low-emission or conditionally low-emission cars of stage C that were exempt from ozone-alert driving bans, broadly Euro 1. The fourth (dd) is for cars not recognised as low-emission but likewise exempt from those old ozone bans under the former Section 40c of the Federal Immission Control Act. Everything else pays the top rate (ee).</p>
<p>A few very old type approvals from before 11 December 1999 keep the earlier version of Section 9 under Section 18(4). For such cases the ${h.src('bmfRechner', 'Finance Ministry calculator')} is the safest check; our calculator matched it in the Euro 1, 2 and 3 cases we tested.</p>

<h3>A worked example</h3>
<p>Take a 2001 Euro 2 diesel with ${h.num(DZ)} cm³. That is 19 started blocks of 100 cm³; at ${h.eur(A.euro2[1], 2)} each the total is ${h.eur(d2.raw, 2)}, rounded down to ${h.eur(d2.annual)} under Section 11(5). Age brings no discount, and a change of owner changes nothing, because the class belongs to the car. A 1998 car and a 2003 car with the same class and engine pay exactly the same.</p>

<h2>Importing an older car</h2>
<p>People who move to Germany with a car they have owned for years are often surprised by the bill for a pre-2009 diesel. The rate depends on what the German registration office records as the emission class, and Section 2(2) KraftStG makes that record binding on customs. If the foreign papers do not prove the Euro standard, the office may only enter a worse class, and the tax follows. Bring the certificate of conformity or a manufacturer's confirmation. For a 1,896 cm³ diesel, the step from Euro 3 to the no-class rate means ${h.eur(alt('sonstige', 'diesel', DZ).annual - e4d.annual)} more a year.</p>
<p>If a retrofit, such as a particle filter or a catalytic converter, is entered later and lowers the tax, the new amount applies from the change or, at the latest, from the day you receive the amended certificate (Section 5(3)). A historical diesel surcharge under Section 9a ran only from April 2007 to March 2011 and has no effect today.</p>
<!--mini:altauto-->
<h2>Late 2008 to mid-2009: the cheaper of two</h2>
<p>Cars first registered between 5 November 2008 and 30 June 2009 had a temporary exemption at the time (Section 10a), which ended by 2010 at the latest. Afterwards Section 18(4a) applies the CO2 rule for post-July 2009 cars whenever it gives a lower figure than the emission-class rule. A February 2009 petrol car with ${h.num(1998)} cm³, Euro 4 and 150 g would pay ${h.eur(ueBa.annual)} by class but pays ${h.eur(ueB.annual)} under the CO2 rule. A March 2009 diesel with ${h.num(1968)} cm³ and 140 g pays ${h.eur(ueD.annual)}. The same model registered in October 2008 stays at the class rate. Cars that only benefited through the keeper rule of Section 10a(3) are excluded from this choice.</p>

<h2>July 2009 to December 2020: one CO2 allowance per year</h2>
<p>These cars pay today's engine rate, ${h.eur(K.hubraum_benzin)} per started 100 cm³ for petrol and ${h.eur(K.hubraum_diesel, 2)} for diesel, plus ${h.eur(K.co2_satz_2009)} for every gram of CO2 above an allowance fixed by the year of first registration:</p>
${h.table(['First registered', 'CO2 allowance', `Petrol ${h.num(BZ)} cm³, 140 g`], jahre.map((ez) => [ez.slice(0, 4), `${ez <= '2011-12-31' ? K.co2_frei_bis_2011 : ez <= '2013-12-31' ? K.co2_frei_2012_2013 : K.co2_frei_ab_2014} g/km`, h.eur(b(ez).annual)]), 'Section 9(1) No. 2(b) KraftStG, same car, different first registration years', ['l', 'r', 'r'])}
<p>Two identical cars can therefore pay different tax for life, just because one was first registered in December 2011 and the other in January 2014. When buying used, check field B before agreeing a price.</p>
<p>For cars first registered before 1 September 2018, Section 18(5) fixes which test procedure the CO2 figure comes from: the older cycle, which usually gives lower values than today's WLTP test. Nobody re-measures these cars; the figure on the certificate stays.</p>

<h2>Laying up an older car</h2>
<p>If the car will sit unused for a long spell, deregistering it ends the tax on that day and customs refunds the unused part. Registering it again starts a new liability of at least one month (Section 5(1) No. 1), and the emission class carries over because it is stored with the vehicle data. Under Section 13(2) KraftStG the registration office will not register a vehicle for anyone with vehicle tax arrears of ${h.eur(RUECKSTAND_MIN)} or more, so settle any open amount from an earlier notice first. That rule also catches people returning to Germany after years abroad.</p>

<h2>Classic cars on an H plate</h2>
<p>A historic plate (H-Kennzeichen) replaces the whole calculation with a flat amount. Section 1(1) No. 4 KraftStG makes the plate itself taxable and Section 9(4) sets ${h.eur(H_KENNZEICHEN, 2)} a year, regardless of engine and emissions. A 1986 petrol car with ${h.num(1997)} cm³ and no emission class pays ${h.eur(oldie.annual)} on the normal scale, so the plate saves more than half. For a small Euro 1 car the flat rate can be the dearer option. Eligibility, including an expert report on the car's condition, is a matter of registration law.</p>

<p>The same flat amount applies to red plates issued for recurring use, which collectors use to move several vehicles in turn (Section 9(4)). A summer car on a seasonal plate without an H plate is still taxed by class, but only for the months on the plate, at one 365th of the annual amount per day. For a large engine with no class, the H plate can still beat half a year at the class rate, so it is worth doing both sums.</p>

<h2>Beyond the tax bill</h2>
<p>With older cars, tax is rarely the only issue. Many German cities have low emission zones where the particulate sticker decides whether you may drive in at all; it follows different rules from the tax classes, explained on the ${h.a('umweltzone', 'low emission zone page')}. Roadworthiness test fees are on the ${h.a('tuev-kosten', 'TÜV cost page')}. Notices, payment and refunds work as described in the ${h.a('kfz-steuer', 'vehicle tax overview')}, and the ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')} handles every class. For diesels, compare the figures on the ${h.a('kfz-steuer-diesel', 'diesel tax page')}.</p>`,
  },
});
