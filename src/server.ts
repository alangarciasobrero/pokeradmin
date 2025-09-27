import app from './app';
import sequelize from './services/database';

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
		await sequelize.authenticate();
		console.log('Conexión a MySQL exitosa.');
		await sequelize.sync();
		app.listen(PORT, () => {
			console.log(`Servidor escuchando en puerto ${PORT}`);
		});
	} catch (error) {
		console.error('Error al conectar a la base de datos:', error);
		process.exit(1);
	}
}

startServer();
