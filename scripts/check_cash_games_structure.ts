import mysql from 'mysql2/promise';

async function checkTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1085',
    database: 'pokeradmin'
  });

  try {
    const [rows] = await connection.query('DESCRIBE cash_games');
    console.log('Estructura de cash_games:');
    console.table(rows);
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTable();
