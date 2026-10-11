/** Punkterechner Flensburg : total, mesure (§ 4 Abs. 5-6 StVG), séminaire (§ 4 Abs. 7), Tilgung (§ 29). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultCard from './ResultCard';
import { applyMeasure, seminar, tilgung, untilEntzug, type Stage } from '../../lib/engine/punkte';
import { formatNumber, displayDate } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type L = 'de' | 'en';
const TX = {
  de: { now: 'Punktestand laut KBA-Auskunft', add: 'Neuer Verstoß', p0: 'keine Punkte', p1: '1 Punkt (z. B. 21 km/h zu schnell)', p2: '2 Punkte (z. B. Fahrverbot)', p3: '3 Punkte (Straftat mit Entziehung)',
    rk: 'Rechtskraft im Jahr', rkm: 'Monat der Rechtskraft', prev: 'Bisher erhaltene Maßnahme', none: 'keine', ermahnung: 'Ermahnung', verwarnung: 'Verwarnung', sem: 'Letztes Fahreignungsseminar', semNo: 'noch nie', semY: 'vor weniger als 5 Jahren', semOld: 'vor 5 Jahren oder mehr',
    head: 'Punktestand nach dem neuen Verstoß', measure: 'Was die Behörde tut', m_none: 'nichts', m_vormerkung: 'Vormerkung (1 bis 3 Punkte)', m_ermahnung: 'schriftliche Ermahnung', m_verwarnung: 'schriftliche Verwarnung', m_entzug: 'Entziehung der Fahrerlaubnis',
    left: 'Abstand zu 8 Punkten', seminar: 'Fahreignungsseminar bringt', semYes: '1 Punkt Abzug', semNoUse: 'keinen Abzug', tilgung: 'Neuer Eintrag tilgungsreif am', loesch: 'endgültig gelöscht am', reset: 'Stufe übersprungen: Stand gesetzlich gesenkt auf',
    note: 'Jeder Eintrag verjährt für sich (seit 2014 keine Tilgungshemmung mehr). Maßgeblich ist der Stand am Tag des letzten Verstoßes.', method: 'So rechnen wir' },
  en: { now: 'Points on your KBA extract', add: 'New offence', p0: 'no points', p1: '1 point (e.g. 21 km/h over)', p2: '2 points (e.g. driving ban)', p3: '3 points (crime with licence withdrawal)',
    rk: 'Year the decision became final', rkm: 'Month it became final', prev: 'Measure already received', none: 'none', ermahnung: 'reminder (Ermahnung)', verwarnung: 'warning (Verwarnung)', sem: 'Last driver improvement seminar', semNo: 'never', semY: 'less than 5 years ago', semOld: '5 years ago or more',
    head: 'Points after the new offence', measure: 'What the authority does', m_none: 'nothing', m_vormerkung: 'entry noted (1 to 3 points)', m_ermahnung: 'written reminder', m_verwarnung: 'written warning', m_entzug: 'licence withdrawn',
    left: 'Distance to 8 points', seminar: 'Driver improvement seminar gives', semYes: '1 point off', semNoUse: 'no deduction', tilgung: 'New entry expires on', loesch: 'finally deleted on', reset: 'Stage skipped: total lowered by law to',
    note: 'Each entry expires on its own (no blocking of expiry since 2014). What counts is the total on the day of the latest offence.', method: 'How we calculate' },
};
const YEARS = ['2026', '2025', '2024', '2023', '2022'];
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export default function PunkteRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const t = TX[lang]; const n = (x: number) => formatNumber(x, 0, lang); const d = (iso: string) => displayDate(iso, lang === 'de' ? 'de-DE' : 'en-GB');
  const [now, setNow] = useState(2); const [add, setAdd] = useState('1'); const [rkY, setRkY] = useState('2026'); const [rkM, setRkM] = useState('09');
  const [prev, setPrev] = useState<Stage>('none'); const [sem, setSem] = useState('no');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setNow(num(u, 'p', 2)); setAdd(str(u, 'neu', '1')); setRkY(str(u, 'rj', '2026')); setRkM(str(u, 'rm', '09'));
    const p = str(u, 'm', 'none'); if (['none', 'ermahnung', 'verwarnung'].includes(p)) setPrev(p as Stage); setSem(str(u, 'sem', 'no')); }, []);
  useEffect(() => { updateURL({ p: now, neu: add, rj: rkY, rm: rkM, m: prev, sem }); }, [now, add, rkY, rkM, prev, sem]);
  const r = useMemo(() => {
    const total = Math.max(0, Math.round(now)) + Number(add);
    const m = applyMeasure(total, prev);
    const s = seminar(m.points, sem === 'no' ? null : sem === 'recent' ? 1 : 6);
    const tl = Number(add) ? tilgung(`${rkY}-${rkM}-01`, Number(add) as 1 | 2 | 3) : null;
    return { total, m, s, tl };
  }, [now, add, rkY, rkM, prev, sem]);
  const rows = [
    { label: t.measure, value: (t as Record<string, string>)[`m_${r.m.measure}`] },
    ...(r.m.points !== r.total ? [{ label: t.reset, value: n(r.m.points) }] : []),
    { label: t.left, value: n(untilEntzug(r.m.points)) },
    { label: t.seminar, value: r.s.allowed ? t.semYes : t.semNoUse },
    ...(r.tl ? [{ label: t.tilgung, value: d(r.tl.tilgungsreif) }, { label: t.loesch, value: d(r.tl.geloescht) }] : []),
  ];
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="pr-p" label={t.now} value={now} onChange={setNow} max={20} lang={lang} />
            <SelectField id="pr-neu" label={t.add} value={add} onChange={setAdd} options={['0', '1', '2', '3'].map((k) => ({ value: k, label: (t as Record<string, string>)[`p${k}`] }))} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="pr-rj" label={t.rk} value={rkY} onChange={setRkY} options={YEARS.map((y) => ({ value: y, label: y }))} />
            <SelectField id="pr-rm" label={t.rkm} value={rkM} onChange={setRkM} options={MONTHS.map((m) => ({ value: m, label: m }))} />
          </div>
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="pr-m" label={t.prev} value={prev} onChange={(x) => setPrev(x as Stage)} options={(['none', 'ermahnung', 'verwarnung'] as const).map((k) => ({ value: k, label: t[k] }))} />
            <SelectField id="pr-sem" label={t.sem} value={sem} onChange={setSem} options={[{ value: 'no', label: t.semNo }, { value: 'recent', label: t.semY }, { value: 'old', label: t.semOld }]} />
          </div>
        </form>
        <ResultCard head={t.head} big={n(r.m.points)} rows={rows} note={t.note} methodHref={methodHref} methodLabel={t.method} />
      </div>
    </div>
  );
}
