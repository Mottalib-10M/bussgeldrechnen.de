/**
 * Bußgeldrechner complet. Moteur : lib/engine/bkat.ts (tableau officiel de la BKatV, § 107 OWiG, FeV Anl. 12/13).
 * Hydratation (RECETTE §17.5) : premier rendu = valeurs par défaut, l'URL n'est lue que dans useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import ResultCard from './ResultCard';
import { speeding, distance, redLight, phone, alcohol, fromEntry, search, type Outcome, type VehicleClass } from '../../lib/engine/bkat';
import { P } from '../../lib/engine/params';
import { formatMoney, formatNumber } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type L = 'de' | 'en';
export type Mode = 'tempo' | 'rot' | 'abstand' | 'handy' | 'alkohol' | 'nr';
const TX = {
  de: {
    mode: 'Verstoß', tempo: 'Zu schnell', rot: 'Rote Ampel', abstand: 'Abstand', handy: 'Handy am Steuer', alkohol: 'Alkohol / Cannabis', nr: 'Beliebiger Tatbestand',
    limit: 'Erlaubt', measured: 'Gemessen', measuredHelp: 'Wert aus dem Anhörungsbogen; der Toleranzabzug wird hier abgezogen.', where: 'Ort', inner: 'innerorts', outer: 'außerorts',
    tol: 'Toleranz abziehen?', yes: 'Ja', no: 'Nein', cls: 'Fahrzeug', clsC: 'Pkw, Motorrad, Transporter bis 3,5 t', clsA: 'Lkw über 3,5 t, Pkw mit Anhänger, Bus', clsB: 'Gefahrgut oder Bus mit Fahrgästen',
    prior: 'Schon einmal 26 km/h zu schnell (letzte 12 Monate)?', intent: 'Vorsätzlich?', harm: 'Folgen', none: 'keine', danger: 'Gefährdung', damage: 'Sachschaden',
    sec: 'Rotphase länger als 1 Sekunde?', cyclist: 'Mit dem Fahrrad?', speed: 'Tempo', dist: 'Abstand',
    promille: 'Blutalkohol', thc: 'THC im Blutserum', prior2: 'Frühere Alkohol- oder Drogenentscheidungen im Register', p0: 'keine', p1: 'eine', p2: 'mehrere',
    novice: 'Probezeit oder unter 21?', both: 'THC und Alkohol zusammen?', query: 'Stichwort oder BKat-Nummer', queryHelp: 'z. B. „Gurt“, „Parkschein“, „Rettungsgasse“ oder 132.3',
    pick: 'Treffer', head: 'Zu zahlen (Bußgeld + Gebühren)', fine: 'Regelsatz', fees: 'Gebühr und Auslagen (§ 107 OWiG)', total: 'Summe', points: 'Punkte in Flensburg', fv: 'Fahrverbot',
    month: 'Monat', months: 'Monate', noFv: 'keins', probe: 'Probezeit', probeA: 'A-Verstoß', probeB: 'B-Verstoß', probeNone: 'nicht relevant', over: 'Vorwerfbare Überschreitung',
    nrLabel: 'BKat-Nummer', verwarnung: 'Verwarnungsgeld bis 55 €: keine Gebühren, keine Punkte.', nothing: 'Kein Bußgeld nach diesen Angaben.',
    criminal: 'Ab 1,1 Promille gilt absolute Fahruntüchtigkeit: das ist eine Straftat nach § 316 StGB (Geld- oder Freiheitsstrafe, Entziehung der Fahrerlaubnis), kein Bußgeldfall mehr.',
    mpu: 'Ab 1,6 Promille ordnet die Fahrerlaubnisbehörde eine MPU an (§ 13 FeV).', beharrlich: 'Regelfahrverbot wegen beharrlicher Pflichtverletzung (§ 4 Abs. 2 BKatV).',
    method: 'So rechnen wir', note: 'Regelsätze der BKatV in der Fassung vom 12.8.2026. Behörde und Gericht können im Einzelfall abweichen.',
  },
  en: {
    mode: 'Offence', tempo: 'Speeding', rot: 'Red light', abstand: 'Tailgating', handy: 'Phone at the wheel', alkohol: 'Alcohol / cannabis', nr: 'Any offence',
    limit: 'Limit', measured: 'Measured', measuredHelp: 'Figure from the hearing form; the tolerance is deducted here.', where: 'Where', inner: 'built-up area', outer: 'outside towns',
    tol: 'Deduct tolerance?', yes: 'Yes', no: 'No', cls: 'Vehicle', clsC: 'Car, motorbike, van up to 3.5 t', clsA: 'Lorry over 3.5 t, car with trailer, bus', clsB: 'Hazardous goods or bus with passengers',
    prior: 'Already 26 km/h over in the last 12 months?', intent: 'Intentional?', harm: 'Consequences', none: 'none', danger: 'endangered others', damage: 'property damage',
    sec: 'Red for more than 1 second?', cyclist: 'On a bicycle?', speed: 'Speed', dist: 'Gap',
    promille: 'Blood alcohol', thc: 'THC in blood serum', prior2: 'Earlier alcohol or drug decisions on record', p0: 'none', p1: 'one', p2: 'several',
    novice: 'Probation or under 21?', both: 'THC and alcohol together?', query: 'Keyword or BKat number', queryHelp: 'e.g. “Gurt” (seatbelt), “Parkschein”, “Rettungsgasse” or 132.3',
    pick: 'Match', head: 'Amount due (fine + fees)', fine: 'Standard fine', fees: 'Fee and expenses (Section 107 OWiG)', total: 'Total', points: 'Flensburg points', fv: 'Driving ban',
    month: 'month', months: 'months', noFv: 'none', probe: 'Probation', probeA: 'A offence', probeB: 'B offence', probeNone: 'not relevant', over: 'Chargeable excess speed',
    nrLabel: 'BKat number', verwarnung: 'Warning fine up to €55: no fees, no points.', nothing: 'No fine on these inputs.',
    criminal: 'From 1.1 per mille a driver counts as absolutely unfit to drive: that is a criminal offence under Section 316 of the Criminal Code (fine or prison, licence withdrawn), no longer a fine case.',
    mpu: 'From 1.6 per mille the licensing authority orders an MPU assessment (Section 13 FeV).', beharrlich: 'Standard driving ban for persistent breaches (Section 4(2) BKatV).',
    method: 'How we calculate', note: 'Standard rates of the BKatV as amended on 12 Aug 2026. Authorities and courts may deviate in an individual case.',
  },
};
const MODES: Mode[] = ['tempo', 'rot', 'abstand', 'handy', 'alkohol', 'nr'];

export default function BussgeldRechner({ lang = 'de', methodHref, initialMode = 'tempo', lockMode = false }: { lang?: L; methodHref?: string; initialMode?: Mode; lockMode?: boolean }) {
  const t = TX[lang]; const $ = (x: number, d = 0) => formatMoney(x, d, lang); const n = (x: number, d = 0) => formatNumber(x, d, lang);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [limit, setLimit] = useState(50); const [measured, setMeasured] = useState(74);
  const [inner, setInner] = useState('1'); const [tol, setTol] = useState('1'); const [cls, setCls] = useState<VehicleClass>('c');
  const [prior, setPrior] = useState('0'); const [intent, setIntent] = useState('0'); const [harm, setHarm] = useState<'none' | 'danger' | 'damage'>('none');
  const [sec, setSec] = useState('0'); const [cyc, setCyc] = useState('0');
  const [spd, setSpd] = useState(120); const [gap, setGap] = useState(25);
  const [prom, setProm] = useState(0.6); const [thc, setThc] = useState(0); const [prior2, setPrior2] = useState('0'); const [novice, setNovice] = useState('0'); const [both, setBoth] = useState('0');
  const [q, setQ] = useState('Rettungsgasse'); const [nr, setNr] = useState('50');

  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    const m = str(u, 'v', initialMode) as Mode; if (!lockMode && MODES.includes(m)) setMode(m);
    setLimit(num(u, 'lim', 50)); setMeasured(num(u, 'kmh', 74)); setInner(str(u, 'io', '1')); setTol(str(u, 'tol', '1'));
    const c = str(u, 'cls', 'c'); setCls((['a', 'b', 'c'].includes(c) ? c : 'c') as VehicleClass);
    setPrior(str(u, 'b', '0')); setIntent(str(u, 'vs', '0')); const h = str(u, 'h', 'none'); setHarm((['none', 'danger', 'damage'].includes(h) ? h : 'none') as 'none');
    setSec(str(u, 's', '0')); setCyc(str(u, 'rad', '0')); setSpd(num(u, 'sp', 120)); setGap(num(u, 'm', 25));
    setProm(num(u, 'pr', 0.6)); setThc(num(u, 'thc', 0)); setPrior2(str(u, 'vor', '0')); setNovice(str(u, 'nov', '0')); setBoth(str(u, 'bt', '0'));
    setQ(str(u, 'q', 'Rettungsgasse')); setNr(str(u, 'nr', '50')); }, []);
  useEffect(() => { updateURL({ v: mode, lim: limit, kmh: measured, io: inner, tol, cls, b: prior, vs: intent, h: harm, s: sec, rad: cyc, sp: spd, m: gap, pr: prom, thc, vor: prior2, nov: novice, bt: both, q, nr }); },
    [mode, limit, measured, inner, tol, cls, prior, intent, harm, sec, cyc, spd, gap, prom, thc, prior2, novice, both, q, nr]);

  const hits = useMemo(() => search(q, 40), [q]);
  const nrValid = hits.some((h) => h.nr === nr) ? nr : hits[0]?.nr ?? '';
  const res = useMemo((): { o: Outcome; extra: Array<{ label: string; value: string }>; notes: string[] } => {
    const notes: string[] = [];
    if (mode === 'tempo') {
      const r = speeding({ limit, measured, inner: inner === '1', cls, tolerance: tol === '1', intent: intent === '1', prior26: prior === '1' });
      if (r.beharrlich) notes.push(t.beharrlich);
      return { o: r, extra: [{ label: t.over, value: `${n(r.over)} km/h` }], notes };
    }
    if (mode === 'rot') return { o: redLight({ overOneSecond: sec === '1', harm, cyclist: cyc === '1' }), extra: [], notes };
    if (mode === 'abstand') { const r = distance(spd, gap, intent === '1'); return { o: r, extra: [{ label: lang === 'de' ? 'Anteil am halben Tachowert' : 'Share of half the speedometer value', value: `${n(r.ratio * 10, 1)}/10` }], notes }; }
    if (mode === 'handy') return { o: phone({ harm, cyclist: cyc === '1' }), extra: [], notes };
    if (mode === 'alkohol') {
      const r = alcohol({ promille: prom, thc, priorEntries: Number(prior2) as 0 | 1 | 2, novice: novice === '1', withAlcoholAndThc: both === '1' });
      if (r.criminal) notes.push(t.criminal); if (r.mpu) notes.push(t.mpu);
      return { o: r, extra: [], notes };
    }
    return { o: nrValid ? fromEntry(nrValid, { harm, intent: intent === '1' }) : fromEntry('100'), extra: [], notes };
  }, [mode, limit, measured, inner, cls, tol, intent, prior, sec, harm, cyc, spd, gap, prom, thc, prior2, novice, both, nrValid, t, lang]);

  const o = res.o;
  const fvText = o.fv ? `${o.fv} ${o.fv === 1 ? t.month : t.months}` : t.noFv;
  const probeText = o.probe === 'A' ? t.probeA : o.probe === 'B' ? t.probeB : t.probeNone;
  const rows = [
    ...res.extra,
    ...(o.nr ? [{ label: t.nrLabel, value: o.nr }] : []),
    { label: t.fine, value: $(o.fine) },
    { label: t.fees, value: $(o.fees, o.fees % 1 ? 2 : 0) },
    { label: t.points, value: n(o.points) },
    { label: t.fv, value: fvText },
    { label: t.probe, value: probeText },
  ];
  const note = [o.fine === 0 ? t.nothing : o.verwarnung ? t.verwarnung : '', ...res.notes, t.note].filter(Boolean).join(' ');
  const yn = [{ value: '0', label: t.no }, { value: '1', label: t.yes }];
  const harmOpts = [{ value: 'none', label: t.none }, { value: 'danger', label: t.danger }, { value: 'damage', label: t.damage }];

  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {!lockMode && <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2"><SelectField id="bg-v" label={t.mode} value={mode} onChange={(x) => setMode(x as Mode)} options={MODES.map((m) => ({ value: m, label: t[m] }))} /></div>}
          {mode === 'tempo' && <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="bg-lim" label={t.limit} value={limit} onChange={setLimit} unit="km/h" max={300} lang={lang} />
              <NumberField id="bg-kmh" label={t.measured} value={measured} onChange={setMeasured} unit="km/h" max={400} help={t.measuredHelp} lang={lang} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <SelectField id="bg-io" label={t.where} value={inner} onChange={setInner} options={[{ value: '1', label: t.inner }, { value: '0', label: t.outer }]} />
              <Toggle id="bg-tol" label={t.tol} value={tol} onChange={setTol} options={[{ value: '1', label: t.yes }, { value: '0', label: t.no }]} />
            </div>
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <SelectField id="bg-cls" label={t.cls} value={cls} onChange={(x) => setCls(x as VehicleClass)} options={[{ value: 'c', label: t.clsC }, { value: 'a', label: t.clsA }, { value: 'b', label: t.clsB }]} />
              <SelectField id="bg-b" label={t.prior} value={prior} onChange={setPrior} options={yn} />
            </div>
          </>}
          {mode === 'rot' && <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="bg-s" label={t.sec} value={sec} onChange={setSec} options={yn} />
            <SelectField id="bg-h" label={t.harm} value={harm} onChange={(x) => setHarm(x as 'none')} options={harmOpts} />
            <SelectField id="bg-rad" label={t.cyclist} value={cyc} onChange={setCyc} options={yn} />
          </div>}
          {mode === 'abstand' && <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="bg-sp" label={t.speed} value={spd} onChange={setSpd} unit="km/h" max={300} lang={lang} />
            <NumberField id="bg-m" label={t.dist} value={gap} onChange={setGap} unit="m" max={500} lang={lang} />
          </div>}
          {mode === 'handy' && <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="bg-hh" label={t.harm} value={harm} onChange={(x) => setHarm(x as 'none')} options={harmOpts} />
            <SelectField id="bg-hr" label={t.cyclist} value={cyc} onChange={setCyc} options={yn} />
          </div>}
          {mode === 'alkohol' && <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="bg-pr" label={t.promille} value={prom} onChange={setProm} unit="‰" max={5} decimals={2} lang={lang} />
              <NumberField id="bg-thc" label={t.thc} value={thc} onChange={setThc} unit="ng/ml" max={100} decimals={1} lang={lang} />
            </div>
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <SelectField id="bg-vor" label={t.prior2} value={prior2} onChange={setPrior2} options={[{ value: '0', label: t.p0 }, { value: '1', label: t.p1 }, { value: '2', label: t.p2 }]} />
              <SelectField id="bg-nov" label={t.novice} value={novice} onChange={setNovice} options={yn} />
              <SelectField id="bg-bt" label={t.both} value={both} onChange={setBoth} options={yn} />
            </div>
          </>}
          {mode === 'nr' && <>
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
                <label htmlFor="bg-q" className="mb-1 block text-sm font-medium text-navy-700">{t.query}</label>
                <input id="bg-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
                <p className="mt-1 text-xs text-navy-600">{t.queryHelp}</p>
              </div>
              <SelectField id="bg-nr" label={`${t.pick} (${hits.length})`} value={nrValid} onChange={setNr} options={hits.map((h) => ({ value: h.nr, label: `${h.nr} · ${h.text.slice(0, 70)}${h.text.length > 70 ? '…' : ''}` }))} />
            </div>
            <p className="text-sm text-navy-700">{hits.find((h) => h.nr === nrValid)?.text}</p>
          </>}
          {(mode === 'tempo' || mode === 'abstand' || mode === 'nr') && <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="bg-vs" label={t.intent} value={intent} onChange={setIntent} options={yn} help={lang === 'de' ? 'Regelsatz über 55 € wird verdoppelt (§ 3 Abs. 4a BKatV).' : 'Standard fines above €55 are doubled (Section 3(4a) BKatV).'} />
            {mode === 'nr' && <SelectField id="bg-hn" label={t.harm} value={harm} onChange={(x) => setHarm(x as 'none')} options={harmOpts} help={lang === 'de' ? 'Erhöhung nach Tabelle 4 BKatV, wenn nicht schon im Tatbestand.' : 'Increase under BKatV table 4 unless already part of the offence.'} />}
          </div>}
        </form>
        <ResultCard head={t.head} big={$(o.total, o.total % 1 ? 2 : 0)} rows={rows} note={note} methodHref={methodHref} methodLabel={t.method} />
      </div>
      <p className="mt-3 text-xs text-navy-600">{lang === 'de' ? `Gebühr ${formatNumber(P.verfahren.gebuehr_satz * 100, 0, lang)} % des Bußgelds, mindestens ${$(P.verfahren.gebuehr_min)}, plus ${$(P.verfahren.zustellung, 2)} Zustellung.` : `Fee ${formatNumber(P.verfahren.gebuehr_satz * 100, 0, lang)}% of the fine, at least ${$(P.verfahren.gebuehr_min)}, plus ${$(P.verfahren.zustellung, 2)} delivery.`}</p>
    </div>
  );
}
