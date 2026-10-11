/** Carte de résultat commune aux outils : un chiffre principal, des lignes de détail, une note. */
export interface Row { label: string; value: string; strong?: boolean }
export default function ResultCard({ head, big, sub, rows, note, methodHref, methodLabel }: { head: string; big: string; sub?: string; rows: Row[]; note?: string; methodHref?: string; methodLabel?: string }) {
  return (
    <div aria-live="polite" className="mt-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">
      <p className="text-sm font-medium text-navy-700">{head}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{big}</p>
      {sub && <p className="mt-1 text-navy-700">{sub}</p>}
      <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
        {rows.map((r) => <tr key={r.label}><td className="py-1.5 pr-3 text-navy-700">{r.label}</td><td className={`tabular-nums py-1.5 text-right ${r.strong ? 'font-semibold text-navy-900' : 'text-navy-900'}`}>{r.value}</td></tr>)}
      </tbody></table>
      {note && <p className="mt-3 text-sm text-navy-700">{note}</p>}
      {methodHref && <a href={methodHref} className="mt-2 inline-block text-sm font-medium text-accent-700 underline">{methodLabel}</a>}
    </div>
  );
}
