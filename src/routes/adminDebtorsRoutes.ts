import { Router, Request, Response } from 'express';
import paymentRepo from '../repositories/PaymentRepository';
import { requireAdmin } from '../middleware/requireAuth';
import User from '../models/User';

const router = Router();

// GET /admin/debtors?date=YYYY-MM-DD
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const q = req.query.date as string | undefined;
    const date = q ? new Date(q) : new Date();
    const debtors = await paymentRepo.getDebtorsByDate(date);
    // enrich with user info
    const rows = await Promise.all(debtors.map(async d => {
      const u = await User.findByPk(d.userId);
      return { user: u, amountDue: d.amountDue };
    }));
    res.render('admin_debtors', { date, rows });
  } catch (e) {
    console.error('Error loading debtors', e);
    res.status(500).send('Error');
  }
});

export default router;
