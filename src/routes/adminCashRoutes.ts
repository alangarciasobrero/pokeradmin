import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import CashGameRepository from '../repositories/CashGameRepository';
import CashParticipantRepository from '../repositories/CashParticipantRepository';
import User from '../models/User';
import { Payment } from '../models/Payment';
import { renderCloseForm, handleClosePost } from '../controllers/adminCashController';
import { renderBulkClose, handleBulkClosePost } from '../controllers/adminCashController';
import { renderTotals, exportTotalsCSV } from '../controllers/adminCashController';

const router = Router();

// use central requireAdmin middleware imported above

router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(200, Math.max(5, Number(req.query.per_page) || 20));
  try {
    const { rows, count } = await CashGameRepository.getPaginated({ page, perPage });
    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));
    const links = {
      prev: page > 1 ? `/admin/games/cash/list?page=${page - 1}&per_page=${perPage}` : null,
      next: page < totalPages ? `/admin/games/cash/list?page=${page + 1}&per_page=${perPage}` : null
    };
    res.render('admin/cash_list', { cashGames: rows, meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages }, links, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar cash games');
  }
});

router.get('/new', requireAdmin, (req: Request, res: Response) => {
  // Use admin form action so the admin POST handler is used
  res.render('cash/form', { formTitle: 'Nueva Mesa Cash', formAction: '/admin/games/cash/new' });
});

// Alias for older links using '/create'
router.get('/create', requireAdmin, (req: Request, res: Response) => {
  return res.redirect('/admin/games/cash/new');
});

// Edit form: render existing cash game into the same form
router.get('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.redirect('/admin/games/cash/list');
    res.render('cash/form', { formTitle: 'Editar Mesa Cash', formAction: `/admin/games/cash/${id}/edit`, cash });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/games/cash/list');
  }
});

router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).send('No encontrado');
    // load participants and users so we can render an inline registration form in the detail view
    const participants = await CashParticipantRepository.findByCashGame(id);
    
    // Load payment data for each participant
    const enrichedParticipants = await Promise.all(participants.map(async (p: any) => {
      // Get payments for this participant (source='cash' or 'cash_request', reference_id=participant.id)
      const payments = await Payment.findAll({ 
        where: { reference_id: p.id, source: ['cash', 'cash_request'] },
        order: [['payment_date', 'ASC']]
      });
      
      const requestPayment = payments.find((pay: any) => pay.source === 'cash_request');
      const cashPayment = payments.find((pay: any) => pay.source === 'cash');
      
      return {
        ...p.get({ plain: true }),
        requested_amount: requestPayment ? Number(requestPayment.amount) : 0,
        amount_paid: cashPayment ? Number(cashPayment.paid_amount || 0) : 0,
        method: cashPayment ? cashPayment.method : null,
        recorded_by: cashPayment ? cashPayment.recorded_by_name : null
      };
    }));
    
    const users = await User.findAll({ where: { is_deleted: false }, order: [['username','ASC']] });
    const umap: any = {};
    users.forEach((u: any) => umap[u.id] = u);
    res.render('cash/detail', { cash, participants: enrichedParticipants, users, umap, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Admin: register a user into a cash game from the cash detail page
router.post('/:id/register', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body || {};
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).send('Cash game no encontrado');

    // handle inline user creation
    let userId = data.user_id ? Number(data.user_id) : null;
    if ((!userId || isNaN(userId)) && data.new_user_username) {
      const existing = await User.findOne({ where: { username: data.new_user_username } });
      if (existing) userId = existing.id;
      else {
        const nu = await User.create({ username: data.new_user_username, password_hash: 'imported', full_name: data.new_user_full_name || null, is_player: true });
        userId = nu.id;
      }
    }
    if (!userId) {
      if (req.session) req.session.flash = { type: 'error', message: 'Debes seleccionar o crear un usuario' };
      return res.redirect(`/admin/games/cash/${id}`);
    }

    const seatNumber = data.seat_number ? Number(data.seat_number) : null;
    // create participant
    const participant = await CashParticipantRepository.create({ cash_game_id: id, user_id: userId, seat_number: seatNumber });

    // record payment if amount provided
    const amountPaid = data.amount_paid !== undefined && data.amount_paid !== null && data.amount_paid !== '' ? Number(data.amount_paid) : 0;
    // requested amount (pedido) is a distinct concept for cash games: the amount the player asks to play with
    const requestedAmount = data.requested_amount !== undefined && data.requested_amount !== null && data.requested_amount !== '' ? Number(data.requested_amount) : 0;
    const method = data.method || null;
    const personalAccount = data.personal_account === 'on' || data.personal_account === 'true' || data.personal_account === true;
    const now = new Date();
    // If the admin entered a requested amount, record it as a separate ledger entry with paid=false
    if (requestedAmount > 0) {
      try {
        await Payment.create({ user_id: userId, amount: requestedAmount, payment_date: now, source: 'cash_request', reference_id: participant.id, paid: false, paid_amount: 0, method: null, personal_account: personalAccount, recorded_by_name: req.session && req.session.username ? String(req.session.username) : null });
      } catch (err) {
        console.error('Error recording requested amount for cash registration', err);
        // continue: do not block registration if ledger write fails; show flash
        if (req.session) req.session.flash = { type: 'warning', message: 'Jugador registrado pero falló el registro del pedido en ledger' };
      }
    }

    // Record a payment row for any immediate payment (paid=true only if amountPaid > 0)
    const paidFlag = amountPaid > 0;
    const methodWithActor = req.session && req.session.username ? (method ? `${method}|by:${req.session.username}:${req.session.userId}` : `manual|by:${req.session.username}:${req.session.userId}`) : (method || null);
    const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
    try {
      await Payment.create({ user_id: userId, amount: amountPaid, payment_date: now, source: 'cash', reference_id: participant.id, paid: paidFlag, paid_amount: amountPaid, method: methodWithActor, personal_account: personalAccount, recorded_by_name: recordedByName });
    } catch (err) {
      console.error('Error recording payment for cash registration', err);
      if (req.session) req.session.flash = { type: 'warning', message: 'Jugador registrado pero falló el registro de pago en ledger' };
    }

    if (req.session) req.session.flash = { type: 'success', message: 'Jugador registrado en la mesa cash' };
    return res.redirect(`/admin/games/cash/${id}`);
  } catch (err) {
    console.error('Error registering user in cash game', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al registrar jugador' };
    return res.redirect(`/admin/games/cash/${id}`);
  }
});

