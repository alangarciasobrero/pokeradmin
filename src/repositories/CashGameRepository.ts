import CashGame, { CashGameAttributes, CashGameCreationAttributes } from '../models/CashGame';
import { Op } from 'sequelize';

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

  // Find cash games that started on a given date and are still open (end_datetime IS NULL)
  static async findOpenByDate(date: Date): Promise<CashGame[]> {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    return await CashGame.findAll({ where: { start_datetime: { [Op.between]: [start, end] }, end_datetime: null }, order: [['start_datetime','ASC']] });
  }

  // Find cash games that occurred on a given date (start_datetime within the day)
  static async findByDate(date: Date): Promise<CashGame[]> {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    return await CashGame.findAll({ where: { start_datetime: { [Op.between]: [start, end] } }, order: [['start_datetime','ASC']] });
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
