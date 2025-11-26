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
			limit: 3
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

		res.render('player_dashboard', {
			pinnedTournaments: pinnedTournaments.map((t: any) => t.get({ plain: true })),
			upcomingTournaments: upcomingTournaments.map((t: any) => t.get({ plain: true })),
			activeTournaments: activeTournaments.map((t: any) => t.get({ plain: true })),
			activeCashGames: activeCashGames.map((c: any) => c.get({ plain: true })),
			topPlayers: topPlayers.map((u: any) => u.get({ plain: true })),
			userStats: (userStats as any)[0],
			rankingPosition: (rankingPosition as any)[0].position,
			username: req.session!.username
		});

	} catch (err) {
		console.error('Error loading player dashboard', err);
		res.status(500).send('Error al cargar el dashboard');
	}
});

export default router;
