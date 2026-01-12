import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository';

const router = Router();

// Dev-only helper: auto-login or create admin user (only in development)
router.get('/dev/login-admin', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).send('Not found');
  }
  try {
    let user = await UserRepository.findByUsername('admin');
    if (!user) {
      const pw = process.env.DEV_ADMIN_PW || 'admin123';
      const hash = await bcrypt.hash(pw, 10);
      user = await UserRepository.createUser({ username: 'admin', password_hash: hash, role: 'admin', full_name: 'Admin (dev)' });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    return res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Dev login error', err);
    return res.status(500).send('Dev login failed');
  }
});

// Dev helper: create a demo tournament and several users/registrations (some unpaid)
router.post('/dev/create-demo', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not found');
  try {
    const UserModel: any = await import('../models/User');
    const TournamentModel: any = await import('../models/Tournament');
    const RegistrationModel: any = await import('../models/Registration');
    const PaymentModel: any = await import('../models/Payment');

  // ensure models synced (development only) so helper works even on fresh DB
  try {
    // sync individual models to avoid relying on global sync ordering
    const tasks: Promise<any>[] = [];
    if (UserModel && UserModel.default && typeof UserModel.default.sync === 'function') tasks.push(UserModel.default.sync());
    if (TournamentModel && TournamentModel.Tournament && typeof TournamentModel.Tournament.sync === 'function') tasks.push(TournamentModel.Tournament.sync());
    if (RegistrationModel && RegistrationModel.Registration && typeof RegistrationModel.Registration.sync === 'function') tasks.push(RegistrationModel.Registration.sync());
    if (PaymentModel && PaymentModel.default && typeof PaymentModel.default.sync === 'function') tasks.push(PaymentModel.default.sync());
    if (tasks.length > 0) await Promise.all(tasks);
  } catch(e) { console.warn('dev create-demo: sync warning', e); }

  // create tournament starting in 1 hour (idempotent)
  const [t] = await TournamentModel.Tournament.findOrCreate({ where: { tournament_name: 'Demo Torneo' }, defaults: { start_date: new Date(Date.now() + 3600 * 1000), buy_in: 100, re_entry: 0, knockout_bounty: 0, starting_stack: 1000, count_to_ranking: false, double_points: false, blind_levels: 10, small_blind: 10, punctuality_discount: 20 } });

  // create some users (idempotent)
  const [u1] = await UserModel.default.findOrCreate({ where: { username: 'demo_p1' }, defaults: { password_hash: 'x', full_name: 'Jugador 1', is_player: true } });
  const [u2] = await UserModel.default.findOrCreate({ where: { username: 'demo_p2' }, defaults: { password_hash: 'x', full_name: 'Jugador 2', is_player: true } });
  const [u3] = await UserModel.default.findOrCreate({ where: { username: 'demo_p3' }, defaults: { password_hash: 'x', full_name: 'Jugador 3', is_player: true } });

    // register users: 1 pays, 2 doesn't pay, 3 pays partially
    const now = new Date();
  // create registrations/payments if not exist
  const [r1] = await RegistrationModel.Registration.findOrCreate({ where: { user_id: u1.id, tournament_id: t.id }, defaults: { registration_date: now, punctuality: true } as any });
  await PaymentModel.default.findOrCreate({ where: { reference_id: r1.id, source: 'tournament' }, defaults: { user_id: u1.id, amount: 80, payment_date: now, source: 'tournament', reference_id: r1.id, paid: true, paid_amount: 80, method: 'cash' } });

  const [r2] = await RegistrationModel.Registration.findOrCreate({ where: { user_id: u2.id, tournament_id: t.id }, defaults: { registration_date: now, punctuality: true } as any });
  await PaymentModel.default.findOrCreate({ where: { reference_id: r2.id, source: 'tournament' }, defaults: { user_id: u2.id, amount: 80, payment_date: now, source: 'tournament', reference_id: r2.id, paid: false, paid_amount: 0, method: null } });

  const [r3] = await RegistrationModel.Registration.findOrCreate({ where: { user_id: u3.id, tournament_id: t.id }, defaults: { registration_date: now, punctuality: true } as any });
  await PaymentModel.default.findOrCreate({ where: { reference_id: r3.id, source: 'tournament' }, defaults: { user_id: u3.id, amount: 80, payment_date: now, source: 'tournament', reference_id: r3.id, paid: false, paid_amount: 30, method: 'card' } });

    return res.json({ tournament: t, users: [u1, u2, u3] });
  } catch (e) {
    console.error('create-demo error', e);
    return res.status(500).json({ error: String(e) });
  }
});

