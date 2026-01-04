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
import adminBonusRoutes from './routes/adminBonusRoutes';
import adminSeasonRoutes from './routes/adminSeasonRoutes';
import adminReportsRoutes from './routes/adminReportsRoutes';
import profileRoutes from './routes/profileRoutes';
import statsRoutes from './routes/statsRoutes';
import publicProfileRoutes from './routes/publicProfileRoutes';
import playerDashboardRoutes from './routes/playerDashboardRoutes';
// Ensure legacy models are registered so sequelize.sync() knows about them
import './models/Player';
import './models/TournamentPoint';
import './models/HistoricalPoint';
import './models/RankingHistory';
import './models/Setting';
import './models/CommissionPool';


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
import { requireAuth as requireAuthMiddleware, requireAdmin } from './middleware/requireAuth';

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
	// Formato dd/mm/yyyy
	const day = String(dt.getDate()).padStart(2, '0');
	const month = String(dt.getMonth() + 1).padStart(2, '0');
	const year = dt.getFullYear();
	return `${day}/${month}/${year}`;
});

// Helper para inputs de fecha en formato dd/mm/yyyy
Handlebars.registerHelper('formatDateInput', function(d: any) {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '';
	const day = String(dt.getDate()).padStart(2, '0');
	const month = String(dt.getMonth() + 1).padStart(2, '0');
	const year = dt.getFullYear();
	return `${day}/${month}/${year}`;
});

