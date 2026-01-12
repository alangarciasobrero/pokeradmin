import sequelize from '../src/services/database';

async function fixAllCashPaymentsGamingDate() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Actualizar payments de cash que no tienen gaming_date
    // usando el gaming_date del cash_game correspondiente
    const [updated] = await sequelize.query(`
      UPDATE payments p
      INNER JOIN cash_participants cp ON cp.id = p.reference_id
      INNER JOIN cash_games cg ON cg.id = cp.cash_game_id
      SET p.gaming_date = cg.gaming_date
      WHERE p.source IN ('cash', 'cash_request')
        AND cg.gaming_date IS NOT NULL
        AND p.gaming_date IS NULL
    `);

    console.log(`✅ Payments actualizados: ${JSON.stringify(updated)}`);

    // Mostrar deudores con gaming_date
    const [debtors] = await sequelize.query(`
      SELECT p.gaming_date, p.user_id, u.username, 
             SUM(CASE WHEN p.source = 'cash_request' THEN p.amount ELSE 0 END) as amount_requested,
             SUM(CASE WHEN p.source = 'cash' THEN p.paid_amount ELSE 0 END) as amount_paid,
             SUM(CASE WHEN p.source = 'cash_request' THEN p.amount ELSE 0 END) - 
             SUM(CASE WHEN p.source = 'cash' THEN p.paid_amount ELSE 0 END) as debt
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.source IN ('cash', 'cash_request')
        AND p.gaming_date IS NOT NULL
      GROUP BY p.gaming_date, p.user_id, u.username
      HAVING debt > 0
      ORDER BY p.gaming_date DESC, debt DESC
      LIMIT 20
    `);

    console.log('\n📊 Deudores de cash con gaming_date:');
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

fixAllCashPaymentsGamingDate();
