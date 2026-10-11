import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, fees } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren;
const e = (nr: string) => entry(nr).fine!;
const pt = (nr: string) => entry(nr).points;
const geh = e('52a'), gehB = e('52a.1'), gehH = e('52a.2'), gehG = e('52a.3'), gehS = e('52a.4');
const reihe = e('58'), reiheB = e('58.1'), reihe15 = e('58.2');
const feuer = e('53'), feuerR = e('53.1');
const schwer = e('55'), lade = e('55a'), car = e('55b'), halteverbot = e('52'), halten = e('51');
const p30 = e('63.1'), p60 = e('63.2'), p120 = e('63.3'), p180 = e('63.4'), pMax = e('63.5');
/** Bußgeldbescheid nach einem nicht gezahlten Verwarnungsgeld: § 107 Abs. 1 und 3 OWiG, Mindestgebühr plus Zustellung. */
const unpaid = (fine: number) => fine + Math.max(V.gebuehr_min, fine * V.gebuehr_satz) + V.zustellung;
const m = (x: number, l: 'de' | 'en', d = 0) => formatMoney(x, d, l);

export default defineGuide({
  id: 'falschparken',
  group: 'verstoesse',
  order: 70,
  mini: 'parken',
  related: ['bussgeldrechner', 'bussgeldbescheid', 'verjaehrung-bussgeld', 'punkte-in-flensburg', 'probezeit-fuehrerschein'],
  sources: ['bkatAnlage', 'owig107', 'fevAnl13', 'fevAnl12'],
  de: {
    slug: 'falschparken',
    nav: 'Falschparken',
    card: 'Parkschein, Gehweg, zweite Reihe, Feuerwehrzufahrt: was jeder Parkverstoß kostet.',
    title: 'Falschparken 2026: Bußgeld, Punkte und Halterkosten',
    description: `Falschparken 2026: Parkschein überzogen ab ${p30} €, Gehweg ${geh} €, mit Behinderung ${gehB} € und ein Punkt. Jeder Parkverstoß nach BKatV mit Gebühren und Halterkosten.`,
    h1: 'Falschparken: was ein Parkverstoß kostet',
    intro: 'Die meisten Parkverstöße enden mit einem Verwarnungsgeld ohne Gebühren und ohne Punkt, einige wenige aber nicht.',
    resume: `Ein Parkverstoß kostet nach dem Bußgeldkatalog 2026 meist zwischen ${p30} und ${geh} Euro und bleibt damit ein Verwarnungsgeld ohne Gebühren und ohne Eintrag in Flensburg. Teurer wird es, sobald jemand behindert wird: Parken auf dem Geh- oder Radweg mit Behinderung kostet ${gehB} Euro und einen Punkt, Parken in zweiter Reihe mit Behinderung ${reiheB} Euro und einen Punkt, wer ein Rettungsfahrzeug an der Feuerwehrzufahrt aufhält, zahlt ${feuerR} Euro und bekommt ebenfalls einen Punkt. Ein abgelaufener Parkschein steigt gestaffelt von ${p30} Euro bis zu ${pMax} Euro bei mehr als drei Stunden. Für Behinderten-, E-Lade- und Carsharing-Plätze gelten je ${schwer} Euro. Lässt sich nicht klären, wer gefahren ist, trägt der Halter nach § 25a StVG die Verfahrenskosten mit einer Gebühr von ${V.halterkosten_25a} Euro, aber kein Bußgeld.`,
    faqs: [
      { q: 'Was kostet es, wenn ich das Knöllchen fürs Falschparken nicht innerhalb einer Woche bezahle?', a: `Das Verwarnungsgeld wird nur wirksam, wenn es in der gesetzten Frist eingeht, die nach § 56 Abs. 2 OWiG eine Woche betragen soll. Danach kann die Behörde einen Bußgeldbescheid erlassen. Dann kommen nach § 107 OWiG mindestens ${V.gebuehr_min} Euro Gebühr und ${m(V.zustellung, 'de', 2)} Zustellung hinzu: Aus ${p30} Euro für einen knapp überzogenen Parkschein werden so ${m(unpaid(p30), 'de', 2)}.` },
      { q: 'Muss der Halter zahlen, wenn er beim Parkverstoß nicht gefahren ist?', a: `Das Bußgeld nicht. Kann die Behörde den Fahrer vor Ablauf der Verjährung nicht ermitteln oder wäre der Aufwand unangemessen, legt sie dem Halter nach § 25a StVG nur die Kosten des Verfahrens auf: eine Gebühr von ${V.halterkosten_25a} Euro nach § 107 Abs. 2 OWiG plus Auslagen. Vorher wird der Halter angehört, und gegen die Kostenentscheidung kann er binnen zwei Wochen gerichtliche Entscheidung beantragen.` },
      { q: 'Ab wann gibt es für Parken auf dem Gehweg einen Punkt?', a: `Das bloße Parken auf dem Geh- oder Radweg kostet ${geh} Euro ohne Punkt. Einen Punkt gibt es, wenn jemand behindert wird (${gehB} Euro), wenn das Auto länger als eine Stunde dort steht (${gehH} Euro), bei Gefährdung (${gehG} Euro) oder Sachbeschädigung (${gehS} Euro). In der Probezeit zählen diese Fälle als B-Verstoß nach Anlage 12 FeV.` },
      { q: 'Wie teuer ist Parken in zweiter Reihe länger als 15 Minuten?', a: `Nach dem Bußgeldkatalog sind es ${reihe15} Euro und ein Punkt, auch ohne dass jemand behindert wird. Kurzes Parken in zweiter Reihe ohne Behinderung kostet ${reihe} Euro, mit Behinderung ${reiheB} Euro und einen Punkt. Weil die ${reihe15} Euro über ${V.verwarnung_max} Euro liegen, kommt ein Bußgeldbescheid mit ${m(fees(reihe15).total, 'de', 2)} Gebühren und Zustellung, zusammen ${m(reihe15 + fees(reihe15).total, 'de', 2)}.` },
      { q: 'Was kostet es, auf einem E-Ladeplatz ohne Ladevorgang zu parken?', a: `Wer ohne Berechtigung auf einem Parkplatz für elektrisch betriebene Fahrzeuge steht, zahlt nach BKat-Nr. 55a ${lade} Euro. Gekennzeichnet ist der Platz mit Zeichen 314 oder 315 und einem Zusatzzeichen. Was als Berechtigung gilt, etwa nur während des Ladens oder mit Höchstdauer, steht auf dem Zusatzzeichen vor Ort. Punkte gibt es dafür nicht.` },
    ],
    body: (h) => `
<h2>Die Parkverstöße im Überblick</h2>
<p>Der Bußgeldkatalog fasst das Halten und Parken in den Nummern 51 bis 63 zusammen. Fast jede Nummer hat Unterfälle: mit Behinderung, länger als eine bestimmte Zeit, mit Gefährdung oder mit Sachbeschädigung. Erst diese Zusätze heben einen Verstoß über die Grenze von ${h.eur(V.verwarnung_max)}, ab der ein Bescheid mit Gebühren ergeht und Punkte möglich werden. Die Tabelle zeigt die häufigsten Fälle mit den Werten der aktuellen Fassung.</p>
${h.table(['Situation', 'BKat-Nr.', 'Regelsatz', 'Punkte', 'Mit Gebühren'], [
  ['Unzulässig gehalten', '51', h.eur(halten), pt('51'), h.eur(halten + fees(halten).total, 2)],
  ['Im Halteverbot geparkt', '52', h.eur(halteverbot), pt('52'), h.eur(halteverbot + fees(halteverbot).total, 2)],
  ['Auf Geh- oder Radweg geparkt', '52a', h.eur(geh), pt('52a'), h.eur(geh + fees(geh).total, 2)],
  ['Geh- oder Radweg, mit Behinderung', '52a.1', h.eur(gehB), pt('52a.1'), h.eur(gehB + fees(gehB).total, 2)],
  ['Feuerwehrzufahrt zugeparkt', '53', h.eur(feuer), pt('53'), h.eur(feuer + fees(feuer).total, 2)],
  ['Feuerwehrzufahrt, Rettungsfahrzeug behindert', '53.1', h.eur(feuerR), pt('53.1'), h.eur(feuerR + fees(feuerR).total, 2)],
  ['Schwerbehinderten-Parkplatz ohne Ausweis', '55', h.eur(schwer), pt('55'), h.eur(schwer + fees(schwer).total, 2)],
  ['In zweiter Reihe', '58', h.eur(reihe), pt('58'), h.eur(reihe + fees(reihe).total, 2)],
  ['Zweite Reihe, mit Behinderung', '58.1', h.eur(reiheB), pt('58.1'), h.eur(reiheB + fees(reiheB).total, 2)],
  ['Zweite Reihe, länger als 15 Minuten', '58.2', h.eur(reihe15), pt('58.2'), h.eur(reihe15 + fees(reihe15).total, 2)],
], 'Regelsätze nach der Anlage zur BKatV; Gebühren nach § 107 OWiG nur oberhalb des Verwarnungsgeldes', ['l', 'l', 'r', 'r', 'r'])}
<p>Die Spalte ganz rechts zeigt, was bei sofortiger Zahlung tatsächlich fällig wird. Bis ${h.eur(V.verwarnung_max)} ist das der Regelsatz selbst, darüber kommen die fünf Prozent Gebühr, mindestens ${h.eur(V.gebuehr_min)}, und ${h.eur(V.zustellung, 2)} für die Zustellung hinzu. Der Sprung von ${h.eur(reihe)} auf ${h.eur(reiheB + fees(reiheB).total, 2)} für dieselbe zweite Reihe, nur weil ein Bus nicht vorbeikam, ist der deutlichste Effekt dieser Grenze.</p>

<h2>Parkschein, Parkuhr und Parkscheibe</h2>
<p>Nummer 63 behandelt alle Formen der überschrittenen Parkzeit gleich: die abgelaufene Parkuhr, den fehlenden oder abgelaufenen Parkschein, die vergessene Parkscheibe und die überschrittene Höchstparkdauer. Gezählt wird die Zeit über das Erlaubte hinaus.</p>
<ul>
<li>bis 30 Minuten: ${h.eur(p30)} (63.1)</li>
<li>bis eine Stunde: ${h.eur(p60)} (63.2)</li>
<li>bis zwei Stunden: ${h.eur(p120)} (63.3)</li>
<li>bis drei Stunden: ${h.eur(p180)} (63.4)</li>
<li>länger als drei Stunden: ${h.eur(pMax)} (63.5)</li>
</ul>
<p>Alle Stufen bleiben Verwarnungsgeld. Selbst wer einen ganzen Tag ohne Ticket in der Innenstadt steht, zahlt bei sofortiger Begleichung also ${h.eur(pMax)}. Wer das Handyparken nutzt, sollte das Ende der gebuchten Zeit im Blick behalten: Die App verlängert nicht von selbst, und für den Katalog zählt allein die bezahlte Parkzeit. Kommunale Parkgebühren selbst sind kein Bußgeld und stehen nicht im Katalog.</p>

<h2>Gehweg, Radweg und Schutzstreifen</h2>
<p>Das Parken auf Geh- und Radwegen hat eine eigene Nummer, 52a, mit ${h.eur(geh)} als Grundbetrag. Die Zusätze bringen jeweils einen Punkt: Behinderung ${h.eur(gehB)}, mehr als eine Stunde ${h.eur(gehH)}, Gefährdung ${h.eur(gehG)}, Sachbeschädigung ${h.eur(gehS)}. Eine Behinderung liegt etwa vor, wenn ein Kinderwagen oder Rollstuhl auf die Fahrbahn ausweichen muss. Das Halten auf einem Schutzstreifen für den Radverkehr, der gestrichelten Linie am Fahrbahnrand, ist in Nummer 54a gesondert geregelt und kostet ${h.eur(e('54a'))}, mit Behinderung ${h.eur(e('54a.1'))} und einen Punkt.</p>
<p>Wo Gehwegparken durch Zeichen 315 oder eine Markierung erlaubt ist, gilt das alles nicht. Entscheidend ist die Beschilderung vor Ort, nicht die Gewohnheit in der Straße.</p>

<h2>Sonderparkplätze und Feuerwehrzufahrten</h2>
<p>Drei Platzarten sind mit gleichem Betrag geschützt: der Schwerbehinderten-Parkplatz (55), der Parkplatz für elektrisch betriebene Fahrzeuge (55a) und der Carsharing-Platz (55b). Unberechtigtes Parken kostet jeweils ${h.eur(schwer)}, ${h.eur(lade)} und ${h.eur(car)}, ohne Punkt. Bei der Feuerwehrzufahrt hängt die Folge davon ab, ob ein Einsatz tatsächlich behindert wurde. Ohne Einsatz sind es ${h.eur(feuer)}, mit behindertem Rettungsfahrzeug ${h.eur(feuerR)} und ein Punkt. Das Abschleppen ist in allen diesen Fällen zusätzlich möglich; seine Kosten setzen die Gemeinden fest, sie stehen nicht im Bußgeldkatalog.</p>

<h2>Halten oder Parken: drei Minuten machen den Unterschied</h2>
<p>Viele Nummern unterscheiden zwischen Halten und Parken, und das hat Folgen für den Betrag. Nach § 12 Abs. 2 StVO parkt, wer sein Fahrzeug verlässt oder länger als drei Minuten hält. Wer also im Auto sitzen bleibt und nach zwei Minuten weiterfährt, hält nur. Im eingeschränkten Halteverbot ist das kurze Ein- und Aussteigen oder Be- und Entladen erlaubt, im absoluten Halteverbot nicht einmal das. Unzulässiges Halten kostet nach Nummer 51 ${h.eur(halten)}, mit Behinderung ${h.eur(e('51.1'))}. Wer dort parkt, wo schon das Halten verboten ist, zahlt nach Nummer 52 ${h.eur(halteverbot)}, mit Behinderung ${h.eur(e('52.1'))}, nach mehr als einer Stunde ${h.eur(e('52.2'))}. Der Warnblinker ändert an dieser Einordnung nichts.</p>

<h2>Supermarkt, Parkhaus, Hinterhof: kein Bußgeld, sondern Vertrag</h2>
<p>Der Bußgeldkatalog gilt nur im öffentlichen Verkehrsraum. Auf dem Kundenparkplatz eines Supermarkts oder im privaten Parkhaus verlangt der Betreiber bei überschrittener Parkzeit eine Vertragsstrafe oder ein erhöhtes Parkentgelt. Das ist eine zivilrechtliche Forderung, kein Verwarnungsgeld. Sie bringt keine Punkte, verjährt nach den Regeln des Zivilrechts und wird nicht von einer Bußgeldstelle eingetrieben. Woran man den Unterschied erkennt: Ein amtlicher Zettel nennt eine Behörde, meist das Ordnungsamt, eine Tatbestandsnummer und ein Aktenzeichen. Ein privates Schreiben kommt von einem Unternehmen und verweist auf die Parkordnung am Eingang.</p>

<h2>Ein Rechenbeispiel aus dem Alltag</h2>
<p>Ein Lieferwagen kommt nicht vorbei, weil vor der Apotheke jemand in zweiter Reihe steht, und das Ordnungsamt notiert die Behinderung. Das ist Nummer 58.1 mit ${h.eur(reiheB)} und einem Punkt. Da der Betrag über ${h.eur(V.verwarnung_max)} liegt, gibt es keinen Zettel zum Sofortzahlen, sondern einen Bescheid: ${h.eur(fees(reiheB).gebuehr)} Gebühr und ${h.eur(V.zustellung, 2)} Zustellung kommen hinzu, zusammen ${h.eur(reiheB + fees(reiheB).total, 2)}. Ohne den Lieferwagen wären es ${h.eur(reihe)} gewesen, ohne Eintrag. Wer zusätzlich länger als eine Viertelstunde stand, landet bei Nummer 58.2.1 mit ${h.eur(e('58.2.1'))}.</p>

<h2>Den Zettel richtig lesen</h2>
<p>Ein amtlicher Hinweis enthält Tag, Uhrzeit, Ort, Kennzeichen und den Tatvorwurf mit der Nummer aus dem Katalog. Lohnend ist der Abgleich mit der Tabelle oben: Steht dort ein Zusatz wie „mit Behinderung“, muss die Behinderung auch beschrieben sein, denn erst sie rechtfertigt den höheren Betrag. Die Zahlungsfrist auf dem Zettel ist kürzer als die Einspruchsfrist gegen einen späteren Bescheid, die ${V.einspruch_wochen} Wochen beträgt. Wer bewusst nicht zahlt, wählt damit den förmlichen Weg mit Anhörung und Gebühren.</p>

<h2>Warum Parkverstöße fast nie Punkte bringen</h2>
<p>Punkte gibt es nur für Verstöße aus ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')}. Dort stehen die Parkverstöße nur mit ihren Zusätzen, also mit Behinderung, Gefährdung oder langer Dauer. Ein Verwarnungsgeld bis ${h.eur(V.verwarnung_max)} wird außerdem nie ins Fahreignungsregister eingetragen. Wer seinen Stand kennen will, findet die Regeln im ${h.a('punkte-in-flensburg', 'Überblick zu den Punkten in Flensburg')}.</p>
<p>In der Probezeit zählen die Parkverstöße mit Punkt als B-Verstöße nach ${h.src('fevAnl12', 'Anlage 12 FeV')}. Zwei davon führen zum Aufbauseminar, wie auf der Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')} beschrieben.</p>

<h2>Wer zahlt: Fahrer oder Halter</h2>
<p>Das Bußgeld trifft immer den Fahrer. Am Windschutzscheibenzettel steht aber kein Name, und die Behörde schreibt deshalb den Halter an. Nennt der Halter niemanden und lässt sich der Fahrer nicht mit vertretbarem Aufwand ermitteln, greift § 25a StVG. Die Behörde stellt das Verfahren ein und legt dem Halter die Kosten auf, mit einer Gebühr von ${h.eur(V.halterkosten_25a)} nach ${h.src('owig107', '§ 107 Abs. 2 OWiG')} und den Auslagen. Das gilt ausschließlich für Halt- und Parkverstöße, nicht für Blitzer oder Rotlicht. Gegen die Kostenentscheidung kann binnen zwei Wochen gerichtliche Entscheidung beantragt werden.</p>
<p>Für Firmenwagen und Mietwagen gilt dasselbe: Der Halter ist das Unternehmen, das die Kosten oft an den Nutzer weitergibt, wenn der Vertrag das vorsieht.</p>

<h2>Verwarnung, Bescheid und Fristen</h2>
<p>Das Verwarnungsgeld ist ein Angebot. Es wird nach § 56 OWiG nur wirksam, wenn der Betroffene einverstanden ist und fristgerecht zahlt, und es kostet keine Gebühren. Bleibt die Zahlung aus, folgt meist ein Anhörungsbogen und später ein ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}. Dann gilt die Mindestgebühr von ${h.eur(V.gebuehr_min)} auch für kleine Beträge: Aus einem Parkschein für ${h.eur(p30)} werden ${h.eur(unpaid(p30), 2)}.</p>
<p>Auch Parkverstöße verjähren nach ${V.verjaehrung_monate} Monaten, wenn die Behörde die Frist nicht unterbricht. Wie Anhörung und Bescheid die Frist neu starten, erklärt die Seite zur ${h.a('verjaehrung-bussgeld', 'Verjährung von Bußgeldern')}. Jeden anderen Verstoß rechnet der ${h.a('bussgeldrechner', 'Bußgeldrechner')} mit Gebühren durch.</p>`,
  },
  en: {
    slug: 'parking-fines-germany',
    nav: 'Parking fines',
    card: 'Expired tickets, pavements, double parking, fire lanes: what each parking offence costs.',
    title: 'Parking Fines Germany 2026: Pavements, Tickets, Points',
    description: `Parking fines in Germany 2026: expired ticket from ${m(p30, 'en')}, pavement ${m(geh, 'en')}, obstructing ${m(gehB, 'en')} and a point. Every parking offence with fees and the keeper rule.`,
    h1: 'Parking fines in Germany: what each offence costs',
    intro: 'The yellow slip under your wiper is usually a warning fine with no fees and no points; a handful of cases cost more.',
    resume: `Most parking offences in Germany cost between ${p30} and ${geh} euros in 2026 and are dealt with as a Verwarnungsgeld, a warning fine that carries no fees and no Flensburg points. The price jumps when someone is obstructed: parking on a pavement or cycle path in a way that blocks others costs ${gehB} euros and one point (catalogue no. 52a.1), double parking that obstructs traffic ${reiheB} euros and one point, and blocking a fire service access while an emergency vehicle needs it ${feuerR} euros and one point. An expired pay-and-display ticket starts at ${p30} euros and reaches ${pMax} euros after more than three hours. Disabled bays, EV charging bays and car-sharing bays each cost ${schwer} euros. If the authority cannot find out who parked, the registered keeper pays only the procedure costs under Section 25a of the Road Traffic Act, a fee of ${V.halterkosten_25a} euros, never the fine itself.`,
    faqs: [
      { q: 'I found a parking ticket on a rental car in Germany. Who pays it?', a: `The fine is owed by the driver. The authority writes to the registered keeper, which for a rental is the hire company, and the company usually passes on your details or recharges you under its contract. If the driver cannot be identified, Section 25a StVG lets the authority charge the keeper only the procedure costs, a ${V.halterkosten_25a}-euro fee plus expenses, not the fine.` },
      { q: 'Does a German parking fine go on my licence record?', a: `Almost never. Warning fines up to ${V.verwarnung_max} euros are not entered in the Flensburg register at all. Points only arise for the aggravated cases listed in annex 13 of the Driving Licence Ordinance, such as obstructing others on a pavement (${gehB} euros, one point) or double parking for more than 15 minutes (${reihe15} euros, one point).` },
      { q: 'What happens if I ignore a German parking ticket because I am leaving the country?', a: `The warning fine lapses if it is not paid within the period set, normally a week. The authority can then issue a formal fine notice with at least ${V.gebuehr_min} euros fee and ${m(V.zustellung, 'en', 2)} delivery costs, so a ${p30}-euro ticket becomes ${m(unpaid(p30), 'en', 2)}. The case stays open after you leave, and the notice can still be sent to the address the authority has on file.` },
      { q: 'Can I park on the pavement in Germany if other cars do?', a: `Only where a sign (traffic sign 315) or road markings allow it. Otherwise pavement parking costs ${geh} euros, and ${gehB} euros plus a point if pedestrians, prams or wheelchairs are forced onto the road. Leaving the car there for more than an hour also brings a point (${gehH} euros). What neighbours do makes no difference to the catalogue.` },
    ],
    body: (h) => `
<h2>What you pay, case by case</h2>
<p>German parking penalties come from the national fine catalogue (Bußgeldkatalog), numbers 51 to 63. Cities do not set their own fines; they only enforce the national amounts. Each basic offence has variants for obstructing others, for staying too long, for endangering someone or for causing damage, and those variants decide whether you pay a small warning fine or receive a formal notice with fees. The cases newcomers meet most often:</p>
${h.table(['Situation', 'BKat no.', 'Fine', 'Points', 'Total with fees'], [
  ['Expired ticket, up to 30 min', '63.1', h.eur(p30), pt('63.1'), h.eur(p30 + fees(p30).total, 2)],
  ['Expired ticket, over 3 hours', '63.5', h.eur(pMax), pt('63.5'), h.eur(pMax + fees(pMax).total, 2)],
  ['Parked where stopping is banned', '52', h.eur(halteverbot), pt('52'), h.eur(halteverbot + fees(halteverbot).total, 2)],
  ['On a pavement or cycle path', '52a', h.eur(geh), pt('52a'), h.eur(geh + fees(geh).total, 2)],
  ['Pavement or cycle path, obstructing', '52a.1', h.eur(gehB), pt('52a.1'), h.eur(gehB + fees(gehB).total, 2)],
  ['Disabled bay without a blue badge', '55', h.eur(schwer), pt('55'), h.eur(schwer + fees(schwer).total, 2)],
  ['EV charging bay without right to use it', '55a', h.eur(lade), pt('55a'), h.eur(lade + fees(lade).total, 2)],
  ['Double parked, obstructing', '58.1', h.eur(reiheB), pt('58.1'), h.eur(reiheB + fees(reiheB).total, 2)],
  ['Double parked for over 15 minutes', '58.2', h.eur(reihe15), pt('58.2'), h.eur(reihe15 + fees(reihe15).total, 2)],
  ['Fire access, emergency vehicle held up', '53.1', h.eur(feuerR), pt('53.1'), h.eur(feuerR + fees(feuerR).total, 2)],
], 'Standard fines from the BKatV annex; fees under Section 107 OWiG apply only above the warning-fine limit', ['l', 'l', 'r', 'r', 'r'])}
<p>The last column is what you actually transfer. Up to ${h.eur(V.verwarnung_max)} it equals the fine. Above that limit the authority adds five per cent as a fee, at least ${h.eur(V.gebuehr_min)}, and ${h.eur(V.zustellung, 2)} for delivering the notice.</p>

<h2>Reading the slip under your wiper</h2>
<p>A parking officer from the local Ordnungsamt (public order office) leaves a note with the offence, the time and often a reference number for an online payment. That note is an offer of a warning fine under Section 56 of the Administrative Offences Act (OWiG). It becomes binding only if you pay within the period stated, which the law says should normally be one week. No fees are charged at this stage. If you pay the wrong reference or miss the date, a letter to the keeper follows, and later possibly a fine notice with the minimum fee, which is how ${h.eur(p30)} turns into ${h.eur(unpaid(p30), 2)}. For the steps after that, see the page on the ${h.a('bussgeldbescheid', 'German fine notice')}.</p>

<h2>Pay-and-display, apps and parking discs</h2>
<p>Germany uses three systems side by side: ticket machines, phone apps and the blue parking disc (Parkscheibe) that you set to your arrival time in zones with a free maximum stay. Catalogue number 63 treats them all alike and charges by how long you overstayed: ${h.eur(p30)} up to half an hour, ${h.eur(p60)} up to an hour, ${h.eur(p120)} up to two hours, ${h.eur(p180)} up to three and ${h.eur(pMax)} beyond. Parking without a disc where one is required falls under the same number, so it is worth checking the glovebox of a hire car before you set off.</p>

<h2>Pavements, cycle lanes and double parking</h2>
<p>Parking with two wheels on the kerb is common in older streets, but it is allowed only where a blue sign showing a car on the pavement, or painted bays, permit it. Without that, it costs ${h.eur(geh)}. Blocking pedestrians, staying more than an hour, endangering someone or causing damage each bring one point and ${h.eur(gehB)} to ${h.eur(gehS)}. Stopping on an advisory cycle lane, the dashed line along the edge of the road, has its own entry (54a): ${h.eur(e('54a'))}, or ${h.eur(e('54a.1'))} and a point if a cyclist has to swerve.</p>
<p>Double parking for a quick delivery is ${h.eur(reihe)}. If a bus or a neighbour cannot get out, it is ${h.eur(reiheB)} and a point, and after 15 minutes it is ${h.eur(reihe15)} and a point even if nobody was held up.</p>

<h2>Reserved bays and fire lanes</h2>
<p>Disabled bays need the blue EU parking card issued in Germany or another EU country. Charging bays are marked with an electric-car symbol and an extra sign that says who may use them, often only while charging. Car-sharing bays are reserved for the operator named on the sign. Each costs ${h.eur(schwer)} without a point. Fire service access routes, marked Feuerwehrzufahrt, cost ${h.eur(feuer)}; if a fire engine or ambulance is actually blocked, ${h.eur(feuerR)} and a point. Towing is possible on top in all these cases, and the towing charge is set locally, not by the catalogue.</p>

<h2>Stopping is not parking</h2>
<p>German rules draw a line at three minutes. Under Section 12(2) of the Road Traffic Regulations (StVO), you park as soon as you leave the vehicle or stop for longer than three minutes; anything shorter with you at the wheel is stopping. The difference matters on streets with a no-stopping sign (a red cross on blue) and those with a restricted-stopping sign (a single red diagonal), where dropping someone off or loading is allowed but leaving the car is not. Stopping where it is banned costs ${h.eur(halten)}, or ${h.eur(e('51.1'))} if you obstruct traffic. Parking where even stopping is banned costs ${h.eur(halteverbot)}, ${h.eur(e('52.1'))} with obstruction and ${h.eur(e('52.2'))} after an hour. Hazard lights do not turn parking into stopping.</p>

<h2>Supermarket car parks and private garages</h2>
<p>The national catalogue covers public roads only. In a supermarket car park, a private multi-storey or the courtyard behind an apartment block, the operator enforces its own terms and may claim a contractual penalty for overstaying. That claim is a private debt, not a fine: it brings no points, is not collected by a public authority and follows civil-law time limits. An official ticket names a public office, usually the Ordnungsamt or the police, quotes an offence number and gives a file reference. A private notice comes from a company and points to the terms displayed at the entrance.</p>

<h2>Residents' parking zones</h2>
<p>Many inner-city districts reserve kerbside spaces for residents with a permit (Bewohnerparkausweis), shown by a blue parking sign with an extra panel. Once you register your address in such a district, you can apply for a permit at the local office. Until then, read the extra panel closely: some zones let non-residents park with a ticket during set hours, others not at all. Either way the catalogue amounts for these cases stay at warning-fine level unless you also obstruct someone.</p>

<h2>A worked example</h2>
<p>Say you double-park outside a bakery, a delivery van cannot pass and an officer notes it. That is number 58.1: ${h.eur(reiheB)} and one point. Because the amount is above ${h.eur(V.verwarnung_max)}, you receive a formal notice rather than a slip, with a fee of ${h.eur(fees(reiheB).gebuehr)} and ${h.eur(V.zustellung, 2)} for delivery, ${h.eur(reiheB + fees(reiheB).total, 2)} in all. The same stop without the van would have cost ${h.eur(reihe)} and left no trace in Flensburg. Any other offence can be run through the ${h.a('bussgeldrechner', 'fine calculator')}.</p>

<h2>Points and the probation period</h2>
<p>Only the aggravated parking cases appear in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, which lists the offences that carry points. If you are in your two-year Probezeit (probation for new licence holders, which also applies when you move to Germany with a recently obtained EU licence), these count as B offences under ${h.src('fevAnl12', 'annex 12')}. Two B offences mean a compulsory remedial course; the details are on the ${h.a('probezeit-fuehrerschein', 'probationary licence page')}. To see how points add up, read the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')}.</p>

<h2>Company cars and the keeper rule</h2>
<p>A parking fine is a personal penalty, so the driver pays it. When nobody owns up, Section 25a of the Road Traffic Act lets the authority close the case and charge the keeper the costs, with a flat fee of ${h.eur(V.halterkosten_25a)} under ${h.src('owig107', 'Section 107(2) OWiG')} plus expenses. The rule covers stopping and parking only; speed cameras and red lights are handled differently. Employers who run a fleet often pass this charge on to the employee who had the car. Parking cases also become time-barred after ${V.verjaehrung_monate} months unless the authority interrupts the period, which the page on ${h.a('verjaehrung-bussgeld', 'limitation periods')} explains.</p>`,
  },
});