// Helper para inputs date HTML5 (formato YYYY-MM-DD)
Handlebars.registerHelper('formatDateISO', function(d: any) {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '';
	const year = dt.getFullYear();
	const month = String(dt.getMonth() + 1).padStart(2, '0');
	const day = String(dt.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
});

Handlebars.registerHelper('formatDateTime', function(d: any) {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return d;
	// Formato dd/mm/yyyy HH:mm
	const day = String(dt.getDate()).padStart(2, '0');
	const month = String(dt.getMonth() + 1).padStart(2, '0');
	const year = dt.getFullYear();
	const hours = String(dt.getHours()).padStart(2, '0');
	const minutes = String(dt.getMinutes()).padStart(2, '0');
	return `${day}/${month}/${year} ${hours}:${minutes}`;
});

// Helper para mostrar solo la hora HH:mm
Handlebars.registerHelper('formatTime', function(d: any) {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '';
	const hours = String(dt.getHours()).padStart(2, '0');
	const minutes = String(dt.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
});

// Helper para inputs de hora en formato HH:mm
Handlebars.registerHelper('formatTimeInput', function(d: any) {
	if (!d) return '21:00'; // Default hour for tournaments
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '21:00';
	const hours = String(dt.getHours()).padStart(2, '0');
	const minutes = String(dt.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
});

// helper to calculate time difference in hours and minutes
Handlebars.registerHelper('timeDiff', function(start: any, end: any) {
	if (!start || !end) return '';
	const s = new Date(start);
	const e = new Date(end);
	if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';
	const diff = e.getTime() - s.getTime();
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	return `${hours}h ${minutes}m`;
});
// helper to extract method label (before |by: or |By:...) and format nicely
Handlebars.registerHelper('methodLabel', function(m: any) {
	if (!m || m === '' || m === null || m === undefined) return '🔖 FIADO';
	const s = String(m).trim();
	if (s === '' || s === '0' || s === 'null') return '🔖 FIADO';
	
	// Search for |by: case insensitive using regex
	const match = s.match(/\|by:/i);
	const method = match ? s.substring(0, match.index).trim() : s;
	
	// If method is empty after extraction, it's fiado
	if (!method || method === '') return '🔖 FIADO';
	
	// Format common methods nicely - normalize to lowercase for comparison
	const methodLower = method.toLowerCase();
	
	const methodMap: Record<string, string> = {
		'cash': '💵 Efectivo',
		'efectivo': '💵 Efectivo',
		'transfer': '🏦 Transferencia',
		'transferencia': '🏦 Transferencia',
		'card': '💳 Tarjeta',
		'tarjeta': '💳 Tarjeta',
		'credit': '🎁 Crédito',
		'credito': '🎁 Crédito',
		'credit_consumed': '💳 Crédito usado',
		'debit': '💸 Débito',
		'debito': '💸 Débito',
		'manual': '✍️ Manual',
		'other': '📝 Otro',
		'otro': '📝 Otro',
		'fiado': '🔖 FIADO'
	};
	
	// Direct match first
	if (methodMap[methodLower]) {
		return methodMap[methodLower];
	}
	
	// Check if method starts with any key
	for (const [key, label] of Object.entries(methodMap)) {
		if (methodLower.startsWith(key)) {
			return label;
		}
	}
	
	// If not found, return cleaned method string with first letter uppercase
	return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
});
// helper to extract recorder (after |by: or |By:)
Handlebars.registerHelper('recordedBy', function(m: any) {
	if (!m) return '';
	const s = String(m);
	// Search for |by: case insensitive using regex
	const match = s.match(/\|by:(.+)/i);
	if (!match) return '';
	// Extract only username (before the colon if there's userId)
	const fullRecorder = match[1];
	const colonIdx = fullRecorder.indexOf(':');
	return colonIdx > -1 ? fullRecorder.substring(0, colonIdx) : fullRecorder;
});
Handlebars.registerHelper('currency', function(n: any) {
	if (n === null || n === undefined) return '';
	return Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
});
Handlebars.registerHelper('debtDisplay', function(n: any) {
	if (n === null || n === undefined) return '';
	const num = Number(n);
	const formatted = Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	// Negative amount = user owes money (deuda)
	if (num < 0) return `<span class="debt-owed" title="El jugador debe dinero">-$${formatted}</span>`;
	// Positive = user has credit
	if (num > 0) return `<span class="debt-credit" title="El jugador tiene crédito a favor">+$${formatted}</span>`;
	return `<span class="debt-zero">$${formatted}</span>`;
});
Handlebars.registerHelper('inc', function(value: number) {
	return Number(value) + 1;
});

Handlebars.registerHelper('add', function(a: number, b: number) {
	return Number(a) + Number(b);
});

Handlebars.registerHelper('subtract', function(a: number, b: number) {
	return Number(a) - Number(b);
});

Handlebars.registerHelper('multiply', function(a: number, b: number) {
	return Number(a) * Number(b);
});

Handlebars.registerHelper('lte', function(a: any, b: any) {
	try { return Number(a) <= Number(b); } catch (e) { return false; }
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

Handlebars.registerHelper('and', function(a: any, b: any) {
	return a && b;
});

Handlebars.registerHelper('concat', function(...args: any[]) {
	// Remove the options object which is always last
	args.pop();
	return args.join('');
});

Handlebars.registerHelper('repeat', function(n: number, options: any) {
	let result = '';
	for (let i = 0; i < n; i++) {
		result += options.fn(i);
	}
	return result;
});

Handlebars.registerHelper('dateKey', function(year: number, month: number, day: number) {
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
});

Handlebars.registerHelper('isToday', function(year: number, month: number, day: number) {
	const today = new Date();
	return today.getFullYear() === year && 
	       today.getMonth() + 1 === month && 
	       today.getDate() === day;
});

// map numeric action types to labels for templates
Handlebars.registerHelper('actionLabel', function(v: any) {
	const n = Number(v);
	switch (n) {
		case 1: return 'Buy-in';
		case 2: return 'Re-entry';
		case 3: return 'Duplo';
		default: return 'Unknown';
	}
});

// helper to render admin-only blocks: {{#isAdmin role}}...{{/isAdmin}}
Handlebars.registerHelper('isAdmin', function(this: any, role: any, opts: any) {
	return role === 'admin' ? opts.fn(this) : opts.inverse(this);
});

Handlebars.registerHelper('json', function(context: any) {
	return JSON.stringify(context);
});

// Simple session-based flash middleware and expose currentUser to templates
// IMPORTANTE: Este middleware debe estar ANTES de las rutas para que res.locals esté disponible
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

// Rutas de autenticación (login/logout)
app.use(authRoutes);

// Perfil de usuario
app.use('/profile', profileRoutes);

// Estadísticas
app.use('/stats', statsRoutes);

// Middleware para actualizar estados de temporadas periódicamente
let lastSeasonUpdate = 0;
const SEASON_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutos

app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const now = Date.now();
	if (now - lastSeasonUpdate > SEASON_UPDATE_INTERVAL) {
		try {
			const seasonService = await import('./services/seasonService');
			await seasonService.updateSeasonStates();
			lastSeasonUpdate = now;
		} catch (error) {
			console.error('[app] Error updating season states:', error);
		}
	}
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

// Redirect legacy /admin/ranking to /admin/games/ranking
app.get('/admin/ranking', requireAuthMiddleware, (req, res) => {
	const queryString = req.url.split('?')[1] || '';
	res.redirect(`/admin/games/ranking${queryString ? '?' + queryString : ''}`);
});

// Admin bonus calculation
app.use('/admin/bonus', adminBonusRoutes);

// Admin seasons management
app.use('/admin/seasons', adminSeasonRoutes);

// Admin reports  
app.use('/admin/reports', adminReportsRoutes);

// Admin XLSX import UI
app.use('/admin/imports', adminImportsRoutes);

// Admin registrations (SSR)
app.use('/admin/registrations', adminRegistrationRoutes);

// Admin payments
app.use('/admin/payments', adminPaymentRoutes);
// Debtors page
app.use('/admin/debtors', adminDebtorsRoutes);

// Dev-only routes (auto-login helpers). Registered only in development to avoid exposure.
if (process.env.NODE_ENV === 'development') {
	app.use(devRoutes);
}

// NOTE: Avoid running sequelize.sync() here to prevent side-effects when app is imported by tests.
// Server startup (`src/server.ts`) handles syncing when launching the dev server.


// Dashboard de admin
app.get('/admin/dashboard', requireAdmin, getAdminDashboard);

// Perfil público de jugadores
app.use('/player', publicProfileRoutes);

// Home principal: protegida (dashboard dinámico según rol)
app.use('/', playerDashboardRoutes);

// Rutas API REST: protegidas
app.use('/api/tournaments', requireAuthMiddleware, tournamentRoutes);
app.use('/api/registrations', requireAuthMiddleware, registrationRoutes);
app.use('/api/results', requireAuthMiddleware, resultRoutes);
app.use('/api/cash-games', requireAuthMiddleware, cashGameRoutes);
app.use('/api/seasons', requireAuthMiddleware, seasonRoutes);

// Exporta la app para usarla en server.ts
export default app;
