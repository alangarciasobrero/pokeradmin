/**
 * Script para calcular bonus de asistencia masivamente
 * Revisa todos los usuarios y otorga bonus que califiquen
 */

import sequelize from '../src/services/database';
import { User } from '../src/models/User';
import bonusService from '../src/services/bonusService';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a DB establecida');

    const users = await User.findAll({ where: { role: 'user' } as any });
    console.log(`Procesando ${users.length} usuarios...`);

    // Definir temporada actual (ajustar según necesidad)
    const seasonId = 1;
    const seasonStart = new Date('2025-09-01'); // Inicio de temporada
    const seasonEnd = new Date('2025-12-31');   // Fin de temporada (35 jornadas)

    let bronzeCount = 0;
    let silverCount = 0;
    let goldCount = 0;
    let diamondCount = 0;
    let blackCount = 0;

    for (const user of users) {
      const userId = (user as any).id;

      // Bonus Oro (28+ jornadas de 35)
      if (await bonusService.checkAndAwardGoldBonus(userId, seasonStart, seasonEnd, seasonId)) {
        goldCount++;
      }

      // Bonus Diamante (32+ jornadas de 35)
      if (await bonusService.checkAndAwardDiamondBonus(userId, seasonStart, seasonEnd, seasonId)) {
        diamondCount++;
      }

      // Bonus Black (16+ mesas finales)
      if (await bonusService.checkAndAwardBlackBonus(userId, seasonStart, seasonEnd, seasonId)) {
        blackCount++;
      }

      // Bonus Plata (10+ jornadas en el mes actual)
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      if (await bonusService.checkAndAwardSilverBonus(userId, year, month)) {
        silverCount++;
      }

      // Bonus Bronce (3 jornadas en última semana - Lunes, Miércoles, Viernes)
      // Calcular semana pasada
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysToLastMonday = (dayOfWeek + 6) % 7; // días desde último lunes
      const lastMonday = new Date(today);
      lastMonday.setDate(today.getDate() - daysToLastMonday - 7); // Lunes de la semana pasada
      lastMonday.setHours(0, 0, 0, 0);
      
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);
      lastSunday.setHours(23, 59, 59, 999);

      if (await bonusService.checkAndAwardBronzeBonus(userId, lastMonday, lastSunday)) {
        bronzeCount++;
      }
    }

    console.log('\n📊 Resultados:');
    console.log(`  🥉 Bonus Bronce otorgados: ${bronzeCount}`);
    console.log(`  🥈 Bonus Plata otorgados: ${silverCount}`);
    console.log(`  🥇 Bonus Oro otorgados: ${goldCount}`);
    console.log(`  💎 Bonus Diamante otorgados: ${diamondCount}`);
    console.log(`  ⚫ Bonus Black otorgados: ${blackCount}`);

    console.log('\n✅ Cálculo de bonus completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
