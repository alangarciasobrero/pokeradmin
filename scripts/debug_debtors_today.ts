import sequelize from '../src/services/database';

async function debugDebtorsToday() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Obtener gaming_date actual
    const { getCurrentGamingDate } = await import('../src/utils/gamingDate');
    const currentGamingDate = getCurrentGamingDate();
    const dateStr = currentGamingDate.toISOString().split('T')[0];
    console.log(`📅 Gaming date actual calculado: ${dateStr}`);
    console.log(`📅 Fecha/hora actual: ${new Date().toISOString()}\n`);

    // Verificar payments más recientes de cash
    const [recentPayments] = await sequelize.query(`
      SELECT p.id, p.user_id, u.username, p.amount, p.paid, p.paid_amount, 
             p.gaming_date, p.payment_date, p.source, p.reference_id
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.source IN ('cash', 'cash_request')
      ORDER BY p.id DESC
      LIMIT 10
    `);

    console.log('📋 Últimos 10 payments de cash:');
    console.table(recentPayments);

    // Buscar deudores por gaming_date actual
    const [debtorsToday] = await sequelize.query(`
      SELECT p.user_id, u.username, 
             SUM(p.amount) as total_amount,
             SUM(p.paid_amount) as total_paid,
             SUM(p.amount - COALESCE(p.paid_amount, 0)) as debt
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.gaming_date = :gamingDate
        AND p.source IN ('cash', 'cash_request')
        AND (p.paid = 0 OR p.amount > COALESCE(p.paid_amount, 0))
      GROUP BY p.user_id, u.username
      HAVING debt > 0
    `, {
      replacements: { gamingDate: dateStr }
    });

    console.log(`\n📊 Deudores con gaming_date = ${dateStr}:`);
    if (debtorsToday.length > 0) {
      console.table(debtorsToday);
    } else {
      console.log('  ❌ No hay deudores para este gaming_date');
    }

    // Verificar cash games de hoy
    const [cashGamesToday] = await sequelize.query(`
      SELECT id, start_datetime, end_datetime, gaming_date, dealer
      FROM cash_games
      WHERE DATE(start_datetime) >= CURDATE() - INTERVAL 2 DAY
      ORDER BY id DESC
      LIMIT 5
    `);

    console.log('\n🎰 Cash games recientes (últimos 2 días):');
    console.table(cashGamesToday);

    await sequelize.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

debugDebtorsToday();
