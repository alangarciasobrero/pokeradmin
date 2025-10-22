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
    const sequelize = (await import('../models/User')).default.sequelize;
    const attempts: any[] = [];
    // Try insert using user_id column
    try {
      await sequelize.query('INSERT IGNORE INTO players (user_id, createdAt, updatedAt) VALUES (?, NOW(), NOW())', { replacements: [userId] });
      attempts.push({ method: 'user_id', ok: true });
    } catch (e) { attempts.push({ method: 'user_id', ok: false, err: String(e) }); }
    // Try insert using id column
    try {
      await sequelize.query('INSERT IGNORE INTO players (id, createdAt, updatedAt) VALUES (?, NOW(), NOW())', { replacements: [userId] });
      attempts.push({ method: 'id', ok: true });
    } catch (e) { attempts.push({ method: 'id', ok: false, err: String(e) }); }
    // Try insert using username if available
    try {
      await sequelize.query('INSERT IGNORE INTO players (username, createdAt, updatedAt) SELECT username, NOW(), NOW() FROM users WHERE id = ? LIMIT 1', { replacements: [userId] });
      attempts.push({ method: 'username', ok: true });
    } catch (e) { attempts.push({ method: 'username', ok: false, err: String(e) }); }

    return res.json({ userId, attempts });
  } catch (err) {
    console.error('ensure-player error', err);
    return res.status(500).json({ error: 'Errores al intentar crear players row', details: String(err) });
  }
});

export default router;
