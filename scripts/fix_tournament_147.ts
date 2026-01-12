import sequelize from '../src/services/database';

(async () => {
  try {
    await sequelize.authenticate();
    
    const [result] = await sequelize.query(`
      UPDATE payments p
      INNER JOIN registrations r ON r.id = p.reference_id
      SET p.gaming_date = '2026-01-01'
      WHERE r.tournament_id = 147
        AND p.source = 'tournament'
        AND p.gaming_date IS NULL
    `);
    
    console.log('Pagos actualizados:', (result as any).affectedRows);
    
    // Verificar
    const [payments] = await sequelize.query(`
      SELECT p.id, p.user_id, p.amount, p.paid, p.paid_amount, p.gaming_date
      FROM payments p
      INNER JOIN registrations r ON r.id = p.reference_id
      WHERE r.tournament_id = 147
        AND p.source = 'tournament'
    `);
    
    console.log('\nPagos del torneo 147:');
    (payments as any[]).forEach(p => console.log(`  ID: ${p.id}, User: ${p.user_id}, Amount: ${p.amount}, Paid: ${p.paid}, Paid Amount: ${p.paid_amount}, Gaming Date: ${p.gaming_date}`));
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
