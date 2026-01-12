import sequelize from '../src/services/database';

(async () => {
  try {
    await sequelize.authenticate();
    
    const [results] = await sequelize.query(`
      SELECT * FROM commission_pool 
      WHERE period_identifier LIKE '2026-01%' 
      ORDER BY id DESC
    `);
    
    console.log('Commission pools para enero 2026:');
    console.table(results);
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
