import 'dotenv/config';
import sequelize from '../src/services/database';
// Ensure all models are imported so they register with Sequelize before sync
import '../src/models/Tournament';
import '../src/models/User';
import '../src/models/Registration';
import '../src/models/Payment';
import '../src/models/CashGame';
import '../src/models/CashParticipant';
import '../src/models/Result';
import '../src/models/Season';

async function main() {
  console.log('Connecting to DB...');
  try {
    await sequelize.authenticate();
    console.log('Authenticated. Running force sync (will DROP all tables)');
    // Disable FK checks so DROP TABLE IF EXISTS order won't fail due to existing constraints
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    try {
      await sequelize.sync({ force: true });
      console.log('Schema sync complete (force: true). Tables recreated according to models.');
    } finally {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    process.exit(0);
  } catch (err) {
    console.error('Schema sync failed:', err);
    process.exit(1);
  }
}

main();
