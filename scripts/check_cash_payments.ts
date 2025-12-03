import mysql from 'mysql2/promise';

async function checkPayments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1085',
    database: 'pokeradmin'
  });

  try {
    const [payments] = await connection.query(
      'SELECT id, user_id, amount, paid, paid_amount, method, source FROM payments WHERE source IN ("cash", "cash_request") ORDER BY id DESC LIMIT 10'
    );
    console.log('Últimos pagos cash:');
    console.table(payments);
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkPayments();
