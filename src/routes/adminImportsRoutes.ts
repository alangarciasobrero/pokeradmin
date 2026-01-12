import express from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/requireAuth';
import XLSX from 'xlsx';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', (req, res) => {
  res.render('admin_imports');
});

router.post('/upload', requireAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheets = (wb.SheetNames as string[]).map((name: string) => {
      const sheet = wb.Sheets[name];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: null }) as any[];
      return { name, rows: rows.length };
    });
    // Render a simple summary page with sheet names and row counts
    return res.render('admin_imports', { uploaded: true, sheets });
  } catch (e) {
    console.error('Import error', e);
    return res.status(500).json({ error: 'Error parsing XLSX' });
  }
});

export default router;
