/**
 * Script para crear un torneo para hoy y dos mesas cash con datos reales
 * Ejecutar: npx ts-node scripts/create_today_data.ts
 */

import { Tournament } from '../src/models/Tournament';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';
import { Payment } from '../src/models/Payment';
import { CashGame } from '../src/models/CashGame';
import { CashParticipant } from '../src/models/CashParticipant';
import sequelize from '../src/services/database';

async function createTodayData() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Obtener usuarios reales
    const users = await User.findAll({
      where: { 
        is_deleted: false,
        is_player: true 
      },
      limit: 30
    });

    if (users.length < 10) {
      console.log('❌ No hay suficientes usuarios en la base de datos');
      return;
    }

    console.log(`✓ Encontrados ${users.length} usuarios reales\n`);

    // ========================================
    // 1. CREAR TORNEO PARA HOY
    // ========================================
    const today = new Date();
    today.setHours(20, 0, 0, 0); // 8 PM
    
    console.log(`📅 Creando torneo para hoy: ${today.toLocaleDateString()} a las ${today.toLocaleTimeString()}\n`);

    const tournament = await Tournament.create({
      tournament_name: `Torneo Viernes - ${today.toLocaleDateString()}`,
      start_date: today,
      buy_in: 30,
      re_entry: true,
      knockout_bounty: 10,
      starting_stack: 20000,
      blind_levels: 15,
      small_blind: 25,
      count_to_ranking: true,
      double_points: false,
      punctuality_discount: 3,
      registration_open: true
    } as any);

    console.log(`✅ Torneo creado: ${(tournament as any).tournament_name} (ID: ${(tournament as any).id})`);

    // Seleccionar 12 jugadores para el torneo
    const tournamentPlayers = shuffleArray([...users]).slice(0, 12);
    
    // Registrar jugadores (algunos pagos, algunos no)
    for (let i = 0; i < tournamentPlayers.length; i++) {
      const player = tournamentPlayers[i];
      const isPaid = i < 8; // Los primeros 8 pagaron, 4 no pagaron
      const isReentry = i < 3; // 3 primeros hicieron reentry
      const isPunctual = i < 10; // 10 llegaron a tiempo
      
      // Registro inicial
      const registration = await Registration.create({
        user_id: player.id,
        tournament_id: (tournament as any).id,
        punctuality: isPunctual,
        position: null,
        action_type: 1 // buyin
      } as any);

      console.log(`  ${isPaid ? '✓' : '✗'} ${player.username} - ${isPaid ? 'PAGADO' : 'NO PAGADO'}`);

      // Crear payment si pagó
      if (isPaid) {
        await Payment.create({
          user_id: player.id,
          amount: (tournament as any).buy_in,
          payment_date: new Date(),
          source: 'tournament',
          reference_id: (registration as any).id,
          paid: true,
          paid_amount: (tournament as any).buy_in,
          method: Math.random() < 0.7 ? 'cash' : 'transfer',
          personal_account: false
        } as any);
      }

      // Agregar reentry si corresponde
      if (isReentry && isPaid) {
        const reentry = await Registration.create({
          user_id: player.id,
          tournament_id: (tournament as any).id,
          punctuality: isPunctual,
          position: null,
          action_type: 2 // reentry
        } as any);

        await Payment.create({
          user_id: player.id,
          amount: (tournament as any).buy_in,
          payment_date: new Date(),
          source: 'tournament',
          reference_id: (reentry as any).id,
          paid: true,
          paid_amount: (tournament as any).buy_in,
          method: Math.random() < 0.5 ? 'cash' : 'transfer',
          personal_account: false
        } as any);

        console.log(`    → Reentry agregado`);
      }
    }

    console.log(`\n✅ ${tournamentPlayers.length} jugadores registrados (${tournamentPlayers.filter((_, i) => i < 8).length} pagados, ${tournamentPlayers.filter((_, i) => i >= 8).length} pendientes)\n`);

    // ========================================
    // 2. CREAR PRIMERA MESA CASH
    // ========================================
    console.log('🎰 Creando Mesa Cash #1\n');
    
    const cashStart1 = new Date();
    cashStart1.setHours(18, 30, 0, 0); // 6:30 PM
    const cashEnd1 = new Date();
    cashEnd1.setHours(23, 45, 0, 0); // 11:45 PM

    const cash1 = await CashGame.create({
      small_blind: 5,
      start_datetime: cashStart1,
      end_datetime: cashEnd1,
      dealer: 'Roberto Gómez',
      total_commission: 0,
      total_tips: 0,
      stakes: '5/10'
    } as any);

    console.log(`✅ Mesa Cash #1 creada (ID: ${(cash1 as any).id})`);
    console.log(`   Horario: ${cashStart1.toLocaleTimeString()} - ${cashEnd1.toLocaleTimeString()}`);
    console.log(`   Stakes: 5/10\n`);

    // Participantes mesa 1 (8 jugadores)
    const cash1Players = shuffleArray(users.filter(u => !tournamentPlayers.includes(u))).slice(0, 8);
    
    const buyInAmounts = [100, 150, 200, 250, 300];
    
    for (let i = 0; i < cash1Players.length; i++) {
      const player = cash1Players[i];
      const buyIn = buyInAmounts[Math.floor(Math.random() * buyInAmounts.length)];
      const isPaid = i < 6; // 6 de 8 pagaron
      const amountPaid = isPaid ? buyIn : 0;
      const method = isPaid ? (Math.random() < 0.7 ? 'cash' : 'transfer') : '';
      
      const joinedAt = new Date(cashStart1);
      joinedAt.setMinutes(joinedAt.getMinutes() + Math.floor(Math.random() * 30));
      
      const leftAt = i < 5 ? new Date(cashEnd1) : null; // 3 siguen jugando
      if (leftAt) {
        leftAt.setMinutes(leftAt.getMinutes() - Math.floor(Math.random() * 20));
      }

      await CashParticipant.create({
        cash_game_id: (cash1 as any).id,
        user_id: player.id,
        seat_number: i + 1,
        buy_in: buyIn,
        amount_paid: amountPaid,
        method: method,
        joined_at: joinedAt,
        left_at: leftAt,
        recorded_by: 'admin'
      } as any);

      const status = leftAt ? 'Salió' : 'Jugando';
      const payment = isPaid ? `✓ $${buyIn} (${method})` : `✗ FIADO $${buyIn}`;
      console.log(`  Asiento ${i + 1}: ${player.username.padEnd(15)} - Buy-in: $${buyIn} - ${payment} - ${status}`);
    }

    console.log(`\n✅ 8 participantes en Mesa #1 (6 pagados, 2 fiados)\n`);

    // ========================================
    // 3. CREAR SEGUNDA MESA CASH
    // ========================================
    console.log('🎰 Creando Mesa Cash #2\n');
    
    const cashStart2 = new Date();
    cashStart2.setHours(19, 0, 0, 0); // 7:00 PM
    const cashEnd2 = new Date();
    cashEnd2.setHours(23, 30, 0, 0); // 11:30 PM

    const cash2 = await CashGame.create({
      small_blind: 10,
      start_datetime: cashStart2,
      end_datetime: cashEnd2,
      dealer: 'María López',
      total_commission: 0,
      total_tips: 0,
      stakes: '10/20'
    } as any);

    console.log(`✅ Mesa Cash #2 creada (ID: ${(cash2 as any).id})`);
    console.log(`   Horario: ${cashStart2.toLocaleTimeString()} - ${cashEnd2.toLocaleTimeString()}`);
    console.log(`   Stakes: 10/20\n`);

    // Participantes mesa 2 (7 jugadores) - stakes más altos
    const remainingUsers = users.filter(u => 
      !tournamentPlayers.includes(u) && 
      !cash1Players.includes(u)
    );
    const cash2Players = shuffleArray(remainingUsers).slice(0, 7);
    
    const highBuyInAmounts = [200, 300, 400, 500];
    
    for (let i = 0; i < cash2Players.length; i++) {
      const player = cash2Players[i];
      const buyIn = highBuyInAmounts[Math.floor(Math.random() * highBuyInAmounts.length)];
      const isPaid = i !== 3 && i !== 5; // 2 de 7 no pagaron
      const amountPaid = isPaid ? buyIn : 0;
      const method = isPaid ? (Math.random() < 0.6 ? 'transfer' : 'cash') : '';
      
      const joinedAt = new Date(cashStart2);
      joinedAt.setMinutes(joinedAt.getMinutes() + Math.floor(Math.random() * 45));
      
      const leftAt = i < 4 ? new Date(cashEnd2) : null; // 3 siguen jugando
      if (leftAt) {
        leftAt.setMinutes(leftAt.getMinutes() - Math.floor(Math.random() * 25));
      }

      await CashParticipant.create({
        cash_game_id: (cash2 as any).id,
        user_id: player.id,
        seat_number: i + 1,
        buy_in: buyIn,
        amount_paid: amountPaid,
        method: method,
        joined_at: joinedAt,
        left_at: leftAt,
        recorded_by: 'admin'
      } as any);

      const status = leftAt ? 'Salió' : 'Jugando';
      const payment = isPaid ? `✓ $${buyIn} (${method})` : `✗ FIADO $${buyIn}`;
      console.log(`  Asiento ${i + 1}: ${player.username.padEnd(15)} - Buy-in: $${buyIn} - ${payment} - ${status}`);
    }

    console.log(`\n✅ 7 participantes en Mesa #2 (5 pagados, 2 fiados)\n`);

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 RESUMEN DE DATOS CREADOS');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log(`🏆 TORNEO:`);
    console.log(`   ${(tournament as any).tournament_name}`);
    console.log(`   ${tournamentPlayers.length} jugadores registrados`);
    console.log(`   8 pagados | 4 pendientes`);
    console.log(`   3 con reentry\n`);
    
    console.log(`🎰 MESA CASH #1:`);
    console.log(`   Stakes: 5/10`);
    console.log(`   8 participantes`);
    console.log(`   6 pagados | 2 fiados\n`);
    
    console.log(`🎰 MESA CASH #2:`);
    console.log(`   Stakes: 10/20`);
    console.log(`   7 participantes`);
    console.log(`   5 pagados | 2 fiados\n`);
    
    console.log('✅ Todos los datos fueron creados exitosamente');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

// Función helper para mezclar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

createTodayData();
