import { Router, Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { ResultRepository } from '../repositories/ResultRepository';
import rankingSvc, { DEFAULT_PRIZE_CONFIG } from '../services/rankingCalculator';

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

// Default points table: position 1..20 (example). Replace with authoritative table later.
const DEFAULT_POINTS_TABLE = [100, 75, 60, 50, 45, 40, 36, 32, 29, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6];

// Ranking view: aggregate across tournaments that count to ranking
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const includeAll = req.query.includeAll === '1';

    const tournaments = await tournamentRepo.getTournamentsForRanking(includeAll);

    // fetch registrations grouped by tournament
    const regsAll = await registrationRepo.getAll();
    const registrationsByTournament: Record<number, any[]> = {};
    for (const r of regsAll) {
      const tid = Number((r as any).tournament_id);
      if (!registrationsByTournament[tid]) registrationsByTournament[tid] = [];
      registrationsByTournament[tid].push(r);
    }

    const resultsByTournament = await resultRepo.getByTournament();

    const leaderboard = rankingSvc.buildLeaderboard(tournaments, registrationsByTournament, resultsByTournament, DEFAULT_POINTS_TABLE, DEFAULT_PRIZE_CONFIG);

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

    res.render('admin/ranking', { leaderboard: enriched, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error cargando ranking');
  }
});

export default router;
