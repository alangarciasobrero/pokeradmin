// Repositorio para la entidad Result
// Encapsula la lógica de acceso a datos y operaciones sobre resultados
import { Result } from '../models/Result';

/**
 * Clase ResultRepository
 * Proporciona métodos para interactuar con la tabla de resultados
 */
export class ResultRepository {
  /**
   * Obtiene todos los resultados
   */
  async getAll(): Promise<Result[]> {
    return Result.findAll();
  }

  /**
   * Obtiene un resultado por su ID
   */
  async getById(id: number): Promise<Result | null> {
    return Result.findByPk(id);
  }

  /**
   * Crea un nuevo resultado
   */
  async create(data: Partial<Result>): Promise<Result> {
    try {
      return await Result.create(data);
    } catch (err: any) {
      // Fallback when DB schema uses player_id instead of user_id or doesn't have user_id
      if (err && err.parent && err.parent.errno === 1054) {
        const sequelize = (Result as any).sequelize;
        const userId = (data as any).user_id ?? (data as any).player_id;
        const tournamentId = (data as any).tournament_id;
        const position = (data as any).position;
        const finalTable = (data as any).final_table === undefined ? false : !!(data as any).final_table;
        // Try raw insert using player_id column name
        const sql = 'INSERT INTO results (tournament_id, player_id, position, final_table) VALUES (?, ?, ?, ?)';
        const res: any = await sequelize.query(sql, { replacements: [tournamentId, userId, position, finalTable] });
        const insertId = res && res[0] && (res[0].insertId || (res[0][0] && res[0][0].insertId)) ? (res[0].insertId || res[0][0].insertId) : null;
        return { id: insertId, tournament_id: tournamentId, user_id: userId, position, final_table: finalTable } as any;
      }
      throw err;
    }
  }

  /**
   * Actualiza los datos de un resultado por su ID
   */
  async updateById(id: number, data: Partial<Result>): Promise<[number, Result[]]> {
    return Result.update(data, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Elimina un resultado por su ID (eliminación real)
   */
  async deleteById(id: number): Promise<number> {
    return Result.destroy({ where: { id } });
  }

  /**
   * Obtiene todos los resultados agrupados por torneo
   */
  async getByTournament(): Promise<Record<number, Result[]>> {
    const rows = await Result.findAll();
    const map: Record<number, Result[]> = {};
    for (const r of rows) {
      const tid = Number((r as any).tournament_id);
      if (!map[tid]) map[tid] = [];
      map[tid].push(r);
    }
    return map;
  }
}
