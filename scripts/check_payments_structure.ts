import sequelize from '../src/services/database';

async function checkPaymentsStructure() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    const [columns] = await sequelize.query('DESCRIBE payments');
    console.log('\n📋 Estructura de la tabla payments:');
    console.log(columns);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPaymentsStructure();
