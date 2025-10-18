import sequelize from '../src/services/database';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // Check if column exists
    const [[colCount]]: any = await sequelize.query(
      "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_player'"
    );

    if (!colCount || colCount.cnt === 0) {
      console.log('Column is_player not found, adding...');
      // Use compatible syntax for MySQL versions that don't support IF NOT EXISTS
      await sequelize.query(`ALTER TABLE users ADD COLUMN is_player TINYINT(1) NOT NULL DEFAULT 0`);
      console.log('Added is_player column');
    } else {
      console.log('Column is_player already exists');
    }

    // Update existing rows where role='player'
    const [updateResult]: any = await sequelize.query("UPDATE users SET is_player = TRUE WHERE role = 'player'");
    // updateResult may be OkPacket or metadata depending on driver
    console.log('Update result:', updateResult);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
