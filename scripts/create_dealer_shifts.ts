import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function createDealerShiftsTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1085',
    database: 'pokeradmin'
  });

  try {
    const sqlPath = path.join(__dirname, '..', 'sql', 'create_dealer_shifts_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await connection.query(sql);
    console.log('✓ Tabla dealer_shifts creada exitosamente');
  } catch (error: any) {
    console.error('Error al crear tabla:', error.message);
  } finally {
    await connection.end();
  }
}

createDealerShiftsTable();
