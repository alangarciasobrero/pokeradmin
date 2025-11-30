/**
 * Script para crear un torneo completo del día de hoy con:
 * - 50 participantes de usuarios existentes
 * - Pagos variables (algunos pagan, otros no)
 * - Deudas mixtas (algunos con deuda, otros sin deuda)
 * - Cierre del torneo con cálculo de resultados
 * - Rankings históricos mixtos (algunos usuarios con historical_points, otros sin)
 */

import sequelize from '../src/services/database';
import { Tournament } from '../src/models/Tournament';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';
import { Payment } from '../src/models/Payment';
import { Result } from '../src/models/Result';
import { HistoricalPoint } from '../src/models/HistoricalPoint';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a DB establecida');

    // 1. Obtener todos los usuarios existentes (necesitamos al menos 50)
    const users = await User.findAll({ where: { role: 'user' }, order: [['id', 'ASC']] });
    console.log(`✓ Encontrados ${users.length} usuarios en la base de datos`);

    if (users.length < 50) {
      console.error(`❌ Se necesitan al menos 50 usuarios. Solo hay ${users.length}. Ejecuta seed_bulk_demo.ts primero.`);
      process.exit(1);
    }

    // 2. Crear torneo de hoy
    const today = new Date();
    today.setHours(20, 0, 0, 0); // 8 PM

    const tournament = await Tournament.create({
      tournament_name: `Torneo Demo Completo - ${today.toLocaleDateString('es-ES')}`,
      start_date: today,
      buy_in: 1500,
      re_entry: 2,
      knockout_bounty: 300,
      starting_stack: 15000,
      count_to_ranking: true,
      double_points: false,
      blind_levels: 10,
      small_blind: 50,
      punctuality_discount: 10, // 10% descuento por puntualidad
    } as any);

    console.log(`✓ Torneo creado: ID=${tournament.id} "${tournament.tournament_name}"`);

    // 3. Inscribir 50 participantes aleatorios
    const selectedUsers = users.slice(0, 50);
    const registrations: Registration[] = [];

    for (let i = 0; i < selectedUsers.length; i++) {
      const user = selectedUsers[i];
      const punctual = Math.random() > 0.3; // 70% llegan puntuales
      
      const reg = await Registration.create({
        user_id: user.id,
        tournament_id: tournament.id,
        registration_date: new Date(),
        punctuality: punctual,
      } as any);

      registrations.push(reg);
      
      // Crear historical_point de attendance para algunos (50% tienen historial previo)
      if (Math.random() > 0.5) {
        await HistoricalPoint.create({
          record_date: new Date(),
          user_id: user.id,
          season_id: 1,
          tournament_id: tournament.id,
          result_id: null,
          action_type: 'attendance',
          description: `Asistencia - ${tournament.tournament_name}`,
          points: 50, // Puntos por asistencia
        } as any);
      }
    }

    console.log(`✓ ${registrations.length} inscripciones creadas`);

    // 4. Crear pagos variables
    let totalPaid = 0;
    let totalDebt = 0;
    const paymentsCreated: Payment[] = [];

    for (const reg of registrations) {
      const user = selectedUsers.find(u => u.id === reg.user_id)!;
      const buyIn = punctualityDiscount(tournament.buy_in, reg.punctuality, tournament.punctuality_discount);
      
      // Decidir si paga completo, parcial o nada
      const rand = Math.random();
      let amountPaid = 0;
      let debt = 0;

      if (rand < 0.6) {
        // 60% pagan completo
        amountPaid = buyIn;
        debt = 0;
      } else if (rand < 0.85) {
        // 25% pagan parcial (50-90% del buy-in)
        amountPaid = Math.floor(buyIn * (0.5 + Math.random() * 0.4));
        debt = buyIn - amountPaid;
      } else {
        // 15% no pagan nada
        amountPaid = 0;
        debt = buyIn;
      }

      if (amountPaid > 0) {
        const payment = await Payment.create({
          user_id: user.id,
          amount: amountPaid,
          payment_date: new Date(),
          payment_method: Math.random() > 0.5 ? 'cash' : 'transfer',
          description: `Pago torneo #${tournament.id} - ${user.username}`,
          tournament_id: tournament.id,
          status: debt > 0 ? 'partial' : 'paid',
        } as any);
        paymentsCreated.push(payment);
        totalPaid += amountPaid;
      }

      if (debt > 0) {
        totalDebt += debt;
      }
    }

    console.log(`✓ ${paymentsCreated.length} pagos creados`);
    console.log(`  - Total pagado: $${totalPaid}`);
    console.log(`  - Total deuda: $${totalDebt}`);

    // 5. Cerrar torneo y crear resultados (top 20 posiciones)
    const positions = 20; // Vamos a registrar resultados solo para top 20
    const results: Result[] = [];

    // Puntos por posición (tabla estándar)
    const pointsTable = [1000, 800, 650, 500, 400, 350, 300, 250, 200, 180, 160, 140, 120, 100, 90, 80, 70, 60, 50, 40];

    for (let pos = 1; pos <= positions; pos++) {
      const user = selectedUsers[pos - 1]; // Usar los primeros 20 usuarios como top 20
      const isFinalTable = pos <= 9; // Top 9 llegan a mesa final

      const result = await Result.create({
        tournament_id: tournament.id,
        user_id: user.id,
        position: pos,
        final_table: isFinalTable,
      } as any);

      results.push(result);

      // Crear historical_points por placement
      const points = pointsTable[pos - 1] || 20;
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: user.id,
        season_id: 1,
        tournament_id: tournament.id,
        result_id: result.id,
        action_type: 'placement',
        description: `Posición ${pos} - ${tournament.tournament_name}`,
        points: points,
      } as any);

      // Bonus por mesa final
      if (isFinalTable) {
        await HistoricalPoint.create({
          record_date: new Date(),
          user_id: user.id,
          season_id: 1,
          tournament_id: tournament.id,
          result_id: result.id,
          action_type: 'final_table',
          description: `Mesa final - ${tournament.tournament_name}`,
          points: 100, // Bonus por llegar a mesa final
        } as any);
      }

      // Actualizar current_points del usuario (simulando cálculo de ranking)
      const currentPoints = user.current_points || 0;
      const extraPoints = isFinalTable ? points + 100 : points;
      await User.update(
        { current_points: currentPoints + extraPoints },
        { where: { id: user.id } }
      );
    }

    console.log(`✓ ${results.length} resultados creados (top ${positions})`);
    console.log(`  - ${results.filter(r => r.final_table).length} llegaron a mesa final`);

    // 7. Calcular y distribuir puntos por cajas
    console.log('\n💎 Calculando puntos por cajas...');
    const tournamentDate = today;
    const dayOfWeek = tournamentDate.getDay();
    const pointsPerBox = (dayOfWeek === 5) ? 200 : 150; // Viernes=200, resto=150
    const totalBoxPoints = pointsPerBox * registrations.length;
    
    console.log(`  - Día de la semana: ${['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][dayOfWeek]}`);
    console.log(`  - Puntos por caja: ${pointsPerBox}`);
    console.log(`  - Total cajas: ${registrations.length}`);
    console.log(`  - Puntos totales a distribuir: ${totalBoxPoints}`);

    // Distribuir entre mesa final
    const finalTableUsers = results.filter(r => r.final_table).map(r => (r as any).user_id);
    if (finalTableUsers.length > 0) {
      const percentages = [20, 18, 16, 14, 12, 10, 6, 4]; // Top 8
      const sum = percentages.reduce((s, p) => s + p, 0);
      const normalized = percentages.map(p => (p / sum) * 100);

      for (let i = 0; i < Math.min(finalTableUsers.length, normalized.length); i++) {
        const userId = finalTableUsers[i];
        const pct = normalized[i];
        const points = Math.round((pct / 100) * totalBoxPoints);

        await HistoricalPoint.create({
          record_date: new Date(),
          user_id: userId,
          season_id: 1,
          tournament_id: tournament.id,
          result_id: null,
          action_type: 'bonus',
          description: `Puntos por cajas - Mesa final posición ${i + 1} (${pct.toFixed(1)}%)`,
          points: points,
        } as any);
      }
      console.log(`  ✓ Distribuidos ${totalBoxPoints} puntos entre ${finalTableUsers.length} jugadores de mesa final`);
    }

    // 8. Estadísticas finales
    console.log('\n📊 RESUMEN DEL TORNEO:');
    console.log(`  Torneo ID: ${tournament.id}`);
    console.log(`  Nombre: ${tournament.tournament_name}`);
    console.log(`  Fecha: ${tournament.start_date.toLocaleDateString('es-ES')}`);
    console.log(`  Buy-in: $${tournament.buy_in}`);
    console.log(`  Participantes: ${registrations.length}`);
    console.log(`  Puntuales: ${registrations.filter(r => r.punctuality).length}`);
    console.log(`  Total pagado: $${totalPaid}`);
    console.log(`  Total deuda: $${totalDebt}`);
    console.log(`  Resultados registrados: ${results.length}`);
    console.log(`  Mesa final: ${results.filter(r => r.final_table).length} jugadores`);
    console.log(`  Puntos por cajas distribuidos: ${totalBoxPoints || 0}`);

    // 9. Top 5 del ranking actualizado
    const topUsers = await User.findAll({
      order: [['current_points', 'DESC']],
      limit: 5,
    });

    console.log('\n🏆 TOP 5 RANKING (después del torneo):');
    topUsers.forEach((u, idx) => {
      console.log(`  ${idx + 1}. ${u.full_name || u.username} - ${u.current_points} puntos`);
    });

    console.log('\n✅ Script completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

function punctualityDiscount(buyIn: number, punctual: boolean, discountPercent: number): number {
  if (!punctual || !discountPercent) return buyIn;
  return buyIn * (1 - discountPercent / 100);
}

main();
