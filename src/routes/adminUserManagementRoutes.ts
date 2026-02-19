import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { User } from '../models/User';
import HistoricalPoint from '../models/HistoricalPoint';
import { Tournament } from '../models/Tournament';
import { Registration } from '../models/Registration';
import { Season } from '../models/Season';
import sequelize from '../services/database';

const router = Router();

// GET /admin/users/:id/edit-points - Vista para editar puntos manualmente
router.get('/:id/edit-points', requireAdmin, async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id);
		const user = await User.findByPk(userId);

		if (!user) {
			return res.status(404).send('Usuario no encontrado');
		}

		// Obtener historial de puntos del usuario
		const historicalPoints = await HistoricalPoint.findAll({
			where: { user_id: userId },
			order: [['record_date', 'DESC']],
			limit: 50
		});

		// Obtener temporadas disponibles
		const seasons = await Season.findAll({
			order: [['fecha_inicio', 'DESC']]
		});

		// Obtener TODOS los torneos (no solo recientes) ordenados del más nuevo al más antiguo
		const tournaments = await Tournament.findAll({
			order: [['start_date', 'DESC']]
		});

		// Obtener torneos donde el usuario ya está registrado
		const userRegistrations = await Registration.findAll({
			where: { user_id: userId },
			attributes: ['tournament_id', 'action_type']
		});

		// Crear un mapa de torneos registrados
		const registeredTournamentIds = new Set(
			userRegistrations.map(r => (r as any).tournament_id)
		);

		// Contar reentries por torneo
		const reentriesPerTournament: Record<number, number> = {};
		for (const reg of userRegistrations) {
			const tid = (reg as any).tournament_id;
			const actionType = (reg as any).action_type;
			if (actionType === 2) { // reentry
				reentriesPerTournament[tid] = (reentriesPerTournament[tid] || 0) + 1;
			}
		}

		// Marcar cada torneo si el usuario está o no registrado
		const tournamentsWithStatus = tournaments.map(t => ({
			...(t as any).toJSON(),
			isRegistered: registeredTournamentIds.has((t as any).id),
			reentries: reentriesPerTournament[(t as any).id] || 0
		}));

		res.render('admin/user_edit_points', {
			username: req.session!.username,
			targetUser: user,
			historicalPoints,
			seasons,
			tournaments: tournamentsWithStatus,
			flash: req.session!.flash
		});

		delete req.session!.flash;

	} catch (err) {
		console.error('Error loading user points editor:', err);
		res.status(500).send('Error al cargar el editor de puntos');
	}
});

// POST /admin/users/:id/update-points - Actualizar puntos directamente
router.post('/:id/update-points', requireAdmin, async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id);
		const { current_points } = req.body;

		await User.update(
			{ current_points: Number(current_points) || 0 },
			{ where: { id: userId } }
		);

		req.session!.flash = {
			type: 'success',
			message: `✅ Puntos actualizados a ${current_points}`
		};

		res.redirect(`/admin/users/${userId}/edit-points`);

	} catch (err) {
		console.error('Error updating user points:', err);
		req.session!.flash = {
			type: 'error',
			message: 'Error al actualizar puntos'
		};
		res.redirect('back');
	}
});

// POST /admin/users/:id/add-historical-point - Agregar registro histórico manual
router.post('/:id/add-historical-point', requireAdmin, async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id);
		const {
			points,
			reason,
			description,
			action_type,
			season_id,
			tournament_id,
			record_date
		} = req.body;

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).send('Usuario no encontrado');
		}

		// Crear registro histórico
		await HistoricalPoint.create({
			user_id: userId,
			points: Number(points) || 0,
			reason: reason || 'manual',
			description: description || 'Ajuste manual',
			action_type: action_type || 'manual',
			season_id: season_id ? Number(season_id) : null,
			tournament_id: tournament_id ? Number(tournament_id) : null,
			record_date: record_date ? new Date(record_date) : new Date()
		} as any);

		// Actualizar current_points del usuario sumando/restando
		const currentPoints = Number((user as any).current_points) || 0;
		const newPoints = currentPoints + Number(points);
		await user.update({ current_points: newPoints });

		req.session!.flash = {
			type: 'success',
			message: `✅ Registro histórico agregado: ${points} puntos`
		};

		res.redirect(`/admin/users/${userId}/edit-points`);

	} catch (err) {
		console.error('Error adding historical point:', err);
		req.session!.flash = {
			type: 'error',
			message: 'Error al agregar registro histórico'
		};
		res.redirect('back');
	}
});

