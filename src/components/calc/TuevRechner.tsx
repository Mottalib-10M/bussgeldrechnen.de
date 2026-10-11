/** HU (TÜV) : prochaine échéance (StVZO Anl. VIII), amende en cas de retard (BKat 186.2), cadre de prix (GebOSt 413). */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import ResultCard from './ResultCard';
import { nextHu, huLate, monthsLate, huCost, type HuVehicle } from '../../lib/engine/kosten';
import { formatMoney, formatNumber } from '../../lib/format';
import { readParams, str, updateURL } from '../../lib/url-state';

type L = 'de' | 'en';
const TX = {
  de: { v: 'Fahrzeug', pkw: 'Pkw', krad: 'Motorrad', wohnmobil35: 'Wohnmobil bis 3,5 t', anhaenger750: 'Anhänger bis 750 kg', last: 'Letzte HU (oder Zulassung als Neuwagen): Jahr', lastM: 'Monat', first: 'Neuwagen, erste HU?', yes: 'Ja', no: 'Nein',
    nowY: 'Kontrolle oder HU-Termin: Jahr', nowM: 'Monat', au: 'Abgasuntersuchung', auObd: 'über OBD-Stecker', auMess: 'mit Messung am Endrohr', auNone: 'keine (Elektro, Motorrad)',
    head: 'Nächste HU fällig', late: 'Überzogen', months: 'Monate', fine: 'Verwarnungs- oder Bußgeld', points: 'Punkte', cost: 'Gebührenrahmen TÜV/DEKRA-Prüfstelle inkl. USt', okay: 'nicht überzogen',
    note: 'Fällig bis Ende des Monats auf der Plakette. Bis zwei Monate Überziehung sieht der Katalog kein Verwarnungsgeld vor. Überwachungsorganisationen (GTÜ, KÜS, FSP …) legen ihre Preise selbst fest.', method: 'So rechnen wir' },
  en: { v: 'Vehicle', pkw: 'Car', krad: 'Motorbike', wohnmobil35: 'Motorhome up to 3.5 t', anhaenger750: 'Trailer up to 750 kg', last: 'Last MOT (or registration as new): year', lastM: 'Month', first: 'New car, first MOT?', yes: 'Yes', no: 'No',
    nowY: 'Check or MOT appointment: year', nowM: 'Month', au: 'Emissions test', auObd: 'via OBD port', auMess: 'with tailpipe measurement', auNone: 'none (electric, motorbike)',
    head: 'Next MOT (HU) due', late: 'Overdue by', months: 'months', fine: 'Warning or regular fine', points: 'Points', cost: 'Fee range at TÜV/DEKRA test centres incl. VAT', okay: 'not overdue',
    note: 'Due by the end of the month shown on the sticker. Up to two months overdue the catalogue sets no fine. Private inspection organisations (GTÜ, KÜS, FSP …) set their own prices.', method: 'How we calculate' },
};
const YEARS = ['2028', '2027', '2026', '2025', '2024', '2023', '2022', '2021'];
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export default function TuevRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const t = TX[lang]; const $ = (x: number) => formatMoney(x, 0, lang); const n = (x: number) => formatNumber(x, 0, lang);
  const [v, setV] = useState<HuVehicle>('pkw'); const [lY, setLY] = useState('2024'); const [lM, setLM] = useState('06'); const [first, setFirst] = useState('0');
  const [nY, setNY] = useState('2026'); const [nM, setNM] = useState('10'); const [au, setAu] = useState('obd');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    const x = str(u, 'f', 'pkw'); if (['pkw', 'krad', 'wohnmobil35', 'anhaenger750'].includes(x)) setV(x as HuVehicle);
    setLY(str(u, 'lj', '2024')); setLM(str(u, 'lm', '06')); setFirst(str(u, 'neu', '0')); setNY(str(u, 'nj', '2026')); setNM(str(u, 'nm', '10')); setAu(str(u, 'au', 'obd')); }, []);
  useEffect(() => { updateURL({ f: v, lj: lY, lm: lM, neu: first, nj: nY, nm: nM, au }); }, [v, lY, lM, first, nY, nM, au]);
  const r = useMemo(() => {
    const due = nextHu(`${lY}-${lM}`, v, first === '1');
    const late = monthsLate(due, `${nY}-${nM}`);
    const pen = huLate(late);
    const c = huCost(v === 'krad' ? 'krad' : 'pkw', au !== 'none' && v !== 'anhaenger750', au === 'obd');
    return { due, late, pen, c };
  }, [v, lY, lM, first, nY, nM, au]);
  const [dy, dm] = r.due.split('-');
  const yn = [{ value: '0', label: t.no }, { value: '1', label: t.yes }];
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="tu-f" label={t.v} value={v} onChange={(x) => setV(x as HuVehicle)} options={(['pkw', 'krad', 'wohnmobil35', 'anhaenger750'] as const).map((x) => ({ value: x, label: t[x] }))} />
            <SelectField id="tu-neu" label={t.first} value={first} onChange={setFirst} options={yn} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="tu-lj" label={t.last} value={lY} onChange={setLY} options={YEARS.slice(2).map((y) => ({ value: y, label: y }))} />
            <SelectField id="tu-lm" label={t.lastM} value={lM} onChange={setLM} options={MONTHS.map((m) => ({ value: m, label: m }))} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="tu-nj" label={t.nowY} value={nY} onChange={setNY} options={YEARS.map((y) => ({ value: y, label: y }))} />
            <SelectField id="tu-nm" label={t.nowM} value={nM} onChange={setNM} options={MONTHS.map((m) => ({ value: m, label: m }))} />
          </div>
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <SelectField id="tu-au" label={t.au} value={au} onChange={setAu} options={[{ value: 'obd', label: t.auObd }, { value: 'mess', label: t.auMess }, { value: 'none', label: t.auNone }]} />
          </div>
        </form>
        <ResultCard head={t.head} big={`${dm}/${dy}`} rows={[
          { label: t.late, value: r.late ? `${n(r.late)} ${t.months}` : t.okay },
          { label: t.fine, value: $(r.pen.fine) }, { label: t.points, value: n(r.pen.points) },
          { label: t.cost, value: `${$(r.c.min)} – ${$(r.c.max)}` }]} note={t.note} methodHref={methodHref} methodLabel={t.method} />
      </div>
    </div>
  );
}
