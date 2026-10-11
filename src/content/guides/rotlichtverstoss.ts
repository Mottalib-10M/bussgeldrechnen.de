import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, redLight } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const PZ = P.probezeit, V = P.verfahren;
const simple = redLight({ overOneSecond: false, harm: 'none' });
const simpleG = redLight({ overOneSecond: false, harm: 'danger' });
const simpleS = redLight({ overOneSecond: false, harm: 'damage' });
const qual = redLight({ overOneSecond: true, harm: 'none' });
const qualG = redLight({ overOneSecond: true, harm: 'danger' });
const qualS = redLight({ overOneSecond: true, harm: 'damage' });
const rad = redLight({ overOneSecond: false, harm: 'none', cyclist: true });
const radG = redLight({ overOneSecond: false, harm: 'danger', cyclist: true });
const radS = redLight({ overOneSecond: false, harm: 'damage', cyclist: true });
const radQ = redLight({ overOneSecond: true, harm: 'none', cyclist: true });
const radQG = redLight({ overOneSecond: true, harm: 'danger', cyclist: true });
const radQS = redLight({ overOneSecond: true, harm: 'damage', cyclist: true });
const gp1 = entry('131.1'), gp2 = entry('131.2'), gpStop = entry('133.1'), gpGef = entry('133.2'), gpFussB = entry('133.3.1'), gpFussG = entry('133.3.2');
const halt = entry('154'), haltGef = entry('150');
const mD = (x: number, d = 0) => formatMoney(x, d, 'de'), mE = (x: number, d = 0) => formatMoney(x, d, 'en');

const carRows = (de: boolean) => [
  [de ? 'Rot missachtet, unter 1 Sekunde' : 'Red ignored, under 1 second', '132', simple],
  [de ? 'unter 1 Sekunde, mit Gefährdung' : 'under 1 second, endangering others', '132.1', simpleG],
  [de ? 'unter 1 Sekunde, mit Sachbeschädigung' : 'under 1 second, property damaged', '132.2', simpleS],
  [de ? 'Rot länger als 1 Sekunde' : 'Red for more than 1 second', '132.3', qual],
  [de ? 'länger als 1 Sekunde, mit Gefährdung' : 'over 1 second, endangering others', '132.3.1', qualG],
  [de ? 'länger als 1 Sekunde, mit Sachbeschädigung' : 'over 1 second, property damaged', '132.3.2', qualS],
] as const;

