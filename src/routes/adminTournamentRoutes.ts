import { Router, Request, Response } from 'express';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { Registration } from '../models/Registration';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { RegistrationRepository } from '../repositories/RegistrationRepository';

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

// New form (render admin form that POSTS back to this SSR route so we can redirect after create)
router.get('/new', requireAdmin, (req: Request, res: Response) => {
  // Post to the admin POST handler so the browser receives a redirect instead of raw JSON
  res.render('tournaments/form', { formTitle: 'Nuevo Torneo (Admin)', formAction: '/admin/games/tournaments/new' });
});

// Backwards-compatible alias: some links use '/create'
router.get('/create', requireAdmin, (req: Request, res: Response) => {
  return res.redirect('/admin/games/tournaments/new');
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
  // punctuality checkbox handling: if apply checkbox sent and false, zero the discount; if true and missing, default to 20
  if (out.punctuality_apply !== undefined) {
    const pa = (out.punctuality_apply === true || out.punctuality_apply === 'true' || out.punctuality_apply === '1' || out.punctuality_apply === 1);
    if (!pa) out.punctuality_discount = 0;
    else if (out.punctuality_discount === undefined || out.punctuality_discount === null || out.punctuality_discount === '') out.punctuality_discount = 20;
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
    if (req.session) {
      req.session.flash = { type: 'success', message: 'Torneo creado correctamente' };
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
    // load registrations and users for the inline registration form
    const registrations = await Registration.findAll({ where: { tournament_id: id }, order: [['registration_date','ASC']] });
    const users = await User.findAll({ where: { is_deleted: false }, order: [['username','ASC']] });
    res.render('tournaments/detail', { tournament, registrations, users, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Admin: register a user into a tournament from the tournament detail page
router.post('/:id/register', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body || {};
  try {
    const tournament = await tournamentRepo.getById(id);
    if (!tournament) return res.status(404).send('Torneo no encontrado');

    // handle inline user creation
    let userId = data.user_id ? Number(data.user_id) : null;
    if ((!userId || isNaN(userId)) && data.new_user_username) {
      // create a minimal user record
      const existing = await User.findOne({ where: { username: data.new_user_username } });
      if (existing) userId = existing.id;
      else {
        const nu = await User.create({ username: data.new_user_username, password_hash: 'imported', full_name: data.new_user_full_name || null, is_player: true });
        userId = nu.id;
      }
    }
    if (!userId) {
      if (req.session) req.session.flash = { type: 'error', message: 'Debes seleccionar o crear un usuario' };
      return res.redirect(`/admin/games/tournaments/${id}`);
    }

    const amountPaid = data.amount_paid ? Number(data.amount_paid) : 0;
    const method = data.method || null;

    // compute punctuality: registration at server time compared with tournament.start_date
    const now = new Date();
    const start = new Date(tournament.start_date as any);
    const punctuality = now <= start;

    // create registration
    const registration = await Registration.create({ user_id: userId, tournament_id: id, registration_date: now, punctuality });

    // expected amount after punctuality discount
    const pct = Number(tournament.punctuality_discount || 0);
    const expectedAmount = Number(tournament.buy_in || 0) * (1 - (pct / 100));

    // create payment record linking to registration
    await Payment.create({ user_id: userId, amount: expectedAmount, payment_date: now, source: 'tournament', reference_id: registration.id, paid: (amountPaid >= expectedAmount), paid_amount: amountPaid, method });

    if (req.session) req.session.flash = { type: 'success', message: 'Inscripción realizada correctamente' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (err) {
    console.error('Error registering user in tournament', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al registrar jugador' };
    return res.redirect(`/admin/games/tournaments/${id}`);
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
