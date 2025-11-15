import sequelize from '../src/services/database';

// Import all models so they register with Sequelize
import '../src/models/User';
import '../src/models/Payment';
import '../src/models/CashParticipant';
import '../src/models/CashGame';
import '../src/models/Tournament';
import '../src/models/Registration';
import '../src/models/Result';
import '../src/models/Season';
import '../src/models/Player';
import '../src/models/TournamentPoint';
import '../src/models/HistoricalPoint';
import '../src/models/RankingHistory';

export default async function globalSetup() {
  console.log('[jest globalSetup] connecting and syncing database...');
  try {
    await sequelize.authenticate();
    // Ensure all tables exist (non-destructive)
    await sequelize.sync();
    console.log('[jest globalSetup] sequelize.sync completed');
    // NOTE: destructive operations (dropping legacy tables / truncation)
    // are disabled by default to avoid accidental data loss. To enable
    // them for an isolated test DB run set the following environment
    // variables when invoking tests:
    //   TEST_CLEAN=true                -> will truncate all Sequelize models
    //   ALLOW_LEGACY_TABLE_DROP=true   -> additionally drop legacy/dump tables
    // By default we skip both operations and leave the DB intact.
    const allowDrop = process.env.ALLOW_LEGACY_TABLE_DROP === 'true';
    const performTruncate = process.env.TEST_CLEAN === 'true';
    if (allowDrop) {
      try {
        console.log('[jest globalSetup] ALLOW_LEGACY_TABLE_DROP=true: dropping legacy dump tables');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        const legacyTables = ['historical_points','tournament_points','ranking_history','players'];
        for (const t of legacyTables) {
          try { await sequelize.query(`DROP TABLE IF EXISTS \`${t}\``); } catch (e) { /* ignore */ }
        }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('[jest globalSetup] legacy tables dropped');
      } catch (err) {
        console.error('[jest globalSetup] error dropping legacy tables', err);
      }
    } else {
      console.log('[jest globalSetup] skipping legacy table DROP (set ALLOW_LEGACY_TABLE_DROP=true to enable)');
    }

    // Optionally truncate all modeled tables to provide a clean slate.
    if (performTruncate) {
      try {
        console.log('[jest globalSetup] TEST_CLEAN=true: truncating all Sequelize-modeled tables');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        const modelNames = Object.keys(sequelize.models || {});
        for (const name of modelNames) {
          const m: any = (sequelize.models as any)[name];
          try {
            await m.destroy({ where: {}, truncate: true, force: true });
          } catch (err) {
            // fallback to raw truncate
            try { await sequelize.query(`TRUNCATE TABLE \`${m.getTableName()}\``); } catch (e) { /* ignore */ }
          }
        }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('[jest globalSetup] truncation completed');
      } catch (err) {
        console.error('[jest globalSetup] error during truncation', err);
      }
    } else {
      console.log('[jest globalSetup] skipping truncation of tables (set TEST_CLEAN=true to enable)');
    }
  } catch (err) {
    console.error('[jest globalSetup] Error during DB sync', err);
    throw err;
  }
}
