// Rutas para la entidad Result
// Permiten realizar operaciones CRUD sobre resultados de torneos
import { Router, Request, Response } from 'express';
import { ResultRepository } from '../repositories/ResultRepository';

const router = Router();
const resultRepo = new ResultRepository();

function validarResult(data: any, parcial = false): string | null {
  if (!parcial || data.tournament_id !== undefined) {
    if (!data.tournament_id || isNaN(Number(data.tournament_id)) || Number(data.tournament_id) <= 0) {
      return 'tournament_id es obligatorio y debe ser un número válido';
    }
  }
  // Require canonical user_id (legacy `player_id` is no longer accepted)
  if (!parcial || data.user_id !== undefined) {
    const uid = data.user_id;
    if (!uid || isNaN(Number(uid)) || Number(uid) <= 0) {
      return 'user_id es obligatorio y debe ser un número válido';
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

// GET /api/results
router.get('/', async (req: Request, res: Response) => {
  try {
    const results = await resultRepo.getAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resultados', details: String(error) });
  }
});

// GET /api/results/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  try {
    const result = await resultRepo.getById(id);
    if (!result) return res.status(404).json({ error: 'Resultado no encontrado' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resultado', details: String(error) });
  }
});

// POST /api/results
router.post('/', async (req: Request, res: Response) => {
  const data = req.body || {};
  try { console.log('POST /api/results payload:', JSON.stringify(data)); } catch (_) {}
  // Expect `user_id` in request body. Do not accept legacy `player_id`.
  const errorMsg = validarResult(data);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const created = await resultRepo.create(data);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error('Failed to create result:', err && err.message ? err.message : err);
    return res.status(400).json({ error: 'No se pudo crear el resultado', details: err && err.message ? err.message : String(err) });
  }
});

// PUT /api/results/:id
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body || {};
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  if (!data || Object.keys(data).length === 0) return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
  const errorMsg = validarResult(data, true);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const [affectedRows, updatedRows] = await resultRepo.updateById(id, data as any);
    if (affectedRows === 0) return res.status(404).json({ error: 'Resultado no encontrado' });
    res.json(updatedRows[0]);
  } catch (err: any) {
    res.status(400).json({ error: 'No se pudo actualizar el resultado', details: err && err.message ? err.message : String(err) });
  }
});

// DELETE /api/results/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  try {
    const affectedRows = await resultRepo.deleteById(id);
    if (affectedRows === 0) return res.status(404).json({ error: 'Resultado no encontrado o ya eliminado' });
    res.json({ message: 'Resultado eliminado correctamente' });
  } catch (err: any) {
    res.status(500).json({ error: 'No se pudo eliminar el resultado', details: err && err.message ? err.message : String(err) });
  }
});

export default router;
