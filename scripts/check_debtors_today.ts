import sequelize from '../src/services/database';

async function checkDebtorsToday() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Importar función de gaming date
    const { getCurrentGamingDate } = await import('../src/utils/gamingDate');
    const gamingDate = getCurrentGamingDate();
    console.log(`📅 Gaming date actual: ${gamingDate}\n`);

    // Verificar payments con deudas de hoy
    const [payments] = await sequelize.query(`
      SELECT p.id, p.user_id, u.username, p.amount, p.paid_amount, p.paid, p.source, p.gaming_date, p.payment_date
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.gaming_date = :gamingDate
        AND (p.paid = 0 OR p.amount > p.paid_amount)
      ORDER BY p.id
    `, {
      replacements: { gamingDate: gamingDate.toISOString().split('T')[0] }
    });

    console.log('📋 Payments con deudas de hoy (gaming_date):');
    console.log(JSON.stringify(payments, null, 2));

    // También verificar cash participants sin pagar
    const [cashDebtors] = await sequelize.query(`
      SELECT cp.id, cp.cash_game_id, cp.user_id, u.username, cp.buy_in, cp.amount_paid, cp.method
      FROM cash_participants cp
      LEFT JOIN users u ON u.id = cp.user_id
      LEFT JOIN cash_games cg ON cg.id = cp.cash_game_id
      WHERE cg.gaming_date = :gamingDate
        AND (cp.amount_paid = 0 OR cp.buy_in > cp.amount_paid)
      ORDER BY cp.id
    `, {
      replacements: { gamingDate: gamingDate.toISOString().split('T')[0] }
    });

    console.log('\n\n💰 Cash participants con deudas de hoy:');
    console.log(JSON.stringify(cashDebtors, null, 2));

    await sequelize.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

checkDebtorsToday();
