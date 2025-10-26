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

  // Cache for table columns to avoid repeated describeTable calls and race conditions
  private static resultsTableCols: string[] | null = null;

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
      try {
        const fs = await import('fs');
        try { fs.mkdirSync('logs', { recursive: true }); } catch (_) {}
        const payload = { time: new Date().toISOString(), error: { message: err && err.message ? err.message : String(err), errno: err && err.parent && err.parent.errno ? err.parent.errno : null, sqlMessage: err && err.parent && err.parent.sqlMessage ? err.parent.sqlMessage : null, stack: err && err.stack ? err.stack : null }, attempted: data };
        try { fs.appendFileSync('logs/result_errors.log', JSON.stringify(payload) + '\n'); } catch (_) {}
      } catch (_) {}
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
