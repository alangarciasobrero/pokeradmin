import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { Tournament } from '../models/Tournament';
import { Registration } from '../models/Registration';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import sequelize from '../services/database';

const router = Router();
const tournamentRepo = new TournamentRepository();

// use central requireAdmin middleware imported above

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

// Backwards-compatible alias: some UI links point to /:id/registrations
// Redirect to the tournament detail page which includes registrations inline.
router.get('/:id/registrations', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  return res.redirect(`/admin/games/tournaments/${id}`);
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

  const amountPaid = data.amount_paid !== undefined && data.amount_paid !== null && data.amount_paid !== '' ? Number(data.amount_paid) : 0;
  const method = data.method || null;
  const personalAccount = data.personal_account === 'on' || data.personal_account === 'true' || data.personal_account === true;

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
  // Support partial payments and debtors: paid = true only if amountPaid >= expectedAmount and amountPaid > 0
  const paidFlag = (amountPaid > 0 && amountPaid >= expectedAmount);
  const methodWithActor = req.session && req.session.username ? (method ? `${method}|by:${req.session.username}:${req.session.userId}` : `manual|by:${req.session.username}:${req.session.userId}`) : (method || null);
  const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
  await Payment.create({ user_id: userId, amount: expectedAmount, payment_date: now, source: 'tournament', reference_id: registration.id, paid: paidFlag, paid_amount: amountPaid, method: methodWithActor, personal_account: personalAccount, recorded_by_name: recordedByName });

    if (req.session) req.session.flash = { type: 'success', message: 'Inscripción realizada correctamente' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (err) {
    console.error('Error registering user in tournament', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al registrar jugador' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// POST /admin/games/tournaments/:id/close-registrations - close further registrations
router.post('/:id/close-registrations', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await Tournament.findByPk(id);
    if (!t) return res.status(404).send('No encontrado');
    (t as any).registration_open = false;
    await t.save();
    if (req.session) req.session.flash = { type: 'success', message: 'Inscripciones cerradas' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (e) {
    console.error('Error closing registrations', e);
    if (req.session) req.session.flash = { type: 'error', message: 'Error cerrando inscripciones' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// POST /admin/games/tournaments/:id/open-registrations - reopen registrations
router.post('/:id/open-registrations', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await Tournament.findByPk(id);
    if (!t) return res.status(404).send('No encontrado');
    (t as any).registration_open = true;
    await t.save();
    if (req.session) req.session.flash = { type: 'success', message: 'Inscripciones reabiertas' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (e) {
    console.error('Error opening registrations', e);
    if (req.session) req.session.flash = { type: 'error', message: 'Error abriendo inscripciones' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// POST /admin/games/tournaments/:id/close-tournament - mark tournament as closed (set end_date)
router.post('/:id/close-tournament', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await Tournament.findByPk(id);
    if (!t) return res.status(404).send('No encontrado');
    (t as any).end_date = new Date();
    await t.save();
    if (req.session) req.session.flash = { type: 'success', message: 'Torneo marcado como cerrado' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (e) {
    console.error('Error closing tournament', e);
    if (req.session) req.session.flash = { type: 'error', message: 'Error cerrando torneo' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// GET preview for closing: compute pot, commission suggestion and default prizes
router.get('/:id/preview-close', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await tournamentRepo.getById(id);
    if (!t) return res.status(404).json({ error: 'No encontrado' });

    // load registrations for tournament
    const regs = await Registration.findAll({ where: { tournament_id: id } });
    const regIds = regs.map(r => r.id);

    // sum actual money for this tournament: consider payments with reference_id in regIds
    const payments = await Payment.findAll({ where: { reference_id: regIds } as any });
    let pot = 0;
    const perUser: Record<number, { paid: number; expected: number }> = {};
    for (const r of regs) perUser[(r as any).user_id] = { paid: 0, expected: 0 };
    for (const p of payments) {
      const pid = Number((p as any).user_id);
      const paid = Number((p as any).paid_amount || 0) || (Number((p as any).amount || 0) * ((p as any).paid ? 1 : 0));
      if (!isNaN(paid) && paid > 0) {
        pot += paid;
        if (perUser[pid]) perUser[pid].paid += paid;
      }
      if (!isNaN(Number((p as any).amount))) {
        if (perUser[pid]) perUser[pid].expected += Number((p as any).amount || 0);
      }
    }

    // default commission suggestion 10%
    const commissionPct = 10;
    const commissionAmount = +(pot * (commissionPct / 100));
    const prizePool = +(pot - commissionAmount);

    // default prize split: top3 50/30/20 if at least 3 paid players, otherwise winner takes all
    const paidPlayers = Object.values(perUser).filter(x => x.paid > 0).length;
    let defaultPrizes: Array<{ position: number; amount: number }> = [];
    if (paidPlayers >= 3) {
      defaultPrizes = [ { position: 1, amount: +(prizePool * 0.5) }, { position: 2, amount: +(prizePool * 0.3) }, { position: 3, amount: +(prizePool * 0.2) } ];
    } else if (paidPlayers === 2) {
      defaultPrizes = [ { position: 1, amount: +(prizePool * 0.6) }, { position: 2, amount: +(prizePool * 0.4) } ];
    } else if (paidPlayers === 1) {
      defaultPrizes = [ { position: 1, amount: prizePool } ];
    } else {
      defaultPrizes = [];
    }

    // participant summary
    const users = await User.findAll({ where: { id: regs.map(r => (r as any).user_id) } as any });
    const umap: any = {};
    users.forEach(u => umap[(u as any).id] = u);

    const participants = regs.map(r => {
      const uid = (r as any).user_id;
      return { registration_id: (r as any).id, user_id: uid, username: umap[uid] ? umap[uid].username : ('#'+uid), paid: perUser[uid] ? perUser[uid].paid : 0, expected: perUser[uid] ? perUser[uid].expected : 0 };
    });

    return res.json({ pot, commissionPct, commissionAmount, prizePool, defaultPrizes, participants });
  } catch (e) {
    console.error('Error preview-close', e);
    return res.status(500).json({ error: 'Error computing preview' });
  }
});

// GET participants JSON with enriched per-registration financials for admin UI
router.get('/:id/participants-json', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const regs = await Registration.findAll({ where: { tournament_id: id }, order: [['registration_date','ASC']] });
    const regIds = regs.map(r => (r as any).id);

    // fetch payments linked to these registrations
    const payments = await Payment.findAll({ where: { reference_id: regIds } as any, order: [['payment_date','ASC']] });

    // aggregate per registration
    const perReg: Record<number, any> = {};
    for (const r of regs) {
      perReg[(r as any).id] = { paid: 0, expected: 0, lastMethod: null, personal_account: false };
    }
    for (const p of payments) {
      const rid = Number((p as any).reference_id);
      if (!perReg[rid]) continue;
      const paid = Number((p as any).paid_amount || 0) || (Number((p as any).amount || 0) * ((p as any).paid ? 1 : 0));
      if (!isNaN(paid) && paid !== 0) perReg[rid].paid += paid;
      const amt = Number((p as any).amount || 0);
      if (!isNaN(amt) && amt !== 0) perReg[rid].expected += amt;
      if ((p as any).method) perReg[rid].lastMethod = (p as any).method;
      if ((p as any).personal_account) perReg[rid].personal_account = true;
    }

    // load users
    const userIds = regs.map(r => (r as any).user_id);
    const users = await User.findAll({ where: { id: userIds } as any });
    const umap: Record<number, any> = {};
    users.forEach(u => { umap[(u as any).id] = u; });

    const participants = regs.map(r => {
      const rid = (r as any).id;
      const uid = (r as any).user_id;
      const u = umap[uid];
      const agg = perReg[rid] || { paid: 0, expected: 0, lastMethod: null, personal_account: false };
      const debt = +(agg.expected - agg.paid);
      const amountToPot = +(agg.paid > 0 ? agg.paid : 0);
      return {
        registration_id: rid,
        user_id: uid,
        username: u ? u.username : ('#'+uid),
        full_name: u ? u.full_name : null,
        action: (r as any).is_reentry ? 'Re-entry' : 'Buy-in',
        punctuality: !!(r as any).punctuality,
        registration_date: (r as any).registration_date,
        paid: +agg.paid,
        expected: +agg.expected,
        debt: +debt,
        lastMethod: agg.lastMethod,
        personal_account: !!agg.personal_account,
        position: (r as any).position || null,
        amount_contributed_to_pot: +amountToPot
      };
    });

    return res.json({ participants });
  } catch (e) {
    console.error('Error participants-json', e);
    return res.status(500).json({ error: 'Error computing participants' });
  }
});

// POST confirm-close: accept commission/prizes, create payouts and finalize
router.post('/:id/confirm-close', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { commissionPct, prizes } = req.body as any;
    const t = await tournamentRepo.getById(id);
    if (!t) return res.status(404).json({ error: 'No encontrado' });

    // recompute pot same as preview
    const regs = await Registration.findAll({ where: { tournament_id: id } });
    const regIds = regs.map(r => r.id);
    const payments = await Payment.findAll({ where: { reference_id: regIds } as any });
    let pot = 0;
    const perRegPaid: Record<number, number> = {};
    for (const r of regs) perRegPaid[(r as any).id] = 0;
    for (const p of payments) {
      const paid = Number((p as any).paid_amount || 0) || (Number((p as any).amount || 0) * ((p as any).paid ? 1 : 0));
      if (!isNaN(paid) && paid > 0) {
        pot += paid;
        if ((p as any).reference_id && perRegPaid[(p as any).reference_id] !== undefined) perRegPaid[(p as any).reference_id] += paid;
      }
    }

    const cPct = Number(commissionPct) || 0;
    const commissionAmount = +(pot * (cPct / 100));
    const prizePool = +(pot - commissionAmount);

    // validate total prizes do not exceed prizePool
    const totalPrizes = (prizes || []).reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
    // allow tiny floating point slack
    if (totalPrizes > prizePool + 0.0001) {
      return res.status(400).json({ error: 'Total premios excede pozo disponible', totalPrizes, prizePool });
    }

    // record commission as a Payment row (assign to acting admin if known)
    let commissionUserId: number | null = null;
    if (req.session && req.session.userId) commissionUserId = Number(req.session.userId);
    else {
      // try to find any admin user
      const adminUser = await User.findOne({ where: { role: 'admin' } as any });
      if (adminUser) commissionUserId = (adminUser as any).id;
    }
    // fallback to first registration user if still missing
    if (!commissionUserId && regs.length > 0) commissionUserId = (regs[0] as any).user_id;

    if (commissionAmount > 0 && commissionUserId) {
      await Payment.create({ user_id: commissionUserId, amount: +commissionAmount, payment_date: new Date(), source: 'commission', reference_id: id, paid: true, paid_amount: commissionAmount, method: 'commission', personal_account: false, recorded_by_name: req.session ? req.session.username : null });
    }

    // prizes expected: array of {position, user_id, amount}
    // create payouts (negative amounts) for each prize entry
    for (const pr of prizes || []) {
      const userId = Number(pr.user_id);
      const amount = Number(pr.amount) || 0;
      if (!userId || amount <= 0) continue;
      // create payout payment as negative amount
      await Payment.create({ user_id: userId, amount: -Math.abs(amount), payment_date: new Date(), source: 'tournament_payout', reference_id: null, paid: true, paid_amount: Math.abs(amount), method: 'payout', personal_account: false, recorded_by_name: req.session ? req.session.username : null });
    }

    // finalize tournament: set registration_open false and end_date
    const tt = await Tournament.findByPk(id);
    if (tt) {
      (tt as any).registration_open = false;
      (tt as any).end_date = new Date();
      await tt.save();
    }

    return res.json({ ok: true, pot, commissionAmount, prizePool });
  } catch (e) {
    console.error('Error confirm-close', e);
    return res.status(500).json({ error: 'Error finalizing tournament' });
  }
});

// POST positions: accept array positions: [{ registration_id, user_id, position }]
router.post('/:id/positions', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { positions } = req.body as any;
    if (!Array.isArray(positions)) return res.status(400).json({ error: 'positions array required' });
    // update each registration
    for (const p of positions) {
      const rid = Number(p.registration_id) || null;
      const pos = p.position !== undefined ? Number(p.position) : null;
      if (!rid) continue;
      const reg = await Registration.findByPk(rid);
      if (!reg) continue;
      (reg as any).position = pos;
      await reg.save();
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error('Error saving positions', e);
    return res.status(500).json({ error: 'Error' });
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
