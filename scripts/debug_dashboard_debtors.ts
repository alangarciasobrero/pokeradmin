import sequelize from '../src/services/database';
import { Tournament } from '../src/models/Tournament';
import { CashGame } from '../src/models/CashGame';
import { Op } from 'sequelize';

(async () => {
  try {
    await sequelize.authenticate();
    
    const today = new Date('2026-01-01');
    console.log('Fecha de hoy:', today.toISOString().split('T')[0]);
    
    // Buscar torneos que empezaron hoy
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    
    console.log('\nRango de búsqueda:');
    console.log('  Start:', todayStart.toISOString());
    console.log('  End:', todayEnd.toISOString());
    
    const tournamentsTodayByDate = await Tournament.findAll({
      where: {
        start_date: {
          [Op.between]: [todayStart, todayEnd]
        }
      }
    });
    
    console.log(`\nTorneos encontrados: ${tournamentsTodayByDate.length}`);
    tournamentsTodayByDate.forEach(t => console.log(`  ID: ${t.id}, Start: ${t.start_date}, Gaming Date: ${t.gaming_date}`));
    
    const cashGamesTodayByDate = await CashGame.findAll({
      where: {
        start_datetime: {
          [Op.between]: [todayStart, todayEnd]
        }
      }
    });
    
    console.log(`\nCash games encontrados: ${cashGamesTodayByDate.length}`);
    cashGamesTodayByDate.forEach(c => console.log(`  ID: ${c.id}, Start: ${(c as any).start_datetime}, Gaming Date: ${(c as any).gaming_date}`));
    
    // Recolectar gaming_dates únicos
    const gamingDates = new Set<string>();
    tournamentsTodayByDate.forEach(t => {
      if (t.gaming_date) {
        const dateStr = new Date(t.gaming_date as any).toISOString().split('T')[0];
        gamingDates.add(dateStr);
      }
    });
    cashGamesTodayByDate.forEach(c => {
      if ((c as any).gaming_date) {
        const dateStr = new Date((c as any).gaming_date).toISOString().split('T')[0];
        gamingDates.add(dateStr);
      }
    });
    
    console.log('\nGaming dates únicos:', Array.from(gamingDates));
    
    // Buscar deudores para cada gaming_date
    for (const gamingDate of gamingDates) {
      console.log(`\n=== Buscando deudores para gaming_date: ${gamingDate} ===`);
      
      const [payments] = await sequelize.query(`
        SELECT 
          u.id as user_id,
          u.username,
          p.amount,
          p.paid,
          COALESCE(p.paid_amount, 0) as paid_amount,
          (p.amount - COALESCE(p.paid_amount, 0)) as debt
        FROM payments p
        INNER JOIN users u ON u.id = p.user_id
        WHERE p.gaming_date = :gaming_date
          AND p.source IN ('cash', 'cash_request', 'tournament')
          AND (p.paid = 0 OR p.amount > COALESCE(p.paid_amount, 0))
      `, {
        replacements: { gaming_date: gamingDate }
      });
      
      console.log(`Deudores encontrados: ${(payments as any[]).length}`);
      (payments as any[]).forEach(p => console.log(`  ${p.username}: $${p.debt}`));
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
