/**
 * Script para ejecutar la migración: agregar campo pinned a tournaments
 * Ejecutar: npx ts-node scripts/run_pinned_migration.ts
 */

import sequelize from '../src/services/database';

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    console.log('\n📝 Ejecutando migración: agregar campo pinned...');
    
    // Agregar columna pinned
    await sequelize.query(`
      ALTER TABLE tournaments
      ADD COLUMN pinned TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Torneo destacado en dashboard principal'
    `);
    console.log('✓ Columna pinned agregada');

    // Crear índice
    await sequelize.query(`
      CREATE INDEX idx_tournaments_pinned ON tournaments(pinned)
    `);
    console.log('✓ Índice creado');

    console.log('\n✅ Migración completada exitosamente');
    
    await sequelize.close();
  } catch (error: any) {
    if (error.message && error.message.includes('Duplicate column name')) {
      console.log('ℹ️  La columna pinned ya existe, migrando índice...');
      try {
        await sequelize.query(`
          CREATE INDEX idx_tournaments_pinned ON tournaments(pinned)
        `);
        console.log('✓ Índice creado');
        console.log('\n✅ Migración completada');
      } catch (indexError: any) {
        if (indexError.message && indexError.message.includes('Duplicate key name')) {
          console.log('ℹ️  El índice también ya existe');
          console.log('\n✅ Todo está actualizado');
        } else {
          throw indexError;
        }
      }
    } else {
      console.error('❌ Error:', error);
      process.exit(1);
    }
    await sequelize.close();
  }
}

runMigration();
