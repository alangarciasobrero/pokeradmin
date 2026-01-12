import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function createCommissionTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1085',
    database: 'pokeradmin'
  });

  try {
    const sqlPath = path.join(__dirname, '..', 'sql', 'create_commission_system.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    console.log('✅ Commission system tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createCommissionTables();
