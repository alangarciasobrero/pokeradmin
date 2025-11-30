/**
 * SUPERTEST SEED SCRIPT
 * 
 * Crea una temporada completa simulada con:
 * - 50 jugadores con nombres reales
 * - 20 torneos (lunes/miércoles/viernes) para ranking
 * - 8 torneos dominicales sin ranking
 * - Mesas cash con turnos, comisiones y propinas
 * - Pagos, deudas, créditos
 * - Resultados realistas con distribución de posiciones
 */

import sequelize from '../src/models/index';
import { User } from '../src/models/User';
import { Tournament } from '../src/models/Tournament';
import { Registration } from '../src/models/Registration';
import { Result } from '../src/models/Result';
import { Payment } from '../src/models/Payment';
import { Season } from '../src/models/Season';
import { CashGame } from '../src/models/CashGame';
import { CashParticipant } from '../src/models/CashParticipant';
import bcrypt from 'bcrypt';
const { Op } = require('sequelize');

// Nombres reales para jugadores
const playerNames = [
	{ username: 'mrodriguez', full_name: 'María Rodríguez' },
	{ username: 'jgomez', full_name: 'Juan Gómez' },
	{ username: 'alopez', full_name: 'Ana López' },
	{ username: 'cmartinez', full_name: 'Carlos Martínez' },
	{ username: 'lgarcia', full_name: 'Laura García' },
	{ username: 'pmoreno', full_name: 'Pedro Moreno' },
	{ username: 'sfernandez', full_name: 'Sofía Fernández' },
	{ username: 'ddiaz', full_name: 'Diego Díaz' },
	{ username: 'vromero', full_name: 'Valentina Romero' },
	{ username: 'msuarez', full_name: 'Mateo Suárez' },
	{ username: 'jruiz', full_name: 'Julia Ruiz' },
	{ username: 'falvarez', full_name: 'Franco Álvarez' },
	{ username: 'mramirez', full_name: 'Martina Ramírez' },
	{ username: 'ltorres', full_name: 'Lucas Torres' },
	{ username: 'ccastillo', full_name: 'Catalina Castillo' },
	{ username: 'spereyra', full_name: 'Santiago Pereyra' },
	{ username: 'iflores', full_name: 'Isabella Flores' },
	{ username: 'nrivas', full_name: 'Nicolás Rivas' },
	{ username: 'eortiz', full_name: 'Emma Ortiz' },
	{ username: 'bsoto', full_name: 'Bruno Soto' },
	{ username: 'lmendez', full_name: 'Luna Méndez' },
	{ username: 'agreco', full_name: 'Agustín Greco' },
	{ username: 'vherrera', full_name: 'Victoria Herrera' },
	{ username: 'ivargas', full_name: 'Ignacio Vargas' },
	{ username: 'msanchez', full_name: 'Micaela Sánchez' },
	{ username: 'tmolina', full_name: 'Tomás Molina' },
	{ username: 'amelnik', full_name: 'Abril Melnik' },
	{ username: 'gsilva', full_name: 'Gaspar Silva' },
	{ username: 'rcardenas', full_name: 'Renata Cárdenas' },
	{ username: 'orivera', full_name: 'Octavio Rivera' },
	{ username: 'vbenitez', full_name: 'Valentino Benítez' },
	{ username: 'mcabrera', full_name: 'Malena Cabrera' },
	{ username: 'eacosta', full_name: 'Emilio Acosta' },
	{ username: 'dmendoza', full_name: 'Delfina Mendoza' },
	{ username: 'lnavarro', full_name: 'Lautaro Navarro' },
	{ username: 'aguerra', full_name: 'Agustina Guerra' },
	{ username: 'jpaz', full_name: 'Joaquín Paz' },
	{ username: 'bramos', full_name: 'Bianca Ramos' },
	{ username: 'fvega', full_name: 'Federico Vega' },
	{ username: 'mrojas', full_name: 'Milagros Rojas' },
	{ username: 'bmedina', full_name: 'Bautista Medina' },
	{ username: 'sgimenez', full_name: 'Simona Giménez' },
	{ username: 'amartin', full_name: 'Axel Martín' },
	{ username: 'jcorrea', full_name: 'Jazmín Correa' },
	{ username: 'mibarra', full_name: 'Matías Ibarra' },
	{ username: 'lcontreras', full_name: 'Luciana Contreras' },
	{ username: 'druiz', full_name: 'Dante Ruiz' },
	{ username: 'vcampos', full_name: 'Violeta Campos' },
	{ username: 'tcordoba', full_name: 'Thiago Córdoba' },
	{ username: 'nparedes', full_name: 'Nina Paredes' }
];

