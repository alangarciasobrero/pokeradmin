import { sequelize } from '../src/config/database';
import { Payment } from '../src/models/Payment';
import { Registration } from '../src/models/Registration';
import { Tournament } from '../src/models/Tournament';
import { User } from '../src/models/User';

(async () => {
  try {
    await sequelize.authenticate();
    
    const today = new Date().toISOString().split('T')[0];
    console.log('Fecha de hoy:', today);
    
    const tournaments = await Tournament.findAll({
      where: { date: today },
      order: [['created_at', 'DESC']],
      limit: 3
    });
    
    console.log('\nÚltimos 3 torneos de hoy:');
    tournaments.forEach(t => console.log(`ID: ${t.id}, Gaming Date: ${t.gaming_date}, Status: ${t.status}`));
    
    if (tournaments.length > 0) {
      const lastTournament = tournaments[0];
      console.log(`\n=== Torneo ${lastTournament.id} ===`);
      
      const regs = await Registration.findAll({
        where: { tournament_id: lastTournament.id },
        include: [{ model: User, as: 'user' }]
      });
      
      console.log('\nRegistraciones:');
      regs.forEach(r => console.log(`  User: ${r.user?.username}, Paid: ${r.paid}, Amount: ${r.amount}`));
      
      const payments = await Payment.findAll({
        where: { 
          tournament_id: lastTournament.id,
          source: 'tournament'
        }
      });
      
      console.log('\nPagos (source=tournament):');
      payments.forEach(p => console.log(`  User ID: ${p.user_id}, Amount: ${p.amount}, Paid: ${p.paid}, Gaming Date: ${p.gaming_date}, Paid Amount: ${p.paid_amount}`));
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
