/** Kfz-Steuer-Rechner. Moteur : lib/engine/kfzsteuer.ts (KraftStG), contrôlé sur 21 cas du rechner du BMF. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultCard from './ResultCard';
import { pkw, elektro, krad, wohnmobil, anhaenger, schwerbehindert, type TaxResult, type AltKlasse } from '../../lib/engine/kfzsteuer';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type L = 'de' | 'en';
type Art = 'pkw' | 'elektro' | 'krad' | 'wohnmobil' | 'anhaenger';
const TX = {
  de: { art: 'Fahrzeug', pkw: 'Pkw (Benzin, Diesel, Hybrid)', elektro: 'Elektroauto', krad: 'Motorrad', wohnmobil: 'Wohnmobil', anhaenger: 'Anhänger', fuel: 'Motor', benzin: 'Benzin (Otto)', diesel: 'Diesel',
    ez: 'Jahr der Erstzulassung', month: 'Monat der Erstzulassung', ccm: 'Hubraum', co2: 'CO2 (WLTP, Feld V.7)', co2Help: 'Steht im Fahrzeugschein, Feld V.7.', kg: 'Zulässige Gesamtmasse (Feld F.2)', klasse: 'Schadstoffklasse',
    euro3plus: 'Euro 3 bis 6', euro2: 'Euro 2', euro1: 'Euro 1', ozonfrei: 'ohne Klasse, ozonfrei', sonstige: 'übrige', s4: 'S 4 oder besser', s3: 'S 3 bis S 1', sonst: 'keine Klasse',
    year: 'Steuerjahr', sb: 'Schwerbehinderung (§ 3a)', sbNone: 'keine', sbFree: 'Merkzeichen H, Bl oder aG', sbHalf: 'orangefarbener Ausweis, ohne Freifahrt',
    head: 'Kfz-Steuer pro Jahr', hubraum: 'Hubraumanteil', co2l: 'CO2-Anteil', gewicht: 'Gewichtsanteil', ermaessigung: 'Elektro-Ermäßigung 50 %', schwerbehindert: 'Ermäßigung § 3a',
    regime: 'Rechtsgrundlage', exempt: 'Steuerfrei bis', exemptNo: 'keine Befreiung', monthly: 'pro Monat', note: 'Abgerundet auf volle Euro (§ 11 Abs. 5 KraftStG). Festgesetzt wird die Steuer vom Hauptzollamt.', method: 'So rechnen wir',
    r_a: '§ 9 Abs. 1 Nr. 2 a (Erstzulassung bis 30.6.2009)', r_b: '§ 9 Abs. 1 Nr. 2 b (1.7.2009 bis 31.12.2020)', r_c: '§ 9 Abs. 1 Nr. 2 c (ab 1.1.2021)', r_ab: '§ 18 Abs. 4a: günstigere Regel ab 2009', r_e: '§ 3d, danach § 9 Abs. 1 Nr. 3 und Abs. 2', r_krad: '§ 9 Abs. 1 Nr. 1', r_wohnmobil: '§ 9 Abs. 1 Nr. 2a', r_anhaenger: '§ 9 Abs. 1 Nr. 5' },
  en: { art: 'Vehicle', pkw: 'Car (petrol, diesel, hybrid)', elektro: 'Electric car', krad: 'Motorbike', wohnmobil: 'Motorhome', anhaenger: 'Trailer', fuel: 'Engine', benzin: 'Petrol', diesel: 'Diesel',
    ez: 'Year of first registration', month: 'Month of first registration', ccm: 'Engine size', co2: 'CO2 (WLTP, field V.7)', co2Help: 'Printed in the registration certificate, field V.7.', kg: 'Permitted total weight (field F.2)', klasse: 'Emission class',
    euro3plus: 'Euro 3 to 6', euro2: 'Euro 2', euro1: 'Euro 1', ozonfrei: 'no class, ozone-exempt', sonstige: 'other', s4: 'S 4 or better', s3: 'S 3 to S 1', sonst: 'no class',
    year: 'Tax year', sb: 'Severe disability (Section 3a)', sbNone: 'none', sbFree: 'marks H, Bl or aG', sbHalf: 'orange card, no free transport',
    head: 'Vehicle tax per year', hubraum: 'Engine-size part', co2l: 'CO2 part', gewicht: 'Weight part', ermaessigung: 'Electric reduction 50%', schwerbehindert: 'Section 3a relief',
    regime: 'Legal basis', exempt: 'Tax-free until', exemptNo: 'no exemption', monthly: 'per month', note: 'Rounded down to whole euros (Section 11(5) KraftStG). The main customs office sets the actual tax.', method: 'How we calculate',
    r_a: 'Section 9(1) no. 2a (registered by 30 Jun 2009)', r_b: 'Section 9(1) no. 2b (1 Jul 2009 to 31 Dec 2020)', r_c: 'Section 9(1) no. 2c (from 1 Jan 2021)', r_ab: 'Section 18(4a): the cheaper 2009 rule', r_e: 'Section 3d, then Section 9(1) no. 3 and (2)', r_krad: 'Section 9(1) no. 1', r_wohnmobil: 'Section 9(1) no. 2a', r_anhaenger: 'Section 9(1) no. 5' },
};
const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => String(2026 - i));
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export default function KfzSteuerRechner({ lang = 'de', methodHref, initialArt = 'pkw' }: { lang?: L; methodHref?: string; initialArt?: Art }) {
  const t = TX[lang]; const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [art, setArt] = useState<Art>(initialArt);
  const [fuel, setFuel] = useState<'benzin' | 'diesel'>('benzin');
  const [ezY, setEzY] = useState('2023'); const [ezM, setEzM] = useState('05');
  const [ccm, setCcm] = useState(1498); const [co2, setCo2] = useState(128); const [kg, setKg] = useState(2100);
  const [alt, setAlt] = useState<AltKlasse>('euro3plus'); const [wm, setWm] = useState<'s4' | 's3' | 'sonst'>('s4');
  const [year, setYear] = useState('2026'); const [sb, setSb] = useState<'keine' | 'befreit' | 'halb'>('keine');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    const a = str(u, 'f', initialArt); if (['pkw', 'elektro', 'krad', 'wohnmobil', 'anhaenger'].includes(a)) setArt(a as Art);
    setFuel(str(u, 'mot', 'benzin') === 'diesel' ? 'diesel' : 'benzin'); setEzY(str(u, 'ez', '2023')); setEzM(str(u, 'em', '05'));
    setCcm(num(u, 'ccm', 1498)); setCo2(num(u, 'co2', 128)); setKg(num(u, 'kg', 2100)); setYear(str(u, 'j', '2026'));
    const k = str(u, 'k', 'euro3plus'); if (['euro3plus', 'euro2', 'euro1', 'ozonfrei', 'sonstige'].includes(k)) setAlt(k as AltKlasse);
    const w = str(u, 'wm', 's4'); if (['s4', 's3', 'sonst'].includes(w)) setWm(w as 's4');
    const s = str(u, 'sb', 'keine'); if (['keine', 'befreit', 'halb'].includes(s)) setSb(s as 'keine'); }, []);
  useEffect(() => { updateURL({ f: art, mot: fuel, ez: ezY, em: ezM, ccm, co2, kg, k: alt, wm, j: year, sb }); }, [art, fuel, ezY, ezM, ccm, co2, kg, alt, wm, year, sb]);
  const ez = `${ezY}-${ezM}-01`;
  const r = useMemo((): TaxResult => {
    let base: TaxResult;
    if (art === 'elektro') base = elektro(ez, kg, Number(year));
    else if (art === 'krad') base = krad(ccm);
    else if (art === 'wohnmobil') base = wohnmobil(kg, wm);
    else if (art === 'anhaenger') base = anhaenger(kg);
    else base = pkw({ ez, fuel, ccm, co2, altKlasse: alt });
    return schwerbehindert(base, sb);
  }, [art, ez, kg, year, ccm, wm, fuel, co2, alt, sb]);
  const label = (k: string) => (k === 'co2' ? t.co2l : (t as Record<string, string>)[k] ?? k);
  const rows = [
    ...r.lines.filter((l) => l.amount !== 0).map((l) => ({ label: label(l.label), value: $(l.amount, 2) })),
    { label: t.monthly, value: $(r.annual / 12, 2) },
    { label: t.regime, value: (t as Record<string, string>)[`r_${r.regime === 'a/b' ? 'ab' : r.regime}`] ?? r.regime },
    ...(art === 'elektro' ? [{ label: t.exempt, value: r.exemptUntil ? displayDate(r.exemptUntil, lang === 'de' ? 'de-DE' : 'en-GB') : t.exemptNo }] : []),
  ];
  const pre2009 = art === 'pkw' && ez < '2009-07-01';
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="ks-f" label={t.art} value={art} onChange={(x) => setArt(x as Art)} options={(['pkw', 'elektro', 'krad', 'wohnmobil', 'anhaenger'] as const).map((a) => ({ value: a, label: t[a] }))} />
            {art === 'pkw' && <SelectField id="ks-mot" label={t.fuel} value={fuel} onChange={(x) => setFuel(x as 'benzin')} options={[{ value: 'benzin', label: t.benzin }, { value: 'diesel', label: t.diesel }]} />}
            {art === 'wohnmobil' && <SelectField id="ks-wm" label={t.klasse} value={wm} onChange={(x) => setWm(x as 's4')} options={(['s4', 's3', 'sonst'] as const).map((k) => ({ value: k, label: t[k] }))} />}
          </div>
          {(art === 'pkw' || art === 'elektro') && <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="ks-ez" label={t.ez} value={ezY} onChange={setEzY} options={YEARS.map((y) => ({ value: y, label: y }))} />
            <SelectField id="ks-em" label={t.month} value={ezM} onChange={setEzM} options={MONTHS.map((m) => ({ value: m, label: m }))} />
          </div>}
          {(art === 'pkw' || art === 'krad') && <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ks-ccm" label={t.ccm} value={ccm} onChange={setCcm} unit="cm³" max={10000} lang={lang} />
            {art === 'pkw' && !pre2009 && <NumberField id="ks-co2" label={t.co2} value={co2} onChange={setCo2} unit="g/km" max={1000} help={t.co2Help} lang={lang} />}
            {pre2009 && <SelectField id="ks-k" label={t.klasse} value={alt} onChange={(x) => setAlt(x as AltKlasse)} options={(['euro3plus', 'euro2', 'euro1', 'ozonfrei', 'sonstige'] as const).map((k) => ({ value: k, label: t[k] }))} />}
          </div>}
          {(art === 'elektro' || art === 'wohnmobil' || art === 'anhaenger') && <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ks-kg" label={t.kg} value={kg} onChange={setKg} unit="kg" max={40000} lang={lang} />
            {art === 'elektro' && <SelectField id="ks-j" label={t.year} value={year} onChange={setYear} options={Array.from({ length: 15 }, (_, i) => String(2026 + i)).map((y) => ({ value: y, label: y }))} />}
          </div>}
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="ks-sb" label={t.sb} value={sb} onChange={(x) => setSb(x as 'keine')} options={[{ value: 'keine', label: t.sbNone }, { value: 'befreit', label: t.sbFree }, { value: 'halb', label: t.sbHalf }]} />
          </div>
        </form>
        <ResultCard head={t.head} big={$(r.annual)} rows={rows} note={t.note} methodHref={methodHref} methodLabel={t.method} />
      </div>
      <p className="mt-3 text-xs text-navy-600">{formatNumber(21, 0, lang)} {lang === 'de' ? 'Prüffälle stimmen auf den Euro mit dem Kfz-Steuer-Rechner des Bundesfinanzministeriums überein (Stand 11.10.2026).' : 'test cases match the Federal Finance Ministry calculator to the euro (checked 11 Oct 2026).'}</p>
    </div>
  );
}
