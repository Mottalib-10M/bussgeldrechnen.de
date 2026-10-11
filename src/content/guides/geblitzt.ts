import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { speeding, toleranz, fees } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren, T = P.toleranz;
const pct = T.prozent_ueber_100 * 100;
/** Messwerte für die Toleranztabelle: an der 100er-Grenze kippt die Regel. */
const mess = [53, 74, 99, 100, 101, 128, 150, 183, 211];
const ex = speeding({ limit: 50, measured: 74, inner: true });
const exAus = speeding({ limit: 100, measured: 128, inner: false });
const small = speeding({ limit: 50, measured: 66, inner: true });
const de = (n: number, d = 0) => formatMoney(n, d, 'de');
const en = (n: number, d = 0) => formatMoney(n, d, 'en');

export default defineGuide({
  id: 'geblitzt',
  group: 'tempo',
  order: 20,
  mini: 'toleranz',
  related: ['zu-schnell-gefahren', 'geblitzt-innerorts', 'geblitzt-ausserorts', 'bussgeldrechner', 'geschwindigkeitsueberschreitung'],
  sources: ['ptb', 'stvg26', 'owig107', 'bgbl2026_142', 'bkatAnhang'],
  de: {
    slug: 'geblitzt',
    nav: 'Geblitzt',
    card: 'Was nach dem Blitz geschieht: Toleranz, Foto, Halter und Fahrer, Anhörungsbogen.',
    title: 'Geblitzt 2026: Toleranzabzug, Foto, Anhörung und Fristen',
    description: `Geblitzt 2026: Abzug ${T.kmh_bis_100} km/h bis 100 km/h, darüber ${pct} Prozent. Wer haftet, was im Anhörungsbogen steht und warum die Behörde seit Juli ${V.verjaehrung_monate} Monate Zeit hat.`,
    h1: 'Geblitzt: was nach dem Foto passiert',
    intro: 'Zwischen dem Blitz und dem Brief liegen Wochen, in denen die Behörde Messwert, Toleranz und Fahrer klärt.',
    resume: `Wer geblitzt wurde, bekommt nicht sofort einen Bescheid, sondern zuerst Post zur Anhörung, oft nach einigen Wochen. Von der gemessenen Geschwindigkeit zieht die Behörde eine Toleranz ab: ${T.kmh_bis_100} km/h bei Messwerten bis ${T.grenze_kmh} km/h, darüber ${pct} Prozent, abgerundet zugunsten des Fahrers. Erst der verbleibende Wert wird mit dem Tempolimit verglichen und nach dem Bußgeldkatalog bewertet. In Deutschland haftet für Tempoverstöße der Fahrer, nicht der Halter; deshalb braucht die Behörde ein Foto, auf dem die Person am Steuer zu erkennen ist. Ist der Halter nicht selbst gefahren, erhält er meist einen Zeugenfragebogen. Seit dem 1. Juli 2026 verjährt der Verstoß nach ${V.verjaehrung_monate} Monaten, wenn die Frist nicht vorher unterbrochen wird, etwa durch die Anhörung. Bis ${V.verwarnung_max} Euro bleibt es bei einem Verwarnungsgeld ohne Gebühren und ohne Punkt, darüber folgt ein Bußgeldbescheid mit mindestens ${de(V.gebuehr_min + V.zustellung, 2)} Kosten.`,
    faqs: [
      { q: 'Wie viel wird nach dem Blitzen von der gemessenen Geschwindigkeit abgezogen?', a: `Bei Messwerten bis ${T.grenze_kmh} km/h werden ${T.kmh_bis_100} km/h abgezogen, darüber ${pct} Prozent, jeweils zugunsten des Fahrers abgerundet. Aus 128 km/h werden so ${toleranz(128)} km/h, aus 211 km/h werden ${toleranz(211)} km/h. Die Werte entsprechen den Verkehrsfehlergrenzen, die die Physikalisch-Technische Bundesanstalt für zugelassene Messgeräte angibt. Im Anhörungsbogen stehen in der Regel beide Zahlen.` },
      { q: 'Muss ich als Halter sagen, wer mit meinem Auto geblitzt wurde?', a: `Als Zeuge sind Sie grundsätzlich zur Aussage verpflichtet, nahe Angehörige des Fahrers dürfen sie aber verweigern. Bleibt der Fahrer unbekannt, kann die Behörde dem Halter ein Fahrtenbuch auferlegen. Wer die Behörde über die Person am Steuer täuscht, handelt seit dem 1. Juli 2026 nach § 4c StVG ordnungswidrig, mit einem Bußgeld bis ${de(V.taeuschung_bussgeld_max)}.` },
      { q: 'Wie lange dauert es nach dem Blitzen, bis Post kommt?', a: `Eine feste Frist für den ersten Brief gibt es nicht; wie schnell er kommt, hängt von der Behörde ab, und bei Mietwagen oder Firmenwagen dauert die Halterabfrage länger. Entscheidend ist die Verjährung: Seit dem 1. Juli 2026 hat die Behörde nach § 26 Abs. 3 StVG ${V.verjaehrung_monate} Monate ab der Tat. Die Anhörung unterbricht diese Frist, danach beginnt sie neu zu laufen.` },
      { q: 'Was passiert, wenn das Blitzerfoto den Fahrer nicht klar zeigt?', a: `Die Behörde muss nachweisen, wer gefahren ist, denn bei Tempoverstößen haftet nur der Fahrer. Ist das Gesicht verdeckt oder unscharf, versucht sie die Identität anders zu klären, etwa durch Vergleich mit Lichtbildern aus dem Pass- oder Ausweisregister oder durch Befragung. Gelingt das nicht, wird das Verfahren gegen den Fahrer eingestellt; dem Halter droht dann gegebenenfalls ein Fahrtenbuch.` },
      { q: 'Bekomme ich einen Punkt, wenn ich nach dem Blitzen nur ein Verwarnungsgeld zahlen soll?', a: `Nein. Ein Verwarnungsgeld reicht bis ${V.verwarnung_max} Euro und wird nicht ins Fahreignungsregister eingetragen. Punkte gibt es erst bei Verstößen aus Anlage 13 der FeV, beim Pkw ab 21 km/h zu schnell. Ein Beispiel: gemessen 66 km/h in der 50er-Zone, nach Abzug ${small.over} km/h zu viel, das kostet ${de(small.fine)} ohne Punkt und ohne Gebühren.` },
    ],
    body: (h) => `
<h2>Der Blitz: was in dem Moment gemessen wird</h2>
<p>Ein stationärer Blitzer, ein Messwagen am Straßenrand oder eine Laserpistole hält zwei Dinge fest: die Geschwindigkeit und ein Bild. Das Bild zeigt im Regelfall das Kennzeichen und die Person am Steuer, dazu Ort, Datum, Uhrzeit und das erlaubte Tempo. Nicht jede Anlage blitzt sichtbar; viele Geräte arbeiten mit Infrarotlicht, das man im Fahrzeug kaum bemerkt. Umgekehrt ist ein roter Schein im Rückspiegel noch kein Beweis, dass man selbst gemeint war, denn die Anlage kann auch ein anderes Fahrzeug erfasst haben. Zuverlässig zeigt erst der Brief, ob eine Messung vorliegt.</p>
<p>Anhalten muss niemand. Bei einer Kontrolle mit Anhaltekommando winkt die Polizei den Wagen kurz darauf heraus und spricht vor Ort eine Verwarnung aus oder nimmt die Personalien auf. Bei der Messung ohne Anhalten läuft alles schriftlich.</p>

<h2>Toleranzabzug: aus dem Messwert wird der Vorwurf</h2>
<p>Kein Messgerät ist auf den km/h genau. Die ${h.src('ptb', 'Physikalisch-Technische Bundesanstalt (PTB)')} nennt für zugelassene Geräte Verkehrsfehlergrenzen von ${h.num(T.kmh_bis_100)} km/h bis ${h.num(T.grenze_kmh)} km/h Messwert und ${h.num(pct)} Prozent darüber. Diesen Betrag ziehen die Behörden ab, abgerundet zugunsten des Fahrers. Die Polizei Brandenburg weist in ihren Erläuterungen darauf hin, dass der Abzug vom Messverfahren abhängt. Für die üblichen Blitzer gilt diese Rechnung:</p>
${h.table(['Gemessen', 'Abzug', 'Vorgeworfen'], mess.map((m) => [`${h.num(m)} km/h`, `${h.num(m - toleranz(m))} km/h`, `${h.num(toleranz(m))} km/h`]), 'Toleranzabzug nach den Verkehrsfehlergrenzen der PTB', ['l', 'r', 'r'])}
<p>An der Grenze von ${h.num(T.grenze_kmh)} km/h wechselt die Regel. Bei ${h.num(101)} km/h Messwert sind ${h.num(pct)} Prozent rechnerisch etwas mehr als ${h.num(T.kmh_bis_100)} km/h, nach dem Abrunden bleibt es bei ${h.num(101 - toleranz(101))} km/h Abzug. Erst bei höheren Werten macht der Prozentsatz den Unterschied: Bei ${h.num(211)} km/h sind es schon ${h.num(211 - toleranz(211))} km/h.</p>
<p>Ein Rechenbeispiel aus der Stadt: gemessen ${h.num(74)} km/h bei erlaubten ${h.num(50)}, vorgeworfen ${h.num(ex.vorwerfbar)} km/h, also ${h.num(ex.over)} km/h zu viel. Das kostet nach dem Katalog ${h.eur(ex.fine)} und ${h.num(ex.points)} Punkt, mit Kosten ${h.eur(ex.total, 2)}. Auf der Landstraße mit gemessenen ${h.num(128)} km/h bei Tempo 100 bleiben ${h.num(exAus.over)} km/h Überschreitung, ${h.eur(exAus.fine)} und ${h.num(exAus.points)} Punkt. Die vollständigen Tabellen stehen in der ${h.a('geschwindigkeitsueberschreitung', 'Übersicht zur Geschwindigkeitsüberschreitung')}; für die Stadt und die Landstraße gibt es eigene Seiten zu ${h.a('geblitzt-innerorts', 'geblitzt innerorts')} und ${h.a('geblitzt-ausserorts', 'geblitzt außerorts')}.</p>

<h2>Foto und Fahrer: in Deutschland haftet die Person am Steuer</h2>
<p>Für Tempoverstöße gilt in Deutschland die Fahrerhaftung. Das Bußgeld richtet sich gegen den, der gefahren ist, nicht gegen den, auf den das Auto zugelassen ist. Die einzige Ausnahme im ruhenden Verkehr regelt § 25a StVG: Bei Park- und Halteverstößen trägt der Halter die Verfahrenskosten, wenn der Fahrer nicht ermittelt wird. Für einen Blitzer gibt es diese Regel nicht.</p>
<p>Deshalb ist das Frontfoto so wichtig. Die Behörde muss belegen können, dass die betroffene Person tatsächlich am Steuer saß. Reicht das Bild dafür nicht, kann sie Vergleichsfotos heranziehen, beispielsweise aus dem Pass- oder Personalausweisregister, Nachbarn oder Arbeitgeber befragen oder die Polizei vor Ort ermitteln lassen. Bleibt die Identität offen, endet das Verfahren gegen den Fahrer, weil niemandem die Tat zugerechnet werden kann.</p>

<h2>Die Post: Anhörungsbogen oder Zeugenfragebogen</h2>
<p>Der erste Brief ist fast immer einer von zwei Vordrucken, und die Unterscheidung lohnt einen genauen Blick.</p>
<h3>Anhörungsbogen</h3>
<p>Er geht an die Person, die die Behörde für den Fahrer hält, meist an den Halter. Er nennt Tatort, Tatzeit, Messwert, vorgeworfenen Wert und die Nummer des Katalogs. Nach § 55 OWiG erhält der Betroffene Gelegenheit, sich zu äußern. Angaben zur Person sind Pflicht, sie zu verweigern ist nach § 111 OWiG selbst eine Ordnungswidrigkeit. Zur Sache, also zur Frage, ob man gefahren ist, muss niemand etwas sagen.</p>
<h3>Zeugenfragebogen</h3>
<p>Er kommt, wenn das Foto erkennbar nicht den Halter zeigt, etwa bei einer Firma als Halter oder wenn erkennbar eine andere Person als der Halter am Steuer sitzt. Der Halter wird dann als Zeuge gefragt. Nahe Angehörige des Fahrers dürfen das Zeugnis verweigern. Bleibt der Fahrer am Ende unbekannt, kann die Straßenverkehrsbehörde dem Halter nach § 31a StVZO das Führen eines Fahrtenbuchs auferlegen.</p>
<p>Eine Grenze zieht das Gesetz seit dem 1. Juli 2026 ausdrücklich: Nach § 4c StVG, eingeführt durch das ${h.src('bgbl2026_142', 'Fünfte Gesetz zur Änderung des StVG')}, ist es verboten, die Behörde über die Person am Steuer zu täuschen oder eine solche Täuschung anzubieten oder zu vermitteln. Das Bußgeld dafür reicht bis ${h.eur(V.taeuschung_bussgeld_max)}.</p>

<h2>Firmenwagen, Mietwagen, Leasing</h2>
<p>Den Halter findet die Bußgeldstelle über das Kennzeichen im Fahrzeugregister. Ist das eine Firma, ein Vermieter oder eine Leasinggesellschaft, wird zuerst dort nachgefragt. Vermieter geben in der Regel die Daten des Mieters aus dem Vertrag weiter, Arbeitgeber erhalten einen Zeugenfragebogen und sollen benennen, wer den Wagen zur Tatzeit hatte. Erst danach geht der Anhörungsbogen an den Fahrer. Dieser Umweg kostet Zeit, und genau dafür ist die längere Verjährung seit Juli gedacht. Für Firmen mit Fahrzeugpool lohnt sich deshalb eine Fahrzeugübergabe mit Datum und Namen; ohne sie lässt sich ein Foto Monate später oft keinem Mitarbeiter mehr zuordnen, und das Fahrtenbuch droht dann dem Unternehmen.</p>

<h2>Punkte und Probezeit nach dem Blitzer</h2>
<p>Ein Punkt entsteht nicht mit dem Foto, sondern mit der Rechtskraft des Bescheids. Erst dann meldet die Bußgeldstelle die Entscheidung an das Fahreignungsregister, und erst dann beginnt die Tilgungsfrist von ${h.num(P.punkte.tilgung_1p_monate)} Monaten für einen Punkt. Für die Probezeit zählt dagegen der Tattag: Wer kurz vor Ende der Probezeit geblitzt wird, bekommt die Folgen auch dann, wenn der Bescheid erst danach rechtskräftig wird. Beim Pkw beginnt der Punkt bei 21 km/h zu viel nach Abzug, also bei ${h.num(50 + 21 + T.kmh_bis_100)} km/h Messwert in der 50er-Zone.</p>

<h2>Bis der Brief kommt</h2>
<p>Nach dem Blitz muss niemand etwas unternehmen, und eine Selbstanzeige sieht das Gesetz nicht vor. Sinnvoll ist eine kurze Notiz mit Datum, Uhrzeit, Strecke und Fahrer, gerade wenn mehrere Personen das Auto nutzen. Wochen später erinnert sich sonst kaum jemand, wer an einem bestimmten Dienstagnachmittag unterwegs war.</p>

<h2>Fristen: wie lange die Behörde Zeit hat</h2>
<p>Seit dem 1. Juli 2026 beträgt die Verfolgungsverjährung für Verkehrsordnungswidrigkeiten nach ${h.src('stvg26', '§ 26 Abs. 3 StVG')} einheitlich ${h.num(V.verjaehrung_monate)} Monate ab der Tat. Vorher galten drei Monate, solange kein Bescheid erlassen war. Unterbrochen wird die Frist durch bestimmte Handlungen der Behörde, die § 33 OWiG aufzählt, etwa die erste Vernehmung des Betroffenen, die Bekanntgabe, dass ein Ermittlungsverfahren eingeleitet ist, oder deren Anordnung, und später den Bescheid selbst. Nach jeder Unterbrechung beginnt die Frist neu. Wie lange der erste Brief braucht, ist deshalb kein Hinweis auf eine Verjährung: Entscheidend ist, ob innerhalb der ersten ${h.num(V.verjaehrung_monate)} Monate eine solche Handlung erfolgte.</p>

<h2>Verwarnung oder Bescheid: was am Ende kommt</h2>
<p>Bis ${h.eur(V.verwarnung_max)} bietet die Behörde ein Verwarnungsgeld an. Wer es fristgerecht zahlt, meist innerhalb einer Woche, hat die Sache erledigt: keine Gebühr, kein Punkt, kein Bescheid. Wer nicht zahlt, bekommt einen Bußgeldbescheid mit Kosten. Über ${h.eur(V.verwarnung_max)} folgt in jedem Fall ein Bescheid; nach ${h.src('owig107', '§ 107 OWiG')} kommen mindestens ${h.eur(V.gebuehr_min)} Gebühr und ${h.eur(V.zustellung, 2)} Zustellung hinzu, bei ${h.eur(exAus.fine)} also ${h.eur(fees(exAus.fine).total, 2)}. Wie es nach dem Bescheid weitergeht, mit Einspruchsfrist, Rechtskraft und Zahlung, beschreibt die Seite ${h.a('zu-schnell-gefahren', 'Zu schnell gefahren: der Ablauf')}.</p>
<!--mini:tempo-->
<h2>Was im Brief zu prüfen ist</h2>
<p>Der Anhörungsbogen enthält alle Angaben, mit denen sich die Rechnung nachvollziehen lässt: erlaubte Geschwindigkeit, Messwert, Toleranz, vorgeworfener Wert, Ort innerorts oder außerorts und die Fahrzeugart. Stimmt der vorgeworfene Wert mit dem Messwert abzüglich Toleranz überein, und passt die Katalognummer zur Fahrzeugart, ergibt sich der Betrag direkt aus der Tabelle. Der ${h.a('bussgeldrechner', 'Bußgeldrechner')} macht dieselbe Rechnung mit Gebühren, Punkten und Fahrverbot.</p>
<p>Zwei Angaben werden dabei häufig übersehen. Die erste ist die Fahrzeugart: Ein Pkw mit Anhänger wird nach einer strengeren Tabelle abgerechnet als ein Pkw allein, ebenso ein Wohnmobil über 3,5 t. Die zweite ist der Ort. Maßgeblich ist, ob die Messstelle hinter oder vor dem Ortsschild lag, nicht, wie bebaut die Straße wirkt. Beide Angaben stehen im Bogen und entscheiden über die Spalte der Tabelle.</p>`,
  },
  en: {
    slug: 'speed-camera-germany',
    nav: 'Speed cameras',
    card: 'After a German speed camera: tolerance, the photo, owner versus driver, the letters.',
    title: 'Speed Camera Germany 2026: Tolerance, Photo and Letters',
    description: `Caught by a speed camera in Germany 2026: ${T.kmh_bis_100} km/h tolerance up to 100 km/h, ${pct}% above. Who is liable, which letter comes first and how long the authority has.`,
    h1: 'Caught by a speed camera in Germany: what happens next',
    intro: 'A flash on a German road starts a paper trail that can take weeks, and the driver, not the car owner, is the one being pursued.',
    resume: `Being caught by a speed camera in Germany (geblitzt, in local slang) does not produce an instant fine. First the authority deducts a tolerance from the measured speed: ${T.kmh_bis_100} km/h for readings up to ${T.grenze_kmh} km/h and ${pct} per cent above that, always rounded in the driver's favour. Only the remaining speed is compared with the limit and priced from the national fine catalogue. Germany pursues the driver rather than the registered keeper, so the camera takes a front photo and the authority has to work out who was at the wheel. The keeper usually receives either a hearing form (Anhörungsbogen) or a witness questionnaire (Zeugenfragebogen). Since 1 July 2026 the authority has ${V.verjaehrung_monate} months from the offence to act, a period that restarts with steps such as the hearing. Amounts up to ${en(V.verwarnung_max)} are settled as a warning fine with no fee and no point; above that a formal fine notice adds at least ${en(V.gebuehr_min + V.zustellung, 2)} in costs.`,
    faqs: [
      { q: 'I was flashed in a German rental car. How does the letter reach me?', a: `The authority writes to the registered keeper, which is the rental company. The company normally names you as the hirer, and the authority then sends the hearing form to the address in your rental contract, abroad if necessary. Because the driver is liable for speeding in Germany, the fine itself is addressed to you, not to the company. Any handling charge the rental firm adds is a separate matter under your contract.` },
      { q: 'Can I get a German speeding letter if I did not see a flash?', a: `Yes. Many German cameras and laser devices use infrared light that is barely visible from inside the car, and some section measurements take no visible picture at the moment you pass. What counts is the recorded measurement, not whether you noticed it. The first sign is usually a letter several weeks later; for a car registered to you, it arrives at your registered address.` },
      { q: 'Do I have to answer the questions about the offence on a German hearing form?', a: `No. Under Section 55 OWiG you are given the chance to comment, but you need not say anything about whether you were driving. You must, however, give your personal details correctly; refusing them is itself an offence under Section 111 OWiG. Silence on the facts does not end the case: the authority can still rely on the photo and other evidence.` },
      { q: 'My partner was driving my car when it was flashed in Germany. What happens to me as the owner?', a: `You will usually get a witness questionnaire, because the photo shows someone else. Spouses, registered partners, fiancés and close relatives of the driver may refuse to testify. If the driver is never identified, the authority can order you to keep a logbook for the car (Fahrtenbuch). Since July 2026, misleading the authority about the driver is a separate offence with fines of up to ${en(V.taeuschung_bussgeld_max)}.` },
    ],
    body: (h) => `
<h2>What the camera records</h2>
<p>Germany uses fixed cameras, mobile units in parked vans or trailers, and handheld laser guns. All of them capture a speed reading and an image showing the number plate, the driver's face, the place, the time and the limit in force. Do not rely on a visible flash: many devices use infrared, which is hard to notice from the driver's seat, especially in daylight. And a flash you did see may have been for the car next to you. Only a letter confirms that your vehicle was measured.</p>
<p>The police may also run a check with officers waiting further down the road to pull you over. In that case you are stopped on the spot, asked for your licence and registration, and either offered a warning fine or told that a notice will follow. With an ordinary camera, nobody stops you and everything happens by post.</p>

<h2>The tolerance deduction</h2>
<p>No measuring device is perfectly accurate. Germany's national metrology institute, the ${h.src('ptb', 'PTB')}, sets error limits for approved speed meters of ${h.num(T.kmh_bis_100)} km/h up to a reading of ${h.num(T.grenze_kmh)} km/h and ${h.num(pct)} per cent above. Authorities subtract that margin and round down, so the driver always benefits. Brandenburg police point out that the size of the deduction depends on the measuring method, so the figure on your letter is the one that counts. For standard cameras the deduction looks like this:</p>
${h.table(['Measured', 'Deducted', 'Charged'], mess.map((m) => [`${h.num(m)} km/h`, `${h.num(m - toleranz(m))} km/h`, `${h.num(toleranz(m))} km/h`]), 'Tolerance deduction under the PTB error limits', ['l', 'r', 'r'])}
<p>For drivers with an mph speedometer, a useful rule of thumb: the deduction is worth roughly 2 mph at urban speeds and a little more on fast roads. It does not help much at the edges of the bands. If the camera read 74 km/h in a 50 zone, you are charged with ${h.num(ex.vorwerfbar)} km/h, which is ${h.num(ex.over)} km/h over, ${h.eur(ex.fine)} and ${h.num(ex.points)} point. If it read 128 km/h on a country road with a 100 limit, you are ${h.num(exAus.over)} km/h over: ${h.eur(exAus.fine)} and ${h.num(exAus.points)} point. Town and country cases are covered in detail on the pages about ${h.a('geblitzt-innerorts', 'speeding in town')} and ${h.a('geblitzt-ausserorts', 'speeding outside towns')}.</p>

<h2>Driver liability: why the photo matters</h2>
<p>Unlike countries that fine the registered keeper for speeding, Germany prosecutes the person who was driving. The keeper (Halter) only pays for parking and stopping offences when the driver cannot be found, under Section 25a of the Road Traffic Act (StVG). For a speed camera there is no such rule. The authority therefore needs a front photo good enough to identify the driver. When the image is unclear, it can compare it with passport or identity card photos held by German registry offices, ask neighbours or an employer, or send officers to your door. If the driver remains unknown, the case against the driver ends.</p>

<h2>The first letter</h2>
<p>Expect one of two forms, both in German.</p>
<h3>Hearing form (Anhörungsbogen)</h3>
<p>This goes to the person the authority suspects of driving, usually the keeper. It gives the place, time, measured and charged speed and the catalogue entry, and invites you to respond. You must fill in your personal details. Whether you add anything about the offence is your decision.</p>
<h3>Witness questionnaire (Zeugenfragebogen)</h3>
<p>This arrives when the photo clearly shows someone other than the keeper, for example when a company owns the car or a partner was driving. The keeper is asked to name the driver as a witness. Close relatives of the driver may decline. If nobody is identified, the traffic authority can impose a logbook requirement on the keeper under Section 31a of the vehicle registration rules (StVZO), which means recording every journey for a set period.</p>
<p>Since 1 July 2026, the ${h.src('bgbl2026_142', 'fifth amendment to the Road Traffic Act')} has added Section 4c StVG: deceiving the authority about who was driving, or offering or arranging such a deception, is banned outright. The new fine reaches ${h.eur(V.taeuschung_bussgeld_max)}. Offers to take your points for money fall under this rule.</p>

<h2>Foreign plates, company cars and leased cars</h2>
<p>The fine office finds the keeper through the number plate. For a car registered in Germany that is a quick query of the national register. For a car on plates from another EU country, EU rules on the cross-border exchange of registration data let the German authority ask the home country who the keeper is, so driving a car registered back home does not make you invisible. With company and leased cars, the firm or leasing company is asked first. Rental firms pass on the hirer's details from the contract; employers receive a witness questionnaire asking who had the car. Only then does the hearing form go to the driver, which is why letters about company cars often arrive late. If you share a pool car at work, a simple handover sheet with names and dates saves a lot of trouble.</p>

<h2>Points and probation</h2>
<p>A point is not created by the photo. It is entered in the Flensburg register once the fine notice becomes final, and only then does the expiry period of ${h.num(P.punkte.tilgung_1p_monate)} months for one point begin. Probation works the other way round: what counts is the date of the offence. Someone flashed a week before their probationary period ends still faces the probation measures, even if the notice becomes final later. In a car, the first point comes at 21 km/h over after the deduction, which in a 50 zone means a reading of ${h.num(50 + 21 + T.kmh_bis_100)} km/h.</p>

<h2>Before the letter arrives</h2>
<p>There is nothing you are required to do after a flash, and German law has no procedure for reporting yourself. A short note of the date, time, road and driver helps if several people use the car. Weeks later, few households can say for sure who took the car out on a particular afternoon.</p>

<h2>How long the authority has</h2>
<p>Since 1 July 2026, the limitation period for traffic offences is ${h.num(V.verjaehrung_monate)} months from the offence under ${h.src('stvg26', 'Section 26(3) StVG')}. Before, it was three months until a notice was issued. Certain official steps listed in Section 33 OWiG interrupt the period, including the first hearing and the notice itself, and each interruption starts it again. A letter that takes many weeks to arrive is therefore not unusual and says nothing about whether the case has lapsed.</p>

<h2>Warning fine or formal notice</h2>
<p>Up to ${h.eur(V.verwarnung_max)}, you are offered a warning fine (Verwarnungsgeld). Pay it within the period given, usually a week, and the matter is closed with no fee and no record. Above that amount, or if a warning fine goes unpaid, a formal fine notice (Bußgeldbescheid) follows, with costs under ${h.src('owig107', 'Section 107 OWiG')}: at least ${h.eur(V.gebuehr_min)} in fees and ${h.eur(V.zustellung, 2)} for delivery, so ${h.eur(fees(exAus.fine).total, 2)} on top of a ${h.eur(exAus.fine)} fine. The next steps, from the two-week objection period to payment and points, are set out on the page about ${h.a('zu-schnell-gefahren', 'what happens after you are caught speeding')}.</p>
<!--mini:tempo-->
<h2>Reading the letter line by line</h2>
<p>Everything you need to check the amount is on the form: the limit, the measured speed, the tolerance, the charged speed, whether the place counts as in town or outside, and your vehicle type. If the charged figure equals the reading minus the deduction above, and the catalogue entry matches your vehicle, the fine follows directly from the table. The ${h.a('bussgeldrechner', 'fine calculator')} repeats that calculation with fees, points and any ban.</p>`,
  },
});
