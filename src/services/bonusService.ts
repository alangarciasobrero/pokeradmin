/**
 * Servicio para calcular y otorgar bonus de asistencia
 */
import { Op } from 'sequelize';
import { Registration } from '../models/Registration';
import { Result } from '../models/Result';
import { Tournament } from '../models/Tournament';
import HistoricalPoint from '../models/HistoricalPoint';

/**
 * Calcula y otorga bonus Bronce (500 pts) si asistió a 3 jornadas en una semana
 * @param userId - ID del usuario
 * @param weekStart - Inicio de la semana (Lunes)
 * @param weekEnd - Fin de la semana (Domingo)
 */
export async function checkAndAwardBronzeBonus(userId: number, weekStart: Date, weekEnd: Date): Promise<boolean> {
  const registrations = await Registration.findAll({
    include: [{
      model: Tournament,
      as: 'tournament',
      where: {
        start_date: { [Op.between]: [weekStart, weekEnd] }
      } as any,
      required: true,
    }],
    where: { user_id: userId } as any,
  });

  // Verificar si asistió a 3 jornadas (Lunes, Miércoles, Viernes)
  const days = new Set<number>();
  for (const reg of registrations) {
    const tournament = (reg as any).tournament;
    if (tournament) {
      const day = new Date(tournament.start_date).getDay();
      days.add(day);
    }
  }

  // 1=Lunes, 3=Miércoles, 5=Viernes
  if (days.has(1) && days.has(3) && days.has(5)) {
    // Verificar si ya tiene el bonus para esta semana
    const weekIdentifier = `${weekStart.toISOString().split('T')[0]}`;
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        action_type: 'bonus',
        description: { [Op.like]: `%Bronce - Semana ${weekIdentifier}%` } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: 1,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus',
        description: `🥉 Bonus Bronce - Semana ${weekIdentifier} (3 jornadas)`,
        points: 500,
      } as any);
      console.log(`[bonusService] Awarded Bronze bonus (500 pts) to user ${userId} for week ${weekIdentifier}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus Plata (2000 pts) si asistió a 10+ jornadas en el mes
 */
export async function checkAndAwardSilverBonus(userId: number, year: number, month: number): Promise<boolean> {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59);

  const count = await Registration.count({
    include: [{
      model: Tournament,
      as: 'tournament',
      where: {
        start_date: { [Op.between]: [monthStart, monthEnd] }
      } as any,
      required: true,
    }],
    where: { user_id: userId } as any,
  });

  if (count >= 10) {
    const periodIdentifier = `${year}-${String(month).padStart(2, '0')}`;
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        action_type: 'bonus',
        description: { [Op.like]: `%Plata - ${periodIdentifier}%` } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: 1,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus',
        description: `🥈 Bonus Plata - ${periodIdentifier} (${count} jornadas)`,
        points: 2000,
      } as any);
      console.log(`[bonusService] Awarded Silver bonus (2000 pts) to user ${userId} for month ${periodIdentifier}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus Oro (5000 pts) si asistió a 28+ de 35 jornadas
 */
export async function checkAndAwardGoldBonus(userId: number, seasonStart: Date, seasonEnd: Date, seasonId: number): Promise<boolean> {
  const count = await Registration.count({
    include: [{
      model: Tournament,
      as: 'tournament',
      where: {
        start_date: { [Op.between]: [seasonStart, seasonEnd] },
        count_to_ranking: true,
      } as any,
      required: true,
    }],
    where: { user_id: userId } as any,
  });

  if (count >= 28) {
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        season_id: seasonId,
        action_type: 'bonus',
        description: { [Op.like]: '%Oro%' } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: seasonId,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus',
        description: `🥇 Bonus Oro - Temporada ${seasonId} (${count}/35 jornadas)`,
        points: 5000,
      } as any);
      console.log(`[bonusService] Awarded Gold bonus (5000 pts) to user ${userId} for season ${seasonId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus Diamante (10000 pts) si asistió a 32+ de 35 jornadas
 */
export async function checkAndAwardDiamondBonus(userId: number, seasonStart: Date, seasonEnd: Date, seasonId: number): Promise<boolean> {
  const count = await Registration.count({
    include: [{
      model: Tournament,
      as: 'tournament',
      where: {
        start_date: { [Op.between]: [seasonStart, seasonEnd] },
        count_to_ranking: true,
      } as any,
      required: true,
    }],
    where: { user_id: userId } as any,
  });

  if (count >= 32) {
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        season_id: seasonId,
        action_type: 'bonus',
        description: { [Op.like]: '%Diamante%' } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: seasonId,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus',
        description: `💎 Bonus Diamante - Temporada ${seasonId} (${count}/35 jornadas)`,
        points: 10000,
      } as any);
      console.log(`[bonusService] Awarded Diamond bonus (10000 pts) to user ${userId} for season ${seasonId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus Black (10000 pts) si disputó 16+ mesas finales
 */
export async function checkAndAwardBlackBonus(userId: number, seasonStart: Date, seasonEnd: Date, seasonId: number): Promise<boolean> {
  const count = await Result.count({
    include: [{
      model: Tournament,
      as: 'tournament',
      where: {
        start_date: { [Op.between]: [seasonStart, seasonEnd] },
        count_to_ranking: true,
      } as any,
      required: true,
    }],
    where: {
      user_id: userId,
      final_table: true,
    } as any,
  });

  if (count >= 16) {
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        season_id: seasonId,
        action_type: 'bonus',
        description: { [Op.like]: '%Black%' } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: seasonId,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus',
        description: `⚫ Bonus Black - Temporada ${seasonId} (${count} mesas finales)`,
        points: 10000,
      } as any);
      console.log(`[bonusService] Awarded Black bonus (10000 pts) to user ${userId} for season ${seasonId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula puntos por cajas según día de la semana
 * Lunes (1) y Miércoles (3): 150 pts por caja
 * Viernes (5): 200 pts por caja
 */
/**
 * Calcula el pozo de puntos del torneo que se distribuirá entre top 9
 * @param tournamentDate - Fecha del torneo para determinar día de la semana
 * @param buyinCount - Cantidad de buy-ins (inscripciones iniciales)
 * @param reentryCount - Cantidad de re-entries
 * @param doublePoints - Si el torneo tiene doble ranking activado
 * @param config - Configuración opcional de puntos (si no se pasa, usa defaults)
 * @returns Total de puntos del pozo a distribuir
 */
export function calculateTournamentPointsPool(
  tournamentDate: Date, 
  buyinCount: number, 
  reentryCount: number,
  doublePoints: boolean,
  config?: {
    weekdayBuyin?: number,
    weekdayReentry?: number,
    fridayBuyin?: number,
    fridayReentry?: number
  }
): number {
  const dayOfWeek = tournamentDate.getDay();
  const isFriday = dayOfWeek === 5;
  
  // Puntos base por buy-in según día (usar config o defaults)
  const buyinBasePoints = isFriday 
    ? (config?.fridayBuyin || 200) 
    : (config?.weekdayBuyin || 150);
  
  // Si es doble ranking, el buy-in vale el doble
  const buyinPoints = doublePoints ? (buyinBasePoints * 2) : buyinBasePoints;
  
  // Re-entries según día (usar config o defaults)
  const reentryPoints = isFriday
    ? (config?.fridayReentry || 100)
    : (config?.weekdayReentry || 100);
  
  // Calcular pozo total
  const totalPoolPoints = (buyinCount * buyinPoints) + (reentryCount * reentryPoints);
  
  return totalPoolPoints;
}

/**
 * DEPRECATED - Usar calculateTournamentPointsPool en su lugar
 */
export function calculateBoxPoints(tournamentDate: Date, totalBoxes: number): number {
  const dayOfWeek = tournamentDate.getDay();
  const pointsPerBox = (dayOfWeek === 5) ? 200 : 150; // Viernes=200, Lunes/Miércoles=150
  return pointsPerBox * totalBoxes;
}

/**
 * Distribuye puntos por cajas entre jugadores de mesa final
 * @param totalBoxPoints - Puntos totales a distribuir
 * @param finalTableUserIds - IDs de usuarios que llegaron a mesa final
 * @param percentages - Porcentajes de distribución (debe sumar 100)
 */
export async function distributeBoxPointsToFinalTable(
  tournamentId: number,
  totalBoxPoints: number,
  finalTableUserIds: number[],
  percentages: number[] = [23, 17, 14, 11, 9, 8, 7, 6, 5] // Mesa final completa (top 9) - suma 100%
): Promise<void> {
  if (finalTableUserIds.length === 0) return;

  // Usar porcentajes directamente ya que suman 100%
  const normalized = percentages;

  for (let i = 0; i < Math.min(finalTableUserIds.length, normalized.length); i++) {
    const userId = finalTableUserIds[i];
    const pct = normalized[i];
    const points = Math.round((pct / 100) * totalBoxPoints);

    await HistoricalPoint.create({
      record_date: new Date(),
      user_id: userId,
      season_id: 1,
      tournament_id: tournamentId,
      result_id: null,
      action_type: 'bonus',
      description: `Puntos por cajas - Mesa final posición ${i + 1} (${pct.toFixed(1)}%)`,
      points: points,
    } as any);
  }

  console.log(`[bonusService] Distributed ${totalBoxPoints} box points to ${finalTableUserIds.length} final table players for tournament ${tournamentId}`);
}

export default {
  checkAndAwardBronzeBonus,
  checkAndAwardSilverBonus,
  checkAndAwardGoldBonus,
  checkAndAwardDiamondBonus,
  checkAndAwardBlackBonus,
  calculateBoxPoints,
  calculateTournamentPointsPool,
  distributeBoxPointsToFinalTable,
};
