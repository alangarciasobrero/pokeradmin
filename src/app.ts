/// <reference types="express-session" />
import express from 'express'; // Framework principal para crear el servidor web
import path from 'path'; // Módulo para manejar rutas de archivos y carpetas
import session from 'express-session';

import { engine } from 'express-handlebars'; // Motor de plantillas Handlebars para vistas

// Importa las rutas de la API y las rutas web (SSR)
import tournamentRoutes from './routes/tournamentRoutes';
import registrationRoutes from './routes/registrationRoutes'
import cashGameRoutes from './routes/cashGameRoutes'; 
import resultRoutes from './routes/resultRoutes';
import seasonRoutes from './routes/seasonRoutes';
import authRoutes from './routes/authRoutes';
import { getAdminDashboard } from './controllers/adminDashboardController';
import tournamentWebRoutes from './routes/tournamentWebRoutes';
import adminUserRoutes from './routes/adminUserRoutes';
import userApiRoutes from './routes/userApiRoutes';
import adminGamesRoutes from './routes/adminGamesRoutes';
import adminTournamentRoutes from './routes/adminTournamentRoutes';
import adminCashRoutes from './routes/adminCashRoutes';
import adminRankingRoutes from './routes/adminRankingRoutes';
import adminRegistrationRoutes from './routes/adminRegistrationRoutes';
import adminSettingsRoutes from './routes/adminSettingsRoutes';
import adminImportsRoutes from './routes/adminImportsRoutes';
import devRoutes from './routes/devRoutes';
import adminPaymentRoutes from './routes/adminPaymentRoutes';
import adminDebtorsRoutes from './routes/adminDebtorsRoutes';
// Ensure legacy models are registered so sequelize.sync() knows about them
import './models/Player';
import './models/TournamentPoint';
import './models/HistoricalPoint';
import './models/RankingHistory';


// Crea la aplicación Express (Una instancia de un servidor web)
const app = express();

// Configuración de sesión
app.use(session({
	secret: process.env.SESSION_SECRET || 'pokeradmin_secret',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));
// Servir archivos estáticos desde la carpeta 'public' del proyecto durante desarrollo
// (los assets están en /public — p.ej. public/css, public/js)
app.use(express.static(path.join(process.cwd(), 'public')));

// También servir assets desde `src/public` (algunos assets están en src/public during development)
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// Configuración del motor de vistas Handlebars
// 'engine' registra Handlebars como motor de plantillas
app.engine('handlebars', engine({
	extname: '.handlebars',
	layoutsDir: path.join(process.cwd(), 'src', 'views', 'layouts'),
	// Use the default layout so views are wrapped with `layouts/main` unless they opt out
	defaultLayout: 'main',
	partialsDir: [
		path.join(process.cwd(), 'src', 'views', 'partials'),
		path.join(process.cwd(), 'src', 'views')
	],
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true
	}
}));
// Define que las vistas usarán el motor 'handlebars'
app.set('view engine', 'handlebars');
// Define la carpeta donde están las vistas (siempre apunta a src/views)
app.set('views', path.join(__dirname, '..', 'src', 'views'));


// Permite a Express entender JSON en las peticiones
app.use(express.json());
// Permite a Express entender datos de formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Better error handling for JSON parse errors (body-parser)
// This returns a helpful JSON error instead of the default HTML stack.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err && err.type === 'entity.parse.failed') {
		console.error('JSON parse error on request', req.method, req.path, err);
		return res.status(400).json({ error: 'Invalid JSON body', details: err.message });
	}
	next(err);
});

// Register simple Handlebars helpers
import Handlebars from 'handlebars';
import { requireAuth as requireAuthMiddleware, requireAdmin as requireAdminMiddleware } from './middleware/requireAuth';

