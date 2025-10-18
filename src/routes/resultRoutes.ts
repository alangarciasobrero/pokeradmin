// Rutas para la entidad Result
// Permiten realizar operaciones CRUD sobre resultados de torneos
import { Router, Request, Response } from 'express';
import { ResultRepository } from '../repositories/ResultRepository';

const router = Router();
const resultRepo = new ResultRepository();

/**
 * Valida los datos de un resultado
 * @param data - Objeto con los campos del resultado
 * @param parcial - Si es true, solo valida los campos presentes (para PUT)
 * @returns null si es válido, o un string con el error
 */
function validarResult(data: any, parcial = false): string | null {
  if (!parcial || data.tournament_id !== undefined) {
    if (!data.tournament_id || isNaN(Number(data.tournament_id)) || Number(data.tournament_id) <= 0) {
      return 'tournament_id es obligatorio y debe ser un número válido';
    }
  }
  // Soportar legacy `player_id` y normalizar a `user_id`
  if (!parcial || data.player_id !== undefined || data.user_id !== undefined) {
    const uid = data.user_id ?? data.player_id;
    if (!uid || isNaN(Number(uid)) || Number(uid) <= 0) {
      return 'user_id (o player_id legacy) es obligatorio y debe ser un número válido';
    }
  }
  if (!parcial || data.position !== undefined) {
    if (data.position == null || isNaN(Number(data.position)) || Number(data.position) <= 0) {
      return 'position es obligatorio y debe ser un número válido';
    }
  }
  if (data.final_table !== undefined && typeof data.final_table !== 'boolean') {
    return 'final_table debe ser booleano';
  }
  return null;
}

/**
 * GET /api/results
 * Devuelve la lista de todos los resultados
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const results = await resultRepo.getAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resultados', details: error });
  }
});

/**
 * GET /api/results/:id
 * Devuelve un resultado por su ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const result = await resultRepo.getById(id);
    if (!result) {
      return res.status(404).json({ error: 'Resultado no encontrado' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resultado', details: error });
  }
});

/**
 * POST /api/results
 * Crea un nuevo resultado
 */
router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const errorMsg = validarResult(data);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const result = await resultRepo.create(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el resultado', details: error });
  }
});

/**
 * PUT /api/results/:id
 * Actualiza los datos de un resultado existente
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
  const errorMsg = validarResult(data, true);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const [affectedRows, updatedResults] = await resultRepo.updateById(id, data);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Resultado no encontrado' });
    }
    res.json(updatedResults[0]);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar el resultado', details: error });
  }
});

/**
 * DELETE /api/results/:id
 * Elimina un resultado por su ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const affectedRows = await resultRepo.deleteById(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Resultado no encontrado o ya eliminado' });
    }
    res.json({ message: 'Resultado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el resultado', details: error });
  }
});

/**
 * Exporta el router para ser usado en app.ts
 */
export default router;