// POST /admin/users/:id/add-tournament-registration - Agregar inscripción manual a torneo con recálculo automático
router.post('/:id/add-tournament-registration', requireAdmin, async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id);
		const { tournament_id, num_reentries } = req.body;
		const reentries = Number(num_reentries) || 0;

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).send('Usuario no encontrado');
		}

		const tournament = await Tournament.findByPk(tournament_id);
		if (!tournament) {
			return res.status(404).send('Torneo no encontrado');
		}

		// Verificar si ya existe el buy-in
		const existingBuyIn = await Registration.findOne({
			where: {
				user_id: userId,
				tournament_id: Number(tournament_id),
				action_type: 1 // buy-in
			}
		});

		if (existingBuyIn) {
			req.session!.flash = {
				type: 'error',
				message: '⚠️ Este jugador ya tiene un buy-in en este torneo'
			};
			return res.redirect(`/admin/users/${userId}/edit-points`);
		}

		// Crear el buy-in
		await Registration.create({
			user_id: userId,
			tournament_id: Number(tournament_id),
			action_type: 1, // buy-in
			registered_at: new Date()
		} as any);

		// Crear los reentries si hay
		for (let i = 0; i < reentries; i++) {
			await Registration.create({
				user_id: userId,
				tournament_id: Number(tournament_id),
				action_type: 2, // reentry
				registered_at: new Date()
			} as any);
		}

		// ============= OTORGAR BONOS BÁSICOS =============
		// Nota: Los bonos semanales/mensuales/temporada se calcularán cuando se cierre el torneo
		// o cuando el admin ejecute el recálculo de bonos desde /admin/bonus
		
		const seasonId = (tournament as any).season_id;
		const tournamentId = (tournament as any).id;

		// Solo otorgar bonos inmediatos si el torneo tiene temporada asociada
		if (seasonId) {
			const bonusService = await import('../services/bonusService');
			
			try {
				// 1. Bonus de asistencia (presencia)
				await bonusService.awardAttendanceBonus(userId, tournamentId, seasonId);

				// 2. Bonus de reentry (si tiene)
				for (let i = 0; i < reentries; i++) {
					await bonusService.awardReentryBonus(userId, tournamentId, seasonId, i + 1);
				}
			} catch (bonusErr) {
				console.error('Error awarding immediate bonuses:', bonusErr);
				// Continuar aunque falle el bonus
			}
		}

		// 3. Recalcular current_points desde historical_points
		const totalHistoricalPoints = await HistoricalPoint.sum('points', {
			where: { user_id: userId } as any
		});
		
		await user.update({ 
			current_points: Number(totalHistoricalPoints) || 0 
		});

		const registrationsCount = 1 + reentries;
		const bonusNote = seasonId 
			? 'Bonos de asistencia/reentry otorgados. Para bonos semanales/mensuales, usar /admin/bonus.'
			: 'Torneo sin temporada - bonos no aplicados.';
			
		req.session!.flash = {
			type: 'success',
			message: `✅ ${registrationsCount} inscripción(es) agregada(s). ${bonusNote}`
		};

		res.redirect(`/admin/users/${userId}/edit-points`);

	} catch (err) {
		console.error('Error adding tournament registration:', err);
		req.session!.flash = {
			type: 'error',
			message: 'Error al agregar inscripción'
		};
		res.redirect('back');
	}
});

// DELETE /admin/users/historical-points/:id - Eliminar registro histórico
router.post('/historical-points/:id/delete', requireAdmin, async (req: Request, res: Response) => {
	try {
		const hpId = Number(req.params.id);
		const hp = await HistoricalPoint.findByPk(hpId);

		if (!hp) {
			return res.status(404).send('Registro no encontrado');
		}

		const userId = (hp as any).user_id;
		const points = (hp as any).points;

		// Eliminar el registro
		await hp.destroy();

		// Actualizar puntos del usuario restando los puntos eliminados
		const user = await User.findByPk(userId);
		if (user) {
			const currentPoints = Number((user as any).current_points) || 0;
			await user.update({ current_points: currentPoints - points });
		}

		req.session!.flash = {
			type: 'success',
			message: '✅ Registro histórico eliminado'
		};

		res.redirect(`/admin/users/${userId}/edit-points`);

	} catch (err) {
		console.error('Error deleting historical point:', err);
		req.session!.flash = {
			type: 'error',
			message: 'Error al eliminar registro'
		};
		res.redirect('back');
	}
});

export default router;
