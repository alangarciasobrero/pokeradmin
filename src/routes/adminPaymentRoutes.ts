import express from 'express';
import paymentRepo from '../repositories/PaymentRepository';
import { requireAdmin } from '../middleware/requireAuth';
import Payment from '../models/Payment';

const router = express.Router();

// List payments for a date (query ?date=YYYY-MM-DD), defaults to today
router.get('/', async (req, res) => {
  const q = req.query.date as string | undefined;
  const date = q ? new Date(q) : new Date();
  try {
    const payments = await paymentRepo.findByDate(date);
    res.render('admin_payments_list', { payments, date });
  } catch (e) {
    console.error('Error listing payments', e);
    res.status(500).send('Error listing payments');
  }
});

// GET /admin/payments/create - form to create a new payment
router.get('/create', requireAdmin, async (req, res) => {
  res.render('admin_payments_create', { formAction: '/admin/payments/create' });
});

// POST /admin/payments/create - create a new payment record
router.post('/create', requireAdmin, async (req, res) => {
  try {
    const { user_id, amount, source, reference_id, method, personal_account, paid } = req.body as any;
    if (!user_id || !amount) return res.render('admin_payments_create', { error: 'user_id y amount son requeridos', formAction: '/admin/payments/create', form: req.body });
    const p = await Payment.create({
      user_id: Number(user_id),
      amount: Number(amount),
      payment_date: new Date(),
      source: source || null,
      reference_id: reference_id ? Number(reference_id) : null,
      method: method || null,
      personal_account: personal_account === 'on' || personal_account === true ? true : false,
      paid: paid === 'on' || paid === true ? true : false,
      paid_amount: paid === 'on' || paid === true ? Number(amount) : 0
    });
    req.session!.flash = { type: 'success', message: 'Pago creado' };
    res.redirect('/admin/payments');
  } catch (e) {
    console.error('Error creating payment', e);
    res.render('admin_payments_create', { error: 'Error creando pago', formAction: '/admin/payments/create', form: req.body });
  }
});

// Mark a payment as paid (POST)
router.post('/:id/mark-paid', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).send('Payment not found');
    payment.paid = true;
    payment.paid_amount = payment.amount;
    await payment.save();
    req.session!.flash = { type: 'success', message: 'Pago marcado como pagado' };
    res.redirect('back');
  } catch (e) {
    console.error('Error marking payment paid', e);
    res.status(500).send('Error');
  }
});

// Update payment (partial payment / adjust paid_amount)
router.post('/:id/update', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).send('Payment not found');
    const paidAmount = req.body.paid_amount !== undefined ? Number(req.body.paid_amount) : (payment.paid_amount || 0);
    payment.paid_amount = paidAmount;
    if (paidAmount >= Number(payment.amount)) payment.paid = true;
    else payment.paid = false;
    await payment.save();
    req.session!.flash = { type: 'success', message: 'Pago actualizado' };
    res.redirect('back');
  } catch (e) {
    console.error('Error updating payment', e);
    res.status(500).send('Error');
  }
});

// GET /admin/payments/close-day - show a small summary for a date
router.get('/close-day', requireAdmin, async (req, res) => {
  const q = req.query.date as string | undefined;
  const date = q ? new Date(q) : new Date();
  try {
    const payments = await paymentRepo.findByDate(date);
    const totals = payments.reduce((acc: any, p: any) => {
      const amt = Number(p.amount || 0);
      const paid = Number((p.paid_amount as any) || 0);
      acc.totalAmount += amt;
      acc.totalPaid += paid;
      acc.outstanding += Math.max(0, amt - paid);
      return acc;
    }, { totalAmount: 0, totalPaid: 0, outstanding: 0 });

    res.render('admin_payments_close_day', { date, totals });
  } catch (e) {
    console.error('Error generating close-day summary', e);
    res.status(500).send('Error');
  }
});

// List unassigned tips (method starts with 'tips_unassigned' or source contains 'unassigned')
router.get('/unassigned', requireAdmin, async (req, res) => {
  try {
    // First try to search method patterns
    const rows = await Payment.findAll({ where: { method: ['tips_unassigned', 'tips_unassigned:*'] } as any });
    // Fallback: search by source pattern
    const unassigned = await Payment.findAll({ where: { source: ['cash_tips_unassigned'] } as any });
    const combined = (rows || []).concat(unassigned || []);
    res.render('admin_payments_unassigned', { payments: combined });
  } catch (e) {
    console.error('Error loading unassigned tips', e);
    res.status(500).send('Error');
  }
});

// Assign an unassigned tip payment to a user (POST)
router.post('/unassigned/:id/assign', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.body.user_id);
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).send('Pago no encontrado');
    payment.user_id = userId;
    payment.method = 'tips_bulk';
    await payment.save();
    req.session!.flash = { type: 'success', message: 'Propina asignada' };
    res.redirect('/admin/payments/unassigned');
  } catch (e) {
    console.error('Error assigning tip', e);
    res.status(500).send('Error');
  }
});

export default router;
