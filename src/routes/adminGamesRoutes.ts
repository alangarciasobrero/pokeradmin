import { Router, Request, Response } from 'express';
import { Tournament } from '../models/Tournament';
import CashGame from '../models/CashGame';


const router = Router();

// Middleware para proteger solo admin (igual que en adminUserRoutes)
function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  // Obtener torneos y cash games
  let tournaments: any[] = [];
  let cashGames: any[] = [];
  let summary: any = {};
  try {
    tournaments = await Tournament.findAll({ order: [['start_date', 'DESC']] });
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
  res.render('admin_games', {
    tournaments,
    cashGames,
    summary,
    username: req.session.username,
    role: req.session.role
  });
});

export default router;
