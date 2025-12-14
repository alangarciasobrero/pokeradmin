import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import Payment from '../models/Payment';
import { Tournament } from '../models/Tournament';
import { CashGame } from '../models/CashGame';
import User from '../models/User';
import { Op } from 'sequelize';

const router = Router();

// Reporte de comisión diaria
router.get('/daily-commission', requireAdmin, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Comisiones de torneos del día
    const tournamentCommissions = await Payment.findAll({
      where: {
        source: 'commission', // Comisiones de torneos usan source='commission'
        payment_date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      order: [['payment_date', 'DESC']]
    });

    // Obtener IDs de torneos
    const tournamentIds = tournamentCommissions.map((p: any) => p.reference_id).filter(Boolean);
    const tournaments = await Tournament.findAll({
      where: { id: { [Op.in]: tournamentIds } }
    });
    const tournamentsMap = new Map(tournaments.map((t: any) => [t.id, t]));

    // Comisiones de mesas cash del día
    const cashCommissions = await Payment.findAll({
      where: {
        source: 'cash_commission',
        payment_date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      order: [['payment_date', 'DESC']]
    });

    // Obtener detalles de las mesas cash
    const cashGameIds = cashCommissions.map((p: any) => p.reference_id).filter(Boolean);
    const cashGames = await CashGame.findAll({
      where: { id: { [Op.in]: cashGameIds } }
    });
    const cashGamesMap = new Map(cashGames.map((cg: any) => [cg.id, cg]));

    // Procesar datos de torneos
    const tournamentData = tournamentCommissions.map((p: any) => {
      const tournament = tournamentsMap.get(p.reference_id);
      return {
        id: tournament?.id || p.reference_id,
        name: tournament?.name || `Torneo #${p.reference_id}`,
        buy_in: tournament?.buy_in || 0,
        start_time: tournament?.start_datetime,
        commission: Number(p.amount || 0),
        payment_date: p.payment_date
      };
    });

    // Procesar datos de cash - agrupar por mesa para evitar duplicados
    const cashDataMap = new Map();
    cashCommissions.forEach((p: any) => {
      const cashGame = cashGamesMap.get(p.reference_id);
      if (!cashDataMap.has(p.reference_id)) {
        cashDataMap.set(p.reference_id, {
          id: p.reference_id,
          name: `Mesa Cash #${p.reference_id}`,
          dealer: cashGame?.dealer || 'N/A',
          start_time: cashGame?.start_datetime,
          commission: Number(p.amount || 0),
          payment_date: p.payment_date
        });
      }
    });
    const cashData = Array.from(cashDataMap.values());

    const totalTournaments = tournamentData.reduce((sum, t) => sum + t.commission, 0);
    const totalCash = cashData.reduce((sum, c) => sum + c.commission, 0);
    const grandTotal = totalTournaments + totalCash;

    res.render('admin/reports/daily_commission', {
      username: req.session?.username,
      date: today,
      tournamentData,
      cashData,
      totalTournaments,
      totalCash,
      grandTotal
    });
  } catch (err) {
    console.error('Error loading daily commission report', err);
    res.status(500).send('Error al cargar reporte');
  }
});

export default router;
