import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository';

const router = Router();

// GET /login - muestra el formulario de login
router.get('/login', (req: Request, res: Response) => {
  res.render('login', { layout: 'main' });
});

// POST /login - procesa el login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', { error: 'Usuario y contraseña requeridos', layout: 'main' });
  }
  const user = await UserRepository.findByUsername(username);
  if (!user) {
    return res.render('login', { error: 'Usuario o contraseña incorrectos', layout: 'main' });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.render('login', { error: 'Usuario o contraseña incorrectos', layout: 'main' });
  }
  // Guardar usuario en sesión
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.role = user.role;
  if (user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/');
});

// POST /logout - cierra sesión
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
