/** Fabrique les outils d'écriture (`Helpers`) passés au corps de chaque guide. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { P } from './engine/params';
import type { SourceKey } from './engine/params';
import type { Helpers } from './guide-types';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';
import { LANG_TAGS } from '../data/site-config';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function helpers(lang: Locale): Helpers {
  return {
    lang, P,
    a: (id, text) => (ROUTES.some((r) => r.id === id) ? `<a href="${route(id, lang)}">${text}</a>` : text),
    eur: (n, d = 0) => formatMoney(n, d, lang),
    num: (n, d = 0) => formatNumber(n, d, lang),
    pct: (x, d = 1) => formatPercent(x, d, lang),
    date: (iso) => displayDate(iso, LANG_TAGS[lang]),
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label[lang]}</a>`; },
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 bg-navy-50 px-3 py-2 font-semibold text-navy-900 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, ri) => `<tr class="${ri % 2 ? 'bg-navy-50/40' : ''}">${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0, lang)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}

/**
 * Numéros du Bußgeldkatalog (« 132.3 », « 246.1 ») : en allemand, typo-nbsp.mjs prendrait le point pour une
 * décimale et écrirait « 132,3 ». On les met dans <code class="bkat-nr">, que le correcteur ne touche pas
 * (texte de code), avec un style de texte normal. Seuls les numéros réellement présents au catalogue sont visés.
 */
import { BKAT } from './engine/params';
const NRS = new Set<string>([...BKAT.entries.map((e) => e.nr), ...BKAT.speed.map((s) => s.nr), ...BKAT.distance.map((d) => d.nr), '11.1', '11.2', '11.3', '12.5', '12.6', '12.7', '9.1', '9.2', '9.3']);
export function markNr(html: string): string {
  return html.replace(/(<code\b[^>]*>.*?<\/code>)|(?<![\d.,\w])(\d{1,3}[a-z]?(?:\.\d{1,2}[a-z]?){1,3})(?![\d,\w]|\.\d)/gs, (m, code, nr) => (code ? code : NRS.has(nr) || /^\d{3}/.test(nr) ? `<code class="bkat-nr">${nr}</code>` : m));
}
