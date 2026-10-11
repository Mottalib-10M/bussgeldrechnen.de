/** Paramètres 2026 du site, lus une seule fois depuis `data/params-2026.json` (RECETTE §4). */
import raw from '../../data/params-2026.json';
import slim from '../../data/bkat-slim.json';
import tables from '../../data/bkat-tables.json';
export const P = raw;
export type Params = typeof raw;
export type SourceKey = keyof typeof raw.sources;
export const YEAR_PARAMS = raw.year;

export interface BkatEntry { nr: string; text: string; heading: string; fine: number | null; fv: number; points: number; probe: 'A' | 'B' | null }
export interface SpeedRow { nr: string; cls: 'a' | 'b' | 'c'; lo: number; hi: number | null; inner: number; outer: number; fvInner: number; fvOuter: number; ptInner: number; ptOuter: number }
export interface DistanceRow { nr: string; speedFrom: number; tenths: number; fine: number; fv: number; points: number }
export interface IncreaseRow { base: number; danger: number; damage: number }
type Slim = [string, string, string, number, number, number, string];
/** Catalogue allégé (numéros à montant fixe) + tables du Anhang, générés par scripts/bkat/build-bkat.py. */
export const BKAT = {
  ...(tables as unknown as { stand: string; speed: SpeedRow[]; distance: DistanceRow[]; increase: IncreaseRow[] }),
  entries: (slim as unknown as Slim[]).map(([nr, text, heading, fine, fv, points, probe]): BkatEntry => ({ nr, text, heading, fine, fv, points, probe: (probe || null) as 'A' | 'B' | null })),
};
