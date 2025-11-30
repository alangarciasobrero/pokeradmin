import sequelize from '../src/services/database';

export default async function globalTeardown() {
  console.log('[jest globalTeardown] closing sequelize connection...');
  try {
    await sequelize.close();
    console.log('[jest globalTeardown] connection closed');
  } catch (err) {
    console.error('[jest globalTeardown] error closing connection', err);
  }
}
