// Rutas para la entidad Player
// Permiten realizar operaciones CRUD sobre jugadores
import { Router, Request, Response } from 'express';
import { PlayerRepository } from '../repositories/PlayerRepository';

const router = Router();
const playerRepo = new PlayerRepository();

/**
 * Valida los datos de un jugador
 * @param data - Objeto con los campos del jugador
 * @param parcial - Si es true, solo valida los campos presentes (para PUT)
 * @returns null si es válido, o un string con el error
 */
function validarPlayer(data: any, parcial = false): string | null {
  if (!parcial || data.first_name !== undefined) {
    if (!data.first_name || typeof data.first_name !== 'string') {
      return 'El nombre es obligatorio y debe ser texto';
    }
  }
  if (!parcial || data.last_name !== undefined) {
    if (!data.last_name || typeof data.last_name !== 'string') {
      return 'El apellido es obligatorio y debe ser texto';
    }
  }
  if (data.email && typeof data.email === 'string') {
    // Validación básica de email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(data.email)) {
      return 'El email no es válido';
    }
  }
  return null;
}

/**
 * GET /api/players
 * Devuelve la lista de todos los jugadores
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const players = await playerRepo.getAll();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener jugadores', details: error });
  }
});

/**
 * GET /api/players/:id
 * Devuelve un jugador por su ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const player = await playerRepo.getById(id);
    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener jugador', details: error });
  }
});

/**
 * POST /api/players
 * Crea un nuevo jugador
 */
router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const errorMsg = validarPlayer(data);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const player = await playerRepo.create(data);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el jugador', details: error });
  }
});

/**
 * PUT /api/players/:id
 * Actualiza los datos de un jugador existente
 */
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
  }
  const errorMsg = validarPlayer(data, true);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const [affectedRows, updatedPlayers] = await playerRepo.updateById(id, data);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(updatedPlayers[0]);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar el jugador', details: error });
  }
});

/**
 * DELETE /api/players/:id
 * Elimina (soft delete) un jugador por su ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const affectedRows = await playerRepo.deleteById(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Jugador no encontrado o ya eliminado' });
    }
    res.json({ message: 'Jugador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el jugador', details: error });
  }
});

/**
 * Exporta el router para ser usado en app.ts
 */
export default router;
