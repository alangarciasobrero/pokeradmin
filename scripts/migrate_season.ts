import sequelize from '../src/services/database';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    // Paso 1: Agregar columna
    console.log('Agregando columna season_id...');
    await sequelize.query(`
      ALTER TABLE tournaments
      ADD COLUMN season_id INT UNSIGNED NULL COMMENT 'ID de la temporada (seasons table)'
    `);
    console.log('✓ Columna agregada');

    // Paso 2: Agregar FK
    console.log('Agregando foreign key...');
    await sequelize.query(`
      ALTER TABLE tournaments
      ADD CONSTRAINT fk_tournaments_season 
      FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE SET NULL
    `);
    console.log('✓ Foreign key agregado');

    // Paso 3: Crear índice
    console.log('Creando índice...');
    await sequelize.query(`
      CREATE INDEX idx_tournaments_season ON tournaments(season_id)
    `);
    console.log('✓ Índice creado');

    console.log('\n✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
