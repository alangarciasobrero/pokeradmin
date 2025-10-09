import CashGame, { CashGameAttributes, CashGameCreationAttributes } from '../models/CashGame';

export default class CashGameRepository {
  // Crear un nuevo registro de cash game
  static async create(data: CashGameCreationAttributes): Promise<CashGame> {
    return await CashGame.create(data);
  }

  // Obtener todos los registros
  static async findAll(): Promise<CashGame[]> {
    return await CashGame.findAll();
  }

  // Obtener un registro por ID
  static async findById(id: number): Promise<CashGame | null> {
    return await CashGame.findByPk(id);
  }

  // Actualizar un registro por ID
  static async update(id: number, data: Partial<CashGameAttributes>): Promise<[number, CashGame[]]> {
    return await CashGame.update(data, { where: { id }, returning: true });
  }

  // Eliminar un registro por ID
  static async delete(id: number): Promise<number> {
    return await CashGame.destroy({ where: { id } });
  }
}
