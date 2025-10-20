import { Router, Request, Response } from 'express';
import { TournamentRepository } from '../repositories/TournamentRepository';

const router = Router();
const tournamentRepo = new TournamentRepository();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

// List admin view
router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  try {
    const tournaments = await tournamentRepo.getAll();
    res.render('admin/tournaments_list', { tournaments, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar torneos');
  }
});

// New form (redirect to existing web form but with admin context)
router.get('/new', requireAdmin, (req: Request, res: Response) => {
  res.render('tournaments/form', { formTitle: 'Nuevo Torneo (Admin)', formAction: '/api/tournaments' });
});

// Detail / edit uses existing web detail but admin can access
router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const tournament = await tournamentRepo.getById(id);
    if (!tournament) return res.status(404).send('No encontrado');
    res.render('tournaments/detail', { tournament, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

export default router;
