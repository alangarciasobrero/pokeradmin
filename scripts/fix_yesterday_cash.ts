import sequelize from '../src/services/database';

async function fixYesterdayCashGames() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Usar fecha del 27 de diciembre (cuando se crearon los datos)
    const targetDate = '2025-12-27';
    console.log(`📅 Fecha objetivo: ${targetDate}\n`);

    // 1. Actualizar cash games del 27 que no tengan gaming_date
    const [updatedCash] = await sequelize.query(`
      UPDATE cash_games 
      SET gaming_date = :gamingDate 
      WHERE DATE(start_datetime) = :targetDate
        AND gaming_date IS NULL
    `, {
      replacements: { gamingDate: targetDate, targetDate }
    });

    console.log(`✅ Cash games actualizados: ${JSON.stringify(updatedCash)}`);

    // 2. Obtener los IDs de cash games del 27
    const [cashGames]: any = await sequelize.query(`
      SELECT id, start_datetime FROM cash_games WHERE DATE(start_datetime) = :targetDate
    `, {
      replacements: { targetDate }
    });

    console.log(`\n📋 Cash games del 27 de diciembre:`);
    console.table(cashGames);

    if (cashGames.length === 0) {
      console.log('No hay cash games para actualizar');
      await sequelize.close();
      return;
    }

    const cashGameIds = cashGames.map((cg: any) => cg.id);

    // 3. Actualizar payments de cash que no tengan gaming_date
    const [updatedPayments] = await sequelize.query(`
      UPDATE payments p
      INNER JOIN cash_participants cp ON cp.id = p.reference_id
      SET p.gaming_date = :gamingDate
      WHERE cp.cash_game_id IN (:cashGameIds)
        AND p.source IN ('cash', 'cash_request')
        AND p.gaming_date IS NULL
    `, {
      replacements: { gamingDate: targetDate, cashGameIds }
    });

    console.log(`\n✅ Payments de cash actualizados: ${JSON.stringify(updatedPayments)}`);

    // 4. Mostrar resumen de deudores
    const [debtors] = await sequelize.query(`
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
      ORDER BY debt DESC
    `, {
      replacements: { gamingDate: targetDate }
    });

    console.log('\n📊 Deudores de cash del 27 de diciembre:');
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

fixYesterdayCashGames();
