import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { requireAdmin } from '../middleware/requireAuth';
import { User } from '../models/User';
import { Registration } from '../models/Registration';
import { Tournament } from '../models/Tournament';
import { Season } from '../models/Season';
import bonusService from '../services/bonusService';

const router = Router();

/**
 * GET /admin/bonus/attendance
 * Vista para ver asistencias y bonus potenciales de jugadores
 */
router.get('/attendance', requireAdmin, async (req: Request, res: Response) => {
  try {
    
    // Get active season
    const activeSeason = await Season.findOne({ 
      where: { estado: 'activa' } as any,
      order: [['fecha_inicio', 'DESC']] 
    });
    
    const seasonId = activeSeason ? (activeSeason as any).id : null;
    
    // Get all players (users)
    const users = await User.findAll({ 
      where: { role: 'user' } as any,
      order: [['full_name', 'ASC']]
    });
    
    // Calculate attendance for each user
    const attendanceData = [];
    
    for (const user of users) {
      const userId = (user as any).id;
      const username = (user as any).username;
      const fullName = (user as any).full_name;
      
      // Count total registrations (all tournaments)
      const totalCount = await Registration.count({
        where: { user_id: userId }
      });
      
      // Count season registrations if season exists
      let seasonCount = 0;
      if (seasonId) {
        seasonCount = await Registration.count({
          include: [{
            model: Tournament.unscoped(),
            as: 'tournament',
            where: { season_id: seasonId },
            required: true,
            attributes: []
          }],
          where: { user_id: userId }
        });
      }
      
      // Current month attendance
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      const monthCount = await Registration.count({
        include: [{
          model: Tournament.unscoped(),
          as: 'tournament',
          where: { 
            start_date: { [Op.gte]: monthStart, [Op.lte]: monthEnd }
          },
          required: true,
          attributes: []
        }],
        where: { user_id: userId }
      });
      
      // Last week attendance
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysToLastMonday = (dayOfWeek + 6) % 7;
      const lastMonday = new Date(today);
      lastMonday.setDate(today.getDate() - daysToLastMonday - 7);
      lastMonday.setHours(0, 0, 0, 0);
      
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);
      lastSunday.setHours(23, 59, 59, 999);
      
      const weekCount = await Registration.count({
        include: [{
          model: Tournament.unscoped(),
          as: 'tournament',
          where: { 
            start_date: { [Op.gte]: lastMonday, [Op.lte]: lastSunday }
          },
          required: true
        }],
        where: { user_id: userId }
      });
      
      // Determine bonus eligibility
      const bonuses = [];
      if (weekCount >= 3) bonuses.push('🥉 Bronce');
      if (monthCount >= 10) bonuses.push('🥈 Plata');
      if (seasonCount >= 28) bonuses.push('🥇 Oro');
      if (seasonCount >= 32) bonuses.push('💎 Diamante');
      
      attendanceData.push({
        username,
        fullName,
        totalCount,
        seasonCount,
        monthCount,
        weekCount,
        bonuses: bonuses.join(', ') || '-'
      });
    }
    
    res.render('admin/bonus/attendance', {
      username: req.session.username,
      attendanceData,
      activeSeason
    });
  } catch (err) {
    console.error('Error loading attendance data:', err);
    res.status(500).send('Error cargando datos de asistencia');
  }
});

/**
 * GET /admin/bonus/calculate
 * Vista para calcular bonus masivamente
 */
router.get('/calculate', requireAdmin, async (req: Request, res: Response) => {
  res.render('admin/bonus/calculate', {
    username: req.session.username,
  });
});

/**
 * POST /admin/bonus/calculate
 * Ejecutar cálculo de bonus masivamente
 */
