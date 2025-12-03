import { Tournament } from '../src/models/Tournament';
import { Result } from '../src/models/Result';
import { Registration } from '../src/models/Registration';
import sequelize from '../src/services/database';
import { pointsForPosition } from '../src/services/rankingCalculator';

async function testDoublePointsCalculation() {
  try {
    await sequelize.authenticate();
    
    const tournament = await Tournament.findOne({
      where: { id: 90 }
    });

    if (!tournament) {
      console.log('Tournament 90 not found');
      return;
    }

    console.log('\n📊 Tournament:', tournament.tournament_name);
    console.log('   double_points:', tournament.double_points);
    console.log('   count_to_ranking:', tournament.count_to_ranking);

    const results = await Result.findAll({
      where: { tournament_id: 90 }
    });

    console.log(`\n🎯 Results: ${results.length}`);

    // Load points table
    const fs = require('fs');
    const path = require('path');
    const pointsPath = path.join(__dirname, '../points_table.json');
    let pointsTable: number[] = [];
    
    if (fs.existsSync(pointsPath)) {
      const data = JSON.parse(fs.readFileSync(pointsPath, 'utf8'));
      pointsTable = data.points || [];
    }

    console.log('\n💯 Points calculation:');
    results.forEach((r: any) => {
      const position = r.position;
      const basePoints = pointsTable[position - 1] || 0;
      const calculatedPoints = pointsForPosition(position, pointsTable, tournament);
      console.log(`   Position ${position}: base=${basePoints}, calculated=${calculatedPoints}, multiplier=${calculatedPoints / basePoints}`);
    });

    await sequelize.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testDoublePointsCalculation();
