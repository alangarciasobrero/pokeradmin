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
