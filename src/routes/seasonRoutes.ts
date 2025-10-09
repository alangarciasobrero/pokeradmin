import express, { Request, Response } from 'express';
import SeasonRepository from '../repositories/SeasonRepository';

const router = express.Router();

// Validación básica para seasons
function validateSeason(req: Request, res: Response, next: Function) {
  const { nombre, fecha_inicio, fecha_fin, estado } = req.body;
  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'nombre es requerido y debe ser string.' });
  }
  if (!fecha_inicio || isNaN(Date.parse(fecha_inicio))) {
    return res.status(400).json({ error: 'fecha_inicio es requerida y debe ser fecha válida.' });
  }
  if (!fecha_fin || isNaN(Date.parse(fecha_fin))) {
    return res.status(400).json({ error: 'fecha_fin es requerida y debe ser fecha válida.' });
  }
  if (!['planificada', 'activa', 'finalizada'].includes(estado)) {
    return res.status(400).json({ error: 'estado debe ser planificada, activa o finalizada.' });
  }
  next();
}

// Crear season
router.post('/', validateSeason, async (req: Request, res: Response) => {
  try {
    const season = await SeasonRepository.create(req.body);
    res.status(201).json(season);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear season', details: err });
  }
});

// Obtener todas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const seasons = await SeasonRepository.findAll();
    res.json(seasons);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener seasons', details: err });
  }
});

// Obtener por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const season = await SeasonRepository.findById(Number(req.params.id));
    if (!season) return res.status(404).json({ error: 'No encontrado' });
    res.json(season);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener season', details: err });
  }
});

// Actualizar por ID
router.put('/:id', validateSeason, async (req: Request, res: Response) => {
  try {
    const [updated, updatedRows] = await SeasonRepository.update(Number(req.params.id), req.body);
    if (updated === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(updatedRows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar season', details: err });
  }
});

// Eliminar por ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await SeasonRepository.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar season', details: err });
  }
});

export default router;
