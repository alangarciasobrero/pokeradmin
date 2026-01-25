/**
 * Script para resetear el ranking completo
 * Elimina todos los registros de torneos, resultados, puntos históricos
 * y registros de participantes para empezar desde cero
 */

import { sequelize } from '../src/models';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';
import { Result } from '../src/models/Result';
import HistoricalPoint from '../src/models/HistoricalPoint';

async function resetRanking() {
  try {
    console.log('🔄 Iniciando reseteo de ranking...\n');

    // 1. Eliminar puntos históricos
    console.log('📊 Eliminando puntos históricos...');
    const deletedPoints = await HistoricalPoint.destroy({ where: {} });
    console.log(`✅ Eliminados ${deletedPoints} registros de puntos históricos\n`);

    // 2. Eliminar resultados
    console.log('🏆 Eliminando resultados...');
    const deletedResults = await Result.destroy({ where: {} });
    console.log(`✅ Eliminados ${deletedResults} resultados\n`);

    // 3. Eliminar registros
    console.log('📝 Eliminando registros de participantes...');
    const deletedRegistrations = await Registration.destroy({ where: {} });
    console.log(`✅ Eliminados ${deletedRegistrations} registros\n`);

    // 4. Eliminar torneos
    console.log('🎯 Eliminando torneos...');
    const deletedTournaments = await Tournament.destroy({ where: {} });
    console.log(`✅ Eliminados ${deletedTournaments} torneos\n`);

    console.log('✨ Ranking reseteado exitosamente!');
    console.log('💡 Ahora puedes crear nuevos torneos con la nueva configuración de bonos\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error reseteando ranking:', error);
    process.exit(1);
  }
}

resetRanking();
