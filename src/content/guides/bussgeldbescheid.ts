import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { entry, fees, speeding, increase, vorsatz } from '../../lib/engine/bkat';
import { formatMoney } from '../../lib/format';

const V = P.verfahren;
const winter = entry('5a'), handy = entry('246.1'), gasse = entry('50'), alk = entry('241'), alk2 = entry('241.1');
const in21 = speeding({ limit: 50, measured: 71, inner: true, tolerance: false });
const ex = [winter, handy, gasse, alk, alk2].map((e) => ({ nr: e.nr, fine: e.fine!, f: fees(e.fine!) }));
/** § 107 Abs. 5 OWiG : pauschale Auslagen für die Versendung der Akte (entfällt bei elektronischer Übermittlung). */
const akte = 12;
/** § 34 Abs. 2 OWiG : Vollstreckungsverjährung, Grenze 1 000 €. */
const vollGrenze = 1000;
/** Kleinster Regelsatz mit Punkt im Katalog (FeV Anlage 13). */
const minEintrag = 60;
const m = (x: number, l: 'de' | 'en', d = 0) => formatMoney(x, d, l);
const hf = fees(handy.fine!);
const inc = { base: handy.fine!, danger: increase(handy.fine!, 'danger'), damage: increase(handy.fine!, 'damage') };
const vor = vorsatz(in21.fine, true);

