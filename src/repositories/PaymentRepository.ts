import Payment from '../models/Payment';
import { Op } from 'sequelize';
import sequelize from '../services/database';

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
   * Get debtors for a given date using gaming_date: users with unpaid or partially paid payments
   * For each user sum amount - paid_amount where amount > paid_amount
   */
  async getDebtorsByDate(dateStr: string | Date) {
    const gamingDateStr = typeof dateStr === 'string' ? dateStr : dateStr.toISOString().split('T')[0];
    
    // Find payments for this gaming_date where paid = false or amount > paid_amount
    // Only consider cash and cash_request payments (not commission, payouts, settlements, etc.)
    const payments = await Payment.findAll({ 
      where: { 
        gaming_date: gamingDateStr,
        source: {
          [Op.in]: ['cash', 'cash_request', 'tournament']
        },
        [Op.or]: [
          { paid: false },
          sequelize.literal('amount > COALESCE(paid_amount, 0)')
        ]
      } 
    });
    
    console.log(`[PaymentRepo] Found ${payments.length} unpaid payments for gaming_date ${gamingDateStr}`);
    
    const map = new Map<number, number>();
    for (const p of payments) {
      // Excluir settlements del cálculo (son solo audit trail)
      if (p.source === 'settlement') continue;
      
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
    console.log(`[PaymentRepo] Returning ${arr.length} debtors:`, arr);
    return arr;
  }

  /**
   * Get debtors whose payment_date is on a specific date (for dashboard "today" view)
   */
  async getDebtorsByPaymentDate(dateStr: string): Promise<Array<{ userId: number; amountDue: number }>> {
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateStr);
    endDate.setHours(23, 59, 59, 999);

    const payments = await Payment.findAll({
      where: {
        payment_date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    console.log(`[PaymentRepo] Found ${payments.length} payments for payment_date ${dateStr}`);

    const map = new Map<number, number>();
    for (const p of payments) {
      // Excluir settlements del cálculo (son solo audit trail)
      if (p.source === 'settlement') continue;

      const amt = Number(p.amount || 0);
      const paid = Number((p.paid_amount as any) || 0);
      const due = Math.max(0, amt - paid);
      if (due > 0) {
        map.set(p.user_id, (map.get(p.user_id) || 0) + due);
      }
    }

    const arr: Array<{ userId: number; amountDue: number }> = [];
    for (const [userId, amountDue] of map.entries()) arr.push({ userId, amountDue });
    console.log(`[PaymentRepo] Returning ${arr.length} debtors by payment_date:`, arr);
    return arr;
  }

  /**
   * Get total debt for a user across all dates
   */
  async getTotalDebtByUserId(userId: number): Promise<number> {
    const payments = await Payment.findAll({ where: { user_id: userId } });
    let totalDebt = 0;
    for (const p of payments) {
      // Excluir settlements del cálculo (son solo audit trail)
      if (p.source === 'settlement') continue;
      
      const amt = Number(p.amount || 0);
      const paid = Number((p.paid_amount as any) || 0);
      const due = Math.max(0, amt - paid);
      totalDebt += due;
    }
    return totalDebt;
  }

  /**
   * Get all debtors (across all dates)
   */
  async getAllDebtors() {
    const payments = await Payment.findAll();
    const map = new Map<number, number>();
    for (const p of payments) {
      // Excluir settlements del cálculo (son solo audit trail)
      if (p.source === 'settlement') continue;
      
      const amt = Number(p.amount || 0);
      const paid = Number((p.paid_amount as any) || 0);
      const due = Math.max(0, amt - paid);
      if (due > 0) {
        map.set(p.user_id, (map.get(p.user_id) || 0) + due);
      }
    }
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
