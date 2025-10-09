import Season, { SeasonAttributes, SeasonCreationAttributes } from '../models/Season';

export default class SeasonRepository {
  // Crear una nueva season
  static async create(data: SeasonCreationAttributes): Promise<Season> {
    return await Season.create(data);
  }

  // Obtener todas las seasons
  static async findAll(): Promise<Season[]> {
    return await Season.findAll();
  }

  // Obtener una season por ID
  static async findById(id: number): Promise<Season | null> {
    return await Season.findByPk(id);
  }

  // Actualizar una season por ID
  static async update(id: number, data: Partial<SeasonAttributes>): Promise<[number, Season[]]> {
    return await Season.update(data, { where: { id }, returning: true });
  }

  // Eliminar una season por ID
  static async delete(id: number): Promise<number> {
    return await Season.destroy({ where: { id } });
  }
}