export default defineGuide({
  id: 'bussgeldbescheid',
  group: 'verstoesse',
  order: 100,
  mini: 'bescheid',
  related: ['bussgeldrechner', 'verjaehrung-bussgeld', 'fahrverbot', 'punkte-in-flensburg', 'punkte-abfragen'],
  sources: ['owig107', 'bkatv', 'stvg26', 'fevAnl13'],
  de: {
    slug: 'bussgeldbescheid',
    nav: 'Bußgeldbescheid',
    card: 'Vom Anhörungsbogen bis zur Rechtskraft: Gebühren, Fristen, Zahlung und Eintrag in Flensburg.',
    title: 'Bußgeldbescheid 2026: Gebühren, Einspruchsfrist, Ablauf',
    description: `Bußgeldbescheid 2026: Gebühr 5\u00a0% des Bußgelds, mindestens ${V.gebuehr_min} €, plus ${m(V.zustellung, 'de', 2)} Zustellung, Einspruch binnen ${V.einspruch_wochen} Wochen. Ablauf, Rechtskraft und Zahlung erklärt.`,
    h1: 'Bußgeldbescheid: Ablauf, Kosten und Fristen',
    intro: `Ab einem Bußgeld von mehr als ${V.verwarnung_max} Euro gibt es keinen Zettel mehr zum Sofortzahlen, sondern ein förmliches Verfahren mit eigenen Kosten und Fristen.`,
    resume: `Ein Bußgeldbescheid ist die förmliche Entscheidung der Behörde über eine Verkehrsordnungswidrigkeit und folgt in der Regel auf einen Anhörungsbogen. Er ergeht, wenn das Bußgeld über ${V.verwarnung_max} Euro liegt oder ein Verwarnungsgeld nicht gezahlt wurde. Zum Regelsatz aus dem Bußgeldkatalog kommen nach § 107 OWiG eine Gebühr von fünf Prozent, mindestens ${V.gebuehr_min} und höchstens ${formatMoney(V.gebuehr_max, 0, 'de')}, und ${m(V.zustellung, 'de', 2)} für die Zustellung. Aus ${handy.fine} Euro für das Handy am Steuer werden so ${m(handy.fine! + hf.total, 'de', 2)}. Gegen den Bescheid kann innerhalb von ${V.einspruch_wochen} Wochen nach Zustellung schriftlich oder zur Niederschrift Einspruch eingelegt werden (§ 67 OWiG). Geschieht das nicht, wird er rechtskräftig, und die Zahlung ist spätestens zwei Wochen danach fällig. Verstöße mit Punkten werden erst mit der Rechtskraft im Fahreignungsregister in Flensburg eingetragen.`,
    faqs: [
      { q: 'Ab wann läuft die Einspruchsfrist beim Bußgeldbescheid?', a: `Mit der Zustellung, nicht mit dem Datum auf dem Bescheid. § 67 Abs. 1 OWiG gibt ${V.einspruch_wochen} Wochen ab Zustellung. Bei der Zustellung mit Postzustellungsurkunde vermerkt der Zusteller das Datum auf dem gelben Umschlag; dieses Datum zählt auch dann, wenn der Brief nur in den Briefkasten eingelegt wurde. Der Einspruch ist schriftlich oder zur Niederschrift bei der Behörde einzulegen, die den Bescheid erlassen hat.` },
      { q: 'Kann ein Einspruch gegen den Bußgeldbescheid teurer werden?', a: 'Ja, das ist möglich. § 66 Abs. 2 Nr. 1 Buchstabe b OWiG verlangt, dass der Bescheid ausdrücklich darauf hinweist: Bei einem Einspruch kann auch eine für den Betroffenen nachteiligere Entscheidung getroffen werden. Hinzu kommen im gerichtlichen Verfahren eigene Kosten. Der Einspruch lässt sich nach § 67 Abs. 2 OWiG auf bestimmte Punkte beschränken, etwa auf die Höhe der Geldbuße.' },
      { q: 'Was passiert, wenn ich den Bußgeldbescheid nicht bezahle?', a: 'Der Bescheid fordert dazu auf, spätestens zwei Wochen nach Rechtskraft zu zahlen oder der Vollstreckungsbehörde schriftlich darzulegen, warum das wirtschaftlich nicht zumutbar ist (§ 66 Abs. 2 Nr. 2 OWiG). Er belehrt außerdem darüber, dass bei Nichterfüllung Erzwingungshaft nach § 96 OWiG angeordnet werden kann. Ratenzahlung ist eine Zahlungserleichterung, die beantragt werden kann.' },
      { q: 'Wie lange kann ein rechtskräftiges Bußgeld noch eingetrieben werden?', a: `Nach § 34 OWiG drei Jahre bei einer Geldbuße bis ${formatMoney(vollGrenze, 0, 'de')}, fünf Jahre bei einer höheren. Die Frist beginnt mit der Rechtskraft. Sie ruht unter anderem, solange eine Zahlungserleichterung wie Ratenzahlung bewilligt ist oder die Vollstreckung ausgesetzt ist. Mit dieser Vollstreckungsverjährung nicht zu verwechseln ist die Verfolgungsverjährung von ${V.verjaehrung_monate} Monaten vor dem Bescheid.` },
      { q: 'Was kostet die Akteneinsicht im Bußgeldverfahren?', a: `Wer beantragt, dass die Akte verschickt wird, zahlt nach § 107 Abs. 5 OWiG pauschal ${akte} Euro je Sendung einschließlich Rücksendung. Wird die Akte elektronisch geführt und elektronisch übermittelt, fällt diese Pauschale nicht an. Die Akte enthält etwa das Messprotokoll und das Foto, auf die sich der Bescheid als Beweismittel stützt.` },
    ],
    body: (h) => `
<h2>Der Weg zum Bescheid</h2>
<p>Ein Bußgeldverfahren beginnt nicht mit dem Bescheid, sondern mit einer Feststellung: ein Blitzerfoto, eine Anzeige, eine Kontrolle. Danach laufen in der Regel vier Schritte ab.</p>
<ol>
<li><strong>Anhörung.</strong> Die Behörde gibt dem Betroffenen Gelegenheit, sich zum Vorwurf zu äußern. § 55 OWiG lässt dafür genügen, dass diese Gelegenheit besteht; meist geschieht das mit einem Anhörungsbogen. Ist der Halter nicht der Fahrer, bekommt er oft einen Zeugenfragebogen.</li>
<li><strong>Bescheid.</strong> Nach § 65 OWiG wird die Ordnungswidrigkeit durch Bußgeldbescheid geahndet. Er wird förmlich zugestellt.</li>
<li><strong>Einspruchsfrist.</strong> Ab Zustellung laufen ${V.einspruch_wochen} Wochen.</li>
<li><strong>Rechtskraft.</strong> Ohne Einspruch wird der Bescheid rechtskräftig und vollstreckbar. Dann ist zu zahlen, und ein Verstoß mit Punkten geht an das Kraftfahrt-Bundesamt.</li>
</ol>
<p>Ein Verwarnungsgeld bis ${h.eur(V.verwarnung_max)} durchläuft diese Schritte nicht. Es wird mit Einverständnis und Zahlung wirksam, kostet keine Gebühren und erzeugt keinen Eintrag. Erst wenn es unbezahlt bleibt oder der Regelsatz höher ist, beginnt das förmliche Verfahren.</p>

<h2>Was im Bescheid stehen muss</h2>
<p>§ 66 OWiG schreibt den Inhalt vor. Der Bescheid nennt die Person, gegebenenfalls den Verteidiger, die Tat mit Zeit und Ort, die gesetzlichen Merkmale und die angewendeten Bußgeldvorschriften, die Beweismittel, die Geldbuße und die Nebenfolgen wie ein Fahrverbot. Außerdem muss er drei Hinweise enthalten: dass er ohne Einspruch rechtskräftig und vollstreckbar wird, dass ein Einspruch auch zu einer nachteiligeren Entscheidung führen kann, und dass zwei Wochen nach Rechtskraft zu zahlen ist, verbunden mit der Belehrung über die Erzwingungshaft. Eine weitergehende Begründung braucht er nicht.</p>
<p>Es lohnt sich, den Bescheid Zeile für Zeile mit dem eigenen Kenntnisstand abzugleichen: Kennzeichen, Datum, Uhrzeit, Ort, gemessene und vorgeworfene Geschwindigkeit, die Nummer aus dem Katalog. Die Beträge lassen sich mit dem ${h.a('bussgeldrechner', 'Bußgeldrechner')} nachvollziehen.</p>

<h2>Die Kosten nach § 107 OWiG</h2>
<p>Das Bußgeld selbst steht im Katalog der ${h.src('bkatv', 'Bußgeldkatalog-Verordnung')}. Die Kosten des Bescheids regelt ${h.src('owig107', '§ 107 OWiG')}: Die Gebühr beträgt fünf Prozent der festgesetzten Geldbuße, mindestens ${h.eur(V.gebuehr_min)} und höchstens ${h.eur(V.gebuehr_max)}. Als Auslagen kommen für jede förmliche Zustellung ${h.eur(V.zustellung, 2)} hinzu. Bis zu einem Bußgeld von ${h.eur(V.gebuehr_min / V.gebuehr_satz)} greift also immer die Mindestgebühr.</p>
${h.table(['Verstoß', 'BKat-Nr.', 'Bußgeld', 'Gebühr', 'Zustellung', 'Gesamt'], [
  ['Ohne Winterreifen bei Glätte', ex[0].nr, h.eur(ex[0].fine), h.eur(ex[0].f.gebuehr, 2), h.eur(ex[0].f.auslagen, 2), h.eur(ex[0].fine + ex[0].f.total, 2)],
  ['Handy am Steuer', ex[1].nr, h.eur(ex[1].fine), h.eur(ex[1].f.gebuehr, 2), h.eur(ex[1].f.auslagen, 2), h.eur(ex[1].fine + ex[1].f.total, 2)],
  ['Keine Rettungsgasse', ex[2].nr, h.eur(ex[2].fine), h.eur(ex[2].f.gebuehr, 2), h.eur(ex[2].f.auslagen, 2), h.eur(ex[2].fine + ex[2].f.total, 2)],
  ['0,5 Promille, erstmals', ex[3].nr, h.eur(ex[3].fine), h.eur(ex[3].f.gebuehr, 2), h.eur(ex[3].f.auslagen, 2), h.eur(ex[3].fine + ex[3].f.total, 2)],
  ['0,5 Promille, mit Voreintragung', ex[4].nr, h.eur(ex[4].fine), h.eur(ex[4].f.gebuehr, 2), h.eur(ex[4].f.auslagen, 2), h.eur(ex[4].fine + ex[4].f.total, 2)],
], 'Gebühr und Zustellung nach § 107 Abs. 1 und 3 OWiG, berechnet mit dem Katalogmodul', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Weitere Auslagen sind möglich, etwa für Sachverständige oder für die Versendung der Akte, für die § 107 Abs. 5 eine Pauschale von ${h.eur(akte)} vorsieht, sofern sie nicht elektronisch übermittelt wird. Bei Halt- und Parkverstößen, deren Fahrer nicht ermittelt wird, gilt eine Sonderregel: Der Halter trägt die Kosten mit einer festen Gebühr von ${h.eur(V.halterkosten_25a)}, aber kein Bußgeld.</p>

<h2>Warum der Betrag vom Katalog abweichen kann</h2>
<p>Der Katalog nennt Regelsätze für fahrlässige Begehung unter gewöhnlichen Umständen. Der Bescheid kann aus vier Gründen darüber liegen:</p>
<ul>
<li><strong>Vorsatz.</strong> Nach § 3 Abs. 4a BKatV wird jeder Regelsatz über ${h.eur(V.verwarnung_max)} verdoppelt. Aus ${h.eur(in21.fine)} für 21 km/h innerorts werden ${h.eur(vor)}.</li>
<li><strong>Gefährdung oder Sachbeschädigung.</strong> Tabelle 4 im Anhang erhöht die Regelsätze, bei denen das nicht schon eingerechnet ist. Aus ${h.eur(inc.base)} werden ${h.eur(inc.danger)} bei Gefährdung und ${h.eur(inc.damage)} bei Sachbeschädigung.</li>
<li><strong>Mehrere Verstöße in einer Handlung.</strong> § 3 Abs. 5 BKatV wendet dann nur den höchsten Regelsatz an, der angemessen erhöht werden kann.</li>
<li><strong>Absehen vom Fahrverbot.</strong> Verzichtet die Behörde ausnahmsweise auf ein Regelfahrverbot, soll das Bußgeld nach § 4 Abs. 4 BKatV angemessen erhöht werden; einen festen Betrag nennt die Verordnung nicht.</li>
</ul>
<p>Steht im Bescheid ein höherer Betrag als im Katalog, sollte einer dieser Gründe erkennbar sein. Die Gebühr wird dann aus dem erhöhten Bußgeld berechnet.</p>

<h2>Der Anhörungsbogen: was Pflicht ist und was nicht</h2>
<p>Auf dem Anhörungsbogen sind die Angaben zur Person anzugeben: Name, Anschrift, Geburtsdatum. Zur Sache selbst muss sich der Betroffene nicht äußern; das Schweigen darf ihm nicht als Eingeständnis ausgelegt werden. Ein Anhörungsbogen ist auch noch kein Bescheid. Er setzt keine Zahlungspflicht in Gang, hat aber eine Wirkung auf die Frist: Die Bekanntgabe, dass ein Verfahren eingeleitet ist, unterbricht die Verjährung.</p>

<h2>Einspruch: Recht, Form und Frist</h2>
<p>Der Einspruch ist ein Recht, das jeder Betroffene hat, und er ist an eine kurze Frist gebunden. Nach § 67 OWiG ist er innerhalb von ${V.einspruch_wochen} Wochen nach Zustellung einzulegen, schriftlich oder zur Niederschrift bei der Verwaltungsbehörde, die den Bescheid erlassen hat. Eine Begründung verlangt das Gesetz nicht. Der Einspruch kann auf einzelne Beschwerdepunkte beschränkt werden, zum Beispiel auf die Höhe der Geldbuße oder auf das Fahrverbot.</p>
<p>Mit dem Einspruch prüft zunächst die Behörde den Fall erneut. Hält sie an ihrer Entscheidung fest, gibt sie die Akten über die Staatsanwaltschaft an das Amtsgericht ab. Der Bescheid weist selbst darauf hin, dass das Ergebnis dann auch ungünstiger ausfallen kann. Ob ein Einspruch im Einzelfall sinnvoll ist, beantwortet diese Seite nicht; sie beschreibt nur das Verfahren.</p>

<h2>Rechtskraft, Zahlung und Vollstreckung</h2>
<p>Wird kein Einspruch eingelegt, wird der Bescheid nach Ablauf der Frist rechtskräftig. Ab dann hat der Betroffene zwei Wochen Zeit, das Bußgeld samt Kosten an die angegebene Kasse zu zahlen. Wer das wirtschaftlich nicht kann, muss es der Vollstreckungsbehörde innerhalb dieser Zeit schriftlich oder zur Niederschrift darlegen. Ratenzahlung ist als Zahlungserleichterung möglich. Wer weder zahlt noch seine Lage darlegt, riskiert Erzwingungshaft nach § 96 OWiG; sie ersetzt die Zahlung nicht, sondern soll sie erzwingen.</p>
<p>Eine rechtskräftige Geldbuße kann nicht unbegrenzt vollstreckt werden. § 34 OWiG setzt die Grenze bei drei Jahren für Beträge bis ${h.eur(vollGrenze)} und bei fünf Jahren für höhere, jeweils ab Rechtskraft. Die Frist ruht, solange Raten bewilligt oder die Vollstreckung ausgesetzt ist.</p>

<h2>Fahrverbot und Punkte als Folge</h2>
<p>Enthält der Bescheid ein Fahrverbot, beginnt dessen Uhr erst mit der Rechtskraft, beim ersten Verbot seit zwei Jahren mit einer Schonfrist von ${V.fahrverbot_schonfrist_monate} Monaten. Die Einzelheiten stehen auf der Seite zum ${h.a('fahrverbot', 'Fahrverbot')}.</p>
<p>Punkte entstehen nur für Verstöße aus ${h.src('fevAnl13', 'Anlage 13 der Fahrerlaubnis-Verordnung')}, in der Praxis ab einem Bußgeld von ${h.eur(minEintrag)}. Die Bußgeldstelle meldet die rechtskräftige Entscheidung an das Kraftfahrt-Bundesamt. Ab der Rechtskraft läuft auch die Tilgungsfrist: zweieinhalb Jahre für einen Punkt, fünf Jahre für zwei. Den eigenen Stand zeigt eine kostenlose Auskunft, wie auf der Seite ${h.a('punkte-abfragen', 'Punkte abfragen')} beschrieben; was die Punkte bewirken, erklärt der Überblick zu den ${h.a('punkte-in-flensburg', 'Punkten in Flensburg')}.</p>

<h2>Bescheid und Verjährung</h2>
<p>Seit dem 1. Juli 2026 verjährt die Verfolgung von Verkehrsordnungswidrigkeiten nach ${h.src('stvg26', '§ 26 Abs. 3 StVG')} in ${V.verjaehrung_monate} Monaten. Der Erlass des Bescheids unterbricht diese Frist, sofern er binnen zwei Wochen zugestellt wird; sonst unterbricht erst die Zustellung (§ 33 Abs. 1 Nr. 9 OWiG). Danach beginnt die Frist neu. Wie die einzelnen Unterbrechungen wirken und wo die absolute Grenze liegt, beschreibt die Seite zur ${h.a('verjaehrung-bussgeld', 'Verjährung von Bußgeldern')}.</p>

<h2>Beispiel: 21 km/h zu schnell in der Stadt</h2>
<p>Gemessen werden innerorts 74 km/h bei erlaubten 50, vorgeworfen nach Toleranzabzug 71 km/h, also 21 km/h zu viel. Der Katalog sieht ${h.eur(in21.fine)} und ${in21.points} Punkt vor. Der Bescheid fügt ${h.eur(fees(in21.fine).gebuehr, 2)} Gebühr und ${h.eur(V.zustellung, 2)} Zustellung hinzu, zusammen ${h.eur(in21.total, 2)}. Zwei Wochen nach Zustellung wird er ohne Einspruch rechtskräftig, zwei Wochen später ist die Zahlung fällig, und der Punkt steht ab der Rechtskraft im Register, wo er nach zweieinhalb Jahren tilgungsreif wird.</p>`,
  },
  en: {
    slug: 'fine-notice-germany',
    nav: 'Fine notice',
    card: 'From the hearing form to a final decision: fees, deadlines, payment and Flensburg points.',
    title: 'Fine Notice Germany 2026: Bußgeldbescheid Fees, Deadlines',
    description: `German fine notice (Bußgeldbescheid) 2026: 5\u00a0% fee, at least ${m(V.gebuehr_min, 'en')}, plus ${m(V.zustellung, 'en', 2)} delivery; objection within ${V.einspruch_wochen} weeks of delivery. Steps and payment explained.`,
    h1: 'The German fine notice: steps, costs and deadlines',
    intro: `Above a ${V.verwarnung_max}-euro fine, Germany swaps the quick warning slip for a formal procedure with its own fees and deadlines.`,
    resume: `A Bußgeldbescheid is the formal fine notice a German authority issues for a traffic offence, usually after sending you a hearing form (Anhörungsbogen). It is used whenever the fine exceeds ${V.verwarnung_max} euros or a warning fine went unpaid. On top of the catalogue fine, Section 107 of the Administrative Offences Act (OWiG) adds a fee of five per cent, at least ${V.gebuehr_min} and at most ${formatMoney(V.gebuehr_max, 0, 'en')}, plus ${m(V.zustellung, 'en', 2)} for formal delivery. A ${handy.fine}-euro fine for using a phone at the wheel therefore costs ${m(handy.fine! + hf.total, 'en', 2)}. You have the right to lodge an objection (Einspruch) within ${V.einspruch_wochen} weeks of delivery, in writing or in person at the issuing authority (Section 67 OWiG). Otherwise the notice becomes final and payment is due two weeks later. Offences that carry points are entered in the Flensburg register only once the notice is final.`,
    faqs: [
      { q: 'I was on holiday when the German fine notice arrived. Has the deadline passed?', a: `The ${V.einspruch_wochen}-week objection period runs from delivery, and delivery is complete when the letter is put in your letterbox, even if you are away. The date is noted on the yellow envelope used for formal delivery. If you missed the deadline through no fault of your own, German law knows a request to be restored to the previous position; the authority decides on it.` },
      { q: 'Do I have to fill in the German hearing form if I was not driving?', a: 'The hearing form gives you the chance to comment on the accusation. As the person concerned, you are not obliged to say anything about the offence itself, but you must give your personal details correctly. If you were not driving, keepers often receive a witness questionnaire instead, which has different rules. Read the form closely, since it states which parts are compulsory.' },
      { q: 'Can I pay a German traffic fine in instalments?', a: 'Yes, on application. The notice tells you to pay within two weeks of it becoming final or, if you cannot, to explain your financial situation in writing to the enforcement authority (Section 66(2) OWiG). Instalments count as a payment concession. While a concession is granted, the enforcement limitation period is suspended, so the debt does not lapse in the meantime.' },
      { q: 'How much does a German fine notice add for a fine of 500 euros?', a: `For ${ex[3].fine} euros, the usual amount for driving with 0.5 per mille for the first time, five per cent gives a fee of ${m(ex[3].f.gebuehr, 'en', 2)}, which is above the ${V.gebuehr_min}-euro minimum. Add ${m(V.zustellung, 'en', 2)} for delivery and the total is ${m(ex[3].fine + ex[3].f.total, 'en', 2)}. A one-month driving ban and two points come with that offence.` },
    ],
    body: (h) => `
<h2>From the camera flash to the letter</h2>
<p>For most expats the first contact is not the fine notice but a letter asking questions. German procedure follows a fixed order, and knowing it makes each envelope easier to place.</p>
<ol>
<li><strong>Hearing form (Anhörungsbogen).</strong> Section 55 OWiG only requires that you are given a chance to comment. The form names the offence, the date and place, and asks for your personal details.</li>
<li><strong>Witness questionnaire (Zeugenfragebogen).</strong> If the authority assumes the keeper was not driving, for example because the photo shows someone else, the keeper is asked who was.</li>
<li><strong>Fine notice (Bußgeldbescheid).</strong> The formal decision, delivered in a yellow envelope with a delivery record.</li>
<li><strong>Final decision.</strong> After ${V.einspruch_wochen} weeks without an objection, the notice becomes final (rechtskräftig) and enforceable.</li>
</ol>
<p>Small offences up to ${h.eur(V.verwarnung_max)} usually stop at a warning fine (Verwarnungsgeld) that you pay without fees. Only if you leave it unpaid, or the amount is higher, does the formal route begin.</p>

<h2>What the notice must contain</h2>
<p>Section 66 OWiG lists the contents: your details, the offence with time and place, the legal provisions applied, the evidence, the fine and any additional consequence such as a driving ban. It must also tell you three things: that it becomes final and enforceable if you do not object, that an objection can lead to a less favourable decision, and that you must pay within two weeks of it becoming final, failing which coercive detention (Erzwingungshaft) can be ordered. The notice does not have to give further reasons.</p>
<p>German authorities write in German only. If your German is still basic, translate the key lines, especially the date of delivery on the envelope and the paragraph on the deadline. Comparing every line with what you remember, from the number plate to the measured speed, takes ten minutes and avoids paying for someone else's car.</p>

<h2>How the fees are calculated</h2>
<p>The fine comes from the catalogue in the ${h.src('bkatv', 'Fine Catalogue Ordinance')}. The costs of the notice come from ${h.src('owig107', 'Section 107 OWiG')}: five per cent of the fine as a fee, at least ${h.eur(V.gebuehr_min)} and at most ${h.eur(V.gebuehr_max)}, plus ${h.eur(V.zustellung, 2)} for each formal delivery. Up to a fine of ${h.eur(V.gebuehr_min / V.gebuehr_satz)} the minimum fee applies.</p>
${h.table(['Offence', 'BKat no.', 'Fine', 'Fee', 'Delivery', 'Total'], [
  ['No winter tyres in icy conditions', ex[0].nr, h.eur(ex[0].fine), h.eur(ex[0].f.gebuehr, 2), h.eur(ex[0].f.auslagen, 2), h.eur(ex[0].fine + ex[0].f.total, 2)],
  ['Phone at the wheel', ex[1].nr, h.eur(ex[1].fine), h.eur(ex[1].f.gebuehr, 2), h.eur(ex[1].f.auslagen, 2), h.eur(ex[1].fine + ex[1].f.total, 2)],
  ['No emergency corridor', ex[2].nr, h.eur(ex[2].fine), h.eur(ex[2].f.gebuehr, 2), h.eur(ex[2].f.auslagen, 2), h.eur(ex[2].fine + ex[2].f.total, 2)],
  ['0.5 per mille, first offence', ex[3].nr, h.eur(ex[3].fine), h.eur(ex[3].f.gebuehr, 2), h.eur(ex[3].f.auslagen, 2), h.eur(ex[3].fine + ex[3].f.total, 2)],
  ['0.5 per mille, with a prior entry', ex[4].nr, h.eur(ex[4].fine), h.eur(ex[4].f.gebuehr, 2), h.eur(ex[4].f.auslagen, 2), h.eur(ex[4].fine + ex[4].f.total, 2)],
], 'Fee and delivery under Section 107(1) and (3) OWiG, calculated with the catalogue engine', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Further expenses can arise, such as expert costs or ${h.eur(akte)} for posting the case file if you ask to see it and it is not sent electronically. For parking cases where the driver cannot be identified, the keeper pays a flat ${h.eur(V.halterkosten_25a)} fee but no fine.</p>

<h2>Why the amount can differ from the catalogue</h2>
<p>Catalogue amounts assume a careless offence in ordinary circumstances. The notice can be higher for four reasons:</p>
<ul>
<li><strong>Intent.</strong> Section 3(4a) BKatV doubles any standard fine above ${h.eur(V.verwarnung_max)}, so ${h.eur(in21.fine)} for 21 km/h over in town becomes ${h.eur(vor)}.</li>
<li><strong>Danger or damage.</strong> Table 4 of the appendix raises fines where this is not already built in: ${h.eur(inc.base)} becomes ${h.eur(inc.danger)} if someone was endangered and ${h.eur(inc.damage)} if property was damaged.</li>
<li><strong>Several offences in one act.</strong> Only the highest standard fine applies under Section 3(5) BKatV, and it may be raised appropriately.</li>
<li><strong>No driving ban.</strong> If the authority exceptionally waives a standard ban, Section 4(4) BKatV says the fine should be raised appropriately, without naming a figure.</li>
</ul>
<p>The fee is then five per cent of the higher amount, still with the ${h.eur(V.gebuehr_min)} minimum.</p>

<h2>Filling in the hearing form</h2>
<p>The personal details on a hearing form are compulsory: name, address, date of birth. Giving false personal details is itself an offence. Comments on the accusation are voluntary, and silence is not treated as an admission. The form is not yet a fine and creates no duty to pay, but it does matter for timing: notifying you that proceedings have begun interrupts the limitation period, which then starts again.</p>

<h2>The right to object</h2>
<p>Every recipient may lodge an Einspruch. It must reach the authority that issued the notice within ${V.einspruch_wochen} weeks of delivery, in writing or recorded in person there (Section 67 OWiG). No reasons are required by law, and the objection can be limited to particular points, such as the amount or the driving ban. The authority then reviews the case. If it maintains its decision, the file goes via the public prosecutor to the local court (Amtsgericht). As the notice itself warns, the outcome can then be worse than the original decision, and court proceedings carry their own costs. This page describes the procedure only; it does not assess any individual case.</p>

<h2>Paying, and what happens if you do not</h2>
<p>Once the notice is final, payment is due within two weeks to the account stated. Fines are paid by bank transfer quoting the file reference (Aktenzeichen); without it, the payment may not be matched. If you cannot pay, tell the enforcement authority in writing within that period and ask for instalments. Ignoring the notice altogether can lead to coercive detention under Section 96 OWiG, which does not cancel the debt. A final fine cannot be enforced forever: Section 34 OWiG sets three years for amounts up to ${h.eur(vollGrenze)} and five years above, counted from the date the decision became final, with the clock paused during instalments.</p>

<h2>Points, bans and your licence</h2>
<p>If the offence appears in ${h.src('fevAnl13', 'annex 13 of the Driving Licence Ordinance')}, which in practice means fines from ${h.eur(minEintrag)}, the authority reports the final decision to the Federal Motor Transport Authority in Flensburg. The deletion period starts on that date, two and a half years for one point. The register stores the person, so this applies whatever licence you hold; the ${h.a('punkte-in-flensburg', 'guide to Flensburg points')} explains the stages, and a free extract shows your record (${h.a('punkte-abfragen', 'checking your points')}). A driving ban in the notice starts only after it becomes final; for a first ban in two years you get a ${V.fahrverbot_schonfrist_monate}-month window, described on the ${h.a('fahrverbot', 'driving ban page')}.</p>

<h2>The notice and the limitation period</h2>
<p>Since 1 July 2026, traffic offences become time-barred after ${V.verjaehrung_monate} months under ${h.src('stvg26', 'Section 26(3) StVG')}. Issuing the notice interrupts that period if it is delivered within two weeks; otherwise delivery itself interrupts it (Section 33(1) no. 9 OWiG). The period then starts again. Details, including the absolute upper limit, are on the page about ${h.a('verjaehrung-bussgeld', 'limitation periods for fines')}.</p>

<h2>Worked example: 21 km/h over in town</h2>
<p>A camera records 74 km/h in a 50 zone. After the tolerance deduction, 71 km/h is held against you, 21 km/h too fast. The catalogue sets ${h.eur(in21.fine)} and ${in21.points} point. The notice adds ${h.eur(fees(in21.fine).gebuehr, 2)} as a fee and ${h.eur(V.zustellung, 2)} for delivery, ${h.eur(in21.total, 2)} in total. Without an objection it becomes final two weeks after delivery, payment is due two weeks after that, and the point is recorded from the date it became final. You can check other cases with the ${h.a('bussgeldrechner', 'fine calculator')}.</p>`,
  },
});
