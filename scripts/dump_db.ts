import fs from 'fs';
import path from 'path';
import sequelize from '../src/services/database';

function escapeValue(v: any) {
  if (v === null || v === undefined) return 'NULL';
  if (Buffer.isBuffer(v)) return "x'" + v.toString('hex') + "'";
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (v instanceof Date) return `'${v.toISOString().slice(0,19).replace('T',' ')}'`;
  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/\\/g,'\\\\').replace(/'/g, "\\'")}'`;
  // string
  return `'${String(v).replace(/\\/g,'\\\\').replace(/'/g, "\\'")}'`;
}

async function run(){
  try{
    await sequelize.authenticate();
    console.log('[dump] Connected to DB');

    const outDir = path.join(process.cwd(), 'dumps');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    const now = new Date();
    const stamp = now.toISOString().replace(/[:T]/g,'-').split('.')[0];
    const fname = `pokeradmin_post_restore_${stamp}.sql`;
    const outPath = path.join(outDir, fname);

    const w = fs.createWriteStream(outPath, { encoding: 'utf8' });
    w.write('-- pokeradmin SQL dump (programmatic)\n');
    w.write(`-- generated: ${new Date().toISOString()}\n`);
    w.write('SET FOREIGN_KEY_CHECKS=0;\n\n');

    // list tables
    const tablesRes: any = await sequelize.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'", { type: (sequelize as any).QueryTypes.SELECT });
    const tableNames: string[] = [];
    if (Array.isArray(tablesRes) && tablesRes.length > 0) {
      // result keys vary by mysql version, pick second column for name
      for (const row of tablesRes){
        const vals = Object.values(row);
        if (vals.length > 0) tableNames.push(String(vals[0]));
      }
    } else {
      // fallback
      const r2: any = await sequelize.query('SHOW TABLES', { type: (sequelize as any).QueryTypes.SELECT });
      for (const row of r2){
        const vals = Object.values(row);
        if (vals.length > 0) tableNames.push(String(vals[0]));
      }
    }

    for (const t of tableNames){
      try{
        const createRes: any = await sequelize.query(`SHOW CREATE TABLE \`${t}\`` as any, { type: (sequelize as any).QueryTypes.SELECT });
        const cv = createRes && createRes[0] ? createRes[0] : createRes;
        // extract CREATE TABLE value
        const createKey = Object.keys(cv).find(k => /create/i.test(k)) || Object.keys(cv)[1];
        const createStmt = (cv && cv[createKey]) ? cv[createKey] : cv[Object.keys(cv)[1]];
        w.write(`DROP TABLE IF EXISTS \`${t}\`;\n`);
        w.write(createStmt + ';\n\n');

        // dump rows
        const rows: any[] = await sequelize.query(`SELECT * FROM \`${t}\``, { type: (sequelize as any).QueryTypes.SELECT });
        if (rows && rows.length > 0){
          const cols = Object.keys(rows[0]);
          // write inserts in chunks of 200
          const chunkSize = 200;
          for (let i=0;i<rows.length;i+=chunkSize){
            const slice = rows.slice(i, i+chunkSize);
            const vals = slice.map(r => '(' + cols.map(c => escapeValue(r[c])).join(',') + ')').join(',\n');
            w.write(`INSERT INTO \`${t}\` (${cols.map(c=>`\`${c}\``).join(',')}) VALUES\n${vals};\n`);
          }
        }
        w.write('\n');
      } catch(e){
        console.error('[dump] error dumping table', t, e);
      }
    }

    w.write('SET FOREIGN_KEY_CHECKS=1;\n');
    w.end();
    console.log('[dump] Wrote file', outPath);
  } catch(e){
    console.error('[dump] error', e);
    process.exit(1);
  } finally {
    try { await sequelize.close(); } catch(e){}
  }
}

run();
