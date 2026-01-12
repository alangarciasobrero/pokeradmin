import { Tournament } from '../src/models/Tournament';
import sequelize from '../src/services/database';

async function findDoublePointsTournaments() {
  try {
    await sequelize.authenticate();
    
    const tournaments = await Tournament.findAll({
      where: { double_points: true },
      attributes: ['id', 'tournament_name', 'double_points', 'start_date']
    });

    console.log(`\n📊 Tournaments with double_points = true: ${tournaments.length}`);
    
    tournaments.forEach((t: any) => {
      console.log(`   ${t.id}: "${t.tournament_name}" - ${t.start_date}`);
    });

    if (tournaments.length === 0) {
      console.log('\n⚠️  No tournaments found with double_points enabled');
      console.log('   User needs to enable double_points on a tournament first');
    }

    await sequelize.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

findDoublePointsTournaments();
