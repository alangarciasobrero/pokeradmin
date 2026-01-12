import sequelize from '../src/services/database';
import bcrypt from 'bcrypt';
import User from '../src/models/User';

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const username = process.env.DEV_ADMIN_USERNAME || 'admin';
    const password = process.env.DEV_ADMIN_PW || 'admin123';
    const hash = await bcrypt.hash(password, 10);
    const [user, created] = await User.findOrCreate({ where: { username }, defaults: { username, password_hash: hash, role: 'admin', full_name: 'Admin (created by script)', is_player: false } as any });
    if (!created) {
      // update to ensure admin role and password
      user.role = 'admin';
      user.password_hash = hash;
      await user.save();
    }
    console.log(`Admin user ready: username=${username} password=${password} (you can change via /admin/users)`);
    await sequelize.close();
  } catch (err) {
    console.error('Error creating admin user', err);
    try { await sequelize.close(); } catch (e) {}
    process.exit(1);
  }
}

run();
