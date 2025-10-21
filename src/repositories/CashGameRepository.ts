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

  static async getPaginated(options: { page?: number; perPage?: number } = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const perPage = Math.min(200, Math.max(5, Number(options.perPage) || 20));
    const offset = (page - 1) * perPage;
    const result = await CashGame.findAndCountAll({ limit: perPage, offset, order: [['start_datetime', 'DESC']] });
    return { rows: result.rows, count: Number(result.count), page, perPage };
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
