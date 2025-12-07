import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../middleware/requireAuth';
import Setting from '../models/Setting';
import CommissionPool from '../models/CommissionPool';

const router = Router();

// use central requireAdmin middleware imported above

const POINTS_FILE = path.join(process.cwd(), 'points_table.json');
const PRIZE_FILE = path.join(process.cwd(), 'prize_override.json');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');

function safeReadFile(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return '';
  }
}

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  // Load current settings from points_table.json
  const pointsRaw = safeReadFile(POINTS_FILE) || '{}';
  let pointsData: Record<string, number> = {};
  try {
    pointsData = JSON.parse(pointsRaw);
  } catch (e) {
    pointsData = {};
  }

  // Load commission settings
  const settings = await Setting.findAll({
    where: {
      key: [
        'commission_total_pct', 'commission_min', 'commission_max', 
        'default_buyin', 'default_reentry', 'default_bounty', 'default_blind_levels', 
        'language',
        'personal_buyin_points', 'personal_reentry_points',
        'weekday_buyin_points', 'weekday_reentry_points',
        'friday_buyin_points', 'friday_reentry_points'
      ]
    } as any
  });

  const config: Record<string, any> = {
    commission_rate: 20,
    commission_min: 0,
    commission_max: 0,
    default_buyin: 5000,
    default_reentry: 5000,
    default_bounty: 500,
    default_blind_levels: '25/50',
    language: 'es',
    personal_buyin_points: 100,
    personal_reentry_points: 100,
    weekday_buyin_points: 150,
    weekday_reentry_points: 100,
    friday_buyin_points: 200,
    friday_reentry_points: 100
  };

  for (const s of settings) {
    const key = (s as any).key;
    const val = (s as any).value;
    config[key] = key.startsWith('commission') || key.startsWith('default') ? (Number(val) || config[key]) : val;
  }

  res.render('admin/settings_improved', {
    username: req.session.username,
    pointsData,
    config,
    flash: req.session.flash
  });
  
  if (req.session.flash) delete req.session.flash;
});

/**
 * POST /admin/games/settings/points
 * Actualizar distribución de puntos
 */
router.post('/points', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos9 } = req.body;
    
    const pointsObj: Record<string, number> = {
      '1': Number(pos1) || 23,
      '2': Number(pos2) || 17,
      '3': Number(pos3) || 14,
      '4': Number(pos4) || 11,
      '5': Number(pos5) || 9,
      '6': Number(pos6) || 8,
      '7': Number(pos7) || 7,
      '8': Number(pos8) || 6,
      '9': Number(pos9) || 5,
    };

    // Validate total is 100%
    const total = Object.values(pointsObj).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) {
      if (req.session) req.session.flash = { type: 'error', message: `La suma debe ser 100%. Actual: ${total}%` };
      return res.redirect('/admin/games/settings');
    }

    // ensure backup dir exists
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');

    if (fs.existsSync(POINTS_FILE)) {
      fs.copyFileSync(POINTS_FILE, path.join(BACKUP_DIR, `points_table.json.${ts}.bak`));
    }

    fs.writeFileSync(POINTS_FILE, JSON.stringify(pointsObj, null, 2), 'utf8');

    if (req.session) req.session.flash = { type: 'success', message: '✅ Distribución de puntos actualizada' };
    return res.redirect('/admin/games/settings');
  } catch (err: any) {
    console.error('Error saving points:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al guardar: ' + (err?.message || String(err)) };
    return res.redirect('/admin/games/settings');
  }
});

/**
 * POST /admin/games/settings/general
 * Actualizar configuración general (defaults)
 */
