import fs from 'fs';
import path from 'path';
import sequelize from '../src/services/database';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('[migration] Connected to DB');

    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'sql', 'add_gaming_date_columns.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolons to execute each statement separately
    // Remove single-line comments first
    const cleanedSql = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`[migration] Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`[migration] Statement ${i + 1}/${statements.length}...`);
      try {
        await sequelize.query(stmt);
        console.log(`[migration] ✓ Statement ${i + 1} executed successfully`);
      } catch (err: any) {
        // Ignore "Duplicate column" errors (already applied)
        if (err.message && err.message.includes('Duplicate column')) {
          console.log(`[migration] ⚠ Statement ${i + 1} skipped (already applied)`);
        } else {
          console.error(`[migration] ✗ Error in statement ${i + 1}:`, err.message);
          throw err;
        }
      }
    }

    console.log('[migration] ✅ Gaming date migration completed successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('[migration] ❌ Migration failed:', err);
    await sequelize.close();
    process.exit(1);
  }
}

run();
