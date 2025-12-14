import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { Tournament } from '../models/Tournament';
import { Registration } from '../models/Registration';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { Result } from '../models/Result';
import { Season } from '../models/Season';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import sequelize from '../services/database';
import commissionService from '../services/commissionService';
import bonusService from '../services/bonusService';
import { Op } from 'sequelize';
import Setting from '../models/Setting';
import { HistoricalPoint } from '../models/HistoricalPoint';
import { getGamingDate, getCurrentGamingDate } from '../utils/gamingDate';

const router = Router();
const tournamentRepo = new TournamentRepository();

// Helper to load tournament points configuration from database
async function loadPointsConfig() {
  const settings = await Setting.findAll({
    where: {
      key: ['personal_buyin_points', 'personal_reentry_points', 'weekday_buyin_points', 'weekday_reentry_points', 'friday_buyin_points', 'friday_reentry_points']
    } as any
  });
  
  const config = {
    personalBuyin: 100,
    personalReentry: 100,
    weekdayBuyin: 150,
    weekdayReentry: 100,
    fridayBuyin: 200,
    fridayReentry: 100
  };
  
  for (const s of settings) {
    const key = (s as any).key;
    const val = Number((s as any).value) || 0;
    if (key === 'personal_buyin_points') config.personalBuyin = val;
    if (key === 'personal_reentry_points') config.personalReentry = val;
    if (key === 'weekday_buyin_points') config.weekdayBuyin = val;
    if (key === 'weekday_reentry_points') config.weekdayReentry = val;
    if (key === 'friday_buyin_points') config.fridayBuyin = val;
    if (key === 'friday_reentry_points') config.fridayReentry = val;
  }
  
  return config;
}

