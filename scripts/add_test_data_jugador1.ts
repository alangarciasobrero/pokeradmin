import sequelize from '../src/services/database';

async function addTestData() {
	try {
		await sequelize.authenticate();
		console.log('✓ Conectado a la base de datos');

		// Buscar jugador1
		const [users]: any = await sequelize.query(`SELECT id FROM users WHERE username = 'jugador1' LIMIT 1`);
		if (!users || users.length === 0) {
			console.error('❌ Usuario jugador1 no encontrado');
			process.exit(1);
		}
		const userId = users[0].id;
		console.log(`✓ Usuario jugador1 encontrado (ID: ${userId})`);

		// Crear torneos de prueba
		console.log('\n📝 Creando torneos de prueba...');
		const tournaments = [];
		for (let i = 1; i <= 5; i++) {
			const date = new Date();
			date.setDate(date.getDate() - (i * 7));
			const dateStr = date.toISOString().slice(0, 19).replace('T', ' ');
			
			await sequelize.query(`
				INSERT IGNORE INTO tournaments 
				(tournament_name, start_date, buy_in, re_entry, starting_stack, blind_levels, small_blind, 
				 knockout_bounty, punctuality_discount, count_to_ranking, double_points, registration_open, end_date)
				VALUES 
				('Torneo Test ${i}', '${dateStr}', 5000, 'Si', 10000, 10, 20, 500, 500, ${i === 1 ? 1 : 0}, ${i === 1 ? 1 : 0}, 0, '${dateStr}')
			`);
			
			const [result]: any = await sequelize.query(`SELECT id FROM tournaments WHERE tournament_name = 'Torneo Test ${i}'`);
			tournaments.push({ id: result[0].id, name: `Torneo Test ${i}` });
			console.log(`  ✓ Torneo "${result[0].name || `Test ${i}`}" listo`);
		}

		// Crear inscripciones para jugador1
		console.log('\n🎫 Creando inscripciones...');
		let registrationCount = 0;
		for (let i = 0; i < tournaments.length; i++) {
			const tournamentId = tournaments[i].id;
			const position = i === 0 ? 1 : i === 1 ? 3 : i === 2 ? 5 : null;
			
			await sequelize.query(`
				INSERT IGNORE INTO registrations (tournament_id, user_id, position)
				VALUES (${tournamentId}, ${userId}, ${position})
			`);
			
			const [reg]: any = await sequelize.query(
				`SELECT id FROM registrations WHERE tournament_id = ${tournamentId} AND user_id = ${userId}`
			);
			const regId = reg[0].id;
			registrationCount++;

			// Pago del buy-in
			const buyInAmount = 5000;
			const paidAmount = i < 3 ? buyInAmount : buyInAmount * 0.5;
			const paid = i < 3 ? 1 : 0;
			
			await sequelize.query(`
				INSERT IGNORE INTO payments (user_id, amount, paid_amount, paid, reference_id)
				VALUES (${userId}, ${buyInAmount}, ${paidAmount}, ${paid}, ${regId})
			`);
			console.log(`  ✓ Inscripción ${i + 1}/5 - ${i < 3 ? 'PAGADO' : 'PENDIENTE $' + (buyInAmount - paidAmount)}`);
		}

		// Crear mesas cash (comentado por ahora - columnas no coinciden)
		console.log('\n🎲 Mesas cash omitidas (estructura de BD diferente)');
		const cashGamesCount = 0;
		for (let i = 1; i <= cashGamesCount; i++) {
			const date = new Date();
			date.setDate(date.getDate() - (i * 5));
			const endDate = new Date(date);
			endDate.setHours(endDate.getHours() + 4);
			const startStr = date.toISOString().slice(0, 19).replace('T', ' ');
			const endStr = endDate.toISOString().slice(0, 19).replace('T', ' ');

			await sequelize.query(`
				INSERT INTO cash_games (start_datetime, end_datetime, stakes, dealer, initial_chips, final_chips, commission, tips)
				VALUES ('${startStr}', '${endStr}', '25/50', 'Dealer Test', 50000, 48000, 1000, 500)
			`);
			
			const [cg]: any = await sequelize.query(`SELECT LAST_INSERT_ID() as id`);
			const cashGameId = cg[0].id;

			// Participación de jugador1
			const buyIn = 10000;
			const rebuys = i === 1 ? 5000 : 0;
			const finalStack = i === 1 ? 18000 : i === 2 ? 8000 : 12000;

			await sequelize.query(`
				INSERT INTO cash_participants (cash_game_id, user_id, buy_in, rebuys, final_stack)
				VALUES (${cashGameId}, ${userId}, ${buyIn}, ${rebuys}, ${finalStack})
			`);

			// Pago de la mesa cash
			const totalCost = buyIn + rebuys;
			const paidAmount = i === 1 ? totalCost : totalCost * 0.6;
			const paid = i === 1 ? 1 : 0;

			await sequelize.query(`
				INSERT INTO payments (user_id, amount, paid_amount, paid, reference_id)
				VALUES (${userId}, ${totalCost}, ${paidAmount}, ${paid}, ${cashGameId})
			`);

			const profit = finalStack - totalCost;
			console.log(`  ✓ Mesa ${i}/3 - Ganancia: $${profit} - ${i === 1 ? 'PAGADO' : 'PENDIENTE $' + (totalCost - paidAmount)}`);
		}

		console.log('\n📊 Resumen:');
		console.log(`  - ${tournaments.length} torneos creados`);
		console.log(`  - ${registrationCount} inscripciones`);
		console.log(`  - ${cashGamesCount} mesas cash`);

		// Calcular deuda total
		const [summary]: any = await sequelize.query(`
			SELECT 
				SUM(amount) as total_debt,
				SUM(paid_amount) as total_paid,
				SUM(CASE WHEN paid = 0 THEN amount - paid_amount ELSE 0 END) as pending
			FROM payments
			WHERE user_id = ${userId}
		`);

		console.log('\n💰 Estado financiero de jugador1:');
		console.log(`  Total adeudado: $${Number(summary[0].total_debt || 0).toFixed(2)}`);
		console.log(`  Total pagado: $${Number(summary[0].total_paid || 0).toFixed(2)}`);
		console.log(`  Pendiente: $${Number(summary[0].pending || 0).toFixed(2)}`);

		await sequelize.close();
		console.log('\n✅ Datos de prueba agregados exitosamente');

	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

addTestData();
