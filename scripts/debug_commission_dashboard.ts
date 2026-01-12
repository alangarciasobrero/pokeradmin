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

interface Payment {
    id: number;
    amount: string;
    source: string;
    reference_id: number | null;
    created_at: Date;
}

async function debug() {
    try {
        console.log('🔍 Debugging Commission Display in Dashboard...\n');

        const today = new Date();
        const todayStart = new Date(today);
        todayStart.setHours(0,0,0,0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23,59,59,999);

        console.log(`📅 Today: ${today.toISOString()}`);
        console.log(`📅 Range: ${todayStart.toISOString()} to ${todayEnd.toISOString()}\n`);

        // Buscar torneos del día
        const [tournaments]: any = await sequelize.query(`
            SELECT id, tournament_name, start_date 
            FROM tournaments 
            WHERE start_date BETWEEN ? AND ?
        `, {
            replacements: [todayStart, todayEnd]
        });

        console.log(`🏆 Tournaments today (by start_date): ${tournaments.length}`);
        tournaments.forEach((t: any) => {
            console.log(`   - ID: ${t.id}, Name: ${t.tournament_name}, Date: ${t.start_date}`);
        });
        console.log();

        // Buscar cash games del día
        const [cashGames]: any = await sequelize.query(`
            SELECT id, small_blind, start_datetime
            FROM cash_games 
            WHERE start_datetime BETWEEN ? AND ?
        `, {
            replacements: [todayStart, todayEnd]
        });

        console.log(`🎰 Cash Games today (by start_datetime): ${cashGames.length}`);
        cashGames.forEach((c: any) => {
            console.log(`   - ID: ${c.id}, Small Blind: ${c.small_blind}, Date: ${c.start_datetime}`);
        });
        console.log();

        const tournamentIds = tournaments.map((t: any) => t.id);
        const cashGameIds = cashGames.map((c: any) => c.id);

        // Buscar payments
        if (tournamentIds.length === 0 && cashGameIds.length === 0) {
            console.log('❌ No tournaments or cash games found for today');
            return;
        }

        let query = `
            SELECT id, amount, source, reference_id, created_at
            FROM payments
            WHERE 1=1
        `;

        const params: any[] = [];

        if (tournamentIds.length > 0 || cashGameIds.length > 0) {
            query += ` AND (`;
            const conditions: string[] = [];
            
            if (tournamentIds.length > 0) {
                conditions.push(`(source = 'commission' AND reference_id IN (?))`);
                params.push(tournamentIds);
            }
            
            if (cashGameIds.length > 0) {
                conditions.push(`(source LIKE 'cash_%' AND reference_id IN (?))`);
                params.push(cashGameIds);
            }
            
            query += conditions.join(' OR ');
            query += `)`;
        }

        console.log(`💰 Querying payments with query:\n${query}\n`);
        console.log(`   Params: ${JSON.stringify(params)}\n`);

        const [payments]: any = await sequelize.query(query, {
            replacements: params
        });

        console.log(`💸 Payments found: ${payments.length}`);
        
        let totalCommission = 0;
        let totalTips = 0;

        payments.forEach((p: any) => {
            const amt = Number(p.amount || 0);
            const src = p.source || '';
            console.log(`   - ID: ${p.id}, Amount: ${amt}, Source: ${src}, Ref: ${p.reference_id}`);
            
            if (src === 'commission' || src.startsWith('cash_commission')) {
                totalCommission += amt;
            }
            if (src.startsWith('cash_tips')) {
                totalTips += amt;
            }
        });

        console.log(`\n📊 Summary:`);
        console.log(`   Total Commission: ${totalCommission}`);
        console.log(`   Total Tips: ${totalTips}`);
        console.log(`   House Commission: ${totalCommission}`);

        if (totalCommission === 0) {
            console.log(`\n⚠️ No commissions found for today!`);
            console.log(`   Possible reasons:`);
            console.log(`   1. No tournaments or cash games created for today`);
            console.log(`   2. Tournaments/cash games exist but haven't been closed yet`);
            console.log(`   3. Payments were created but with wrong source or reference_id`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

debug();
