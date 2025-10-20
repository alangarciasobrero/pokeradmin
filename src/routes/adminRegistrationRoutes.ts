import { Router, Request, Response } from 'express';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { Tournament } from '../models/Tournament';
import User from '../models/User';

const router = Router();
const registrationRepo = new RegistrationRepository();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

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
      links
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener inscripciones');
  }
});

// New form: need tournaments and users for select options
router.get('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.findAll({ order: [['start_date', 'DESC']] });
    const users = await User.findAll({ where: { is_deleted: false } });
    res.render('registrations/form', { formTitle: 'Nueva Inscripción', formAction: '/api/registrations', tournaments, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al preparar formulario');
  }
});

// Create: forward to API (or repo) - accept JSON body from form
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const payload = {
      user_id: req.body.user_id || req.body.player_id,
      tournament_id: req.body.tournament_id,
      punctuality: req.body.punctuality === 'true' || req.body.punctuality === 'on'
    };
    await registrationRepo.create(payload as any);
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
