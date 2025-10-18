import sequelize from '../src/services/database';
import User from '../src/models/User';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const [results, metadata] = await sequelize.query("UPDATE users SET is_player = TRUE WHERE role = 'player'");
    console.log('Updated players:', metadata);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
