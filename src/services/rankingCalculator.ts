import fs from 'fs';
import path from 'path';
import { Tournament } from '../models/Tournament';
import { Registration } from '../models/Registration';
import { Result } from '../models/Result';

export type PrizeConfig = {
  positions: number; // how many positions are paid
  percentages: number[]; // length == positions, values sum to 100
};

// Default prize distribution (editable by changing this file or passing custom config)
export const DEFAULT_PRIZE_CONFIG: PrizeConfig = {
  positions: 6,
  percentages: [35, 20, 15, 10, 8, 12].map(p => p), // example distribution; must sum 100
};

function loadOverride(): PrizeConfig | null {
  try {
    const cfgPath = path.join(process.cwd(), 'prize_override.json');
    if (fs.existsSync(cfgPath)) {
      const raw = fs.readFileSync(cfgPath, 'utf8');
      const obj = JSON.parse(raw);
      if (obj && Array.isArray(obj.percentages) && typeof obj.positions === 'number') {
        return { positions: Number(obj.positions), percentages: obj.percentages.map((n: any) => Number(n)) };
      }
    }
  } catch (err) {
    // ignore and use defaults
  }
  return null;
}

// Work in cents to avoid floating rounding issues
function toCents(value: number): number {
  return Math.round(value * 100);
}

function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * Calcula el pozo de un torneo a partir de sus inscripciones.
 * - Se considera cada registro (entry) como una entrada válida al pozo.
 * - Si la inscripción tiene `punctuality === true`, se aplica el descuento punctuality_discount (porcentaje) al buy_in.
 * - El pozo no incluye knockout_bounty por defecto (puede ajustarse si se requiere).
 */
export function computePot(tournament: Tournament, registrations: Registration[]): number {
  const buyIn = Number((tournament as any).buy_in || 0);
  const punctualityDiscount = Number((tournament as any).punctuality_discount || 0); // as percentage, e.g. 15

  let totalCents = 0;
  for (const reg of registrations) {
    const punctual = Boolean((reg as any).punctuality);
    let effective = buyIn;
    if (punctual && punctualityDiscount) {
      effective = buyIn * (1 - punctualityDiscount / 100);
    }
    totalCents += toCents(Number(effective));
  }

  // Return pozo as number (float) in currency units
  return fromCents(totalCents);
}

/**
 * Distribuye el pozo entre posiciones según un PrizeConfig.
 * Si hay menos jugadores que posiciones, solo se pagarán las posiciones disponibles (las primeras).
 */
export function distributePrizes(pot: number, prizeConfig?: PrizeConfig, playersCount?: number): number[] {
  const cfg = prizeConfig || loadOverride() || DEFAULT_PRIZE_CONFIG;
  const positions = Number(cfg.positions) || cfg.percentages.length;
  const percentages = cfg.percentages.slice(0, positions).map(p => Number(p));

  // Normalize to sum 100 in case of rounding
  const sum = percentages.reduce((s, v) => s + v, 0);
  const normalized = percentages.map(p => (p / (sum || 1)) * 100);

  const paidPositions = Math.min(playersCount || Number.POSITIVE_INFINITY, positions);
  const potCents = toCents(pot);
  const payouts: number[] = [];

  for (let i = 0; i < paidPositions; i++) {
    const pct = normalized[i] || 0;
    const amountCents = Math.round((pct / 100) * potCents);
    payouts.push(fromCents(amountCents));
  }

  return payouts;
}

/**
 * Calcula puntos para una posición usando una tabla de puntos suministrada.
 * pointsTable: array where index 0 => position 1 points.
 */
export function pointsForPosition(position: number, pointsTable: number[], tournament: Tournament): number {
  if (!pointsTable || pointsTable.length === 0) return 0;
  const base = pointsTable[position - 1] || 0;
  const doublePoints = Boolean((tournament as any).double_points);
  return doublePoints ? base * 2 : base;
}

/**
 * Agrega resultados y registros para producir un leaderboard agregado.
 * - tournaments: lista de torneos a considerar (si empty, se buscan todos que count_to_ranking)
 * - registrationsByTournament: mapa tournamentId -> registrations[]
 * - resultsByTournament: mapa tournamentId -> results[] (each result has user_id, position)
 * - pointsTable: array of points by position
 * - prizeConfig: optional override
 */
export function buildLeaderboard(
  tournaments: Tournament[],
  registrationsByTournament: Record<number, Registration[]>,
  resultsByTournament: Record<number, Result[]>,
  pointsTable: number[],
  prizeConfig?: PrizeConfig
): Array<{ user_id: number; username?: string; total_points: number; total_winnings: number; breakdown?: any[] }> {
  const users: Record<number, { total_points: number; total_winnings: number; breakdown: any[] }> = {};

  for (const t of tournaments) {
    const tid = Number((t as any).id);
    const regs = registrationsByTournament[tid] || [];
    const results = (resultsByTournament[tid] || []).slice();

    const pot = computePot(t, regs);
    const payouts = distributePrizes(pot, prizeConfig, regs.length);

    // Map position -> payout
    const payoutByPosition: Record<number, number> = {};
    for (let i = 0; i < payouts.length; i++) {
      payoutByPosition[i + 1] = payouts[i];
    }

    // Assign winnings for results
    for (const r of results) {
      const uid = Number((r as any).user_id);
      if (!users[uid]) users[uid] = { total_points: 0, total_winnings: 0, breakdown: [] };

      const pos = Number((r as any).position) || 0;
      const winning = payoutByPosition[pos] || 0;
      users[uid].total_winnings += Number(winning);

      // points
      const pts = pointsForPosition(pos, pointsTable, t);
      users[uid].total_points += pts;

      users[uid].breakdown.push({ tournament_id: tid, position: pos, points: pts, winning });
    }

    // Note: players without results (didn't finish) get no prize and no points, but may still affect pot
  }

  // Convert to array
  const out = Object.keys(users).map(k => ({ user_id: Number(k), total_points: users[Number(k)].total_points, total_winnings: Number(users[Number(k)].total_winnings), breakdown: users[Number(k)].breakdown }));

  // sort by points desc then winnings desc
  out.sort((a, b) => b.total_points - a.total_points || b.total_winnings - a.total_winnings);
  return out;
}

export default {
  computePot,
  distributePrizes,
  pointsForPosition,
  buildLeaderboard,
  DEFAULT_PRIZE_CONFIG,
};
