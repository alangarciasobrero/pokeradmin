import { exportTotalsCSV } from '../src/controllers/adminCashController';
import CashGameRepository from '../src/repositories/CashGameRepository';

jest.mock('../src/repositories/CashGameRepository');

describe('exportTotalsCSV', () => {
  beforeEach(() => jest.clearAllMocks());

  it('builds CSV with aggregated totals per dealer', async () => {
    const games = [
      { id:1, dealer: 'a', total_commission: 2.5, total_tips: 5 },
      { id:2, dealer: 'b', total_commission: 3, total_tips: 1 },
      { id:3, dealer: 'a', total_commission: 1.5, total_tips: 2 }
    ];
    (CashGameRepository.findByDate as any).mockResolvedValue(games);

    const req: any = { query: { date: (new Date()).toISOString().slice(0,10) } };
    const sent: any = { data: null, headers: {} };
    const res: any = {
      setHeader: (k: string, v: string) => { sent.headers[k] = v; },
      send: (d: any) => { sent.data = d; }
    };

    await exportTotalsCSV(req, res);

    expect(sent.headers['Content-Type']).toContain('text/csv');
  expect(sent.data).toContain('"dealer","games","total_commission","total_tips"');
    // dealer a should have games 2, commission 4.00, tips 7.00
  expect(sent.data).toMatch(/"a","2","4.00","7.00"/);
  expect(sent.data).toMatch(/"b","1","3.00","1.00"/);
  });
});
