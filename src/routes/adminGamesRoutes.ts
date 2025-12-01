import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { Tournament } from '../models/Tournament';
import CashGame from '../models/CashGame';


const router = Router();

// use central requireAdmin middleware imported above

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  // Obtener torneos y cash games
  let tournaments: any[] = [];
  let cashGames: any[] = [];
  let summary: any = {};
  try {
    tournaments = await Tournament.findAll({ 
      order: [['pinned', 'DESC'], ['start_date', 'DESC']] 
    });
  } catch (err) {
    console.error('Error loading tournaments', err);
    tournaments = [];
  }
  try {
    cashGames = await CashGame.findAll({ order: [['start_datetime', 'DESC']] });
  } catch (err) {
    console.error('Error loading cash games', err);
    cashGames = [];
  }
  // Build simple summary
  try {
    const now = new Date();
    const activeTournaments = tournaments.filter((t: any) => new Date(t.start_date) <= now && (!t.end_date || new Date(t.end_date) >= now)).length;
    const activeCashGames = cashGames.filter((c: any) => !c.end_datetime).length;
    // estimate players playing by counting registrations for tournaments starting today or active
  const registrationRepo = await import('../repositories/RegistrationRepository');
  const regs = await (new registrationRepo.RegistrationRepository()).getAll();
    const playersPlaying = regs.length; // rough estimate for now
    summary = { activeTournaments, activeCashGames, playersPlaying };
  } catch (err) {
    console.error('Error building summary', err);
    summary = { activeTournaments: 0, activeCashGames: cashGames.length, playersPlaying: 0 };
  }

  res.render('admin_games', {
    tournaments,
    cashGames,
    summary,
    username: req.session.username,
    role: req.session.role
  });
});

// Mount admin sub-pages for more detailed management
router.get('/tournaments', requireAdmin, (req: Request, res: Response) => {
  // Redirect to the SSR admin tournaments management
  res.redirect('/admin/games/tournaments/list');
});

router.get('/cash', requireAdmin, (req: Request, res: Response) => {
  res.redirect('/admin/games/cash/list');
});

// Note: The ranking page is handled by the dedicated adminRankingRoutes mounted at
// /admin/games/ranking. Do not intercept or redirect here to avoid redirect loops.

export default router;
