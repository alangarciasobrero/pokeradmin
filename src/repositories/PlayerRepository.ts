// Repositorio para la entidad Player
// Encapsula la lógica de acceso a datos y operaciones sobre jugadores
import { Player } from '../models/Player';

/**
 * Clase PlayerRepository
 * Proporciona métodos para interactuar con la tabla de jugadores
 */
export class PlayerRepository {
  /**
   * Obtiene todos los jugadores no eliminados
   */
  async getAll(): Promise<Player[]> {
    return Player.findAll({ where: { is_deleted: false } });
  }

  /**
   * Obtiene un jugador por su ID (si no está eliminado)
   */
  async getById(id: number): Promise<Player | null> {
    return Player.findOne({ where: { id, is_deleted: false } });
  }

  /**
   * Crea un nuevo jugador
   */
  async create(data: Partial<Player>): Promise<Player> {
    return Player.create(data);
  }

  /**
   * Actualiza los datos de un jugador por su ID
   */
  async updateById(id: number, data: Partial<Player>): Promise<[number, Player[]]> {
    return Player.update(data, {
      where: { id, is_deleted: false },
      returning: true,
    });
  }

  /**
   * Elimina (soft delete) un jugador por su ID
   */
  async deleteById(id: number): Promise<number> {
    const [affectedRows] = await Player.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } }
    );
    return affectedRows;
  }
}
