import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { Op } from 'sequelize';

const router = Router();

// GET /api/users - list
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const perPage = Math.min(200, Math.max(5, Number(req.query.per_page) || 20));
    const offset = (page - 1) * perPage;

    const { rows, count } = await User.findAndCountAll({
      where: { is_deleted: false },
      attributes: ['id', 'username', 'full_name', 'role', 'avatar', 'createdAt'],
      limit: perPage,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));
    const links = {
      prev: page > 1 ? `/api/users?page=${page - 1}&per_page=${perPage}` : null,
      next: page < totalPages ? `/api/users?page=${page + 1}&per_page=${perPage}` : null
    };

    res.json({ data: rows, meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages }, links });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: err });
  }
});

// GET /api/users/search?q= - minimal search used by client-side autocomplete
router.get('/search', async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || '').trim();
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 20));
    if (!q) return res.json({ data: [] });
    const users = await User.findAll({
      where: {
        is_deleted: false,
        [Op.or]: [
          { username: { [Op.like]: `%${q}%` } },
          { full_name: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: ['id', 'username', 'full_name'],
      limit,
      order: [['username', 'ASC']]
    });
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: 'Error searching users', details: err });
  }
});

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario', details: err });
  }
});

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  const { username, password, full_name, role, avatar } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username y password son requeridos' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash: hash, full_name, role: role || 'user', avatar });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: 'No se pudo crear usuario', details: err });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  const { username, password, full_name, role, avatar } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (username) user.username = username;
    if (full_name !== undefined) user.full_name = full_name;
    if (role) user.role = role;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: 'No se pudo actualizar usuario', details: err });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });
  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario', details: err });
  }
});

export default router;