// Helper to load prize distribution configuration from database
async function loadPrizeDistributionConfig() {
  const settings = await Setting.findAll({
    where: {
      key: {
        [Op.like]: 'prize_position_%'
      }
    } as any
  });
  
  // Defaults: top 9 positions get prizes (23, 17, 14, 11, 9, 8, 7, 6, 5)
  const defaultPercentages = [23, 17, 14, 11, 9, 8, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const prizePercentages: number[] = [...defaultPercentages];
  
  for (const s of settings) {
    const key = (s as any).key;
    const match = key.match(/prize_position_(\d+)/);
    if (match) {
      const position = Number(match[1]);
      const percentage = Number((s as any).value) || 0;
      if (position >= 1 && position <= 20) {
        prizePercentages[position - 1] = percentage;
      }
    }
  }
  
  return prizePercentages;
}

// use central requireAdmin middleware imported above

// List admin view with pagination
router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(5, Number(req.query.per_page) || 20));
  const offset = (page - 1) * perPage;
  
  // Extraer todos los filtros
  const showClosed = req.query.show_closed === 'true';
  const dateFromStr = req.query.date_from as string;
  const dateToStr = req.query.date_to as string;
  const dayOfWeek = req.query.day_of_week as string;
  
  // Importar utilidades de fecha
  const { parseDateDMY, formatDateDMY } = await import('../utils/dateUtils');
  const buyInRange = req.query.buy_in_range as string;
  const seasonId = req.query.season_id as string;
  const status = req.query.status as string;
  const search = req.query.search as string;
  const doublePoints = req.query.double_points === 'true';
  const knockout = req.query.knockout === 'true';
  const countRanking = req.query.count_ranking === 'true';

  try {
    const { Op } = await import('sequelize');
    const whereClause: any = {};
    
    // Filtro por estado (status overrides show_closed)
    if (status === 'open') {
      whereClause.registration_open = true;
      whereClause.end_date = null;
    } else if (status === 'closed') {
      whereClause.registration_open = false;
      whereClause.end_date = null;
    } else if (status === 'finished') {
      whereClause.end_date = { [Op.ne]: null };
    } else if (!showClosed) {
      whereClause.registration_open = true;
    }
    
    // Filtro por búsqueda de nombre
    if (search && search.trim()) {
      whereClause.tournament_name = { [Op.like]: `%${search.trim()}%` };
    }
    
    // Filtro por rango de fechas (formato dd/mm/yyyy)
    if (dateFromStr || dateToStr) {
      whereClause.start_date = {};
      if (dateFromStr) {
        const dateFrom = parseDateDMY(dateFromStr);
        if (dateFrom) {
          whereClause.start_date[Op.gte] = dateFrom;
        }
      }
      if (dateToStr) {
        const dateTo = parseDateDMY(dateToStr);
        if (dateTo) {
          dateTo.setHours(23, 59, 59, 999);
          whereClause.start_date[Op.lte] = dateTo;
        }
      }
    }
    
    // Filtro por día de la semana (0=domingo, 1=lunes, ..., 6=sábado)
    if (dayOfWeek !== undefined && dayOfWeek !== '') {
      const dayNum = parseInt(dayOfWeek);
      whereClause[Op.and] = whereClause[Op.and] || [];
      whereClause[Op.and].push(
        (await import('sequelize')).where(
          (await import('sequelize')).fn('DAYOFWEEK', (await import('sequelize')).col('start_date')),
          dayNum + 1 // MySQL DAYOFWEEK: 1=domingo, 2=lunes, etc
        )
      );
    }
    
    // Filtro por rango de buy-in
    if (buyInRange) {
      if (buyInRange === '0-50') {
        whereClause.buy_in = { [Op.between]: [0, 50] };
      } else if (buyInRange === '50-100') {
        whereClause.buy_in = { [Op.between]: [50, 100] };
      } else if (buyInRange === '100-200') {
        whereClause.buy_in = { [Op.between]: [100, 200] };
      } else if (buyInRange === '200-500') {
        whereClause.buy_in = { [Op.between]: [200, 500] };
      } else if (buyInRange === '500+') {
        whereClause.buy_in = { [Op.gte]: 500 };
      }
    }
    
    // Filtro por temporada
    if (seasonId) {
      whereClause.season_id = parseInt(seasonId);
    }
    
    // Filtros por características especiales
    if (doublePoints) {
      whereClause.double_points = true;
    }
    if (knockout) {
      whereClause.knockout_bounty = { [Op.gt]: 0 };
    }
    if (countRanking) {
      whereClause.count_to_ranking = true;
    }
    
    // Obtener torneos y temporadas
    const [{ rows, count }, seasons] = await Promise.all([
      (await import('../models/Tournament')).Tournament.findAndCountAll({
        where: whereClause,
        limit: perPage,
        offset,
        order: [['start_date', 'DESC']]
      }),
      (await import('../models/Season')).Season.findAll({
        order: [['fecha_inicio', 'DESC']]
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));

    // Construir queryParams para paginación
    const queryParams = new URLSearchParams();
    queryParams.set('per_page', perPage.toString());
    if (showClosed) queryParams.set('show_closed', 'true');
    if (dateFromStr) queryParams.set('date_from', dateFromStr);
    if (dateToStr) queryParams.set('date_to', dateToStr);
    if (dayOfWeek) queryParams.set('day_of_week', dayOfWeek);
    if (buyInRange) queryParams.set('buy_in_range', buyInRange);
    if (seasonId) queryParams.set('season_id', seasonId);
    if (status) queryParams.set('status', status);
    if (search) queryParams.set('search', search);
    if (doublePoints) queryParams.set('double_points', 'true');
    if (knockout) queryParams.set('knockout', 'true');
    if (countRanking) queryParams.set('count_ranking', 'true');

    const links = {
      prev: page > 1 ? `/admin/games/tournaments/list?page=${page - 1}&${queryParams.toString()}` : null,
      next: page < totalPages ? `/admin/games/tournaments/list?page=${page + 1}&${queryParams.toString()}` : null
    };

    res.render('admin/tournaments_list', {
      tournaments: rows,
      seasons,
      username: req.session.username,
      meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages },
      links,
      showClosed,
      dateFrom: dateFromStr || '',
      dateTo: dateToStr || '',
      dayOfWeek: dayOfWeek || '',
      buyInRange: buyInRange || '',
      seasonId: seasonId || '',
      status: status || '',
      search: search || '',
      doublePoints,
      knockout,
      countRanking,
      queryString: queryParams.toString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar torneos');
  }
});

// New form (render admin form that POSTS back to this SSR route so we can redirect after create)
router.get('/new', requireAdmin, async (req: Request, res: Response) => {
  // Post to the admin POST handler so the browser receives a redirect instead of raw JSON
  const seasons = await Season.findAll({ order: [['fecha_inicio', 'DESC']] });
  
  // Load default values from settings
  const settings = await Setting.findAll({
    where: {
      key: ['default_buyin', 'default_reentry', 'default_bounty', 'default_blind_levels']
    } as any
  });
  
  const defaults: any = {};
  for (const s of settings) {
    const key = (s as any).key;
    const val = (s as any).value;
    defaults[key] = val;
  }
  
  res.render('tournaments/form', { 
    formTitle: 'Nuevo Torneo (Admin)', 
    formAction: '/admin/games/tournaments/new',
    seasons,
    tournament: {
      buy_in: defaults.default_buyin || 5000,
      re_entry: defaults.default_reentry || 5000,
      knockout_bounty: defaults.default_bounty || 500,
      blind_levels: defaults.default_blind_levels || '25/50'
    }
  });
});

// Backwards-compatible alias: some links use '/create'
router.get('/create', requireAdmin, (req: Request, res: Response) => {
  return res.redirect('/admin/games/tournaments/new');
});

/**
 * Normaliza los tipos recibidos desde un formulario HTML (strings) a los tipos esperados
 * por el repositorio/API: numbers, booleans y fechas.
 */
function normalizeTournamentInput(data: any) {
  if (!data || typeof data !== 'object') return data;
  const out: any = { ...data };
  const numFields = ['buy_in', 're_entry', 'knockout_bounty', 'starting_stack', 'blind_levels', 'small_blind', 'punctuality_discount', 'season_id'];
  const boolFields = ['count_to_ranking', 'double_points', 'pinned'];
  const dateFields = ['start_date'];

  for (const f of numFields) {
    if (out[f] !== undefined && out[f] !== null && out[f] !== '') {
      const n = Number(out[f]);
      out[f] = isNaN(n) ? out[f] : n;
    }
  }
  for (const f of boolFields) {
    if (out[f] !== undefined && out[f] !== null && out[f] !== '') {
      const v = out[f];
      out[f] = (v === true || v === 'true' || v === '1' || v === 1);
    }
  }
  // punctuality checkbox handling: if apply checkbox sent and false, zero the discount; if true and missing, default to 20
  if (out.punctuality_apply !== undefined) {
    const pa = (out.punctuality_apply === true || out.punctuality_apply === 'true' || out.punctuality_apply === '1' || out.punctuality_apply === 1);
    if (!pa) out.punctuality_discount = 0;
    else if (out.punctuality_discount === undefined || out.punctuality_discount === null || out.punctuality_discount === '') out.punctuality_discount = 20;
  }
  for (const f of dateFields) {
    if (out[f] !== undefined && out[f] !== null && out[f] !== '') {
      // Parse DD/MM/YYYY format (European/Argentine style)
      const dateStr = String(out[f]).trim();
      const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // months are 0-indexed
        const year = parseInt(match[3], 10);
        
        // If there's a start_time field, parse it and set the time
        let hours = 21; // Default hour for tournaments
        let minutes = 0;
        if (out.start_time) {
          const timeMatch = String(out.start_time).match(/^(\d{1,2}):(\d{2})$/);
          if (timeMatch) {
            hours = parseInt(timeMatch[1], 10);
            minutes = parseInt(timeMatch[2], 10);
          }
        }
        
        out[f] = new Date(year, month, day, hours, minutes);
      } else {
        // Fallback to default Date parsing
        const d = new Date(out[f]);
        out[f] = isNaN(d.getTime()) ? out[f] : d;
      }
    }
  }
  // season_id: convert empty string to null
  if (out.season_id === '') {
    out.season_id = null;
  }
  return out;
}

