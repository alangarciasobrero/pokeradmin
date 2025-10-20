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
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(200, Math.max(5, Number(req.query.per_page) || 20));
  const offset = (page - 1) * perPage;

  try {
    const { rows, count } = await User.findAndCountAll({
      where: { is_deleted: false },
      attributes: ['id', 'username', 'full_name', 'role', 'avatar', 'createdAt'],
      limit: perPage,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));
    const links = {
      prev: page > 1 ? `/admin/users?page=${page - 1}&per_page=${perPage}` : null,
      next: page < totalPages ? `/admin/users?page=${page + 1}&per_page=${perPage}` : null
    };

    res.render('admin_users', { users: rows, meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages }, links });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al listar usuarios');
  }
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
        let first_name = row.first_name || row.firstName || row.FirstName || null;
        let last_name = row.last_name || row.lastName || row.LastName || null;
        // Support a single `full_name` column and split it into first/last when possible
        const fullNameRaw = row.full_name || row.fullName || row.FullName || row.Fullname || null;
        if ((!first_name || !last_name) && fullNameRaw) {
          const parts = String(fullNameRaw).trim().split(/\s+/);
          if (!first_name && parts.length > 0) first_name = parts.shift() || null;
          if (!last_name && parts.length > 0) last_name = parts.join(' ');
        }
  // Fallbacks to avoid NOT NULL DB violations: use username as first_name and empty last_name
  if (!first_name) first_name = String(username);
  if (!last_name) last_name = '';
  // Build a final full_name to store (prefer explicit fullNameRaw, else join first/last)
  const finalFullName = fullNameRaw ? String(fullNameRaw).trim() : (String(first_name) + (last_name ? (' ' + last_name) : '')).trim();
        const email = row.email || row.Email || null;
        const role = (row.role || row.Role || 'user');

        if (!username) {
          results.errors.push({ row: idx + 2, error: 'username faltante' });
          continue;
        }

        const bcrypt = await import('bcrypt');
        const hash = await bcrypt.hash(String(password), 10);

  await User.create({ username, password_hash: hash, first_name, last_name, full_name: finalFullName || null, email, role: role === 'admin' ? 'admin' : 'user' });
        results.created += 1;
      } catch (e: any) {
        // Try to build a clearer error message (Sequelize may include .errors array)
        let msg = e && e.message ? e.message : String(e);
        if (e && Array.isArray(e.errors)) {
          const parts = e.errors.map((er: any) => er.message || JSON.stringify(er));
          msg = msg + ": " + parts.join('; ');
        }
        results.errors.push({ row: idx + 2, error: msg });
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
