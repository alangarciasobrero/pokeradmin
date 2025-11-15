import Payment from '../models/Payment';
import { Op } from 'sequelize';

export class PaymentRepository {
  /**
   * Get payments for a specific date (calendar day).
   */
  async findByDate(date: Date) {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    return Payment.findAll({ where: { payment_date: { [Op.between]: [start, end] } } });
  }

  /**
   * Get debtors for a given date: users with unpaid or partially paid payments
   * For each user sum amount - paid_amount where amount > paid_amount
   */
  async getDebtorsByDate(date: Date) {
    const payments = await this.findByDate(date);
    const map = new Map<number, number>();
    for (const p of payments) {
      const amt = Number(p.amount || 0);
      const paid = Number((p.paid_amount as any) || 0);
      const due = Math.max(0, amt - paid);
      if (due > 0) {
        map.set(p.user_id, (map.get(p.user_id) || 0) + due);
      }
    }
    // return array of { userId, amountDue }
    const arr: Array<{ userId: number; amountDue: number }> = [];
    for (const [userId, amountDue] of map.entries()) arr.push({ userId, amountDue });
    return arr;
  }

  // fallback: list recent payments
  async findRecent(limit = 50) {
    return Payment.findAll({ order: [['payment_date','DESC']], limit });
  }
}

export default new PaymentRepository();
