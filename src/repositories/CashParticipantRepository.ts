import CashParticipant from '../models/CashParticipant';
import User from '../models/User';

export default class CashParticipantRepository {
  static async findByCashGame(cashGameId: number) {
    return CashParticipant.findAll({ 
      where: { cash_game_id: cashGameId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'full_name', 'is_deleted']
      }]
    });
  }

  static async create(payload: any) {
    return CashParticipant.create(payload);
  }

  static async deleteById(id: number) {
    return CashParticipant.destroy({ where: { id } });
  }
}
