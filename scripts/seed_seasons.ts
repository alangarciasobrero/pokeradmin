import { Season } from '../src/models/Season';
import sequelize from '../src/services/database';

async function seedSeasons() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    const seasons = [
      {
        nombre: '♠️ Pica',
        descripcion: 'Primera temporada del año - Ranking Pica',
        fecha_inicio: new Date('2025-01-01'),
        fecha_fin: new Date('2025-03-31'),
        torneos_totales: 12,
        torneos_jugados: 0,
        estado: 'activa' as const
      },
      {
        nombre: '♦️ Diamante',
        descripcion: 'Segunda temporada del año - Ranking Diamante',
        fecha_inicio: new Date('2025-04-01'),
        fecha_fin: new Date('2025-06-30'),
        torneos_totales: 12,
        torneos_jugados: 0,
        estado: 'planificada' as const
      },
      {
        nombre: '♥️ Corazón',
        descripcion: 'Tercera temporada del año - Ranking Corazón',
        fecha_inicio: new Date('2025-07-01'),
        fecha_fin: new Date('2025-09-30'),
        torneos_totales: 12,
        torneos_jugados: 0,
        estado: 'planificada' as const
      },
      {
        nombre: '♣️ Trébol',
        descripcion: 'Cuarta temporada del año - Ranking Trébol',
        fecha_inicio: new Date('2025-10-01'),
        fecha_fin: new Date('2025-12-31'),
        torneos_totales: 12,
        torneos_jugados: 0,
        estado: 'planificada' as const
      }
    ];

    for (const seasonData of seasons) {
      const existing = await Season.findOne({ where: { nombre: seasonData.nombre } });
      if (!existing) {
        await Season.create(seasonData);
        console.log(`✓ Creada temporada: ${seasonData.nombre}`);
      } else {
        console.log(`⊘ Ya existe: ${seasonData.nombre}`);
      }
    }

    console.log('\n✅ Temporadas inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedSeasons();
