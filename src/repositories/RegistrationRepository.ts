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
    return Registration.findAll();
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
