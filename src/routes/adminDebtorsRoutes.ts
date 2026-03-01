import { Router, Request, Response } from 'express';
import paymentRepo from '../repositories/PaymentRepository';
import { requireAdmin } from '../middleware/requireAuth';
import User from '../models/User';
import XLSX from 'xlsx';

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

// GET /admin/debtors/export - export all debtors to Excel
router.get('/export', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const debtors = await paymentRepo.getAllDebtors();
    const rows = await Promise.all(debtors.map(async d => {
      const u = await User.findByPk(d.userId);
      const totalDebt = await paymentRepo.getTotalDebtByUserId(d.userId);
      return {
        username: u ? u.username : `#${d.userId}`,
        full_name: u ? (u as any).full_name || '' : '',
        amount_due: d.amountDue,
        total_debt: totalDebt
      };
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deudores');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="deudores.xlsx"');
    return res.send(buffer);
  } catch (e) {
    console.error('Error exporting debtors', e);
    return res.status(500).send('Error exportando deudores');
  }
});

export default router;
