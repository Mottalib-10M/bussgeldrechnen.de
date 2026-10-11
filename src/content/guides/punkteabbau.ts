import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { seminar, tilgung, stage, pointsAt } from '../../lib/engine/punkte';
import { formatMoney, formatDecimal } from '../../lib/format';

const K = P.punkte;
const V = P.verfahren;
const jd = (m: number) => formatDecimal(m / 12, 1, 'de');
const je = (m: number) => formatDecimal(m / 12, 1, 'en');
const stufen = [1, 2, 3, 4, 5, 6, 7];
const STAGE_DE = { none: 'keine', vormerkung: 'Vormerkung', ermahnung: 'Ermahnung', verwarnung: 'Verwarnung', entzug: 'Entziehung' } as const;
const STAGE_EN = { none: 'none', vormerkung: 'noted', ermahnung: 'reminder', verwarnung: 'warning', entzug: 'withdrawal' } as const;
/** Exemple DE : 5 points au 11.10.2026, puis expiration du point isolé. */
const exDe = [{ rechtskraft: '2023-05-02', points: 2 as const }, { rechtskraft: '2025-01-20', points: 1 as const }, { rechtskraft: '2026-03-09', points: 2 as const }];
const deNow = pointsAt(exDe, '2026-10-11'), deSem = seminar(deNow, null).after, deAblauf = tilgung('2025-01-20', 1).tilgungsreif, deDann = pointsAt(exDe, '2027-08-01');
/** Exemple EN : 4 points, rappel reçu. */
const exEn = [{ rechtskraft: '2024-11-05', points: 1 as const }, { rechtskraft: '2025-06-12', points: 2 as const }, { rechtskraft: '2026-05-28', points: 1 as const }];
const enNow = pointsAt(exEn, '2026-10-11'), enSem = seminar(enNow, null).after, enFirst = tilgung('2024-11-05', 1).tilgungsreif;
const enAfter = pointsAt(exEn, '2027-06-01'), enAfterSem = enAfter - (enNow - enSem);
const t1 = tilgung('2025-04-10', 1), t2 = tilgung('2025-04-10', 2), t3 = tilgung('2025-04-10', 3);

