import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import Payment from '../models/Payment';
import { Tournament } from '../models/Tournament';
import { CashGame } from '../models/CashGame';
import User from '../models/User';
import { Op } from 'sequelize';
import CommissionDestination from '../models/CommissionDestination';
import CommissionConfig from '../models/CommissionConfig';
import { Season } from '../models/Season';
import Setting from '../models/Setting';
import CommissionPool from '../models/CommissionPool';
import { Registration } from '../models/Registration';
import { AccumulatedCommission } from '../models/AccumulatedCommission';

const router = Router();

// Reporte de comisión diaria
router.get('/daily-commission', requireAdmin, async (req: Request, res: Response) => {
  console.log('=== ROUTE HIT: /admin/reports/daily-commission ===');
  try {
    // Obtener la tasa total de comisión configurada
    const commissionRateSetting = await Setting.findOne({ where: { key: 'commission_total_pct' } });
    const totalCommissionRate = commissionRateSetting ? Number((commissionRateSetting as any).value) : 20;
    console.log('[Commission Report] Total commission rate:', totalCommissionRate);
    
    // Obtener destinos activos con sus configuraciones de porcentaje
    const destinations = await CommissionDestination.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']]
    });
    console.log('[Commission Report] Found destinations:', destinations.length);

    // Crear mapa de destinos con sus porcentajes y info adicional
    const destinationsMap = new Map();
    for (const dest of destinations) {
      const config = await CommissionConfig.findOne({ where: { destination_id: dest.id } });
      
      // Obtener info de temporada si aplica
      let seasonName = null;
      if (dest.season_id) {
        const season = await Season.findByPk(dest.season_id);
        seasonName = season ? (season as any).nombre : null;
      }
      
      // Obtener info de torneo si aplica
      let tournamentName = null;
      if (dest.tournament_id) {
        const tournament = await Tournament.findByPk(dest.tournament_id);
        tournamentName = tournament ? (tournament as any).tournament_name : null;
      }
      
      destinationsMap.set(dest.id, {
        id: dest.id,
        name: dest.name,
        type: dest.type,
        percentage: config ? Number(config.percentage) : 0,
        seasonName,
        tournamentName
      });
      console.log(`[Commission Report]   Destination: ${dest.name}, Type: ${dest.type}, Percentage: ${config ? config.percentage : 0}%`);
    }
    
    // Usar gaming_date en lugar de payment_date para consistencia con el dashboard
    const { getCurrentGamingDate, getGamingDate } = await import('../utils/gamingDate');
    // Permitir filtrar por fecha específica
    const dateParam = req.query.date as string;
    const currentGamingDate = dateParam || getCurrentGamingDate();
    console.log('[Commission Report] Gaming date:', currentGamingDate);

    // Buscar torneos del gaming_date actual
    const tournaments = await Tournament.findAll({ 
      where: { gaming_date: currentGamingDate } 
    });
    const tournamentIds = tournaments.map((t: any) => t.id);
    const tournamentsMap = new Map(tournaments.map((t: any) => [t.id, t]));
    console.log('[Commission Report] Tournaments found:', tournaments.length, '- IDs:', tournamentIds);

    // Buscar mesas cash del gaming_date actual
    const cashGames = await CashGame.findAll({ 
      where: { gaming_date: currentGamingDate } 
    });
    const cashGameIds = cashGames.map((cg: any) => cg.id);
    const cashGamesMap = new Map(cashGames.map((cg: any) => [cg.id, cg]));
    console.log('[Commission Report] Cash games found:', cashGames.length, '- IDs:', cashGameIds);

    // Comisiones de torneos
    const tournamentCommissions = await Payment.findAll({
      where: {
        source: 'commission',
        reference_id: { [Op.in]: tournamentIds }
      },
      order: [['payment_date', 'DESC']]
    });
    
    console.log(`[Commission Report] Tournament commissions found: ${tournamentCommissions.length}`);
    tournamentCommissions.forEach((p: any) => {
      console.log(`[Commission Report]   Payment ID: ${p.id}, Amount: ${p.amount}, Ref: ${p.reference_id}`);
    });

    // Comisiones de mesas cash
    const cashCommissions = await Payment.findAll({
      where: {
        source: 'cash_commission',
        reference_id: { [Op.in]: cashGameIds }
      },
      order: [['payment_date', 'DESC']]
    });
    console.log(`[Commission Report] Cash commissions found: ${cashCommissions.length}`);



    // Crear array ordenado de destinos (con % > 0) para usar en encabezados
    const orderedDestinations = Array.from(destinationsMap.values())
      .filter(dest => dest.percentage > 0)
      .map(dest => ({
        id: dest.id,
        name: dest.name,
        type: dest.type,
        percentage: dest.percentage,
        // Convertir porcentaje del pozo a porcentaje de la comisión
        commissionPercentage: (dest.percentage / totalCommissionRate) * 100,
        displayName: dest.seasonName || dest.tournamentName || dest.name
      }));
    
    console.log(`[Commission Report] Found ${orderedDestinations.length} destinations:`, orderedDestinations.map(d => `${d.name} (${d.percentage}%)`));

    // Procesar datos de torneos con desglose dinámico
    const tournamentData = await Promise.all(tournamentCommissions.map(async (p: any) => {
      const tournament = tournamentsMap.get(p.reference_id);
      const commissionTotal = Number(p.amount || 0);
      
      // Obtener el pozo real: primero las registrations, luego sus pagos
      const registrations = await Registration.findAll({
        where: { tournament_id: p.reference_id }
      });
      const regIds = registrations.map(r => r.id);
      
      const tournamentPayments = await Payment.findAll({
        where: {
          source: 'tournament',
          reference_id: { [Op.in]: regIds }
        }
      });
      const pot = tournamentPayments.reduce((sum, payment) => sum + Number((payment as any).amount || 0), 0);
      
      console.log(`[Commission Report] Tournament ${p.reference_id}: pot=${pot}, commission=${commissionTotal}`);
      
      // Función para redondear al múltiplo de 5 más cercano (misma lógica que preview-close)
      const round = (n: number) => Math.round(n / 5) * 5;
      
      // Calcular desglose con la misma lógica que usa preview-close
      const breakdown: any = {};
      const destinationValues: any[] = [];
      
      // Calcular comisión total redondeada
      const totalCommissionRate = orderedDestinations.reduce((sum, d) => sum + d.percentage, 0);
      const roundedCommissionTotal = round(pot * (totalCommissionRate / 100));
      
      // Calcular cada destino redondeado al múltiplo de 5
      let calculatedAmounts: { dest: any; amount: number }[] = [];
      orderedDestinations.forEach((dest) => {
        const amount = round(pot * (dest.percentage / 100));
        calculatedAmounts.push({ dest, amount });
      });
      
      // Ajustar el primer destino (Casa) para que la suma coincida exactamente con el total
      const sumCalculated = calculatedAmounts.reduce((sum, item) => sum + item.amount, 0);
      if (calculatedAmounts.length > 0) {
        calculatedAmounts[0].amount += (roundedCommissionTotal - sumCalculated);
      }
      
      // Construir breakdown y destinationValues
      calculatedAmounts.forEach(({ dest, amount }) => {
        console.log(`[Commission Report]   ${dest.name}: ${amount} (rounded to nearest 5)`);
        breakdown[`dest_${dest.id}`] = amount;
        destinationValues.push({
          id: dest.id,
          amount: amount,
          name: dest.displayName
        });
      });
      
      return {
        id: tournament?.id || p.reference_id,
        name: tournament?.tournament_name || `Torneo #${p.reference_id}`,
        buy_in: tournament?.buy_in || 0,
        start_time: tournament?.start_date,
        commission: commissionTotal,
        breakdown,
        destinationValues,
        payment_date: p.payment_date
      };
    }));

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
    orderedDestinations.forEach((dest) => {
      breakdown[`dest_${dest.id}`] = tournamentData.reduce((sum, t) => sum + (t.breakdown[`dest_${dest.id}`] || 0), 0);
    });

    // Agregar totales a los destinos ordenados para el footer
    const destinationsWithTotals = orderedDestinations.map(dest => ({
      ...dest,
      total: breakdown[`dest_${dest.id}`]
    }));
    
    // Para el desglose superior, filtrar solo los que tienen valor > 0
    const destinationsWithValue = destinationsWithTotals.filter(dest => dest.total > 0).map(dest => ({
      ...dest,
      value: dest.total
    }));

    console.log('[Commission Report] Totals - Tournaments:', totalTournaments, 'Cash:', totalCash, 'Grand Total:', grandTotal);
    console.log('[Commission Report] Destinations with value:', destinationsWithValue.length);
    console.log('[Commission Report] Rendering view with data...');

    res.render('admin/reports/daily_commission', {
      username: req.session?.username,
      date: currentGamingDate,
      tournamentData,
      cashData,
      totalTournaments,
      totalCash,
      grandTotal,
      breakdown,
      destinations: destinationsWithValue,
      allDestinations: destinationsWithTotals
    });
    console.log('[Commission Report] View rendered successfully');
  } catch (err) {
    console.error('[Commission Report] Error loading daily commission report:', err);
    console.error('[Commission Report] Stack trace:', (err as Error).stack);
    res.status(500).send('Error al cargar reporte');
  }
});

export default router;