// Create (handled by API) - but support a form POST from SSR that forwards to API
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
  // Normalize form input coming as strings and then create
  const normalized = normalizeTournamentInput(req.body);
  
  // Calculate gaming_date from start_date
  if (normalized.start_date) {
    (normalized as any).gaming_date = getGamingDate(normalized.start_date);
  }
  
  await tournamentRepo.create(normalized as any);
    if (req.session) {
      req.session.flash = { type: 'success', message: 'Torneo creado correctamente' };
    }
    return res.redirect('/admin/games/tournaments/list');
  } catch (err) {
    console.error('Error creating tournament', err);
    return res.status(500).send('Error al crear torneo');
  }
});

// Detail / edit uses existing web detail but admin can access
router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const tournament = await tournamentRepo.getById(id);
    if (!tournament) return res.status(404).send('No encontrado');
    // load registrations and users for the inline registration form
    const registrations = await Registration.findAll({ where: { tournament_id: id }, order: [['registration_date','ASC']] });
    const users = await User.findAll({ where: { is_deleted: false }, order: [['username','ASC']] });
    res.render('tournaments/detail', { tournament, registrations, users, username: req.session.username, isAdmin: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Backwards-compatible alias: some UI links point to /:id/registrations
// Redirect to the tournament detail page which includes registrations inline.
router.get('/:id/registrations', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  return res.redirect(`/admin/games/tournaments/${id}`);
});

// Admin: register a user into a tournament from the tournament detail page
router.post('/:id/register', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body || {};
  try {
    const tournament = await tournamentRepo.getById(id);
    if (!tournament) return res.status(404).send('Torneo no encontrado');

    // handle inline user creation
    let userId = data.user_id ? Number(data.user_id) : null;
    if ((!userId || isNaN(userId)) && data.new_user_username) {
      // create a minimal user record
      const existing = await User.findOne({ where: { username: data.new_user_username } });
      if (existing) userId = existing.id;
      else {
        const nu = await User.create({ username: data.new_user_username, password_hash: 'imported', full_name: data.new_user_full_name || null, is_player: true });
        userId = nu.id;
      }
    }
    if (!userId) {
      if (req.session) req.session.flash = { type: 'error', message: 'Debes seleccionar o crear un usuario' };
      return res.redirect(`/admin/games/tournaments/${id}`);
    }

  const amountPaid = data.amount_paid !== undefined && data.amount_paid !== null && data.amount_paid !== '' ? Number(data.amount_paid) : 0;
  const method = data.method || null;
  const personalAccount = data.personal_account === 'on' || data.personal_account === 'true' || data.personal_account === true;

    // compute punctuality: registration at server time compared with tournament.start_date
    const now = new Date();
    const start = new Date(tournament.start_date as any);
    const punctuality = now <= start;

  // determine action type (1=buyin,2=reentry,3=duplo)
  const at = Number(data.action_type || 1);
  const action_type = isNaN(at) ? 1 : at;

  // create registration (persist action_type)
  const registration = await Registration.create({ user_id: userId, tournament_id: id, registration_date: now, punctuality, action_type });

  // expected amount calculation depends on action_type
  // Buy-in (1) and Re-entry (2): buy_in with punctuality discount
  // Duplo (3): buy_in × 1.6 (80% de 2× buy_in = 20% descuento sobre doble caja)
  const pct = Number(tournament.punctuality_discount || 0);
  const baseBuyIn = Number(tournament.buy_in || 0);
  let expectedAmount = baseBuyIn * (1 - (pct / 100));
  
  if (action_type === 3) {
    // Duplo: buy_in × 2 × 0.8 = buy_in × 1.6
    expectedAmount = baseBuyIn * 1.6;
  }

  // create payment record linking to registration
  // Support partial payments and debtors: paid = true only if amountPaid >= expectedAmount and amountPaid > 0
  const paidFlag = (amountPaid > 0 && amountPaid >= expectedAmount);
  const methodWithActor = req.session && req.session.username ? (method ? `${method}|by:${req.session.username}:${req.session.userId}` : `manual|by:${req.session.username}:${req.session.userId}`) : (method || null);
  const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
  await Payment.create({ user_id: userId, amount: expectedAmount, payment_date: now, source: 'tournament', reference_id: registration.id, paid: paidFlag, paid_amount: amountPaid, method: methodWithActor, personal_account: personalAccount, recorded_by_name: recordedByName });

    // audit: log action_type for this registration
    try {
      const fs = await import('fs');
      const logPath = 'logs/registration_actions.log';
      const entry = { time: new Date().toISOString(), registrationId: (registration as any).id, userId: userId, tournamentId: id, actionType: action_type };
      try { fs.mkdirSync('logs', { recursive: true }); } catch (_) {}
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
    } catch (e) {
      console.error('Failed to write registration action log', e);
    }

    if (req.session) req.session.flash = { type: 'success', message: 'Inscripción realizada correctamente' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (err) {
    console.error('Error registering user in tournament', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al registrar jugador' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// POST /admin/games/tournaments/:id/close-registrations - close further registrations
router.post('/:id/close-registrations', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await Tournament.findByPk(id);
    if (!t) return res.status(404).send('No encontrado');
    (t as any).registration_open = false;
    await t.save();
    if (req.session) req.session.flash = { type: 'success', message: 'Inscripciones cerradas' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (e) {
    console.error('Error closing registrations', e);
    if (req.session) req.session.flash = { type: 'error', message: 'Error cerrando inscripciones' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// POST /admin/games/tournaments/:id/open-registrations - reopen registrations
router.post('/:id/open-registrations', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await Tournament.findByPk(id);
    if (!t) return res.status(404).send('No encontrado');
    (t as any).registration_open = true;
    await t.save();
    if (req.session) req.session.flash = { type: 'success', message: 'Inscripciones reabiertas' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (e) {
    console.error('Error opening registrations', e);
    if (req.session) req.session.flash = { type: 'error', message: 'Error abriendo inscripciones' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// POST /admin/games/tournaments/:id/close-tournament - mark tournament as closed (set end_date)
router.post('/:id/close-tournament', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await Tournament.findByPk(id);
    if (!t) return res.status(404).send('No encontrado');
    (t as any).end_date = new Date();
    await t.save();
    if (req.session) req.session.flash = { type: 'success', message: 'Torneo marcado como cerrado' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (e) {
    console.error('Error closing tournament', e);
    if (req.session) req.session.flash = { type: 'error', message: 'Error cerrando torneo' };
    return res.redirect(`/admin/games/tournaments/${id}`);
  }
});

// GET preview for closing: compute pot, commission suggestion and default prizes
router.get('/:id/preview-close', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const t = await tournamentRepo.getById(id);
    if (!t) return res.status(404).json({ error: 'No encontrado' });

    // load registrations for tournament
    const regs = await Registration.findAll({ where: { tournament_id: id } });
    const regIds = regs.map(r => r.id);

    // sum expected money for this tournament: consider all amounts regardless of payment status
    // because even if a player is "fiado" (credit), the organizer absorbs that cost
    const payments = await Payment.findAll({ where: { reference_id: { [Op.in]: regIds } } });
    let pot = 0;
    const perUser: Record<number, { paid: number; expected: number }> = {};
    for (const r of regs) perUser[(r as any).user_id] = { paid: 0, expected: 0 };
    for (const p of payments) {
      const pid = Number((p as any).user_id);
      const amount = Number((p as any).amount || 0);
      const paid = Number((p as any).paid_amount || 0) || (Number((p as any).amount || 0) * ((p as any).paid ? 1 : 0));
      
      // Add expected amount to pot (regardless of payment status)
      if (!isNaN(amount) && amount > 0) {
        pot += amount;
        if (perUser[pid]) perUser[pid].expected += amount;
      }
      
      // Track what was actually paid
      if (!isNaN(paid) && paid > 0) {
        if (perUser[pid]) perUser[pid].paid += paid;
      }
    }

    // Función para redondear sin decimales
    const round = (n: number) => Math.round(n);
    
    // default commission 20% total: 18% casa + 1% temporada + 1% anual (editable)
    const commissionPct = 20;
    const commissionHousePct = 18;
    const commissionSeasonPct = 1;
    const commissionAnnualPct = 1;
    
    // Redondear todos los valores
    const commissionAmount = round(pot * (commissionPct / 100));
    let commissionSeason = round(pot * (commissionSeasonPct / 100));
    let commissionAnnual = round(pot * (commissionAnnualPct / 100));
    
    // Calcular casa y ajustar con diferencia de redondeo
    let commissionHouse = commissionAmount - commissionSeason - commissionAnnual;
    
    const prizePool = pot - commissionAmount;

    // Load prize distribution percentages from database
    const prizePercentages = await loadPrizeDistributionConfig();
    
    // Generate prizes for all registered players (up to top 20)
    // Even if they didn't pay ("fiado"), they played and can win
    const totalPlayers = regs.length;
    const defaultPrizes: Array<{ position: number; amount: number; percentage: number }> = [];
    
    // Generate prizes for top 20 or total players, whichever is less
    const prizesCount = Math.min(20, totalPlayers);
    let totalPrizesRounded = 0;
    for (let i = 0; i < prizesCount; i++) {
      const position = i + 1;
      const percentage = prizePercentages[i] || 0;
      const amount = round(prizePool * (percentage / 100));
      defaultPrizes.push({ position, amount, percentage });
      totalPrizesRounded += amount;
    }
    
    // Ajustar último premio con diferencia de redondeo
    if (defaultPrizes.length > 0) {
      const diff = prizePool - totalPrizesRounded;
      defaultPrizes[0].amount = round(defaultPrizes[0].amount + diff); // Dar diferencia al 1er puesto y redondear
    }

    // Ranking points distribution for final table (top 9)
    const rankingPointsPercentages = [
      { position: 1, percentage: 23 },
      { position: 2, percentage: 17 },
      { position: 3, percentage: 14 },
      { position: 4, percentage: 11 },
      { position: 5, percentage: 9 },
      { position: 6, percentage: 8 },
      { position: 7, percentage: 7 },
      { position: 8, percentage: 6 },
      { position: 9, percentage: 5 }
    ];

    // Calculate total ranking points for tournament pool
    const tournamentDate = new Date((t as any).start_date);
    
    // Count buy-ins and re-entries
    const buyinCount = regs.filter(r => (r as any).action_type === 1 || !(r as any).action_type).length;
    const reentryCount = regs.filter(r => (r as any).action_type === 2).length;
    
    // Load points configuration from database
    const pointsConfig = await loadPointsConfig();
    
    // Calculate tournament points pool (to distribute among top 9)
    const poolPoints = bonusService.calculateTournamentPointsPool(
      tournamentDate,
      buyinCount,
      reentryCount,
      (t as any).double_points || false,
      {
        weekdayBuyin: pointsConfig.weekdayBuyin,
        weekdayReentry: pointsConfig.weekdayReentry,
        fridayBuyin: pointsConfig.fridayBuyin,
        fridayReentry: pointsConfig.fridayReentry
      }
    );
    
    // Calculate points per position for final table
    const rankingPointsDistribution = rankingPointsPercentages.map(rp => ({
      position: rp.position,
      percentage: rp.percentage,
      points: Math.round(poolPoints * (rp.percentage / 100))
    }));

    // participant summary
    const users = await User.findAll({ where: { id: regs.map(r => (r as any).user_id) } as any });
    const umap: any = {};
    users.forEach(u => umap[(u as any).id] = u);

    const participants = regs.map(r => {
      const uid = (r as any).user_id;
      const user = umap[uid];
      return { 
        registration_id: (r as any).id, 
        user_id: uid, 
        username: user ? user.username : ('#'+uid),
        full_name: user ? (user as any).full_name : null,
        paid: perUser[uid] ? perUser[uid].paid : 0, 
        expected: perUser[uid] ? perUser[uid].expected : 0,
        position: (r as any).position || null,
        registration_date: (r as any).registration_date || null
      };
    });

    return res.json({ 
      pot, 
      commissionPct, 
      commissionHousePct,
      commissionSeasonPct,
      commissionAnnualPct,
      commissionAmount,
      commissionHouse,
      commissionSeason,
      commissionAnnual,
      prizePool, 
      defaultPrizes, 
      participants,
      totalBoxes: buyinCount + reentryCount,
      boxPoints: poolPoints,
      rankingPointsDistribution
    });
  } catch (e) {
    console.error('Error preview-close', e);
    return res.status(500).json({ error: 'Error computing preview' });
  }
});

// GET participants JSON with enriched per-registration financials for admin UI
router.get('/:id/participants-json', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const regs = await Registration.findAll({ where: { tournament_id: id }, order: [['registration_date','ASC']] });
    const regIds = regs.map(r => (r as any).id);

    // fetch payments linked to these registrations
    const payments = await Payment.findAll({ where: { reference_id: regIds } as any, order: [['payment_date','ASC']] });

    // aggregate per registration
    const perReg: Record<number, any> = {};
    for (const r of regs) {
      perReg[(r as any).id] = { paid: 0, expected: 0, lastMethod: null, personal_account: false };
    }
    for (const p of payments) {
      const rid = Number((p as any).reference_id);
      if (!perReg[rid]) continue;
      const paid = Number((p as any).paid_amount || 0) || (Number((p as any).amount || 0) * ((p as any).paid ? 1 : 0));
      if (!isNaN(paid) && paid !== 0) perReg[rid].paid += paid;
      const amt = Number((p as any).amount || 0);
      if (!isNaN(amt) && amt !== 0) perReg[rid].expected += amt;
      if ((p as any).method) perReg[rid].lastMethod = (p as any).method;
      if ((p as any).personal_account) perReg[rid].personal_account = true;
    }

    // load users
    const userIds = regs.map(r => (r as any).user_id);
    const users = await User.findAll({ where: { id: userIds } as any });
    const umap: Record<number, any> = {};
    users.forEach(u => { umap[(u as any).id] = u; });

    const participants = regs.map(r => {
      const rid = (r as any).id;
      const uid = (r as any).user_id;
      const u = umap[uid];
      const agg = perReg[rid] || { paid: 0, expected: 0, lastMethod: null, personal_account: false };
      const debt = +(agg.expected - agg.paid);
      // Al pozo va todo el expected (buy-in/re-entry), sin importar si pagó o no. El fiado lo asume la casa.
      const amountToPot = +(agg.expected || 0);
      // Si no pagó completamente, el método es "Fiado"
      const isPaid = agg.paid >= agg.expected;
      const effectiveMethod = isPaid ? agg.lastMethod : 'fiado';
      // compute action label from numeric action_type when available; fall back to legacy is_reentry flag
      const actionTypeNum = (r as any).action_type ? Number((r as any).action_type) : ((r as any).is_reentry ? 2 : 1);
      const actionLabel = actionTypeNum === 2 ? 'Re-entry' : (actionTypeNum === 3 ? 'Duplo' : 'Buy-in');

      return {
        registration_id: rid,
        user_id: uid,
        username: u ? u.username : ('#'+uid),
        full_name: u ? u.full_name : null,
        action: actionLabel,
        punctuality: !!(r as any).punctuality,
        registration_date: (r as any).registration_date,
        paid: +agg.paid,
        expected: +agg.expected,
        debt: +debt,
        lastMethod: effectiveMethod,
        personal_account: !!agg.personal_account,
        position: (r as any).position || null,
        amount_contributed_to_pot: +amountToPot
      };
    });

    return res.json({ participants });
  } catch (e) {
    console.error('Error participants-json', e);
    return res.status(500).json({ error: 'Error computing participants' });
  }
});

// DELETE /:tournamentId/registrations/:registrationId - delete registration and its payments
router.delete('/:tournamentId/registrations/:registrationId', requireAdmin, async (req: Request, res: Response) => {
  const registrationId = Number(req.params.registrationId);
  try {
    // Delete associated payments first (foreign key constraint)
    await Payment.destroy({ where: { reference_id: registrationId, source: 'tournament' } as any });
    
    // Delete registration
    const deleted = await Registration.destroy({ where: { id: registrationId } as any });
    
    if (deleted === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    
    return res.json({ success: true, message: 'Inscripción eliminada' });
  } catch (e) {
    console.error('Error deleting registration', e);
    return res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});

// POST confirm-close: accept commission/prizes/positions, create payouts and finalize
router.post('/:id/confirm-close', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { commissionPct, prizes, positions } = req.body as any;
    const t = await tournamentRepo.getById(id);
    if (!t) return res.status(404).json({ error: 'No encontrado' });

    // recompute pot same as preview
    const regs = await Registration.findAll({ where: { tournament_id: id } });
    const regIds = regs.map(r => r.id);
    const payments = await Payment.findAll({ where: { reference_id: regIds } as any });
    let pot = 0;
    const perRegPaid: Record<number, number> = {};
    for (const r of regs) perRegPaid[(r as any).id] = 0;
    for (const p of payments) {
      const paid = Number((p as any).paid_amount || 0) || (Number((p as any).amount || 0) * ((p as any).paid ? 1 : 0));
      if (!isNaN(paid) && paid > 0) {
        pot += paid;
        if ((p as any).reference_id && perRegPaid[(p as any).reference_id] !== undefined) perRegPaid[(p as any).reference_id] += paid;
      }
    }

    const cPct = Number(commissionPct) || 0;
    const commissionAmount = +(pot * (cPct / 100));
    const prizePool = +(pot - commissionAmount);

    // validate total prizes do not exceed prizePool
    const totalPrizes = (prizes || []).reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
    // allow tiny floating point slack
    if (totalPrizes > prizePool + 0.0001) {
      return res.status(400).json({ error: 'Total premios excede pozo disponible', totalPrizes, prizePool });
    }

    // record commission as a Payment row (assign to acting admin if known)
    let commissionUserId: number | null = null;
    if (req.session && req.session.userId) commissionUserId = Number(req.session.userId);
    else {
      // try to find any admin user
      const adminUser = await User.findOne({ where: { role: 'admin' } as any });
      if (adminUser) commissionUserId = (adminUser as any).id;
    }
    // fallback to first registration user if still missing
    if (!commissionUserId && regs.length > 0) commissionUserId = (regs[0] as any).user_id;

    if (commissionAmount > 0 && commissionUserId) {
      await Payment.create({ user_id: commissionUserId, amount: +commissionAmount, payment_date: new Date(), source: 'commission', reference_id: id, paid: true, paid_amount: commissionAmount, method: 'commission', personal_account: false, recorded_by_name: req.session ? req.session.username : null });
      
      // Distribuir comisión a los pozos según configuración
      try {
        await commissionService.distributeCommission(pot, new Date((t as any).start_date));
        console.log(`[adminTournament] Commission distributed successfully for tournament ${id}`);
      } catch (err) {
        console.error('[adminTournament] Error distributing commission to pools:', err);
        // Continuar aunque falle la distribución a pozos
      }
    }

    // prizes expected: array of {position, user_id, amount}
    // create payouts (negative amounts) for each prize entry
    for (const pr of prizes || []) {
      const userId = Number(pr.user_id);
      const amount = Number(pr.amount) || 0;
      if (!userId || amount <= 0) continue;
      // create payout payment as negative amount
      await Payment.create({ user_id: userId, amount: -Math.abs(amount), payment_date: new Date(), source: 'tournament_payout', reference_id: null, paid: true, paid_amount: Math.abs(amount), method: 'payout', personal_account: false, recorded_by_name: req.session ? req.session.username : null });
    }

    // ✨ NUEVO: Guardar posiciones en tabla Result
    if (positions && Array.isArray(positions)) {
      try {
        // Create Result records for each position
        for (const pos of positions) {
          const userId = Number(pos.user_id);
          const position = Number(pos.position);
          if (!userId || !position) continue;

          // Determine if final table (positions 1-9)
          const finalTable = position <= 9;
          
          // Find prize amount for this user
          const userPrize = (prizes || []).find((p: any) => Number(p.user_id) === userId);
          const prizeAmount = userPrize ? Number(userPrize.amount) : 0;

          // Create or update Result record (points will be distributed separately)
          await Result.create({
            tournament_id: id,
            user_id: userId,
            position: position,
            points: 0, // Points distributed via HistoricalPoint
            final_table: finalTable,
            prize_amount: prizeAmount,
            bounty_count: 0 // TODO: collect bounties if applicable
          } as any);
        }
      } catch (err) {
        console.error('[adminTournament] Error creating Result records:', err);
      }
    }

    // finalize tournament: set registration_open false and end_date
    const tt = await Tournament.findByPk(id);
    if (tt) {
      (tt as any).registration_open = false;
      (tt as any).end_date = new Date();
      await tt.save();
    }

    // ✨ Distribuir comisión a pozos automáticamente
    try {
      const tournamentDate = new Date((t as any).start_date);
      await commissionService.distributeCommission(pot, tournamentDate);
    } catch (err) {
      console.error('[adminTournament] Error distributing commission:', err);
      // No fallar el cierre si la distribución falla
    }

    // Load points configuration from database
    const pointsConfig = await loadPointsConfig();

    // ✨ Distribuir puntos personales (configurables)
    try {
      for (const reg of regs) {
        const userId = Number((reg as any).user_id);
        const actionType = (reg as any).action_type;
        
        // Puntos por presencia (buy-in)
        if (actionType === 1 || !actionType) {
          await HistoricalPoint.create({
            record_date: new Date(),
            user_id: userId,
            season_id: 1,
            tournament_id: id,
            result_id: null,
            action_type: 'attendance',
            description: `Puntos por presencia (buy-in): ${pointsConfig.personalBuyin}`,
            points: pointsConfig.personalBuyin,
          } as any);
        }
        
        // Puntos por re-entry
        if (actionType === 2) {
          await HistoricalPoint.create({
            record_date: new Date(),
            user_id: userId,
            season_id: 1,
            tournament_id: id,
            result_id: null,
            action_type: 'reentry',
            description: `Puntos por re-entry: ${pointsConfig.personalReentry}`,
            points: pointsConfig.personalReentry,
          } as any);
        }
      }
    } catch (err) {
      console.error('[adminTournament] Error distributing personal points:', err);
    }

    // ✨ Calcular y distribuir pozo de puntos a mesa final
    try {
      const tournamentDate = new Date((t as any).start_date);
      
      // Count buy-ins and re-entries
      const buyinCount = regs.filter(r => (r as any).action_type === 1 || !(r as any).action_type).length;
      const reentryCount = regs.filter(r => (r as any).action_type === 2).length;
      
      // Calculate tournament points pool
      const poolPoints = bonusService.calculateTournamentPointsPool(
        tournamentDate,
        buyinCount,
        reentryCount,
        (t as any).double_points || false,
        {
          weekdayBuyin: pointsConfig.weekdayBuyin,
          weekdayReentry: pointsConfig.weekdayReentry,
          fridayBuyin: pointsConfig.fridayBuyin,
          fridayReentry: pointsConfig.fridayReentry
        }
      );
      
      // Obtener usuarios de mesa final desde los Results recién creados
      const results = await Result.findAll({ 
        where: { tournament_id: id, final_table: true } as any,
        order: [['position', 'ASC']]
      });
      const finalTableUserIds = results.map(r => Number((r as any).user_id));
      
      if (finalTableUserIds.length > 0) {
        await bonusService.distributeBoxPointsToFinalTable(id, poolPoints, finalTableUserIds);
      }
    } catch (err) {
      console.error('[adminTournament] Error distributing box points:', err);
    }

    return res.json({ ok: true, pot, commissionAmount, prizePool });
  } catch (e) {
    console.error('Error confirm-close', e);
    return res.status(500).json({ error: 'Error finalizing tournament' });
  }
});

// POST positions: accept array positions: [{ registration_id, user_id, position }]
router.post('/:id/positions', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { positions } = req.body as any;
    if (!Array.isArray(positions)) return res.status(400).json({ error: 'positions array required' });
    // update each registration
    for (const p of positions) {
      const rid = Number(p.registration_id) || null;
      const pos = p.position !== undefined ? Number(p.position) : null;
      if (!rid) continue;
      const reg = await Registration.findByPk(rid);
      if (!reg) continue;
      (reg as any).position = pos;
      await reg.save();
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error('Error saving positions', e);
    return res.status(500).json({ error: 'Error' });
  }
});

// Update via SSR form (forward to API PUT)
router.post('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
  const normalized = normalizeTournamentInput(req.body);
  
  // Recalculate gaming_date if start_date changed
  if (normalized.start_date) {
    (normalized as any).gaming_date = getGamingDate(normalized.start_date);
  }
  
  const [affectedRows] = await tournamentRepo.updateById(id, normalized as any);
    if (affectedRows === 0) return res.status(404).send('No encontrado');
    return res.redirect(`/admin/games/tournaments/${id}`);
  } catch (err) {
    console.error('Error updating tournament', err);
    return res.status(500).send('Error al actualizar torneo');
  }
});

// Delete via SSR (forward to repo delete if available)
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await tournamentRepo.deleteById(id);
    return res.redirect('/admin/games/tournaments/list');
  } catch (err) {
    console.error('Error deleting tournament', err);
    return res.status(500).send('Error al eliminar torneo');
  }
});

export default router;
