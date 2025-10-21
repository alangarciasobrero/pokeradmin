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

// List admin view with pagination
router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(5, Number(req.query.per_page) || 20));
  const offset = (page - 1) * perPage;

  try {
    const { rows, count } = await (await import('../models/Tournament')).Tournament.findAndCountAll({
      limit: perPage,
      offset,
      order: [['start_date', 'DESC']]
    });

    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));

    const links = {
      prev: page > 1 ? `/admin/games/tournaments/list?page=${page - 1}&per_page=${perPage}` : null,
      next: page < totalPages ? `/admin/games/tournaments/list?page=${page + 1}&per_page=${perPage}` : null
    };

    res.render('admin/tournaments_list', {
      tournaments: rows,
      username: req.session.username,
      meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages },
      links
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar torneos');
  }
});

// New form (redirect to existing web form but with admin context)
router.get('/new', requireAdmin, (req: Request, res: Response) => {
  res.render('tournaments/form', { formTitle: 'Nuevo Torneo (Admin)', formAction: '/api/tournaments' });
});

/**
 * Normaliza los tipos recibidos desde un formulario HTML (strings) a los tipos esperados
 * por el repositorio/API: numbers, booleans y fechas.
 */
function normalizeTournamentInput(data: any) {
  if (!data || typeof data !== 'object') return data;
  const out: any = { ...data };
  const numFields = ['buy_in', 're_entry', 'knockout_bounty', 'starting_stack', 'blind_levels', 'small_blind', 'punctuality_discount'];
  const boolFields = ['count_to_ranking', 'double_points'];
  const dateFields = ['start_date'];

  for (const f of numFields) {
    if (out[f] !== undefined && out[f] !== null && out[f] !== '') {
      const n = Number(out[f]);
      out[f] = isNaN(n) ? out[f] : n;
    }
  }
  for (const f of boolFields) {
    if (out[f] !== undefined && out[f] !== null && out[f] !== '') {
      const v = out[f];
      out[f] = (v === true || v === 'true' || v === '1' || v === 1);
    }
  }
  for (const f of dateFields) {
    if (out[f] !== undefined && out[f] !== null && out[f] !== '') {
      const d = new Date(out[f]);
      out[f] = isNaN(d.getTime()) ? out[f] : d;
    }
  }
  return out;
}

// Create (handled by API) - but support a form POST from SSR that forwards to API
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
  // Normalize form input coming as strings and then create
  const normalized = normalizeTournamentInput(req.body);
  await tournamentRepo.create(normalized as any);
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
  const normalized = normalizeTournamentInput(req.body);
  const [affectedRows] = await tournamentRepo.updateById(id, normalized as any);
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
