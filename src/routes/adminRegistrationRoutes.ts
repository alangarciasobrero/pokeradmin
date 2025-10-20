import { Router, Request, Response } from 'express';
import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { Tournament } from '../models/Tournament';
import User from '../models/User';

const router = Router();
const registrationRepo = new RegistrationRepository();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

// List registrations (admin)
router.get('/list', requireAdmin, async (req: Request, res: Response) => {
  try {
    const regs = await registrationRepo.getAll();
    res.render('admin/registrations_list', { registrations: regs, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener inscripciones');
  }
});

// New form: need tournaments and users for select options
router.get('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.findAll({ order: [['start_date', 'DESC']] });
    const users = await User.findAll({ where: { is_deleted: false } });
    res.render('registrations/form', { formTitle: 'Nueva Inscripción', formAction: '/api/registrations', tournaments, users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al preparar formulario');
  }
});

// Create: forward to API (or repo) - accept JSON body from form
router.post('/new', requireAdmin, async (req: Request, res: Response) => {
  try {
    const payload = {
      user_id: req.body.user_id || req.body.player_id,
      tournament_id: req.body.tournament_id,
      punctuality: req.body.punctuality === 'true' || req.body.punctuality === 'on'
    };
    await registrationRepo.create(payload as any);
    res.redirect('/admin/registrations/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear inscripción');
  }
});

export default router;