export default defineGuide({
  id: 'rotlichtverstoss',
  group: 'verstoesse',
  order: 10,
  mini: 'rotlicht',
  related: ['bussgeldrechner', 'fahrverbot', 'probezeit-fuehrerschein', 'punkte-in-flensburg', 'bussgeldbescheid', 'handy-am-steuer'],
  sources: ['bkatAnlage', 'bkatv', 'fevAnl13', 'fevAnl12', 'owig107'],
  de: {
    slug: 'rotlichtverstoss',
    nav: 'Rotlichtverstoß',
    card: 'Was eine rote Ampel kostet: Sekundengrenze, Gefährdung, Radfahrer, Grünpfeil.',
    title: 'Rotlichtverstoß 2026: Bußgeld, Punkte und 1-Sekunden-Regel',
    description: `Rotlichtverstoß 2026: ${simple.fine} € und 1 Punkt, nach mehr als einer Sekunde Rot ${qual.fine} €, 2 Punkte und ${qual.fv} Monat Fahrverbot. Dazu Radfahrer, Grünpfeil und Probezeit.`,
    h1: 'Rotlichtverstoß: was die rote Ampel kostet',
    intro: 'Entscheidend sind zwei Fragen: wie lange die Ampel schon Rot zeigte und ob dabei jemand gefährdet oder etwas beschädigt wurde.',
    resume: `Wer mit dem Auto über eine rote Ampel fährt, zahlt nach dem Bußgeldkatalog ${simple.fine} Euro und bekommt einen Punkt in Flensburg, solange das Rot noch keine volle Sekunde andauerte. Ab einer Sekunde Rotphase spricht man vom qualifizierten Rotlichtverstoß: ${qual.fine} Euro, ${qual.points} Punkte und ${qual.fv} Monat Fahrverbot. Kommt eine Gefährdung hinzu, steigt das Bußgeld beim einfachen Verstoß auf ${simpleG.fine} Euro, beim qualifizierten auf ${qualG.fine} Euro; mit Sachbeschädigung sind es ${simpleS.fine} beziehungsweise ${qualS.fine} Euro. Auf jedem Bußgeldbescheid kommen mindestens ${V.gebuehr_min} Euro Gebühr und ${mD(V.zustellung, 2)} Zustellung hinzu, beim einfachen Fall also ${mD(simple.total, 2)}. Radfahrer und E-Scooter-Fahrer zahlen ${rad.fine} Euro und erhalten ebenfalls einen Punkt, aber nie ein Fahrverbot. In der Probezeit ist jeder Rotlichtverstoß mit Punkt ein A-Verstoß: Aufbauseminar und ${PZ.verlaengerung_jahre} Jahre Verlängerung.`,
    faqs: [
      { q: 'Wie wird die eine Sekunde beim Rotlichtverstoß gezählt?', a: `Maßgeblich ist die Zeit zwischen dem Umspringen der Ampel auf Rot und dem Moment, in dem das Fahrzeug die Haltlinie überfährt. War das Rot zu diesem Zeitpunkt schon länger als eine Sekunde an, gilt der höhere Satz mit ${qual.fine} Euro, ${qual.points} Punkten und Fahrverbot. Die Sekundengrenze gilt nur bei Wechsellichtzeichen, also Ampeln mit Farbwechsel.` },
      { q: 'Gibt es für das Überfahren der Haltlinie bei Rot schon ein Bußgeld?', a: `Wer nur über die Haltlinie rollt und vor dem Kreuzungsbereich stehen bleibt, hat die Ampel nach der Rechtsprechung meist noch nicht missachtet. Der Katalog sieht dafür ${halt.fine} Euro ohne Punkt vor (Haltlinie nach Zeichen 294 nicht beachtet). Wird dabei trotz Rot jemand gefährdet, sind es ${haltGef.fine} Euro und ein Punkt. Erst wer in den geschützten Bereich einfährt, begeht den eigentlichen Rotlichtverstoß.` },
      { q: 'Kostet es extra, wenn ich mit Grünpfeil abbiege, ohne anzuhalten?', a: `Ja. Der grüne Pfeil erlaubt das Abbiegen nur nach einem vollständigen Halt. Wer durchrollt, zahlt ${gpStop.fine} Euro und erhält einen Punkt. Wird der Querverkehr gefährdet, sind es ${gpGef.fine} Euro, bei Behinderung von Fußgängern oder Radfahrern auf der Furt ${gpFussB.fine} Euro und bei deren Gefährdung ${gpFussG.fine} Euro, jeweils mit Punkt. Einen Fahrverbotsregelfall gibt es beim Grünpfeil nicht.` },
      { q: 'Bekommt ein Radfahrer bei Rot auch ein Fahrverbot?', a: `Nein, der Katalog sieht für Radfahrer und E-Scooter-Fahrer kein Fahrverbot vor. Sie zahlen ${rad.fine} Euro, nach mehr als einer Sekunde Rot ${radQ.fine} Euro, mit Gefährdung bis zu ${radQG.fine} Euro und mit Sachbeschädigung bis zu ${radQS.fine} Euro. In allen Fällen kommt ein Punkt in Flensburg dazu, auch wenn die Person keinen Führerschein besitzt.` },
      { q: 'Was zahle ich insgesamt für einen qualifizierten Rotlichtverstoß mit Bescheid?', a: `Zum Regelsatz von ${qual.fine} Euro kommen nach § 107 OWiG fünf Prozent Gebühr, mindestens ${V.gebuehr_min} Euro, und ${mD(V.zustellung, 2)} für die Zustellung. Zusammen sind das ${mD(qual.total, 2)}. Daneben stehen ${qual.points} Punkte und ein Monat ohne Führerschein. War es das erste Fahrverbot seit zwei Jahren, darf der Beginn binnen ${V.fahrverbot_schonfrist_monate} Monaten selbst gewählt werden.` },
    ],
    body: (h) => `
<h2>Alle Sätze für Autofahrer</h2>
<p>Der Bußgeldkatalog fasst den Rotlichtverstoß unter Nummer 132. Die Unterscheidung nach einer Sekunde betrifft nur Ampeln, die von Grün über Gelb auf Rot schalten. Für ein dauerhaft leuchtendes Rot, etwa an einer Spursignalanlage im Tunnel, gilt der Grundsatz ohne Sekundenstufe.</p>
${h.table(['Situation', 'BKat-Nr.', 'Bußgeld', 'Punkte', 'Fahrverbot', 'mit Gebühren'],
  carRows(true).map(([t, nr, o]) => [t, nr, h.eur(o.fine), h.num(o.points), o.fv ? `${o.fv} Monat` : 'nein', h.eur(o.total, 2)]),
  'Rotlicht mit dem Kraftfahrzeug nach BKatV, Stand August 2026, Gebühren nach § 107 OWiG', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Auffällig ist der Sprung zwischen 132 und 132.3. Unter einer Sekunde liegt der Regelsatz bei ${h.eur(simple.fine)}, darüber bei ${h.eur(qual.fine)}, also mehr als doppelt so hoch, und es kommt das Fahrverbot hinzu. Der Grund steht in der Logik der Ampelschaltung: Wer nach einer Sekunde Rot noch einfährt, trifft eher auf den Querverkehr, der schon Grün bekommt oder gleich bekommt. Die Gelbphase davor soll gerade verhindern, dass jemand überhaupt in diese Lage gerät.</p>
<p>Gelb bedeutet nach § 37 StVO: vor der Kreuzung auf das nächste Zeichen warten. Wer bei Gelb noch sicher anhalten kann, muss das tun. Eine Vollbremsung, die den Hintermann in Gefahr bringt, verlangt die Regel nicht. Praktisch heißt das: Wer innerorts mit 50 km/h auf eine gerade gelb gewordene Ampel zufährt und nah an der Haltlinie ist, darf durchfahren; wer noch weit entfernt ist, bremst. Aus dieser Abwägung entstehen die meisten Fälle mit einer Rotzeit knapp unter oder knapp über einer Sekunde.</p>

<h2>Gefährdung und Sachbeschädigung</h2>
<p>Eine Gefährdung liegt vor, wenn ein anderer Verkehrsteilnehmer konkret in Gefahr geriet, etwa ein Fußgänger zurückspringen oder ein Querfahrer stark bremsen musste. Dass zufällig niemand da war, reicht dafür nicht. Sachbeschädigung meint einen tatsächlichen Schaden an einer fremden Sache, typischerweise den Unfall im Kreuzungsbereich. In beiden Fällen gibt es selbst beim einfachen Verstoß unter einer Sekunde das Fahrverbot von ${simpleG.fv} Monat und ${simpleG.points} Punkte. Beim qualifizierten Verstoß bleibt es bei einem Monat, der Betrag steigt aber auf ${h.eur(qualG.fine)} oder ${h.eur(qualS.fine)}.</p>
<p>Wichtig für den Bescheid: Die Behörde muss die Gefährdung beschreiben können. Wer nur einen Blitz an der Kreuzung hatte, ohne dass auf dem Foto oder in der Akte ein anderes Fahrzeug auftaucht, wird in aller Regel nach dem Grundtatbestand oder nach 132.3 belangt. Bei einem Unfall richtet sich der Fall dagegen oft nach dem Polizeibericht, und neben dem Bußgeld steht die zivilrechtliche Haftung gegenüber dem Unfallgegner.</p>

<h2>Fahrverbot und Punkte</h2>
<p>Alle Sätze mit Fahrverbot bringen ${qual.points} Punkte, weil die ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')} sie zu den besonders verkehrssicherheitsbeeinträchtigenden Ordnungswidrigkeiten zählt. Der einfache Verstoß ohne Folgen bringt einen Punkt. Ein Punkt wird nach zweieinhalb Jahren tilgungsreif, zwei Punkte nach fünf Jahren, jeweils ab Rechtskraft der Entscheidung. Wie der Monat ohne Führerschein abläuft und wann man den Beginn selbst wählen darf, erklärt die Seite zum ${h.a('fahrverbot', 'Fahrverbot')}. Anders als bei der Beharrlichkeit nach zwei Tempoverstößen braucht es hier keine Vorgeschichte: Das Fahrverbot folgt direkt aus der Katalognummer.</p>

<h2>Radfahrer und E-Scooter</h2>
<p>Für Fahrräder und Elektrokleinstfahrzeuge gibt es eine eigene Nummer, 132a. Die Beträge liegen niedriger, und ein Fahrverbot ist nicht vorgesehen. Punkte gibt es trotzdem, denn das Fahreignungsregister erfasst Verkehrsteilnehmer und nicht nur Führerscheininhaber.</p>
${h.table(['Situation', 'BKat-Nr.', 'Bußgeld', 'Punkte'], [
  ['Rot missachtet', '132a', h.eur(rad.fine), h.num(rad.points)],
  ['mit Gefährdung', '132a.1', h.eur(radG.fine), h.num(radG.points)],
  ['mit Sachbeschädigung', '132a.2', h.eur(radS.fine), h.num(radS.points)],
  ['Rot länger als 1 Sekunde', '132a.3', h.eur(radQ.fine), h.num(radQ.points)],
  ['länger als 1 Sekunde, mit Gefährdung', '132a.3.1', h.eur(radQG.fine), h.num(radQG.points)],
  ['länger als 1 Sekunde, mit Sachbeschädigung', '132a.3.2', h.eur(radQS.fine), h.num(radQS.points)],
], 'Rotlicht mit Fahrrad oder E-Scooter nach BKatV', ['l', 'l', 'r', 'r'])}
<p>Wer mit dem Rad über eine Fußgängerampel fährt, weil kein eigenes Radsignal da ist, missachtet in der Regel ebenfalls ein Rotlicht. Gibt es eine Radampel, gilt diese. Auch hier fallen bei einem Bescheid über ${h.eur(V.verwarnung_max)} die Gebühren an: Für ${h.eur(rad.fine)} sind es zusammen ${h.eur(rad.total, 2)}.</p>

<h2>Grünpfeil und Haltlinie</h2>
<p>Der grüne Blechpfeil neben der roten Ampel ist kein Freifahrtschein. Er erlaubt das Rechtsabbiegen bei Rot nur aus dem rechten Fahrstreifen und erst nach einem Halt. Dafür hat der Katalog eigene Nummern, die nicht als Rotlichtverstoß nach 132 zählen:</p>
${h.table(['Verhalten', 'BKat-Nr.', 'Bußgeld', 'Punkte'], [
  ['aus einem anderen als dem rechten Fahrstreifen abgebogen', '131.1', h.eur(gp1.fine!), h.num(gp1.points)],
  ['freigegebenen Fahrzeugverkehr behindert', '131.2', h.eur(gp2.fine!), h.num(gp2.points)],
  ['vor dem Abbiegen nicht angehalten', '133.1', h.eur(gpStop.fine!), h.num(gpStop.points)],
  ['freigegebenen Fahrzeugverkehr gefährdet', '133.2', h.eur(gpGef.fine!), h.num(gpGef.points)],
  ['Fußgänger oder Radfahrer auf der Furt behindert', '133.3.1', h.eur(gpFussB.fine!), h.num(gpFussB.points)],
  ['Fußgänger oder Radfahrer auf der Furt gefährdet', '133.3.2', h.eur(gpFussG.fine!), h.num(gpFussG.points)],
  ['an der Haltlinie nicht gehalten', '154', h.eur(halt.fine!), h.num(halt.points)],
  ['trotz Rot nicht an der Haltlinie gehalten, mit Gefährdung', '150', h.eur(haltGef.fine!), h.num(haltGef.points)],
], 'Grünpfeil und Haltlinie nach BKatV', ['l', 'l', 'r', 'r'])}
<p>Die Haltlinie ist der weiße Querbalken vor der Ampel. Bleibt das Fahrzeug knapp dahinter stehen, ohne in die Kreuzung einzufahren, ist das im Normalfall nur der kleine Verstoß nach 154. Ein Verwarnungsgeld bis ${h.eur(V.verwarnung_max)} kostet keine Gebühr und bringt keinen Punkt.</p>
<p>Beim Grünpfeil ist die Unterscheidung zwischen 131 und 133 mehr als Formsache. Die Nummern 131.1 und 131.2 bleiben unter der Verwarnungsgeldgrenze und erscheinen nicht im Fahreignungsregister. Ab 133.1, dem fehlenden Halt, gibt es dagegen einen Punkt, und in der Probezeit wird daraus ein A-Verstoß. Wer an einer Kreuzung mit Grünpfeil nur kurz abbremst und dann rollt, landet also im selben Verfahren wie bei einem einfachen Rotlicht, nur mit geringerem Betrag.</p>

<h2>Rotlicht in der Probezeit</h2>
<p>Die ${h.src('fevAnl12', 'Anlage 12 der Fahrerlaubnis-Verordnung')} führt Verstöße gegen Lichtzeichen bei den schwerwiegenden A-Verstößen. Für Fahranfänger zählt damit schon die einfache rote Ampel mit Punkt: Die Fahrerlaubnisbehörde ordnet ein Aufbauseminar an, und die Probezeit verlängert sich um ${PZ.verlaengerung_jahre} Jahre. Das Bußgeld selbst ist dasselbe wie für erfahrene Fahrer. Ein zweiter A-Verstoß nach dem Seminar führt zur schriftlichen Verwarnung, ein dritter zur Entziehung. Was im Einzelnen auf Fahranfänger zukommt, beschreibt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Vom Blitz zum Bescheid</h2>
<p>Feste Rotlichtanlagen lösen aus, wenn ein Fahrzeug nach Beginn der Rotphase die Haltlinie überfährt, und halten die Rotzeit fest. Daneben gibt es Fälle ohne Foto, in denen eine Polizeistreife den Verstoß beobachtet. Die Behörde schickt zuerst einen Anhörungsbogen an den Halter. Auf der Rückseite steht meist, welche Nummer vorgeworfen wird; daran lässt sich ablesen, ob von mehr als einer Sekunde ausgegangen wird.</p>
<p>Seit dem 1. Juli 2026 verjährt der Verstoß nach sechs Monaten, wenn die Verjährung nicht vorher unterbrochen wurde. Den Bescheid selbst liest man am besten Zeile für Zeile: Nummer, Rotzeit, Ort, Uhrzeit, Betrag. Gegen ihn ist binnen ${V.einspruch_wochen} Wochen nach Zustellung der Einspruch möglich; das ist ein Recht, kein Muss, und die Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')} erklärt den Ablauf.</p>
<!--mini:rotlicht-->
<h2>Fahrverbot oder kein Fahrverbot: das Nachrechnen</h2>
<p>Wer wissen möchte, was der eigene Fall kostet, gibt im ${h.a('bussgeldrechner', 'Bußgeldrechner')} die Nummer oder die Situation ein. Der Rechner nimmt den Regelsatz aus dem amtlichen ${h.src('bkatAnlage', 'Bußgeldkatalog')}, addiert die Gebühren und zeigt Punkte und Fahrverbot. Ein Beispiel zur Größenordnung: Der einfache Verstoß kostet mit allen Gebühren ${h.eur(simple.total, 2)}, der qualifizierte ${h.eur(qual.total, 2)}, der qualifizierte mit Unfall ${h.eur(qualS.total, 2)}. Der Unterschied von wenigen Zehntelsekunden ist also auch finanziell erheblich. Wie sich die Punkte auf ein bestehendes Konto auswirken, zeigt der Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>
<p>Wichtig ist auch, was nicht im Katalog steht. Vorsatz, etwa bewusstes Durchfahren trotz längst roter Ampel, erlaubt der Behörde nach § 3 Abs. 4a BKatV eine Verdoppelung des Regelsatzes. Und wer innerhalb kurzer Zeit mehrere Verstöße sammelt, landet schneller bei den Maßnahmen des Punktesystems, als der einzelne Betrag vermuten lässt.</p>`,
  },
  en: {
    slug: 'red-light-fine-germany',
    nav: 'Red light fine',
    card: 'What a red light costs in Germany: the one-second rule, cyclists, green arrow.',
    title: 'Red Light Fine Germany 2026: Points and the 1-Second Rule',
    description: `Red light fine in Germany 2026: ${mE(simple.fine)} and 1 point, or ${mE(qual.fine)}, 2 points and a ${qual.fv}-month ban if red for over a second. Cyclists, green arrow, probation rules.`,
    h1: 'Running a red light in Germany: fines, points and bans',
    intro: 'Two facts decide the penalty: how long the light had been red and whether anyone was put at risk.',
    resume: `Driving through a red traffic light in Germany costs ${simple.fine} euros and one point in the Flensburg register if the light had been red for less than a second. Past that second, the offence becomes a so-called qualified red light offence (qualifizierter Rotlichtverstoß): ${qual.fine} euros, ${qual.points} points and a ${qual.fv}-month driving ban (Fahrverbot). If someone was endangered, the fine rises to ${simpleG.fine} euros for the basic case and ${qualG.fine} euros for the qualified one; if property was damaged, to ${simpleS.fine} or ${qualS.fine} euros. A formal fine notice (Bußgeldbescheid) adds at least ${V.gebuehr_min} euros in fees and ${mE(V.zustellung, 2)} for delivery, so the basic case comes to ${mE(simple.total, 2)}. Cyclists and e-scooter riders pay ${rad.fine} euros plus a point. For drivers on probation (Probezeit), any red light offence with a point counts as a serious A offence, with a remedial course and ${PZ.verlaengerung_jahre} extra years of probation.`,
    faqs: [
      { q: 'Does a German red light camera fine apply to my rental car?', a: `Yes. The authority writes to the keeper, which for a rental is the hire company. The company passes on your details and often charges its own handling fee. You then receive the hearing form (Anhörungsbogen) and later the fine notice. The fine is the same as for residents: ${simple.fine} euros under one second, ${qual.fine} euros and a one-month ban above it.` },
      { q: 'Can I turn right on red in Germany like in the US?', a: `Only where a small green arrow sign is fixed next to the red light, and only after a full stop from the right-hand lane. There is no general right turn on red. Rolling through at a green arrow costs ${gpStop.fine} euros and one point; endangering cross traffic costs ${gpGef.fine} euros, and endangering pedestrians or cyclists on the crossing ${gpFussG.fine} euros.` },
      { q: 'How much is a red light fine on a bike in Germany?', a: `Cyclists and e-scooter riders pay ${rad.fine} euros for an ordinary red light offence and ${radQ.fine} euros if the light had been red for over a second. With danger to others it reaches up to ${radQG.fine} euros, with property damage up to ${radQS.fine} euros. Each case adds one Flensburg point, even for people without a driving licence, but there is never a driving ban.` },
      { q: 'Will a red light ban in Germany stop me driving at home in another country?', a: 'A Fahrverbot forbids driving in Germany. If you live in Germany, your licence is held by the authority for the month, including an EU licence, so in practice you cannot drive anywhere with it. If you live abroad with a non-EU licence, the ban is noted on the licence and applies on German roads; whether your home country acts on it depends on its own rules.' },
    ],
    body: (h) => `
<h2>The full table for drivers</h2>
<p>In the German fine catalogue (Bußgeldkatalog), red lights sit under number 132. The one-second distinction applies to ordinary traffic lights that change from green to amber to red. A constant red, such as a lane signal in a tunnel, is covered by the basic rows only.</p>
${h.table(['Situation', 'Cat. no.', 'Fine', 'Points', 'Ban', 'With fees'],
  carRows(false).map(([t, nr, o]) => [t, nr, h.eur(o.fine), h.num(o.points), o.fv ? `${o.fv} month` : 'no', h.eur(o.total, 2)]),
  'Red light offences with a motor vehicle, BKatV as amended August 2026, fees under Section 107 OWiG', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The figures in the last column include the fees that come with any notice above ${h.eur(V.verwarnung_max)}: five per cent of the fine, at least ${h.eur(V.gebuehr_min)}, plus ${h.eur(V.zustellung, 2)} for delivery under ${h.src('owig107', 'Section 107 of the Administrative Offences Act')}. Germany does not scale fines to income for these offences, so a student and a manager pay the same.</p>

<h2>Why one second matters so much</h2>
<p>Amber in Germany means stop if you safely can. Lights are timed so that a driver who crosses the line in the first moment of red has usually just misjudged the amber. After a full second, cross traffic or pedestrians may already be moving, so the catalogue more than doubles the fine and adds a ban. If you learned to drive in a country where amber is treated loosely, this is worth adjusting to: German junctions often have short intergreen times and many cameras.</p>
<p>A workable rule of thumb: if you are close enough to the line that braking would be abrupt, continue on amber; otherwise stop. Section 37 of the Road Traffic Regulations (StVO) says amber means wait for the next signal before the junction. It does not demand an emergency stop that puts the car behind you at risk.</p>
<p>The second is counted from the moment the light turned red until your vehicle passed the stop line. The measurement record normally states the elapsed red time, and the hearing form names the catalogue number, so you can see from the paperwork which tier the authority applied.</p>

<h2>Danger and damage</h2>
<p>Endangering someone (Gefährdung) means a real near miss: a pedestrian stepping back, a driver braking hard. An empty junction is not enough. Property damage (Sachbeschädigung) usually means a collision. Either one turns even a basic red light into a ${simpleG.fv}-month ban with ${simpleG.points} points. In a crash, the fine is only part of the picture; your liability insurance deals with the other party, and the police report often shapes the fine case too.</p>

<h2>Cyclists and e-scooters</h2>
<p>Cycling is part of daily life in many German cities, and police do check junctions. Bikes and e-scooters have their own number, 132a. There is no ban, but there are points.</p>
${h.table(['Situation', 'Cat. no.', 'Fine', 'Points'], [
  ['Red ignored', '132a', h.eur(rad.fine), h.num(rad.points)],
  ['endangering others', '132a.1', h.eur(radG.fine), h.num(radG.points)],
  ['property damaged', '132a.2', h.eur(radS.fine), h.num(radS.points)],
  ['red for over 1 second', '132a.3', h.eur(radQ.fine), h.num(radQ.points)],
  ['over 1 second, endangering others', '132a.3.1', h.eur(radQG.fine), h.num(radQG.points)],
  ['over 1 second, property damaged', '132a.3.2', h.eur(radQS.fine), h.num(radQS.points)],
], 'Red light offences on a bicycle or e-scooter', ['l', 'l', 'r', 'r'])}
<p>A point earned on a bike sits in the same register as one earned in a car. If you later apply to exchange a foreign licence for a German one, the authority can see it.</p>
<p>Two practical details catch new arrivals out. Where a junction has a separate bicycle signal, that signal binds you, not the main light for cars. Where there is only a pedestrian signal and you ride across on the crossing, the pedestrian red counts for you as well. Police in larger cities run targeted checks at busy junctions, often in the morning rush, and stop riders on the spot. A spot fine of up to ${h.eur(V.verwarnung_max)} carries no fees; above that, a notice follows by post with the usual costs, ${h.eur(rad.total, 2)} for the basic case.</p>

<h2>The green arrow and the stop line</h2>
<p>Newcomers from North America often expect to turn right on red. Germany allows it only at junctions with a small, fixed green arrow on a black plate next to the light, and only after stopping completely. Turning from the wrong lane costs ${h.eur(gp1.fine!)}, failing to stop ${h.eur(gpStop.fine!)} with a point, endangering cross traffic ${h.eur(gpGef.fine!)}, and getting in the way of pedestrians or cyclists on the crossing ${h.eur(gpFussB.fine!)}, or ${h.eur(gpFussG.fine!)} if they were endangered. None of these brings a ban.</p>
<p>The stop line is the thick white bar before the light. Stopping a little past it without entering the junction is normally treated as a minor stop-line offence at ${h.eur(halt.fine!)} and no point. If you did that against a red light and endangered someone, it is ${h.eur(haltGef.fine!)} and one point.</p>

<h2>Probation, licence exchange and residence</h2>
<p>Germany's probation period lasts ${PZ.jahre} years from your first licence. Under annex 12 of the Driving Licence Ordinance, a red light offence with a point is an A offence. One such offence means a compulsory remedial course (Aufbauseminar) and ${PZ.verlaengerung_jahre} more years of probation. If you moved here with a licence from another EU country that is less than two years old, the probation applies to you as well, with the time since your test credited. The ${h.a('probezeit-fuehrerschein', 'page on probationary licences')} sets out the stages.</p>
<p>For someone driving on a non-EU licence in the first six months of residence, the points still go on the German register, and a ban still applies on German roads. The register follows the person, not the plastic card.</p>
<!--mini:rotlicht-->
<h2>From photo to fine notice</h2>
<p>First comes a hearing form, addressed to the registered keeper. You can answer about the facts or say nothing about the offence; giving your personal details is required. Then, unless the case is dropped, a fine notice follows. You have ${V.einspruch_wochen} weeks from delivery to lodge an objection (Einspruch), which is a right the law gives you, not a recommendation. Since 1 July 2026 a traffic offence is time-barred after six months unless the authority interrupts that period, for instance by sending the hearing form. More detail on reading the letter line by line is on the ${h.a('bussgeldbescheid', 'fine notice page')}.</p>
<p>A ban from a red light follows the normal rules for bans, including the option to choose the start date within ${V.fahrverbot_schonfrist_monate} months if you had no ban in the previous two years. The ${h.a('fahrverbot', 'driving ban page')} explains how to plan around it, and the ${h.a('bussgeldrechner', 'fine calculator')} gives the total for your own case, using the official ${h.src('bkatAnlage', 'catalogue')}.</p>
<p>Points from a red light expire on a fixed schedule: two and a half years for one point, five years for two, each counted from the date the decision became final. A new offence does not extend the period of an older one. The ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} shows what happens when entries add up, starting with a written warning at four points.</p>
<p>One more point on costs abroad: if you leave Germany before paying, the fine does not simply disappear. Within the EU, fines of this size can be enforced in your home country, and the points remain on the German register until they expire.</p>`,
  },
});
