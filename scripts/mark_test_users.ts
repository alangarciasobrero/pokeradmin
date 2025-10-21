import 'ts-node/register';
import User from '../src/models/User';
import { Op } from 'sequelize';

async function main() {
  console.log('Connecting to DB and searching for test users...');
  const patterns = ['smoketest%', 'import_user%', 'smoke_test%'];

  const where = {
    [Op.or]: patterns.map((p) => ({ username: { [Op.like]: p } })),
  };

  const users = await User.findAll({ where });
  if (!users.length) {
    console.log('No test users found.');
    process.exit(0);
  }

  console.log(`Found ${users.length} users. Marking as is_deleted = true...`);
  for (const u of users) {
    try {
      await u.update({ is_deleted: true });
      console.log(`Marked deleted: ${u.id} ${u.username}`);
    } catch (err) {
      console.error(`Failed to mark ${u.id} ${u.username}:`, err);
    }
  }

  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
