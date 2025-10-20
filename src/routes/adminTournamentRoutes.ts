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
    // The form posts standard fields compatible with /api/tournaments
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('Create tournament failed:', text);
      return res.status(400).send('No se pudo crear el torneo: ' + text);
    }
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
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/tournaments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('Update tournament failed:', text);
      return res.status(400).send('No se pudo actualizar el torneo: ' + text);
    }
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
    // If repository has deleteById, call it; otherwise forward to API
    if ((tournamentRepo as any).deleteById) {
      await (tournamentRepo as any).deleteById(id);
    } else {
      await fetch(`${req.protocol}://${req.get('host')}/api/tournaments/${id}`, { method: 'DELETE' });
    }
    return res.redirect('/admin/games/tournaments/list');
  } catch (err) {
    console.error('Error deleting tournament', err);
    return res.status(500).send('Error al eliminar torneo');
  }
});

export default router;
