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

export default router;
