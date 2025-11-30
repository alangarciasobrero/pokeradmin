import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { UserRepository } from '../repositories/UserRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { ResultRepository } from '../repositories/ResultRepository';
import rankingSvc, { DEFAULT_PRIZE_CONFIG } from '../services/rankingCalculator';
import HistoricalPoint from '../models/HistoricalPoint';
import { Season } from '../models/Season';
import fs from 'fs';
import path from 'path';

const router = Router();
const userRepo = new UserRepository();
const tournamentRepo = new TournamentRepository();
const registrationRepo = new RegistrationRepository();
const resultRepo = new ResultRepository();
const isDev = process.env.NODE_ENV === 'development';

// use central requireAdmin middleware imported above

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
    const seasonId = req.query.season ? Number(req.query.season) : null;

    // Cargar todas las temporadas para el selector
    const seasons = await Season.findAll({ order: [['fecha_inicio', 'DESC']] });

    const tournaments = await tournamentRepo.getTournamentsForRanking(includeAll, seasonId);

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

  console.log('[adminRanking] leaderboard length:', Array.isArray(leaderboard) ? leaderboard.length : typeof leaderboard);

  // Integrate historical_points: sum all points from historical_points table per user
  const historicalPoints = await HistoricalPoint.findAll();
  const historicalByUser: Record<number, number> = {};
  for (const hp of historicalPoints) {
    const uid = Number((hp as any).user_id);
    const pts = Number((hp as any).points) || 0;
    if (!historicalByUser[uid]) historicalByUser[uid] = 0;
    historicalByUser[uid] += pts;
  }

  // Merge historical points into leaderboard
  for (const entry of leaderboard) {
    const historicalPts = historicalByUser[entry.user_id] || 0;
    entry.total_points += historicalPts;
  }

  // Re-sort after adding historical points
  leaderboard.sort((a, b) => b.total_points - a.total_points || b.total_winnings - a.total_winnings);

  // Calculate attendance (tournament participation count), final tables, and wins
  const attendanceByUser: Record<number, number> = {};
  const finalTablesByUser: Record<number, number> = {};
  const winsByUser: Record<number, number> = {};
  
  for (const entry of leaderboard) {
    // Count unique tournaments this user participated in
    attendanceByUser[entry.user_id] = (entry.breakdown || []).length;
    
    // Count final tables (top 9 positions)
    finalTablesByUser[entry.user_id] = (entry.breakdown || []).filter((b: any) => b.position && b.position <= 9).length;
    
    // Count wins (1st place)
    winsByUser[entry.user_id] = (entry.breakdown || []).filter((b: any) => b.position === 1).length;
  }

  // attach username for each entry
  const userIds = leaderboard.map(l => l.user_id);
  let users: any[] = [];
  if (userIds.length > 0) {
    users = await (await import('../models/User')).default.findAll({ where: { id: userIds } });
  } else {
    console.log('[adminRanking] no userIds to lookup');
  }
  const userMap: Record<number, any> = {};
  for (const u of users) userMap[Number((u as any).id)] = u;

    const enriched = leaderboard.map((l, idx) => ({
      position: idx + 1,
      user_id: l.user_id,
      username: userMap[l.user_id] ? userMap[l.user_id].username : `#${l.user_id}`,
      total_points: l.total_points,
      total_winnings: l.total_winnings,
      historical_points: historicalByUser[l.user_id] || 0,
      attendance_count: attendanceByUser[l.user_id] || 0,
      final_tables: finalTablesByUser[l.user_id] || 0,
      wins: winsByUser[l.user_id] || 0,
      breakdown: l.breakdown,
    }));

  res.render('admin/ranking', { 
    leaderboard: enriched, 
    username: req.session.username, 
    rules: { pointsTable, prizeOverride },
    seasons,
    selectedSeason: seasonId 
  });
  } catch (err) {
    const e: any = err;
    const stack = String(e && (e.stack || e));
    console.error('[adminRanking] Error building ranking:', stack);
    try {
      const pth = 'logs/ranking_errors.log';
      const fsn = await import('fs');
      try { fsn.mkdirSync('logs', { recursive: true }); } catch (_) {}
      fsn.appendFileSync(pth, JSON.stringify({ time: new Date().toISOString(), error: stack }) + '\n');
    } catch (_) {}
    // Do not expose stack traces in HTTP responses. Return a generic message.
    return res.status(500).send('Error cargando ranking');
  }
});

// Register debug endpoint only in development to avoid accidental exposure.
if (isDev) {
  router.post('/debug', requireAdmin, async (req: Request, res: Response) => {
    try {
      const includeAll = req.query.includeAll === '1';
      const seasonId = req.query.season ? Number(req.query.season) : null;
      const tournaments = await tournamentRepo.getTournamentsForRanking(includeAll, seasonId);
      const regsAll = await registrationRepo.getAll();
      const registrationsByTournament: Record<number, any[]> = {};
      for (const r of regsAll) {
        const tid = Number((r as any).tournament_id);
        if (!registrationsByTournament[tid]) registrationsByTournament[tid] = [];
        registrationsByTournament[tid].push(r);
      }
      const resultsByTournament = await resultRepo.getByTournament();
      const pointsTable = loadPointsTable();
      const prizeOverride = loadPrizeOverride() || DEFAULT_PRIZE_CONFIG;
      const leaderboard = rankingSvc.buildLeaderboard(tournaments, registrationsByTournament, resultsByTournament, pointsTable, prizeOverride);
      const userIds = leaderboard.map((l: any) => l.user_id);
      let users: any[] = [];
      if (userIds.length > 0) {
        users = await (await import('../models/User')).default.findAll({ where: { id: userIds } });
      }
      return res.json({ ok: true, leaderboard, users, tournaments: tournaments.length });
    } catch (err) {
      const e: any = err;
      // do not send raw stack to client even in debug; include the stack in logs only
      console.error('[adminRanking][debug] Error:', String(e && (e.stack || e)));
      return res.status(500).json({ ok: false, error: 'Error computing leaderboard' });
    }
  });
}

export default router;