export default defineGuide({
  id: 'punkteabbau',
  group: 'punkte',
  order: 30,
  mini: 'seminar',
  miniHref: 'punkterechner',
  related: ['punkte-in-flensburg', 'punkte-abfragen', 'punkterechner', 'mpu', 'fahrverbot'],
  sources: ['stvg4', 'stvg29', 'bgbl2026_142'],
  de: {
    slug: 'punkteabbau',
    nav: 'Punkteabbau',
    card: 'Fahreignungsseminar und Tilgung: die zwei legalen Wege, Punkte loszuwerden.',
    title: 'Punkteabbau 2026: Fahreignungsseminar und Tilgungsfristen',
    description: `Punkteabbau 2026: das Fahreignungsseminar zieht bei 1 bis ${K.seminar_abzug_bis} Punkten einen ab, einmal in ${K.seminar_sperre_jahre} Jahren. Sonst hilft nur die Tilgung. Punktehandel kostet bis ${formatMoney(V.taeuschung_bussgeld_max, 0, 'de')}.`,
    h1: 'Punkteabbau: was legal funktioniert und was nicht',
    intro: 'Für den Abbau von Punkten in Flensburg kennt das Gesetz genau zwei Wege, und einer davon ist Warten.',
    resume: `Punkte in Flensburg lassen sich legal nur auf zwei Arten abbauen. Der aktive Weg ist das freiwillige Fahreignungsseminar nach § 4 Abs. 7 StVG: Wer bei der Ausstellung der Teilnahmebescheinigung zwischen einem und ${K.seminar_abzug_bis} Punkten hat und die Bescheinigung innerhalb von ${K.seminar_vorlage_wochen} Wochen nach Seminarende bei der Fahrerlaubnisbehörde vorlegt, bekommt einen Punkt abgezogen, und zwar höchstens einmal in ${K.seminar_sperre_jahre} Jahren. Ab ${K.verwarnung_ab} Punkten gibt es keinen Abzug mehr. Der passive Weg ist die Tilgung nach § 29 StVG: Ein Punkt verfällt ${jd(K.tilgung_1p_monate)} Jahre nach Rechtskraft der Entscheidung, zwei Punkte nach ${jd(K.tilgung_2p_monate)} Jahren, drei nach ${jd(K.tilgung_3p_monate)} Jahren, jeder Eintrag nach seiner eigenen Frist. Andere Wege gibt es nicht. Wer Punkte gegen Geld auf eine andere Person schreiben lässt, verstößt seit dem 1. Juli 2026 gegen § 4c StVG; dafür droht eine Geldbuße bis ${formatMoney(V.taeuschung_bussgeld_max, 0, 'de')}.`,
    faqs: [
      { q: 'Wie viele Punkte kann man mit einem Fahreignungsseminar abbauen?', a: `Genau einen. § 4 Abs. 7 StVG gewährt den Abzug bei einem Stand von einem bis ${K.seminar_abzug_bis} Punkten am Tag der Ausstellung der Teilnahmebescheinigung, und nur einmal innerhalb von ${K.seminar_sperre_jahre} Jahren. Maßgeblich für die Fünfjahresfrist ist ebenfalls das Ausstellungsdatum. Zwei Seminare hintereinander bringen also nicht zwei Punkte, und ein Seminar bei ${K.verwarnung_ab} oder mehr Punkten bringt keinen.` },
      { q: 'Wie lange dauert ein Fahreignungsseminar mindestens?', a: 'Mehrere Wochen, weil § 42 FeV Abstände vorschreibt. Der verkehrspädagogische Teil hat zwei Module zu je 90 Minuten, zwischen denen mindestens eine Woche liegen muss. Der verkehrspsychologische Teil besteht aus zwei Einzelsitzungen zu je 75 Minuten, und die zweite darf frühestens drei Wochen nach der ersten beginnen. Wer kurz vor einer Schwelle steht, sollte diese Wartezeiten einplanen.' },
      { q: 'Bringt das Fahreignungsseminar bei sechs Punkten noch etwas?', a: `Einen Punktabzug nicht. Ab ${K.verwarnung_ab} Punkten steht die Verwarnung an, und § 4 Abs. 5 StVG verlangt ausdrücklich den Hinweis, dass für das Seminar dann kein Punkt abgezogen wird. Teilnehmen darf man trotzdem, das Seminar soll ja das Fahrverhalten verbessern. Auf den Stand wirkt dann nur noch die Tilgung der einzelnen Einträge.` },
      { q: 'Was droht beim Punktehandel seit Juli 2026?', a: `Seit dem 1. Juli 2026 verbietet § 4c StVG, eine Behörde über die Person zu täuschen, die einen Verstoß aus Anlage 13 der FeV begangen hat, eine solche Täuschung anzubieten oder den Kontakt zu jemandem zu vermitteln, der sie übernimmt. Das gilt für den Fahrer, den Ersatzmann und den Vermittler. Die Geldbuße reicht nach § 23 StVG bis ${formatMoney(V.taeuschung_bussgeld_max, 0, 'de')}. Eingeführt hat die Regel das Fünfte Gesetz zur Änderung des StVG.` },
      { q: 'Verlängert ein neuer Verstoß die Tilgungsfrist alter Punkte?', a: `Nein, nicht mehr. Seit der Reform von 2014 hat jede Eintragung ihre eigene Frist ab Rechtskraft: ${jd(K.tilgung_1p_monate)} Jahre für einen Punkt, ${jd(K.tilgung_2p_monate)} Jahre für zwei, ${jd(K.tilgung_3p_monate)} Jahre für drei. Ein neuer Bescheid hält den Ablauf älterer Einträge nicht an. Für Maßnahmen zählt aber der Stand am Tattag des neuen Verstoßes, auch wenn später ein alter Eintrag abläuft.` },
    ],
    body: (h) => `
<h2>Zwei Wege, die das Gesetz vorsieht</h2>
<p>Wer im Netz nach Punkteabbau sucht, findet viele Angebote. Das ${h.src('stvg4', 'Fahreignungs-Bewertungssystem in § 4 StVG')} kennt aber nur eine Maßnahme, die den Punktestand senkt: das freiwillige Fahreignungsseminar. Daneben verfallen Einträge nach festen Fristen von selbst. Alles andere ändert den Stand nicht, weder ein Aufbauseminar in der Probezeit noch eine verkehrspsychologische Beratung, denn für beide sieht das Gesetz keinen Abzug vor. Eine Ausnahme ohne Zutun ist die Neuerteilung nach einer Entziehung, bei der alle alten Punkte gelöscht werden, aber dafür muss der Führerschein erst einmal weg sein.</p>

<h2>Das Fahreignungsseminar</h2>
<p>§ 4a StVG beschreibt das Ziel: Die Teilnehmer sollen sicherheitsrelevante Mängel in ihrem Fahrverhalten erkennen und abbauen. Das Seminar besteht aus zwei Teilen, die aufeinander abgestimmt werden, und zwei verschiedene Fachleute führen sie durch.</p>
<h3>Der verkehrspädagogische Teil</h3>
<p>Ihn leitet ein Fahrlehrer mit Seminarerlaubnis Verkehrspädagogik. Nach § 42 FeV umfasst er zwei Module zu je 90 Minuten, einzeln oder in Gruppen bis zu sechs Personen. Im ersten Modul geht es um die eigene Fahrerkarriere, die Bedeutung von Mobilität im eigenen Leben und die Regeln des Punktesystems, mit Bausteinen zu den Verstößen, die die Teilnehmer tatsächlich begangen haben: Geschwindigkeit, Abstand, Vorfahrt, Überholen, Ladung, Telefonieren, Alkohol oder Straftaten. Danach gibt es eine Hausaufgabe zur Selbstbeobachtung. Das zweite Modul darf frühestens eine Woche nach dem ersten beginnen und wertet diese Aufgabe aus.</p>
<h3>Der verkehrspsychologische Teil</h3>
<p>Ihn führt eine Psychologin oder ein Psychologe mit Seminarerlaubnis Verkehrspsychologie durch, immer als Einzelgespräch. Zwei Sitzungen zu je 75 Minuten sind vorgeschrieben. In der ersten werden die Auslöser des Fehlverhaltens herausgearbeitet und schriftliche Zielvereinbarungen getroffen; die zweite darf frühestens drei Wochen später stattfinden und prüft, ob die Vorsätze im Alltag funktioniert haben. Die Seminarerlaubnis bekommt nur, wer ein Psychologiestudium, eine verkehrspsychologische Ausbildung und mehrjährige Erfahrung nachweist und selbst nicht mehr als zwei Punkte hat.</p>
<h3>Wer das Seminar anbieten darf</h3>
<p>Beide Teile setzen eine behördliche Erlaubnis voraus. Den pädagogischen Teil dürfen nur Fahrlehrer mit Seminarerlaubnis Verkehrspädagogik nach dem Fahrlehrergesetz durchführen, den psychologischen nur Inhaber einer Seminarerlaubnis Verkehrspsychologie, die die nach Landesrecht zuständige Behörde erteilt. Diese Behörde prüft mindestens alle zwei Jahre vor Ort, ob die Vorgaben eingehalten werden, sofern sich der Anbieter keinem anerkannten Qualitätssicherungssystem angeschlossen hat (§ 4a Abs. 8 StVG). Wer ein Angebot prüft, kann nach beiden Erlaubnissen fragen; ohne sie stellt niemand eine Bescheinigung aus, die die Behörde anerkennt.</p>
<h3>Bescheinigung und Frist</h3>
<p>Am Ende stellt der Leiter des zuletzt absolvierten Teils die Teilnahmebescheinigung aus, unterschrieben von beiden Seminarleitern und vom Teilnehmer. Verweigert wird sie, wenn jemand nicht an allen Sitzungen teilgenommen hat, die Ziele offen ablehnt oder nicht aktiv mitarbeitet (§ 44 FeV). Die Bescheinigung muss innerhalb von ${K.seminar_vorlage_wochen} Wochen nach Seminarende bei der Fahrerlaubnisbehörde liegen. Wer diese Frist verpasst, hat das Seminar umsonst gemacht, was den Punkt angeht.</p>
<p>Einen amtlichen Preis gibt es nicht. Fahrlehrer und Verkehrspsychologen bestimmen ihre Honorare selbst, und die Angebote unterscheiden sich. Vergleichen lohnt sich, ein Mindestpreis oder Richtwert lässt sich seriös nicht nennen. Fragen Sie, ob der Preis beide Teile umfasst oder ob pädagogischer und psychologischer Teil getrennt abgerechnet werden.</p>

<h2>Wann der Abzug greift</h2>
<p>Für den Abzug zählt der Stand am Tag, an dem die Teilnahmebescheinigung ausgestellt wird. Die Tabelle zeigt, was ein Seminar bei jedem Stand bewirkt, vorausgesetzt, der letzte Abzug liegt mindestens ${K.seminar_sperre_jahre} Jahre zurück.</p>
${h.table(['Punkte vorher', 'Stufe', 'Abzug', 'Punkte nachher'], stufen.map((p) => { const r = seminar(p, null); return [p, STAGE_DE[stage(p)], r.allowed ? '1 Punkt' : 'keiner', r.after]; }), 'Fahreignungsseminar nach § 4 Abs. 7 StVG, berechnet mit dem Seminarmodul dieses Rechners', ['r', 'l', 'l', 'r'])}
<p>Ein Abzug bei vier oder fünf Punkten kann eine Stufe zurücksetzen: Wer bei vier Punkten ermahnt wurde und durch das Seminar auf drei kommt, hat wieder Abstand zur Verwarnung. Die Ermahnung selbst bleibt eingetragen, sodass bei ${K.verwarnung_ab} Punkten die Verwarnung ohne Umweg folgen kann. Ob der Fünfjahresabzug schon genutzt wurde, steht im Register; die Teilnahme wird dort fünf Jahre lang gespeichert. Eine Auskunft holen Sie kostenlos über ${h.a('punkte-abfragen', 'Punkte abfragen')}.</p>

<h2>Tilgung: die Punkte laufen ab</h2>
<p>Der zweite Weg erfordert nur Geduld. ${h.src('stvg29', '§ 29 StVG')} legt drei Fristen fest, die mit dem Tag der Rechtskraft beginnen, nicht mit dem Tattag.</p>
${h.table(['Eintrag', 'Frist', 'Rechtskraft', 'zählt nicht mehr ab', 'gelöscht am'], [
  ['Ordnungswidrigkeit, 1 Punkt', `${h.num(t1.monate / 12, 1)} Jahre`, h.date('2025-04-10'), h.date(t1.tilgungsreif), h.date(t1.geloescht)],
  ['Ordnungswidrigkeit mit Fahrverbot oder Straftat, 2 Punkte', `${h.num(t2.monate / 12)} Jahre`, h.date('2025-04-10'), h.date(t2.tilgungsreif), h.date(t2.geloescht)],
  ['Straftat mit Entziehung oder Sperre, 3 Punkte', `${h.num(t3.monate / 12)} Jahre`, h.date('2025-04-10'), h.date(t3.tilgungsreif), h.date(t3.geloescht)],
], `Tilgungsfristen nach § 29 Abs. 1 StVG und Überliegefrist von ${K.ueberliege_monate} Monaten nach § 29 Abs. 6`, ['l', 'r', 'r', 'r', 'r'])}
<p>Jede Eintragung läuft für sich ab. Bis 2014 hemmte ein neuer Eintrag die Tilgung der älteren, das ist abgeschafft. Nach der Tilgungsreife bleibt der Eintrag noch ein Jahr gespeichert, damit Taten, die vorher begangen, aber später entschieden wurden, korrekt bewertet werden können. Bei Fahranfängern werden Punkte zudem erst gelöscht, wenn die Probezeit vorbei ist. Wann genau ein bestimmter Eintrag abläuft, zeigt der ${h.a('punkterechner', 'Punkterechner')}.</p>
<h3>Was die Tilgung nicht kann</h3>
<p>Ein Eintrag, der während eines laufenden Bußgeldverfahrens abläuft, rettet niemanden über eine Schwelle hinweg. Die Behörde stellt nach § 4 Abs. 5 StVG auf den Stand am Tag der letzten Tat ab, spätere Tilgungen bleiben dabei unberücksichtigt. Wer mit sieben Punkten erneut einen Verstoß begeht, bleibt bei acht, auch wenn bis zum Bescheid ein alter Punkt verfällt. Was bei acht Punkten folgt, beschreibt die Seite zur ${h.a('mpu', 'MPU')}.</p>

<h2>Ein Rechenbeispiel</h2>
<p>Angenommen, im Register stehen zwei Punkte für ein Fahrverbot, rechtskräftig seit dem ${h.date('2023-05-02')}, ein Punkt für ein Rotlicht vom ${h.date('2025-01-20')} und zwei Punkte für eine weitere grobe Geschwindigkeitsüberschreitung vom ${h.date('2026-03-09')}. Am ${h.date('2026-10-11')} ergibt das ${h.num(deNow)} Punkte und damit die Ermahnung. Ein Seminar, dessen Bescheinigung jetzt ausgestellt wird, senkt den Stand auf ${h.num(deSem)}. Am ${h.date(deAblauf)} wird der Rotlicht-Punkt tilgungsreif; ohne Seminar stünden danach ${h.num(deDann)} Punkte im Register, mit Seminar einer weniger. Das ist der eigentliche Nutzen des Abzugs: Er verschafft Abstand zur nächsten Stufe, solange die Einträge noch laufen.</p>

<h2>Fahranfänger und Probezeit</h2>
<p>Für Fahranfänger laufen Punktesystem und Probezeit nebeneinander. Das Aufbauseminar, das die Behörde nach einem A-Verstoß anordnet, ist eine Maßnahme der Probezeit und bringt keinen Punktabzug. Wer daneben bei einem bis ${K.seminar_abzug_bis} Punkten freiwillig ein Fahreignungsseminar besucht, bekommt den Abzug wie jeder andere. Gelöscht werden Punkte während der Probezeit allerdings nicht, auch wenn sie tilgungsreif sind; sie zählen dann nur nicht mehr. Wie die Stufen der Probezeit funktionieren, erklärt die Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}.</p>

<h2>Was nicht funktioniert</h2>
<p>Ein verbreitetes Geschäftsmodell war, Punkte gegen Bezahlung auf eine andere Person zu übertragen: Jemand meldet sich als Fahrer, obwohl er nicht gefahren ist, und der eigentliche Fahrer bleibt ohne Eintrag. Seit dem 1. Juli 2026 ist das ausdrücklich verboten. Das ${h.src('bgbl2026_142', 'Fünfte Gesetz zur Änderung des Straßenverkehrsgesetzes')} hat § 4c eingefügt. Verboten ist, es zu unternehmen, eine Behörde über den Beteiligten an einer Ordnungswidrigkeit aus Anlage 13 der FeV zu täuschen, oder das anzubieten. Ebenso verboten ist, den Kontakt zu einem Dritten zu vermitteln, der dazu bereit ist, oder diese Vermittlung anzubieten. Die Geldbuße reicht nach § 23 StVG bis ${h.eur(V.taeuschung_bussgeld_max)}, und zwar für jede dieser Handlungen.</p>
<p>Auch ein Verzicht auf die Fahrerlaubnis kurz vor der achten Punktestufe ist kein Trick. § 4 Abs. 10 StVG behandelt ihn wie eine Entziehung, wenn zu diesem Zeitpunkt mindestens zwei Entscheidungen gespeichert waren: Eine neue Fahrerlaubnis gibt es dann frühestens nach ${K.neuerteilung_sperre_monate} Monaten und in der Regel nur mit Gutachten. Ein Fahrverbot schließlich lässt sich nicht gegen Punkte tauschen; zu jedem Regelfahrverbot gehören zwei Punkte, wie die Seite zum ${h.a('fahrverbot', 'Fahrverbot')} zeigt.</p>
<!--mini:tilgung-->`,
  },
  en: {
    slug: 'reduce-flensburg-points',
    nav: 'Reducing points',
    card: 'The driver improvement seminar and expiry dates: the only legal ways to lose points.',
    title: 'Reduce Flensburg Points 2026: Seminar, Expiry and Limits',
    description: `Reduce Flensburg points in 2026: a driver improvement seminar takes one off at 1 to ${K.seminar_abzug_bis} points, once in ${K.seminar_sperre_jahre} years; otherwise entries expire after ${je(K.tilgung_1p_monate)} years or more.`,
    h1: 'How to reduce Flensburg points legally',
    intro: 'German law offers one course that removes a point and otherwise relies on the calendar; paying someone else to take your points is now banned outright.',
    resume: `There are only two legal ways to reduce Flensburg points. The first is the voluntary driver improvement seminar (Fahreignungsseminar) under Section 4(7) of the Road Traffic Act (StVG): if you hold between one and ${K.seminar_abzug_bis} points on the day the attendance certificate is issued, and you hand the certificate to your licensing office within ${K.seminar_vorlage_wochen} weeks of the last session, one point is deducted, no more than once every ${K.seminar_sperre_jahre} years. From ${K.verwarnung_ab} points on, the seminar no longer reduces anything. The second way is waiting: under Section 29 StVG a one-point entry expires ${je(K.tilgung_1p_monate)} years after the decision became final, a two-point entry after ${je(K.tilgung_2p_monate)} years and a three-point entry after ${je(K.tilgung_3p_monate)}, each on its own clock. Moving abroad does not stop or speed up that clock. Paying someone to claim they were driving has been banned under Section 4c StVG since 1 July 2026, with fines of up to ${formatMoney(V.taeuschung_bussgeld_max, 0, 'en')}.`,
    faqs: [
      { q: 'Do Flensburg points disappear if I move out of Germany?', a: `No. The expiry rules in Section 29 StVG run from the date each decision became final and say nothing about where you live. A one-point entry still takes ${je(K.tilgung_1p_monate)} years, two points ${je(K.tilgung_2p_monate)} years, three points ${je(K.tilgung_3p_monate)} years, followed by a one-year holding period. If you come back to Germany before then, the entries are still on file and still count towards the thresholds.` },
      { q: 'Which German seminar removes a Flensburg point?', a: `Only the Fahreignungsseminar, the driver improvement seminar regulated by Sections 4 and 4a StVG. It combines two 90-minute group or individual modules with a driving instructor and two 75-minute one-to-one sessions with a traffic psychologist. The remedial course ordered during probation (Aufbauseminar) and traffic psychology counselling do not reduce points. One point comes off if you have between one and ${K.seminar_abzug_bis}.` },
      { q: 'When does the two-week deadline for the seminar certificate start?', a: `At the end of the seminar, under Section 4(7) StVG. The certificate has to reach your licensing office (Fahrerlaubnisbehörde) within ${K.seminar_vorlage_wochen} weeks of that date; miss it and the deduction is lost. The point total that matters is the one on the day the certificate is issued, and the same date starts the ${K.seminar_sperre_jahre}-year wait before another seminar can count.` },
      { q: 'Is paying someone to take my points legal in Germany?', a: `No. Since 1 July 2026, Section 4c StVG forbids attempting to deceive an authority about who committed an offence listed in annex 13 of the Driving Licence Ordinance, offering to do so, or putting someone in touch with a person willing to do it. Under Section 23 StVG each of these acts can bring a fine of up to ${formatMoney(V.taeuschung_bussgeld_max, 0, 'en')}. The rule targets drivers, stand-ins and the agencies in between.` },
    ],
    body: (h) => `
<h2>What the law allows</h2>
<p>Search results promise many ways to clear a points record. The ${h.src('stvg4', 'points system in Section 4 StVG')} contains exactly one that lowers your total: a voluntary seminar. Everything else is time. Neither the remedial course that new drivers are ordered to attend nor traffic psychology counselling removes a point, because the law attaches a deduction only to the seminar. The one other event that wipes points is a fresh grant of the licence after it was withdrawn, which is hardly a strategy.</p>
<p>For expats this has a practical side. Points do not belong to a licence card, so swapping a foreign licence for a German one leaves them in place, and leaving the country only pauses your exposure, not the record.</p>

<h2>The driver improvement seminar</h2>
<p>The Fahreignungsseminar is meant to help drivers spot and change unsafe habits, as Section 4a StVG puts it. It has two parts that the two seminar leaders coordinate with each other.</p>
<h3>Part one: with a driving instructor</h3>
<p>A driving instructor holding a special seminar licence runs two modules of 90 minutes each, either one-to-one or in a group of up to six (Section 42 FeV). The first module covers your own driving history, what mobility means for your daily life and how the points system works, with topic blocks chosen from the offences participants actually committed, from speeding and tailgating to phone use or alcohol. You leave with a self-observation exercise. The second module may start no sooner than a week after the first and begins by going through that exercise.</p>
<h3>Part two: with a traffic psychologist</h3>
<p>Two individual sessions of 75 minutes follow with a psychologist who holds a separate seminar licence. The first analyses what triggers the risky behaviour and ends with written goals; the second, at least three weeks later, checks how those goals worked in practice. Psychologists need a university degree, specific training, several years of relevant experience and, tellingly, no more than two points of their own.</p>
<h3>Language and cost</h3>
<p>The law does not set a language for the seminar. Since both parts depend on conversation, ask providers in advance whether they can run it in a language you are comfortable with; nothing obliges them to. There is no official price either. Driving instructors and psychologists set their own fees, so compare offers, and treat any figure quoted as a provider's price rather than a standard rate. Check whether a quote covers both parts or only the instructor's modules, since the psychologist often bills separately.</p>
<h3>The certificate</h3>
<p>The leader of the final part issues the certificate, signed by both leaders and by you. Section 44 FeV obliges them to refuse it if you missed a session, openly rejected the aims or did not take part actively. You then have ${K.seminar_vorlage_wochen} weeks from the end of the seminar to get it to the licensing office.</p>

<h2>What a seminar does at each total</h2>
<p>The deduction depends on your total on the day the certificate is issued, and on the last deduction being at least ${K.seminar_sperre_jahre} years back.</p>
${h.table(['Points before', 'Stage', 'Deduction', 'Points after'], stufen.map((p) => { const r = seminar(p, null); return [p, STAGE_EN[stage(p)], r.allowed ? '1 point' : 'none', r.after]; }), 'Seminar deduction under Section 4(7) StVG, worked out with this site\'s seminar module', ['r', 'l', 'l', 'r'])}
<p>Because the psychologist's second session cannot start until three weeks after the first, people close to a threshold sometimes start too late. The register stores your seminar for five years, so a second course within that time adds nothing. To see your current total and whether a deduction is still available, request your ${h.a('punkte-abfragen', 'free Flensburg extract')}.</p>

<h2>Waiting for entries to expire</h2>
<p>Every entry runs out on its own date. ${h.src('stvg29', 'Section 29 StVG')} counts from the day the decision became final, usually two weeks after a fine notice was delivered.</p>
${h.table(['Entry', 'Period', 'Final on', 'Stops counting', 'Deleted'], [
  ['Offence, 1 point', `${h.num(t1.monate / 12, 1)} years`, h.date('2025-04-10'), h.date(t1.tilgungsreif), h.date(t1.geloescht)],
  ['Offence with ban or crime, 2 points', `${h.num(t2.monate / 12)} years`, h.date('2025-04-10'), h.date(t2.tilgungsreif), h.date(t2.geloescht)],
  ['Crime with licence withdrawal, 3 points', `${h.num(t3.monate / 12)} years`, h.date('2025-04-10'), h.date(t3.tilgungsreif), h.date(t3.geloescht)],
], `Expiry under Section 29(1) StVG with the ${K.ueberliege_monate}-month holding period of Section 29(6)`, ['l', 'r', 'r', 'r', 'r'])}
<p>A newer offence does not hold back the expiry of older ones; that rule disappeared in 2014. The catch is in Section 4(5): when the authority decides on a reminder, a warning or withdrawal, it uses your total on the day of the latest offence. An entry that expires while that case is pending does not help. For new drivers there is a further delay, because entries are not deleted while the probationary licence is recorded. Enter your own dates in the ${h.a('punkterechner', 'points calculator')} to see when each one drops off.</p>

<h2>An example with a reminder letter</h2>
<p>Take a driver whose file shows one point for a red light final on ${h.date('2024-11-05')}, two points for a speeding case with a ban final on ${h.date('2025-06-12')} and one point for a phone at the wheel final on ${h.date('2026-05-28')}. On ${h.date('2026-10-11')} that is ${h.num(enNow)} points, so the reminder has just arrived. A seminar finished with a certificate issued now brings the total to ${h.num(enSem)}. The red-light point stops counting on ${h.date(enFirst)}. Without the seminar the total would then be ${h.num(enAfter)}; with it, ${h.num(enAfterSem)}. A further ban, which always brings two points as the page on the ${h.a('fahrverbot', 'German driving ban')} explains, would take the first driver to ${h.num(enAfter + 2)} and the second to ${h.num(enAfterSem + 2)}: one extra point of margin before the warning at ${K.verwarnung_ab}.</p>

<h2>Already at six or seven</h2>
<p>At this stage the authority has sent a formal warning, and the seminar no longer changes your score. What remains is time: the next entry to expire is the only thing that brings the total down. Section 4(5) also means that any offence committed now is assessed against the six or seven points you hold today, even if an old entry expires before the decision. Many people at this level switch to public transport for certain trips or stop driving in situations where their previous offences happened, simply to let the calendar work.</p>

<h2>New drivers on probation</h2>
<p>If you are still in your Probezeit (probationary period), two systems apply at once. The remedial course ordered after an A offence belongs to the probation rules and removes nothing from your points. A voluntary driver improvement seminar still gives the usual deduction between one and ${K.seminar_abzug_bis} points. Entries are not deleted while the probation is recorded, although they stop counting once they reach their expiry date. The page on the ${h.a('probezeit-fuehrerschein', 'probationary licence')} covers the steps.</p>

<h2>What does not work</h2>
<p>For years, agencies offered to place points on someone else for a fee: a stranger declared that he had been driving. Since 1 July 2026 the ${h.src('bgbl2026_142', 'Fifth Act amending the Road Traffic Act')} has made this a specific offence. Section 4c StVG bans attempting to deceive an authority about who committed an offence from annex 13, offering that service, and arranging or offering contact with someone who will do it. Each act can bring a fine of up to ${h.eur(V.taeuschung_bussgeld_max)} under Section 23 StVG.</p>
<p>Handing in your licence just before reaching eight points is no escape either. If at least two decisions were stored at that moment, Section 4(10) StVG treats the surrender like a withdrawal: no new licence for ${K.neuerteilung_sperre_monate} months and usually an ${h.a('mpu', 'MPU assessment')} first.</p>
<!--mini:tilgung-->`,
  },
});
