import { handleClosePost } from '../src/controllers/adminCashController';
import CashGameRepository from '../src/repositories/CashGameRepository';
import Payment from '../src/models/Payment';

jest.mock('../src/repositories/CashGameRepository');
jest.mock('../src/models/Payment');

describe('adminCashController.handleClosePost', () => {
  beforeEach(() => jest.clearAllMocks());

  it('updates cash game and creates commission and tips payments', async () => {
    const mockCash: any = { id: 42, total_commission: 0, total_tips: 0 };
    (CashGameRepository.findById as any).mockResolvedValue(mockCash);
    (CashGameRepository.update as any).mockResolvedValue([1, [mockCash]]);
    const created: any[] = [];
    (Payment.create as any).mockImplementation((p: any) => { created.push(p); return Promise.resolve(p); });

    const req: any = { params: { id: '42' }, body: { total_commission: '15.50', total_tips: '7.00', dealer_user_id: '9' }, session: { userId: 2 } };
    const res: any = { redirect: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

    await handleClosePost(req, res);

    expect(CashGameRepository.findById).toHaveBeenCalledWith(42);
    expect(CashGameRepository.update).toHaveBeenCalled();
    expect(Payment.create).toHaveBeenCalled();
    // Should have created two payments (commission + tips)
    expect(created.length).toBe(2);
    const commission = created.find(c => c.source === 'cash_commission');
    const tips = created.find(c => c.source === 'cash_tips');
    expect(Number(commission.amount)).toBeCloseTo(15.5);
    expect(Number(tips.amount)).toBeCloseTo(7.0);
    expect(res.redirect).toHaveBeenCalledWith('/admin/games/cash/42');
  });
});
