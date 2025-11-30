import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import sequelize from '../src/services/database';

async function run() {
  const dumpsDir = path.join(process.cwd(), 'dumps');
  const filesInOrder = [
    'pokeradmin_players.sql',
    'pokeradmin_tournament_points.sql',
    'pokeradmin_historical_points.sql',
    'pokeradmin_ranking_history.sql',
  ];

  try {
    await sequelize.authenticate();
    console.log('[restore] Connected to DB');

    console.log('[restore] Disabling foreign key checks');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const f of filesInOrder) {
      const p = path.join(dumpsDir, f);
      try {
        const raw = await fs.readFile(p, 'utf8');
        console.log('[restore] Processing', f);

        // Filter the dump to remove destructive or mysql-version comment lines, then make CREATE TABLE non-destructive
        const lines = raw.split(/\r?\n/);
        const filtered = lines.filter(line => {
          const t = line.trim();
          if (!t) return false;
          if (t.startsWith('--')) return false;
          if (/^CREATE DATABASE/i.test(t)) return false;
          if (/^USE\s+/i.test(t)) return false;
          if (/^LOCK TABLES/i.test(t)) return false;
          if (/^UNLOCK TABLES/i.test(t)) return false;
          if (/^\/\!/.test(t)) return false; // mysql versioned comments like /*!40103 SET ... */
          if (/^DROP TABLE IF EXISTS/i.test(t)) return false;
          return true;
        });

  let s = filtered.join('\n').replace(/CREATE TABLE `/gi, 'CREATE TABLE IF NOT EXISTS `').trim();
  // Make inserts non-fatal if the row already exists
  s = s.replace(/INSERT INTO `/gi, 'INSERT IGNORE INTO `');
  // Ensure FK referencing columns are compatible with existing tables (unsigned where models expect unsigned)
  s = s.replace(/`tournament_id` int/gi, '`tournament_id` int UNSIGNED');
  s = s.replace(/`season_id` int/gi, '`season_id` int UNSIGNED');
  s = s.replace(/`result_id` int/gi, '`result_id` int UNSIGNED');

        // Split into statements by semicolon (handles simple dumps here)
        const stmts = s.split(/;\s*(?:\r?\n|$)/).map(x => x.trim()).filter(Boolean);

        for (const stmt of stmts) {
          // skip empty or purely comment statements
          if (!stmt) continue;
          try {
            await sequelize.query(stmt + ';');
          } catch (e: any) {
            // If already exists or duplicate key, log and continue
            const parts = [] as string[];
            if (e && e.message) parts.push(e.message);
            if (e && e.parent && e.parent.sqlMessage) parts.push(e.parent.sqlMessage);
            if (e && e.parent && e.parent.message) parts.push(e.parent.message);
            const msg = parts.join(' ');
            if (/already exists|Duplicate entry|PRIMARY must be unique/i.test(msg)) {
              console.warn('[restore] warning, continuing on:', msg.split('\n')[0]);
            } else {
              console.error('[restore] statement failed:', stmt.slice(0, 120));
              throw e;
            }
          }
        }

        console.log('[restore] Finished', f);
      } catch (e) {
        console.error('[restore] Failed processing', f, e);
        throw e;
      }
    }

    console.log('[restore] Re-enabling foreign key checks');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Report counts for the restored tables
    const tablesToCheck = ['players', 'tournament_points', 'historical_points', 'ranking_history'];
    for (const t of tablesToCheck) {
      try {
        const [[{ cnt }]]: any = await sequelize.query(`SELECT COUNT(*) as cnt FROM \`${t}\``);
        console.log(`[restore] ${t} -> ${cnt} rows`);
      } catch (e) {
        console.log(`[restore] ${t} -> not present or error`);
      }
    }

    await sequelize.close();
    console.log('[restore] Done');
    process.exit(0);
  } catch (e) {
    console.error('[restore] Error', e);
    try { await sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); } catch(_){}
    try { await sequelize.close(); } catch(_){}
    process.exit(1);
  }
}

run();
