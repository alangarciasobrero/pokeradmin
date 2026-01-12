import sequelize from '../src/services/database';
// Import models so they register
import '../src/models/Player';
import '../src/models/TournamentPoint';
import '../src/models/HistoricalPoint';
import '../src/models/RankingHistory';

(async function(){
  try{
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.sync();
    console.log('sequelize.sync completed');
    await sequelize.close();
    process.exit(0);
  }catch(e){
    console.error('Error syncing models', e);
    try{ await sequelize.close(); }catch(_){ }
    process.exit(1);
  }
})();
