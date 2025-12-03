import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import CommissionDestination from '../models/CommissionDestination';
import CommissionConfig from '../models/CommissionConfig';
import AccumulatedCommission from '../models/AccumulatedCommission';
import { Season } from '../models/Season';
import { Tournament } from '../models/Tournament';
import { Op } from 'sequelize';

const router = Router();

// GET /admin/commissions - Vista principal de configuración
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const destinations = await CommissionDestination.findAll({
      where: { is_active: true },
      include: [
        { model: Season, as: 'season', required: false },
        { model: Tournament, as: 'tournament', required: false }
      ],
      order: [['type', 'ASC'], ['name', 'ASC']]
    });

    const configs = await CommissionConfig.findAll({
      include: [{ model: CommissionDestination, as: 'destination' }],
      order: [['priority', 'ASC']]
    });

    // Calcular totales acumulados por destino
    const totals = await AccumulatedCommission.findAll({
      attributes: [
        'destination_id',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
      ],
      group: ['destination_id']
    });

    const totalsMap: Record<number, number> = {};
    totals.forEach((t: any) => {
      totalsMap[t.destination_id] = Number(t.get('total')) || 0;
    });

    res.render('admin/commissions', {
      username: req.session?.username,
      destinations,
      configs,
      totalsMap
    });
  } catch (err) {
    console.error('Error loading commissions:', err);
    res.status(500).send('Error cargando configuración de comisiones');
  }
});

// POST /admin/commissions/destination - Crear nuevo destino
router.post('/destination', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, type, season_id, tournament_id } = req.body;

    await CommissionDestination.create({
      name,
      type,
      season_id: season_id || null,
      tournament_id: tournament_id || null,
      is_active: true
    });

    req.session!.flash = { type: 'success', message: 'Destino creado exitosamente' };
    res.redirect('/admin/commissions');
  } catch (err) {
    console.error('Error creating destination:', err);
    req.session!.flash = { type: 'error', message: 'Error al crear destino' };
    res.redirect('/admin/commissions');
  }
});

// POST /admin/commissions/config - Configurar porcentaje
router.post('/config', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { destination_id, percentage, priority } = req.body;

    // Verificar que el total no supere 100%
    const existing = await CommissionConfig.findAll({
      where: { destination_id: { [Op.ne]: destination_id } }
    });

    const totalExisting = existing.reduce((sum, c) => sum + Number(c.percentage), 0);
    const newPercentage = Number(percentage);

    if (totalExisting + newPercentage > 100) {
      req.session!.flash = { 
        type: 'error', 
        message: `El total de porcentajes no puede superar 100%. Actualmente: ${totalExisting}%` 
      };
      return res.redirect('/admin/commissions');
    }

    // Buscar configuración existente o crear nueva
    const [config, created] = await CommissionConfig.findOrCreate({
      where: { destination_id },
      defaults: { destination_id, percentage: newPercentage, priority: priority || 0 }
    });

    if (!created) {
      await config.update({ percentage: newPercentage, priority: priority || config.priority });
    }

    req.session!.flash = { type: 'success', message: 'Configuración actualizada' };
    res.redirect('/admin/commissions');
  } catch (err) {
    console.error('Error updating config:', err);
    req.session!.flash = { type: 'error', message: 'Error al actualizar configuración' };
    res.redirect('/admin/commissions');
  }
});

// DELETE /admin/commissions/destination/:id - Desactivar destino
router.post('/destination/:id/delete', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CommissionDestination.update({ is_active: false }, { where: { id } });
    
    req.session!.flash = { type: 'success', message: 'Destino desactivado' };
    res.redirect('/admin/commissions');
  } catch (err) {
    console.error('Error deleting destination:', err);
    req.session!.flash = { type: 'error', message: 'Error al eliminar destino' };
    res.redirect('/admin/commissions');
  }
});

// GET /admin/commissions/accumulated - Ver acumulados por destino
router.get('/accumulated', requireAdmin, async (req: Request, res: Response) => {
  try {
    const destinationId = req.query.destination_id ? Number(req.query.destination_id) : null;

    let whereClause: any = {};
    if (destinationId) {
      whereClause.destination_id = destinationId;
    }

    const accumulated = await AccumulatedCommission.findAll({
      where: whereClause,
      include: [
        { model: CommissionDestination, as: 'destination' },
        { model: Tournament, as: 'tournament' }
      ],
      order: [['created_at', 'DESC']]
    });

    const destinations = await CommissionDestination.findAll({
      where: { is_active: true }
    });

    res.render('admin/commissions_accumulated', {
      username: req.session?.username,
      accumulated,
      destinations,
      selectedDestination: destinationId
    });
  } catch (err) {
    console.error('Error loading accumulated:', err);
    res.status(500).send('Error cargando acumulados');
  }
});

export default router;
