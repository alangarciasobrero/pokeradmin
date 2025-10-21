import { Router, Request, Response } from 'express';
import { TournamentRepository } from '../repositories/TournamentRepository';

const router = Router();
const tournamentRepo = new TournamentRepository();

// Lista de torneos (SSR)
router.get('/', async (req: Request, res: Response) => {
  try {
    const tournaments = await tournamentRepo.getAll();
    res.render('tournaments/list', { tournaments });
  } catch (error) {
    res.status(500).send('Error al obtener torneos');
  }
});

// Formulario para crear un nuevo torneo (SSR) - sólo admins
function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

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
    res.render('tournaments/detail', { tournament });
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
        const d = new Date(data[f]);
        data[f] = isNaN(d.getTime()) ? data[f] : d;
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