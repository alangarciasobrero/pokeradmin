import { Tournament } from '../src/models/Tournament';
import sequelize from '../src/services/database';

async function checkDoublePoints() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    // Check if column exists
    const [results]: any = await sequelize.query(`
      SHOW COLUMNS FROM tournaments LIKE 'double_points';
    `);
    
    console.log('\n📊 Column double_points:', results.length > 0 ? '✓ EXISTS' : '✗ NOT FOUND');
    
    if (results.length > 0) {
      console.log('   Type:', results[0].Type);
      console.log('   Default:', results[0].Default);
    }

    // Check some tournaments
    const tournaments = await Tournament.findAll({
      attributes: ['id', 'tournament_name', 'double_points', 'count_to_ranking'],
      limit: 10
    });

    console.log('\n🎯 Sample tournaments:');
    tournaments.forEach((t: any) => {
      console.log(`   ${t.id}: "${t.tournament_name}" - double_points: ${t.double_points} (type: ${typeof t.double_points})`);
    });

    await sequelize.close();
    console.log('\n✓ Done');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDoublePoints();