router.post('/general', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { default_buyin, default_reentry, default_bounty, default_blind_levels } = req.body;

    const updates = [
      { key: 'default_buyin', value: String(default_buyin || 5000), description: 'Buy-in predeterminado' },
      { key: 'default_reentry', value: String(default_reentry || 5000), description: 'Re-entry predeterminado' },
      { key: 'default_bounty', value: String(default_bounty || 500), description: 'Bounty predeterminado' },
      { key: 'default_blind_levels', value: String(default_blind_levels || '25/50'), description: 'Niveles de ciegas predeterminados' },
    ];

    for (const u of updates) {
      const [setting, created] = await Setting.findOrCreate({
        where: { key: u.key } as any,
        defaults: { key: u.key, value: u.value, description: u.description } as any,
      });
      if (!created) {
        await Setting.update({ value: u.value }, { where: { key: u.key } as any });
      }
    }

    if (req.session) req.session.flash = { type: 'success', message: '✅ Configuración general actualizada' };
    return res.redirect('/admin/games/settings');
  } catch (err: any) {
    console.error('Error saving general config:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al guardar: ' + (err?.message || String(err)) };
    return res.redirect('/admin/games/settings');
  }
});

/**
 * POST /admin/games/settings/tournament-points
 * Actualizar configuración de puntos del torneo
 */
router.post('/tournament-points', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { 
      personal_buyin, 
      personal_reentry, 
      weekday_buyin, 
      weekday_reentry, 
      friday_buyin, 
      friday_reentry 
    } = req.body;

    const updates = [
      { key: 'personal_buyin_points', value: String(personal_buyin || 100), description: 'Puntos personales por buy-in' },
      { key: 'personal_reentry_points', value: String(personal_reentry || 100), description: 'Puntos personales por re-entry' },
      { key: 'weekday_buyin_points', value: String(weekday_buyin || 150), description: 'Puntos al pozo por buy-in (L/M)' },
      { key: 'weekday_reentry_points', value: String(weekday_reentry || 100), description: 'Puntos al pozo por re-entry (L/M)' },
      { key: 'friday_buyin_points', value: String(friday_buyin || 200), description: 'Puntos al pozo por buy-in (Viernes)' },
      { key: 'friday_reentry_points', value: String(friday_reentry || 100), description: 'Puntos al pozo por re-entry (Viernes)' },
    ];

    for (const u of updates) {
      const [setting, created] = await Setting.findOrCreate({
        where: { key: u.key } as any,
        defaults: { key: u.key, value: u.value, description: u.description } as any,
      });
      if (!created) {
        await Setting.update({ value: u.value }, { where: { key: u.key } as any });
      }
    }

    if (req.session) req.session.flash = { type: 'success', message: '✅ Sistema de puntos actualizado correctamente' };
    return res.redirect('/admin/games/settings');
  } catch (err: any) {
    console.error('Error saving tournament points config:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al guardar: ' + (err?.message || String(err)) };
    return res.redirect('/admin/games/settings');
  }
});

/**
 * POST /admin/games/settings/language
 * Cambiar idioma de la aplicación
 */
router.post('/language', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { language } = req.body;
    
    if (!['es', 'en', 'pt'].includes(language)) {
      if (req.session) req.session.flash = { type: 'error', message: 'Idioma inválido' };
      return res.redirect('/admin/games/settings');
    }

    const [setting, created] = await Setting.findOrCreate({
      where: { key: 'language' } as any,
      defaults: { key: 'language', value: language, description: 'Idioma de la aplicación' } as any,
    });
    
    if (!created) {
      await Setting.update({ value: language }, { where: { key: 'language' } as any });
    }

    if (req.session) req.session.flash = { type: 'success', message: '✅ Idioma actualizado' };
    return res.redirect('/admin/games/settings');
  } catch (err: any) {
    console.error('Error saving language:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al guardar: ' + (err?.message || String(err)) };
    return res.redirect('/admin/games/settings');
  }
});

/**
 * GET /admin/games/settings/commissions
 * Vista para configurar porcentajes de comisión y destinos (nuevo sistema)
 */
