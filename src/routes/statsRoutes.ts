import { Router, Request, Response } from 'express';
import { requireAuth, requireAdmin } from '../middleware/requireAuth';
import { User } from '../models/User';
import { Registration } from '../models/Registration';
import { Tournament } from '../models/Tournament';
import { Season } from '../models/Season';
import CashParticipant from '../models/CashParticipant';
import CashGame from '../models/CashGame';
import { Payment } from '../models/Payment';
import sequelize from '../services/database';

const router = Router();

// GET /stats/user/:id - Estadísticas de un usuario específico (admin o el mismo usuario)
router.get('/user/:id', requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id);
		const currentUserId = req.session!.userId!;
		const isAdmin = req.session!.role === 'admin';

		// Verificar que sea admin o el mismo usuario
		if (!isAdmin && userId !== currentUserId) {
			return res.status(403).send('No tenés permiso para ver estas estadísticas');
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).send('Usuario no encontrado');
		}

		// Filtro de temporada
		const seasonId = req.query.season ? Number(req.query.season) : null;
		const seasons = await Season.findAll({ order: [['fecha_inicio', 'DESC']] });

		// === ESTADÍSTICAS DE TORNEOS ===
		let tournamentStatsQuery = `
			SELECT 
				COUNT(DISTINCT r.tournament_id) as total_tournaments,
				COUNT(CASE WHEN r.action_type = 1 THEN 1 END) as buy_ins,
				COUNT(CASE WHEN r.action_type = 2 THEN 1 END) as reentries,
				COUNT(CASE WHEN r.action_type = 3 THEN 1 END) as duplos,
				COUNT(CASE WHEN r.position IS NOT NULL THEN 1 END) as tournaments_finished,
				AVG(CASE WHEN r.position IS NOT NULL THEN r.position END) as avg_position,
				MIN(CASE WHEN r.position IS NOT NULL THEN r.position END) as best_position,
				COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podium_finishes
			FROM registrations r
			JOIN tournaments t ON t.id = r.tournament_id
			WHERE r.user_id = :userId`;
		if (seasonId) {
			tournamentStatsQuery += ' AND t.season_id = :seasonId';
		}

		const tournamentStats = await sequelize.query(tournamentStatsQuery, {
			replacements: { userId, seasonId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// === ESTADÍSTICAS DE CASH GAMES ===
		const cashStats = await sequelize.query(`
			SELECT 
				COUNT(DISTINCT cp.cash_game_id) as total_sessions,
				SUM(TIMESTAMPDIFF(MINUTE, cp.joined_at, COALESCE(cp.left_at, NOW()))) as total_minutes,
				COUNT(CASE WHEN cp.left_at IS NULL THEN 1 END) as active_sessions
			FROM cash_participants cp
			WHERE cp.user_id = :userId
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// === ESTADÍSTICAS DE PAGOS ===
		const paymentStats = await sequelize.query(`
			SELECT 
				COALESCE(SUM(CASE WHEN paid = 1 THEN paid_amount ELSE 0 END), 0) as total_paid,
				COALESCE(SUM(CASE WHEN paid = 0 THEN amount ELSE 0 END), 0) as total_debt,
				COUNT(CASE WHEN paid = 1 THEN 1 END) as paid_count,
				COUNT(CASE WHEN paid = 0 THEN 1 END) as unpaid_count,
				COALESCE(SUM(CASE WHEN source = 'tournament' AND paid = 1 THEN paid_amount ELSE 0 END), 0) as paid_tournaments,
				COALESCE(SUM(CASE WHEN source IN ('cash', 'cash_request') AND paid = 1 THEN paid_amount ELSE 0 END), 0) as paid_cash
			FROM payments
			WHERE user_id = :userId
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// === ÚLTIMOS TORNEOS ===
		const recentTournaments = await Registration.findAll({
			where: { user_id: userId },
			order: [['registration_date', 'DESC']],
			limit: 10
		});

		// === ÚLTIMAS SESIONES CASH ===
		const recentCashSessions = await CashParticipant.findAll({
			where: { user_id: userId },
			order: [['joined_at', 'DESC']],
			limit: 10
		});

		// === DATOS PARA GRÁFICOS ===
		// Distribución de posiciones
		let positionDistQuery = `
			SELECT 
				CASE 
					WHEN r.position = 1 THEN '1st'
					WHEN r.position <= 3 THEN '2nd-3rd'
					WHEN r.position <= 9 THEN '4th-9th'
					ELSE '10th+'
				END as position_range,
				COUNT(*) as count
			FROM registrations r
			JOIN tournaments t ON t.id = r.tournament_id
			WHERE r.user_id = :userId AND r.position IS NOT NULL`;
		if (seasonId) {
			positionDistQuery += ' AND t.season_id = :seasonId';
		}
		positionDistQuery += ' GROUP BY position_range';

		const positionDist = await sequelize.query(positionDistQuery, {
			replacements: { userId, seasonId },
			type: (sequelize as any).QueryTypes.SELECT
		});

	// Evolución temporal (últimos 10 torneos)
	let evolutionQuery = `
		SELECT 
			t.tournament_name,
			t.start_date,
			r.position,
			COALESCE(tp.points, 0) as points
		FROM registrations r
		JOIN tournaments t ON t.id = r.tournament_id
		LEFT JOIN tournament_points tp ON tp.tournament_id = t.id AND tp.position = r.position
		WHERE r.user_id = :userId AND r.position IS NOT NULL`;
	if (seasonId) {
		evolutionQuery += ' AND t.season_id = :seasonId';
	}
	evolutionQuery += ' ORDER BY t.start_date DESC LIMIT 10';		const evolution = await sequelize.query(evolutionQuery, {
			replacements: { userId, seasonId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		const stats = {
			user: user.get({ plain: true }),
			tournaments: (tournamentStats as any)[0],
			cash: (cashStats as any)[0],
			payments: (paymentStats as any)[0],
			recentTournaments: recentTournaments.map((r: any) => r.get({ plain: true })),
			recentCashSessions: recentCashSessions.map((c: any) => c.get({ plain: true })),
			charts: {
				positionDist: (positionDist as any),
				evolution: (evolution as any).reverse() // Orden cronológico para el gráfico
			}
		};

		res.render('stats/user', {
			stats,
			targetUser: user.get({ plain: true }),
			isOwnProfile: userId === currentUserId,
			isAdmin,
			username: req.session!.username,
			seasons,
			selectedSeason: seasonId
		});

	} catch (err) {
		console.error('Error loading user stats', err);
		res.status(500).send('Error al cargar estadísticas');
	}
});

// GET /stats/leaderboard - Tabla de clasificación general
	router.get('/leaderboard', requireAuth, async (req: Request, res: Response) => {
	try {
		const metric = (req.query.metric as string) || 'points';
		const seasonId = req.query.season ? Number(req.query.season) : null;
		const seasons = await Season.findAll({ order: [['fecha_inicio', 'DESC']] });
		
		let orderBy = 'u.current_points DESC';
		if (metric === 'tournaments') {
			orderBy = 'tournament_count DESC';
		} else if (metric === 'winrate') {
			orderBy = 'win_rate DESC';
		}

		let leaderboardQuery = `
			SELECT 
				u.id,
				u.username,
				u.avatar,
				u.current_points,
				COUNT(DISTINCT r.tournament_id) as tournament_count,
				COUNT(CASE WHEN r.position = 1 THEN 1 END) as first_places,
				COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podium_finishes,
				CASE 
					WHEN COUNT(CASE WHEN r.position IS NOT NULL THEN 1 END) > 0 
					THEN ROUND((COUNT(CASE WHEN r.position = 1 THEN 1 END) * 100.0) / COUNT(CASE WHEN r.position IS NOT NULL THEN 1 END), 2)
					ELSE 0 
				END as win_rate
			FROM users u
			LEFT JOIN registrations r ON r.user_id = u.id
			LEFT JOIN tournaments t ON t.id = r.tournament_id
			WHERE u.is_deleted = 0 AND u.is_player = 1`;
		if (seasonId) {
			leaderboardQuery += ' AND t.season_id = :seasonId';
		}
		leaderboardQuery += ` GROUP BY u.id, u.username, u.avatar, u.current_points ORDER BY ${orderBy} LIMIT 50`;

		const leaderboard = await sequelize.query(leaderboardQuery, {
			replacements: { seasonId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		res.render('stats/leaderboard', {
			leaderboard,
			currentMetric: metric,
			username: req.session!.username,
			seasons,
			selectedSeason: seasonId
		});

	} catch (err) {
		console.error('Error loading leaderboard', err);
		res.status(500).send('Error al cargar clasificación');
	}
});

// GET /stats/overview - Vista general de estadísticas del sistema (solo admin)
router.get('/overview', requireAdmin, async (req: Request, res: Response) => {
	try {
		// === ESTADÍSTICAS GLOBALES ===
		const globalStats = await sequelize.query(`
			SELECT 
				(SELECT COUNT(*) FROM users WHERE is_deleted = 0 AND is_player = 1) as total_players,
				(SELECT COUNT(*) FROM tournaments) as total_tournaments,
				(SELECT COUNT(*) FROM registrations) as total_registrations,
				(SELECT COUNT(*) FROM cash_games) as total_cash_games,
				(SELECT COUNT(*) FROM cash_participants) as total_cash_participants,
				(SELECT COALESCE(SUM(paid_amount), 0) FROM payments WHERE paid = 1) as total_revenue,
				(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE paid = 0) as total_debt,
				(SELECT COUNT(*) FROM cash_games WHERE end_datetime IS NULL) as active_cash_games
		`, {
			type: (sequelize as any).QueryTypes.SELECT
		});

		// === TOP 10 JUGADORES POR PUNTOS ===
		const topPlayers = await sequelize.query(`
			SELECT 
				u.id, u.username, u.full_name, u.avatar, u.current_points,
				COUNT(DISTINCT r.tournament_id) as tournaments_played
			FROM users u
			LEFT JOIN registrations r ON r.user_id = u.id
			WHERE u.is_deleted = 0 AND u.is_player = 1
			GROUP BY u.id, u.username, u.full_name, u.avatar, u.current_points
			ORDER BY u.current_points DESC
			LIMIT 10
		`, {
			type: (sequelize as any).QueryTypes.SELECT
		});

		// === ACTIVIDAD RECIENTE ===
		const recentActivity = await sequelize.query(`
			SELECT 
				'tournament' as type,
				t.id,
				t.tournament_name as name,
				t.start_date as date,
				COUNT(r.id) as participant_count
			FROM tournaments t
			LEFT JOIN registrations r ON r.tournament_id = t.id
			GROUP BY t.id, t.tournament_name, t.start_date
			ORDER BY t.start_date DESC
			LIMIT 5
		`, {
			type: (sequelize as any).QueryTypes.SELECT
		});

		// === ESTADÍSTICAS DE PAGOS POR MES ===
		const monthlyRevenue = await sequelize.query(`
			SELECT 
				DATE_FORMAT(payment_date, '%Y-%m') as month,
				COALESCE(SUM(CASE WHEN paid = 1 THEN paid_amount ELSE 0 END), 0) as revenue,
				COUNT(*) as payment_count
			FROM payments
			WHERE payment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
			GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
			ORDER BY month DESC
		`, {
			type: (sequelize as any).QueryTypes.SELECT
		});

		res.render('stats/overview', {
			stats: (globalStats as any)[0],
			topPlayers,
			recentActivity,
			monthlyRevenue,
			username: req.session!.username
		});

	} catch (err) {
		console.error('Error loading overview stats', err);
		res.status(500).send('Error al cargar estadísticas generales');
	}
});

// GET /stats/compare - Comparar dos jugadores
router.get('/compare', requireAuth, async (req: Request, res: Response) => {
	try {
		const user1Id = Number(req.query.user1);
		const user2Id = Number(req.query.user2);

		if (!user1Id || !user2Id) {
			return res.render('stats/compare', {
				users: await User.findAll({ 
					where: { is_deleted: false, is_player: true },
					order: [['username', 'ASC']]
				}),
				username: req.session!.username
			});
		}

		const [user1, user2] = await Promise.all([
			User.findByPk(user1Id),
			User.findByPk(user2Id)
		]);

		if (!user1 || !user2) {
			return res.status(404).send('Usuario no encontrado');
		}

		// Obtener estadísticas comparativas
		const comparison = await sequelize.query(`
			SELECT 
				u.id,
				u.username,
				u.full_name,
				u.current_points,
				COUNT(DISTINCT r.tournament_id) as tournaments,
				AVG(CASE WHEN r.position IS NOT NULL THEN r.position END) as avg_position,
				COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
				COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums,
				COUNT(DISTINCT cp.cash_game_id) as cash_sessions
			FROM users u
			LEFT JOIN registrations r ON r.user_id = u.id
			LEFT JOIN cash_participants cp ON cp.user_id = u.id
			WHERE u.id IN (:user1Id, :user2Id)
			GROUP BY u.id, u.username, u.full_name, u.current_points
		`, {
			replacements: { user1Id, user2Id },
			type: (sequelize as any).QueryTypes.SELECT
		});

		res.render('stats/compare', {
			users: await User.findAll({ 
				where: { is_deleted: false, is_player: true },
				order: [['username', 'ASC']]
			}),
			comparison,
			selectedUser1: user1Id,
			selectedUser2: user2Id,
			username: req.session!.username
		});

	} catch (err) {
		console.error('Error comparing users', err);
		res.status(500).send('Error al comparar jugadores');
	}
});

export default router;
