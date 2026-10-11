import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const F = P.fuehrerschein;
const M = F.drittstaat_monate;
/** Gebühren der Umschreibung (GebOSt Nr. 201, 202.1, 202.2) und Prüfungen (TÜV/DEKRA). */
const ohnePruefung = F.antrag_pruefung + F.eu_umschreibung;
const mitTheorie = F.antrag_pruefung + F.ersterteilung + F.theorie + F.theorie_pc;
const mitBeiden = mitTheorie + F.praxis_b;

/** Auszug aus FeV Anlage 11, Spalten: Staat, Klassen, Theorieprüfung, Praxisprüfung (gelesen am 11.10.2026). */
const ANL11_DE: Array<[string, string, string, string]> = [
  ['Japan', 'alle', 'nein', 'nein'],
  ['Schweiz', 'alle', 'nein', 'nein'],
  ['Vereinigtes Königreich', 'alle', 'nein', 'nein'],
  ['Serbien', 'alle', 'nein', 'nein'],
  ['Singapur', 'alle', 'nein', 'nein'],
  ['Südafrika', 'alle', 'nein', 'nein'],
  ['Israel', 'A1, A2, A, B', 'nein', 'nein'],
  ['Republik Korea', '1, 2', 'nein', 'nein'],
  ['Ukraine', 'A1, A, B, BE, C1, C1E, C, CE, D1, D1E, D, DE', 'nein', 'nein'],
  ['Moldau', 'A1, A2, A, B, BE, C1, C1E, C, CE, D1, D1E, D, DE', 'nein', 'ja'],
  ['Kanada, Ontario', 'G', 'nein', 'nein'],
  ['Australien, New South Wales', 'C, R', 'nein', 'nein'],
  ['USA, Texas', 'C, A, B', 'nein', 'nein'],
  ['USA, Florida', 'E', 'ja', 'nein'],
];
const ANL11_EN: Array<[string, string, string, string]> = [
  ['United Kingdom', 'all', 'no', 'no'],
  ['Japan', 'all', 'no', 'no'],
  ['South Africa', 'all', 'no', 'no'],
  ['Singapore', 'all', 'no', 'no'],
  ['Israel', 'A1, A2, A, B', 'no', 'no'],
  ['South Korea', '1, 2', 'no', 'no'],
  ['New Zealand', '1, 6', 'no', 'no'],
  ['Canada: Ontario', 'G', 'no', 'no'],
  ['Canada: Alberta, Québec, Nova Scotia', '5', 'no', 'no'],
  ['Canada: British Columbia', '5, 6, 7 (Novice)', 'no', 'no'],
  ['Australia: every state and territory', 'C, R (Victoria also CAR)', 'no', 'no'],
  ['US: Texas', 'C, A, B', 'no', 'no'],
  ['US: Illinois, Ohio', 'D', 'no', 'no'],
  ['US: Pennsylvania', 'C', 'no', 'no'],
  ['US: Virginia', 'D, M, A, B, C', 'no', 'no'],
  ['US: Florida', 'E', 'yes', 'no'],
  ['US: North Carolina, Oregon', 'C', 'yes', 'no'],
];

