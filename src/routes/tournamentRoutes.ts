// Rutas para la entidad Tournament
import { Router, Request, Response } from 'express';

// Repositorio de torneos
import { TournamentRepository } from '../repositories/TournamentRepository';

/**
 * Router para las rutas de torneos
 */
const router = Router();

/**
 * Repositorio dedicado para la interacción con la base de datos de torneos
 */
const tournamentRepo = new TournamentRepository();

// GET /api/tournaments
router.get('/', async (req: Request, res: Response) => {
  try {
    const tournaments = await tournamentRepo.getAll();
    if (!tournaments || tournaments.length === 0) {
      return res.status(404).json({ error: 'No hay torneos registrados' });
    }
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener torneos', details: error });
  }
});

/**
 * POST /api/tournaments
 * Crea un nuevo torneo con todos los campos requeridos
 * @body tournament_name: string
 * @body start_date: Date
 * @body buy_in: number
 * @body re_entry: number
 * @body knockout_bounty: number
 * @body starting_stack: number
 * @body count_to_ranking: boolean
 * @body double_points: boolean
 * @body blind_levels: number
 * @body small_blind: number
 * @body punctuality_discount: number
 */
router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const errorMsg = validarTorneo(data);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }
  try {
    const tournament = await tournamentRepo.create(data);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el torneo', details: error });
  }
});

/**
 * PUT /api/tournaments/:id
 * Edita los datos de un torneo existente por su ID
 * @param id - ID del torneo a editar
 * @body (parcial) - Cualquier campo del modelo Tournament
 */
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;

  if (!id || isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID de torneo inválido' });
  }
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
  }

  const errorMsg = validarTorneo(data, true);
  if (errorMsg) {
    return res.status(400).json({ error: errorMsg });
  }

  try {
    const [affectedRows, updatedTournaments] = await tournamentRepo.updateById(id, data);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }
    // Devuelve el torneo actualizado (puede ser array por returning:true)
    res.json(updatedTournaments[0]);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo editar el torneo', details: error });
  }
});

/**
 * Exporta el router para ser usado en app.ts
 */
export default router;


/**
 * Valida los datos de un torneo
 * @param data - Objeto con los campos del torneo
 * @param parcial - Si es true, solo valida los campos presentes (para PUT)
 * @returns null si es válido, o un string con el error
 */
function validarTorneo(data: any, parcial = false): string | null {
  if (!parcial || data.tournament_name !== undefined) {
    if (!data.tournament_name || typeof data.tournament_name !== 'string') {
      return 'El nombre del torneo es obligatorio y debe ser texto';
    }
  }
  if (!parcial || data.start_date !== undefined) {
    if (!data.start_date || isNaN(Date.parse(data.start_date))) {
      return 'La fecha de inicio es obligatoria y debe ser válida';
    }
  }
  if (!parcial || data.buy_in !== undefined) {
    if (data.buy_in == null || isNaN(Number(data.buy_in)) || Number(data.buy_in) < 0) {
      return 'El buy-in es obligatorio y debe ser un número positivo';
    }
  }
  if (!parcial || data.re_entry !== undefined) {
    if (data.re_entry == null || isNaN(Number(data.re_entry)) || Number(data.re_entry) < 0) {
      return 'El re-entry es obligatorio y debe ser un número positivo';
    }
  }
  if (!parcial || data.knockout_bounty !== undefined) {
    if (data.knockout_bounty == null || isNaN(Number(data.knockout_bounty)) || Number(data.knockout_bounty) < 0) {
      return 'El knockout bounty debe ser un número positivo';
    }
  }
  if (!parcial || data.starting_stack !== undefined) {
    if (data.starting_stack == null || isNaN(Number(data.starting_stack)) || Number(data.starting_stack) <= 0) {
      return 'El stack inicial es obligatorio y debe ser mayor a cero';
    }
  }
  if (!parcial || data.count_to_ranking !== undefined) {
    if (typeof data.count_to_ranking !== 'boolean') {
      return 'El campo count_to_ranking debe ser booleano';
    }
  }
  if (!parcial || data.double_points !== undefined) {
    if (typeof data.double_points !== 'boolean') {
      return 'El campo double_points debe ser booleano';
    }
  }
  if (!parcial || data.blind_levels !== undefined) {
    if (data.blind_levels == null || isNaN(Number(data.blind_levels)) || Number(data.blind_levels) <= 0) {
      return 'El número de niveles de ciegas es obligatorio y debe ser mayor a cero';
    }
  }
  if (!parcial || data.small_blind !== undefined) {
    if (data.small_blind == null || isNaN(Number(data.small_blind)) || Number(data.small_blind) <= 0) {
      return 'El small blind es obligatorio y debe ser mayor a cero';
    }
  }
  if (!parcial || data.punctuality_discount !== undefined) {
    if (data.punctuality_discount == null || isNaN(Number(data.punctuality_discount)) || Number(data.punctuality_discount) < 0) {
      return 'El descuento por puntualidad debe ser un número positivo';
    }
  }
  return null;
}
