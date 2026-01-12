import 'dotenv/config';
import sequelize from '../src/services/database';

(async function(){
  try{
    await sequelize.authenticate();
    console.log('Connected.');
    const [rows] = await sequelize.query("SHOW TABLES");
    console.log(JSON.stringify(rows, null, 2));
    await sequelize.close();
    process.exit(0);
  }catch(e){
    // keep error printing simple to avoid TS type complaints
    console.error('ERROR', e);
    try{ await sequelize.close(); }catch(_){}
    process.exit(1);
  }
})();
