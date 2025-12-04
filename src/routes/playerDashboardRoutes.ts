import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { Tournament } from '../models/Tournament';
import { Registration } from '../models/Registration';
import { User } from '../models/User';
import CashGame from '../models/CashGame';
import sequelize from '../services/database';
import { Op } from 'sequelize';

const router = Router();

// GET / - Dashboard principal para jugadores
router.get('/', requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = req.session!.userId!;
		const isAdmin = req.session!.role === 'admin';

		// Si es admin, redirigir a admin dashboard
		if (isAdmin) {
			return res.redirect('/admin/dashboard');
		}

		const now = new Date();

		// Torneos destacados (pinned) próximos
		const pinnedTournaments = await Tournament.findAll({
			where: {
				pinned: true,
				start_date: { [Op.gte]: now }
			},
			order: [['start_date', 'ASC']],
			limit: 5
		});

		// Otros torneos próximos (máximo 6, excluyendo los pinned)
		const upcomingTournaments = await Tournament.findAll({
			where: {
				pinned: false,
				start_date: { [Op.gte]: now }
			},
			order: [['start_date', 'ASC']],
			limit: 6
		});

		// Torneos activos (que empezaron hoy o ayer y no tienen end_date)
		const yesterday = new Date(now.getTime() - 48 * 60 * 60 * 1000);
		const activeTournaments = await Tournament.findAll({
			where: {
				start_date: { 
					[Op.gte]: yesterday,
					[Op.lte]: now
				},
				[Op.or]: [
					{ end_date: null },
					{ end_date: { [Op.gte]: now } }
				]
			},
			order: [['start_date', 'DESC']],
			limit: 5
		});

		// Mesas cash activas
		const activeCashGames = await CashGame.findAll({
			where: { end_datetime: null },
			order: [['start_datetime', 'DESC']],
			limit: 5
		});

		// Top 5 del ranking actual
		const topPlayers = await User.findAll({
			where: { 
				is_deleted: false,
				is_player: true 
			},
			order: [['current_points', 'DESC']],
			limit: 5,
			attributes: ['id', 'username', 'avatar', 'current_points']
		});

		// Estadísticas rápidas del usuario
		const userStats = await sequelize.query(`
			SELECT 
				COUNT(DISTINCT r.tournament_id) as total_tournaments,
				COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
				COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums,
				(SELECT COUNT(*) FROM cash_participants WHERE user_id = :userId) as cash_sessions
			FROM registrations r
			WHERE r.user_id = :userId
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Posición en el ranking
		const rankingPosition = await sequelize.query(`
			SELECT COUNT(*) + 1 as position
			FROM users
			WHERE current_points > (SELECT current_points FROM users WHERE id = :userId)
			AND is_deleted = 0
			AND is_player = 1
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Deudas pendientes del usuario
		const userDebts = await sequelize.query(`
			SELECT 
				SUM(amount) as total_debt,
				SUM(paid_amount) as total_paid,
				SUM(amount - paid_amount) as pending_debt,
				COUNT(*) as debt_count
			FROM payments
			WHERE user_id = :userId
			AND paid = 0
			AND amount > paid_amount
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		res.render('player_dashboard', {
			pinnedTournaments: pinnedTournaments.map((t: any) => t.get({ plain: true })),
			upcomingTournaments: upcomingTournaments.map((t: any) => t.get({ plain: true })),
			activeTournaments: activeTournaments.map((t: any) => t.get({ plain: true })),
			activeCashGames: activeCashGames.map((c: any) => c.get({ plain: true })),
			topPlayers: topPlayers.map((u: any) => u.get({ plain: true })),
			userStats: (userStats as any)[0],
			rankingPosition: (rankingPosition as any)[0].position,
			userDebts: (userDebts as any)[0],
			username: req.session!.username,
			currentUserId: userId
		});

	} catch (err) {
		console.error('Error loading player dashboard', err);
		res.status(500).send('Error al cargar el dashboard');
	}
});

// GET /my-activity - Detalle completo de movimientos del usuario
router.get('/my-activity', requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = req.session!.userId!;
		const isAdmin = req.session!.role === 'admin';

		// Si es admin, redirigir
		if (isAdmin) {
			return res.redirect('/admin/dashboard');
		}

		// Obtener todos los pagos del usuario
		const payments = await sequelize.query(`
			SELECT 
				p.*,
				CASE 
					WHEN p.type = 'tournament' THEN t.tournament_name
					WHEN p.type = 'cash' THEN CONCAT('Mesa Cash #', c.id)
					ELSE p.description
				END as event_name,
				CASE 
					WHEN p.type = 'tournament' THEN t.start_date
					WHEN p.type = 'cash' THEN c.start_datetime
					ELSE p.created_at
				END as event_date
			FROM payments p
			LEFT JOIN tournaments t ON p.type = 'tournament' AND p.reference_id IN (SELECT id FROM registrations WHERE tournament_id = t.id)
			LEFT JOIN cash_games c ON p.type = 'cash' AND p.reference_id = c.id
			WHERE p.user_id = :userId
			ORDER BY p.created_at DESC
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Obtener todas las inscripciones a torneos
		const registrations = await sequelize.query(`
			SELECT 
				r.*,
				t.tournament_name,
				t.start_date,
				t.buy_in,
				t.end_date,
				CASE 
					WHEN r.position = 1 THEN '🥇'
					WHEN r.position = 2 THEN '🥈'
					WHEN r.position = 3 THEN '🥉'
					WHEN r.position IS NOT NULL THEN CONCAT('#', r.position)
					ELSE 'En curso'
				END as position_display
			FROM registrations r
			JOIN tournaments t ON r.tournament_id = t.id
			WHERE r.user_id = :userId
			ORDER BY t.start_date DESC
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Obtener participaciones en mesas cash
		const cashSessions = await sequelize.query(`
			SELECT 
				cp.*,
				c.start_datetime,
				c.end_datetime,
				c.stakes,
				c.dealer,
				(cp.final_stack - cp.buy_in - COALESCE(cp.rebuys, 0)) as profit
			FROM cash_participants cp
			JOIN cash_games c ON cp.cash_game_id = c.id
			WHERE cp.user_id = :userId
			ORDER BY c.start_datetime DESC
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		// Resumen financiero
		const financialSummary = await sequelize.query(`
			SELECT 
				SUM(CASE WHEN paid = 1 THEN amount ELSE 0 END) as total_paid,
				SUM(CASE WHEN paid = 0 THEN (amount - paid_amount) ELSE 0 END) as total_pending,
				SUM(amount) as total_transactions
			FROM payments
			WHERE user_id = :userId
		`, {
			replacements: { userId },
			type: (sequelize as any).QueryTypes.SELECT
		});

		res.render('player_activity', {
			payments,
			registrations,
			cashSessions,
			financialSummary: (financialSummary as any)[0],
			username: req.session!.username
		});

	} catch (err) {
		console.error('Error loading player activity', err);
		res.status(500).send('Error al cargar la actividad');
	}
});

export default router;
