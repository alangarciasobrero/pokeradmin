import sequelize from '../src/services/database';

async function testDebtors() {
  try {
    await sequelize.authenticate();
    
    const [rows] = await sequelize.query(`
      SELECT p.user_id, u.username, 
             SUM(p.amount - COALESCE(p.paid_amount, 0)) as debt 
      FROM payments p 
      LEFT JOIN users u ON u.id = p.user_id 
      WHERE p.gaming_date = '2025-12-27' 
        AND p.source IN ('cash', 'cash_request') 
        AND (p.paid = 0 OR p.amount > COALESCE(p.paid_amount, 0)) 
      GROUP BY p.user_id, u.username 
      HAVING debt > 0
    `);
    
    console.log('Deudores con gaming_date 2025-12-27:');
    console.table(rows);
    
    await sequelize.close();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testDebtors();
