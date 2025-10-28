import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

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

export default router;
