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

// Create (handled by API) - but support a form POST from SSR that forwards to API
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Use repository directly to create (avoid internal fetch and redirect issues)
    await tournamentRepo.create(req.body as any);
    return res.redirect('/admin/games/tournaments/list');
  } catch (err) {
    console.error('Error creating tournament', err);
    return res.status(500).send('Error al crear torneo');
  }
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

// Update via SSR form (forward to API PUT)
router.post('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const [affectedRows] = await tournamentRepo.updateById(id, req.body as any);
    if (affectedRows === 0) return res.status(404).send('No encontrado');
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (err) {
    console.error('Error updating tournament', err);
    return res.status(500).send('Error al actualizar torneo');
  }
});

// Delete via SSR (forward to repo delete if available)
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await tournamentRepo.deleteById(id);
    return res.redirect('/admin/games/tournaments/list');
  } catch (err) {
    console.error('Error deleting tournament', err);
    return res.status(500).send('Error al eliminar torneo');
  }
});

export default router;