// Dev helper: ensure a minimal players row exists for a given user id (development only)
router.post('/dev/ensure-player/:userId', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not found');
  const userId = Number(req.params.userId);
  if (!userId || isNaN(userId) || userId <= 0) return res.status(400).json({ error: 'Invalid userId' });
  try {
  const userModelImport: any = await import('../models/User');
  const sequelize = userModelImport && userModelImport.default ? (userModelImport.default as any).sequelize : null;
  if (!sequelize) return res.status(500).json({ error: 'Sequelize no disponible desde models/User' });
  const attempts: any[] = [];
    try {
  const qi = (sequelize as any).getQueryInterface();
  const desc = await qi.describeTable('players');
  const cols = Object.keys(desc || {});
      // build an INSERT that uses only existing columns
      // prefer id, then user_id, then username
      if (cols.includes('id')) {
        try {
          await sequelize.query('INSERT IGNORE INTO players (id) VALUES (?)', { replacements: [userId] });
          // verify row exists
          const check: any[] = await sequelize.query('SELECT id FROM players WHERE id = ? LIMIT 1', { replacements: [userId], type: (sequelize as any).QueryTypes.SELECT });
          const ok = Array.isArray(check) && check.length > 0;
          attempts.push({ method: 'id', ok });
        } catch (e) { attempts.push({ method: 'id', ok: false, err: String(e) }); }
      } else if (cols.includes('user_id')) {
        try {
          await sequelize.query('INSERT IGNORE INTO players (user_id) VALUES (?)', { replacements: [userId] });
          const check: any[] = await sequelize.query('SELECT id FROM players WHERE user_id = ? LIMIT 1', { replacements: [userId], type: (sequelize as any).QueryTypes.SELECT });
          const ok = Array.isArray(check) && check.length > 0;
          attempts.push({ method: 'user_id', ok });
        } catch (e) { attempts.push({ method: 'user_id', ok: false, err: String(e) }); }
      } else if (cols.includes('username')) {
        try {
          await sequelize.query('INSERT IGNORE INTO players (username) SELECT username FROM users WHERE id = ? LIMIT 1', { replacements: [userId] });
          const check: any[] = await sequelize.query('SELECT id FROM players WHERE username = (SELECT username FROM users WHERE id = ? LIMIT 1) LIMIT 1', { replacements: [userId], type: (sequelize as any).QueryTypes.SELECT });
          const ok = Array.isArray(check) && check.length > 0;
          attempts.push({ method: 'username', ok });
        } catch (e) { attempts.push({ method: 'username', ok: false, err: String(e) }); }
      } else {
        attempts.push({ method: 'none', ok: false, err: 'No compatible players columns found: ' + cols.join(',') });
      }
      return res.json({ userId, attempts, columns: cols });
    } catch (e) {
      // fallback: try conservative id insert without other columns
      try {
        await sequelize.query('INSERT IGNORE INTO players (id) VALUES (?)', { replacements: [userId] });
        attempts.push({ method: 'id-fallback', ok: true });
        return res.json({ userId, attempts });
      } catch (e2) {
        attempts.push({ method: 'id-fallback', ok: false, err: String(e2) });
        return res.status(500).json({ userId, attempts, error: String(e) });
      }
    }
  } catch (err) {
    console.error('ensure-player error', err);
    return res.status(500).json({ error: 'Errores al intentar crear players row', details: String(err) });
  }
});

export default router;

// Dev-only debug endpoint: inspect players row by id
// Note: registered only when NODE_ENV=development via app.ts mounting of devRoutes
router.get('/dev/debug/player/:id', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not found');
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const userModelImport: any = await import('../models/User');
    const sequelize = userModelImport && userModelImport.default ? (userModelImport.default as any).sequelize : null;
    if (!sequelize) return res.status(500).json({ error: 'Sequelize no disponible' });
    const rows: any[] = await sequelize.query('SELECT * FROM players WHERE id = ? LIMIT 1', { replacements: [id], type: (sequelize as any).QueryTypes.SELECT });
    return res.json({ found: rows.length > 0, row: rows[0] || null });
  } catch (err) {
    console.error('dev debug player error', err);
    return res.status(500).json({ error: String(err) });
  }
});

// Dev-only: describe a table (columns) to inspect schema
router.get('/dev/debug/describe/:table', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') return res.status(404).send('Not found');
  const table = String(req.params.table || '').replace(/[^a-zA-Z0-9_]/g, '');
  if (!table) return res.status(400).json({ error: 'Invalid table' });
  try {
    const userModelImport: any = await import('../models/User');
    const sequelize = userModelImport && userModelImport.default ? (userModelImport.default as any).sequelize : null;
    if (!sequelize) return res.status(500).json({ error: 'Sequelize no disponible' });
    const qi = (sequelize as any).getQueryInterface();
    const desc = await qi.describeTable(table);
    return res.json({ table, columns: Object.keys(desc || {}) });
  } catch (err) {
    console.error('describe table error', err);
    return res.status(500).json({ error: String(err) });
  }
});
