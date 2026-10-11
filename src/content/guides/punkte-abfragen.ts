import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { tilgung, pointsAt } from '../../lib/engine/punkte';
import { formatDecimal } from '../../lib/format';

const K = P.punkte;
const J = (m: number) => m / 12;
const jd = (m: number) => formatDecimal(m / 12, 1, 'de');
const je = (m: number) => formatDecimal(m / 12, 1, 'en');
const de = (iso: string) => { const [y, m, d] = iso.split('-'); return `${d}.${m}.${y}`; };
const enD = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** Beispiele : Rechtskraft d'un point (vitesse), de deux points (Fahrverbot), de trois points (Straftat). */
const ex1 = tilgung('2024-03-14', 1), ex2 = tilgung('2023-09-05', 2), ex3 = tilgung('2019-11-20', 3);
const exOld = tilgung('2023-06-01', 1);
/** Exemple DE : trois inscriptions, total au 11.10.2026 et au 1.6.2028. */
const listDe = [{ rechtskraft: '2023-02-10', points: 1 as const }, { rechtskraft: '2024-07-01', points: 2 as const }, { rechtskraft: '2025-11-20', points: 1 as const }];
const deHeute = pointsAt(listDe, '2026-10-11'), deSpaeter = pointsAt(listDe, '2028-06-01');
/** Exemple EN : un point qui expire quelques jours après la date de référence. */
const listEn = [{ rechtskraft: '2022-12-01', points: 2 as const }, { rechtskraft: '2024-04-15', points: 1 as const }, { rechtskraft: '2026-02-03', points: 1 as const }];
const enNow = pointsAt(listEn, '2026-10-11'), enLater = pointsAt(listEn, '2026-11-01');

