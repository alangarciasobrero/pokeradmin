/**
 * Script para crear jugadores de prueba (no-admin)
 * Ejecutar: npx ts-node scripts/create_test_players.ts
 */

import { User } from '../src/models/User';
import sequelize from '../src/services/database';
import bcrypt from 'bcrypt';

async function createTestPlayers() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos');

    const testPlayers = [
      { username: 'jugador1', full_name: 'Juan Pérez', password: 'password123' },
      { username: 'jugador2', full_name: 'María García', password: 'password123' },
      { username: 'jugador3', full_name: 'Carlos López', password: 'password123' },
      { username: 'jugador4', full_name: 'Ana Martínez', password: 'password123' },
      { username: 'jugador5', full_name: 'Pedro Rodríguez', password: 'password123' }
    ];

    console.log('\n👥 Creando jugadores de prueba...\n');

    for (const player of testPlayers) {
      try {
        const hashedPassword = await bcrypt.hash(player.password, 10);
        
        await User.create({
          username: player.username,
          full_name: player.full_name,
          password_hash: hashedPassword,
          role: 'user',
          is_player: true,
          is_deleted: false,
          current_points: Math.floor(Math.random() * 500)
        } as any);

        console.log(`✓ ${player.username} (${player.full_name}) - password: ${player.password}`);
      } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠️  ${player.username} ya existe`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ ¡Jugadores de prueba creados!\n');
    console.log('📝 Credenciales:');
    console.log('   username: jugador1, jugador2, jugador3, jugador4, jugador5');
    console.log('   password: password123 (para todos)');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

createTestPlayers();
