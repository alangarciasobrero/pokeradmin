import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import Payment from '../models/Payment';
import { Tournament } from '../models/Tournament';
import { CashGame } from '../models/CashGame';
import User from '../models/User';
import { Op } from 'sequelize';
import CommissionDestination from '../models/CommissionDestination';
import CommissionConfig from '../models/CommissionConfig';

const router = Router();

// Reporte de comisión diaria
router.get('/daily-commission', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Obtener destinos activos con sus configuraciones de porcentaje
    const destinations = await CommissionDestination.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']]
    });

    // Crear mapa de destinos con sus porcentajes
    const destinationsMap = new Map();
    for (const dest of destinations) {
      const config = await CommissionConfig.findOne({ where: { destination_id: dest.id } });
      destinationsMap.set(dest.id, {
        id: dest.id,
        name: dest.name,
        type: dest.type,
        percentage: config ? Number(config.percentage) : 0
      });
    }
    
    // Usar gaming_date en lugar de payment_date para consistencia con el dashboard
    const { getCurrentGamingDate, getGamingDate } = await import('../utils/gamingDate');
    // Permitir filtrar por fecha específica
    const dateParam = req.query.date as string;
    const currentGamingDate = dateParam || getCurrentGamingDate();

    // Buscar torneos del gaming_date actual
    const tournaments = await Tournament.findAll({ 
      where: { gaming_date: currentGamingDate } 
    });
    const tournamentIds = tournaments.map((t: any) => t.id);
    const tournamentsMap = new Map(tournaments.map((t: any) => [t.id, t]));

    // Buscar mesas cash del gaming_date actual
    const cashGames = await CashGame.findAll({ 
      where: { gaming_date: currentGamingDate } 
    });
    const cashGameIds = cashGames.map((cg: any) => cg.id);
    const cashGamesMap = new Map(cashGames.map((cg: any) => [cg.id, cg]));

    // Comisiones de torneos
    const tournamentCommissions = await Payment.findAll({
      where: {
        source: 'commission',
        reference_id: { [Op.in]: tournamentIds }
      },
      order: [['payment_date', 'DESC']]
    });

    // Comisiones de mesas cash
    const cashCommissions = await Payment.findAll({
      where: {
        source: 'cash_commission',
        reference_id: { [Op.in]: cashGameIds }
      },
      order: [['payment_date', 'DESC']]
    });



    // Procesar datos de torneos con desglose dinámico
    const tournamentData = tournamentCommissions.map((p: any) => {
      const tournament = tournamentsMap.get(p.reference_id);
      const commissionTotal = Number(p.amount || 0);
      
      // Calcular desglose para cada destino configurado
      const breakdown: any = {};
      let totalAssigned = 0;
      
      destinationsMap.forEach((dest, destId) => {
        const amount = Math.round(commissionTotal * (dest.percentage / 100));
        breakdown[`dest_${destId}`] = amount;
        totalAssigned += amount;
      });
      
      return {
        id: tournament?.id || p.reference_id,
        name: tournament?.name || `Torneo #${p.reference_id}`,
        buy_in: tournament?.buy_in || 0,
        start_time: tournament?.start_datetime,
        commission: commissionTotal,
        breakdown,
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

    // Calcular desglose sumando los desgloses individuales
    const breakdown: any = {};
    destinationsMap.forEach((dest, destId) => {
      breakdown[`dest_${destId}`] = tournamentData.reduce((sum, t) => sum + (t.breakdown[`dest_${destId}`] || 0), 0);
    });

    // Convertir destinos a array para la vista
    const destinationsArray = Array.from(destinationsMap.values());

    res.render('admin/reports/daily_commission', {
      username: req.session?.username,
      date: currentGamingDate,
      tournamentData,
      cashData,
      totalTournaments,
      totalCash,
      grandTotal,
      breakdown,
      destinations: destinationsArray
    });
  } catch (err) {
    console.error('Error loading daily commission report', err);
    res.status(500).send('Error al cargar reporte');
  }
});

export default router;
