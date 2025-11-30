/**
 * Script para sincronizar las nuevas tablas del sistema de comisiones
 * - settings: configuración de porcentajes
 * - commission_pools: pozos acumulados
 */

import sequelize from '../src/services/database';
import '../src/models/Setting';
import '../src/models/CommissionPool';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a DB establecida');

    // Sincronizar solo las nuevas tablas
    await sequelize.sync({ alter: true });
    console.log('✓ Tablas sincronizadas: settings, commission_pools');

    console.log('\n✅ Sincronización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
