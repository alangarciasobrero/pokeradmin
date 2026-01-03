import sequelize from '../src/services/database';
import { Payment } from '../src/models/Payment';
import { Tournament } from '../src/models/Tournament';

(async () => {
  try {
    await sequelize.authenticate();
    
    const today = new Date().toISOString().split('T')[0];
    console.log('Fecha de hoy:', today);
    
    // Find tournaments from today
    const tournaments = await Tournament.findAll({
      where: { start_date: today }
    });
    
    console.log(`\nEncontrados ${tournaments.length} torneos de hoy`);
    
    for (const tournament of tournaments) {
      console.log(`\nTorneo ID ${tournament.id}, gaming_date: ${tournament.gaming_date}`);
      
      // Find payments for this tournament without gaming_date
      const [updated] = await sequelize.query(`
        UPDATE payments p
        INNER JOIN registrations r ON r.id = p.reference_id
        SET p.gaming_date = :gaming_date
        WHERE r.tournament_id = :tournament_id
          AND p.source = 'tournament'
          AND p.gaming_date IS NULL
      `, {
        replacements: {
          tournament_id: tournament.id,
          gaming_date: tournament.gaming_date
        }
      });
      
      console.log(`  Actualizados ${(updated as any).affectedRows || 0} pagos`);
    }
    
    await sequelize.close();
    console.log('\n✅ Proceso completado');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
