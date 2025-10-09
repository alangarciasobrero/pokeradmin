import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de Sequelize para conectarse a la base de datos  
const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USERNAME || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT as any) || 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
  }
);

export default sequelize;
