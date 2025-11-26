import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { User } from '../models/User';
import { Registration } from '../models/Registration';
import { Tournament } from '../models/Tournament';
import CashParticipant from '../models/CashParticipant';
import sequelize from '../services/database';

const router = Router();

// GET /player/:username - Perfil público de un jugador (solo información no sensible)
router.get('/:username', requireAuth, async (req: Request, res: Response) => {
	try {
		const username = req.params.username;
		
		const user = await User.findOne({ 
			where: { username, is_deleted: false },
			attributes: ['id', 'username', 'avatar', 'current_points', 'created_at']
		});

		if (!user) {
			return res.status(404).render('error', { 
				message: 'Jugador no encontrado',
				username: req.session!.username
			});
		}

		const userId = (user as any).id;

		// Estadísticas públicas de torneos
		const tournamentStats = await sequelize.query(`
			SELECT 
				COUNT(DISTINCT r.tournament_id) as total_tournaments,
				COUNT(CASE WHEN r.position IS NOT NULL THEN 1 END) as tournaments_finished,
				MIN(CASE WHEN r.position IS NOT NULL THEN r.position END) as best_position,
				COUNT(CASE WHEN r.position = 1 THEN 1 END) as first_places,
				COUNT(CASE WHEN r.position = 2 THEN 1 END) as second_places,
				COUNT(CASE WHEN r.position = 3 THEN 1 END) as third_places,
				COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podium_finishes,
				COUNT(CASE WHEN r.position <= 9 THEN 1 END) as final_tables,
				AVG(CASE WHEN r.position IS NOT NULL THEN r.position END) as avg_position,
				COUNT(CASE WHEN r.action_type = 1 THEN 1 END) as buy_ins,
				COUNT(CASE WHEN r.action_type = 2 THEN 1 END) as reentries,
				COUNT(CASE WHEN r.action_type = 3 THEN 1 END) as duplos
			FROM registrations r
			WHERE r.user_id = :userId
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Estadísticas de cash games (solo públicas)
		const cashStats = await sequelize.query(`
			SELECT 
				COUNT(DISTINCT cp.cash_game_id) as total_sessions,
				SUM(TIMESTAMPDIFF(MINUTE, cp.joined_at, COALESCE(cp.left_at, NOW()))) as total_minutes
			FROM cash_participants cp
			WHERE cp.user_id = :userId
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Últimos torneos con posición (máximo 10)
		const recentTournaments = await sequelize.query(`
			SELECT 
				t.tournament_name,
				t.start_date,
				r.position,
				r.action_type
			FROM registrations r
			INNER JOIN tournaments t ON t.id = r.tournament_id
			WHERE r.user_id = :userId AND r.position IS NOT NULL
			ORDER BY t.start_date DESC
			LIMIT 10
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Torneos donde quedó en top 3
		const topFinishes = await sequelize.query(`
			SELECT 
				t.tournament_name,
				t.start_date,
				r.position
			FROM registrations r
			INNER JOIN tournaments t ON t.id = r.tournament_id
			WHERE r.user_id = :userId AND r.position <= 3
			ORDER BY t.start_date DESC
			LIMIT 5
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		const stats = {
			user: (user as any).get({ plain: true }),
			tournaments: (tournamentStats as any)[0],
			cash: (cashStats as any)[0],
			recentTournaments,
			topFinishes
		};

		// Calcular win rate
		const finishedTournaments = stats.tournaments.tournaments_finished || 0;
		const winRate = finishedTournaments > 0 
			? ((stats.tournaments.first_places / finishedTournaments) * 100).toFixed(1)
			: '0.0';

		res.render('public_profile', {
			stats,
			winRate,
			isOwnProfile: req.session!.userId === userId,
			username: req.session!.username
		});

	} catch (err) {
		console.error('Error loading public profile', err);
		res.status(500).send('Error al cargar el perfil');
	}
});

export default router;
