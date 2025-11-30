import { Request, Response } from 'express';
import { TournamentRepository } from '../repositories/TournamentRepository';
import CashGameRepository from '../repositories/CashGameRepository';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import User from '../models/User';
import paymentRepo from '../repositories/PaymentRepository';
import { Registration } from '../models/Registration';
import sequelize from '../services/database';
import CashParticipant from '../models/CashParticipant';

const tournamentRepo = new TournamentRepository();
const registrationRepo = new RegistrationRepository();

/**
 * Controller: render an admin dashboard using real data where possible.
 * Notes/assumptions:
 * - "Torneos activos" are interpreted as tournaments starting today (same date).
 * - "Mesas cash activas" are cash games with end_datetime === null.
 * - "Deudores del día" is a heuristic: registrations created today with punctuality === false
 *   (project lacks an explicit 'paid' flag in registrations; adapt when payment model exists).
 */
export async function getAdminDashboard(req: Request, res: Response) {
    try {
        const allTournaments = await tournamentRepo.getAll();
        const today = new Date();
        const isSameDay = (d1: Date, d2: Date) => {
            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        };

        // Find tournaments that start today and have open registrations
        const tournamentsToday = allTournaments.filter(t => isSameDay(new Date(t.start_date), today) && t.registration_open);
        const tournamentIds = tournamentsToday.map(t => t.id);

        // Fetch registration counts grouped by tournament in one query
        let regsByTournament: Record<number, number> = {};
        if (tournamentIds.length > 0) {
            const regsCounts: any[] = await Registration.findAll({
                attributes: ['tournament_id', [sequelize.fn('COUNT', sequelize.col('*')), 'cnt']],
                where: { tournament_id: tournamentIds },
                group: ['tournament_id']
            }) as any;
            regsCounts.forEach(rc => { regsByTournament[Number((rc as any).tournament_id)] = Number((rc as any).get('cnt') || 0); });
        }

        const tournamentsActive = tournamentsToday.map(t => ({ id: t.id, name: t.tournament_name, startedAt: t.start_date, players: regsByTournament[t.id] || 0, status: 'running' }));

        // Cash games: count participants per cash game
        const cashGames = await CashGameRepository.findAll();
        const openCashGames = cashGames.filter(cg => !cg.end_datetime);
        const cashGameIds = openCashGames.map(cg => cg.id);
        let cashCounts: Record<number, number> = {};
        if (cashGameIds.length > 0) {
            const cpCounts: any[] = await CashParticipant.findAll({
                attributes: ['cash_game_id', [sequelize.fn('COUNT', sequelize.col('*')), 'cnt']],
                where: { cash_game_id: cashGameIds },
                group: ['cash_game_id']
            }) as any;
            cpCounts.forEach(cc => { cashCounts[Number((cc as any).cash_game_id)] = Number((cc as any).get('cnt') || 0); });
        }

        const cashGamesActive = openCashGames.map(cg => ({ id: cg.id, tableName: `Mesa #${cg.id}`, players: cashCounts[cg.id] || 0, dealer: cg.dealer || '—', status: 'open' }));

        // Prefer to compute debtors from payments table if available
        let debtorsToday: Array<{ userId: number; name: string; amountDue: number }> = [];
        try {
            const paymentsDebtors = await paymentRepo.getDebtorsByDate(today);
            if (paymentsDebtors && paymentsDebtors.length > 0) {
                debtorsToday = await Promise.all(paymentsDebtors.map(async d => {
                    const user = await User.findByPk(d.userId);
                    return { userId: d.userId, name: user ? (user.full_name || user.username) : `#${d.userId}`, amountDue: d.amountDue };
                }));
            } else {
                // fallback heuristic: registrations created today with punctuality === false
                const allRegs = await registrationRepo.getAll();
                const regsToday = allRegs.filter(r => isSameDay(new Date(r.registration_date), today) && r.punctuality === false);
                debtorsToday = await Promise.all(regsToday.map(async r => {
                    const user = await User.findByPk(r.user_id);
                    return { userId: r.user_id, name: user ? (user.full_name || user.username) : `#${r.user_id}`, amountDue: 0 };
                }));
            }
        } catch (e) {
            // If payments table/access not present, fall back to registrations heuristic
            const allRegs = await registrationRepo.getAll();
            const regsToday = allRegs.filter(r => isSameDay(new Date(r.registration_date), today) && r.punctuality === false);
            debtorsToday = await Promise.all(regsToday.map(async r => {
                const user = await User.findByPk(r.user_id);
                return { userId: r.user_id, name: user ? (user.full_name || user.username) : `#${r.user_id}`, amountDue: 0 };
            }));
        }

        // Build a small summary for the live summary partial
        const summary = {
            activeTournaments: tournamentsActive.length,
            activeCashGames: cashGamesActive.length,
            // playersPlaying: sum of players across tournaments and cash games
            playersPlaying: tournamentsActive.reduce((s, t) => s + (t.players || 0), 0) + cashGamesActive.reduce((s, c) => s + (c.players || 0), 0)
        };

        // Compute simple financial totals for today (commissions & tips)
        let financialTotals = { totalCommission: 0, totalTips: 0 };
        try {
            const paymentsToday: any[] = await paymentRepo.findByDate(today) as any[];
            paymentsToday.forEach(p => {
                const amt = Number(p.amount || 0);
                const src = (p.source || '') as string;
                if (src.startsWith('cash_commission')) financialTotals.totalCommission += amt;
                if (src.startsWith('cash_tips')) financialTotals.totalTips += amt;
            });
        } catch (e) {
            // ignore and leave defaults
        }

        res.render('admin_dashboard', {
            username: req.session?.username || 'admin',
            tournamentsActive,
            cashGamesActive,
            debtorsToday,
            summary,
            financialTotals
        });
    } catch (err: any) {
        console.error('Error rendering admin dashboard', err);
        // render with empty datasets so UI still works
        res.render('admin_dashboard', { username: req.session?.username || 'admin', tournamentsActive: [], cashGamesActive: [], debtorsToday: [] });
    }
}
