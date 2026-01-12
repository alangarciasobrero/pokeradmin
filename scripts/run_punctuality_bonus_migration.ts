import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'pokeradmin',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: console.log
    }
);

async function migrate() {
    try {
        console.log('🔧 Running migration: add punctuality_bonus_chips...');
        
        await sequelize.query(`
            ALTER TABLE tournaments 
            ADD COLUMN punctuality_bonus_chips INT DEFAULT 0 
            COMMENT 'Fichas extras otorgadas por llegar puntual'
        `);
        
        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error: any) {
        if (error.original?.errno === 1060) {
            console.log('ℹ️  Column already exists, skipping...');
            process.exit(0);
        } else {
            console.error('❌ Migration failed:', error.message);
            process.exit(1);
        }
    } finally {
        await sequelize.close();
    }
}

migrate();
