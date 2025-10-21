// Rutas para la entidad Registration
// Permiten realizar operaciones CRUD sobre inscripciones
import { Router, Request, Response } from 'express';
import { RegistrationRepository } from '../repositories/RegistrationRepository';

const router = Router();
const registrationRepo = new RegistrationRepository();

/**
 * Valida los datos de una inscripción
 * @param data - Objeto con los campos de la inscripción
 * @param parcial - Si es true, solo valida los campos presentes (para PUT)
 * @returns null si es válido, o un string con el error
 */
function validarRegistration(data: any, parcial = false): string | null {
  // Soportar legacy `player_id` y normalizar a `user_id`
  if (!parcial || data.player_id !== undefined || data.user_id !== undefined) {
    const uid = data.user_id ?? data.player_id;
    if (!uid || isNaN(Number(uid)) || Number(uid) <= 0) {
      return 'user_id (o player_id legacy) es obligatorio y debe ser un número válido';
    }
  }
  if (!parcial || data.tournament_id !== undefined) {
    if (!data.tournament_id || isNaN(Number(data.tournament_id)) || Number(data.tournament_id) <= 0) {
      return 'tournament_id es obligatorio y debe ser un número válido';
    }
  }
  if (data.punctuality !== undefined && typeof data.punctuality !== 'boolean') {
    // Allow common string representations from HTML forms ("on", "true", "1") and coerce to boolean
    const v = String(data.punctuality).toLowerCase();
    if (['true', '1', 'on'].includes(v)) data.punctuality = true;
    else if (['false', '0', 'off'].includes(v)) data.punctuality = false;
    else return 'punctuality debe ser booleano';
  }
  return null;
}

/**
 * GET /api/registrations
 * Devuelve la lista de todas las inscripciones
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const registrations = await registrationRepo.getAll();
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones', details: error });
  }
});

/**
 * GET /api/registrations/:id
 * Devuelve una inscripción por su ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const registration = await registrationRepo.getById(id);
    if (!registration) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripción', details: error });
  }
});

/**
 * POST /api/registrations
 * Crea una nueva inscripción
 */
router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const errorMsg = validarRegistration(data);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const registration = await registrationRepo.create(data);
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la inscripción', details: error });
  }
});

/**
 * PUT /api/registrations/:id
 * Actualiza los datos de una inscripción existente
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
  const errorMsg = validarRegistration(data, true);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const [affectedRows, updatedRegistrations] = await registrationRepo.updateById(id, data);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    res.json(updatedRegistrations[0]);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar la inscripción', details: error });
  }
});

/**
 * DELETE /api/registrations/:id
 * Elimina una inscripción por su ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const affectedRows = await registrationRepo.deleteById(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada o ya eliminada' });
    }
    res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar la inscripción', details: error });
  }
});

/**
 * Exporta el router para ser usado en app.ts
 */
export default router;
