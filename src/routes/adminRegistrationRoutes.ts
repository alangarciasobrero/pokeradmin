import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { Tournament } from '../models/Tournament';
import User from '../models/User';

const router = Router();
const registrationRepo = new RegistrationRepository();

// use central requireAdmin middleware imported above

// List registrations (admin)
router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(200, Math.max(5, Number(req.query.per_page) || 20));
  const filters: any = {};
  if (req.query.tournament_id) filters.tournament_id = Number(req.query.tournament_id);
  if (req.query.user_id) filters.user_id = Number(req.query.user_id);
  try {
    const { rows, count } = await registrationRepo.getPaginated({ page, perPage, where: filters });

    // Load users and tournaments maps to show names instead of ids
    const users = await User.findAll({ where: { is_deleted: false } });
    const tmap: any = {};
    const umap: any = {};
    (await Tournament.findAll()).forEach((t: any) => { tmap[t.id] = t; });
    users.forEach((u: any) => { umap[u.id] = u; });

    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));
    const links = {
      prev: page > 1 ? `/admin/registrations/list?page=${page - 1}&per_page=${perPage}` : null,
      next: page < totalPages ? `/admin/registrations/list?page=${page + 1}&per_page=${perPage}` : null
    };

    res.render('admin/registrations_list', {
      registrations: rows,
      username: req.session.username,
      users: umap,
      tournaments: tmap,
      meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages },
      links,
      selected_tournament_id: req.query.tournament_id ? Number(req.query.tournament_id) : null,
      selected_user_id: req.query.user_id ? Number(req.query.user_id) : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener inscripciones');
  }
});

// Check if buy-in already exists for validation
router.get('/check-buyin', requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.user_id);
    const tournamentId = Number(req.query.tournament_id);
    
    if (!userId || !tournamentId) {
      return res.json({ exists: false });
    }

    const { Registration } = await import('../models/Registration');
    const existingBuyin = await Registration.findOne({
      where: {
        user_id: userId,
        tournament_id: tournamentId,
        action_type: 1 // Buy-in
      }
    });

    res.json({ exists: !!existingBuyin });
  } catch (err) {
    console.error(err);
    res.json({ exists: false });
  }
});

// New form: need tournaments and users for select options
router.get('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.findAll({ order: [['start_date', 'DESC']] });
    const users = await User.findAll({ where: { is_deleted: false } });
  // Post to the SSR admin create handler so we normalize punctuality server-side
  res.render('registrations/form', { formTitle: 'Nueva Inscripción', formAction: '/admin/registrations/new', tournaments, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al preparar formulario');
  }
});

// Create: forward to API (or repo) - accept JSON body from form
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const payload: any = {
      user_id: Number(req.body.user_id),
      tournament_id: Number(req.body.tournament_id),
      punctuality: req.body.punctuality === 'true' || req.body.punctuality === 'on'
    };
    // accept numeric action_type (1=buyin,2=reentry,3=duplo)
    const at = Number(req.body.action_type || 1);
    payload.action_type = (isNaN(at) ? 1 : at);
    const reg = await registrationRepo.create(payload as any);
    // keep an audit line for reference
    try {
      const fs = await import('fs');
      const logPath = 'logs/registration_actions.log';
      const entry = { time: new Date().toISOString(), registrationId: (reg as any).id, userId: payload.user_id, tournamentId: payload.tournament_id, actionType: payload.action_type };
      try { fs.mkdirSync('logs', { recursive: true }); } catch (_) {}
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
    } catch (e) {
      console.error('Failed to write registration action log', e);
    }
    res.redirect('/admin/registrations/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear inscripción');
  }
});

// View detail
router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const reg = await registrationRepo.getById(id);
    if (!reg) return res.status(404).send('No encontrado');
    const user = await User.findByPk(Number((reg as any).user_id));
    const tournament = await Tournament.findByPk(Number((reg as any).tournament_id));
    res.render('admin/registration_detail', { registration: reg, user, tournament, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener inscripción');
  }
});

// Delete (POST)
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await registrationRepo.deleteById(id);
    res.redirect('/admin/registrations/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar inscripción');
  }
});

export default router;
