import sequelize from '../src/services/database';

async function checkCashParticipantsStructure() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    const [columns] = await sequelize.query('DESCRIBE cash_participants');
    console.log('\n📋 Estructura de la tabla cash_participants:');
    console.log(columns);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCashParticipantsStructure();
