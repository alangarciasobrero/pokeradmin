import express, { Request, Response } from 'express';
import CashGameRepository from '../repositories/CashGameRepository';

const router = express.Router();

// Validación básica para cash_games
function validateCashGame(req: Request, res: Response, next: Function) {
  // Aceptar legacy `player_id` y normalizar a `user_id`
  if (req.body.player_id && !req.body.user_id) {
    req.body.user_id = req.body.player_id;
  }
  const { user_id, amount, date } = req.body;
  if (!user_id || typeof user_id !== 'number') {
    return res.status(400).json({ error: 'user_id es requerido y debe ser numérico.' });
  }
  if (amount === undefined || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'amount es requerido y debe ser numérico.' });
  }
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'date es requerido y debe ser una fecha válida.' });
  }
  next();
}

// Crear cash game
router.post('/', validateCashGame, async (req: Request, res: Response) => {
  try {
    const cashGame = await CashGameRepository.create(req.body);
    res.status(201).json(cashGame);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear cash game', details: err });
  }
});

// Obtener todos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cashGames = await CashGameRepository.findAll();
    res.json(cashGames);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cash games', details: err });
  }
});

// Obtener por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cashGame = await CashGameRepository.findById(Number(req.params.id));
    if (!cashGame) return res.status(404).json({ error: 'No encontrado' });
    res.json(cashGame);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cash game', details: err });
  }
});

// Actualizar por ID
router.put('/:id', validateCashGame, async (req: Request, res: Response) => {
  try {
    const [updated, updatedRows] = await CashGameRepository.update(Number(req.params.id), req.body);
    if (updated === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(updatedRows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cash game', details: err });
  }
});

// Eliminar por ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await CashGameRepository.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cash game', details: err });
  }
});

export default router;
