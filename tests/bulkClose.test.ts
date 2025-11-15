import { handleBulkClosePost, renderBulkClose } from '../src/controllers/adminCashController';
import CashGameRepository from '../src/repositories/CashGameRepository';
import Payment from '../src/models/Payment';
import User from '../src/models/User';

jest.mock('../src/repositories/CashGameRepository');
jest.mock('../src/models/Payment');
jest.mock('../src/models/User');

describe('bulk close flow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('aggregates totals and creates aggregated payments', async () => {
    const openGames = [
      { id: 1, dealer: 'juan', total_commission: 5, total_tips: 10 },
      { id: 2, dealer: 'juan', total_commission: 3.5, total_tips: 5 },
      { id: 3, dealer: 'maria', total_commission: 4, total_tips: 7 }
    ];
    (CashGameRepository.findOpenByDate as any).mockResolvedValue(openGames);
    (CashGameRepository.update as any).mockResolvedValue([1]);
    const created: any[] = [];
    (Payment.create as any).mockImplementation((p: any) => { created.push(p); return Promise.resolve(p); });
    // Simulate finding user 'juan' only
    (User.findOne as any).mockImplementation(({ where }: any) => {
      if (where.username === 'juan') return Promise.resolve({ id: 11, username: 'juan' });
      return Promise.resolve(null);
    });

    const req: any = { body: { date: (new Date()).toISOString().slice(0,10) }, session: { userId: 2 } };
    const res: any = { redirect: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

    await handleBulkClosePost(req, res);

    // Should have closed each game and created payments: 1 commission bulk + tips per dealer
    expect(CashGameRepository.update).toHaveBeenCalled();
    // Created payments: commission_bulk + tips for 'juan' + tips_unassigned for 'maria' (since no user found)
    expect(created.length).toBe(3);
    const commission = created.find(c => c.source === 'cash_commission_bulk');
    expect(Number(commission.amount)).toBeCloseTo(12.5); // 5 + 3.5 + 4
    const juanTips = created.find(c => c.method === 'tips_bulk' && c.user_id === 11);
    expect(Number(juanTips.amount)).toBeCloseTo(15); // 10 + 5
    const mariaUnassigned = created.find(c => c.method && (c.method as string).startsWith('tips_unassigned'));
    expect(Number(mariaUnassigned.amount)).toBeCloseTo(7);
    expect(res.redirect).toHaveBeenCalledWith('/admin/games/cash/list');
  });
});
