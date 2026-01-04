import { Sequelize, Op } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'pokeradmin',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false
    }
);

async function test() {
    try {
        console.log('🧪 Testing daily commission route logic...\n');

        // Test getCurrentGamingDate
        const { getCurrentGamingDate } = await import('../src/utils/gamingDate');
        const currentGamingDate = getCurrentGamingDate();
        console.log(`📅 Current Gaming Date: ${currentGamingDate}\n`);

        // Buscar torneos del gaming_date actual
        const [tournaments]: any = await sequelize.query(`
            SELECT id, tournament_name, gaming_date, start_date 
            FROM tournaments 
            WHERE gaming_date = ?
        `, {
            replacements: [currentGamingDate]
        });

        console.log(`🏆 Tournaments for gaming_date ${currentGamingDate}: ${tournaments.length}`);
        tournaments.forEach((t: any) => {
            console.log(`   - ID: ${t.id}, Name: ${t.tournament_name}, Gaming Date: ${t.gaming_date}, Start: ${t.start_date}`);
        });
        console.log();

        // Buscar mesas cash del gaming_date actual
        const [cashGames]: any = await sequelize.query(`
            SELECT id, gaming_date, start_datetime 
            FROM cash_games 
            WHERE gaming_date = ?
        `, {
            replacements: [currentGamingDate]
        });

        console.log(`🎰 Cash Games for gaming_date ${currentGamingDate}: ${cashGames.length}`);
        cashGames.forEach((c: any) => {
            console.log(`   - ID: ${c.id}, Gaming Date: ${c.gaming_date}, Start: ${c.start_datetime}`);
        });
        console.log();

        const tournamentIds = tournaments.map((t: any) => t.id);
        const cashGameIds = cashGames.map((c: any) => c.id);

        // Buscar comisiones de torneos
        if (tournamentIds.length > 0) {
            const [tournamentCommissions]: any = await sequelize.query(`
                SELECT id, amount, source, reference_id, payment_date
                FROM payments
                WHERE source = 'commission' AND reference_id IN (?)
            `, {
                replacements: [tournamentIds]
            });

            console.log(`💰 Tournament Commissions: ${tournamentCommissions.length}`);
            tournamentCommissions.forEach((p: any) => {
                console.log(`   - ID: ${p.id}, Amount: ${p.amount}, Ref: ${p.reference_id}`);
            });
        } else {
            console.log(`💰 Tournament Commissions: 0 (no tournaments found)`);
        }
        console.log();

        // Buscar comisiones de cash
        if (cashGameIds.length > 0) {
            const [cashCommissions]: any = await sequelize.query(`
                SELECT id, amount, source, reference_id, payment_date
                FROM payments
                WHERE source = 'cash_commission' AND reference_id IN (?)
            `, {
                replacements: [cashGameIds]
            });

            console.log(`💵 Cash Commissions: ${cashCommissions.length}`);
            cashCommissions.forEach((p: any) => {
                console.log(`   - ID: ${p.id}, Amount: ${p.amount}, Ref: ${p.reference_id}`);
            });
        } else {
            console.log(`💵 Cash Commissions: 0 (no cash games found)`);
        }
        console.log();

        console.log('✅ Test completed successfully!');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

test();
