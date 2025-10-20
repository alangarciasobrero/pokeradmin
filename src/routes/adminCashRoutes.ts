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
  try {
    const cashGames = await CashGameRepository.findAll();
    res.render('admin/cash_list', { cashGames, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar cash games');
  }
});

router.get('/new', requireAdmin, (req: Request, res: Response) => {
  res.render('cash/form', { formTitle: 'Nueva Mesa Cash', formAction: '/api/cash-games' });
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

export default router;
