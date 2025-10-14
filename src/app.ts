/// <reference types="express-session" />
import express from 'express'; // Framework principal para crear el servidor web
import path from 'path'; // Módulo para manejar rutas de archivos y carpetas
import session from 'express-session';

import { engine } from 'express-handlebars'; // Motor de plantillas Handlebars para vistas

// Importa las rutas de la API y las rutas web (SSR)
import tournamentRoutes from './routes/tournamentRoutes';
import playerRoutes from './routes/playerRoutes';
import registrationRoutes from './routes/registrationRoutes'
import cashGameRoutes from './routes/cashGameRoutes'; 
import resultRoutes from './routes/resultRoutes';
import seasonRoutes from './routes/seasonRoutes';
import authRoutes from './routes/authRoutes';
import tournamentWebRoutes from './routes/tournamentWebRoutes';
import adminUserRoutes from './routes/adminUserRoutes';


// Crea la aplicación Express (Una instancia de un servidor web)
const app = express();

// Configuración de sesión
app.use(session({
	secret: process.env.SESSION_SECRET || 'pokeradmin_secret',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configuración del motor de vistas Handlebars
// 'engine' registra Handlebars como motor de plantillas
app.engine('handlebars', engine({
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

// Rutas de autenticación (login/logout)
app.use(authRoutes);

// Middleware para proteger rutas privadas

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (!req.session.userId) {
		return res.redirect('/login');
	}
	next();
}

// Middleware para proteger rutas solo para admins
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (!req.session.userId || req.session.role !== 'admin') {
		return res.status(403).send('Acceso denegado');
	}
	next();
}


// Rutas web (SSR): protegidas
app.use('/tournaments', requireAuth, tournamentWebRoutes);
// Gestión de usuarios (admin)
app.use('/admin/users', adminUserRoutes);


// Dashboard de admin
app.get('/admin/dashboard', requireAdmin, (req, res) => {
	res.render('admin_dashboard', {
		username: req.session.username || 'admin'
	});
});

// Home principal: protegida (puede redirigir a dashboard si es admin)
app.get('/', requireAuth, (req, res) => {
	if (req.session.role === 'admin') {
		return res.redirect('/admin/dashboard');
	}
	res.render('home');
});

// Rutas API REST: protegidas
app.use('/api/tournaments', requireAuth, tournamentRoutes);
app.use('/api/players', requireAuth, playerRoutes);
app.use('/api/registrations', requireAuth, registrationRoutes);
app.use('/api/results', requireAuth, resultRoutes);
app.use('/api/cash-games', requireAuth, cashGameRoutes);
app.use('/api/seasons', requireAuth, seasonRoutes);

// Exporta la app para usarla en server.ts
export default app;
