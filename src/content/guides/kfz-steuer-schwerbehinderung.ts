import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pkw, elektro, schwerbehindert, type TaxResult } from '../../lib/engine/kfzsteuer';
import { entry } from '../../lib/engine/bkat';
import { formatMoney, formatPercent } from '../../lib/format';

const K = P.kfz;
const eD = (x: number, d = 0) => formatMoney(x, d, 'de'), eE = (x: number, d = 0) => formatMoney(x, d, 'en');
const pD = formatPercent(K.schwerbehindert_ermaessigung, 0, 'de'), pE = formatPercent(K.schwerbehindert_ermaessigung, 0, 'en');
const b24 = pkw({ ez: '2024-04-01', fuel: 'benzin', ccm: 1498, co2: 118 });
const d23 = pkw({ ez: '2023-05-01', fuel: 'diesel', ccm: 1968, co2: 145 });
const b16 = pkw({ ez: '2016-09-01', fuel: 'benzin', ccm: 1598, co2: 129 });
const d06 = pkw({ ez: '2006-03-01', fuel: 'diesel', ccm: 1896, co2: 0, altKlasse: 'euro3plus' });
const ev = elektro('2014-01-01', 2232, 2026);
const halb = (r: TaxResult) => schwerbehindert(r, 'halb').annual;
const frei = (r: TaxResult) => schwerbehindert(r, 'befreit').annual;
const parken = entry('55');