router.get('/commissions', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { CommissionDestination } = await import('../models/CommissionDestination');
    const { CommissionConfig } = await import('../models/CommissionConfig');
    const { AccumulatedCommission } = await import('../models/AccumulatedCommission');
    const { Season } = await import('../models/Season');
    const { Tournament } = await import('../models/Tournament');
    
    // Get all active destinations (sin includes para evitar errores de asociación)
    const destinations = await CommissionDestination.findAll({
      where: { is_active: true } as any,
      order: [['created_at', 'ASC']]
    });
    
    // Load configs, totals, and related data for each destination
    const destinationsData = [];
    let totalPercentage = 0;
    
    for (const dest of destinations) {
      const destId = (dest as any).id;
      const seasonId = (dest as any).season_id;
      const tournamentId = (dest as any).tournament_id;
      
      const config = await CommissionConfig.findOne({ where: { destination_id: destId } });
      const percentage = config ? Number((config as any).percentage) : 0;
      totalPercentage += percentage;
      
      const accumulated = await AccumulatedCommission.sum('amount', {
        where: { destination_id: destId }
      }) || 0;
      
      // Load related season/tournament if needed
      let season = null;
      let tournament = null;
      
      if (seasonId) {
        season = await Season.findByPk(seasonId);
      }
      
      if (tournamentId) {
        tournament = await Tournament.findByPk(tournamentId);
      }
      
      destinationsData.push({
        id: destId,
        name: (dest as any).name,
        type: (dest as any).type,
        percentage,
        accumulated: Number(accumulated).toFixed(0),
        season: season ? { id: (season as any).id, nombre: (season as any).nombre } : null,
        tournament: tournament ? { id: (tournament as any).id, name: (tournament as any).tournament_name } : null
      });
    }
    
    // Get all seasons and recent tournaments for the form
    const seasons = await Season.findAll({
      order: [['fecha_inicio', 'DESC']],
      limit: 10
    });
    
    const tournaments = await Tournament.findAll({
      order: [['start_date', 'DESC']],
      limit: 30
    });

    res.render('admin/settings/commissions', {
      username: req.session.username,
      destinations: destinationsData,
      totalPercentage: totalPercentage.toFixed(2),
      seasons,
      tournaments
    });
  } catch (err) {
    console.error('Error loading commission settings:', err);
    res.status(500).send('Error cargando configuración de comisiones: ' + (err as Error).message);
  }
});

/**
 * POST /admin/games/settings/commissions/destination
 * Crear nuevo destino de comisión
 */
router.post('/commissions/destination', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { CommissionDestination } = await import('../models/CommissionDestination');
    const { name, type, season_id, tournament_id } = req.body;
    
    await CommissionDestination.create({
      name,
      type,
      season_id: season_id || null,
      tournament_id: tournament_id || null,
      is_active: true
    } as any);
    
    if (req.session) req.session.flash = { type: 'success', message: '✅ Destino creado' };
    res.redirect('/admin/games/settings/commissions');
  } catch (err) {
    console.error('Error creating destination:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error creando destino' };
    res.redirect('/admin/games/settings/commissions');
  }
});

/**
 * POST /admin/games/settings/commissions/config
 * Actualizar porcentaje de un destino
 */
router.post('/commissions/config', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { CommissionConfig } = await import('../models/CommissionConfig');
    const { CommissionDestination } = await import('../models/CommissionDestination');
    const { destination_id, percentage } = req.body;
    
    const pct = Number(percentage);
    if (pct < 0 || pct > 100) {
      if (req.session) req.session.flash = { type: 'error', message: 'Porcentaje debe estar entre 0 y 100' };
      return res.redirect('/admin/games/settings/commissions');
    }
    
    // Check total doesn't exceed 100%
    const allDestinations = await CommissionDestination.findAll({ where: { is_active: true } as any });
    let total = 0;
    for (const dest of allDestinations) {
      const destId = (dest as any).id;
      if (destId === Number(destination_id)) {
        total += pct;
      } else {
        const config = await CommissionConfig.findOne({ where: { destination_id: destId } });
        if (config) total += Number((config as any).percentage);
      }
    }
    
    if (total > 100) {
      if (req.session) req.session.flash = { type: 'error', message: `Total de porcentajes (${total}%) excede 100%` };
      return res.redirect('/admin/games/settings/commissions');
    }
    
    // Update or create config
    const [config, created] = await CommissionConfig.findOrCreate({
      where: { destination_id } as any,
      defaults: { destination_id, percentage: pct } as any
    });
    
    if (!created) {
      await CommissionConfig.update({ percentage: pct }, { where: { destination_id } as any });
    }
    
    if (req.session) req.session.flash = { type: 'success', message: '✅ Porcentaje actualizado' };
    res.redirect('/admin/games/settings/commissions');
  } catch (err) {
    console.error('Error updating config:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error actualizando porcentaje' };
    res.redirect('/admin/games/settings/commissions');
  }
});

