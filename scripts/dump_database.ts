import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function dumpDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const dumpPath = path.join(__dirname, '..', 'dumps', `pokeradmin_complete_${timestamp}.sql`);
  
  try {
    // Ensure dumps directory exists
    const dumpsDir = path.join(__dirname, '..', 'dumps');
    if (!fs.existsSync(dumpsDir)) {
      fs.mkdirSync(dumpsDir, { recursive: true });
    }

    // Use npx to run mysqldump via mysql2
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1085',
      database: 'pokeradmin'
    });

    // Get all table names
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = (tables as any[]).map((row: any) => Object.values(row)[0]);

    console.log(`Found ${tableNames.length} tables to dump...`);

    let dump = `-- MySQL dump of pokeradmin database\n`;
    dump += `-- Generated at: ${new Date().toISOString()}\n\n`;
    dump += `SET FOREIGN_KEY_CHECKS=0;\n\n`;

    for (const tableName of tableNames) {
      console.log(`Dumping table: ${tableName}`);
      
      // Get CREATE TABLE statement
      const [createResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTable = (createResult as any[])[0]['Create Table'];
      dump += `-- Table: ${tableName}\n`;
      dump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      dump += `${createTable};\n\n`;

      // Get data
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      if ((rows as any[]).length > 0) {
        dump += `-- Data for table: ${tableName}\n`;
        for (const row of (rows as any[])) {
          const values = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'string') return connection.escape(v);
            if (v instanceof Date) return connection.escape(v.toISOString());
            return connection.escape(v);
          });
          dump += `INSERT INTO \`${tableName}\` VALUES (${values.join(', ')});\n`;
        }
        dump += `\n`;
      }
    }

    dump += `SET FOREIGN_KEY_CHECKS=1;\n`;

    fs.writeFileSync(dumpPath, dump, 'utf8');
    await connection.end();

    console.log(`✅ Database dump created successfully: ${dumpPath}`);
    console.log(`File size: ${(fs.statSync(dumpPath).size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('❌ Error creating database dump:', error);
    throw error;
  }
}

dumpDatabase();
