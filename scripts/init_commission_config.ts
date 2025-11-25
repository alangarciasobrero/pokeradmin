/**
 * Script para inicializar configuración de comisiones y pozos de ejemplo
 */

import sequelize from '../src/services/database';
import Setting from '../src/models/Setting';
import CommissionPool from '../src/models/CommissionPool';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a DB establecida');

    // Crear configuración por defecto de comisiones
    const defaultSettings = [
      { key: 'commission_total_pct', value: '20', description: 'Porcentaje total de comisión sobre el pozo' },
      { key: 'commission_quarterly_pct', value: '1', description: 'Porcentaje para ranking trimestral' },
      { key: 'commission_monthly_pct', value: '1', description: 'Porcentaje para especial del mes' },
      { key: 'commission_copa_pct', value: '1', description: 'Porcentaje para Copa Don Humberto' },
      { key: 'commission_house_pct', value: '17', description: 'Porcentaje para la casa' },
    ];

    console.log('Creando configuración por defecto...');
    for (const s of defaultSettings) {
      const [setting, created] = await Setting.findOrCreate({
        where: { key: s.key } as any,
        defaults: s as any,
      });
      if (created) {
        console.log(`  ✓ ${s.key} = ${s.value}%`);
      } else {
        console.log(`  - ${s.key} ya existe (valor actual: ${(setting as any).value}%)`);
      }
    }

    // Crear pozos de ejemplo para el período actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const quarter = `Q${Math.ceil((now.getMonth() + 1) / 3)}`;

    const monthlyPeriod = `${year}-${month}`;
    const quarterlyPeriod = `${year}-${quarter}`;

    const examplePools = [
      { pool_type: 'monthly', period_identifier: monthlyPeriod, accumulated_amount: 0, status: 'active' },
      { pool_type: 'quarterly', period_identifier: quarterlyPeriod, accumulated_amount: 0, status: 'active' },
      { pool_type: 'copa_don_humberto', period_identifier: String(year), accumulated_amount: 0, status: 'active' },
      { pool_type: 'house', period_identifier: monthlyPeriod, accumulated_amount: 0, status: 'active' },
    ];

    console.log('\nCreando pozos de ejemplo...');
    for (const p of examplePools) {
      const [pool, created] = await CommissionPool.findOrCreate({
        where: { pool_type: p.pool_type, period_identifier: p.period_identifier } as any,
        defaults: p as any,
      });
      if (created) {
        console.log(`  ✓ Pozo ${p.pool_type} (${p.period_identifier}) creado`);
      } else {
        console.log(`  - Pozo ${p.pool_type} (${p.period_identifier}) ya existe`);
      }
    }

    console.log('\n✅ Inicialización completada');
    console.log('\nAccede a:');
    console.log('  - Configuración de comisiones: /admin/games/settings/commissions');
    console.log('  - Pozos acumulados: /admin/games/settings/pools');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
