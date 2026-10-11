/**
 * Recherche dans le Bußgeldkatalog complet (numéros à montant fixe de la BKatV, avec points et classe Probezeit).
 * Premier rendu : requête par défaut du build (RECETTE §17.5). Données : bkat-slim.json (build-bkat.py).
 */
import { useEffect, useMemo, useState } from 'react';
import { search, fees } from '../../lib/engine/bkat';
import { formatMoney, formatNumber } from '../../lib/format';
import { readParams, str, updateURL } from '../../lib/url-state';

type L = 'de' | 'en';
const TX = {
  de: { label: 'Tatbestand suchen', help: 'Stichwort aus dem Bescheid oder BKat-Nummer, zum Beispiel „Handy“, „Gehweg“, „Rettungsgasse“, „Parkschein“, „Gurt“.', nr: 'Nr.', what: 'Tatbestand', fine: 'Regelsatz', total: 'mit Gebühren', pts: 'Punkte', fv: 'Fahrverbot', probe: 'Probezeit', none: 'Keine Treffer. Ein anderes Wort probieren, etwa aus dem Anhörungsbogen.', count: 'Treffer', m: 'Mon.', chips: ['Handy', 'Rettungsgasse', 'Gehweg', 'Parkschein', 'Gurt', 'Rotlicht', 'Winterreifen', 'Hauptuntersuchung'] },
  en: { label: 'Find an offence', help: 'German keyword from your notice or a BKat number, for example “Handy” (phone), “Gehweg” (pavement), “Rettungsgasse” (emergency lane), “Parkschein”, “Gurt”.', nr: 'No.', what: 'Offence (official German wording)', fine: 'Fine', total: 'with fees', pts: 'Points', fv: 'Ban', probe: 'Probation', none: 'No match. Try another German word, for instance from the hearing form.', count: 'matches', m: 'mo.', chips: ['Handy', 'Rettungsgasse', 'Gehweg', 'Parkschein', 'Gurt', 'Rotlicht', 'Winterreifen', 'Hauptuntersuchung'] },
};

export default function KatalogSuche({ lang = 'de' }: { lang?: L }) {
  const t = TX[lang]; const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [q, setQ] = useState('Handy');
  useEffect(() => { const u = readParams(window.location.search); const s = str(u, 'suche', ''); if (s) setQ(s); }, []);
  useEffect(() => { updateURL({ suche: q }); }, [q]);
  const hits = useMemo(() => search(q, 60), [q]);
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome data-katalog>
      <label htmlFor="ks-q" className="mb-1 block text-sm font-medium text-navy-700">{t.label}</label>
      <input id="ks-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-4 text-lg text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      <p className="mt-1 text-xs text-navy-600">{t.help}</p>
      <div className="mt-3 flex flex-wrap gap-2">{t.chips.map((c) => <button key={c} type="button" onClick={() => setQ(c)} aria-pressed={q === c} className={`rounded border px-3 py-1 text-sm ${q === c ? 'border-accent-600 bg-accent-600 text-white' : 'border-navy-300 text-navy-800 hover:bg-navy-50'}`}>{c}</button>)}</div>
      <p aria-live="polite" className="mt-4 text-sm text-navy-700">{formatNumber(hits.length, 0, lang)} {t.count}</p>
      {hits.length === 0 ? <p className="mt-2 text-navy-800">{t.none}</p> : (
        <div className="mt-2 max-h-[32rem] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="border-b border-navy-300 text-left text-xs uppercase tracking-wide text-navy-700">
              <th scope="col" className="py-2 pr-2">{t.nr}</th><th scope="col" className="py-2 pr-2">{t.what}</th><th scope="col" className="py-2 pr-2 text-right">{t.fine}</th><th scope="col" className="hidden py-2 pr-2 text-right sm:table-cell">{t.total}</th><th scope="col" className="py-2 pr-2 text-right">{t.pts}</th><th scope="col" className="py-2 pr-2 text-right">{t.fv}</th><th scope="col" className="hidden py-2 text-right sm:table-cell">{t.probe}</th>
            </tr></thead>
            <tbody>{hits.map((h) => { const f = fees(h.fine!); return (
              <tr key={h.nr} className="border-b border-navy-100 align-top">
                <td className="tabular-nums py-2 pr-2 text-navy-900">{h.nr}</td>
                <td className="py-2 pr-2 text-navy-800">{h.text}</td>
                <td className="tabular-nums py-2 pr-2 text-right font-semibold text-navy-900">{$(h.fine!)}</td>
                <td className="tabular-nums hidden py-2 pr-2 text-right text-navy-800 sm:table-cell">{$(h.fine! + f.total, f.total % 1 ? 2 : 0)}</td>
                <td className="tabular-nums py-2 pr-2 text-right text-navy-900">{h.points}</td>
                <td className="tabular-nums py-2 pr-2 text-right text-navy-900">{h.fv ? `${h.fv} ${t.m}` : '–'}</td>
                <td className="hidden py-2 text-right text-navy-900 sm:table-cell">{h.probe ?? '–'}</td>
              </tr>); })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