// Nombres de torneos temáticos
const tournamentNames = [
	'Torneo Nocturno de Ases',
	'Championship Monday',
	'Poker de Media Semana',
	'Friday Night Showdown',
	'Torneo del Rey',
	'High Stakes Challenge',
	'Monday Madness',
	'Midweek Grind',
	'Viernes de Gloria',
	'Torneo Relámpago',
	'Battle Royale',
	'Wednesday Warriors',
	'Lunes de Campeones',
	'Poker Night Elite',
	'Viernes de Fuego',
	'Thunder Monday',
	'Miércoles Estelar',
	'Friday Fever',
	'Torneo Imperial',
	'Monday Masters'
];

const sundayTournaments = [
	'Domingo de Leyendas',
	'Sunday Special',
	'Torneo Familiar Dominical',
	'Weekend Warrior',
	'Domingo Grande',
	'Sunday Showdown',
	'Torneo del Domingo',
	'Weekend Poker Fest'
];

interface PlayerStats {
	userId: number;
	username: string;
	full_name: string;
	tournaments: number;
	wins: number;
	finalTables: number;
	totalPaid: number;
	totalDebt: number;
	points: number;
}

async function clearDatabase() {
	console.log('🗑️  Limpiando base de datos...');
	
	await CashParticipant.destroy({ where: {} });
	await CashGame.destroy({ where: {} });
	await Payment.destroy({ where: {} });
	await Result.destroy({ where: {} });
	await Registration.destroy({ where: {} });
	await Tournament.destroy({ where: {} });
	await Season.destroy({ where: {} });
	
	// Mantener solo admin y jugador1
	await User.destroy({ 
		where: { 
			username: { 
				[Op.notIn]: ['admin', 'jugador1'] 
			} 
		} 
	});
	
	console.log('✅ Base de datos limpiada (manteniendo admin y jugador1)');
}

async function createSeason() {
	console.log('🏆 Creando temporada SuperTest...');
	
	const season = await Season.create({
		season_name: 'SuperTest',
		start_date: new Date('2024-07-01'),
		end_date: new Date('2024-12-31'),
		is_active: true
	} as any);
	
	console.log(`✅ Temporada creada: SuperTest (ID: ${season.id})`);
	return season;
}

async function createPlayers() {
	console.log('👥 Creando 50 jugadores...');
	
	const password = await bcrypt.hash('poker123', 10);
	const players: User[] = [];
	
	for (const playerData of playerNames) {
		const user = await User.create({
			username: playerData.username,
			full_name: playerData.full_name,
			password,
			role: 'player',
			is_player: true
		});
		players.push(user);
	}
	
	console.log(`✅ ${players.length} jugadores creados`);
	return players;
}

