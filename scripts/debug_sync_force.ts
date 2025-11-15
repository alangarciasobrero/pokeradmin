import sequelize from '../src/services/database';
import '../src/models/User';
import '../src/models/Payment';
import '../src/models/CashParticipant';
import '../src/models/CashGame';
import '../src/models/Tournament';
import '../src/models/Registration';
import '../src/models/Result';
import '../src/models/Season';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('connected');
    await sequelize.sync({ force: true });
    console.log('sync force succeeded');
  } catch (err) {
    console.error('sync force failed:', err);
    try {
      if ((err as any).parent) console.error('parent:', (err as any).parent);
      if ((err as any).sql) console.error('sql:', (err as any).sql);
    } catch (e) {}
  } finally {
    await sequelize.close();
  }
}
run();
