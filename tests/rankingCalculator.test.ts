import ranking from '../src/services/rankingCalculator';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';

describe('rankingCalculator', () => {
  test('computePot applies punctuality discount per registration', () => {
    const t = new Tournament();
    (t as any).buy_in = 100;
    (t as any).punctuality_discount = 10; // 10%

    const regs: any[] = [
      Registration.build({ user_id: 1, tournament_id: 1, punctuality: true }),
      Registration.build({ user_id: 2, tournament_id: 1, punctuality: false }),
      Registration.build({ user_id: 3, tournament_id: 1, punctuality: true }),
    ];

    const pot = ranking.computePot(t as any, regs as any);
    // expected: two punctual with 90, one non punctual 100 => 90+90+100 = 280
    expect(Math.round(pot)).toBe(280);
  });

  test('distributePrizes respects fewer players than positions', () => {
    const pot = 1000;
    const prizeConfig = { positions: 6, percentages: [50,20,15,10,3,2] };
    const payouts = ranking.distributePrizes(pot, prizeConfig, 3); // only 3 players
    // should return 3 payouts
    expect(payouts.length).toBe(3);
    // their sum should be <= pot (due to rounding) and > 0
    const sum = payouts.reduce((s, v) => s + v, 0);
    expect(sum).toBeGreaterThan(0);
    expect(sum).toBeLessThanOrEqual(pot);
  });
});
