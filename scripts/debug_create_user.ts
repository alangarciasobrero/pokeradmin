import sequelize from '../src/services/database';
import '../src/models/User';
import User from '../src/models/User';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();
    console.log('Synced');
    const u = await User.create({ username: 'qp_user_debug', password_hash: 'x', is_player: true });
    console.log('Created user', u.toJSON());
    await sequelize.close();
  } catch (err) {
    console.error('Error creating user:', err && (err as any).stack ? (err as any).stack : err);
    try { await sequelize.close(); } catch (e) {}
    process.exit(1);
  }
}
run();
