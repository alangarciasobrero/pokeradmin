/**
 * Script para crear torneos de demostración para probar la nueva interfaz
 * - 5 torneos destacados (pinned)
 * - 2 torneos activos
 * - 8 torneos próximos
 * 
 * Ejecutar: npx ts-node scripts/create_demo_tournaments.ts
 */

import { Tournament } from '../src/models/Tournament';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';
import sequelize from '../src/services/database';
import { Op } from 'sequelize';

async function createDemoTournaments() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    const now = new Date();

    // 1. TORNEOS DESTACADOS (PINNED) - Próximos
    console.log('\n📌 Creando torneos destacados (pinned)...');
    
    const pinnedTournaments = [
      {
        tournament_name: '🏆 TORNEO ESPECIAL DE FIN DE MES',
        start_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        buy_in: 50,
        re_entry: true,
        knockout_bounty: 10,
        starting_stack: 30000,
        blind_levels: 20,
        small_blind: 25,
        count_to_ranking: true,
        double_points: true,
        punctuality_discount: 5,
        registration_open: true,
        pinned: true
      },
      {
        tournament_name: '💎 CAMPEONATO CLASIFICATORIO',
        start_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // En 5 días
        buy_in: 100,
        re_entry: false,
        knockout_bounty: 20,
        starting_stack: 50000,
        blind_levels: 25,
        small_blind: 50,
        count_to_ranking: true,
        double_points: true,
        punctuality_discount: 10,
        registration_open: true,
        pinned: true
      },
      {
        tournament_name: '⭐ TORNEO DEL VIERNES',
        start_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // En 2 días
        buy_in: 30,
        re_entry: true,
        knockout_bounty: 5,
        starting_stack: 25000,
        blind_levels: 18,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 3,
        registration_open: true,
        pinned: true
      },
      {
        tournament_name: '🎯 BOUNTY KNOCKOUT ESPECIAL',
        start_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // En 1 semana
        buy_in: 40,
        re_entry: true,
        knockout_bounty: 15,
        starting_stack: 20000,
        blind_levels: 15,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 5,
        registration_open: true,
        pinned: true
      },
      {
        tournament_name: '🔥 MEGA TORNEO MENSUAL',
        start_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // En 10 días
        buy_in: 150,
        re_entry: false,
        knockout_bounty: 30,
        starting_stack: 60000,
        blind_levels: 30,
        small_blind: 50,
        count_to_ranking: true,
        double_points: true,
        punctuality_discount: 15,
        registration_open: true,
        pinned: true
      }
    ];

    for (const data of pinnedTournaments) {
      const tournament = await Tournament.create(data as any);
      console.log(`  ✓ ${data.tournament_name} (ID: ${(tournament as any).id})`);
    }

    // 2. TORNEOS ACTIVOS - Empezaron hace poco
    console.log('\n🎮 Creando torneos activos...');
    
    const activeTournaments = [
      {
        tournament_name: 'Torneo Miércoles Noche',
        start_date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Hace 2 horas
        buy_in: 25,
        re_entry: true,
        knockout_bounty: 5,
        starting_stack: 20000,
        blind_levels: 15,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 2,
        registration_open: false,
        pinned: false
      },
      {
        tournament_name: 'Speed Poker',
        start_date: new Date(now.getTime() - 30 * 60 * 1000), // Hace 30 minutos
        buy_in: 15,
        re_entry: true,
        knockout_bounty: 3,
        starting_stack: 15000,
        blind_levels: 10,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 1,
        registration_open: false,
        pinned: false
      }
    ];

    for (const data of activeTournaments) {
      const tournament = await Tournament.create(data as any);
      console.log(`  ✓ ${data.tournament_name} (ID: ${(tournament as any).id})`);
    }

    // 3. TORNEOS PRÓXIMOS - Variedad de fechas
    console.log('\n📅 Creando torneos próximos...');
    
    const upcomingTournaments = [
      {
        tournament_name: 'Torneo Sábado',
        start_date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        buy_in: 30,
        re_entry: true,
        knockout_bounty: 5,
        starting_stack: 25000,
        blind_levels: 18,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 3,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Domingo de Poker',
        start_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        buy_in: 20,
        re_entry: true,
        knockout_bounty: 5,
        starting_stack: 20000,
        blind_levels: 15,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 2,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Martes Turbo',
        start_date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        buy_in: 15,
        re_entry: true,
        knockout_bounty: 3,
        starting_stack: 15000,
        blind_levels: 12,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 2,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Jueves Clásico',
        start_date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        buy_in: 25,
        re_entry: true,
        knockout_bounty: 5,
        starting_stack: 20000,
        blind_levels: 15,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 2,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Viernes Freezeout',
        start_date: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
        buy_in: 40,
        re_entry: false,
        knockout_bounty: 0,
        starting_stack: 30000,
        blind_levels: 20,
        small_blind: 50,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 5,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Sábado Bounty',
        start_date: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
        buy_in: 35,
        re_entry: true,
        knockout_bounty: 10,
        starting_stack: 25000,
        blind_levels: 18,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 3,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Domingo Deep Stack',
        start_date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        buy_in: 50,
        re_entry: true,
        knockout_bounty: 10,
        starting_stack: 40000,
        blind_levels: 25,
        small_blind: 50,
        count_to_ranking: true,
        double_points: true,
        punctuality_discount: 5,
        registration_open: true,
        pinned: false
      },
      {
        tournament_name: 'Lunes Rebuy',
        start_date: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000),
        buy_in: 20,
        re_entry: true,
        knockout_bounty: 5,
        starting_stack: 20000,
        blind_levels: 15,
        small_blind: 25,
        count_to_ranking: true,
        double_points: false,
        punctuality_discount: 2,
        registration_open: true,
        pinned: false
      }
    ];

    for (const data of upcomingTournaments) {
      const tournament = await Tournament.create(data as any);
      console.log(`  ✓ ${data.tournament_name} (ID: ${(tournament as any).id})`);
    }

    // 4. Agregar algunas inscripciones a torneos próximos
    console.log('\n👥 Agregando inscripciones de prueba...');
    
    const users = await User.findAll({
      where: { is_deleted: false },
      limit: 8
    });

    if (users.length > 0) {
      const allTournaments = await Tournament.findAll({
        where: {
          start_date: { [Op.gte]: now }
        },
        limit: 5
      });

      for (const tournament of allTournaments) {
        // Inscribir 3-5 jugadores aleatorios a cada torneo
        const numRegistrations = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < Math.min(numRegistrations, users.length); i++) {
          try {
            await Registration.create({
              tournament_id: (tournament as any).id,
              user_id: (users[i] as any).id,
              registration_date: new Date()
            } as any);
          } catch (error) {
            // Ignorar duplicados
          }
        }
        console.log(`  ✓ ${numRegistrations} inscripciones en "${(tournament as any).tournament_name}"`);
      }
    }

    console.log('\n✅ ¡Torneos de demostración creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`  • 5 torneos destacados (pinned) - aparecerán en la sección dorada`);
    console.log(`  • 2 torneos activos - con indicador rojo pulsante`);
    console.log(`  • 8 torneos próximos - en la grilla regular`);
    console.log(`\n🌐 Ahora podés ver la interfaz completa en:`);
    console.log(`  • Dashboard principal: http://localhost:3000/`);
    console.log(`  • Lista completa: http://localhost:3000/tournaments/upcoming`);
    console.log(`  • Leaderboard: http://localhost:3000/stats/leaderboard`);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

createDemoTournaments();
