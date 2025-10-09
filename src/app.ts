import express from 'express'; // Framework principal para crear el servidor web
import path from 'path'; // Módulo para manejar rutas de archivos y carpetas

import { engine } from 'express-handlebars'; // Motor de plantillas Handlebars para vistas

// Importa las rutas de la API y las rutas web (SSR)
import tournamentRoutes from './routes/tournamentRoutes';
import playerRoutes from './routes/playerRoutes';
import registrationRoutes from './routes/registrationRoutes'
import cashGameRoutes from './routes/cashGameRoutes'; 
import resultRoutes from './routes/resultRoutes';
import seasonRoutes from './routes/seasonRoutes';

// Importa las rutas del SSR (Server Side Rendering)
import tournamentWebRoutes from './routes/tournamentWebRoutes';

// Crea la aplicación Express (Una instancia de un servidor web)
const app = express();

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
// Define la carpeta donde están las vistas
app.set('views', path.join(__dirname, 'views'));

// Permite a Express entender JSON en las peticiones
app.use(express.json());
// Permite a Express entender datos de formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Rutas web (SSR): renderizan vistas HTML usando Handlebars
// Ejemplo: GET /tournaments muestra la lista de torneos en una página web
app.use('/tournaments', tournamentWebRoutes);

// Home principal de PokerAdmin (no depende de tournaments)
app.get('/', (req, res) => {
    res.render('home');
});

// Rutas API REST: devuelven y reciben datos en formato JSON
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/cash-games', cashGameRoutes);
app.use('/api/seasons', seasonRoutes);

// Exporta la app para usarla en server.ts
export default app;
