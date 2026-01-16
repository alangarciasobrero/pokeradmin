import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { Registration } from '../models/Registration';
import { Tournament } from '../models/Tournament';
import CashParticipant from '../models/CashParticipant';

const router = Router();

// GET /profile - Vista de perfil del usuario actual
router.get('/', requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = req.session!.userId!;
		const user = await User.findByPk(userId);
		
		if (!user) {
			return res.redirect('/login');
		}

		// Cargar estadísticas del usuario
		const registrations = await Registration.findAll({
			where: { user_id: userId },
			order: [['registration_date', 'DESC']],
			limit: 10
		});

		const payments = await Payment.findAll({
			where: { user_id: userId },
			order: [['payment_date', 'DESC']],
			limit: 10
		});

		const cashGames = await CashParticipant.findAll({
			where: { user_id: userId },
			order: [['joined_at', 'DESC']],
			limit: 10
		});

		// Calcular balance correctamente
		const allPayments = await Payment.findAll({ where: { user_id: userId } });
		
		let totalPaid = 0;
		let totalOwed = 0;
		
		for (const p of allPayments) {
			const amount = Number(p.amount || 0);
			const paidAmount = Number((p as any).paid_amount || 0);
			const source = p.source;
			
			// Los tournament_payout NO afectan el balance personal (se pagan en efectivo inmediatamente)
			if (source === 'tournament_payout') continue;
			
			// Para historical/adjustment con monto negativo: convertir a deuda positiva
			if ((source === 'historical' || source === 'adjustment') && amount < 0) {
				totalOwed += Math.abs(amount); // -3333 se convierte en +3333 de deuda
			} else {
				totalOwed += amount; // Montos positivos son deuda normal
			}
			
			// Solo sumar lo realmente pagado por el jugador
			totalPaid += paidAmount;
		}

		const stats = {
			totalTournaments: registrations.length,
			totalCashGames: cashGames.length,
			totalPaid: Number(totalPaid),
			totalOwed: Number(totalOwed),
			balance: Number(totalOwed) - Number(totalPaid), // Deuda - Pagado
			currentPoints: user.current_points || 0
		};

		const isAdmin = req.session!.role === 'admin';

		res.render('profile', {
			user: user.get({ plain: true }),
			stats,
			registrations: registrations.map((r: any) => r.get({ plain: true })),
			payments: payments.map((p: any) => p.get({ plain: true })),
			cashGames: cashGames.map((c: any) => c.get({ plain: true })),
			isAdmin,
			username: req.session!.username
		});
	} catch (err) {
		console.error('Error loading profile', err);
		res.status(500).send('Error al cargar perfil');
	}
});

// POST /profile/update - Actualizar datos del perfil
router.post('/update', requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = req.session!.userId!;
		const user = await User.findByPk(userId);
		
		if (!user) {
			return res.redirect('/login');
		}

		const { full_name, email, phone_number, nickname } = req.body;

		if (full_name) user.full_name = full_name;
		if (email !== undefined) user.email = email || null;
		if (phone_number !== undefined) user.phone_number = phone_number || null;
		if (nickname !== undefined) user.nickname = nickname || null;

		await user.save();

		if (req.session) req.session.flash = { type: 'success', message: 'Perfil actualizado correctamente' };
		res.redirect('/profile');
	} catch (err) {
		console.error('Error updating profile', err);
		if (req.session) req.session.flash = { type: 'error', message: 'Error al actualizar perfil' };
		res.redirect('/profile');
	}
});

// POST /profile/change-password - Cambiar contraseña
router.post('/change-password', requireAuth, async (req: Request, res: Response) => {
	try {
		const userId = req.session!.userId!;
		const user = await User.findByPk(userId);
		
		if (!user) {
			return res.redirect('/login');
		}

		const { current_password, new_password, confirm_password } = req.body;

		if (!current_password || !new_password || !confirm_password) {
			if (req.session) req.session.flash = { type: 'error', message: 'Todos los campos son obligatorios' };
			return res.redirect('/profile');
		}

		if (new_password !== confirm_password) {
			if (req.session) req.session.flash = { type: 'error', message: 'Las contraseñas no coinciden' };
			return res.redirect('/profile');
		}

		// Verificar contraseña actual
		const bcrypt = await import('bcrypt');
		const isValid = await bcrypt.compare(current_password, user.password_hash);

		if (!isValid) {
			if (req.session) req.session.flash = { type: 'error', message: 'Contraseña actual incorrecta' };
			return res.redirect('/profile');
		}

		// Actualizar contraseña
		const hash = await bcrypt.hash(new_password, 10);
		user.password_hash = hash;
		await user.save();

		if (req.session) req.session.flash = { type: 'success', message: 'Contraseña actualizada correctamente' };
		res.redirect('/profile');
	} catch (err) {
		console.error('Error changing password', err);
		if (req.session) req.session.flash = { type: 'error', message: 'Error al cambiar contraseña' };
		res.redirect('/profile');
	}
});

export default router;
