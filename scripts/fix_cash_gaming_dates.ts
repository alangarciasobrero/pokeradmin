import sequelize from '../src/services/database';
import { CashGame } from '../src/models/CashGame';

async function fixCashGamesAndPayments() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Importar función de gaming date
    const { getCurrentGamingDate } = await import('../src/utils/gamingDate');
    const currentGamingDate = getCurrentGamingDate();
    const dateStr = currentGamingDate.toISOString().split('T')[0];
    console.log(`📅 Gaming date actual: ${dateStr}\n`);

    // 1. Actualizar cash games de hoy que no tengan gaming_date
    const [updatedCash] = await sequelize.query(`
      UPDATE cash_games 
      SET gaming_date = :gamingDate 
      WHERE DATE(start_datetime) = :dateStr
        AND gaming_date IS NULL
    `, {
      replacements: { gamingDate: dateStr, dateStr }
    });

    console.log(`✅ Cash games actualizados: ${JSON.stringify(updatedCash)}`);

    // 2. Obtener los IDs de cash games con gaming_date de hoy
    const [cashGames]: any = await sequelize.query(`
      SELECT id FROM cash_games WHERE gaming_date = :gamingDate
    `, {
      replacements: { gamingDate: dateStr }
    });

    const cashGameIds = cashGames.map((cg: any) => cg.id);
    console.log(`📋 Cash games de hoy: ${cashGameIds.join(', ')}\n`);

    if (cashGameIds.length === 0) {
      console.log('No hay cash games para actualizar');
      await sequelize.close();
      return;
    }

    // 3. Actualizar payments de cash que no tengan gaming_date
    const [updatedPayments] = await sequelize.query(`
      UPDATE payments p
      INNER JOIN cash_participants cp ON cp.id = p.reference_id
      INNER JOIN cash_games cg ON cg.id = cp.cash_game_id
      SET p.gaming_date = :gamingDate
      WHERE cg.gaming_date = :gamingDate
        AND p.source IN ('cash', 'cash_request')
        AND p.gaming_date IS NULL
    `, {
      replacements: { gamingDate: dateStr }
    });

    console.log(`✅ Payments de cash actualizados: ${JSON.stringify(updatedPayments)}`);

    // 4. Mostrar resumen de deudores
    const [debtors] = await sequelize.query(`
      SELECT p.user_id, u.username, 
             SUM(p.amount) as total_amount,
             SUM(p.paid_amount) as total_paid,
             SUM(p.amount - p.paid_amount) as debt
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.gaming_date = :gamingDate
        AND p.source IN ('cash', 'cash_request')
        AND (p.paid = 0 OR p.amount > p.paid_amount)
      GROUP BY p.user_id, u.username
      HAVING debt > 0
      ORDER BY debt DESC
    `, {
      replacements: { gamingDate: dateStr }
    });

    console.log('\n📊 Deudores de cash de hoy:');
    if (debtors.length > 0) {
      console.table(debtors);
    } else {
      console.log('  No hay deudores');
    }

    await sequelize.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

fixCashGamesAndPayments();
