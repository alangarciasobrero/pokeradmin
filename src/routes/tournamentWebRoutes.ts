import { Router, Request, Response } from 'express';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { requireAdmin, requireAuth } from '../middleware/requireAuth';

const router = Router();
const tournamentRepo = new TournamentRepository();

// Lista de torneos (SSR)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const tournaments = await tournamentRepo.getAll();
    res.render('tournaments/list', { 
      tournaments,
      username: req.session!.username 
    });
  } catch (error) {
    res.status(500).send('Error al obtener torneos');
  }
});

// Próximos torneos (vista pública mejorada)
router.get('/upcoming', requireAuth, async (req: Request, res: Response) => {
  try {
    const { Tournament } = await import('../models/Tournament');
    const { Op } = await import('sequelize');
    const now = new Date();
    
    // Obtener torneos pinned y regulares por separado
    const pinnedTournaments = await Tournament.findAll({
      where: {
        pinned: true,
        start_date: { [Op.gte]: now }
      },
      order: [['start_date', 'ASC']]
    });

    const regularTournaments = await Tournament.findAll({
      where: {
        pinned: false,
        start_date: { [Op.gte]: now }
      },
      order: [['start_date', 'ASC']]
    });

    res.render('tournaments/upcoming', {
      pinnedTournaments: pinnedTournaments.map((t: any) => t.get({ plain: true })),
      tournaments: regularTournaments.map((t: any) => t.get({ plain: true })),
      username: req.session!.username
    });
  } catch (error) {
    console.error('Error loading upcoming tournaments:', error);
    res.status(500).send('Error al cargar próximos torneos');
  }
});

// use central requireAdmin middleware imported above

router.get('/new', requireAdmin, (req: Request, res: Response) => {
  res.render('tournaments/form', {
    formTitle: 'Nuevo Torneo',
    formAction: '/tournaments',
    tournament: {}
  });
});

// Detalle de torneo (SSR)
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).send('ID inválido');
  }
  try {
    const tournament = await tournamentRepo.getById(id);
    if (!tournament) {
      return res.status(404).send('Torneo no encontrado');
    }
    const isAdmin = req.session?.role === 'admin';
    const referer = req.get('referer') || '/dashboard';
    res.render('tournaments/detail', { 
      tournament,
      isAdmin,
      backUrl: referer
    });
  } catch (error) {
    res.status(500).send('Error al obtener el torneo');
  }
});

// Create tournament from SSR form submission (forward to repository and redirect)
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Normalize common fields from form (strings) to expected types
    const data: any = { ...req.body };
    const numFields = ['buy_in', 're_entry', 'knockout_bounty', 'starting_stack', 'blind_levels', 'small_blind', 'punctuality_discount'];
    const boolFields = ['count_to_ranking', 'double_points'];
    const dateFields = ['start_date'];

    for (const f of numFields) {
      if (data[f] !== undefined && data[f] !== null && data[f] !== '') {
        const n = Number(data[f]);
        data[f] = isNaN(n) ? data[f] : n;
      }
    }
    for (const f of boolFields) {
      if (data[f] !== undefined && data[f] !== null && data[f] !== '') {
        const v = data[f];
        data[f] = (v === true || v === 'true' || v === '1' || v === 1);
      }
    }
    for (const f of dateFields) {
      if (data[f] !== undefined && data[f] !== null && data[f] !== '') {
        // Parse DD/MM/YYYY format (European/Argentine style)
        const dateStr = String(data[f]).trim();
        const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (match) {
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10) - 1; // months are 0-indexed
          const year = parseInt(match[3], 10);
          
          // If there's a start_time field, parse it and set the time
          let hours = 21; // Default hour for tournaments
          let minutes = 0;
          if (data.start_time) {
            const timeMatch = String(data.start_time).match(/^(\d{1,2}):(\d{2})$/);
            if (timeMatch) {
              hours = parseInt(timeMatch[1], 10);
              minutes = parseInt(timeMatch[2], 10);
            }
          }
          
          data[f] = new Date(year, month, day, hours, minutes);
        } else {
          // Fallback to default Date parsing
          const d = new Date(data[f]);
          data[f] = isNaN(d.getTime()) ? data[f] : d;
        }
      }
    }

    await tournamentRepo.create(data as any);
    // set flash message in session
    if (req.session) {
      req.session.flash = { type: 'success', message: 'Torneo creado correctamente' };
    }
    return res.redirect('/tournaments');
  } catch (error) {
    console.error('Error creating tournament (web POST)', error);
    return res.status(500).send('Error al crear torneo');
  }
});

export default router;