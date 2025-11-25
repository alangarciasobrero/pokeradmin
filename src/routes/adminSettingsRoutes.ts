import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../middleware/requireAuth';
import Setting from '../models/Setting';
import CommissionPool from '../models/CommissionPool';

const router = Router();

// use central requireAdmin middleware imported above

const POINTS_FILE = path.join(process.cwd(), 'points_table.json');
const PRIZE_FILE = path.join(process.cwd(), 'prize_override.json');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');

function safeReadFile(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return '';
  }
}

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  const pointsRaw = safeReadFile(POINTS_FILE) || '{}';
  const prizeRaw = safeReadFile(PRIZE_FILE) || '{}';
  res.render('admin/games_settings', { pointsRaw, prizeRaw, username: req.session.username });
});

router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { points_table: pointsText, prize_override: prizeText } = req.body;
  // Basic JSON validation
  try {
    const pointsObj = pointsText ? JSON.parse(pointsText) : null;
    const prizeObj = prizeText ? JSON.parse(prizeText) : null;

    // ensure backup dir exists
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');

    if (fs.existsSync(POINTS_FILE)) {
      fs.copyFileSync(POINTS_FILE, path.join(BACKUP_DIR, `points_table.json.${ts}.bak`));
    }
    if (fs.existsSync(PRIZE_FILE)) {
      fs.copyFileSync(PRIZE_FILE, path.join(BACKUP_DIR, `prize_override.json.${ts}.bak`));
    }

    // write pretty JSON
    if (pointsObj !== null) fs.writeFileSync(POINTS_FILE, JSON.stringify(pointsObj, null, 2), 'utf8');
    if (prizeObj !== null) fs.writeFileSync(PRIZE_FILE, JSON.stringify(prizeObj, null, 2), 'utf8');

    if (req.session) req.session.flash = { type: 'success', message: 'Configuración guardada. Backup creado.' };
    return res.redirect('/admin/games/settings');
  } catch (err: any) {
    console.error('Error parsing JSON', err);
    if (req.session) req.session.flash = { type: 'error', message: 'JSON inválido: ' + (err && err.message ? err.message : String(err)) };
    return res.redirect('/admin/games/settings');
  }
});

/**
 * GET /admin/games/settings/commissions
 * Vista para configurar porcentajes de comisión y destinos
 */
router.get('/commissions', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Load current commission settings
    const settings = await Setting.findAll({
      where: {
        key: ['commission_total_pct', 'commission_quarterly_pct', 'commission_monthly_pct', 'commission_copa_pct', 'commission_house_pct']
      } as any
    });

    const config: Record<string, any> = {
      total: 20,
      quarterly: 1,
      monthly: 1,
      copa: 1,
      house: 17,
    };

    for (const s of settings) {
      const key = (s as any).key;
      const val = Number((s as any).value) || 0;
      if (key === 'commission_total_pct') config.total = val;
      if (key === 'commission_quarterly_pct') config.quarterly = val;
      if (key === 'commission_monthly_pct') config.monthly = val;
      if (key === 'commission_copa_pct') config.copa = val;
      if (key === 'commission_house_pct') config.house = val;
    }

    res.render('admin/settings/commissions', {
      username: req.session.username,
      config,
    });
  } catch (err) {
    console.error('Error loading commission settings:', err);
    res.status(500).send('Error cargando configuración');
  }
});

/**
 * POST /admin/games/settings/commissions
 * Actualizar configuración de comisiones
 */
router.post('/commissions', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { total, quarterly, monthly, copa, house } = req.body;

    const updates = [
      { key: 'commission_total_pct', value: String(total || 20), description: 'Porcentaje total de comisión sobre el pozo' },
      { key: 'commission_quarterly_pct', value: String(quarterly || 1), description: 'Porcentaje para ranking trimestral' },
      { key: 'commission_monthly_pct', value: String(monthly || 1), description: 'Porcentaje para especial del mes' },
      { key: 'commission_copa_pct', value: String(copa || 1), description: 'Porcentaje para Copa Don Humberto' },
      { key: 'commission_house_pct', value: String(house || 17), description: 'Porcentaje para la casa' },
    ];

    for (const u of updates) {
      const [setting, created] = await Setting.findOrCreate({
        where: { key: u.key } as any,
        defaults: { key: u.key, value: u.value, description: u.description } as any,
      });
      if (!created) {
        await Setting.update({ value: u.value }, { where: { key: u.key } as any });
      }
    }

    res.redirect('/admin/games/settings/commissions?success=1');
  } catch (err) {
    console.error('Error updating commission settings:', err);
    res.status(500).send('Error actualizando configuración');
  }
});

/**
 * GET /admin/games/settings/pools
 * Vista para ver acumulados de pozos (mensual, trimestral, Copa, casa)
 */
router.get('/pools', requireAdmin, async (req: Request, res: Response) => {
  try {
    const pools = await CommissionPool.findAll({
      order: [['created_at', 'DESC']],
    });

    // Group by pool_type and calculate totals
    const summary: Record<string, { active: number; closed: number; paid: number }> = {
      monthly: { active: 0, closed: 0, paid: 0 },
      quarterly: { active: 0, closed: 0, paid: 0 },
      copa_don_humberto: { active: 0, closed: 0, paid: 0 },
      house: { active: 0, closed: 0, paid: 0 },
    };

    for (const p of pools) {
      const type = (p as any).pool_type;
      const status = (p as any).status;
      const amount = Number((p as any).accumulated_amount) || 0;
      if (summary[type]) {
        if (status === 'active') summary[type].active += amount;
        else if (status === 'closed') summary[type].closed += amount;
        else if (status === 'paid') summary[type].paid += amount;
      }
    }

    res.render('admin/settings/pools', {
      username: req.session.username,
      pools,
      summary,
    });
  } catch (err) {
    console.error('Error loading pools:', err);
    res.status(500).send('Error cargando pozos');
  }
});

/**
 * POST /admin/games/settings/pools/:id/close
 * Cerrar un pozo (cambiar status a 'closed')
 */
router.post('/pools/:id/close', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CommissionPool.update(
      { status: 'closed', closed_at: new Date() } as any,
      { where: { id } as any }
    );
    res.redirect('/admin/games/settings/pools?success=closed');
  } catch (err) {
    console.error('Error closing pool:', err);
    res.status(500).send('Error cerrando pozo');
  }
});

/**
 * POST /admin/games/settings/pools/:id/pay
 * Marcar un pozo como pagado (cambiar status a 'paid')
 */
router.post('/pools/:id/pay', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const notes = req.body.notes || '';
    await CommissionPool.update(
      { status: 'paid', paid_at: new Date(), notes } as any,
      { where: { id } as any }
    );
    res.redirect('/admin/games/settings/pools?success=paid');
  } catch (err) {
    console.error('Error marking pool as paid:', err);
    res.status(500).send('Error marcando pozo como pagado');
  }
});

export default router;
