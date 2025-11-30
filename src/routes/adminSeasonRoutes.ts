import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAuth';
import SeasonRepository from '../repositories/SeasonRepository';

const router = Router();

// GET /admin/seasons - Lista de temporadas
router.get('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const seasons = await SeasonRepository.findAll();
        res.render('admin/seasons_list', {
            seasons: seasons.map(s => ({
                id: s.id,
                nombre: s.nombre,
                fecha_inicio: s.fecha_inicio,
                fecha_fin: s.fecha_fin,
                estado: s.estado
            })),
            username: req.session?.username
        });
    } catch (error) {
        console.error('Error loading seasons:', error);
        res.status(500).send('Error al cargar temporadas');
    }
});

// GET /admin/seasons/new - Formulario nueva temporada
router.get('/new', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/season_form', {
        formTitle: 'Nueva Temporada',
        formAction: '/admin/seasons',
        season: {},
        username: req.session?.username
    });
});

// POST /admin/seasons - Crear temporada
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { nombre, fecha_inicio, fecha_fin, estado } = req.body;
        const { parseDateDMY } = await import('../utils/dateUtils');
        
        if (!nombre || !fecha_inicio || !fecha_fin || !estado) {
            return res.render('admin/season_form', {
                formTitle: 'Nueva Temporada',
                formAction: '/admin/seasons',
                season: req.body,
                error: 'Todos los campos son requeridos',
                username: req.session?.username
            });
        }

        // Parsear fechas en formato dd/mm/yyyy
        const fechaInicio = parseDateDMY(fecha_inicio);
        const fechaFin = parseDateDMY(fecha_fin);
        
        if (!fechaInicio || !fechaFin) {
            return res.render('admin/season_form', {
                formTitle: 'Nueva Temporada',
                formAction: '/admin/seasons',
                season: req.body,
                error: 'Formato de fecha inválido. Use dd/mm/yyyy',
                username: req.session?.username
            });
        }

        await SeasonRepository.create({
            nombre,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado
        });

        res.redirect('/admin/seasons');
    } catch (error) {
        console.error('Error creating season:', error);
        res.render('admin/season_form', {
            formTitle: 'Nueva Temporada',
            formAction: '/admin/seasons',
            season: req.body,
            error: 'Error al crear la temporada',
            username: req.session?.username
        });
    }
});

// GET /admin/seasons/:id/edit - Formulario editar temporada
router.get('/:id/edit', requireAdmin, async (req: Request, res: Response) => {
    try {
        const season = await SeasonRepository.findById(Number(req.params.id));
        if (!season) {
            return res.redirect('/admin/seasons');
        }

        res.render('admin/season_form', {
            formTitle: 'Editar Temporada',
            formAction: `/admin/seasons/${season.id}`,
            season: season,
            username: req.session?.username
        });
    } catch (error) {
        console.error('Error loading season:', error);
        res.redirect('/admin/seasons');
    }
});

// POST /admin/seasons/:id - Actualizar temporada
router.post('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { nombre, fecha_inicio, fecha_fin, estado } = req.body;
        const id = Number(req.params.id);
        const { parseDateDMY } = await import('../utils/dateUtils');

        if (!nombre || !fecha_inicio || !fecha_fin || !estado) {
            return res.render('admin/season_form', {
                formTitle: 'Editar Temporada',
                formAction: `/admin/seasons/${id}`,
                season: { id, ...req.body },
                error: 'Todos los campos son requeridos',
                username: req.session?.username
            });
        }

        // Parsear fechas en formato dd/mm/yyyy
        const fechaInicio = parseDateDMY(fecha_inicio);
        const fechaFin = parseDateDMY(fecha_fin);
        
        if (!fechaInicio || !fechaFin) {
            return res.render('admin/season_form', {
                formTitle: 'Editar Temporada',
                formAction: `/admin/seasons/${id}`,
                season: { id, ...req.body },
                error: 'Formato de fecha inválido. Use dd/mm/yyyy',
                username: req.session?.username
            });
        }

        await SeasonRepository.update(id, {
            nombre,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado
        });

        res.redirect('/admin/seasons');
    } catch (error) {
        console.error('Error updating season:', error);
        res.render('admin/season_form', {
            formTitle: 'Editar Temporada',
            formAction: `/admin/seasons/${req.params.id}`,
            season: { id: req.params.id, ...req.body },
            error: 'Error al actualizar la temporada',
            username: req.session?.username
        });
    }
});

// POST /admin/seasons/:id/delete - Eliminar temporada
router.post('/:id/delete', requireAdmin, async (req: Request, res: Response) => {
    try {
        await SeasonRepository.delete(Number(req.params.id));
        res.redirect('/admin/seasons');
    } catch (error) {
        console.error('Error deleting season:', error);
        res.redirect('/admin/seasons');
    }
});

export default router;
