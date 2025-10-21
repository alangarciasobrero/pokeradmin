import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/services/database';
import { Tournament } from '../src/models/Tournament';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB OK');

    const tournaments = await Tournament.findAll({ order: [['start_date', 'DESC']] });
    if (tournaments.length === 0) {
      console.log('No se encontraron torneos. Creando 3 torneos de ejemplo...');
      const samples = [
        {
          tournament_name: 'Torneo Semanal - Viernes',
          start_date: new Date(),
          buy_in: 1500,
          re_entry: 2,
          knockout_bounty: 500,
          starting_stack: 20000,
          count_to_ranking: true,
          double_points: false,
          blind_levels: 10,
          small_blind: 50,
          punctuality_discount: 0,
        },
        {
          tournament_name: 'Torneo Turbo - Domingo',
          start_date: new Date(Date.now() + 24 * 3600 * 1000),
          buy_in: 1000,
          re_entry: 1,
          knockout_bounty: 0,
          starting_stack: 10000,
          count_to_ranking: false,
          double_points: false,
          blind_levels: 6,
          small_blind: 25,
          punctuality_discount: 0,
        },
        {
          tournament_name: 'Satélite - Miércoles',
          start_date: new Date(Date.now() + 2 * 24 * 3600 * 1000),
          buy_in: 300,
          re_entry: 0,
          knockout_bounty: 0,
          starting_stack: 5000,
          count_to_ranking: false,
          double_points: false,
          blind_levels: 8,
          small_blind: 10,
          punctuality_discount: 0,
        },
      ];

      for (const s of samples) {
        await Tournament.create(s as any);
      }
    } else {
      console.log(`Se encontraron ${tournaments.length} torneos.`);
    }

    const all = await Tournament.findAll({ order: [['start_date', 'DESC']] });
    console.log('Listado de torneos:');
    for (const t of all) {
      console.log(`${t.id} | ${t.tournament_name} | ${t.start_date} | buy_in: ${t.buy_in}`);
    }

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Error en script:', err);
    process.exit(1);
  }
}

main();
