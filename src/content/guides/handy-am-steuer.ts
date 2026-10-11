import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, phone, fromEntry } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, PZ = P.probezeit;
const base = phone({ harm: 'none' }), gef = phone({ harm: 'danger' }), sach = phone({ harm: 'damage' }), rad = phone({ harm: 'none', cyclist: true });
const vors = fromEntry('246.1', { intent: true });
const radar = entry('247');
const mD = (x: number, d = 0) => formatMoney(x, d, 'de'), mE = (x: number, d = 0) => formatMoney(x, d, 'en');

export default defineGuide({
  id: 'handy-am-steuer',
  group: 'verstoesse',
  order: 30,
  mini: 'handy',
  related: ['bussgeldrechner', 'fahrverbot', 'probezeit-fuehrerschein', 'punkte-in-flensburg', 'rotlichtverstoss', 'bussgeldbescheid'],
  sources: ['bkatAnlage', 'bkatv', 'fevAnl13', 'fevAnl12', 'owig107'],
  de: {
    slug: 'handy-am-steuer',
    nav: 'Handy am Steuer',
    card: 'Was § 23 StVO erlaubt, was verboten ist und was der Griff zum Smartphone kostet.',
    title: 'Handy am Steuer 2026: Strafe, Punkt und was erlaubt ist',
    description: `Handy am Steuer 2026: ${base.fine} € und 1 Punkt, mit Gefährdung ${gef.fine} €, 2 Punkte und 1 Monat Fahrverbot. Was § 23 StVO erlaubt, was Radfahrer zahlen, Probezeitregeln.`,
    h1: 'Handy am Steuer: Strafe und Regeln',
    intro: 'Verboten ist nicht das Telefonieren an sich, sondern das Aufnehmen oder Halten des Geräts und jeder längere Blick darauf.',
    resume: `Wer beim Fahren ein Smartphone, Tablet oder Navi in die Hand nimmt oder länger als einen kurzen Blick darauf schaut, zahlt nach dem Bußgeldkatalog ${base.fine} Euro und bekommt einen Punkt in Flensburg. Mit Gefährdung anderer sind es ${gef.fine} Euro, mit Sachbeschädigung ${sach.fine} Euro, jeweils mit ${gef.points} Punkten und ${gef.fv} Monat Fahrverbot. Hinzu kommen die Kosten des Bescheids, beim Grundfall zusammen ${mD(base.total, 2)}. Erlaubt bleibt nach § 23 Abs. 1a StVO, das Gerät per Sprachsteuerung zu bedienen oder mit einem kurzen, der Verkehrslage angepassten Blick, solange es in einer Halterung liegt und nicht gehalten wird. Ausgenommen ist das stehende Auto nur bei vollständig ausgeschaltetem Motor; die Start-Stopp-Automatik zählt nicht. Radfahrer zahlen ${rad.fine} Euro ohne Punkt. In der Probezeit ist der Handyverstoß im Auto ein A-Verstoß.`,
    faqs: [
      { q: 'Darf ich an der roten Ampel aufs Handy schauen, wenn die Start-Stopp-Automatik den Motor abschaltet?', a: `Nein. § 23 Abs. 1b StVO nimmt nur das stehende Fahrzeug mit vollständig ausgeschaltetem Motor aus und sagt ausdrücklich, dass das automatische Abschalten durch das Fahrzeug kein Ausschalten in diesem Sinne ist. Beim Elektroauto gilt das Ruhen des Antriebs ebenso wenig. Wer an der Ampel das Handy in die Hand nimmt, riskiert also dieselben ${base.fine} Euro und einen Punkt.` },
      { q: 'Ist Telefonieren mit Freisprecheinrichtung beim Autofahren erlaubt?', a: 'Ja. Das Verbot knüpft an das Aufnehmen und Halten des Geräts an. Wer über die Freisprechanlage des Autos oder ein Headset telefoniert und den Anruf per Sprachbefehl oder mit einem kurzen Tipp auf das Display annimmt, verstößt nicht gegen § 23 Abs. 1a StVO. Längeres Suchen im Menü oder Tippen von Nachrichten ist dagegen auch bei festem Einbau verboten.' },
      { q: 'Darf ich das Navi im Auto während der Fahrt bedienen?', a: `Nur mit einem kurzen Blick, der zur Verkehrslage passt, oder per Sprache. § 23 StVO zählt Navigationsgeräte und Berührungsbildschirme ausdrücklich zu den erfassten Geräten, auch das fest eingebaute Display. Eine neue Adresse während der Fahrt per Hand einzugeben, dauert meist länger als ein kurzer Blick und kann dieselben ${base.fine} Euro kosten wie das Handy in der Hand.` },
      { q: 'Wie hoch ist das Bußgeld für das Handy auf dem E-Scooter?', a: `Der Katalog hat eine eigene, niedrigere Nummer nur für das Radfahren mit ${rad.fine} Euro ohne Punkt. E-Scooter sind Kraftfahrzeuge, für sie gilt deshalb der allgemeine Satz beim Führen eines Fahrzeugs: ${base.fine} Euro und ein Punkt, mit Gefährdung oder Schaden mehr. Zum Bußgeld kommen beim Bescheid die üblichen Gebühren hinzu.` },
      { q: 'Was kostet es, wenn ich das Handy am Steuer bewusst immer wieder nutze?', a: `Nimmt die Behörde Vorsatz an, verdoppelt § 3 Abs. 4a BKatV den Regelsatz über ${V.verwarnung_max} Euro. Aus ${base.fine} werden dann ${vors.fine} Euro, mit Gebühren ${mD(vors.total, 2)}. Wer innerhalb kurzer Zeit mehrere Handyverstöße sammelt, erreicht außerdem schnell die Ermahnung bei vier und die Verwarnung bei sechs Punkten im Fahreignungsregister.` },
    ],
    body: (h) => `
<h2>Was § 23 Abs. 1a StVO genau sagt</h2>
<p>Die Vorschrift ist technikoffen formuliert. Erfasst ist jedes elektronische Gerät, das der Kommunikation, Information oder Organisation dient: Mobiltelefon, Autotelefon, Tablet, Laptop, Navigationsgerät, Touchscreen, Fernseher, Abspielgerät mit Videofunktion, Audiorekorder und auch Unterhaltungselektronik. Wer ein Fahrzeug führt, darf ein solches Gerät nur benutzen, wenn zwei Bedingungen zugleich erfüllt sind.</p>
<ol>
<li>Das Gerät wird dafür weder aufgenommen noch gehalten.</li>
<li>Es wird entweder nur per Sprachsteuerung und Vorlesefunktion genutzt, oder die Bedienung erfordert nur eine kurze, den Straßen-, Verkehrs-, Sicht- und Wetterverhältnissen angepasste Blickzuwendung.</li>
</ol>
<p>Daraus folgt: Das Handy in der Halterung, ein kurzer Blick auf die Karte, ein Tipp auf „Annehmen“ sind zulässig. Das Handy in der Hand zu benutzen, ist immer verboten, auch wenn man nur die Uhrzeit ablesen oder einen Anruf wegdrücken will. Ein langer Blick ist auch bei fest eingebautem Bildschirm verboten. Wie lang „kurz“ ist, sagt das Gesetz nicht in Sekunden; maßgeblich sind die Umstände. Bei Regen in der Dämmerung auf der Stadtautobahn ist der zulässige Blick kürzer als auf leerer Landstraße bei Tag.</p>
<p>Zwei Sonderregeln betreffen neue Technik. Videobrillen und andere auf dem Kopf getragene visuelle Ausgabegeräte dürfen beim Fahren gar nicht benutzt werden. Ein Head-up-Display, das ins Sichtfeld projiziert, ist dagegen für fahrzeug-, verkehrszeichen- und fahrtbezogene Informationen erlaubt.</p>

<h2>Die Bußgelder</h2>
${h.table(['Verstoß', 'BKat-Nr.', 'Bußgeld', 'Punkte', 'Fahrverbot', 'mit Gebühren'], [
  ['Gerät beim Führen eines Fahrzeugs rechtswidrig benutzt', '246.1', h.eur(base.fine), h.num(base.points), 'nein', h.eur(base.total, 2)],
  ['mit Gefährdung', '246.2', h.eur(gef.fine), h.num(gef.points), `${gef.fv} Monat`, h.eur(gef.total, 2)],
  ['mit Sachbeschädigung', '246.3', h.eur(sach.fine), h.num(sach.points), `${sach.fv} Monat`, h.eur(sach.total, 2)],
  ['beim Radfahren', '246.4', h.eur(rad.fine), h.num(rad.points), 'nein', h.eur(rad.total, 2)],
], 'Elektronische Geräte nach BKatV, Stand August 2026, Gebühren nach § 107 OWiG', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Der Grundsatz von ${h.eur(base.fine)} liegt über der Grenze für Verwarnungsgelder. Es gibt also immer einen Bußgeldbescheid mit mindestens ${h.eur(V.gebuehr_min)} Gebühr und ${h.eur(V.zustellung, 2)} Zustellung, und der Verstoß kommt ins Fahreignungsregister. Beim Radfahren bleibt es bei ${h.eur(rad.fine)}, also einem Verwarnungsgeld ohne Punkt, sofern es vor Ort erhoben und bezahlt wird.</p>
<p>Eine Gefährdung liegt vor, wenn wegen der Ablenkung jemand konkret in Gefahr geriet, etwa weil der Wagen auf die Gegenspur kam oder ein Radfahrer ausweichen musste. Die Sachbeschädigung meint vor allem den Auffahrunfall. In beiden Fällen sieht die Bußgeldkatalog-Verordnung ${gef.fv} Monat Fahrverbot vor; wie der abläuft, erklärt die Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>

<h2>Wann das Verbot nicht gilt</h2>
<p>§ 23 Abs. 1b StVO nennt die Ausnahmen abschließend:</p>
<ul>
<li>ein stehendes Fahrzeug, bei einem Kraftfahrzeug nur mit vollständig ausgeschaltetem Motor. Die Start-Stopp-Automatik und das Ruhen eines Elektroantriebs gelten ausdrücklich nicht als Ausschalten;</li>
<li>der Betrieb einer atemalkoholgesteuerten Wegfahrsperre, wenn deren Handteil gehalten werden muss;</li>
<li>stehende Straßenbahnen und Linienbusse an Haltestellen.</li>
</ul>
<p>Außerdem darf ein Bildschirm beim Rückwärtsfahren oder Einparken mit Schrittgeschwindigkeit länger angeschaut werden, und Kamerasysteme, die Spiegel ersetzen oder ergänzen, fallen nicht unter die Blickregel. Im Stau mit laufendem Motor ist das Handy in der Hand also ebenso verboten wie an der Ampel. Wer wirklich telefonieren oder schreiben muss, hält an einer geeigneten Stelle und schaltet den Motor ab.</p>

<h2>Punkte und Probezeit</h2>
<p>Der Grundtatbestand bringt einen Punkt, die Fälle mit Fahrverbot zwei. So steht es in der ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')}. Ein Punkt wird zweieinhalb Jahre nach Rechtskraft tilgungsreif, zwei Punkte nach fünf Jahren. Wer ohnehin schon Einträge hat, kommt mit dem Handy schnell an die Schwellen des Punktesystems: Ab vier Punkten folgt die schriftliche Ermahnung, ab sechs die Verwarnung, ab acht die Entziehung der Fahrerlaubnis. Den Stand erklärt die Seite zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>
<p>Für Fahranfänger ist die Nutzung elektronischer Geräte am Steuer ein A-Verstoß nach der ${h.src('fevAnl12', 'Anlage 12')}. Ein einziger Bescheid über ${h.eur(base.fine)} reicht für das Aufbauseminar und ${PZ.verlaengerung_jahre} Jahre zusätzliche Probezeit. Ein zweiter A-Verstoß nach dem Seminar bringt die schriftliche Verwarnung mit der Empfehlung einer verkehrspsychologischen Beratung, ein dritter die Entziehung. Die Stufen bis zur Entziehung zeigt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Typische Grenzfälle</h2>
<h3>Musik und Podcasts</h3>
<p>Auch der Musikplayer ist ein Gerät im Sinne der Vorschrift. Den nächsten Titel per Lenkradtaste oder Sprachbefehl zu wählen, ist erlaubt. Das Smartphone in die Hand zu nehmen, um eine Playlist zu suchen, ist ein Verstoß nach 246.1.</p>
<h3>Das Handy als Navi auf dem Schoß</h3>
<p>Liegt das Handy auf dem Oberschenkel oder in der Mittelkonsole, wird es nicht gehalten. Schwierig wird es, sobald man es zum Ablesen anhebt oder länger nach unten schaut, als die Verkehrslage zulässt. Eine Halterung im Blickfeld vermeidet beide Probleme. Sie sollte so sitzen, dass sie weder die Sicht nach vorn verdeckt noch einen Airbag behindert, und das Gerät sollte vor der Abfahrt eingerichtet sein: Ziel eingegeben, Musik gestartet, Nachrichten stumm.</p>
<h3>Smartwatch</h3>
<p>Eine Uhr am Handgelenk wird weder aufgenommen noch gehalten. Für sie gilt aber die Blickregel: Eine Nachricht auf der Uhr zu lesen, dauert schnell länger als ein kurzer Blick.</p>
<h3>Blitzer-Apps</h3>
<p>Davon zu trennen ist § 23 Abs. 1c StVO. Geräte, die Verkehrskontrollen anzeigen oder stören, dürfen beim Fahren nicht betrieben oder betriebsbereit mitgeführt werden; bei Smartphones mit entsprechender App ist die Funktion verboten. Der Katalog sieht dafür ${h.eur(radar.fine!)} und einen Punkt vor (247), in der Probezeit ein B-Verstoß.</p>
<h3>Beruflich unterwegs</h3>
<p>Für Lieferfahrer, Handwerker und Lkw-Fahrer gilt keine Sonderregel. Ein Tablet mit Auftragsliste, ein Scanner oder ein Diensthandy fallen genauso unter § 23 Abs. 1a StVO wie das private Smartphone. Wer während der Fahrt die nächste Lieferadresse bestätigt oder eine Nachricht der Disposition liest, braucht eine Halterung und muss mit einem kurzen Blick oder per Sprache auskommen. Das Bußgeld trifft immer die Person am Steuer, nicht den Arbeitgeber und nicht den Halter.</p>
<h3>Automatisierte Fahrfunktionen</h3>
<p>Die Vorschrift lässt § 1b StVG ausdrücklich unberührt. Dort ist geregelt, dass sich der Fahrer bei einer genehmigten hoch- oder vollautomatisierten Fahrfunktion im zulässigen Rahmen vom Verkehrsgeschehen abwenden darf, solange er wahrnehmungsbereit bleibt und auf Aufforderung des Systems übernimmt. Spurhalte- und Abstandsassistenten gängiger Autos sind keine solchen Funktionen. Wer sich mit eingeschaltetem Assistenten dem Handy widmet, begeht denselben Verstoß wie ohne.</p>

<h2>Folgen über das Bußgeld hinaus</h2>
<p>Kommt es wegen der Ablenkung zu einem Unfall, endet die Rechnung nicht beim Katalog. Die Haftpflichtversicherung reguliert den Schaden des Unfallgegners, kann den eigenen Kunden aber je nach Vertrag in Regress nehmen. In der Kaskoversicherung können Leistungen bei grober Fahrlässigkeit gekürzt werden, wenn der Vertrag das nicht ausschließt; der Blick aufs Handy wird von Gerichten häufig so eingestuft. Werden Menschen verletzt, prüft die Staatsanwaltschaft zusätzlich eine Straftat, etwa fahrlässige Körperverletzung. Das Bußgeld nach Nummer 246 ist dann nur ein Teil des Verfahrens.</p>
<!--mini:handy-->
<h2>Wie der Verstoß festgestellt wird</h2>
<p>Handyverstöße stellt in der Regel die Polizei bei einer Kontrolle oder bei der Fahrt hinter oder neben einem Fahrzeug fest. Manche Blitzerfotos zeigen das Gerät in der Hand; dann kann der Verstoß auch ohne Anhalten verfolgt werden. Wird man angehalten, sind Angaben zur Person Pflicht; zur Sache darf man schweigen. Der Anhörungsbogen und später der Bescheid nennen die Nummer und die Umstände.</p>
<p>Der Bescheid lässt sich Zeile für Zeile prüfen: Nummer, Ort, Uhrzeit, Fahrzeug, Betrag. Gegen ihn ist binnen ${V.einspruch_wochen} Wochen nach Zustellung der Einspruch möglich; das ist ein Recht, kein Rat, und die Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')} erklärt den Ablauf. Seit Juli 2026 verjährt ein solcher Verstoß nach sechs Monaten, sofern die Frist nicht vorher unterbrochen wurde.</p>
<p>Den Gesamtbetrag einschließlich Gebühren für jede Variante zeigt der ${h.a('bussgeldrechner', 'Bußgeldrechner')}, die Grundlage ist der amtliche ${h.src('bkatAnlage', 'Bußgeldkatalog')}. Wer gleichzeitig noch über Rot gefahren ist, findet die Werte beim ${h.a('rotlichtverstoss', 'Rotlichtverstoß')}; bei einer einzigen Handlung wendet die Behörde nur den höchsten Regelsatz an und kann ihn angemessen erhöhen.</p>`,
  },
  en: {
    slug: 'phone-while-driving-germany',
    nav: 'Phone while driving',
    card: 'What German law allows with a phone in the car, and what holding it costs.',
    title: 'Phone While Driving Germany 2026: Fine, Point, What Is Legal',
    description: `Phone while driving in Germany 2026: ${mE(base.fine)} and 1 point, ${mE(gef.fine)} with a 1-month ban if someone was endangered. What Section 23 StVO allows, cyclists and probation.`,
    h1: 'Using a phone while driving in Germany',
    intro: 'German law does not ban calls as such; it bans picking up or holding the device and any glance longer than a brief one.',
    resume: `Using a mobile phone while driving in Germany costs ${base.fine} euros and one point in the Flensburg register if you pick it up, hold it or look at it for more than a brief glance. If someone was endangered the fine is ${gef.fine} euros, with property damage ${sach.fine} euros, both with ${gef.points} points and a ${gef.fv}-month driving ban (Fahrverbot). Because the basic fine is above the warning-fine limit, a formal notice always follows, bringing the total to ${mE(base.total, 2)} with fees. Section 23(1a) of the Road Traffic Regulations (StVO) allows a device in a holder to be used by voice or with a short glance suited to the traffic. A stopped car is exempt only with the engine fully off; automatic start-stop does not count. The rule covers sat navs, tablets and built-in touchscreens too. Cyclists pay ${rad.fine} euros with no point. For new drivers on probation, it is a serious A offence.`,
    faqs: [
      { q: 'Can I use Apple CarPlay or Android Auto while driving in Germany?', a: `Yes, within limits. The phone is not held, so the first condition is met. Operating the screen is allowed only with a brief glance suited to the road, traffic, visibility and weather, or by voice. Scrolling through menus or typing a destination at speed can exceed that and cost ${base.fine} euros and a point, exactly as if you had held the phone.` },
      { q: 'Is it legal to hold my phone in a German traffic jam?', a: `No, not while the engine runs. The only exemption for a car is standing still with the engine completely switched off. Automatic start-stop and an electric drive in standby do not count as switched off. In stop-and-go traffic on the Autobahn, picking up the phone is therefore the same offence as on the open road: ${base.fine} euros and one point.` },
      { q: 'What is the fine for texting on a bike in Germany?', a: `Cyclists who use a phone in breach of the rules pay ${rad.fine} euros under catalogue number 246.4, with no point and no ban. Below the ${V.verwarnung_max}-euro limit, there are no notice fees if the warning fine is paid. E-scooters are motor vehicles, so their riders face the general rate of ${base.fine} euros and a point.` },
      { q: 'Does a German phone fine affect a licence I hold from outside the EU?', a: `The fine and the point are recorded in the German register whatever licence you hold. If you live in Germany and later exchange your licence, the authority can see the entry. With danger or damage the ${gef.fv}-month ban applies on German roads; a non-EU licence receives a note, while an EU licence of a resident is held for the period.` },
    ],
    body: (h) => `
<h2>The legal test in plain English</h2>
<p>Section 23(1a) StVO covers any electronic device used for communication, information or organisation. The text lists mobile and car phones, touchscreens, tablets and laptops, sat navs, televisions, video players and audio recorders, and adds entertainment electronics. A driver may use such a device only if both of these are true:</p>
<ol>
<li>the device is neither picked up nor held, and</li>
<li>it is used only by voice control and read-aloud functions, or operating it needs only a brief glance suited to the road, traffic, visibility and weather.</li>
</ol>
<p>The law gives no number of seconds. A glance that is acceptable on an empty country road in daylight can be too long in rain on a busy ring road. Video glasses and other head-worn screens are banned outright while driving. A head-up display projected into your field of view is allowed for information about the vehicle, road signs and the journey.</p>
<p>If you come from a country where hands-free rules are looser, the key difference is "held". In Germany, even lifting the phone to check who is calling counts. Many rental cars come with phone holders or screen mirroring; using them is the simplest way to stay within the rule.</p>

<h2>The fines</h2>
${h.table(['Offence', 'Cat. no.', 'Fine', 'Points', 'Ban', 'With fees'], [
  ['Device used unlawfully while driving', '246.1', h.eur(base.fine), h.num(base.points), 'none', h.eur(base.total, 2)],
  ['endangering others', '246.2', h.eur(gef.fine), h.num(gef.points), `${gef.fv} month`, h.eur(gef.total, 2)],
  ['causing property damage', '246.3', h.eur(sach.fine), h.num(sach.points), `${sach.fv} month`, h.eur(sach.total, 2)],
  ['while cycling', '246.4', h.eur(rad.fine), h.num(rad.points), 'none', h.eur(rad.total, 2)],
], 'Electronic devices at the wheel, BKatV as amended August 2026, fees under Section 107 OWiG', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The fees in the last column come from ${h.src('owig107', 'Section 107 of the Administrative Offences Act')}: five per cent of the fine with a minimum of ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for delivery. If the authority finds you acted deliberately, Section 3(4a) of the fine catalogue ordinance doubles any fine above ${h.eur(V.verwarnung_max)}, so the basic case would become ${h.eur(vors.fine)}.</p>

<h2>The exemptions</h2>
<p>Section 23(1b) lists the situations where the rule does not apply:</p>
<ul>
<li>a stationary vehicle, and for a motor vehicle only with the engine completely off. The law states that automatic engine shut-off and a resting electric drive are not "off";</li>
<li>an alcohol interlock that requires you to hold a handset to blow into it;</li>
<li>trams and scheduled buses standing at a stop.</li>
</ul>
<p>The glance limit also does not apply to screens used for reversing or parking at walking pace, or to camera systems that replace or supplement mirrors. Waiting at a red light with the engine running is not an exemption, and neither is a traffic jam. If a call cannot wait, pull over somewhere safe and switch off.</p>

<h2>Points, probation and the register</h2>
<p>The basic offence brings one point and the cases with a ban two, under ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}. A point expires two and a half years after the decision becomes final. Combined with a speeding entry or two, a phone offence can quickly take you to four points and a written reminder; the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains the stages.</p>
<p>During the ${PZ.jahre}-year probation (Probezeit) that starts with a first licence, phone use at the wheel is an A offence under ${h.src('fevAnl12', 'annex 12')}. One notice is enough for a compulsory remedial course and ${PZ.verlaengerung_jahre} more years of probation. This also applies to people who moved to Germany with an EU licence less than two years old. The ${h.a('probezeit-fuehrerschein', 'probationary licence page')} describes the following steps.</p>

<h2>Everyday situations</h2>
<h3>Smartwatches</h3>
<p>A watch on your wrist is not held, but the glance rule applies. Reading a message on a small screen easily takes longer than a brief look.</p>
<h3>Speed camera warning apps</h3>
<p>A separate rule, Section 23(1c), forbids devices that warn of or interfere with traffic enforcement. On a smartphone, the warning function may not be used while driving. The fine is ${h.eur(radar.fine!)} plus one point under number 247. Navigation apps that show cameras are common abroad, so it is worth checking the settings before driving in Germany.</p>
<h3>Passengers</h3>
<p>The rule binds the person driving. A passenger may use a phone freely and can read out directions or answer a call for the driver, which is the easiest solution on long trips.</p>
<h3>Setting up before you leave</h3>
<p>Most phone fines happen in the first minutes of a trip: a destination typed at the first junction, a playlist chosen at the first red light. Entering the route, starting the audio and switching notifications to driving mode before pulling away removes the temptation. Mount the holder where it neither blocks your view of the road nor sits in front of an airbag. On a long Autobahn drive, the service areas (Raststätten) every few dozen kilometres are the legal place to answer messages, with the engine off.</p>
<h3>Work phones, tablets and delivery apps</h3>
<p>There is no exemption for work. A tablet with delivery addresses, a handheld scanner or a company phone falls under the same rule as a personal smartphone. Confirming the next stop or reading a dispatch message while moving requires a holder and a brief glance or voice control. The fine always goes to the driver, not to the employer or the vehicle keeper, which matters for anyone working for a courier or a ride-hailing platform.</p>
<h3>Driver assistance and automated driving</h3>
<p>Section 23 leaves untouched Section 1b of the Road Traffic Act (StVG), which lets a driver turn away from the road while an approved highly or fully automated driving function is in control, provided they stay ready to take over when the system asks. Ordinary lane-keeping and adaptive cruise control are not such functions. Using the phone with these assistants switched on is the same offence as without them.</p>

<h2>When there is a crash</h2>
<p>If distraction leads to an accident, the catalogue fine is only one part of the outcome. Your motor liability insurer pays the other party but may, depending on the policy, seek part of the money back from you. Comprehensive cover (Vollkasko) can reduce payment for gross negligence unless the policy waives that, and German courts often classify looking at a phone while driving in that way. If someone is injured, prosecutors also look at criminal charges such as negligent bodily harm. For expats, the practical lesson is to read the gross negligence clause in a German car insurance policy, since it is a common point of difference with policies elsewhere.</p>
<!--mini:handy-->
<h2>How offences are detected and what follows</h2>
<p>Most phone offences are spotted by police officers in traffic, sometimes from an unmarked car, and some appear on speed camera photos showing a phone in hand. If you are stopped, you must give your personal details; you do not have to comment on the accusation. A hearing form (Anhörungsbogen) and later a fine notice (Bußgeldbescheid) follow by post. You have ${V.einspruch_wochen} weeks from delivery to lodge an objection, which the law offers as a right; the ${h.a('bussgeldbescheid', 'fine notice page')} explains the process. Since July 2026 such an offence becomes time-barred after six months unless the period is interrupted.</p>
<p>The ${h.a('bussgeldrechner', 'fine calculator')} shows the total for each variant, based on the official ${h.src('bkatAnlage', 'fine catalogue')}. If a ban applies, the ${h.a('fahrverbot', 'driving ban page')} explains how to choose its start date and where to send your licence.</p>`,
  },
});