// Create via admin form (POST to API already exists, but provide server-side forwarding)
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const payload = {
      user_id: Number(req.body.user_id),
      start_datetime: req.body.date,
      end_datetime: req.body.end_date || null,
      small_blind: Number(req.body.small_blind || 0),
      total_commission: Number(req.body.amount || 0),
      dealer: req.body.dealer || null,
      total_tips: Number(req.body.total_tips || 0),
      description: req.body.description || null
    };
    await CashGameRepository.create(payload as any);
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear cash game');
  }
});

// Edit form will post here
router.post('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = {
      start_datetime: req.body.date,
      end_datetime: req.body.end_date || null,
      small_blind: Number(req.body.small_blind || 0),
      total_commission: Number(req.body.amount || 0),
      dealer: req.body.dealer || null,
      total_tips: Number(req.body.total_tips || 0),
      description: req.body.description || null
    };
    await CashGameRepository.update(id, payload as any);
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar cash game');
  }
});

// Delete cash game
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CashGameRepository.delete(id);
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar cash game');
  }
});

// Participants management
router.get('/:id/participants', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).send('Cash game no encontrado');
    const participants = await CashParticipantRepository.findByCashGame(id);
    // load users map
    const users = await User.findAll({ where: { is_deleted: false } });
    const umap: any = {};
    users.forEach((u: any) => umap[u.id] = u);
    res.render('admin/cash_participants_list', { cash, participants, users, umap, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar participantes');
  }
});

router.post('/:id/participants/new', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const userId = Number(req.body.user_id);
    if (!userId) return res.redirect(`/admin/games/cash/${id}/participants`);
    await CashParticipantRepository.create({ cash_game_id: id, user_id: userId, seat_number: req.body.seat_number ? Number(req.body.seat_number) : null });
    res.redirect(`/admin/games/cash/${id}/participants`);
  } catch (err) {
    console.error(err);
    res.redirect(`/admin/games/cash/${id}/participants`);
  }
});

router.post('/:id/participants/:pid/delete', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const pid = Number(req.params.pid);
  try {
    await CashParticipantRepository.deleteById(pid);
    res.redirect(`/admin/games/cash/${id}/participants`);
  } catch (err) {
    console.error(err);
    res.redirect(`/admin/games/cash/${id}/participants`);
  }
});

// Shift change: record dealer, commission, and tips without closing the game
router.post('/:id/shift', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).json({ error: 'Cash game no encontrado' });

    const { dealer_name, commission, tips, recorded_by } = req.body;
    const commissionAmount = Number(commission || 0);
    const tipsAmount = Number(tips || 0);

    // Update dealer name and accumulate commission/tips
    const newTotalCommission = Number(cash.total_commission || 0) + commissionAmount;
    const newTotalTips = Number(cash.total_tips || 0) + tipsAmount;

    await CashGameRepository.update(id, { 
      dealer: dealer_name || cash.dealer,
      total_commission: newTotalCommission,
      total_tips: newTotalTips
    } as any);

    // Create payment for commission increment
    if (commissionAmount > 0) {
      const systemUserId = req.session?.userId ? Number(req.session.userId) : 1;
      const methodWithActor = `shift_commission|by:${recorded_by || req.session?.username}`;
      await Payment.create({ 
        user_id: systemUserId, 
        amount: commissionAmount, 
        payment_date: new Date(), 
        source: 'cash_commission', 
        reference_id: id, 
        paid: true, 
        paid_amount: commissionAmount, 
        method: methodWithActor, 
        personal_account: false, 
        recorded_by_name: recorded_by || req.session?.username || null 
      });
    }

    // Note: Tips would need dealer_user_id to credit properly
    // For now, just accumulate in total_tips

    res.json({ success: true, message: 'Turno registrado exitosamente' });
  } catch (err) {
    console.error('Error recording shift', err);
    res.status(500).json({ error: 'Error al registrar turno' });
  }
});

// Close cash game: render form
router.get('/:id/close', requireAdmin, renderCloseForm);

// Close cash game: process closure and create commission/tips payments
router.post('/:id/close', requireAdmin, handleClosePost);

// Bulk close: show open games for a date and aggregated per-dealer totals
router.get('/bulk-close', requireAdmin, renderBulkClose);
router.post('/bulk-close', requireAdmin, handleBulkClosePost);

// Totals page and CSV export
router.get('/totals', requireAdmin, renderTotals);
router.get('/totals.csv', requireAdmin, exportTotalsCSV);

export default router;

