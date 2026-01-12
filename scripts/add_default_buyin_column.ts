import mysql from 'mysql2/promise';

async function addDefaultBuyin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1085',
    database: 'pokeradmin'
  });

  try {
    await connection.query('ALTER TABLE cash_games ADD COLUMN default_buyin DECIMAL(10,2) DEFAULT 0 COMMENT "Monto mínimo requerido para sentarse"');
    console.log('✓ Columna default_buyin agregada exitosamente');
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠ La columna default_buyin ya existe');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await connection.end();
  }
}

addDefaultBuyin();
