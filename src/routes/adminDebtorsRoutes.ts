import { Router, Request, Response } from 'express';
import paymentRepo from '../repositories/PaymentRepository';
import { requireAdmin } from '../middleware/requireAuth';
import User from '../models/User';

const router = Router();

// GET /admin/debtors?date=YYYY-MM-DD&username=xxx&min_amount=xxx&max_amount=xxx
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const q = req.query.date as string | undefined;
    const usernameFilter = req.query.username as string | undefined;
    const minAmount = req.query.min_amount ? Number(req.query.min_amount) : undefined;
    const maxAmount = req.query.max_amount ? Number(req.query.max_amount) : undefined;
    const showAll = req.query.all === 'true';
    
    let date: Date | null = null;
    let debtors;
    
    if (showAll) {
      // Mostrar todos los deudores
      debtors = await paymentRepo.getAllDebtors();
    } else {
      // Mostrar deudores de una fecha específica (hoy por defecto)
      date = q ? new Date(q) : new Date();
      debtors = await paymentRepo.getDebtorsByDate(date);
    }
    
    // enrich with user info and total debt
    let rows = await Promise.all(debtors.map(async d => {
      const u = await User.findByPk(d.userId);
      const totalDebt = await paymentRepo.getTotalDebtByUserId(d.userId);
      return { 
        user: u, 
        amountDue: d.amountDue,  // deuda del día o deuda total si showAll
        totalDebt: totalDebt      // deuda total siempre
      };
    }));

    // Aplicar filtros adicionales
    if (usernameFilter) {
      rows = rows.filter(r => r.user && 
        (r.user.username.toLowerCase().includes(usernameFilter.toLowerCase()) || 
         (r.user.full_name && r.user.full_name.toLowerCase().includes(usernameFilter.toLowerCase())))
      );
    }

    if (minAmount !== undefined) {
      rows = rows.filter(r => r.amountDue >= minAmount);
    }

    if (maxAmount !== undefined) {
      rows = rows.filter(r => r.amountDue <= maxAmount);
    }

    const totalDebt = rows.reduce((sum, r) => sum + r.amountDue, 0);
    const grandTotalDebt = rows.reduce((sum, r) => sum + r.totalDebt, 0);

    res.render('admin_debtors', { 
      username: req.session.username,
      date, 
      rows,
      totalDebt,
      grandTotalDebt,
      showAll,
      filters: { username: usernameFilter, min_amount: minAmount, max_amount: maxAmount }
    });
  } catch (e) {
    console.error('Error loading debtors', e);
    res.status(500).send('Error');
  }
});

export default router;
