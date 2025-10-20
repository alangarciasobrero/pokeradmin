// Repositorio para la entidad Registration
// Encapsula la lógica de acceso a datos y operaciones sobre inscripciones
import { Registration } from '../models/Registration';

/**
 * Clase RegistrationRepository
 * Proporciona métodos para interactuar con la tabla de inscripciones
 */
export class RegistrationRepository {
  /**
   * Obtiene todas las inscripciones
   */
  async getAll(): Promise<Registration[]> {
    try {
      return await Registration.findAll();
    } catch (err: any) {
      // Fallback for legacy schema where column might be `player_id` instead of `user_id`
      if (err && err.parent && err.parent.errno === 1054) {
        const sequelize = (Registration as any).sequelize;
        const rows: any[] = await sequelize.query('SELECT id, player_id as user_id, tournament_id, registration_date, punctuality FROM registrations', { type: (sequelize as any).QueryTypes.SELECT });
        // Map raw rows to Registration-like objects (lightweight)
        return rows.map(r => (Registration.build ? Registration.build(r) : r));
      }
      throw err;
    }
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
    return Registration.create(data);
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