Handlebars.registerHelper('range', function(start: number, end: number) {
	const out = [] as number[];
	for (let i = start; i <= end; i++) out.push(i);
	return out;
});
Handlebars.registerHelper('ifEquals', function(this: any, a: any, b: any, opts: any) {
    return (a == b) ? opts.fn(this) : opts.inverse(this);
});
// simple equality helper usable as subexpression: {{#if (eq a b)}}
Handlebars.registerHelper('eq', function(a: any, b: any) {
	return a == b;
});
// small format helpers
Handlebars.registerHelper('formatDate', function(d: any) {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return d;
	return dt.toISOString().slice(0,10);
});
// helper to extract method label (before |by:...)
Handlebars.registerHelper('methodLabel', function(m: any) {
	if (!m) return '';
	const s = String(m);
	const idx = s.indexOf('|by:');
	return idx === -1 ? s : s.slice(0, idx);
});
// helper to extract recorder (after |by:)
Handlebars.registerHelper('recordedBy', function(m: any) {
	if (!m) return '';
	const s = String(m);
	const idx = s.indexOf('|by:');
	if (idx === -1) return '';
	return s.slice(idx + 4);
});
Handlebars.registerHelper('currency', function(n: any) {
	if (n === null || n === undefined) return '';
	return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});
Handlebars.registerHelper('inc', function(value: number) {
	return Number(value) + 1;
});

// comparison helpers
Handlebars.registerHelper('gt', function(a: any, b: any) {
	try {
		return Number(a) > Number(b);
	} catch (e) { return false; }
});

Handlebars.registerHelper('lt', function(a: any, b: any) {
	try { return Number(a) < Number(b); } catch (e) { return false; }
});

// helper to render admin-only blocks: {{#isAdmin role}}...{{/isAdmin}}
Handlebars.registerHelper('isAdmin', function(this: any, role: any, opts: any) {
	return role === 'admin' ? opts.fn(this) : opts.inverse(this);
});

// Rutas de autenticación (login/logout)
app.use(authRoutes);

// Simple session-based flash middleware and expose currentUser to templates
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	// Ensure session exists
	if (!req.session) return next();
	const sess: any = req.session as any;
	res.locals.flash = sess.flash || null;
	// expose username and role and a normalized currentUser for templates
	res.locals.username = sess.username || null;
	res.locals.role = sess.role || null;
	res.locals.currentUser = {
		id: sess.userId || null,
		username: sess.username || null,
		role: sess.role || null,
		avatar: sess.avatar || null
	};
	// clear flash after exposing
	delete sess.flash;
	next();
});


// Rutas web (SSR): protegidas
app.use('/tournaments', requireAuthMiddleware, tournamentWebRoutes);
// Gestión de usuarios (admin)
app.use('/admin/users', adminUserRoutes);
// API users
app.use('/api/users', userApiRoutes);
// Gestión de partidas (admin)
app.use('/admin/games', adminGamesRoutes);
// Admin sub-pages (mounted under /admin/games/...)
app.use('/admin/games/tournaments', adminTournamentRoutes);
app.use('/admin/games/cash', adminCashRoutes);
app.use('/admin/games/ranking', adminRankingRoutes);

// Admin game settings (points/prize editor)
app.use('/admin/games/settings', adminSettingsRoutes);

// Admin XLSX import UI
app.use('/admin/imports', requireAdminMiddleware, adminImportsRoutes);

// Admin registrations (SSR)
app.use('/admin/registrations', adminRegistrationRoutes);

// Admin payments
app.use('/admin/payments', requireAdminMiddleware, adminPaymentRoutes);
// Debtors page
app.use('/admin/debtors', requireAdminMiddleware, adminDebtorsRoutes);

// Dev-only routes (auto-login helpers). Registered only in development to avoid exposure.
if (process.env.NODE_ENV === 'development') {
	app.use(devRoutes);
}

// NOTE: Avoid running sequelize.sync() here to prevent side-effects when app is imported by tests.
// Server startup (`src/server.ts`) handles syncing when launching the dev server.


// Dashboard de admin
app.get('/admin/dashboard', requireAdminMiddleware, getAdminDashboard);

// Home principal: protegida (puede redirigir a dashboard si es admin)
app.get('/', requireAuthMiddleware, (req, res) => {
	if (req.session?.role === 'admin') {
		return res.redirect('/admin/dashboard');
	}
	res.render('home');
});

// Rutas API REST: protegidas
app.use('/api/tournaments', requireAuthMiddleware, tournamentRoutes);
app.use('/api/registrations', requireAuthMiddleware, registrationRoutes);
app.use('/api/results', requireAuthMiddleware, resultRoutes);
app.use('/api/cash-games', requireAuthMiddleware, cashGameRoutes);
app.use('/api/seasons', requireAuthMiddleware, seasonRoutes);

// Exporta la app para usarla en server.ts
export default app;
