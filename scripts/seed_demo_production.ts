import sequelize from '../src/services/database';
import bcrypt from 'bcrypt';
import User from '../src/models/User';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';
import Payment from '../src/models/Payment';
import CashGame from '../src/models/CashGame';
import CashParticipant from '../src/models/CashParticipant';
import Season from '../src/models/Season';

/**
 * Script para crear datos de demostración realistas en producción
 * Incluye: temporada demo, 20 usuarios con nombres reales, torneos, partidas de cash, pagos
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
      const points = Math.floor(Math.random() * 500) + 100; // Entre 100 y 600 puntos

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
          current_points: points,
          role: 'user',
          is_player: true,
          suspended: false,
          is_deleted: false
        } as any
      });
      users.push(user);
      console.log(`  ✓ ${user.full_name} (@${username}) - ${points} puntos`);
    }
    console.log(`✅ ${users.length} usuarios creados\n`);

    // ============= TORNEOS DE DEMO =============
    console.log('🎰 Creando torneos de demostración...');
    
    const tournamentDates = [
      { days_ago: 30, status: 'completed' },
      { days_ago: 23, status: 'completed' },
      { days_ago: 16, status: 'completed' },
      { days_ago: 9, status: 'completed' },
      { days_ago: 2, status: 'completed' },
      { days_ago: -5, status: 'scheduled' },
      { days_ago: -12, status: 'scheduled' },
      { days_ago: -19, status: 'scheduled' }
    ];

    for (let i = 0; i < tournamentDates.length; i++) {
      const { days_ago, status } = tournamentDates[i];
      const date = new Date();
      date.setDate(date.getDate() + days_ago);
      
      const buyIn = [20, 30, 50, 100][Math.floor(Math.random() * 4)];
      const numPlayers = Math.floor(Math.random() * 8) + 8; // Entre 8 y 15 jugadores
      
      const [tournament] = await Tournament.findOrCreate({
        where: { 
          start_date: date.toISOString().split('T')[0],
          buy_in: buyIn 
        } as any,
        defaults: {
          tournament_name: `Torneo Demo ${date.toLocaleDateString()}`,
          start_date: date,
          buy_in: buyIn,
          season_id: season.id,
          gaming_date: date,
          pinned: status === 'scheduled',
          registration_open: status === 'scheduled'
        } as any
      });

      // Si el torneo está completado, agregar registros y pagos
      if (status === 'completed') {
        const selectedUsers = users.sort(() => 0.5 - Math.random()).slice(0, numPlayers);
        
        for (let j = 0; j < selectedUsers.length; j++) {
          const user = selectedUsers[j];
          const position = j < 3 ? j + 1 : null; // Solo top 3 tienen posición
          const points = position ? [100, 75, 50][position - 1] : Math.floor(Math.random() * 30) + 10;
          
          await Registration.findOrCreate({
            where: { tournament_id: tournament.id, user_id: user.id },
            defaults: {
              tournament_id: tournament.id,
              user_id: user.id,
              position,
              punctuality: Math.random() > 0.3 ? 1 : 0 // 1 = on time, 0 = late
            } as any
          });

          // Pago del buy-in
          await Payment.findOrCreate({
            where: { 
              user_id: user.id,
              amount: buyIn
            } as any,
            defaults: {
              user_id: user.id,
              tournament_id: tournament.id,
              amount: buyIn,
              payment_type: Math.random() > 0.5 ? 'cash' : 'transfer',
              payment_date: date,
              gaming_date: date,
              paid: Math.random() > 0.2 // 80% pagado
            } as any
          });
        }
      }
      
      console.log(`  ✓ Torneo ${date.toLocaleDateString()} - Buy-in: $${buyIn} - Estado: ${status}`);
    }
    console.log(`✅ Torneos creados\n`);

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

    // ============= RESUMEN =============
    console.log('📊 RESUMEN DE DATOS CREADOS:');
    console.log(`   • 1 temporada activa`);
    console.log(`   • ${users.length} usuarios con nombres reales`);
    console.log(`   • ${tournamentDates.length} torneos (${tournamentDates.filter(t => t.status === 'completed').length} completados, ${tournamentDates.filter(t => t.status === 'scheduled').length} programados)`);
    console.log(`   • ${cashDates.length} partidas de cash game`);
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
