import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import { User } from '../models/User';
import Payment from '../models/Payment';
import { Registration } from '../models/Registration';
import CashParticipant from '../models/CashParticipant';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const router = Router();

// use central requireAdmin middleware imported above

// GET /admin/users - Listado de usuarios con búsqueda
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(200, Math.max(5, Number(req.query.per_page) || 50));
  const offset = (page - 1) * perPage;
  const searchQuery = (req.query.search as string || '').trim();

  try {
    const where: any = { is_deleted: false };
    
    // Si hay búsqueda, agregar filtro
    if (searchQuery) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { username: { [Op.like]: `%${searchQuery}%` } },
        { full_name: { [Op.like]: `%${searchQuery}%` } }
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'full_name', 'role', 'avatar', 'createdAt'],
      limit: perPage,
      offset,
      order: [['username', 'ASC']]
    });

    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));
    const links = {
      prev: page > 1 ? `/admin/users?page=${page - 1}&per_page=${perPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}` : null,
      next: page < totalPages ? `/admin/users?page=${page + 1}&per_page=${perPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}` : null
    };

    res.render('admin_users', { users: rows, meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages }, links, searchQuery });
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
// disk storage for avatar uploads
const avatarsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });
const avatarStorage = multer.diskStorage({
  destination: function (_req: any, _file: Express.Multer.File, cb: (err: Error | null, dest: string) => void) { cb(null, avatarsDir); },
  filename: function (_req: any, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) {
    const uniq = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-${uniq}${ext}`);
  }
});
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 3 * 1024 * 1024 } });
router.post('/import', requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
  try {
  if (!req.file) return res.status(400).send('No se subió ningún archivo');

  // Parsear buffer con xlsx (soporta CSV y XLSX)
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const results: { created: number; errors: Array<any> } = { created: 0, errors: [] };

    for (const [idx, row] of rows.entries()) {
      try {
        // Esperamos columnas: username, password, first_name, last_name, email, role
        const username = row.username || row.user || row.Username || row.User;
        // Si no hay password en CSV, generar una basada en username (primeras 4 letras + 4 dígitos)
        const password = row.password || row.pass || (username ? username.substring(0, 4).toLowerCase() + Math.floor(1000 + Math.random() * 9000) : 'changeme');
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
  // read gallery images
  const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
  let gallery: string[] = [];
  try {
    if (fs.existsSync(galleryDir)) {
      gallery = fs.readdirSync(galleryDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).map(f => `/images/gallery/${f}`);
    }
  } catch (e) {
    gallery = [];
  }
  res.render('admin_users_form', { formTitle: 'Nuevo usuario', formAction: '/admin/users', user: { role: 'user' }, gallery });
});

// POST /admin/users - crear
// Create (support multipart for avatar upload)
router.post('/', requireAdmin, uploadAvatar.single('avatarFile'), async (req: Request, res: Response) => {
  try {
    const { username, password, full_name, role, avatarGallery } = req.body;
    let avatarPath = avatarGallery || null;
    if ((req as any).file) {
      // save relative path to public
      avatarPath = `/uploads/avatars/${(req as any).file.filename}`;
    }
    if (!username || !password) return res.render('admin_users_form', { error: 'username y password son requeridos', formTitle: 'Nuevo usuario', formAction: '/admin/users', user: req.body, gallery: [] });
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash(password, 10);
    const finalRole = role || 'user'; // Default a 'user' (player) si no se especifica
    const newUser = await User.create({ username, password_hash: hash, full_name, role: finalRole, avatar: avatarPath || null });
    req.session!.flash = { type: 'success', message: `Usuario ${username} creado exitosamente como ${finalRole === 'admin' ? 'Admin' : 'Player'}` };
    res.redirect('/admin/users');
  } catch (err: any) {
    console.error('Error creating user:', err);
    const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
    let gallery: string[] = [];
    try {
      if (fs.existsSync(galleryDir)) {
        gallery = fs.readdirSync(galleryDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).map(f => `/images/gallery/${f}`);
      }
    } catch (e) {
      gallery = [];
    }
    const errorMsg = err.name === 'SequelizeUniqueConstraintError' ? 'El nombre de usuario ya existe' : 'No se pudo crear usuario';
    res.render('admin_users_form', { error: errorMsg, formTitle: 'Nuevo usuario', formAction: '/admin/users', user: req.body, gallery });
  }
});

// POST /admin/users/quick-create - create user via AJAX for admin quick workflows
router.post('/quick-create', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, full_name } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });
    // ensure username uniqueness
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'username exists', id: existing.id, username: existing.username });
    
    // Generar contraseña temporal: primeras 4 letras del username + 4 dígitos aleatorios
    const tempPassword = username.substring(0, 4).toLowerCase() + Math.floor(1000 + Math.random() * 9000);
    
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash(tempPassword, 10);
    const newUser = await User.create({ username, password_hash: hash, full_name: full_name || null, is_player: true });
    
    return res.status(201).json({ 
      id: newUser.id, 
      username: newUser.username, 
      full_name: newUser.full_name,
      tempPassword: tempPassword // Enviar contraseña temporal al frontend
    });
  } catch (err) {
    console.error('quick-create user error', err);
    return res.status(500).json({ error: 'error creating user', details: err });
  }
});

// GET /admin/users/:id/edit - form editar
router.get('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await User.findByPk(id);
  if (!user) return res.redirect('/admin/users');
  const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
  let gallery: string[] = [];
  try {
    gallery = fs.readdirSync(galleryDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).map(f => `/images/gallery/${f}`);
  } catch (e) {
    gallery = [];
  }
  res.render('admin_users_form', { formTitle: 'Editar usuario', formAction: '/admin/users/' + id, user, gallery });
});

// POST /admin/users/:id - actualizar (POST para simplificar forms)
// Update (support avatar upload)
router.post('/:id', requireAdmin, uploadAvatar.single('avatarFile'), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { username, password, full_name, role, avatarGallery } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.redirect('/admin/users');
    user.username = username || user.username;
    user.full_name = full_name || user.full_name;
    user.role = role || user.role;
    if (avatarGallery) user.avatar = avatarGallery;
    if ((req as any).file) user.avatar = `/uploads/avatars/${(req as any).file.filename}`;
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

// GET /admin/users/:id/ledger - muestra movimientos y saldo del usuario
router.get('/:id/ledger', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);
    if (!user) return res.redirect('/admin/users');

    const payments = await Payment.findAll({ where: { user_id: id }, order: [['payment_date','DESC']] });
    const registrations = await Registration.findAll({ where: { user_id: id }, include: [] });
    const cashParts = await CashParticipant.findAll({ where: { user_id: id } });

    // Calcular totales:
    // 1. Total pagado (lo que el usuario ya pagó)
    const totalPaid = payments.reduce((s, p: any) => s + Number(p.paid_amount || 0), 0);
    
    // 2. Total adeudado (suma de todos los montos de pagos)
    const totalOwed = payments.reduce((s, p: any) => s + Number(p.amount || 0), 0);
    
    // 3. Sumar buy_in de torneos vinculados a las inscripciones (esto ya está incluido en payments si se registró correctamente)
    let totalRegistrationsCost = 0;
    for (const r of registrations) {
      // carga lazily el torneo si es necesario
      const t = await (await import('../models/Tournament')).Tournament.findByPk((r as any).tournament_id);
      if (t) totalRegistrationsCost += Number((t as any).buy_in || 0);
    }

    // Balance = Lo que pagó - Lo que debe
    const balance = totalPaid - totalOwed;

    res.render('admin_user_ledger', { user, payments, registrations, cashParts, totals: { totalPaid, totalRegistrationsCost: totalOwed, balance } });
  } catch (e) {
    console.error('Error ledger user', e);
    res.redirect('/admin/users');
  }
});

// POST /admin/users/:id/payments/:pid/mark-paid - marcar pago como pagado desde ledger
router.post('/:id/payments/:pid/mark-paid', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pid = Number(req.params.pid);
  const paidAmountRaw = req.body.paid_amount;
  const paidAmount = paidAmountRaw !== undefined && paidAmountRaw !== null && paidAmountRaw !== '' ? Number(paidAmountRaw) : null;
  const method = req.body.method || null;
  const now = new Date();

    const payment = await Payment.findOne({ where: { id: pid, user_id: id } });
    if (!payment) {
      if (req.session) req.session.flash = { type: 'error', message: 'Pago no encontrado' };
      return res.redirect(`/admin/users/${id}/ledger`);
    }

  // If paidAmount provided use it, otherwise assume full expected amount
  const expected = Number((payment as any).amount || 0);
  const amountToRecord = paidAmount !== null ? paidAmount : expected;

  // create a new payment row representing the actual money movement (audit of payment)
  // attach recorder info to method for audit
  const methodWithActor = req.session && req.session.username ? (method ? `${method}|by:${req.session.username}:${req.session.userId}` : `manual|by:${req.session.username}:${req.session.userId}`) : (method || null);
  const recordedByName = req.session && req.session.username ? String(req.session.username) : null;
  const settlement = await Payment.create({ user_id: id, amount: amountToRecord, payment_date: now, source: 'settlement', reference_id: (payment as any).reference_id || null, paid: true, paid_amount: amountToRecord, method: methodWithActor, recorded_by_name: recordedByName });

  // update original expected payment to accumulate paid_amount
  const prevPaid = Number((payment as any).paid_amount || 0);
  const newPaidAmount = prevPaid + Number(amountToRecord);
  (payment as any).paid_amount = newPaidAmount;
  (payment as any).paid = (newPaidAmount > 0 && (newPaidAmount >= expected || expected === 0));
  await payment.save();

    if (req.session) req.session.flash = { type: 'success', message: 'Pago marcado como pagado' };
    return res.redirect(`/admin/users/${id}/ledger`);
  } catch (err) {
    console.error('Error marking payment paid', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al marcar pago' };
    return res.redirect(`/admin/users/${req.params.id}/ledger`);
  }
});

// POST /admin/users/:id/payments/bulk-pay - pago múltiple desde libro mayor
router.post('/:id/payments/bulk-pay', requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const paymentIds = Array.isArray(req.body['payment_ids[]']) ? req.body['payment_ids[]'].map(Number) : [Number(req.body['payment_ids[]'])].filter(n => !isNaN(n));
    const totalPaymentAmount = Number(req.body.amount);
    const method = req.body.method || 'cash';
    const now = new Date();

    if (!paymentIds.length) {
      if (req.session) req.session.flash = { type: 'error', message: 'No seleccionaste ningún movimiento' };
      return res.redirect(`/admin/users/${userId}/ledger`);
    }

    if (totalPaymentAmount <= 0) {
      if (req.session) req.session.flash = { type: 'error', message: 'El monto debe ser mayor a 0' };
      return res.redirect(`/admin/users/${userId}/ledger`);
    }

    const payments = await Payment.findAll({
      where: { id: paymentIds, user_id: userId },
      order: [['payment_date', 'ASC']]
    });

    if (!payments.length) {
      if (req.session) req.session.flash = { type: 'error', message: 'No se encontraron los pagos seleccionados' };
      return res.redirect(`/admin/users/${userId}/ledger`);
    }

    const methodWithActor = req.session && req.session.username ? `${method}|by:${req.session.username}:${req.session.userId}` : method;
    const recordedByName = req.session && req.session.username ? String(req.session.username) : null;

    let remainingAmount = totalPaymentAmount;
    const paidPayments: any[] = [];

    for (const payment of payments) {
      if (remainingAmount <= 0) break;
      const pAny = payment as any;
      const expected = Number(pAny.amount || 0);
      const prevPaid = Number(pAny.paid_amount || 0);
      const pending = Math.max(0, expected - prevPaid);
      if (pending <= 0) continue;
      const amountToApply = Math.min(pending, remainingAmount);

      await Payment.create({
        user_id: userId,
        amount: amountToApply,
        payment_date: now,
        source: 'settlement',
        reference_id: pAny.id,
        paid: true,
        paid_amount: amountToApply,
        method: methodWithActor,
        recorded_by_name: recordedByName
      });

      const newPaidAmount = prevPaid + amountToApply;
      pAny.paid_amount = newPaidAmount;
      pAny.paid = (newPaidAmount >= expected);
      await pAny.save();

      remainingAmount -= amountToApply;
      paidPayments.push({ id: pAny.id, paid: amountToApply });
    }

    const totalApplied = totalPaymentAmount - remainingAmount;
    if (req.session) {
      req.session.flash = {
        type: 'success',
        message: `✅ Pago registrado: $${totalApplied.toFixed(0)} aplicado a ${paidPayments.length} movimiento(s)${remainingAmount > 0 ? `. Sobrante: $${remainingAmount.toFixed(0)}` : ''}`
      };
    }

    return res.redirect(`/admin/users/${userId}/ledger`);
  } catch (err) {
    console.error('Error processing bulk payment', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al procesar el pago múltiple' };
    return res.redirect(`/admin/users/${req.params.id}/ledger`);
  }
});

// POST /admin/users/:id/payments/quick-pay - pago rápido desde lista de deudores
router.post('/:id/payments/quick-pay', requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const totalPaymentAmount = Number(req.body.amount);
    const method = req.body.method || 'cash';
    const now = new Date();
    const { Op } = await import('sequelize');
    const sequelize = await import('../services/database');

    if (totalPaymentAmount <= 0) {
      if (req.session) req.session.flash = { type: 'error', message: 'El monto debe ser mayor a 0' };
      return res.redirect('/admin/debtors');
    }

    const payments = await Payment.findAll({
      where: {
        user_id: userId,
        source: { [Op.in]: ['tournament', 'cash', 'cash_request'] },
        [Op.or]: [
          { paid: false },
          (sequelize.default as any).literal('amount > COALESCE(paid_amount, 0)')
        ]
      },
      order: [['payment_date', 'ASC']]
    });

    if (!payments.length) {
      if (req.session) req.session.flash = { type: 'info', message: 'No hay pagos pendientes' };
      return res.redirect('/admin/debtors');
    }

    const methodWithActor = req.session && req.session.username ? `${method}|by:${req.session.username}:${req.session.userId}` : method;
    const recordedByName = req.session && req.session.username ? String(req.session.username) : null;

    let remainingAmount = totalPaymentAmount;
    const paidPayments: any[] = [];

    for (const payment of payments) {
      if (remainingAmount <= 0) break;
      const pAny = payment as any;
      const expected = Number(pAny.amount || 0);
      const prevPaid = Number(pAny.paid_amount || 0);
      const pending = Math.max(0, expected - prevPaid);
      if (pending <= 0) continue;
      const amountToApply = Math.min(pending, remainingAmount);

      await Payment.create({
        user_id: userId,
        amount: amountToApply,
        payment_date: now,
        source: 'settlement',
        reference_id: pAny.id,
        paid: true,
        paid_amount: amountToApply,
        method: methodWithActor,
        recorded_by_name: recordedByName
      });

      const newPaidAmount = prevPaid + amountToApply;
      pAny.paid_amount = newPaidAmount;
      pAny.paid = (newPaidAmount >= expected);
      await pAny.save();
      remainingAmount -= amountToApply;
      paidPayments.push({ id: pAny.id, paid: amountToApply });
    }

    const totalApplied = totalPaymentAmount - remainingAmount;
    if (req.session) {
      req.session.flash = {
        type: 'success',
        message: `✅ Pago registrado: $${totalApplied.toFixed(0)} aplicado a ${paidPayments.length} movimiento(s)${remainingAmount > 0 ? `. Sobrante: $${remainingAmount.toFixed(0)}` : ''}`
      };
    }
    return res.redirect('/admin/debtors');
  } catch (err) {
    console.error('Error processing quick payment', err);
    if (req.session) req.session.flash = { type: 'error', message: 'Error al procesar el pago rápido' };
    return res.redirect('/admin/debtors');
  }
});

export default router;
