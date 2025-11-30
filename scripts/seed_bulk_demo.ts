import sequelize from '../src/services/database';
import bcrypt from 'bcrypt';
import User from '../src/models/User';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';
import Payment from '../src/models/Payment';
import CashGame from '../src/models/CashGame';
import CashParticipant from '../src/models/CashParticipant';
import HistoricalPoint from '../src/models/HistoricalPoint';

async function run() {
  try {
    console.log('Connecting to DB...');
    await sequelize.authenticate();
    // ensure models are registered
    await sequelize.sync();

    const users: Array<{ id: number; username: string; first_name?: string; last_name?: string; email?: string; nickname?: string; phone?: string }> = [];
    const debts: Array<{ user_id: number; username: string; amount: number; personal_account?: boolean; note?: string }> = [];

    // tiny helper to normalise accented characters for emails
    const normalize = (s: string) => s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-zA-Z0-9\.\-_]/g, '')
      .toLowerCase();

    // small lists of realistic first and last names to generate readable seed users
    const firstNames = [
      'Alejandro','María','Carlos','Lucía','Diego','Sofía','Mateo','Valentina','Javier','Isabella',
      'Santiago','Camila','Andrés','Laura','Pablo','Marta','Luis','Ana','Ricardo','Natalia',
      'Miguel','Paula','Fernando','Daniela','Óscar','Clara','Ignacio','Adriana','Rubén','Elena',
      'Manuel','Irene','Tomás','Mónica','Enrique','Sara','Raúl','Noelia','Álvaro','Beatriz',
      'Rubén','Esther','Hugo','Lidia','Marco','Rocío','Víctor','Carla','Gonzalo','Nuria'
    ];
    const lastNames = [
      'García','Fernández','González','Rodríguez','López','Martínez','Sánchez','Pérez','Gómez','Ruiz',
      'Hernández','Díaz','Jiménez','Moreno','Alonso','Álvarez','Romero','Vázquez','Muñoz','Serrano',
      'Ortega','Castro','Suárez','Ramos','Gil','Blanco','Molina','Cortés','Ortiz','Navarro',
      'Torres','Domínguez','Vega','Marín','Iglesias','Redondo','Cano','Pascual','Ferrer','Solé',
      'Rojas','Cruz','Montero','Herrera','Calvo','Mora','Núñez','Santos','Varela','Polo'
    ];

    console.log('Creating 50 users...');
    for (let i = 1; i <= 50; i++) {
      const username = `seed_user_${String(i).padStart(3, '0')}`;
      const pw = 'password';
      const hash = await bcrypt.hash(pw, 8);
      // pick deterministic first/last name from arrays so names are readable and reproducible
      const first = firstNames[(i - 1) % firstNames.length];
      const last = lastNames[(i - 1) % lastNames.length];
      const fullName = `${first} ${last}`;

      // build a readable email and nickname
      const email = `${normalize(first)}.${normalize(last)}@example.com`;
      const nickname = `${first.toLowerCase()}.${last.toLowerCase()}`.replace(/[^a-z0-9\.\-_]/g, '');
      const phone = `6${Math.floor(10000000 + Math.random() * 89999999)}`; // spanish-like mobile

      const [u, created] = await User.findOrCreate({
        where: { username },
        defaults: { username, password_hash: hash, full_name: fullName, first_name: first, last_name: last, email, nickname, phone_number: phone, is_player: true, current_points: Math.floor(Math.random() * 800) } as any
      });
      if (!created) {
        u.full_name = fullName;
        u.first_name = first;
        u.last_name = last;
        u.email = u.email || email;
        u.nickname = u.nickname || nickname;
        u.phone_number = u.phone_number || phone;
        u.is_player = true;
        u.current_points = u.current_points || Math.floor(Math.random() * 800);
        await u.save();
      }
      users.push({ id: u.id, username: u.username, first_name: u.first_name, last_name: u.last_name, email: u.email, nickname: u.nickname, phone: u.phone_number });
    }

    // Create a tournament for today (2025-11-15) or reuse existing
    const today = new Date('2025-11-15T20:00:00');
    const [tour, tcreated] = await Tournament.findOrCreate({ where: { tournament_name: 'Seeded Today Tournament' }, defaults: { tournament_name: 'Seeded Today Tournament', start_date: today, buy_in: 80, re_entry: 0, knockout_bounty: 0, starting_stack: 1000, count_to_ranking: false, double_points: false, blind_levels: 10, small_blind: 10, punctuality_discount: 0 } as any });

    // Create a few cash games (past and today)
    console.log('Creating cash games and participants...');
    const cg1 = await CashGame.create({ small_blind: 1, start_datetime: new Date('2025-11-14T20:00:00'), dealer: 'dealer1' });
    const cg2 = await CashGame.create({ small_blind: 2, start_datetime: new Date('2025-11-15T18:00:00'), dealer: 'dealer2' });
    const cg3 = await CashGame.create({ small_blind: 5, start_datetime: new Date('2025-11-15T19:00:00'), dealer: 'dealer3' });

    // assign many users to cash participants across games
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      // random participation
      if (Math.random() < 0.6) await CashParticipant.create({ cash_game_id: cg1.id, user_id: u.id, seat_number: (i % 9) + 1, joined_at: new Date() });
      if (Math.random() < 0.4) await CashParticipant.create({ cash_game_id: cg2.id, user_id: u.id, seat_number: (i % 9) + 1, joined_at: new Date() });
      if (Math.random() < 0.3) await CashParticipant.create({ cash_game_id: cg3.id, user_id: u.id, seat_number: (i % 9) + 1, joined_at: new Date() });
    }

    // Add historical points for many users
    console.log('Adding historical ranking points...');
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      const entries = Math.floor(Math.random() * 4);
      for (let e = 0; e < entries; e++) {
        await HistoricalPoint.create({ record_date: new Date(), user_id: u.id, season_id: 1, tournament_id: null, result_id: null, action_type: 'attendance', description: 'Seed attendance', points: Math.floor(Math.random() * 100) });
      }
    }

    // Create registrations for 20 users in today's tournament
    console.log('Registering 20 users into today tournament...');
    const regsUsers = users.slice(0, 20);
    for (let i = 0; i < regsUsers.length; i++) {
      const u = regsUsers[i];
      const punctual = true;
      const reg = await Registration.create({ user_id: u.id, tournament_id: tour.id, registration_date: new Date(), punctuality: punctual } as any);
      // create payment expectation
      const expected = Number((tour as any).buy_in || 80);
      // Some paid, some unpaid, some partial
      const r = Math.random();
      if (r < 0.5) {
        // fully paid
        await Payment.create({ user_id: u.id, amount: expected, payment_date: new Date(), source: 'tournament', reference_id: reg.id, paid: true, paid_amount: expected, method: 'cash' });
      } else if (r < 0.8) {
        // partial
        const paidAmt = Math.floor(expected / 2);
        await Payment.create({ user_id: u.id, amount: expected, payment_date: new Date(), source: 'tournament', reference_id: reg.id, paid: false, paid_amount: paidAmt, method: 'card' });
        // record outstanding part as debt for visibility
        debts.push({ user_id: u.id, username: u.username, amount: expected - paidAmt, personal_account: false, note: 'partial tournament payment' });
      } else {
        // unpaid - create debt
        await Payment.create({ user_id: u.id, amount: expected, payment_date: new Date(), source: 'tournament', reference_id: reg.id, paid: false, paid_amount: 0, method: null });
        debts.push({ user_id: u.id, username: u.username, amount: expected, personal_account: false, note: 'unpaid tournament registration' });
      }
    }

    // Add historical debts for some users (personal_account true)
    console.log('Adding historical debts for some users...');
    for (let i = 20; i < 35; i++) {
      const u = users[i];
      // create several personal account debt records (some users will have multiple debts)
      const debtCount = 1 + Math.floor(Math.random() * 3);
      for (let d = 0; d < debtCount; d++) {
        const amount = 20 + Math.floor(Math.random() * 300);
        await Payment.create({ user_id: u.id, amount, payment_date: new Date('2025-10-01'), source: 'bar', reference_id: null, paid: false, paid_amount: 0, method: null, personal_account: true });
        debts.push({ user_id: u.id, username: u.username, amount, personal_account: true, note: 'personal account debt' });
      }
    }

    console.log('Seed complete. Listing users (id \t username \t full name \t email \t phone):');
    users.forEach(u => console.log(`${u.id}\t${u.username}\t${u.first_name || ''} ${u.last_name || ''}\t${u.email || ''}\t${u.phone || ''}`));

    if (debts.length) {
      console.log('\nUsers with debts created: (user_id \t username \t amount \t personal_account \t note)');
      debts.forEach(d => console.log(`${d.user_id}\t${d.username}\t${d.amount}\t${d.personal_account ? 'yes' : 'no'}\t${d.note || ''}`));
    } else {
      console.log('\nNo debts were created.');
    }

    await sequelize.close();
    console.log('DB connection closed.');
  } catch (err) {
    console.error('Error seeding demo data', err);
    try { await sequelize.close(); } catch (e) {}
    process.exit(1);
  }
}

run();