export default defineGuide({
  id: 'fuehrerschein-umschreiben',
  group: 'punkte',
  order: 60,
  mini: 'umschreiben',
  miniHref: 'fuehrerschein-kosten',
  related: ['fuehrerschein-kosten', 'probezeit-fuehrerschein', 'punkte-in-flensburg', 'punkte-abfragen', 'fahrverbot'],
  sources: ['fev29', 'fev31', 'fevAnl11', 'gebost'],
  de: {
    slug: 'fuehrerschein-umschreiben',
    nav: 'Führerschein umschreiben',
    card: 'EU-Führerschein, Drittstaaten-Führerschein, Anlage 11: wann eine Prüfung nötig ist und was es kostet.',
    title: 'Führerschein umschreiben 2026: Fristen, Anlage 11, Kosten',
    description: `Führerschein umschreiben 2026: EU-Führerscheine gelten weiter, Drittstaaten-Führerscheine ${M} Monate nach Zuzug. Anlage-11-Staaten ohne Prüfung: ${formatMoney(ohnePruefung, 2, 'de')} Gebühr.`,
    h1: 'Ausländischen Führerschein in Deutschland umschreiben',
    intro: 'Ob Sie nach dem Umzug einfach weiterfahren, umtauschen oder neu geprüft werden, hängt allein vom Ausstellungsstaat ab.',
    resume: `Wer nach Deutschland zieht, darf mit einem gültigen Führerschein aus einem EU- oder EWR-Staat unbefristet weiterfahren (§ 28 FeV); ein Umtausch ist freiwillig. Ein Führerschein aus einem anderen Staat gilt dagegen nur noch ${M} Monate ab der Begründung des ordentlichen Wohnsitzes (§ 29 Abs. 1 FeV). Die Behörde kann die Frist auf Antrag um bis zu ${M} Monate verlängern, wenn der Aufenthalt nicht länger als zwölf Monate dauern soll. Danach braucht es eine deutsche Fahrerlaubnis nach § 31 FeV. Für die Staaten und Klassen der Anlage 11 entfallen Fahrschule, Sehtest und Erste-Hilfe-Kurs, und die Liste legt fest, ob eine theoretische oder praktische Prüfung nötig ist; für Japan, die Schweiz oder das Vereinigte Königreich keine von beiden. Für alle anderen Staaten entfällt nur die Ausbildung, beide Prüfungen sind abzulegen. Die Behörde berechnet ohne Prüfung ${formatMoney(F.eu_umschreibung, 2, 'de')} plus ${formatMoney(F.antrag_pruefung, 2, 'de')} Antragsprüfung, die Prüfungen beim TÜV oder bei der DEKRA kommen gegebenenfalls dazu.`,
    faqs: [
      { q: 'Muss ich meinen EU-Führerschein in Deutschland umschreiben lassen?', a: 'In der Regel nicht. Mit Wohnsitz in Deutschland dürfen Sie nach § 28 FeV im Umfang Ihrer Berechtigung weiterfahren, auch ohne Umtausch. Ausnahmen betreffen vor allem Lkw- und Busklassen, deren Geltungsdauer nach deutschen Regeln berechnet wird. Ein freiwilliger Umtausch nach § 30 FeV kommt ohne Prüfung, Sehtest und Erste-Hilfe-Kurs aus; der alte Führerschein geht über das KBA an die ausstellende Behörde zurück.' },
      { q: 'Wie lange gilt ein Führerschein aus einem Nicht-EU-Staat nach dem Umzug nach Deutschland?', a: `${M} Monate ab dem Tag, an dem Sie hier Ihren ordentlichen Wohnsitz begründen, so § 29 Abs. 1 FeV. Wer glaubhaft macht, dass er nicht länger als zwölf Monate bleibt, kann die Frist auf Antrag um bis zu ${M} weitere Monate verlängern lassen. Wer ohne Wohnsitz nur zu Besuch ist, darf ohne diese Frist fahren. Ist der Führerschein nicht auf Deutsch, braucht es oft eine Übersetzung oder einen Internationalen Führerschein.` },
      { q: 'Brauche ich für die Umschreibung eines Schweizer Führerscheins eine Prüfung?', a: 'Nein. Die Schweiz steht in Anlage 11 der FeV mit allen Klassen und ohne theoretische oder praktische Prüfung. Weil sie weder zur EU noch zum EWR gehört, gilt der Schweizer Führerschein nach dem Umzug aber nur sechs Monate weiter, danach ist die Umschreibung nach § 31 FeV nötig. Die Behörde berechnet dafür dieselbe Gebühr wie für einen EU-Führerschein.' },
      { q: 'Kann ich die Umschreibung noch nach Ablauf der sechs Monate beantragen?', a: 'Ja. § 31 Abs. 1 FeV setzt voraus, dass die ausländische Fahrerlaubnis zum Fahren im Inland berechtigt oder berechtigt hat; eine abgelaufene Sechsmonatsfrist schließt die Umschreibung also nicht aus. Fahren dürfen Sie in der Zwischenzeit aber nicht, sonst droht eine Strafe wegen Fahrens ohne Fahrerlaubnis. Und die Zeit ohne Fahrberechtigung zählt bei der Probezeit nicht mit (§ 33 Abs. 2 FeV).' },
      { q: 'Was passiert mit meinem ausländischen Führerschein nach der Umschreibung?', a: 'Sie bekommen den deutschen Führerschein nur gegen Abgabe des ausländischen. Besteht mit dem Ausstellungsstaat eine Vereinbarung, schickt die Behörde ihn über das KBA dorthin zurück; sonst nimmt sie ihn in Verwahrung und gibt ihn nur gegen den deutschen Führerschein wieder heraus. Verwahrte Führerscheine dürfen nach drei Jahren vernichtet werden (§ 31 Abs. 4 FeV).' },
    ],
    body: (h) => `
<h2>Erst die Frage: EU oder nicht EU</h2>
<p>Für die Umschreibung gibt es zwei völlig verschiedene Regelwerke. Führerscheine aus den Mitgliedstaaten der EU und den EWR-Staaten Island, Liechtenstein und Norwegen werden anerkannt, wie sie sind. Für alle anderen Führerscheine, einschließlich derer aus der Schweiz und dem Vereinigten Königreich, gelten die Fristen und Bedingungen von § 29 und § 31 FeV. Maßgeblich ist der Staat, der den Führerschein ausgestellt hat, nicht Ihre Staatsangehörigkeit.</p>

<h2>Führerscheine aus EU und EWR</h2>
<p>Wer mit einem gültigen EU- oder EWR-Führerschein nach Deutschland zieht, fährt einfach weiter (§ 28 FeV). Auflagen aus dem Ausstellungsstaat, etwa eine Brille, gelten auch hier. Eine Pflicht zum Umtausch besteht für Pkw und Motorrad nicht. Bei den Lkw- und Busklassen rechnet Deutschland die Geltungsdauer nach eigenen Regeln: Ist eine solche Fahrerlaubnis nach deutscher Rechnung schon abgelaufen, weil seit der Erteilung mehr als fünf Jahre vergangen sind, gilt sie noch sechs Monate ab dem Zuzug.</p>
<p>Ein freiwilliger Umtausch nach § 30 FeV ist trotzdem möglich, etwa wenn das alte Dokument zerfleddert ist oder auf Papier ausgestellt wurde. Ärztliche Untersuchung, Sehtest, Prüfung, Erste Hilfe und Ausbildung entfallen. Der deutsche Führerschein trägt in Feld 10 das Datum der ursprünglichen Erteilung und einen Vermerk, dass ihm eine Fahrerlaubnis aus der EU oder dem EWR zugrunde liegt. Der alte Führerschein geht über das Kraftfahrt-Bundesamt an die ausstellende Behörde zurück.</p>

<h2>Führerscheine aus Drittstaaten: die Sechsmonatsfrist</h2>
<p>${h.src('fev29', '§ 29 Abs. 1 FeV')} erlaubt das Fahren mit einem ausländischen Führerschein, solange Sie in Deutschland keinen ordentlichen Wohnsitz haben. Mit dem Zuzug beginnt eine Frist von ${M} Monaten. Wer glaubhaft macht, dass er nicht länger als zwölf Monate bleibt, etwa für eine befristete Entsendung, kann bei der Fahrerlaubnisbehörde eine Verlängerung um bis zu ${M} Monate beantragen. Danach endet die Berechtigung, und wer weiterfährt, fährt ohne Fahrerlaubnis, was nach § 21 StVG strafbar ist.</p>
<p>Was ein ordentlicher Wohnsitz ist, definiert § 7 FeV: Wer wegen persönlicher und beruflicher Bindungen gewöhnlich, das heißt an mindestens 185 Tagen im Jahr, in Deutschland wohnt, hat ihn hier. Entscheidend sind die tatsächlichen Lebensverhältnisse, nicht die Staatsangehörigkeit. Studierende aus einem anderen EU- oder EWR-Staat, die nur zum Studium hier sind, begründen nach § 7 Abs. 3 FeV keinen ordentlichen Wohnsitz. Wer nur für ein Projekt von bestimmter Dauer im Ausland arbeitet und regelmäßig zurückkehrt, behält seinen Wohnsitz in Deutschland.</p>
<h3>Übersetzung und Internationaler Führerschein</h3>
<p>Der Nachweis erfolgt mit dem nationalen Führerschein oder einem Internationalen Führerschein zusammen mit dem nationalen. Ist der nationale Führerschein nicht auf Deutsch, nicht in einem EU- oder EWR-Staat oder der Schweiz ausgestellt und entspricht er nicht dem Anhang 6 des Wiener Übereinkommens von 1968, muss eine Übersetzung beiliegen. Sie muss von einem international anerkannten Automobilklub des Ausstellungsstaates oder einer vom Verkehrsministerium bestimmten Stelle stammen (§ 29 Abs. 2 FeV).</p>
<h3>Wann der ausländische Führerschein gar nicht gilt</h3>
<p>Keine Berechtigung besteht nach § 29 Abs. 3 FeV unter anderem für Lernführerscheine und vorläufige Führerscheine, für Personen, die das deutsche Mindestalter noch nicht erreicht haben, und für jemanden, der den Drittstaaten-Führerschein erworben hat, während er schon in Deutschland wohnte. Auch nach einer Entziehung in Deutschland oder während eines Fahrverbots gilt er nicht.</p>

<h2>Umschreibung nach § 31 FeV und Anlage 11</h2>
<p>${h.src('fev31', '§ 31 FeV')} unterscheidet zwei Gruppen. Für Führerscheine aus den Staaten und in den Klassen der ${h.src('fevAnl11', 'Anlage 11')} entfallen der Sehtest, die Erste-Hilfe-Schulung und die Ausbildung in der Fahrschule, bei Lkw- und Busklassen grundsätzlich auch die ärztliche Untersuchung. Für einzelne Einträge verlangt die Anlage trotzdem einen Nachweis des Sehvermögens. Ob eine theoretische oder praktische Prüfung abzulegen ist, bestimmt die Liste für jeden Staat. Ein Auszug:</p>
${h.table(['Ausstellungsstaat', 'Klassen', 'Theorie', 'Praxis'], ANL11_DE, 'Auszug aus FeV Anlage 11, Stand 11.10.2026; vollständige Liste in der Quelle', ['l', 'l', 'l', 'l'])}
<p>Zwei amtliche Anmerkungen sind wichtig. Wo nicht „alle“, sondern bestimmte Klassen stehen, wird aufgrund dieser Klassen nur die Klasse B erteilt. Und die Klassenbezeichnungen sind die des Ausstellungsstaates: Die australische Klasse C entspricht der deutschen Klasse B, die Klasse R der Klasse A. Lernführerscheine und vergleichbare Vorstufen werden nirgends umgeschrieben. Auch für Anlage-11-Staaten kann die Behörde eine Prüfung anordnen, wenn Tatsachen dafür sprechen, dass die nötigen Kenntnisse und Fähigkeiten fehlen (§ 31 Abs. 1a FeV).</p>
<p>Für alle Staaten, die nicht in der Anlage stehen, gilt § 31 Abs. 2 FeV: Die Ausbildung in der Fahrschule ist nicht vorgeschrieben, die theoretische und die praktische Prüfung aber schon. Weil Sehtest und Erste-Hilfe-Kurs in diesem Absatz nicht ausgenommen sind, gehören sie ebenfalls dazu. Viele Bewerber nehmen trotzdem einige Fahrstunden, um das Prüfungsfahrzeug und die deutschen Prüfungsabläufe kennenzulernen; Pflicht ist das nicht. Die Prüfungen nimmt die Technische Prüfstelle ab, in den meisten Ländern TÜV oder DEKRA.</p>

<h2>Was die Umschreibung kostet</h2>
<p>Die Behördengebühren stehen in der ${h.src('gebost', 'Gebührenordnung für Maßnahmen im Straßenverkehr')}, die Prüfgebühren der Technischen Prüfstellen ebenfalls.</p>
${h.table(['Fall', 'Behörde', 'Prüfungen', 'zusammen'], [
  ['EU/EWR oder Anlage-11-Staat ohne Prüfung', h.eur(ohnePruefung, 2), h.eur(0, 2), h.eur(ohnePruefung, 2)],
  ['Anlage-11-Staat mit Theorieprüfung', h.eur(F.antrag_pruefung + F.ersterteilung, 2), h.eur(F.theorie + F.theorie_pc, 2), h.eur(mitTheorie, 2)],
  ['anderer Staat: Theorie und Praxis, Klasse B', h.eur(F.antrag_pruefung + F.ersterteilung, 2), h.eur(F.theorie + F.theorie_pc + F.praxis_b, 2), h.eur(mitBeiden, 2)],
], `Antragsprüfung ${h.eur(F.antrag_pruefung, 2)} (GebOSt Nr. 201), Umschreibung ohne Prüfung ${h.eur(F.eu_umschreibung, 2)} (Nr. 202.2), sonst Erteilung ${h.eur(F.ersterteilung, 2)} (Nr. 202.1); Prüfungen beim TÜV oder bei der DEKRA`, ['l', 'r', 'r', 'r'])}
<p>Nicht enthalten sind Fahrstunden, Sehtest, Erste-Hilfe-Kurs, Passfoto und Übersetzung, deren Preise frei sind. Ihren eigenen Fall mit Fahrschulkosten rechnet der ${h.a('fuehrerschein-kosten', 'Führerscheinkosten-Rechner')}.</p>

<h2>Ablauf und Unterlagen</h2>
<p>Den Antrag stellen Sie bei der Fahrerlaubnisbehörde Ihres Wohnorts. Nach § 31 Abs. 3 FeV weisen Sie die ausländische Fahrerlaubnis mit dem nationalen Führerschein nach und erklären, dass sie noch gültig ist; die Behörde darf das überprüfen, bei manchen Staaten über das Kraftfahrt-Bundesamt. Den deutschen Führerschein gibt es nur gegen Abgabe des ausländischen. Er trägt einen Vermerk, dass ihm eine Fahrerlaubnis aus einem Staat außerhalb von EU und EWR zugrunde lag.</p>

<h2>Fahrverbot, Entziehung und Rücktausch</h2>
<p>Ein Fahrverbot oder eine Entziehung in Deutschland trifft auch den ausländischen Führerschein: Während eines Fahrverbots gilt er hier nicht, und nach einer Entziehung erlischt das Recht, von ihm in Deutschland Gebrauch zu machen. Eine laufende Sperre lässt sich durch die Umschreibung nicht umgehen. Was beim ${h.a('fahrverbot', 'Fahrverbot')} mit dem Dokument geschieht, steht auf der eigenen Seite, wie Verstöße bewertet werden im Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>
<p>Umgekehrt bleibt eine deutsche Fahrerlaubnis bestehen, wenn jemand seinen deutschen Führerschein im Ausland in einen dortigen umtauscht. Kehrt er zurück, kann er nach § 30a FeV zurücktauschen; die noch gültigen Klassen werden unverändert eingetragen, und der ausländische Führerschein wird abgegeben.</p>

<h2>Probezeit und Punkte nach der Umschreibung</h2>
<p>War der ausländische Führerschein jünger als zwei Jahre, läuft in Deutschland die Probezeit für den Rest der zwei Jahre, angerechnet wird die Zeit seit dem Erwerb. Zeiten, in denen Sie hier nicht fahren durften, zählen nicht mit. Einzelheiten stehen auf der Seite zur ${h.a('probezeit-fuehrerschein', 'Probezeit')}. Punkte, die Sie mit dem ausländischen Führerschein in Deutschland gesammelt haben, bleiben bei der Umschreibung bestehen, denn § 4 Abs. 3 StVG nimmt die vereinfachte Erteilung an Inhaber ausländischer Fahrerlaubnisse ausdrücklich von der Löschung aus. Den aktuellen Stand zeigt die kostenlose ${h.a('punkte-abfragen', 'Punkteabfrage')}.</p>`,
  },
  en: {
    slug: 'exchange-foreign-licence-germany',
    nav: 'Exchanging a foreign licence',
    card: 'Six months on a non-EU licence, the annex 11 country list, tests and fees for swapping to a German licence.',
    title: 'Exchange Foreign Licence Germany 2026: 6 Months, Annex 11',
    description: `Exchange a foreign licence in Germany 2026: EU licences stay valid, others ${M} months after you move. UK, Japan, listed US states: no test, ${formatMoney(ohnePruefung, 2, 'en')} in fees.`,
    h1: 'Exchanging a foreign driving licence in Germany',
    intro: 'Whether you can simply swap your licence, need a theory test or must sit both tests depends only on the country, or US state, that issued it.',
    resume: `If you move to Germany with a valid licence from an EU or EEA country, you may keep driving on it indefinitely (Section 28 of the Driving Licence Ordinance, FeV) and exchanging it is optional. A licence from anywhere else, including the UK, the US or Switzerland, remains valid for only ${M} months from the day you take up residence (Section 29(1) FeV), extendable on request by up to ${M} more months if you will stay no longer than a year. After that you need a German licence under Section 31 FeV. Annex 11 of the ordinance lists the countries, Canadian provinces, Australian states and US states whose licences can be exchanged without driving school, eye test or first aid course, and states for each whether a theory or practical test is still required; the UK, Japan, Texas and Ontario need neither. Licences from unlisted countries need both tests but no compulsory lessons. Without tests, the authority charges ${formatMoney(F.eu_umschreibung, 2, 'en')} plus ${formatMoney(F.antrag_pruefung, 2, 'en')} for checking the application.`,
    faqs: [
      { q: 'Can I swap my UK driving licence for a German one without a test?', a: `Yes. The United Kingdom appears in annex 11 of the Driving Licence Ordinance with all classes and neither a theory nor a practical test. Since Brexit, though, a UK licence is a non-EU licence: it stays valid for ${M} months after you take up residence, and then you need the German one. The authority fee is ${formatMoney(F.eu_umschreibung, 2, 'en')} plus ${formatMoney(F.antrag_pruefung, 2, 'en')} for checking the application.` },
      { q: 'Which US states can exchange a licence in Germany without any test?', a: 'Annex 11 lists them one by one with the licence class that qualifies. Among those needing no test at all are Alabama, Arizona, Colorado, Illinois, Massachusetts, Michigan, Ohio, Pennsylvania, Texas, Virginia, Washington State and Wisconsin. Florida, Connecticut, Minnesota, North Carolina, Oregon and Tennessee require the theory test only. A state that does not appear in the annex means both tests, without compulsory lessons.' },
      { q: 'Can I extend the six months I may drive on my foreign licence in Germany?', a: `Only in one situation. Section 29(1) FeV lets the licensing office extend the period by up to ${M} months on application if you can show that your residence in Germany will last no more than twelve months, as with a short posting. Anyone staying longer has to arrange the German licence within the ${M} months, or stop driving until it is issued.` },
      { q: 'Do I need a translation of my foreign driving licence in Germany?', a: 'Often, yes. Section 29(2) FeV requires a translation when the licence is not in German, was not issued in the EU, the EEA or Switzerland, and does not follow annex 6 of the 1968 Vienna Convention, unless Germany has waived it. The translation must come from an internationally recognised automobile club of the issuing country or a body designated by the transport ministry. An International Driving Permit carried with the national licence is the other accepted proof.' },
    ],
    body: (h) => `
<h2>The rule that catches most newcomers</h2>
<p>Many people arrive on a work visa, rent a flat, register their address and keep driving on the licence from home. That is fine for a while. ${h.src('fev29', 'Section 29(1) FeV')} allows it for ${M} months from the day your ordinary residence (ordentlicher Wohnsitz) begins in Germany. Section 7 FeV defines it as living here usually, meaning at least 185 days a year, because of personal and work ties. After the six months the licence no longer entitles you to drive here, and driving without entitlement is a criminal offence under Section 21 of the Road Traffic Act.</p>
<p>An extension of up to ${M} months exists, but only if you can make it credible that you will be resident for no more than twelve months, for example on a short secondment. Anyone settling for longer should start the exchange well before the deadline, since tests, if required, also have to be booked and passed in that time.</p>

<h2>EU and EEA licences: nothing to do</h2>
<p>Licences issued in an EU country or in Iceland, Liechtenstein or Norway are recognised as they are (Section 28 FeV). Conditions on them, such as glasses, apply here too. Exchanging is voluntary and needs no test, eye check or first aid course. One detail matters for truck and bus drivers: Germany calculates the validity of those classes by its own rules, and a licence that is older than its five-year German validity remains usable for ${M} months after you move.</p>
<p>Note that Switzerland and the UK are not in this group. Their licences follow the non-EU rules below, although both are on the annex 11 list and need no test.</p>

<h2>Annex 11: the country list</h2>
<p>${h.src('fev31', 'Section 31 FeV')} makes the exchange easier for licences from the countries and classes in ${h.src('fevAnl11', 'annex 11')}. For those, the eye test, first aid training and driving lessons fall away, and for truck and bus classes the medical examination too, unless the German rules on age-related checks require it. For a few entries the annex still asks for proof of eyesight. The annex then says, country by country, whether a theory test, a practical test or neither is needed. US states and Canadian provinces are listed individually, each with the licence class that qualifies.</p>
${h.table(['Issued in', 'Qualifying classes', 'Theory test', 'Practical test'], ANL11_EN, 'Extract from FeV annex 11 as read on 11 October 2026; the full list is in the source', ['l', 'l', 'l', 'l'])}
<p>Read the class column carefully. The codes are those of the issuing country: an Australian class C is treated as German class B and class R as class A. Where the annex names specific classes rather than "all", only German class B is granted on that basis. New Zealand class 6 becomes A2 for holders under 24 and A otherwise. Learner permits, instruction permits and similar stages are never exchanged; provisional or probationary licences from some states and provinces are, as the annex notes. The authority may still order a test if there are facts suggesting the necessary knowledge or skills are missing (Section 31(1a) FeV).</p>

<h2>Countries not on the list</h2>
<p>For any country or US state missing from annex 11, Section 31(2) FeV applies. You do not have to take lessons at a driving school, but you sit both the theory and the practical test. Because the eye test and first aid course are not exempted in that paragraph, you need those too. Many people book a few lessons anyway to get used to the test car and the way German examiners work; that is a choice, not a requirement.</p>

<h2>What it costs</h2>
<p>Authority fees and test fees are set in the ${h.src('gebost', 'road traffic fee schedule (GebOSt)')}. Driving lessons, the eye test, the first aid course, photos and translations are priced freely.</p>
${h.table(['Case', 'Authority', 'Tests', 'Total'], [
  ['EU/EEA or annex 11, no test', h.eur(ohnePruefung, 2), h.eur(0, 2), h.eur(ohnePruefung, 2)],
  ['Annex 11 with theory test', h.eur(F.antrag_pruefung + F.ersterteilung, 2), h.eur(F.theorie + F.theorie_pc, 2), h.eur(mitTheorie, 2)],
  ['Other country: theory and practical, class B', h.eur(F.antrag_pruefung + F.ersterteilung, 2), h.eur(F.theorie + F.theorie_pc + F.praxis_b, 2), h.eur(mitBeiden, 2)],
], `Application check ${h.eur(F.antrag_pruefung, 2)} (GebOSt no. 201), exchange without test ${h.eur(F.eu_umschreibung, 2)} (no. 202.2), otherwise grant ${h.eur(F.ersterteilung, 2)} (no. 202.1); test fees of TÜV or DEKRA`, ['l', 'r', 'r', 'r'])}
<p>To include driving school costs, use the ${h.a('fuehrerschein-kosten', 'licence cost calculator')}.</p>

<h2>US forces and their families</h2>
<p>Members of the US or Canadian armed forces stationed in Germany, their civilian staff and dependants have a separate route. Under Section 29a FeV they may drive private vehicles here on a licence from their home country, provided they hold a valid certificate under the NATO Status of Forces supplementary agreement and were entitled to drive privately at home when it was issued. The certificate has to be carried while driving. The six-month rule and the exchange described here apply to everyone else.</p>

<h2>A checklist before your appointment</h2>
<p>Bring your national licence, your passport or residence permit, and a signed declaration that the foreign licence is still valid, which Section 31(3) FeV requires. If your country is not in annex 11, add the eye test certificate and the first aid course certificate, and plan the theory and practical test dates. Check whether a translation is needed for your licence, and if you are within an extension period, bring the decision that granted it. Ask the office how long processing takes, and keep driving only while your six months, or an extension, are still running.</p>

<h2>Applying and handing over your licence</h2>
<p>You apply to the licensing office (Fahrerlaubnisbehörde) where you live, with your national licence and a declaration that it is still valid; the office may check this with the issuing country (Section 31(3) FeV). The German card is issued only in exchange for the foreign one. If Germany has an agreement with the issuing country, the old licence is sent back there via the Federal Motor Transport Authority; otherwise the office keeps it and returns it only when you hand back the German card. Licences kept this way may be destroyed after three years, so if you want to drive in your home country on that document later, plan for it.</p>

<h2>Probation and points after the exchange</h2>
<p>If your licence is less than two years old, the German probation applies to the remaining time, with any period in which you were not allowed to drive here left out; see the ${h.a('probezeit-fuehrerschein', 'probationary licence guide')}. Points you collected in Germany on the foreign licence stay on file, because Section 4(3) StVG expressly excludes the simplified grant to holders of foreign licences from the deletion of points. The ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains how they count, and a free ${h.a('punkte-abfragen', 'extract from the KBA')} shows exactly what the licensing office will see when it processes your application. If a driving ban is pending, the exchange does not change it either: a ban applies to whatever licence you hold, as the page on the ${h.a('fahrverbot', 'German driving ban')} explains.</p>`,
  },
});
