import sequelize from '../src/services/database';
import Payment from '../src/models/Payment';
import { Tournament } from '../src/models/Tournament';

async function fixPaymentsGamingDate() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Importar la función getCurrentGamingDate
    const { getCurrentGamingDate } = await import('../src/utils/gamingDate');
    const currentGamingDate = getCurrentGamingDate();
    console.log(`📅 Gaming date actual: ${currentGamingDate}`);

    // Actualizar el torneo 146 con el gaming_date correcto
    await sequelize.query(`
      UPDATE tournaments 
      SET gaming_date = :gamingDate 
      WHERE id = 146 AND gaming_date IS NULL
    `, {
      replacements: { gamingDate: currentGamingDate }
    });

    console.log(`✅ Torneo 146 actualizado con gaming_date: ${currentGamingDate}`);

    // Actualizar todos los payments de comisión y payouts del torneo 146
    const [updated] = await sequelize.query(`
      UPDATE payments 
      SET gaming_date = :gamingDate 
      WHERE source IN ('commission', 'tournament_payout') 
        AND (reference_id = 146 OR reference_id IS NULL)
        AND payment_date >= '2025-12-27'
        AND gaming_date IS NULL
    `, {
      replacements: { gamingDate: currentGamingDate }
    });

    console.log(`✅ Actualizados ${JSON.stringify(updated)} registros de payments`);

    await sequelize.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

fixPaymentsGamingDate();
