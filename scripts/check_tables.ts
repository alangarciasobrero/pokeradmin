import sequelize from '../src/services/database';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const [tablesRows]: any = await sequelize.query("SHOW TABLES");
    const tableKey = Object.keys(tablesRows[0] || {})[0];
    const tables = (tablesRows || []).map((r: any) => r[tableKey]);
    console.log('Tables found (', tables.length, '):', tables.join(', '));

    for (const t of tables) {
      try {
        const [[{ cnt }]]: any = await sequelize.query(`SELECT COUNT(*) as cnt FROM \`${t}\``);
        console.log(`${t} -> ${cnt} rows`);
      } catch (e) {
        console.log(`${t} -> error counting rows: ${String(e)}`);
      }
    }

    // Show describe for players if present
    if (tables.includes('players')) {
      console.log('\nSchema for table `players`:');
      try {
        const [desc]: any = await sequelize.query('DESCRIBE `players`');
        console.table(desc.map((r: any) => ({ Field: r.Field, Type: r.Type, Null: r.Null, Key: r.Key, Default: r.Default }))); // node console.table
      } catch (e) {
        console.log('Error describing players:', String(e));
      }
    }

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Error checking tables', err);
    try { await sequelize.close(); } catch (_) {}
    process.exit(1);
  }
}

run();
