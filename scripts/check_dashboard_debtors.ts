import { sequelize } from '../src/config/database';
import { CashGame } from '../src/models/CashGame';
import { Payment } from '../src/models/Payment';
import { CashParticipant } from '../src/models/CashParticipant';

async function checkDashboardDebtors() {
  try {
    console.log('=== Cash Games Activos ===');
    const activeCashGames = await CashGame.findAll({ 
      where: { status: 'active' } 
    });
    console.log(`Cash games activos: ${activeCashGames.length}`);
    for (const game of activeCashGames) {
      console.log({
        id: game.id,
        start: game.start_datetime,
        gaming_date: (game as any).gaming_date,
        status: game.status
      });
    }

    console.log('\n=== Pagos con source=cash_game pendientes ===');
    const cashGamePayments = await Payment.findAll({
      where: {
        source: 'cash_game',
        paid: false
      }
    });
    console.log(`Pagos pendientes: ${cashGamePayments.length}`);
    for (const p of cashGamePayments) {
      console.log({
        id: p.id,
        user_id: p.user_id,
        amount: p.amount,
        paid_amount: (p as any).paid_amount,
        gaming_date: (p as any).gaming_date,
        payment_date: p.payment_date,
        source: p.source
      });
    }

    console.log('\n=== Cash Participants hoy ===');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const participants = await CashParticipant.findAll({
      include: [{
        model: CashGame,
        as: 'cash_game',
        where: {
          start_datetime: {
            [sequelize.Sequelize.Op.gte]: today
          }
        }
      }]
    });
    console.log(`Participantes hoy: ${participants.length}`);
    for (const p of participants) {
      console.log({
        id: p.id,
        user_id: p.user_id,
        cash_game_id: p.cash_game_id,
        requested_amount: (p as any).requested_amount,
        amount_paid: (p as any).amount_paid
      });
    }

    await sequelize.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDashboardDebtors();
