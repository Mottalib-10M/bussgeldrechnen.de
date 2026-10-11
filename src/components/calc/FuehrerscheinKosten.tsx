/** Coût du permis : frais officiels (GebOSt) + prix de l'auto-école saisis par l'utilisateur (prix libres). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultCard from './ResultCard';
import { licenceFees, type Klasse } from '../../lib/engine/kosten';
import { formatMoney } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type L = 'de' | 'en';
const TX = {
  de: { k: 'Führerscheinklasse', B: 'B (Auto)', A: 'A (Motorrad)', AM: 'AM (Roller)', grund: 'Grundbetrag der Fahrschule', grundHelp: 'Aus dem Preisaushang Ihrer Fahrschule.', std: 'Übungsstunden', stdPreis: 'Preis je Übungsstunde', sonder: 'Sonderfahrten (Pflicht für B: 12)', sonderPreis: 'Preis je Sonderfahrt',
    vorstell: 'Vorstellung zur Prüfung (Fahrschule, je Versuch)', theo: 'Theorieversuche', prax: 'Praxisversuche', extra: 'Sehtest, Erste Hilfe, Passbild', head: 'Führerschein gesamt', amt: 'Behörde (GebOSt 201 + 202.1)', theorie: 'TÜV/DEKRA Theorie', praxis: 'TÜV/DEKRA Praxis',
    schule: 'Fahrschule (Ihre Preise)', sonst: 'Sehtest, Erste Hilfe, Bild', amtlich: 'davon amtliche Gebühren', note: 'Amtliche Gebühren nach der Gebührenordnung für Maßnahmen im Straßenverkehr (Stand 12.8.2026). Fahrschulpreise sind frei kalkuliert: tragen Sie die Ihrer Fahrschule ein.', method: 'So rechnen wir' },
  en: { k: 'Licence class', B: 'B (car)', A: 'A (motorbike)', AM: 'AM (scooter)', grund: 'Driving school base fee', grundHelp: 'From your driving school’s price list.', std: 'Practice lessons', stdPreis: 'Price per lesson', sonder: 'Special drives (mandatory for B: 12)', sonderPreis: 'Price per special drive',
    vorstell: 'Presentation for the test (school, per attempt)', theo: 'Theory attempts', prax: 'Practical attempts', extra: 'Eye test, first aid, photo', head: 'Driving licence in total', amt: 'Authority (GebOSt 201 + 202.1)', theorie: 'TÜV/DEKRA theory', praxis: 'TÜV/DEKRA practical',
    schule: 'Driving school (your prices)', sonst: 'Eye test, first aid, photo', amtlich: 'of which official fees', note: 'Official fees under the road traffic fee schedule (as of 12 Aug 2026). Driving school prices are set freely: enter your school’s figures.', method: 'How we calculate' },
};

export default function FuehrerscheinKosten({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const t = TX[lang]; const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [k, setK] = useState<Klasse>('B'); const [grund, setGrund] = useState(400); const [std, setStd] = useState(25); const [stdP, setStdP] = useState(65);
  const [sonder, setSonder] = useState(12); const [sonderP, setSonderP] = useState(85); const [vor, setVor] = useState(200);
  const [theo, setTheo] = useState('1'); const [prax, setPrax] = useState('1'); const [extra, setExtra] = useState(80);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    const kk = str(u, 'k', 'B'); if (['B', 'A', 'AM'].includes(kk)) setK(kk as Klasse);
    setGrund(num(u, 'g', 400)); setStd(num(u, 'st', 25)); setStdP(num(u, 'sp', 65)); setSonder(num(u, 'so', 12)); setSonderP(num(u, 'sop', 85)); setVor(num(u, 'v', 200));
    setTheo(str(u, 't', '1')); setPrax(str(u, 'p', '1')); setExtra(num(u, 'x', 80)); }, []);
  useEffect(() => { updateURL({ k, g: grund, st: std, sp: stdP, so: sonder, sop: sonderP, v: vor, t: theo, p: prax, x: extra }); }, [k, grund, std, stdP, sonder, sonderP, vor, theo, prax, extra]);
  const r = useMemo(() => {
    const f = licenceFees(k, Number(theo), Number(prax));
    const schule = grund + std * stdP + sonder * sonderP + vor * Number(prax);
    return { f, schule, total: f.total + schule + extra };
  }, [k, theo, prax, grund, std, stdP, sonder, sonderP, vor, extra]);
  const tries = ['1', '2', '3'].map((x) => ({ value: x, label: x }));
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="fk-k" label={t.k} value={k} onChange={(x) => setK(x as Klasse)} options={(['B', 'A', 'AM'] as const).map((x) => ({ value: x, label: t[x] }))} />
            <NumberField id="fk-g" label={t.grund} value={grund} onChange={setGrund} unit="€" max={5000} help={t.grundHelp} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="fk-st" label={t.std} value={std} onChange={setStd} max={200} lang={lang} />
            <NumberField id="fk-sp" label={t.stdPreis} value={stdP} onChange={setStdP} unit="€" max={500} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="fk-so" label={t.sonder} value={sonder} onChange={setSonder} max={50} lang={lang} />
            <NumberField id="fk-sop" label={t.sonderPreis} value={sonderP} onChange={setSonderP} unit="€" max={500} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="fk-v" label={t.vorstell} value={vor} onChange={setVor} unit="€" max={2000} lang={lang} />
            <NumberField id="fk-x" label={t.extra} value={extra} onChange={setExtra} unit="€" max={2000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="fk-t" label={t.theo} value={theo} onChange={setTheo} options={tries} />
            <SelectField id="fk-p" label={t.prax} value={prax} onChange={setPrax} options={tries} />
          </div>
        </form>
        <ResultCard head={t.head} big={$(r.total)} sub={`${t.amtlich}: ${$(r.f.total, 2)}`} rows={[
          { label: t.amt, value: $(r.f.amt, 2) }, { label: t.theorie, value: $(r.f.theorie, 2) }, { label: t.praxis, value: $(r.f.praxis, 2) },
          { label: t.schule, value: $(r.schule) }, { label: t.sonst, value: $(extra) }]} note={t.note} methodHref={methodHref} methodLabel={t.method} />
      </div>
    </div>
  );
}