export default defineGuide({
  id: 'punkte-abfragen',
  group: 'punkte',
  order: 20,
  mini: 'tilgung',
  miniHref: 'punkterechner',
  related: ['punkte-in-flensburg', 'punkterechner', 'punkteabbau', 'probezeit-fuehrerschein', 'bussgeldbescheid'],
  sources: ['kbaAuskunft', 'stvg29', 'kbaFaer'],
  de: {
    slug: 'punkte-abfragen',
    nav: 'Punkte abfragen',
    card: 'Kostenlose Auskunft beim KBA: online, per Post oder vor Ort, und wie man die Daten liest.',
    title: 'Punkte in Flensburg abfragen 2026: kostenlos beim KBA',
    description: `Punkte in Flensburg abfragen 2026: kostenlos beim KBA online mit eID, per Post oder vor Ort. Tilgung nach ${jd(K.tilgung_1p_monate)}, ${jd(K.tilgung_2p_monate)} oder ${jd(K.tilgung_3p_monate)} Jahren plus ${jd(K.ueberliege_monate)} Jahr Überliegefrist.`,
    h1: 'Punkte in Flensburg abfragen: so kommt die Auskunft',
    intro: 'Die Auskunft aus dem Fahreignungsregister ist gesetzlich gebührenfrei, und jeder bekommt sie nur über sich selbst.',
    resume: `Den eigenen Punktestand in Flensburg erfahren Sie beim Kraftfahrt-Bundesamt, und zwar kostenlos: § 30 Abs. 8 StVG schreibt vor, dass Betroffene auf Antrag unentgeltlich Auskunft über ihre Eintragungen und die Zahl der Punkte erhalten. Drei Wege stehen offen. Online mit der Online-Ausweisfunktion des Personalausweises, der eID-Karte für EU-Bürger oder des elektronischen Aufenthaltstitels, das Ergebnis kommt als PDF. Schriftlich an das Kraftfahrt-Bundesamt, 24932 Flensburg, eigenhändig unterschrieben und mit einer Kopie von Vorder- und Rückseite des Ausweises oder einer amtlich beglaubigten Unterschrift. Oder persönlich in der Fördestraße 16 in 24944 Flensburg. Für das Lesen der Auskunft ist das Datum der Rechtskraft entscheidend: Ab diesem Tag läuft die Tilgungsfrist von ${jd(K.tilgung_1p_monate)} Jahren für einen Punkt, ${jd(K.tilgung_2p_monate)} Jahren für zwei und ${jd(K.tilgung_3p_monate)} Jahren für drei Punkte, danach folgt noch ein Jahr Überliegefrist.`,
    faqs: [
      { q: 'Kann ich meinen Punktestand in Flensburg online abfragen?', a: 'Ja, wenn Ihr Ausweisdokument die Online-Ausweisfunktion hat und sie freigeschaltet ist. Das gilt für den deutschen Personalausweis, die eID-Karte für Bürger der EU und des EWR und den elektronischen Aufenthaltstitel (§ 30 Abs. 8 Satz 3 StVG). Sie melden sich über die AusweisApp an, geben die PIN ein und erhalten die Auskunft als PDF. Ohne aktivierte Funktion bleibt der Weg per Post.' },
      { q: 'Was kostet die Auskunft aus dem Fahreignungsregister?', a: 'Nichts. § 30 Abs. 8 StVG sagt wörtlich, dass die Auskunft unentgeltlich erteilt wird, und das KBA bezeichnet sie als gebührenfrei. Das gilt für alle drei Wege, also online, per Post und am Schalter in Flensburg. Kosten entstehen höchstens für eine amtliche Beglaubigung der Unterschrift, wenn Sie keine Ausweiskopie beilegen möchten, oder wenn Sie einen privaten Dienst mit dem Antrag beauftragen.' },
      { q: 'Warum steht ein getilgter Punkt noch in meiner Flensburg-Auskunft?', a: `Weil nach der Tilgungsreife noch die Überliegefrist von ${jd(K.ueberliege_monate)} Jahr läuft (§ 29 Abs. 6 StVG). In dieser Zeit bleibt der Eintrag gespeichert und darf Ihnen ausdrücklich mitgeteilt werden. Für neue Taten zählt er nicht mehr, wohl aber für eine Tat, die Sie vor der Tilgungsreife begangen haben und die erst später rechtskräftig wurde. Bei Fahranfängern bleibt er zudem gespeichert, solange die Probezeit läuft.` },
      { q: 'Welche Unterlagen braucht der schriftliche Antrag auf Punkteauskunft?', a: 'Einen formlosen Antrag mit Name, Geburtsname, Geburtsdatum, Geburtsort und Anschrift, eigenhändig unterschrieben, dazu eine gut lesbare Kopie der Vorder- und Rückseite des Personalausweises oder Passes. Statt der Kopie genügt eine amtlich beglaubigte Unterschrift. Das KBA verlangt den Identitätsnachweis, weil § 30 Abs. 8 StVG ihn vorschreibt; ohne ihn wird keine Auskunft erteilt.' },
      { q: 'Darf mein Arbeitgeber meine Punkte in Flensburg abfragen?', a: 'Nein. Die Auskunft nach § 30 Abs. 8 StVG erhält nur die betroffene Person. Andere Stellen bekommen Daten aus dem Register nur in den Fällen, die § 30 StVG aufzählt, etwa Gerichte, Bußgeldstellen, Fahrerlaubnisbehörden oder Stellen für Personenbeförderung und Güterkraftverkehr. Ein privater Arbeitgeber gehört nicht dazu. Er kann Sie bitten, selbst eine Auskunft vorzulegen; ob Sie das tun, entscheiden Sie.' },
    ],
    body: (h) => `
<h2>Wer Auskunft bekommt und was sie kostet</h2>
<p>Die Rechtsgrundlage ist kurz: Nach § 30 Abs. 8 StVG wird der betroffenen Person auf Antrag schriftlich und unentgeltlich mitgeteilt, was über sie im Fahreignungsregister steht und wie viele Punkte sich daraus ergeben. Der Antrag braucht einen Identitätsnachweis, und wer schriftlich fragt, muss eigenhändig unterschreiben. Eine Begründung ist nicht nötig. Sie können also jederzeit nachsehen, auch ohne laufendes Verfahren, etwa vor einer Bewerbung als Berufskraftfahrer oder einfach aus Neugier nach dem dritten Blitzerfoto im Jahr. Das ${h.src('kbaAuskunft', 'Kraftfahrt-Bundesamt')} beschreibt die Auskunft als gebührenfrei.</p>
<p>Im Netz werben Dienste, die gegen Bezahlung „Punkte abfragen“. Sie leiten im Kern denselben Antrag an das KBA weiter, den Sie selbst kostenlos stellen können, und erhalten dafür Ihre Ausweisdaten. Eine schnellere oder vollständigere Auskunft gibt es auf diesem Weg nicht, denn die Behörde antwortet nur der betroffenen Person.</p>

<h2>Weg 1: online mit dem elektronischen Ausweis</h2>
<p>Am schnellsten geht es mit der Online-Ausweisfunktion. Das Gesetz lässt die elektronische Auskunft zu, wenn der Antrag mit dem elektronischen Identitätsnachweis gestellt wird, und nennt drei Dokumente: den Personalausweis, die eID-Karte für Staatsangehörige der EU und des EWR und den elektronischen Aufenthaltstitel. Sie brauchen ein Smartphone mit NFC oder einen Kartenleser, die AusweisApp und die sechsstellige PIN. Nach der Anmeldung auf der Seite des KBA liest die App die Daten aus dem Chip, und die Auskunft steht als PDF zum Herunterladen bereit.</p>
<p>Wer die PIN vergessen oder die Funktion nie aktiviert hat, wendet sich an die Behörde, die das Dokument ausgestellt hat, beim Personalausweis also an das Bürgeramt, beim Aufenthaltstitel an die Ausländerbehörde. Bis dahin bleibt der Postweg, der zum selben Ergebnis führt.</p>

<h2>Weg 2: per Post</h2>
<p>Der schriftliche Antrag ist formlos. Ein Brief mit vollständigem Namen, gegebenenfalls Geburtsnamen, Geburtsdatum und Geburtsort, aktueller Anschrift und der Bitte um Auskunft aus dem Fahreignungsregister genügt. Entscheidend sind zwei Dinge: die eigenhändige Unterschrift und der Identitätsnachweis. Legen Sie eine Kopie von Vorder- und Rückseite des Ausweises bei, oder lassen Sie die Unterschrift amtlich beglaubigen. Die Anschrift lautet Kraftfahrt-Bundesamt, 24932 Flensburg. Die Antwort kommt per Post an die angegebene Adresse.</p>
<p>Die Kopie dient nur dem Abgleich mit Ihren Angaben im Antrag. Name, Geburtsdatum, Anschrift und Foto sollten deshalb gut lesbar sein; stimmen Antrag und Ausweis nicht überein, etwa nach einem Umzug ohne geänderte Adresse im Dokument, hilft ein kurzer Hinweis im Brief.</p>

<h2>Weg 3: persönlich in Flensburg</h2>
<p>Wer in der Nähe wohnt oder ohnehin an der Förde ist, kann die Auskunft auch am Dienstsitz des KBA in der Fördestraße 16, 24944 Flensburg, beantragen. Mitzubringen ist ein gültiger Personalausweis oder Pass. Für die meisten Menschen ist dieser Weg eher eine Ausnahme, denn online und per Post kommt dasselbe Ergebnis ins Haus.</p>

<h2>Was in der Auskunft steht</h2>
<p>Die Auskunft gibt den Inhalt des Registers zu Ihrer Person wieder. Das sind die rechtskräftigen Entscheidungen über Verkehrsverstöße mit Punkten und über Verkehrsstraftaten, Fahrverbote, Entziehungen und Sperren, außerdem Maßnahmen wie Ermahnung oder Verwarnung und die Teilnahme an Seminaren. Hinzu kommt der Punktestand. Welche Angaben zu jeder Entscheidung gespeichert werden, listet § 59 FeV auf: die entscheidende Stelle mit Aktenzeichen und Datum, Ort, Tag und Uhrzeit der Tat, der Tag der Rechtskraft, die verhängte Geldbuße oder das Fahrverbot und die Einstufung mit einem, zwei oder drei Punkten. Bei einem Seminar sind der Tag der Beendigung, der Tag der Teilnahmebescheinigung und der Tag der Vorlage bei der Behörde vermerkt, außerdem ein gewährter Punktabzug. Nicht enthalten sind Verwarnungsgelder bis ${h.eur(P.verfahren.verwarnung_max)} und alles, was noch nicht rechtskräftig ist. Ein Bußgeldbescheid, gegen den Sie gerade Einspruch eingelegt haben, taucht also erst auf, wenn das Verfahren abgeschlossen ist. Wie ein Bescheid aufgebaut ist und wann er rechtskräftig wird, erklärt die Seite zum ${h.a('bussgeldbescheid', 'Bußgeldbescheid')}.</p>

<h2>Die Daten richtig lesen</h2>
<p>Bei jeder Eintragung sind zwei Daten wichtig, die man leicht verwechselt. Der Tattag ist der Tag des Verstoßes. Der Tag der Rechtskraft ist der Tag, an dem die Entscheidung unanfechtbar wurde, beim Bußgeldbescheid meist zwei Wochen nach der Zustellung. Für das Ende eines Eintrags zählt nach ${h.src('stvg29', '§ 29 Abs. 4 StVG')} nur der zweite.</p>
${h.table(['Eintrag', 'Rechtskraft', 'Frist', 'tilgungsreif', 'endgültig gelöscht'], [
  ['1 Punkt, Geschwindigkeit', h.date('2024-03-14'), `${h.num(J(ex1.monate), 1)} Jahre`, h.date(ex1.tilgungsreif), h.date(ex1.geloescht)],
  ['2 Punkte, Fahrverbot', h.date('2023-09-05'), `${h.num(J(ex2.monate))} Jahre`, h.date(ex2.tilgungsreif), h.date(ex2.geloescht)],
  ['3 Punkte, Straftat mit Entziehung', h.date('2019-11-20'), `${h.num(J(ex3.monate))} Jahre`, h.date(ex3.tilgungsreif), h.date(ex3.geloescht)],
], 'Beispiele nach § 29 Abs. 1, 4 und 6 StVG, berechnet mit dem Tilgungsmodul dieses Rechners', ['l', 'r', 'r', 'r', 'r'])}
<p>Zum Datum der Tilgungsreife zählt der Eintrag nicht mehr für neue Taten. Gelöscht wird er aber erst nach der Überliegefrist von einem Jahr. In dieser Zeit erscheint er weiter in Ihrer Auskunft, und zwar mit Absicht: § 29 Abs. 6 StVG erlaubt die Mitteilung an Sie ausdrücklich. Wer seine Auskunft durchzählt und auf mehr Punkte kommt als erwartet, sollte deshalb zuerst prüfen, ob ein Eintrag schon tilgungsreif ist. Den Gesamtstand an einem bestimmten Stichtag rechnet der ${h.a('punkterechner', 'Punkterechner')} aus, wenn Sie alle Einträge mit ihren Daten eingeben.</p>
<h3>Zwei Sonderfälle</h3>
<p>Eine Entziehung oder Sperre verschiebt den Fristbeginn: Er liegt dann erst bei der Neuerteilung der Fahrerlaubnis, spätestens fünf Jahre nach der Rechtskraft (§ 29 Abs. 5 StVG). Und bei Fahranfängern unterbleibt die Löschung von Ordnungswidrigkeiten mit Punkten, solange jemand im Zentralen Fahrerlaubnisregister als Inhaber einer Fahrerlaubnis auf Probe gespeichert ist. Wer also in der verlängerten ${h.a('probezeit-fuehrerschein', 'Probezeit')} ist, sieht alte Einträge länger, als die Tabelle vermuten lässt.</p>

<h2>Beispiel: eine Auskunft durchrechnen</h2>
<p>Angenommen, Ihre Auskunft nennt drei Entscheidungen. Ein Punkt für ein Rotlicht, rechtskräftig am ${h.date('2023-02-10')}. Zwei Punkte für 31 km/h zu schnell innerorts mit Fahrverbot, rechtskräftig am ${h.date('2024-07-01')}. Und ein Punkt für das Handy am Steuer, rechtskräftig am ${h.date('2025-11-20')}. Der erste Eintrag ist seit dem ${h.date(tilgung('2023-02-10', 1).tilgungsreif)} tilgungsreif und steht nur noch wegen der Überliegefrist in der Liste. Am ${h.date('2026-10-11')} zählen also ${h.num(deHeute)} Punkte, nicht vier. Am ${h.date('2028-06-01')} ist auch der Handy-Punkt abgelaufen, dann bleiben ${h.num(deSpaeter)} Punkte aus dem Fahrverbot, die erst am ${h.date(tilgung('2024-07-01', 2).tilgungsreif)} tilgungsreif werden.</p>
<p>Das Beispiel zeigt, warum die bloße Summe aller Zeilen täuscht. Jede Eintragung hat ihre eigene Frist, und seit der Reform von 2014 hemmt ein neuer Verstoß den Ablauf älterer Einträge nicht mehr. Für eine Maßnahme der Behörde zählt allerdings der Stand am Tag der letzten Tat, nicht der Stand am Tag der Auskunft. Wie die Stufen bei vier, sechs und acht Punkten greifen, erklärt der Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>

<h2>Wenn ein Eintrag nicht zu Ihnen passt</h2>
<p>Gerichte und Bußgeldstellen melden ihre Entscheidungen dem KBA, und das Amt ordnet sie anhand der Personendaten zu. Bei Zweifeln an der Identität darf es dafür nach § 28 Abs. 5 StVG das Zentrale Fahrerlaubnisregister, das Fahrzeugregister und notfalls das Melderegister heranziehen. Lassen sich die Zweifel nicht ausräumen, werden die Eintragungen beider Personen mit einem Hinweis versehen. Erkennen Sie in Ihrer Auskunft eine Entscheidung, die Sie nie erhalten haben, ist der erste Schritt deshalb ein Abgleich: Aktenzeichen, Tattag und erlassende Behörde stehen in der Auskunft, und bei dieser Behörde lässt sich die Entscheidung nachfragen.</p>

<h2>Wie oft Sie fragen dürfen</h2>
<p>Das Gesetz begrenzt die Zahl der Anträge nicht. Sie können die Auskunft also nach jedem neuen Bescheid erneut anfordern. Sinnvoll ist das vor allem, wenn sich der Stand durch eine Tilgung oder einen Seminarabzug geändert haben muss und Sie die Bestätigung schwarz auf weiß haben möchten, etwa für die eigenen Unterlagen.</p>

<h2>Wann sich eine Abfrage lohnt</h2>
<p>Ein guter Zeitpunkt ist nach einer Ermahnung, denn bis ${K.seminar_abzug_bis} Punkte zieht ein Fahreignungsseminar einen Punkt ab. Ob dieser Abzug in den letzten fünf Jahren schon genutzt wurde, steht ebenfalls im Register, weil die Teilnahme dort vermerkt wird. Ebenso sinnvoll ist eine Abfrage, bevor ein neuer Bescheid rechtskräftig wird und den Stand über eine Schwelle schiebt. Welche Möglichkeiten es danach gibt, steht unter ${h.a('punkteabbau', 'Punkteabbau')}.</p>`,
  },
  en: {
    slug: 'check-flensburg-points',
    nav: 'Check your points',
    card: 'How to get your free Flensburg extract online, by post or in person, and read the dates.',
    title: 'Check Flensburg Points 2026: Free KBA Extract for Expats',
    description: `Check Flensburg points in 2026 for free: online with an eID or residence permit, by post or in person. Entries expire after ${je(K.tilgung_1p_monate)} to ${je(K.tilgung_3p_monate)} years plus a 1-year hold.`,
    h1: 'How to check your Flensburg points',
    intro: 'The German points extract is free, it can be requested from abroad by post, and the electronic residence permit works for the online route.',
    resume: `You can check your Flensburg points free of charge with the Federal Motor Transport Authority (Kraftfahrt-Bundesamt, KBA): Section 30(8) of the Road Traffic Act (StVG) gives every person the right to a written statement of their entries and points without paying a fee. Expats have the same three options as Germans. Online, the request works with any document that has an activated eID function, which the law lists as the German ID card, the eID card for EU and EEA citizens and the electronic residence permit (elektronischer Aufenthaltstitel); the result arrives as a PDF. By post, send a signed letter with a copy of both sides of your passport or ID to Kraftfahrt-Bundesamt, 24932 Flensburg. In person, go to Fördestraße 16, 24944 Flensburg. When reading the extract, look for the date the decision became final: one point expires ${je(K.tilgung_1p_monate)} years after it, two points after ${je(K.tilgung_2p_monate)}, three after ${je(K.tilgung_3p_monate)}, and the entry stays visible for a further year.`,
    faqs: [
      { q: 'Can I check my Flensburg points with a residence permit card?', a: 'Yes, if it is the electronic residence permit (eAT) and its online function is switched on. Section 30(8) StVG allows the electronic extract when the request uses the eID under Section 78(5) of the Residence Act, alongside the German ID card and the EU eID card. You need the six-digit PIN, the AusweisApp and a phone with NFC. Without an active PIN, the postal route with a passport copy works.' },
      { q: 'Can I request my German points record after moving abroad?', a: 'Yes. Nothing in Section 30(8) StVG ties the right to an extract to a German address. Write to Kraftfahrt-Bundesamt, 24932 Flensburg, with your full name, date and place of birth and current address, sign the letter by hand and enclose a copy of both sides of your passport. Entries keep running to their expiry date after you leave, so a record can still matter if you return.' },
      { q: 'How do I work out when an entry on my Flensburg extract will disappear?', a: `Find the date the decision became final, not the date of the offence. Add ${je(K.tilgung_1p_monate)} years for a one-point entry, ${je(K.tilgung_2p_monate)} for two points or ${je(K.tilgung_3p_monate)} for three: from then on it no longer counts towards new offences. Add one more year for the holding period, after which it is deleted. A decision final on ${enD('2023-06-01')} with one point expires on ${enD(exOld.tilgungsreif)} and is deleted on ${enD(exOld.geloescht)}.` },
      { q: 'Do I have to pay a website to see my Flensburg points?', a: 'No. The law makes the extract free of charge, and the KBA calls it gebührenfrei. Paid services that offer to check your points simply forward the same request and collect your identity data on the way; the KBA only answers the person concerned, so they cannot get a faster or fuller answer. The one possible cost is a certified signature if you prefer not to send an ID copy.' },
    ],
    body: (h) => `
<h2>Why expats should look at their file</h2>
<p>Many people who move to Germany never think about Flensburg until a letter from the licensing office arrives. Points collected on a foreign licence are stored like any others, and the register is the same one the authority checks when you exchange your licence, apply for a professional driving permit or face a new fine. Knowing your total before that happens costs nothing: Section 30(8) StVG gives you the right to a free written statement of every entry about you and the resulting points. The ${h.src('kbaAuskunft', 'KBA')} calls it gebührenfrei, meaning free of fees, and no reason has to be given.</p>
<p>Only you receive the statement. Section 30 lists who else may get data from the register, and it names courts, fine offices, licensing authorities and bodies dealing with passenger and freight transport. Private employers and landlords are not on that list, although an employer may ask you to show your own extract when you apply for a job that involves driving.</p>

<h2>Online: which cards work</h2>
<p>The quickest route is the online service, which needs an identity document with an activated eID chip. The law names three: the German Personalausweis, the eID card that Germany issues to citizens of other EU and EEA countries, and the electronic residence permit (eAT) that most non-EU residents carry. A foreign passport does not work here, even a biometric one, because the KBA reads the German eID chip through the AusweisApp. You need the app on a phone with NFC or a card reader, and the six-digit PIN. Many people received a PIN letter with their residence permit and never used it; if you have lost it, ask the office that issued the card, usually the immigration office (Ausländerbehörde), about setting a new one.</p>
<p>After you log in, the app reads your data from the chip, and the extract is offered as a PDF. Keep a copy, because the same document is useful when talking to the licensing office or a seminar provider, and it saves you a second request.</p>

<h2>By post: the route that works from anywhere</h2>
<p>A simple letter is enough. Give your full name, any birth name, date and place of birth and current postal address, ask for an extract from the Fahreignungsregister, and sign it by hand; the handwritten signature is a legal requirement for written requests. Enclose a legible copy of both sides of your ID card or the photo page of your passport, or have your signature officially certified instead. Send it to Kraftfahrt-Bundesamt, 24932 Flensburg. The reply comes to the address you give, which can be outside Germany.</p>
<p>The copy is only used to match your letter to your identity. Name, date of birth and photo should be clearly readable. If your passport shows no address, the address in your letter is where the reply goes, so write it in full, including the country.</p>

<h2>In person in Flensburg</h2>
<p>The KBA also accepts requests at its head office, Fördestraße 16, 24944 Flensburg, on presentation of a valid passport or ID card. Flensburg is close to the Danish border and a long way from Munich or Frankfurt, so this option mostly suits people who live in Schleswig-Holstein.</p>

<h2>What the extract contains</h2>
<p>You will see the final decisions recorded about you: fine decisions with points, convictions for traffic crimes, driving bans, licence withdrawals, and administrative steps such as a reminder or warning and completed seminars, plus your point total. Section 59 of the Driving Licence Ordinance sets out what is stored for each decision: the authority that took it with its file number and date, the place, date and time of the offence, whether an accident was involved, the date the decision became final, the fine or ban, and whether it counts for one, two or three points. For a seminar, the record shows when it ended, when the certificate was issued and when it reached the authority. Small fines of up to ${h.eur(P.verfahren.verwarnung_max)} are never there. Nor is a case that is still open: if you have lodged an objection (Einspruch) against a fine notice, the entry only appears once the decision is final. The ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains how each offence is weighted.</p>

<h2>Reading the dates</h2>
<p>Each entry carries two dates that are easy to mix up. The Tattag is the day of the offence. The date of Rechtskraft is the day the decision became final, typically two weeks after a fine notice was delivered. Expiry runs from the second date only, under ${h.src('stvg29', 'Section 29(4) StVG')}.</p>
${h.table(['Entry', 'Final on', 'Period', 'Stops counting', 'Deleted'], [
  ['1 point, speeding', h.date('2024-03-14'), `${h.num(J(ex1.monate), 1)} years`, h.date(ex1.tilgungsreif), h.date(ex1.geloescht)],
  ['2 points, driving ban', h.date('2023-09-05'), `${h.num(J(ex2.monate))} years`, h.date(ex2.tilgungsreif), h.date(ex2.geloescht)],
  ['3 points, crime with licence withdrawal', h.date('2019-11-20'), `${h.num(J(ex3.monate))} years`, h.date(ex3.tilgungsreif), h.date(ex3.geloescht)],
], 'Examples under Section 29(1), (4) and (6) StVG, worked out with this site\'s expiry module', ['l', 'r', 'r', 'r', 'r'])}
<p>On the expiry date (Tilgungsreife) the entry stops counting towards new offences. It is only deleted after a holding period of one year, during which it still shows on your extract by design. If your own count comes out higher than you expected, check first whether one of the entries is already past its expiry date. New drivers see entries even longer: while you are recorded as holding a probationary licence, offences with points are not deleted at all. To get your exact total on a given day, enter each entry in the ${h.a('punkterechner', 'points calculator')}.</p>

<h2>A worked example</h2>
<p>Suppose your extract lists two points for a driving ban that became final on ${h.date('2022-12-01')}, one point for a red light final on ${h.date('2024-04-15')}, and one point for using a phone final on ${h.date('2026-02-03')}. On ${h.date('2026-10-11')} all three still count, giving ${h.num(enNow)} points, which is the reminder stage. The red-light point expires on ${h.date(tilgung('2024-04-15', 1).tilgungsreif)}, so by ${h.date('2026-11-01')} your total is ${h.num(enLater)}, even though the extract will keep showing the old line until ${h.date(tilgung('2024-04-15', 1).geloescht)}.</p>
<p>The timing matters more than it seems. If you commit a new offence before the expiry date, the authority counts the total on the day of that offence, even if the decision only becomes final weeks later. Since the 2014 reform, a new offence no longer extends older entries; each one runs out on its own date.</p>

<h2>When a line does not look like yours</h2>
<p>Names written in other alphabets, double surnames and changed addresses make matching harder. Courts and fine offices report decisions to the KBA, which assigns them using personal data; where identity is in doubt, Section 28(5) StVG lets it consult the central licence register, the vehicle register and, if needed, the population register. If the doubt remains, the entries of both people are flagged. Should your extract show a decision you do not recognise, compare the date of the offence and the authority named in the entry, then ask that authority for the underlying decision.</p>

<h2>No limit on requests</h2>
<p>The law does not cap how often you may ask. Requesting a fresh extract after each new fine, or after an entry should have expired, is allowed and costs nothing. If you are about to swap a foreign licence for a German one, an up-to-date extract also shows what the licensing office will see; the steps of that process are on the page about ${h.a('fuehrerschein-umschreiben', 'exchanging a foreign licence')}.</p>

<h2>When a check makes sense</h2>
<p>Three moments stand out for people living here. Before exchanging a foreign licence, because the licensing office will see the same file. After a reminder at four or five points, because a driver improvement seminar still removes a point up to ${K.seminar_abzug_bis}, and the register shows whether you used that option in the last five years. And during the ${h.a('probezeit-fuehrerschein', 'probationary period')}, where one more offence can mean a remedial course. What can legally be done about a high total is covered on the page about ${h.a('punkteabbau', 'reducing your points')}.</p>`,
  },
});
