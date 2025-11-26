import sequelize from '../src/services/database';

async function analyzeColumns() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos\n');

    const tables = [
      'users',
      'tournaments',
      'registrations',
      'results',
      'payments',
      'cash_games',
      'cash_participants',
      'seasons',
      'players',
      'tournament_points',
      'historical_points',
      'ranking_history',
      'commission_pools',
      'settings'
    ];

    for (const table of tables) {
      console.log(`\n======== ${table.toUpperCase()} ========`);
      const [columns]: any = await sequelize.query(`DESCRIBE ${table}`);
      
      for (const col of columns) {
        console.log(`  ${col.Field.padEnd(25)} ${col.Type.padEnd(20)} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      }
    }

    await sequelize.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

analyzeColumns();
