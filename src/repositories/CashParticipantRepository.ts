import CashParticipant from '../models/CashParticipant';

export default class CashParticipantRepository {
  static async findByCashGame(cashGameId: number) {
    return CashParticipant.findAll({ where: { cash_game_id: cashGameId } });
  }

  static async create(payload: any) {
    return CashParticipant.create(payload);
  }

  static async deleteById(id: number) {
    return CashParticipant.destroy({ where: { id } });
  }
}
