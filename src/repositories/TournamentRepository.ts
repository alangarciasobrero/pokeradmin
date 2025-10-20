import { Tournament } from '../models/Tournament';

/**
 * Repositorio para la entidad Tournament
 * Encapsula la lógica de acceso a datos y operaciones sobre torneos
 */
export class TournamentRepository {
    /**
     * Obtiene todos los torneos registrados en la base de datos
     * @returns Promise<Tournament[]>
     */
    async getAll(): Promise<Tournament[]> {
        return Tournament.findAll();
    }

    /**
     * Crea un nuevo torneo con todos los campos requeridos
     * @param data - Objeto con los datos del torneo
     * @returns Promise<Tournament>
     */
    async create(data: {
        tournament_name: string;
        start_date: Date;
        buy_in: number;
        re_entry: number;
        knockout_bounty: number;
        starting_stack: number;
        count_to_ranking: boolean;
        double_points: boolean;
        blind_levels: number;
        small_blind: number;
        punctuality_discount: number;
    }): Promise<Tournament> {
        return Tournament.create(data);
    }

    /**
     * Busca un torneo por su ID
     * @param id - Identificador único del torneo
     * @returns Promise<Tournament | null>
     */
    async getById(id: number): Promise<Tournament | null> {
        return Tournament.findByPk(id);
    }

    /**
     * Actualiza los datos de un torneo por su ID
     * @param id - Identificador único del torneo
     * @param data - Objeto con los campos a actualizar
     * @returns Promise<[number, Tournament[]]> - Número de filas afectadas y los torneos actualizados
     */
    async updateById(id: number, data: Partial<{
        tournament_name: string;
        start_date: Date;
        buy_in: number;
        re_entry: number;
        knockout_bounty: number;
        starting_stack: number;
        count_to_ranking: boolean;
        double_points: boolean;
        blind_levels: number;
        small_blind: number;
        punctuality_discount: number;
    }>): Promise<[number, Tournament[]]> {
        return Tournament.update(data, {
            where: { id },
            returning: true
        });
    }

        /**
         * Elimina un torneo por su ID
         * @param id - ID a eliminar
         * @returns Promise<number> filas eliminadas
         */
        async deleteById(id: number): Promise<number> {
            const result = await (await import('../models/Tournament')).Tournament.destroy({ where: { id } });
            return result;
        }
}