router.post('/calculate', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { season_start, season_end, season_id } = req.body;
    
    const seasonStart = new Date(season_start || '2025-09-01');
    const seasonEnd = new Date(season_end || '2025-12-31');
    const seasonId = Number(season_id) || 1;

    const users = await User.findAll({ where: { role: 'user' } as any });

    let bronzeCount = 0;
    let silverCount = 0;
    let goldCount = 0;
    let diamondCount = 0;
    let blackCount = 0;

    for (const user of users) {
      const userId = (user as any).id;

      // Bonus Oro (28+ jornadas de 35)
      if (await bonusService.checkAndAwardGoldBonus(userId, seasonStart, seasonEnd, seasonId)) {
        goldCount++;
      }

      // Bonus Diamante (32+ jornadas de 35)
      if (await bonusService.checkAndAwardDiamondBonus(userId, seasonStart, seasonEnd, seasonId)) {
        diamondCount++;
      }

      // Bonus Black (16+ mesas finales)
      if (await bonusService.checkAndAwardBlackBonus(userId, seasonStart, seasonEnd, seasonId)) {
        blackCount++;
      }

      // Bonus Plata (10+ jornadas en el mes actual)
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      if (await bonusService.checkAndAwardSilverBonus(userId, year, month)) {
        silverCount++;
      }

      // Bonus Bronce (3 jornadas en última semana)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysToLastMonday = (dayOfWeek + 6) % 7;
      const lastMonday = new Date(today);
      lastMonday.setDate(today.getDate() - daysToLastMonday - 7);
      lastMonday.setHours(0, 0, 0, 0);
      
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);
      lastSunday.setHours(23, 59, 59, 999);

      if (await bonusService.checkAndAwardBronzeBonus(userId, lastMonday, lastSunday)) {
        bronzeCount++;
      }
    }

    res.render('admin/bonus/calculate', {
      username: req.session.username,
      success: true,
      results: {
        bronze: bronzeCount,
        silver: silverCount,
        gold: goldCount,
        diamond: diamondCount,
        black: blackCount,
        total: users.length,
      },
    });
  } catch (err) {
    console.error('Error calculating bonuses:', err);
    res.status(500).send('Error calculando bonus');
  }
});

/**
 * GET /admin/bonus/attendance-calendar
 * Vista de calendario mensual con asistencia de jugadores
 */
router.get('/attendance-calendar', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { Registration } = await import('../models/Registration');
    const { Tournament } = await import('../models/Tournament');
    const sequelize = (await import('../services/database')).default;
    
    // Get month and year from query params (default to current)
    const now = new Date();
    const year = parseInt(req.query.year as string) || now.getFullYear();
    const month = parseInt(req.query.month as string) || now.getMonth() + 1; // 1-12
    
    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month
    
    // Get all players
    const users = await User.findAll({ 
      where: { is_player: true } as any,
      order: [['username', 'ASC']]
    });
    
    // Get all registrations for the month with tournament dates
    const registrations = await sequelize.query(`
      SELECT 
        r.user_id,
        u.username,
        u.full_name,
        DATE(t.start_date) as tournament_date,
        t.tournament_name,
        t.id as tournament_id,
        t.buy_in
      FROM registrations r
      JOIN tournaments t ON r.tournament_id = t.id
      JOIN users u ON r.user_id = u.id
      WHERE DATE(t.start_date) >= :startDate 
        AND DATE(t.start_date) <= :endDate
        AND u.is_player = 1
      ORDER BY t.start_date ASC, u.username ASC
    `, {
      replacements: { 
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      type: (sequelize as any).QueryTypes.SELECT
    });
    
    // Build calendar data structure
    const daysInMonth = endDate.getDate();
    const firstDayOfWeek = startDate.getDay(); // 0 = Sunday
    
    // Group registrations by date and user
    const attendanceByDate: any = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      attendanceByDate[dateKey] = {};
    }
    
    (registrations as any[]).forEach((reg: any) => {
      const dateKey = reg.tournament_date.split('T')[0]; // Get date part only
      if (!attendanceByDate[dateKey]) {
        // Skip registrations outside the current month
        return;
      }
      if (!attendanceByDate[dateKey][reg.user_id]) {
        attendanceByDate[dateKey][reg.user_id] = {
          username: reg.username,
          full_name: reg.full_name,
          tournaments: []
        };
      }
      attendanceByDate[dateKey][reg.user_id].tournaments.push({
        name: reg.tournament_name,
        id: reg.tournament_id,
        buy_in: reg.buy_in
      });
    });
    
    // Calculate stats
    const totalTournaments = await Tournament.count({
      where: {
        start_date: { [Op.gte]: startDate, [Op.lte]: endDate }
      }
    });
    
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    
    res.render('admin/bonus/attendance_calendar', {
      username: req.session.username,
      users: users.map((u: any) => ({
        id: u.id,
        username: u.username,
        full_name: u.full_name
      })),
      attendanceByDate,
      year,
      month,
      monthName: monthNames[month - 1],
      daysInMonth,
      firstDayOfWeek,
      totalTournaments,
      prevMonth,
      prevYear,
      nextMonth,
      nextYear,
      currentMonth: now.getMonth() + 1,
      currentYear: now.getFullYear()
    });
  } catch (err) {
    console.error('Error loading attendance calendar:', err);
    res.status(500).send('Error cargando calendario de asistencias');
  }
});

export default router;

