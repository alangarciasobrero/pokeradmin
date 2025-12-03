import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { User } from '../models/User';
import bonusService from '../services/bonusService';

const router = Router();

/**
 * GET /admin/bonus/attendance
 * Vista para ver asistencias y bonus potenciales de jugadores
 */
router.get('/attendance', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { Registration } = await import('../models/Registration');
    const { Tournament } = await import('../models/Tournament');
    const { Season } = await import('../models/Season');
    
    // Get active season
    const activeSeason = await Season.findOne({ 
      where: { is_active: true } as any,
      order: [['start_date', 'DESC']] 
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
            model: Tournament,
            as: 'tournament',
            where: { season_id: seasonId },
            required: true
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
          model: Tournament,
          as: 'tournament',
          where: { 
            start_date: { $gte: monthStart, $lte: monthEnd } as any
          },
          required: true
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
          model: Tournament,
          as: 'tournament',
          where: { 
            start_date: { $gte: lastMonday, $lte: lastSunday } as any
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

export default router;
