import paymentRepo from '../src/repositories/PaymentRepository';
import Payment from '../src/models/Payment';

jest.mock('../src/models/Payment');

describe('PaymentRepository.getDebtorsByDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates due amounts grouped by user', async () => {
    // Mock Payment.findAll used by findByDate
    const mockedFindAll = (Payment.findAll as any) as jest.MockedFunction<any>;

    const samplePayments = [
      { id: 1, user_id: 1, amount: '100.00', paid_amount: '20.00', payment_date: new Date() },
      { id: 2, user_id: 2, amount: '50.00', paid_amount: '50.00', payment_date: new Date() },
      { id: 3, user_id: 1, amount: '30.00', paid_amount: null, payment_date: new Date() }
    ];

    mockedFindAll.mockResolvedValue(samplePayments);

    const res = await paymentRepo.getDebtorsByDate(new Date());

    // user 1: 100-20 = 80 ; 30-0 = 30 ; total = 110
    // user 2: 50-50 = 0 -> not included
    expect(res).toEqual(expect.arrayContaining([
      { userId: 1, amountDue: 110 }
    ]));
    expect(res.find(r => r.userId === 2)).toBeUndefined();
    expect(mockedFindAll).toHaveBeenCalled();
  });
});
