import sequelize from '../src/services/database';
import { User } from '../src/models/User';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';

async function addStatsJugador1() {
    try {
        await sequelize.authenticate();
        console.log('[add_stats] Conectado a la DB');

        // Buscar jugador1
        const jugador1 = await User.findOne({ where: { username: 'jugador1' } });
        if (!jugador1) {
            console.error('❌ No se encontró el usuario jugador1');
            process.exit(1);
        }

        console.log(`✅ Encontrado: ${jugador1.username} (ID: ${jugador1.id})`);

        // Buscar torneos disponibles
        const tournaments = await Tournament.findAll({
            limit: 10,
            order: [['start_date', 'DESC']]
        });

        if (tournaments.length === 0) {
            console.error('❌ No hay torneos en la base de datos');
            process.exit(1);
        }

        console.log(`📋 Encontrados ${tournaments.length} torneos`);

        // Crear registraciones con diferentes posiciones
        const positions = [1, 2, 3, 5, 8, 10, 15, 4, 6, 12];
        
        for (let i = 0; i < Math.min(tournaments.length, positions.length); i++) {
            const tournament = tournaments[i];
            const position = positions[i];

            // Verificar si ya existe la registración
            const existing = await Registration.findOne({
                where: {
                    user_id: jugador1.id,
                    tournament_id: tournament.id
                }
            });

            if (existing) {
                console.log(`⏭️  Ya existe registración para ${tournament.tournament_name}`);
                continue;
            }

            // Crear registración
            await Registration.create({
                user_id: jugador1.id,
                tournament_id: tournament.id,
                registration_date: new Date(),
                punctuality: true,
                position: position,
                action_type: 1 // buy-in
            });

            console.log(`✅ Registrado en "${tournament.tournament_name}" - Posición: ${position}`);
        }

        // Actualizar puntos del jugador (simulación)
        const totalPoints = 850; // Ejemplo
        await jugador1.update({ current_points: totalPoints });

        console.log(`\n🎯 Estadísticas agregadas exitosamente`);
        console.log(`📊 Total puntos: ${totalPoints}`);
        console.log(`🏆 Torneos participados: ${Math.min(tournaments.length, positions.length)}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addStatsJugador1();
