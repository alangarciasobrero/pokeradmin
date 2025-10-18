import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import multer from 'multer';
import XLSX from 'xlsx';

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

// GET /admin/users/import - form simple para subir archivo
router.get('/import', requireAdmin, (req: Request, res: Response) => {
  res.render('admin_users_import', { formAction: '/admin/users/import' });
});

// POST /admin/users/import - procesar CSV/XLSX y crear usuarios en batch
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
router.post('/import', requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
  try {
  if (!(req as any).file) return res.status(400).send('No se subió ningún archivo');

  // Parsear buffer con xlsx (soporta CSV y XLSX)
  const workbook = XLSX.read((req as any).file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const results: { created: number; errors: Array<any> } = { created: 0, errors: [] };

    for (const [idx, row] of rows.entries()) {
      try {
        // Esperamos columnas: username, password, first_name, last_name, email, role
        const username = row.username || row.user || row.Username || row.User;
        const password = row.password || row.pass || 'changeme';
        const first_name = row.first_name || row.firstName || row.FirstName || null;
        const last_name = row.last_name || row.lastName || row.LastName || null;
        const email = row.email || row.Email || null;
        const role = (row.role || row.Role || 'user');

        if (!username) {
          results.errors.push({ row: idx + 2, error: 'username faltante' });
          continue;
        }

        const bcrypt = await import('bcrypt');
        const hash = await bcrypt.hash(String(password), 10);

        await User.create({ username, password_hash: hash, first_name, last_name, email, role: role === 'admin' ? 'admin' : 'user' });
        results.created += 1;
      } catch (e: any) {
        results.errors.push({ row: idx + 2, error: e.message || e });
      }
    }

    res.render('admin_users_import_result', { results });
  } catch (err) {
    res.render('admin_users_import', { error: 'Error procesando archivo: ' + err, formAction: '/admin/users/import' });
  }
});

// GET /admin/users/new - form crear
router.get('/new', requireAdmin, (req: Request, res: Response) => {
  res.render('admin_users_form', { formTitle: 'Nuevo usuario', formAction: '/admin/users', user: {}, gallery: [] });
});

// POST /admin/users - crear
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, password, full_name, role, avatarGallery } = req.body;
    if (!username || !password) return res.render('admin_users_form', { error: 'username y password son requeridos', formTitle: 'Nuevo usuario', formAction: '/admin/users', user: req.body });
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password_hash: hash, full_name, role: role || 'user', avatar: avatarGallery || null });
    res.redirect('/admin/users');
  } catch (err) {
    res.render('admin_users_form', { error: 'No se pudo crear usuario', details: err, formTitle: 'Nuevo usuario', formAction: '/admin/users', user: req.body });
  }
});

// GET /admin/users/:id/edit - form editar
router.get('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await User.findByPk(id);
  if (!user) return res.redirect('/admin/users');
  res.render('admin_users_form', { formTitle: 'Editar usuario', formAction: '/admin/users/' + id, user, gallery: [] });
});

// POST /admin/users/:id - actualizar (POST para simplificar forms)
router.post('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { username, password, full_name, role, avatarGallery } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.redirect('/admin/users');
    user.username = username || user.username;
    user.full_name = full_name || user.full_name;
    user.role = role || user.role;
    if (avatarGallery) user.avatar = avatarGallery;
    if (password) {
      const bcrypt = await import('bcrypt');
      user.password_hash = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    res.redirect('/admin/users');
  }
});

// POST /admin/users/:id/delete
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await User.destroy({ where: { id } });
    res.redirect('/admin/users');
  } catch (err) {
    res.redirect('/admin/users');
  }
});

export default router;
