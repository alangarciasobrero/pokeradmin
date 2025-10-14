import { Router, Request, Response } from 'express';
import { User } from '../models/User';

const router = Router();

// Middleware para proteger solo admin
function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

// GET /admin/users - Listado de usuarios
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  const users = await User.findAll({ attributes: ['id', 'username', 'full_name', 'role'] });
  res.render('admin_users', { users });
});

export default router;
