import { Router, Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { ResultRepository } from '../repositories/ResultRepository';
import rankingSvc, { DEFAULT_PRIZE_CONFIG } from '../services/rankingCalculator';
import fs from 'fs';
import path from 'path';

const router = Router();
const userRepo = new UserRepository();
const tournamentRepo = new TournamentRepository();
const registrationRepo = new RegistrationRepository();
const resultRepo = new ResultRepository();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

// Load points table from repo root if present
function loadPointsTable(): number[] {
  try {
    const p = path.join(process.cwd(), 'points_table.json');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const obj = JSON.parse(raw);
      if (obj && Array.isArray(obj.points)) return obj.points.map((n: any) => Number(n));
    }
  } catch (err) {
    // ignore
  }
  return [100, 75, 60, 50, 45, 40, 36, 32, 29, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6];
}

function loadPrizeOverride() {
  try {
    const p = path.join(process.cwd(), 'prize_override.json');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const obj = JSON.parse(raw);
      if (obj && Array.isArray(obj.percentages) && typeof obj.positions === 'number') return { positions: Number(obj.positions), percentages: obj.percentages.map((n: any) => Number(n)) };
    }
  } catch (err) {
    // ignore
  }
  return null;
}

// Ranking view: aggregate across tournaments that count to ranking
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const includeAll = req.query.includeAll === '1';

    const tournaments = await tournamentRepo.getTournamentsForRanking(includeAll);

    console.log('[adminRanking] tournaments loaded:', Array.isArray(tournaments) ? tournaments.length : typeof tournaments);

    // fetch registrations grouped by tournament
    const regsAll = await registrationRepo.getAll();
    const registrationsByTournament: Record<number, any[]> = {};
    for (const r of regsAll) {
      const tid = Number((r as any).tournament_id);
      if (!registrationsByTournament[tid]) registrationsByTournament[tid] = [];
      registrationsByTournament[tid].push(r);
    }

  const resultsByTournament = await resultRepo.getByTournament();

  console.log('[adminRanking] registrationsByTournament keys:', Object.keys(registrationsByTournament).length);
  console.log('[adminRanking] resultsByTournament keys:', Object.keys(resultsByTournament || {}).length);

  const pointsTable = loadPointsTable();
  const prizeOverride = loadPrizeOverride() || DEFAULT_PRIZE_CONFIG;
  const leaderboard = rankingSvc.buildLeaderboard(tournaments, registrationsByTournament, resultsByTournament, pointsTable, prizeOverride);

    // attach username for each entry
    const userIds = leaderboard.map(l => l.user_id);
    const users = await (await import('../models/User')).default.findAll({ where: { id: userIds } });
    const userMap: Record<number, any> = {};
    for (const u of users) userMap[Number((u as any).id)] = u;

    const enriched = leaderboard.map((l, idx) => ({
      position: idx + 1,
      user_id: l.user_id,
      username: userMap[l.user_id] ? userMap[l.user_id].username : `#${l.user_id}`,
      total_points: l.total_points,
      total_winnings: l.total_winnings,
      breakdown: l.breakdown,
    }));

  res.render('admin/ranking', { leaderboard: enriched, username: req.session.username, rules: { pointsTable, prizeOverride } });
  } catch (err) {
    const e: any = err;
    console.error('[adminRanking] Error building ranking:', e && (e.stack || e));
    // In development expose the stack to help debugging the redirect-loop follow-up
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).send('Error cargando ranking: ' + String(e && (e.stack || e)));
    }
    res.status(500).send('Error cargando ranking');
  }
});

export default router;
