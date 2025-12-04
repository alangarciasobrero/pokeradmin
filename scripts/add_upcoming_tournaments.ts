import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'pokeradmin',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

async function addUpcomingTournaments() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Obtener season activo
    const [seasons]: any = await sequelize.query(
      `SELECT id FROM seasons WHERE estado = 'activa' LIMIT 1`
    );
    
    if (!seasons || seasons.length === 0) {
      console.error('❌ No hay season activo');
      return;
    }

    const seasonId = seasons[0].id;
    console.log(`📅 Season activo: ${seasonId}`);

    // Obtener algunos usuarios para registraciones
    const [users]: any = await sequelize.query(
      `SELECT id, username FROM users WHERE is_player = 1 LIMIT 10`
    );

    if (!users || users.length === 0) {
      console.error('❌ No hay usuarios jugadores');
      return;
    }

    console.log(`👥 Encontrados ${users.length} usuarios jugadores`);

    const now = new Date();
    
    // Helper para crear fecha con hora específica
    const createDateTime = (daysFromNow: number, hour: number, minute: number = 0) => {
      const date = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
      date.setHours(hour, minute, 0, 0);
      return date;
    };

    const tournaments = [
      // Torneos próximos regulares
      {
        name: 'Torneo Texas Hold\'em - Mañana',
        start_date: createDateTime(1, 20, 0), // Mañana 20:00
        buy_in: 5000,
        double_points: false,
        registration_open: true,
        pinned: false,
      },
      {
        name: 'Torneo Express - Este Fin de Semana',
        start_date: createDateTime(3, 19, 0), // 3 días 19:00
        buy_in: 3000,
        double_points: false,
        registration_open: true,
        pinned: false,
      },
      {
        name: 'Torneo Semanal - Próxima Semana',
        start_date: createDateTime(7, 21, 0), // 1 semana 21:00
        buy_in: 7500,
        double_points: true,
        registration_open: true,
        pinned: false,
      },
      {
        name: 'Championship Series - Día 15',
        start_date: createDateTime(10, 20, 30), // 10 días 20:30
        buy_in: 10000,
        double_points: false,
        registration_open: true,
        pinned: false,
      },
      {
        name: 'Torneo de Medio Mes',
        start_date: createDateTime(15, 20, 0), // 15 días 20:00
        buy_in: 6000,
        double_points: false,
        registration_open: false,
        pinned: false,
      },
      {
        name: 'Torneo Amateur - Tres Semanas',
        start_date: createDateTime(21, 19, 30), // 3 semanas 19:30
        buy_in: 4000,
        double_points: false,
        registration_open: false,
        pinned: false,
      },
      {
        name: 'Torneo Mensual Regular',
        start_date: createDateTime(28, 21, 0), // 4 semanas 21:00
        buy_in: 8000,
        double_points: true,
        registration_open: false,
        pinned: false,
      },

      // Torneos destacados/pinned
      {
        name: '🌟 TORNEO ESPECIAL DE FIN DE MES 🌟',
        start_date: createDateTime(30, 21, 30), // 1 mes 21:30
        buy_in: 15000,
        double_points: true,
        registration_open: true,
        pinned: true,
      },
      {
        name: '🏆 CAMPEONATO TRIMESTRAL 🏆',
        start_date: createDateTime(45, 20, 0), // 45 días 20:00
        buy_in: 25000,
        double_points: true,
        registration_open: true,
        pinned: true,
      },
      {
        name: '💎 HIGH ROLLER PREMIUM 💎',
        start_date: createDateTime(60, 22, 0), // 2 meses 22:00
        buy_in: 50000,
        double_points: true,
        registration_open: false,
        pinned: true,
      },
    ];

    console.log('\n📋 Creando torneos próximos y destacados...\n');

    for (const tourney of tournaments) {
      const dateTimeStr = tourney.start_date.toISOString().slice(0, 19).replace('T', ' ');
      
      // Crear torneo - usando solo los campos esenciales que existen
      const [result]: any = await sequelize.query(
        `INSERT INTO tournaments (
          tournament_name, start_date, buy_in, starting_stack,
          double_points, season_id, registration_open, pinned
        ) VALUES (?, ?, ?, 10000, ?, ?, ?, ?)`,
        {
          replacements: [
            tourney.name,
            dateTimeStr,
            tourney.buy_in,
            tourney.double_points,
            seasonId,
            tourney.registration_open,
            tourney.pinned,
          ],
        }
      );

      const tournamentId = result;
      console.log(`✅ Torneo creado: ${tourney.name}`);
      console.log(`   📅 Fecha: ${tourney.start_date.toLocaleString('es-AR')}`);
      console.log(`   💰 Buy-in: $${tourney.buy_in}`);
      console.log(`   ${tourney.pinned ? '⭐ DESTACADO' : '📌 Regular'}`);
      console.log(`   ${tourney.registration_open ? '✅ Inscripciones abiertas' : '🔒 Inscripciones cerradas'}`);
      console.log(`   ${tourney.double_points ? '🔥 DOBLES PUNTOS' : '📊 Puntos normales'}`);

      // Si las inscripciones están abiertas, agregar algunos registros
      if (tourney.registration_open) {
        const numRegistrations = Math.floor(Math.random() * 5) + 3; // 3-7 registros
        for (let i = 0; i < Math.min(numRegistrations, users.length); i++) {
          const user = users[i];
          
          await sequelize.query(
            `INSERT INTO registrations (tournament_id, user_id, registration_date, punctuality)
             VALUES (?, ?, NOW(), 0)`,
            { replacements: [tournamentId, user.id] }
          );

          // Crear pago (algunos pagos completos, otros pendientes)
          const isPaid = Math.random() > 0.3; // 70% pagados
          const paidAmount = isPaid ? tourney.buy_in : 0;

          await sequelize.query(
            `INSERT INTO payments (user_id, amount, paid_amount, paid, reference_id, payment_date, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
            {
              replacements: [user.id, tourney.buy_in, paidAmount, isPaid ? 1 : 0, tournamentId],
            }
          );
        }
        console.log(`   👥 ${numRegistrations} jugadores registrados\n`);
      } else {
        console.log(`   👥 Sin registros (inscripciones cerradas)\n`);
      }
    }

    console.log('✅ Todos los torneos creados exitosamente');
    console.log('\n📊 RESUMEN:');
    console.log(`   • ${tournaments.filter(t => !t.pinned).length} torneos regulares`);
    console.log(`   • ${tournaments.filter(t => t.pinned).length} torneos destacados`);
    console.log(`   • ${tournaments.filter(t => t.registration_open).length} con inscripciones abiertas`);
    console.log(`   • ${tournaments.filter(t => t.double_points).length} con dobles puntos`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

addUpcomingTournaments();
