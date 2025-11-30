/**
 * Script para crear un torneo de prueba para hoy con participantes
 * Ejecutar: npx ts-node scripts/create_test_tournament_today.ts
 */

import { Tournament } from '../src/models/Tournament';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';
import { Payment } from '../src/models/Payment';
import sequelize from '../src/services/database';

async function createTestTournament() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    // Fecha de hoy
    const today = new Date();
    today.setHours(20, 0, 0, 0); // 8 PM
    
    console.log(`\n📅 Creando torneo para hoy: ${today.toLocaleDateString()}`);

    // 1. Crear torneo
    const tournament = await Tournament.create({
      tournament_name: `Torneo Test - ${today.toLocaleDateString()}`,
      start_date: today,
      buy_in: 20,
      re_entry: true,
      knockout_bounty: 5,
      starting_stack: 20000,
      blind_levels: 15,
      small_blind: 25,
      count_to_ranking: true,
      double_points: false,
      punctuality_discount: 2,
      registration_open: true
    } as any);

    console.log(`✓ Torneo creado: ${(tournament as any).tournament_name} (ID: ${(tournament as any).id})`);

    // 2. Obtener usuarios existentes
    const users = await User.findAll({
      where: { is_deleted: false },
      limit: 15
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log(`\n👥 Registrando ${users.length} jugadores...`);

    // 3. Registrar jugadores con pagos variados
    const tournamentId = (tournament as any).id;
    let registrationCount = 0;

    for (const user of users) {
      const userId = (user as any).id;
      const username = (user as any).username;

      // Determinar tipo de acción aleatoriamente
      const actionTypes = [1, 1, 1, 1, 2, 2, 3]; // Más buy-ins que re-entries
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      
      // Puntualidad aleatoria
      const punctuality = Math.random() > 0.3; // 70% puntuales

      // Crear registro
      const registration = await Registration.create({
        user_id: userId,
        tournament_id: tournamentId,
        registration_date: new Date(),
        punctuality: punctuality,
        action_type: actionType
      } as any);

      // Calcular monto esperado (con descuento de puntualidad si aplica)
      const buyIn = 20;
      const discount = punctuality ? 2 : 0;
      const expectedAmount = buyIn - discount;

      // Determinar si pagó completo, parcial o nada
      const paymentScenarios = [
        { paid: true, amount: expectedAmount, label: 'Pagado completo' },
        { paid: true, amount: expectedAmount, label: 'Pagado completo' },
        { paid: true, amount: expectedAmount, label: 'Pagado completo' },
        { paid: false, amount: expectedAmount * 0.5, label: 'Pago parcial' },
        { paid: false, amount: 0, label: 'Sin pagar' }
      ];
      const scenario = paymentScenarios[Math.floor(Math.random() * paymentScenarios.length)];

      // Crear pago
      await Payment.create({
        user_id: userId,
        amount: expectedAmount,
        payment_date: new Date(),
        source: 'tournament',
        reference_id: (registration as any).id,
        paid: scenario.paid,
        paid_amount: scenario.amount,
        method: scenario.paid ? 'Efectivo' : null,
        personal_account: false,
        recorded_by_name: 'Admin'
      } as any);

      const actionLabel = actionType === 1 ? 'Buy-in' : (actionType === 2 ? 'Re-entry' : 'Duplo');
      console.log(`  ✓ ${username} - ${actionLabel} - ${punctuality ? 'Puntual' : 'Tarde'} - ${scenario.label}`);
      registrationCount++;
    }

    // 4. Calcular resumen
    const registrations = await Registration.findAll({ where: { tournament_id: tournamentId } });
    const regIds = registrations.map(r => (r as any).id);
    const payments = await Payment.findAll({ where: { reference_id: regIds } as any });
    
    let totalPot = 0;
    let totalExpected = 0;
    let totalPaid = 0;
    
    for (const payment of payments) {
      const expected = Number((payment as any).amount) || 0;
      const paid = Number((payment as any).paid_amount) || 0;
      totalExpected += expected;
      totalPaid += paid;
      if ((payment as any).paid || paid > 0) {
        totalPot += paid;
      }
    }

    const debt = totalExpected - totalPaid;

    console.log(`\n📊 Resumen del Torneo:`);
    console.log(`════════════════════════════════════════`);
    console.log(`🎰 Total registros: ${registrationCount}`);
    console.log(`💰 Pozo acumulado: ${totalPot.toFixed(2)} EUR`);
    console.log(`💵 Monto esperado: ${totalExpected.toFixed(2)} EUR`);
    console.log(`💸 Monto pagado: ${totalPaid.toFixed(2)} EUR`);
    console.log(`📉 Deuda total: ${debt.toFixed(2)} EUR`);
    console.log(`════════════════════════════════════════`);

    // Calcular comisiones y premios
    const commissionPct = 20;
    const commission = totalPot * (commissionPct / 100);
    const prizePool = totalPot - commission;

    console.log(`\n💼 Comisiones (20%):`);
    console.log(`  🏢 Casa (18%): ${(totalPot * 0.18).toFixed(2)} EUR`);
    console.log(`  🏆 Temporada (1%): ${(totalPot * 0.01).toFixed(2)} EUR`);
    console.log(`  ⭐ Anual (1%): ${(totalPot * 0.01).toFixed(2)} EUR`);
    console.log(`  ═══════════════════════════════════`);
    console.log(`  Total comisión: ${commission.toFixed(2)} EUR`);

    console.log(`\n🎁 Premios sugeridos:`);
    console.log(`  Pozo para premios: ${prizePool.toFixed(2)} EUR`);
    console.log(`  1º lugar (23%): ${(prizePool * 0.23).toFixed(2)} EUR`);
    console.log(`  2º lugar (17%): ${(prizePool * 0.17).toFixed(2)} EUR`);
    console.log(`  3º lugar (14%): ${(prizePool * 0.14).toFixed(2)} EUR`);

    // Calcular puntos por cajas
    const dayOfWeek = today.getDay();
    const isFriday = dayOfWeek === 5;
    const pointsPerBox = isFriday ? 200 : 150;
    const totalBoxPoints = pointsPerBox * registrationCount;

    console.log(`\n🏆 Puntos de Ranking:`);
    console.log(`  Día: ${isFriday ? 'Viernes' : 'Lunes/Miércoles'}`);
    console.log(`  Puntos por caja: ${pointsPerBox}`);
    console.log(`  Total cajas: ${registrationCount}`);
    console.log(`  Total puntos a repartir: ${totalBoxPoints}`);
    console.log(`  1º lugar (23%): ${Math.round(totalBoxPoints * 0.23)} pts`);
    console.log(`  2º lugar (17%): ${Math.round(totalBoxPoints * 0.17)} pts`);
    console.log(`  3º lugar (14%): ${Math.round(totalBoxPoints * 0.14)} pts`);

    console.log(`\n✅ Torneo creado exitosamente!`);
    console.log(`\n🌐 Accede a: http://localhost:3000/admin/games/tournaments/${tournamentId}`);
    console.log(`\n📝 Pasos siguientes:`);
    console.log(`  1. Cerrar inscripciones (si ya comenzó el torneo)`);
    console.log(`  2. Hacer clic en "Finalizar Torneo y Asignar Premios"`);
    console.log(`  3. Asignar posiciones y premios en el modal`);
    console.log(`  4. Confirmar para guardar todo`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

createTestTournament();