function getRandomPlayers(players: User[], min: number, max: number): User[] {
	const count = Math.floor(Math.random() * (max - min + 1)) + min;
	const shuffled = [...players].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

function generateRealisticResults(playerCount: number): number[] {
	// Distribución realista de posiciones (algunos empates, algunos eliminados sin premio)
	const positions: number[] = [];
	let currentPos = 1;
	
	for (let i = 0; i < playerCount; i++) {
		if (Math.random() < 0.1 && currentPos < 9) {
			// 10% chance de empate
			positions.push(currentPos);
		} else {
			positions.push(currentPos);
			currentPos++;
		}
	}
	
	return positions.sort(() => Math.random() - 0.5);
}

async function createTournament(
	name: string,
	date: Date,
	seasonId: number,
	countToRanking: boolean,
	players: User[]
): Promise<{ tournament: Tournament; participants: User[]; results: any[] }> {
	
	const buyIn = 22;
	const participants = getRandomPlayers(players, 15, 35);
	
	const tournament = await Tournament.create({
		tournament_name: name,
		start_date: date,
		buy_in: buyIn,
		re_entry: buyIn,
		knockout_bounty: 5,
		starting_stack: 10000,
		count_to_ranking: countToRanking,
		double_points: false,
		blind_levels: 3,
		small_blind: 10,
		punctuality_discount: 0,
		registration_open: false,
		season_id: seasonId
	});
	
	// Registrar participantes
	const registrations = [];
	for (const player of participants) {
		const hasBuyIn = true;
		const hasReentry = Math.random() < 0.3; // 30% reentry
		const hasDuplo = Math.random() < 0.15; // 15% duplo
		
		// Buy-in
		const buyInPaid = Math.random() < 0.85; // 85% pagan el buy-in
		const buyInAmount = buyInPaid ? buyIn : 0;
		const buyInMethod = buyInPaid ? (Math.random() < 0.7 ? 'cash' : (Math.random() < 0.5 ? 'transfer' : 'card')) : '';
		
		const buyInReg = await Registration.create({
			user_id: player.id,
			tournament_id: tournament.id,
			action_type: 1, // Buy-in
			amount_paid: buyInAmount,
			method: buyInMethod,
			recorded_by: 'admin'
		});
		registrations.push(buyInReg);
		
		// Re-entry
		if (hasReentry) {
			const reentryPaid = Math.random() < 0.9;
			const reentryAmount = reentryPaid ? buyIn : 0;
			const reentryMethod = reentryPaid ? (Math.random() < 0.7 ? 'cash' : 'transfer') : '';
			
			await Registration.create({
				user_id: player.id,
				tournament_id: tournament.id,
				action_type: 2, // Re-entry
				amount_paid: reentryAmount,
				method: reentryMethod,
				recorded_by: 'admin'
			});
		}
		
		// Duplo
		if (hasDuplo) {
			const duploPaid = Math.random() < 0.95;
			const duploAmount = duploPaid ? buyIn : 0;
			const duploMethod = duploPaid ? 'cash' : '';
			
			await Registration.create({
				user_id: player.id,
				tournament_id: tournament.id,
				action_type: 3, // Duplo
				amount_paid: duploAmount,
				method: duploMethod,
				recorded_by: 'admin'
			});
		}
	}
	
	// Generar resultados
	const positions = generateRealisticResults(participants.length);
	const results = [];
	
	for (let i = 0; i < participants.length; i++) {
		const result = await Result.create({
			tournament_id: tournament.id,
			user_id: participants[i].id,
			position: positions[i],
			recorded_by: 'admin'
		});
		results.push(result);
	}
	
	return { tournament, participants, results };
}

async function createCashGame(
	date: Date,
	players: User[]
): Promise<{ cash: CashGame; participants: any[]; shifts: any[] }> {
	
	const startTime = new Date(date);
	startTime.setHours(20, 0, 0, 0);
	const endTime = new Date(startTime);
	endTime.setHours(endTime.getHours() + Math.floor(Math.random() * 4) + 3); // 3-6 horas
	
	const cash = await CashGame.create({
		small_blind: 5,
		start_datetime: startTime,
		end_datetime: endTime,
		dealer: 'Carlos Dealer',
		total_commission: 0,
		total_tips: 0
	});
	
	const cashPlayers = getRandomPlayers(players, 6, 10);
	const participants = [];
	
	for (const player of cashPlayers) {
		const requestedAmount = [100, 150, 200, 250, 300][Math.floor(Math.random() * 5)];
		const amountPaid = Math.random() < 0.9 ? requestedAmount : 0; // 10% fiado
		const method = amountPaid > 0 ? (Math.random() < 0.8 ? 'cash' : 'transfer') : '';
		
		const joinedAt = new Date(startTime);
		joinedAt.setMinutes(joinedAt.getMinutes() + Math.floor(Math.random() * 60));
		
		const leftAt = Math.random() < 0.8 ? new Date(endTime) : null;
		if (leftAt) {
			leftAt.setMinutes(leftAt.getMinutes() - Math.floor(Math.random() * 30));
		}
		
		const participant = await CashParticipant.create({
			cash_game_id: cash.id,
			user_id: player.id,
			seat_number: participants.length + 1,
			buy_in: requestedAmount,
			amount_paid: amountPaid,
			method: method,
			joined_at: joinedAt,
			left_at: leftAt,
			recorded_by: 'admin'
		} as any);
		
		participants.push(participant);
	}
	
	// Crear turnos de dealer
	const shifts = [];
	const numShifts = Math.floor(Math.random() * 2) + 1; // 1-2 turnos
	
	for (let i = 0; i < numShifts; i++) {
		const shiftStart = new Date(startTime);
		shiftStart.setHours(shiftStart.getHours() + (i * 2));
		
		const shiftEnd = new Date(shiftStart);
		shiftEnd.setHours(shiftEnd.getHours() + 2);
		
		const commission = Math.floor(Math.random() * 50) + 30;
		const tips = Math.floor(Math.random() * 40) + 20;
		
		const shift = await DealerShift.create({
			cash_game_id: cash.id,
			dealer_name: i === 0 ? 'Carlos Dealer' : 'María Dealer',
			shift_start: shiftStart,
			shift_end: shiftEnd,
			commission: commission,
			tips: tips,
			recorded_by: 'admin'
		});
		
		shifts.push(shift);
	}
	
	// Actualizar totales
	const totalCommission = shifts.reduce((sum, s) => sum + parseFloat(s.commission), 0);
	const totalTips = shifts.reduce((sum, s) => sum + parseFloat(s.tips), 0);
	
	await cash.update({
		total_commission: totalCommission,
		total_tips: totalTips
	});
	
	return { cash, participants, shifts };
}

async function generateSuperTest() {
	try {
		console.log('🚀 Iniciando SUPERTEST...\n');
		
		await clearDatabase();
		
		const season = await createSeason();
		const players = await createPlayers();
		
		// Agregar admin y jugador1 a la lista de jugadores para que puedan participar
		const admin = await User.findOne({ where: { username: 'admin' } });
		const jugador1 = await User.findOne({ where: { username: 'jugador1' } });
		if (admin && jugador1) {
			players.push(admin as User, jugador1 as User);
		}
		
		console.log('\n📅 Creando temporada completa...\n');
		
		// Crear 20 torneos para ranking (lunes, miércoles, viernes) - Julio a Diciembre 2024
		const rankingTournaments = [];
		const cashGames = [];
		let tournamentIndex = 0;
		
		// Generar fechas para 20 torneos (aproximadamente 5 meses de torneos)
		const startDate = new Date('2024-07-01');
		const weeks = 10; // 10 semanas = 30 días posibles
		
		for (let week = 0; week < weeks && tournamentIndex < 20; week++) {
			const monday = new Date(startDate);
			monday.setDate(monday.getDate() + (week * 7));
			
			const wednesday = new Date(monday);
			wednesday.setDate(wednesday.getDate() + 2);
			
			const friday = new Date(monday);
			friday.setDate(friday.getDate() + 4);
			
			// Lunes
			if (tournamentIndex < 20) {
				console.log(`  🎯 Torneo ${tournamentIndex + 1}/20: ${tournamentNames[tournamentIndex]} (${monday.toISOString().split('T')[0]})`);
				const t = await createTournament(
					tournamentNames[tournamentIndex],
					monday,
					season.id,
					true,
					players
				);
				rankingTournaments.push(t);
				tournamentIndex++;
			}
			
			// Miércoles
			if (tournamentIndex < 20) {
				console.log(`  🎯 Torneo ${tournamentIndex + 1}/20: ${tournamentNames[tournamentIndex]} (${wednesday.toISOString().split('T')[0]})`);
				const t = await createTournament(
					tournamentNames[tournamentIndex],
					wednesday,
					season.id,
					true,
					players
				);
				rankingTournaments.push(t);
				tournamentIndex++;
			}
			
			// Viernes
			if (tournamentIndex < 20) {
				console.log(`  🎯 Torneo ${tournamentIndex + 1}/20: ${tournamentNames[tournamentIndex]} (${friday.toISOString().split('T')[0]})`);
				const t = await createTournament(
					tournamentNames[tournamentIndex],
					friday,
					season.id,
					true,
					players
				);
				rankingTournaments.push(t);
				tournamentIndex++;
				
				// Crear mesa cash para algunos viernes
				if (Math.random() < 0.6) {
					console.log(`    💵 Mesa cash del viernes`);
					const c = await createCashGame(friday, players);
					cashGames.push(c);
				}
			}
		}
		
		// Crear 8 torneos dominicales (sin ranking)
		console.log('\n📅 Creando torneos dominicales (sin ranking)...\n');
		const sundayTournamentsCreated = [];
		
		for (let i = 0; i < 8; i++) {
			const sunday = new Date('2024-07-07');
			sunday.setDate(sunday.getDate() + (i * 7));
			
			console.log(`  🌟 Domingo ${i + 1}/8: ${sundayTournaments[i]} (${sunday.toISOString().split('T')[0]})`);
			const t = await createTournament(
				sundayTournaments[i],
				sunday,
				season.id,
				false,
				players
			);
			sundayTournamentsCreated.push(t);
		}
		
		// Crear mesas cash adicionales
		console.log('\n💵 Creando mesas cash adicionales...\n');
		
		for (let i = 0; i < 12; i++) {
			const randomDate = new Date('2024-07-01');
			randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 180));
			
			console.log(`  💵 Mesa cash ${i + 1}/12 (${randomDate.toISOString().split('T')[0]})`);
			const c = await createCashGame(randomDate, players);
			cashGames.push(c);
		}
		
		// Generar reporte estadístico
		console.log('\n\n' + '='.repeat(80));
		console.log('📊 REPORTE ESTADÍSTICO - TEMPORADA SUPERTEST');
		console.log('='.repeat(80));
		
		// Calcular estadísticas por jugador
		const playerStats: PlayerStats[] = [];
		
		for (const player of players) {
			const registrations = await Registration.findAll({
				where: { user_id: player.id },
				include: [{ model: Tournament, where: { season_id: season.id, count_to_ranking: true } }]
			});
			
			const results = await Result.findAll({
				where: { user_id: player.id },
				include: [{ model: Tournament, where: { season_id: season.id, count_to_ranking: true } }]
			});
			
			const payments = await Payment.findAll({ where: { user_id: player.id } });
			
		const tournamentIds = new Set(results.map((r: any) => r.tournament_id));
		const wins = results.filter((r: any) => r.position === 1).length;
		const finalTables = results.filter((r: any) => r.position <= 9).length;			const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount as any), 0);
			const totalCost = payments.reduce((sum, p) => sum + parseFloat(p.amount as any), 0);
			const totalDebt = totalCost - totalPaid;
			
		// Calcular puntos (simplificado)
		let points = 0;
		for (const result of results) {
			const pos = (result as any).position;
				if (pos === 1) points += 23;
				else if (pos === 2) points += 17;
				else if (pos === 3) points += 14;
				else if (pos === 4) points += 11;
				else if (pos === 5) points += 9;
				else if (pos === 6) points += 8;
				else if (pos === 7) points += 7;
				else if (pos === 8) points += 6;
				else if (pos === 9) points += 5;
			}
			
			if (tournamentIds.size > 0) {
				playerStats.push({
					userId: player.id,
					username: player.username,
					full_name: player.full_name || player.username,
					tournaments: tournamentIds.size,
					wins,
					finalTables,
					totalPaid,
					totalDebt,
					points
				});
			}
		}
		
		// Ordenar por puntos
		playerStats.sort((a, b) => b.points - a.points);
		
		console.log('\n🏆 TOP 20 RANKING\n');
		console.log('Pos | Jugador                  | Torneos | Victorias | MT Finales | Puntos | Deuda');
		console.log('-'.repeat(90));
		
		playerStats.slice(0, 20).forEach((p, idx) => {
			const name = p.full_name.padEnd(24, ' ');
			const debt = p.totalDebt > 0 ? `$${p.totalDebt.toFixed(2)}` : '-';
			console.log(
				`${String(idx + 1).padStart(3, ' ')} | ${name} | ${String(p.tournaments).padStart(7, ' ')} | ${String(p.wins).padStart(9, ' ')} | ${String(p.finalTables).padStart(10, ' ')} | ${String(p.points).padStart(6, ' ')} | ${debt}`
			);
		});
		
		// Resumen de torneos
		console.log('\n\n🎯 RESUMEN DE TORNEOS\n');
		console.log(`Total torneos ranking: ${rankingTournaments.length}`);
		console.log(`Total torneos dominicales: ${sundayTournamentsCreated.length}`);
		console.log(`Total jugadores únicos: ${playerStats.length}`);
		
		// Resumen de mesas cash
		console.log('\n\n💵 RESUMEN MESAS CASH\n');
		console.log(`Total mesas cash: ${cashGames.length}`);
		
		let totalCashCommission = 0;
		let totalCashTips = 0;
		
		for (const cg of cashGames) {
			totalCashCommission += parseFloat(cg.cash.total_commission as any);
			totalCashTips += parseFloat(cg.cash.total_tips as any);
		}
		
		console.log(`Comisiones totales: $${totalCashCommission.toFixed(2)}`);
		console.log(`Propinas totales: $${totalCashTips.toFixed(2)}`);
		console.log(`Total recaudado: $${(totalCashCommission + totalCashTips).toFixed(2)}`);
		
		// Estadísticas de pagos
		const allPayments = await Payment.findAll();
		const totalExpected = allPayments.reduce((sum, p) => sum + parseFloat(p.amount as any), 0);
		const totalReceived = allPayments.reduce((sum, p) => sum + parseFloat(p.paid_amount as any), 0);
		const totalOutstanding = totalExpected - totalReceived;
		
		console.log('\n\n💰 RESUMEN FINANCIERO\n');
		console.log(`Total esperado: $${totalExpected.toFixed(2)}`);
		console.log(`Total recibido: $${totalReceived.toFixed(2)}`);
		console.log(`Deuda total: $${totalOutstanding.toFixed(2)}`);
		console.log(`Porcentaje cobrado: ${((totalReceived / totalExpected) * 100).toFixed(1)}%`);
		
		console.log('\n\n' + '='.repeat(80));
		console.log('✅ SUPERTEST COMPLETADO EXITOSAMENTE');
		console.log('='.repeat(80));
		console.log('\n¡Temporada completa creada! Puedes verificar los datos en el sistema.\n');
		
	} catch (error) {
		console.error('❌ Error en supertest:', error);
		throw error;
	}
}

// Ejecutar
generateSuperTest()
	.then(() => {
		console.log('🎉 Script finalizado con éxito');
		process.exit(0);
	})
	.catch((err) => {
		console.error('💥 Error fatal:', err);
		process.exit(1);
	});