/**
 * POST /admin/games/settings/commissions/destination/:id/delete
 * Desactivar un destino
 */
router.post('/commissions/destination/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { CommissionDestination } = await import('../models/CommissionDestination');
    await CommissionDestination.update(
      { is_active: false },
      { where: { id: req.params.id } as any }
    );
    
    if (req.session) req.session.flash = { type: 'success', message: '✅ Destino desactivado' };
    res.redirect('/admin/games/settings/commissions');
  } catch (err) {
    console.error('Error deleting destination:', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error desactivando destino' };
    res.redirect('/admin/games/settings/commissions');
  }
});

/**
 * GET /admin/games/settings/pools
 * Vista para ver acumulados de pozos usando nuevo sistema
 */
router.get('/pools', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { CommissionDestination } = await import('../models/CommissionDestination');
    const { AccumulatedCommission } = await import('../models/AccumulatedCommission');
    const { CommissionConfig } = await import('../models/CommissionConfig');
    const { Season } = await import('../models/Season');
    const { Tournament } = await import('../models/Tournament');
    
    // Get all active destinations
    const destinations = await CommissionDestination.findAll({
      where: { is_active: true } as any,
      include: [
        { model: Season, as: 'season', required: false },
        { model: Tournament, as: 'tournament', required: false }
      ],
      order: [['created_at', 'ASC']]
    });
    
    // Calculate accumulated total for each destination
    const poolsData = [];
    
    for (const dest of destinations) {
      const destId = (dest as any).id;
      const name = (dest as any).name;
      const type = (dest as any).type;
      const season = (dest as any).season;
      const tournament = (dest as any).tournament;
      
      // Get config percentage
      const config = await CommissionConfig.findOne({
        where: { destination_id: destId }
      });
      
      const percentage = config ? Number((config as any).percentage) : 0;
      
      // Sum accumulated amounts
      const accumulated = await AccumulatedCommission.sum('amount', {
        where: { destination_id: destId }
      }) || 0;
      
      // Get count of contributing tournaments
      const count = await AccumulatedCommission.count({
        where: { destination_id: destId },
        distinct: true,
        col: 'tournament_id'
      });
      
      poolsData.push({
        id: destId,
        name,
        type,
        percentage,
        accumulated: Number(accumulated).toFixed(0),
        contributingTournaments: count,
        seasonName: season ? season.name : null,
        tournamentName: tournament ? tournament.name : null
      });
    }
    
    // Group by type for summary
    const summary: Record<string, number> = {
      house: 0,
      season_ranking: 0,
      special_tournament: 0
    };
    
    poolsData.forEach((pool: any) => {
      if (summary[pool.type] !== undefined) {
        summary[pool.type] += Number(pool.accumulated);
      }
    });

    res.render('admin/settings/pools', {
      username: req.session.username,
      poolsData,
      summary,
    });
  } catch (err) {
    console.error('Error loading pools:', err);
    res.status(500).send('Error cargando pozos');
  }
});

/**
 * POST /admin/games/settings/pools/:id/close
 * Cerrar un pozo (cambiar status a 'closed')
 */
router.post('/pools/:id/close', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CommissionPool.update(
      { status: 'closed', closed_at: new Date() } as any,
      { where: { id } as any }
    );
    res.redirect('/admin/games/settings/pools?success=closed');
  } catch (err) {
    console.error('Error closing pool:', err);
    res.status(500).send('Error cerrando pozo');
  }
});

/**
 * POST /admin/games/settings/pools/:id/pay
 * Marcar un pozo como pagado (cambiar status a 'paid')
 */
router.post('/pools/:id/pay', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const notes = req.body.notes || '';
    await CommissionPool.update(
      { status: 'paid', paid_at: new Date(), notes } as any,
      { where: { id } as any }
    );
    res.redirect('/admin/games/settings/pools?success=paid');
  } catch (err) {
    console.error('Error marking pool as paid:', err);
    res.status(500).send('Error marcando pozo como pagado');
  }
});

export default router;
