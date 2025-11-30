// Repositorio para la entidad Registration
// Encapsula la lógica de acceso a datos y operaciones sobre inscripciones
import { Registration } from '../models/Registration';
import fs from 'fs';

/**
 * Clase RegistrationRepository
 * Proporciona métodos para interactuar con la tabla de inscripciones
 */
export class RegistrationRepository {
  /**
   * Obtiene todas las inscripciones
   */
  async getAll(): Promise<Registration[]> {
    // Simple read via Sequelize. After DB migration to `user_id` this should work without fallbacks.
    return await Registration.findAll();
  }

  /**
   * Obtiene inscripciones paginadas con contador y filtros opcionales
   */
  async getPaginated(options: { page?: number; perPage?: number; where?: any } = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const perPage = Math.min(200, Math.max(5, Number(options.perPage) || 20));
    const offset = (page - 1) * perPage;

    const result = await Registration.findAndCountAll({
      where: options.where || {},
      limit: perPage,
      offset,
      order: [['registration_date', 'DESC']]
    });
    return {
      rows: result.rows,
      count: Number(result.count),
      page,
      perPage
    };
  }

  /**
   * Obtiene una inscripción por su ID
   */
  async getById(id: number): Promise<Registration | null> {
    return Registration.findByPk(id);
  }

  /**
   * Crea una nueva inscripción
   */
  async create(data: Partial<Registration>): Promise<Registration> {
    try {
      return await Registration.create(data);
    } catch (err: any) {
      // Persist error details for debugging, but rethrow so route can handle it
      try {
        const logPath = 'logs/registration_errors.log';
        const payload = { time: new Date().toISOString(), error: { message: err && err.message ? err.message : String(err), errno: err && err.parent && err.parent.errno ? err.parent.errno : null, sqlMessage: err && err.parent && err.parent.sqlMessage ? err.parent.sqlMessage : null, stack: err && err.stack ? err.stack : null }, attempted: data };
        try { fs.mkdirSync('logs', { recursive: true }); } catch (_) {}
        fs.appendFileSync(logPath, JSON.stringify(payload) + '\n');
      } catch (_) {}
      throw err;
    }
  }

  /**
   * Actualiza los datos de una inscripción por su ID
   */
  async updateById(id: number, data: Partial<Registration>): Promise<[number, Registration[]]> {
    return Registration.update(data, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Elimina una inscripción por su ID (eliminación real)
   */
  async deleteById(id: number): Promise<number> {
    return Registration.destroy({ where: { id } });
  }
}