export default defineGuide({
  id: 'kfz-steuer-schwerbehinderung',
  group: 'steuer',
  order: 70,
  mini: 'schwerbehindert',
  miniHref: 'kfz-steuer-rechner',
  related: ['kfz-steuer-rechner', 'kfz-steuer', 'kfz-steuer-elektroauto', 'falschparken', 'kfz-steuer-diesel'],
  sources: ['kraftstg3a', 'kraftstg', 'zoll'],
  de: {
    slug: 'kfz-steuer-schwerbehinderung',
    nav: 'Kfz-Steuer Schwerbehinderung',
    card: 'Befreiung mit H, Bl oder aG, halbe Steuer mit orangem Ausweis.',
    title: 'Kfz-Steuer Schwerbehinderung 2026: Befreiung, halbe Steuer',
    description: `Kfz-Steuer bei Schwerbehinderung 2026: befreit mit H, Bl oder aG, ${pD} weniger mit orangem Ausweis ohne Freifahrt. Ein Diesel mit ${eD(d23.annual)} zahlt dann ${eD(halb(d23))}.`,
    h1: 'Kfz-Steuer bei Schwerbehinderung: Befreiung oder halbe Steuer',
    intro: 'Schwerbehinderte Halter können die Kfz-Steuer ganz oder zur Hälfte sparen, für ein Fahrzeug und nur auf Antrag.',
    resume: `Nach § 3a KraftStG ist ein Fahrzeug von der Kfz-Steuer befreit, solange es für einen schwerbehinderten Menschen zugelassen ist, der im Schwerbehindertenausweis das Merkzeichen H (hilflos), Bl (blind) oder aG (außergewöhnlich gehbehindert) hat. Die Steuer halbiert sich, wenn der Ausweis den orangefarbenen Flächenaufdruck trägt, weil die Voraussetzungen des § 228 Abs. 1 Satz 1 SGB IX erfüllt sind; die Ermäßigung gibt es aber nicht, solange die Person die unentgeltliche Beförderung im Nahverkehr in Anspruch nimmt. Beide Vergünstigungen gelten nur für ein Fahrzeug und nur auf schriftlichen Antrag beim Hauptzollamt. Sie entfallen, wenn das Auto für Gütertransporte, für bezahlte Personenbeförderung oder von anderen Personen für Fahrten genutzt wird, die nichts mit der Fortbewegung oder dem Haushalt der behinderten Person zu tun haben. Ein Diesel von 2023 mit ${eD(d23.annual)} Jahressteuer kostet mit orangem Ausweis ${eD(halb(d23))}, mit Merkzeichen aG nichts.`,
    faqs: [
      { q: 'Welche Merkzeichen befreien ganz von der Kfz-Steuer?', a: 'Die Merkzeichen H (hilflos), Bl (blind) und aG (außergewöhnlich gehbehindert) im Schwerbehindertenausweis. § 3a Abs. 1 KraftStG befreit dann das Halten eines Kraftfahrzeugs, solange es für diese Person zugelassen ist. Andere Merkzeichen führen höchstens zur halben Steuer, wenn der Ausweis den orangefarbenen Flächenaufdruck trägt. Die Befreiung gilt für ein Fahrzeug und muss schriftlich beantragt werden.' },
      { q: 'Bekomme ich die halbe Kfz-Steuer und trotzdem die Freifahrt im Nahverkehr?', a: `Nein, beides zugleich geht nicht. § 3a Abs. 2 KraftStG gewährt die Ermäßigung um ${pD} nicht, solange die schwerbehinderte Person das Recht zur unentgeltlichen Beförderung nach § 228 SGB IX in Anspruch nimmt. Man muss sich entscheiden. Bei einem Diesel mit ${eD(d23.annual)} Jahressteuer bringt die Ermäßigung ${eD(d23.annual - halb(d23))} im Jahr, bei einem kleinen Benziner deutlich weniger.` },
      { q: 'Darf mein Partner das steuerbefreite Auto allein fahren?', a: 'Ja, aber nur für bestimmte Fahrten. § 3a Abs. 3 KraftStG lässt die Vergünstigung entfallen, wenn andere Personen das Fahrzeug für Fahrten nutzen, die nicht mit der Fortbewegung oder der Haushaltsführung der behinderten Person zusammenhängen. Der Einkauf für den gemeinsamen Haushalt oder das Abholen vom Arzt sind erfasst, die Fahrt zur eigenen Arbeit in der Regel nicht.' },
      { q: 'Muss das Auto auf den schwerbehinderten Menschen zugelassen sein?', a: 'Ja. § 3a KraftStG begünstigt Fahrzeuge, solange sie für die schwerbehinderte Person zugelassen sind. Ist das Auto auf Ehepartner, Kind oder Betreuer zugelassen, greift die Vergünstigung nach dem Wortlaut nicht. Wer ein Auto auf sich umschreibt, um die Befreiung zu nutzen, stellt bei der Zulassung den Antrag mit; nach § 12a Abs. 6 genügt dort ein entsprechender Hinweis.' },
      { q: 'Wo beantrage ich die Kfz-Steuerbefreiung wegen Schwerbehinderung?', a: 'Beim zuständigen Hauptzollamt, schriftlich und unter Angabe der Gründe, so verlangt es § 12a Abs. 4 KraftStG. Bei einer Neuzulassung genügt ein Hinweis in der Steuererklärung, die bei der Zulassungsstelle abgegeben wird. Beizufügen ist der Nachweis über den Ausweis. Fallen die Voraussetzungen später weg, muss das dem Hauptzollamt unverzüglich schriftlich angezeigt werden (§ 12a Abs. 5).' },
    ],
    body: (h) => `
<h2>Zwei Stufen der Vergünstigung</h2>
<p>${h.src('kraftstg3a', '§ 3a KraftStG')} kennt zwei Stufen. Die volle Befreiung nach Absatz 1 erhalten schwerbehinderte Menschen, die mit ihrem Ausweis nachweisen, dass sie hilflos, blind oder außergewöhnlich gehbehindert sind: Merkzeichen H, Bl oder aG. Die Ermäßigung um ${h.pct(K.schwerbehindert_ermaessigung, 0)} nach Absatz 2 erhalten Menschen, deren Ausweis den orangefarbenen Flächenaufdruck trägt, weil sie die Voraussetzungen des § 228 Abs. 1 Satz 1 SGB IX erfüllen. Das sind in der Regel Ausweise mit Merkzeichen G oder Gl. Der Grad der Behinderung allein genügt nicht, es kommt auf Merkzeichen und Aufdruck an.</p>
<p>Wer zur zweiten Gruppe gehört, muss wählen. Solange die Person die unentgeltliche Beförderung im öffentlichen Personenverkehr nach § 228 SGB IX nutzt, gibt es keine Steuerermäßigung. Bei der ersten Gruppe besteht dieser Ausschluss nicht: Die volle Befreiung gilt unabhängig von der Freifahrt.</p>

<h2>Was das für typische Autos bedeutet</h2>
${h.table(['Fahrzeug', 'Normal', `Orange, ${h.pct(K.schwerbehindert_ermaessigung, 0)} weniger`, 'H, Bl, aG'], [
  [`Benziner 2024, ${h.num(1498)} cm³, 118 g`, h.eur(b24.annual), h.eur(halb(b24)), h.eur(frei(b24))],
  [`Benziner 2016, ${h.num(1598)} cm³, 129 g`, h.eur(b16.annual), h.eur(halb(b16)), h.eur(frei(b16))],
  [`Diesel 2023, ${h.num(1968)} cm³, 145 g`, h.eur(d23.annual), h.eur(halb(d23)), h.eur(frei(d23))],
  [`Diesel 2006, Euro 4, ${h.num(1896)} cm³`, h.eur(d06.annual), h.eur(halb(d06)), h.eur(frei(d06))],
  [`Elektroauto nach der Befreiung, ${h.num(2232)} kg`, h.eur(ev.annual), h.eur(halb(ev)), h.eur(frei(ev))],
], 'Jahressteuer nach § 9 und § 3a KraftStG, abgerundet auf volle Euro', ['l', 'r', 'r', 'r'])}
<p>Die Halbierung setzt auf die Steuer auf, die sich ohne Vergünstigung ergäbe, und abgerundet wird erst am Ende. Beim Elektroauto, das nach Ablauf seiner eigenen Befreiung schon die halbe Gewichtssteuer zahlt, halbiert sich der Betrag also noch einmal. Wie sich die Normalsteuer zusammensetzt, erklären die Seiten zum ${h.a('kfz-steuer-diesel', 'Diesel')} und zum ${h.a('kfz-steuer-elektroauto', 'Elektroauto')}.</p>

<h2>Nur ein Fahrzeug, nur auf Antrag</h2>
<p>§ 3a Abs. 3 begrenzt die Vergünstigung auf ein Fahrzeug. Wer zwei Autos hält, wählt eines aus; das zweite zahlt die volle Steuer. Außerdem gibt es die Vergünstigung nur auf schriftlichen Antrag. Sie wird nicht automatisch gewährt, nur weil die Behörde vom Ausweis weiß. Der Antrag geht nach § 12a Abs. 4 an das Hauptzollamt und nennt die Gründe. Bei einer Neuzulassung genügt nach § 12a Abs. 6 ein entsprechender Hinweis in der Steuererklärung, die bei der Zulassungsstelle abgegeben wird.</p>
<p>Der Antrag ist rechtlich eine Steuererklärung im Sinne von § 150 der Abgabenordnung, das sagt § 12a Abs. 4 ausdrücklich. Die Angaben darin sollten also vollständig und richtig sein: welches Fahrzeug begünstigt werden soll, welches Merkzeichen oder welcher Aufdruck vorliegt und, bei der halben Steuer, dass keine Freifahrt in Anspruch genommen wird. Eine Kopie des Ausweises gehört dazu. Wer ein Fahrzeug mit Kennzeichen schon länger hält, stellt den Antrag direkt beim Hauptzollamt; die Steuer ändert sich dann nach § 5 Abs. 3 mit dem Antrag.</p>
<p>Das Fahrzeug muss für die schwerbehinderte Person zugelassen sein, also auf ihren Namen. Ein Auto, das auf den Ehepartner läuft und mit dem die behinderte Person gefahren wird, ist nach dem Wortlaut nicht begünstigt. Wer die Vergünstigung nutzen will, lässt das Auto deshalb auf die berechtigte Person zu. Der Nachweis ist der Schwerbehindertenausweis nach dem Neunten Buch Sozialgesetzbuch; ältere Ausweise nach dem Gesetz über die unentgeltliche Beförderung Schwerbehinderter von 1979 nennt das Gesetz ausdrücklich mit.</p>
<!--mini:schwerbehindert-->
<h2>Wofür das Auto genutzt werden darf</h2>
<p>Die Vergünstigung entfällt nach § 3a Abs. 3, sobald das Fahrzeug für eine von drei Nutzungen eingesetzt wird:</p>
<ul>
<li>zur Beförderung von Gütern, ausgenommen Handgepäck;</li>
<li>zur entgeltlichen Beförderung von Personen, ausgenommen die gelegentliche Mitnahme;</li>
<li>durch andere Personen für Fahrten, die nicht mit der Fortbewegung oder der Haushaltsführung der behinderten Person zusammenhängen.</li>
</ul>
<p>Der dritte Punkt ist im Alltag der wichtigste. Angehörige dürfen das Auto fahren, wenn sie die behinderte Person zum Arzt bringen, für ihren Haushalt einkaufen oder sie von der Arbeit abholen. Die Fahrt des Partners zur eigenen Arbeitsstelle oder in den eigenen Urlaub gehört nicht dazu. Eine gelegentliche zweckfremde Nutzung hat eine klar geregelte Folge: Nach § 5 Abs. 2 KraftStG wird die Steuer für die Dauer dieser Nutzung fällig, mindestens für einen Monat, auch bei der halben Steuer.</p>

<h2>Freifahrt oder halbe Steuer: eine Rechnung</h2>
<p>Für Menschen mit orangefarbenem Ausweis ist die Wahl eine einfache Gegenüberstellung. Auf der einen Seite steht die Steuerersparnis: Beim Diesel von 2023 sind es ${h.eur(d23.annual - halb(d23))} im Jahr, beim Benziner von 2024 nur ${h.eur(b24.annual - halb(b24))}. Auf der anderen Seite steht der Wert der unentgeltlichen Beförderung im Nahverkehr, abzüglich dessen, was dafür selbst zu zahlen ist. Wer selten Bus und Bahn nutzt und ein Auto mit hoher Steuer fährt, kommt mit der Ermäßigung meist besser weg. Wer ein kleines, sparsames Auto hat und regelmäßig pendelt, mit der Freifahrt.</p>

<h2>Welche Fahrzeuge begünstigt sind</h2>
<p>§ 3a spricht von Kraftfahrzeugen. Begünstigt sind also nicht nur Pkw, sondern auch Motorräder und Wohnmobile, solange sie für die schwerbehinderte Person zugelassen sind. Anhänger sind nach § 2 Abs. 1 KraftStG keine Kraftfahrzeuge, sondern eine eigene Fahrzeugart, und fallen nicht unter die Vergünstigung. Bei einem Elektroauto spielt § 3a erst eine Rolle, wenn die eigene Befreiung nach § 3d abgelaufen ist; vorher ist ohnehin keine Steuer fällig.</p>

<h2>Leasing, Firmenwagen und Mitfahrten</h2>
<p>Ein geleastes Auto ist meist auf die Leasinggesellschaft zugelassen, ein Firmenwagen auf das Unternehmen. Nach dem Wortlaut des § 3a ist ein solches Fahrzeug nicht für die schwerbehinderte Person zugelassen und damit nicht begünstigt. Anders kann es bei Verträgen liegen, bei denen das Auto auf den Leasingnehmer selbst zugelassen wird. Mitfahrer sind kein Problem, solange sie nicht bezahlen: Die gelegentliche Mitnahme ist ausdrücklich erlaubt, eine regelmäßige Fahrgemeinschaft gegen Kostenbeteiligung bewegt sich dagegen in Richtung der entgeltlichen Personenbeförderung, die die Vergünstigung entfallen lässt.</p>

<h2>Wenn sich etwas ändert</h2>
<p>Ändern sich die Voraussetzungen, etwa weil ein Merkzeichen wegfällt, eine Freifahrt-Wertmarke beantragt wird oder ein anderes Auto begünstigt werden soll, muss das dem Hauptzollamt unverzüglich schriftlich angezeigt werden (§ 12a Abs. 5). Der Zoll setzt die Steuer dann neu fest (§ 12 Abs. 2 Nr. 2). Umgekehrt gilt: Kommt ein Merkzeichen hinzu, das zur vollen Befreiung führt, ändert sich die Steuer erst nach einem Antrag. Wer von der halben Steuer zur Freifahrt wechselt oder zurück, sollte die Zeitpunkte im Blick behalten, denn beides schließt sich gegenseitig aus.</p>
<p>Für einige ältere Fälle enthält § 17 KraftStG eine Sonderregel: Wem die Steuer schon vor der Gesetzesänderung von 1978 wegen Behinderung erlassen war, gilt ohne weiteren Nachweis als außergewöhnlich gehbehindert, solange ein Grad der Behinderung von mindestens 50 besteht. Für neue Anträge spielt das keine Rolle mehr.</p>

<h2>Halterwechsel, Verkauf und Tod</h2>
<p>Die Vergünstigung hängt an der Person, nicht am Fahrzeug. Wird das Auto verkauft oder nach dem Tod des Halters auf Erben umgeschrieben, endet sie mit der Umschreibung, und der neue Halter zahlt die normale Steuer. Das unterscheidet § 3a von der Befreiung für Elektroautos, die nach § 3d auf den Käufer übergeht. Wer ein neues Auto kauft, stellt den Antrag für das neue Fahrzeug; das alte verliert die Vergünstigung, denn es gibt sie nur für eines.</p>

<h2>Weitere Erleichterungen im Straßenverkehr</h2>
<p>Die Kfz-Steuer ist nicht die einzige Regel für schwerbehinderte Fahrer. Parkplätze mit dem Rollstuhlsymbol sind Inhabern eines entsprechenden Parkausweises vorbehalten; wer dort unberechtigt parkt, zahlt nach Nr. 55 des Bußgeldkatalogs ${h.eur(parken.fine!)}. Mehr zu Parkverstößen steht unter ${h.a('falschparken', 'Falschparken')}. Für die Steuer selbst gelten die allgemeinen Regeln zu Bescheid, Zahlung und Erstattung, die auf der Seite zur ${h.a('kfz-steuer', 'Kfz-Steuer')} beschrieben sind. Den Betrag mit und ohne Vergünstigung zeigt der ${h.a('kfz-steuer-rechner', 'Kfz-Steuer-Rechner')}; Formulare und Ansprechpartner nennt der ${h.src('zoll', 'Zoll')}.</p>
<p>Unsere Seite gibt allgemeine Informationen zum Gesetzestext. Ob die Voraussetzungen im Einzelfall erfüllt sind, entscheidet das Hauptzollamt auf Grundlage des Ausweises und der Angaben im Antrag.</p>`,
  },
  en: {
    slug: 'vehicle-tax-disability-germany',
    nav: 'Vehicle tax and disability',
    card: 'Full exemption with H, Bl or aG, half tax with the orange card.',
    title: 'Vehicle Tax Disability Germany 2026: Exemption and Half Rate',
    description: `Vehicle tax and disability in Germany 2026: exempt with marking H, Bl or aG, ${pE} off with the orange card and no free travel. A ${eE(d23.annual)} diesel drops to ${eE(halb(d23))}.`,
    h1: 'Vehicle tax and disability in Germany: exemption or half tax',
    intro: 'Severely disabled keepers in Germany can pay no vehicle tax or half of it, for one vehicle and only after an application.',
    resume: `Under Section 3a of the Motor Vehicle Tax Act, a vehicle is exempt from German vehicle tax while it is registered to a severely disabled person whose German disability card (Schwerbehindertenausweis) carries the marking H (helpless), Bl (blind) or aG (exceptionally impaired walking). The tax is halved if the card has the orange overprint showing that the holder meets Section 228(1) of Social Code IX, usually cards marked G or Gl, but only as long as the person does not use the right to free local public transport. Both reliefs cover one vehicle only and must be applied for in writing to the Hauptzollamt, the customs office that runs vehicle tax. They are lost if the vehicle carries goods, carries paying passengers, or is driven by someone else for trips unrelated to the disabled person's mobility or household. A 2023 diesel taxed at ${eE(d23.annual)} a year costs ${eE(halb(d23))} with the orange card and nothing with marking aG. A disability card issued in another country does not by itself qualify.`,
    faqs: [
      { q: 'Which German disability card markings give a vehicle tax exemption?', a: 'H for helpless, Bl for blind and aG for exceptionally impaired walking. With one of these on the Schwerbehindertenausweis, Section 3a(1) KraftStG exempts one vehicle registered to that person, whether or not they use free public transport. Other markings can only lead to half the tax, and only if the card carries the orange overprint. The relief has to be claimed in writing.' },
      { q: 'Do I get the 50 percent car tax reduction if I use free public transport?', a: `No. Section 3a(2) KraftStG withholds the ${pE} reduction for as long as the disabled person takes up free transport under Section 228 of Social Code IX, so you choose one or the other. For a diesel taxed at ${eE(d23.annual)}, the reduction is worth ${eE(d23.annual - halb(d23))} a year; for a small petrol car it is worth much less.` },
      { q: 'Can a family member drive a car with the disability tax exemption in Germany?', a: 'Yes, for trips connected with the disabled person\'s mobility or household, such as taking them to appointments or shopping for their home. Section 3a(3) KraftStG ends the relief if others use the car for unrelated trips, such as their own commute. A temporary misuse makes the tax due for that period, at least one month (Section 5(2)).' },
      { q: 'How do I apply for the disability vehicle tax relief in Germany?', a: 'In writing to the Hauptzollamt responsible for you, stating the reasons (Section 12a(4) KraftStG), with proof of the disability card. When registering a car, a note in the tax declaration made at the registration office is enough. The car must be registered in the disabled person\'s own name. Any change, such as losing a marking, must be reported without delay (Section 12a(5)).' },
    ],
    body: (h) => `
<h2>Two levels of relief</h2>
<p>${h.src('kraftstg3a', 'Section 3a KraftStG')} sets out two levels. Full exemption applies when the disability card shows that the holder is helpless (H), blind (Bl) or has exceptionally impaired walking (aG). A ${h.pct(K.schwerbehindert_ermaessigung, 0)} reduction applies when the card carries the orange overprint, which marks people who meet Section 228(1) of Social Code IX; these are normally cards with the markings G or Gl. The degree of disability on its own does not decide anything. What matters are the markings and the overprint.</p>
<p>The half-rate group faces a choice. As long as the person uses free local public transport under Section 228, there is no tax reduction. The full-exemption group has no such trade-off.</p>

<h2>Which card counts</h2>
<p>The law asks for a card within the meaning of Social Code IX, the German Schwerbehindertenausweis issued by the local pensions or social affairs office (Versorgungsamt). A disability card, blue badge or parking permit from another country is not mentioned in Section 3a. If you live in Germany and want the relief, the first step is usually to have your disability assessed and a German card issued, with the right markings. Only then can the customs office grant the tax relief.</p>

<h2>What it means in euros</h2>
${h.table(['Vehicle', 'Normal', `Orange card, ${h.pct(K.schwerbehindert_ermaessigung, 0)} off`, 'H, Bl, aG'], [
  [`Petrol 2024, ${h.num(1498)} cm³, 118 g`, h.eur(b24.annual), h.eur(halb(b24)), h.eur(frei(b24))],
  [`Petrol 2016, ${h.num(1598)} cm³, 129 g`, h.eur(b16.annual), h.eur(halb(b16)), h.eur(frei(b16))],
  [`Diesel 2023, ${h.num(1968)} cm³, 145 g`, h.eur(d23.annual), h.eur(halb(d23)), h.eur(frei(d23))],
  [`Diesel 2006, Euro 4, ${h.num(1896)} cm³`, h.eur(d06.annual), h.eur(halb(d06)), h.eur(frei(d06))],
  [`Electric car after its exemption, ${h.num(2232)} kg`, h.eur(ev.annual), h.eur(halb(ev)), h.eur(frei(ev))],
], 'Annual tax under Sections 9 and 3a KraftStG, rounded down to the euro', ['l', 'r', 'r', 'r'])}
<p>The reduction is applied to the tax before rounding, and only the final amount is rounded down. An electric car past its own exemption already pays half the weight tax, so the disability reduction halves it again. How the normal amount is built is explained on the ${h.a('kfz-steuer-diesel', 'diesel tax page')} and the ${h.a('kfz-steuer-elektroauto', 'electric car tax page')}.</p>

<h2>One vehicle, in your name, on application</h2>
<p>Section 3a(3) limits the relief to one vehicle. With two cars you pick one, and the other pays full tax. Nothing happens automatically: you apply in writing to the Hauptzollamt and give your reasons (Section 12a(4)). When you register a car, a note in the tax declaration made at the registration office is enough (Section 12a(6)).</p>
<p>The vehicle must be registered to the disabled person. A car registered to a spouse, a child or a carer and used to drive the disabled person around does not qualify under the wording of the law. Families sometimes re-register the car in the disabled person's name for this reason; the tax then changes from the date of the change once the application is in.</p>
<!--mini:schwerbehindert-->
<h2>Who may drive, and for what</h2>
<p>Three uses end the relief (Section 3a(3)):</p>
<ul>
<li>carrying goods, apart from hand luggage;</li>
<li>carrying paying passengers, apart from the occasional lift;</li>
<li>use by other people for trips unrelated to the disabled person's mobility or household.</li>
</ul>
<p>The third rule matters most in daily life. A partner can drive the car to take the disabled person to a clinic, to shop for the household, or to collect them from work. The partner's own commute, or a weekend away without them, falls outside. If the car is used for other purposes for a while, Section 5(2) makes the tax due for that period, with a minimum of one month, and the same applies to the half rate.</p>

<h2>Free travel or half tax: doing the sum</h2>
<p>For holders of the orange card the choice is a straightforward comparison. On one side is the tax saving: ${h.eur(d23.annual - halb(d23))} a year for the 2023 diesel, only ${h.eur(b24.annual - halb(b24))} for the 2024 petrol car. On the other is what free local transport is worth to you, less whatever you pay yourself to use it. Someone who rarely takes the bus and drives a car with a high tax bill usually gains from the reduction; someone with a small car who commutes by train usually gains from free travel.</p>

<h2>Which vehicles qualify</h2>
<p>Section 3a refers to motor vehicles, so cars, motorbikes and motorhomes registered to the disabled person all qualify. Trailers, including caravans, are a separate category under Section 2(1) KraftStG and do not. For an electric car, the disability relief only matters once its own exemption under Section 3d has run out; until then no tax is due anyway.</p>

<h2>Leased cars, company cars and lifts</h2>
<p>A leased car is usually registered to the leasing company and a company car to the employer. Under the wording of Section 3a, neither is registered to the disabled person, so neither qualifies. Some private leasing contracts register the car to the customer, which changes the picture. Passengers are fine as long as they do not pay: occasional lifts are expressly allowed, while a regular car-share with contributions moves towards paid passenger transport, which ends the relief.</p>

<h2>Timeline after moving to Germany</h2>
<p>For newcomers the order of steps matters. Register your residence, apply for the disability assessment and the German card, register the car in the disabled person's name, then claim the relief with the Hauptzollamt. Until the card with the right markings exists, customs has nothing to base the relief on, and the normal tax applies from the day of registration.</p>

<h2>Changes you must report</h2>
<p>If a marking is withdrawn, if you switch to free public transport, or if you want a different vehicle to benefit, tell the Hauptzollamt in writing without delay (Section 12a(5)); customs will reassess the tax (Section 12(2) No. 2). A new marking that would bring full exemption does not change anything until you apply. Switching between half tax and free travel is possible, but the two never overlap, so keep the dates clear.</p>
<p>Section 17 keeps an old rule alive for people whose tax was waived for disability before a 1978 amendment: they count as having exceptionally impaired walking without further proof while their degree of disability is at least 50. New applicants are not affected.</p>

<h2>Selling the car or changing keeper</h2>
<p>The relief belongs to the person, not the car. When the car is sold, or re-registered to heirs after the keeper's death, it ends with the re-registration and the new keeper pays normal tax. This is the opposite of the electric car exemption, which passes to the buyer. A replacement car needs its own application, and the old one loses the relief because only one vehicle can have it.</p>

<h2>Related rules on the road</h2>
<p>Disabled parking bays marked with the wheelchair symbol are reserved for holders of the matching parking permit; parking there without one costs ${h.eur(parken.fine!)} under number 55 of the fine catalogue, as explained on the ${h.a('falschparken', 'parking fines page')}. Payment, notices and refunds follow the general rules in the ${h.a('kfz-steuer', 'vehicle tax overview')}, and the ${h.a('kfz-steuer-rechner', 'vehicle tax calculator')} shows the amount with and without relief. Forms and contacts are on the ${h.src('zoll', 'customs website')}.</p>
<p>This page describes the statutory text in general terms. Whether the conditions are met in a particular case is decided by the Hauptzollamt, based on the card and the application.</p>`,
  },
});
