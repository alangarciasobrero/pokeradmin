import sequelize from '../src/services/database';
import bcrypt from 'bcrypt';
import User from '../src/models/User';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';
import Payment from '../src/models/Payment';
import CashGame from '../src/models/CashGame';
import CashParticipant from '../src/models/CashParticipant';
import Season from '../src/models/Season';
import HistoricalPoint from '../src/models/HistoricalPoint';
import { Result } from '../src/models/Result';

/**
 * Script para crear datos de demostración realistas en producción
 * Incluye: temporada demo, 20 usuarios con nombres reales, torneos con sistema de ranking completo
 */

async function run() {
  try {
    console.log('🎲 Conectando a la base de datos...');
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Conexión exitosa\n');

    // ============= TEMPORADA DE DEMO =============
    console.log('📅 Creando temporada de demo...');
    const [season] = await Season.findOrCreate({
      where: { nombre: 'Temporada Demo 2026' },
      defaults: {
        nombre: 'Temporada Demo 2026',
        descripcion: 'Temporada de demostración con datos de ejemplo',
        fecha_inicio: new Date('2026-01-01'),
        fecha_fin: new Date('2026-12-31'),
        torneos_totales: 24,
        torneos_jugados: 8,
        estado: 'activa'
      } as any
    });
    console.log(`✅ Temporada creada: ${season.nombre}\n`);

    // ============= USUARIOS CON NOMBRES REALES =============
    console.log('👥 Creando 20 usuarios con nombres reales...');
    
    const demoUsers = [
      { first: 'Alejandro', last: 'García', nick: 'AlexG' },
      { first: 'María', last: 'Rodríguez', nick: 'MariaR' },
      { first: 'Carlos', last: 'López', nick: 'Carlitos' },
      { first: 'Laura', last: 'Martínez', nick: 'LauraM' },
      { first: 'Diego', last: 'Fernández', nick: 'DiegoF' },
      { first: 'Sofía', last: 'González', nick: 'Sofi' },
      { first: 'Javier', last: 'Sánchez', nick: 'Javi' },
      { first: 'Ana', last: 'Pérez', nick: 'Anita' },
      { first: 'Pablo', last: 'Romero', nick: 'Pablito' },
      { first: 'Lucía', last: 'Torres', nick: 'Luci' },
      { first: 'Miguel', last: 'Ramírez', nick: 'Mike' },
      { first: 'Elena', last: 'Flores', nick: 'Ele' },
      { first: 'Fernando', last: 'Silva', nick: 'Fer' },
      { first: 'Isabel', last: 'Morales', nick: 'Isa' },
      { first: 'Ricardo', last: 'Castro', nick: 'Ricky' },
      { first: 'Patricia', last: 'Ortiz', nick: 'Paty' },
      { first: 'Andrés', last: 'Vargas', nick: 'Andy' },
      { first: 'Natalia', last: 'Mendoza', nick: 'Nati' },
      { first: 'Roberto', last: 'Herrera', nick: 'Roby' },
      { first: 'Valentina', last: 'Cruz', nick: 'Vale' }
    ];

    const users: User[] = [];
    const passwordHash = await bcrypt.hash('demo123', 10);

    for (let i = 0; i < demoUsers.length; i++) {
      const { first, last, nick } = demoUsers[i];
      const username = `demo_${nick.toLowerCase()}`;
      const email = `${first.toLowerCase()}.${last.toLowerCase()}@demo.com`;

      const [user] = await User.findOrCreate({
        where: { username },
        defaults: {
          username,
          password_hash: passwordHash,
          first_name: first,
          last_name: last,
          full_name: `${first} ${last}`,
          email,
          nickname: nick,
          phone_number: `+1 555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          current_points: 0, // Se calculará desde HistoricalPoints
          role: 'user',
          is_player: true,
          suspended: false,
          is_deleted: false
        } as any
      });
      users.push(user);
      console.log(`  ✓ ${user.full_name} (@${username})`);
    }
    console.log(`✅ ${users.length} usuarios creados\n`);

    // ============= TORNEOS DE RANKING =============
    console.log('🎰 Creando torneos con sistema de ranking...');
    
    // Tabla de puntos por posición
    const pointsTable = [100, 75, 60, 50, 45, 40, 36, 32, 29, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6];
    
    // Porcentajes para distribución de pozo de cajas (top 9)
    const poolPercentages = [23, 17, 14, 11, 9, 8, 7, 6, 5];
    
    const tournamentConfigs = [
      { weeks_ago: 2, day: 'Lunes', dayOfWeek: 1, count_to_ranking: true, double_points: false, buyIn: 50 },
      { weeks_ago: 2, day: 'Miércoles', dayOfWeek: 3, count_to_ranking: true, double_points: false, buyIn: 50 },
      { weeks_ago: 2, day: 'Viernes', dayOfWeek: 5, count_to_ranking: true, double_points: true, buyIn: 50 },
      { weeks_ago: 1, day: 'Domingo', dayOfWeek: 0, count_to_ranking: false, double_points: false, buyIn: 50 },
      { weeks_ago: 0, day: 'Lunes', dayOfWeek: 1, count_to_ranking: true, double_points: false, buyIn: 50 }
    ];

    for (const config of tournamentConfigs) {
      // Calcular el lunes de referencia de la semana objetivo
      const today = new Date();
      const currentDay = today.getDay();
      
      // Encontrar el lunes más reciente
      let daysBackToMonday = (currentDay - 1 + 7) % 7;
      if (daysBackToMonday === 0 && currentDay !== 1) daysBackToMonday = 7;
      
      // Ir a la semana objetivo
      daysBackToMonday += config.weeks_ago * 7;
      
      const monday = new Date();
      monday.setDate(monday.getDate() - daysBackToMonday);
      monday.setHours(20, 0, 0, 0);
      
      // Desde el lunes, calcular el día específico
      const daysFromMonday = (config.dayOfWeek - 1 + 7) % 7;
      const date = new Date(monday);
      date.setDate(date.getDate() + daysFromMonday);
      
      const [tournament] = await Tournament.findOrCreate({
        where: { 
          start_date: date.toISOString().split('T')[0],
          tournament_name: `Torneo ${config.day} ${date.toLocaleDateString()}`
        } as any,
        defaults: {
          tournament_name: `Torneo ${config.day} ${date.toLocaleDateString()}`,
          start_date: date,
          buy_in: config.buyIn,
          season_id: season.id,
          gaming_date: date,
          count_to_ranking: config.count_to_ranking,
          double_points: config.double_points,
          registration_open: false
        } as any
      });

      // Grupo CORE: Primeros 7 jugadores asisten SIEMPRE a L+M+V de la semana hace 2 semanas
      const coreGroup = users.slice(0, 7);
      const isWeek2LMV = config.weeks_ago === 2; // Semana hace 2 semanas
      
      let selectedUsers: User[] = [];
      
      if (isWeek2LMV && [1, 3, 5].includes(config.dayOfWeek)) {
        // Para L+M+V de la semana hace 2 semanas, garantizar que el core group asista
        selectedUsers = [...coreGroup];
        // Agregar 5-8 jugadores aleatorios adicionales
        const randomCount = Math.floor(Math.random() * 4) + 5;
        const additionalPlayers = [...users.slice(7)].sort(() => 0.5 - Math.random()).slice(0, randomCount);
        selectedUsers = [...selectedUsers, ...additionalPlayers];
      } else {
        // Para otros torneos, selección aleatoria normal
        const numPlayers = Math.floor(Math.random() * 4) + 12;
        selectedUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, numPlayers);
      }
      
      let buyinCount = 0;
      let reentryCount = 0;
      
      // Crear registraciones (buy-ins y algunos reentries)
      for (const user of selectedUsers) {
        const hasReentry = Math.random() < 0.25; // 25% hacen reentry
        
        // Buy-in inicial (action_type = 1)
        await Registration.findOrCreate({
          where: { tournament_id: tournament.id, user_id: user.id },
          defaults: {
            tournament_id: tournament.id,
            user_id: user.id,
            action_type: 1,
            punctuality: Math.random() > 0.3
          } as any
        });
        buyinCount++;
        
        // Puntos por attendance (solo si cuenta para ranking)
        if (config.count_to_ranking) {
          const attendancePoints = config.double_points ? 200 : 100;
          await HistoricalPoint.create({
            record_date: date,
            user_id: user.id,
            season_id: season.id,
            tournament_id: tournament.id,
            result_id: null,
            action_type: 'attendance',
            description: `Asistencia - ${tournament.tournament_name}`,
            points: attendancePoints
          } as any);
        }
        
        // Reentry si aplica (action_type = 2)
        if (hasReentry) {
          await Registration.create({
            tournament_id: tournament.id,
            user_id: user.id,
            action_type: 2,
            punctuality: false
          } as any);
          reentryCount++;
          
          // Puntos por reentry (solo si cuenta para ranking)
          if (config.count_to_ranking) {
            const reentryPoints = config.double_points ? 200 : 100;
            await HistoricalPoint.create({
              record_date: date,
              user_id: user.id,
              season_id: season.id,
              tournament_id: tournament.id,
              result_id: null,
              action_type: 'reentry',
              description: `Re-entry - ${tournament.tournament_name}`,
              points: reentryPoints
            } as any);
          }
        }
        
        // Pagos (simplificado - sin tournament_id)
        const totalAmount = hasReentry ? config.buyIn * 2 : config.buyIn;
        await Payment.create({
          user_id: user.id,
          amount: totalAmount,
          payment_date: date,
          gaming_date: date,
          paid: Math.random() > 0.15,
          paid_amount: totalAmount,
          method: Math.random() > 0.5 ? 'cash' : 'transfer'
        } as any);
      }
      
      // Crear resultados y distribuir puntos
      for (let pos = 1; pos <= selectedUsers.length; pos++) {
        const user = selectedUsers[pos - 1];
        const isFinalTable = pos <= 9;
        
        const result = await Result.create({
          tournament_id: tournament.id,
          user_id: user.id,
          position: pos,
          final_table: isFinalTable
        } as any);
        
        // Puntos por placement (solo si cuenta para ranking)
        if (config.count_to_ranking) {
          const basePoints = pointsTable[pos - 1] || 0;
          const placementPoints = config.double_points ? basePoints * 2 : basePoints;
          
          if (placementPoints > 0) {
            await HistoricalPoint.create({
              record_date: date,
              user_id: user.id,
              season_id: season.id,
              tournament_id: tournament.id,
              result_id: result.id,
              action_type: 'placement',
              description: `Posición ${pos} - ${tournament.tournament_name}`,
              points: placementPoints
            } as any);
          }
        }
      }
      
      // Distribuir pozo de cajas entre top 9 (solo si cuenta para ranking)
      if (config.count_to_ranking) {
        const isFriday = config.dayOfWeek === 5;
        const buyinPointsPerBox = isFriday ? 200 : 150;
        const reentryPointsPerBox = 100;
        
        let totalPoolPoints = (buyinCount * buyinPointsPerBox) + (reentryCount * reentryPointsPerBox);
        
        // Si es doble ranking, el pozo también se duplica
        if (config.double_points) {
          totalPoolPoints *= 2;
        }
        
        // Distribuir entre top 9
        for (let i = 0; i < Math.min(9, selectedUsers.length); i++) {
          const user = selectedUsers[i];
          const percentage = poolPercentages[i];
          const poolPoints = Math.round((percentage / 100) * totalPoolPoints);
          
          await HistoricalPoint.create({
            record_date: date,
            user_id: user.id,
            season_id: season.id,
            tournament_id: tournament.id,
            result_id: null,
            action_type: 'bonus',
            description: `Puntos por cajas - Posición ${i + 1} (${percentage}%)`,
            points: poolPoints
          } as any);
        }
        
        console.log(`  ✓ ${config.day} (${config.double_points ? 'DOBLE' : 'normal'}) - ${selectedUsers.length} jugadores - Pozo: ${totalPoolPoints} pts`);
      } else {
        console.log(`  ✓ ${config.day} (NO cuenta para ranking) - ${selectedUsers.length} jugadores`);
      }
    }
    console.log(`✅ Torneos creados con sistema de puntos\n`);
    
    // ============= BONUS SEMANAL =============
    console.log('🎁 Calculando bonus de asistencia semanal...');
    
    const { Op } = await import('sequelize');
    
    // Identificar la semana con lunes, miércoles y viernes (semana hace 2 semanas)
    const today = new Date();
    const currentDay = today.getDay();
    
    // Calcular lunes de hace 2 semanas
    let daysBackToMonday = (currentDay - 1 + 7) % 7; // Días hasta el lunes más reciente
    if (daysBackToMonday === 0 && currentDay !== 1) daysBackToMonday = 7;
    daysBackToMonday += 14; // Ir a 2 semanas atrás
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - daysBackToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Domingo
    weekEnd.setHours(23, 59, 59, 999);
    
    let bonusCount = 0;
    
    for (const user of users) {
      // Contar asistencias en esa semana (días específicos)
      const weekTournaments = await Registration.findAll({
        include: [{
          model: Tournament.unscoped(),
          as: 'tournament',
          where: {
            start_date: { [Op.between]: [weekStart, weekEnd] },
            count_to_ranking: true
          } as any,
          required: true
        }],
        where: { 
          user_id: user.id,
          action_type: 1 // Solo buy-ins iniciales
        } as any
      });
      
      // Verificar que asistió lunes (1), miércoles (3) y viernes (5)
      const days = new Set<number>();
      for (const reg of weekTournaments) {
        const tournament = (reg as any).tournament;
        const day = new Date(tournament.start_date).getDay();
        days.add(day);
      }
      
      if (days.has(1) && days.has(3) && days.has(5)) {
        // Otorgar bonus bronce
        const weekIdentifier = `${weekStart.toISOString().split('T')[0]}`;
        const existing = await HistoricalPoint.findOne({
          where: {
            user_id: user.id,
            action_type: 'bonus',
            description: { [Op.like]: `%Bronce - Semana ${weekIdentifier}%` }
          } as any
        });
        
        if (!existing) {
          await HistoricalPoint.create({
            record_date: new Date(),
            user_id: user.id,
            season_id: season.id,
            tournament_id: null,
            result_id: null,
            action_type: 'bonus',
            description: `🥉 Bonus Bronce - Semana ${weekIdentifier} (L+M+V)`,
            points: 500
          } as any);
          bonusCount++;
        }
      }
    }
    
    console.log(`✅ ${bonusCount} jugadores recibieron Bonus Bronce\n`);

    // ============= PARTIDAS DE CASH GAME =============
    console.log('💰 Creando partidas de cash game...');
    
    const cashDates = [
      { days_ago: 27 },
      { days_ago: 20 },
      { days_ago: 13 },
      { days_ago: 6 }
    ];

    for (const { days_ago } of cashDates) {
      const date = new Date();
      date.setDate(date.getDate() + days_ago);
      
      const [cashGame] = await CashGame.findOrCreate({
        where: { 
          gaming_date: date.toISOString().split('T')[0]
        },
        defaults: {
          gaming_date: date,
          start_datetime: date,
          small_blind: 1,
          default_buyin: 50
        } as any
      });

      const numParticipants = Math.floor(Math.random() * 5) + 5; // Entre 5 y 9 jugadores
      const selectedUsers = users.sort(() => 0.5 - Math.random()).slice(0, numParticipants);
      
      let totalCollected = 0;

      for (const user of selectedUsers) {
        const buyIns = Math.floor(Math.random() * 3) + 1; // 1 a 3 buy-ins
        const buyInAmount = 50;
        const totalBuyIn = buyIns * buyInAmount;
        const cashOut = totalBuyIn + (Math.random() - 0.5) * 100; // Puede ganar o perder
        const netResult = cashOut - totalBuyIn;

        totalCollected += totalBuyIn;

        await CashParticipant.findOrCreate({
          where: { 
            cash_game_id: cashGame.id,
            user_id: user.id
          },
          defaults: {
            cash_game_id: cashGame.id,
            user_id: user.id,
            buy_ins: buyIns,
            buy_in_amount: buyInAmount,
            total_buy_in: totalBuyIn,
            cash_out: cashOut,
            net_result: netResult
          } as any
        });
      }

      (cashGame as any).total_collected = totalCollected;
      await cashGame.save();

      console.log(`  ✓ Cash Game ${date.toLocaleDateString()} - ${numParticipants} jugadores - Total: $${totalCollected}`);
    }
    console.log(`✅ Partidas de cash creadas\n`);

    // ============= ACTUALIZAR CURRENT_POINTS =============
    console.log('📊 Calculando puntos totales desde HistoricalPoints...');
    
    for (const user of users) {
      const totalPoints = await HistoricalPoint.sum('points', {
        where: { user_id: user.id } as any
      });
      
      await user.update({ current_points: totalPoints || 0 });
    }
    
    // Top 5 para mostrar
    const topUsers = await User.findAll({
      where: { id: users.map(u => u.id) },
      order: [['current_points', 'DESC']],
      limit: 5
    });
    
    console.log('✅ Puntos calculados\n');
    console.log('🏆 TOP 5 RANKING:');
    topUsers.forEach((u, idx) => {
      console.log(`  ${idx + 1}. ${u.full_name} - ${u.current_points} puntos`);
    });

    // ============= RESUMEN =============
    console.log('\n📊 RESUMEN DE DATOS CREADOS:');
    console.log(`   • 1 temporada activa (Demo 2026)`);
    console.log(`   • ${users.length} usuarios con nombres reales`);
    console.log(`   • 5 torneos (4 cuentan para ranking, 1 domingo no cuenta)`);
    console.log(`   • ${cashDates.length} partidas de cash game`);
    console.log(`   • Sistema de ranking con HistoricalPoints completo`);
    console.log(`   • Bonus semanal calculado (Bronce 500pts)`);
    console.log(`\n✅ ¡Datos de demostración creados exitosamente!`);
    console.log(`\n🔐 Credenciales para usuarios demo:`);
    console.log(`   Usuario: demo_[nickname] (ej: demo_alexg)`);
    console.log(`   Contraseña: demo123\n`);

    await sequelize.close();
  } catch (err) {
    console.error('❌ Error creando datos de demo:', err);
    try { await sequelize.close(); } catch (e) {}
    process.exit(1);
  }
}

run();
