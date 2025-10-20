import { Router, Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';

const router = Router();
const userRepo = new UserRepository();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

// Simple ranking view (aggregated by points/current_points or results)
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    // For now use users ordered by current_points desc as ranking
    const users = await userRepo.findAllOrderedByPoints();
    res.render('admin/ranking', { users, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error cargando ranking');
  }
});

export default router;
