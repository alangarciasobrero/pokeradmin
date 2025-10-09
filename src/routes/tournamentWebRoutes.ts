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

// Formulario para crear un nuevo torneo (SSR)
router.get('/new', (req: Request, res: Response) => {
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

export default router;