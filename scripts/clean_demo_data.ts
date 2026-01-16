import sequelize from '../src/services/database';
import User from '../src/models/User';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';
import Payment from '../src/models/Payment';
import CashGame from '../src/models/CashGame';
import CashParticipant from '../src/models/CashParticipant';
import Season from '../src/models/Season';
import HistoricalPoint from '../src/models/HistoricalPoint';
import { Result } from '../src/models/Result';

/**
 * Script para limpiar todos los datos de demostración antes de ejecutar seed_demo_production.ts
 * ⚠️ CUIDADO: Este script borrará TODOS los datos de demo
 */

async function cleanDemoData() {
  try {
    console.log('🧹 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    // ============= LIMPIAR HISTORICAL POINTS =============
    console.log('🗑️  Borrando HistoricalPoints de temporada demo...');
    const season = await Season.findOne({ where: { nombre: 'Temporada Demo 2026' } });
    
    if (season) {
      const deletedHistorical = await HistoricalPoint.destroy({
        where: { season_id: season.id }
      });
      console.log(`   ✓ ${deletedHistorical} HistoricalPoints eliminados`);
    } else {
      console.log('   - No se encontró temporada demo');
    }

    // ============= LIMPIAR RESULTS =============
    console.log('\n🗑️  Borrando Results de torneos demo...');
    if (season) {
      const demoTournaments = await Tournament.findAll({
        where: { season_id: season.id }
      });
      
      let totalResults = 0;
      for (const tournament of demoTournaments) {
        const deleted = await Result.destroy({
          where: { tournament_id: tournament.id }
        });
        totalResults += deleted;
      }
      console.log(`   ✓ ${totalResults} Results eliminados`);
    }

    // ============= LIMPIAR REGISTRATIONS =============
    console.log('\n🗑️  Borrando Registrations de torneos demo...');
    if (season) {
      const demoTournaments = await Tournament.findAll({
        where: { season_id: season.id }
      });
      
      let totalRegs = 0;
      for (const tournament of demoTournaments) {
        const deleted = await Registration.destroy({
          where: { tournament_id: tournament.id }
        });
        totalRegs += deleted;
      }
      console.log(`   ✓ ${totalRegs} Registrations eliminadas`);
    }

    // ============= LIMPIAR PAYMENTS =============
    // Nota: Payments no tiene tournament_id directo, se limpiará al borrar usuarios demo si es necesario
    console.log('\n⚠️  Payments no se pueden filtrar por torneo (no hay tournament_id en el modelo)');

    // ============= LIMPIAR TOURNAMENTS =============
    console.log('\n🗑️  Borrando Tournaments de temporada demo...');
    if (season) {
      const deletedTournaments = await Tournament.destroy({
        where: { season_id: season.id }
      });
      console.log(`   ✓ ${deletedTournaments} Tournaments eliminados`);
    }

    // ============= LIMPIAR CASH PARTICIPANTS =============
    console.log('\n🗑️  Borrando Cash Participants...');
    const cashGames = await CashGame.findAll();
    let totalCashParts = 0;
    for (const cg of cashGames) {
      const deleted = await CashParticipant.destroy({
        where: { cash_game_id: cg.id }
      });
      totalCashParts += deleted;
    }
    console.log(`   ✓ ${totalCashParts} Cash Participants eliminados`);

    // ============= LIMPIAR CASH GAMES =============
    console.log('\n🗑️  Borrando Cash Games...');
    const deletedCash = await CashGame.destroy({ where: {} });
    console.log(`   ✓ ${deletedCash} Cash Games eliminados`);

    // ============= RESETEAR CURRENT POINTS DE USUARIOS DEMO =============
    console.log('\n🔄 Reseteando current_points de usuarios demo...');
    const { Op } = await import('sequelize');
    const resetCount = await User.update(
      { current_points: 0 },
      { 
        where: { 
          username: { [Op.like]: 'demo_%' }
        } 
      }
    );
    console.log(`   ✓ ${resetCount[0]} usuarios demo reseteados`);

    // ============= OPCIONAL: BORRAR TEMPORADA DEMO =============
    // Descomenta si quieres borrar también la temporada
    // if (season) {
    //   await season.destroy();
    //   console.log('\n   ✓ Temporada demo eliminada');
    // }

    console.log('\n✅ ¡Limpieza completada exitosamente!');
    console.log('\n📝 Ahora puedes ejecutar: npx ts-node scripts/seed_demo_production.ts\n');

    await sequelize.close();
  } catch (err) {
    console.error('❌ Error limpiando datos:', err);
    try { await sequelize.close(); } catch (e) {}
    process.exit(1);
  }
}

cleanDemoData();
