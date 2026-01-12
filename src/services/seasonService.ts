import { Season } from '../models/Season';
import { Op } from 'sequelize';

/**
 * Actualiza automáticamente el estado de las temporadas basándose en las fechas actuales
 * - Marca como 'activa' la temporada que incluye la fecha actual
 * - Marca como 'finalizada' las temporadas cuya fecha_fin ya pasó
 * - Marca como 'planificada' las temporadas cuya fecha_inicio es futura
 */
export async function updateSeasonStates(): Promise<void> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Obtener todas las temporadas ordenadas por fecha de inicio (más reciente primero)
        const seasons = await Season.findAll({
            order: [['fecha_inicio', 'DESC']]
        });

        let hasActiveAssigned = false;

        for (const season of seasons) {
            const fechaInicio = new Date(season.fecha_inicio);
            const fechaFin = new Date(season.fecha_fin);
            
            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin.setHours(23, 59, 59, 999);

            let newEstado: 'planificada' | 'activa' | 'finalizada' = season.estado;

            // Determinar el estado correcto basado en las fechas
            if (today < fechaInicio) {
                newEstado = 'planificada';
            } else if (today >= fechaInicio && today <= fechaFin) {
                // Solo permitir UNA temporada activa (la primera que cumpla, que es la más reciente)
                if (!hasActiveAssigned) {
                    newEstado = 'activa';
                    hasActiveAssigned = true;
                } else {
                    // Si ya hay una temporada activa, marcar esta como finalizada
                    newEstado = 'finalizada';
                }
            } else if (today > fechaFin) {
                newEstado = 'finalizada';
            }

            // Actualizar solo si cambió el estado
            if (newEstado !== season.estado) {
                await season.update({ estado: newEstado });
                console.log(`[seasonService] Updated season ${season.id} (${season.nombre}) from '${season.estado}' to '${newEstado}'`);
            }
        }
    } catch (error) {
        console.error('[seasonService] Error updating season states:', error);
        throw error;
    }
}

/**
 * Obtiene la temporada activa actual (basada en fechas)
 * Si no hay ninguna activa, retorna null
 */
export async function getActiveSeason(): Promise<Season | null> {
    try {
        // Primero actualizar los estados
        await updateSeasonStates();

        // Buscar la temporada activa
        const activeSeason = await Season.findOne({
            where: { estado: 'activa' },
            order: [['fecha_inicio', 'DESC']]
        });

        return activeSeason;
    } catch (error) {
        console.error('[seasonService] Error getting active season:', error);
        return null;
    }
}

/**
 * Verifica si una temporada debería estar activa basándose en la fecha actual
 */
export function shouldBeActive(season: Season): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(season.fecha_inicio);
    const fechaFin = new Date(season.fecha_fin);
    
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(23, 59, 59, 999);

    return today >= fechaInicio && today <= fechaFin;
}

export default {
    updateSeasonStates,
    getActiveSeason,
    shouldBeActive
};
