import { Router, Request, Response } from 'express';
import CashGameRepository from '../repositories/CashGameRepository';

const router = Router();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(200, Math.max(5, Number(req.query.per_page) || 20));
  try {
    const { rows, count } = await CashGameRepository.getPaginated({ page, perPage });
    const totalPages = Math.max(1, Math.ceil(Number(count) / perPage));
    const links = {
      prev: page > 1 ? `/admin/games/cash/list?page=${page - 1}&per_page=${perPage}` : null,
      next: page < totalPages ? `/admin/games/cash/list?page=${page + 1}&per_page=${perPage}` : null
    };
    res.render('admin/cash_list', { cashGames: rows, meta: { page, per_page: perPage, total_items: Number(count), total_pages: totalPages }, links, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar cash games');
  }
});

router.get('/new', requireAdmin, (req: Request, res: Response) => {
  // Use admin form action so the admin POST handler is used
  res.render('cash/form', { formTitle: 'Nueva Mesa Cash', formAction: '/admin/games/cash/new' });
});

// Edit form: render existing cash game into the same form
router.get('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.redirect('/admin/games/cash/list');
    res.render('cash/form', { formTitle: 'Editar Mesa Cash', formAction: `/admin/games/cash/${id}/edit`, cash });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/games/cash/list');
  }
});

router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cash = await CashGameRepository.findById(id);
    if (!cash) return res.status(404).send('No encontrado');
    res.render('cash/detail', { cash, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Create via admin form (POST to API already exists, but provide server-side forwarding)
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const payload = {
      user_id: Number(req.body.user_id),
      start_datetime: req.body.date,
      end_datetime: req.body.end_date || null,
      small_blind: Number(req.body.small_blind || 0),
      total_commission: Number(req.body.amount || 0),
      dealer: req.body.dealer || null,
      total_tips: Number(req.body.total_tips || 0),
      description: req.body.description || null
    };
    await CashGameRepository.create(payload as any);
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear cash game');
  }
});

// Edit form will post here
router.post('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = {
      start_datetime: req.body.date,
      end_datetime: req.body.end_date || null,
      small_blind: Number(req.body.small_blind || 0),
      total_commission: Number(req.body.amount || 0),
      dealer: req.body.dealer || null,
      total_tips: Number(req.body.total_tips || 0),
      description: req.body.description || null
    };
    await CashGameRepository.update(id, payload as any);
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar cash game');
  }
});

// Delete cash game
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CashGameRepository.delete(id);
    res.redirect('/admin/games/cash/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar cash game');
  }
});

export default router;
