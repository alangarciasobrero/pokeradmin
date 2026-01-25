/**
 * Servicio para calcular y otorgar bonos de asistencia y consistencia
 * Nuevo sistema: Todos los bonos son configurables desde settings
 */
import { Op } from 'sequelize';
import { Registration } from '../models/Registration';
import { Result } from '../models/Result';
import { Tournament } from '../models/Tournament';
import HistoricalPoint from '../models/HistoricalPoint';
import Setting from '../models/Setting';

interface BonusConfig {
  attendance: number;
  reentry: number;
  weekly_4days: number;
  weekly_3days: number;
  monthly_12days: number;
  season_30days: number;
  season_35days: number;
  final_tables_20: number;
}

/**
 * Carga la configuración de bonos desde la base de datos
 */
async function loadBonusConfig(): Promise<BonusConfig> {
  const settings = await Setting.findAll({
    where: {
      key: [
        'bonus_attendance',
        'bonus_reentry',
        'bonus_weekly_4days',
        'bonus_weekly_3days',
        'bonus_monthly_12days',
        'bonus_season_30days',
        'bonus_season_35days',
        'bonus_final_tables_20'
      ]
    } as any
  });

  const config: BonusConfig = {
    attendance: 100,
    reentry: 100,
    weekly_4days: 1000,
    weekly_3days: 500,
    monthly_12days: 2000,
    season_30days: 5000,
    season_35days: 10000,
    final_tables_20: 10000
  };

  for (const s of settings) {
    const key = (s as any).key.replace('bonus_', '');
    const value = Number((s as any).value);
    if (!isNaN(value)) {
      (config as any)[key] = value;
    }
  }

  return config;
}

/**
 * Otorga puntos de asistencia cuando un jugador se registra a un torneo
 * @param userId - ID del usuario
 * @param tournamentId - ID del torneo
 * @param seasonId - ID de la temporada
 */
export async function awardAttendanceBonus(userId: number, tournamentId: number, seasonId: number): Promise<void> {
  const config = await loadBonusConfig();

  // Verificar si ya se otorgó el bonus
  const existing = await HistoricalPoint.findOne({
    where: {
      user_id: userId,
      tournament_id: tournamentId,
      action_type: 'attendance',
    } as any,
  });

  if (!existing) {
    await HistoricalPoint.create({
      record_date: new Date(),
      user_id: userId,
      season_id: seasonId,
      tournament_id: tournamentId,
      result_id: null,
      action_type: 'attendance',
      description: `✅ Asistencia al torneo`,
      points: config.attendance,
    } as any);
    console.log(`[bonusService] Awarded attendance bonus (${config.attendance} pts) to user ${userId}`);
  }
}

/**
 * Otorga puntos por cada re-entry realizado
 * @param userId - ID del usuario
 * @param tournamentId - ID del torneo
 * @param seasonId - ID de la temporada
 * @param reentryNumber - Número de re-entry (para evitar duplicados)
 */
export async function awardReentryBonus(userId: number, tournamentId: number, seasonId: number, reentryNumber: number): Promise<void> {
  const config = await loadBonusConfig();

  // Verificar si ya se otorgó este re-entry específico
  const existing = await HistoricalPoint.findOne({
    where: {
      user_id: userId,
      tournament_id: tournamentId,
      action_type: 'reentry',
      description: { [Op.like]: `%Re-entry #${reentryNumber}%` } as any,
    } as any,
  });

  if (!existing) {
    await HistoricalPoint.create({
      record_date: new Date(),
      user_id: userId,
      season_id: seasonId,
      tournament_id: tournamentId,
      result_id: null,
      action_type: 'reentry',
      description: `🔄 Re-entry #${reentryNumber}`,
      points: config.reentry,
    } as any);
    console.log(`[bonusService] Awarded re-entry bonus (${config.reentry} pts) to user ${userId}`);
  }
}

/**
 * Calcula y otorga bonus semanal por asistir 3 jornadas (Bronce - 500 pts por defecto)
 * @param userId - ID del usuario
 * @param weekStart - Inicio de la semana
 * @param weekEnd - Fin de la semana
 * @param seasonId - ID de la temporada
 */
export async function checkAndAwardWeekly3DaysBonus(userId: number, weekStart: Date, weekEnd: Date, seasonId: number): Promise<boolean> {
  const config = await loadBonusConfig();
  
  const count = await Registration.count({
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

  if (count >= 3) {
    const weekIdentifier = `${weekStart.toISOString().split('T')[0]}`;
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        action_type: 'bonus_weekly_3',
        description: { [Op.like]: `%${weekIdentifier}%` } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: seasonId,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus_weekly_3',
        description: `🥉 Bonus Bronce - Semana ${weekIdentifier} (3 jornadas)`,
        points: config.weekly_3days,
      } as any);
      console.log(`[bonusService] Awarded weekly 3-days bonus (${config.weekly_3days} pts) to user ${userId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus semanal por asistir 4 jornadas (1000 pts por defecto)
 * @param userId - ID del usuario
 * @param weekStart - Inicio de la semana
 * @param weekEnd - Fin de la semana
 * @param seasonId - ID de la temporada
 */
export async function checkAndAwardWeekly4DaysBonus(userId: number, weekStart: Date, weekEnd: Date, seasonId: number): Promise<boolean> {
  const config = await loadBonusConfig();
  
  const count = await Registration.count({
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

  if (count >= 4) {
    const weekIdentifier = `${weekStart.toISOString().split('T')[0]}`;
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        action_type: 'bonus_weekly_4',
        description: { [Op.like]: `%${weekIdentifier}%` } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: seasonId,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus_weekly_4',
        description: `🏵️ Bonus Semanal - Semana ${weekIdentifier} (4 jornadas)`,
        points: config.weekly_4days,
      } as any);
      console.log(`[bonusService] Awarded weekly 4-days bonus (${config.weekly_4days} pts) to user ${userId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus mensual por asistir 12+ jornadas (Plata - 2000 pts por defecto)
 */
export async function checkAndAwardMonthly12DaysBonus(userId: number, year: number, month: number, seasonId: number): Promise<boolean> {
  const config = await loadBonusConfig();
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

  if (count >= 12) {
    const periodIdentifier = `${year}-${String(month).padStart(2, '0')}`;
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        action_type: 'bonus_monthly_12',
        description: { [Op.like]: `%${periodIdentifier}%` } as any,
      } as any,
    });

    if (!existing) {
      await HistoricalPoint.create({
        record_date: new Date(),
        user_id: userId,
        season_id: seasonId,
        tournament_id: null,
        result_id: null,
        action_type: 'bonus_monthly_12',
        description: `🥈 Bonus Plata - ${periodIdentifier} (${count} jornadas)`,
        points: config.monthly_12days,
      } as any);
      console.log(`[bonusService] Awarded monthly 12-days bonus (${config.monthly_12days} pts) to user ${userId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus por asistir 30+ jornadas en la temporada (Oro - 5000 pts por defecto)
 */
export async function checkAndAwardSeason30DaysBonus(userId: number, seasonStart: Date, seasonEnd: Date, seasonId: number): Promise<boolean> {
  const config = await loadBonusConfig();
  
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

  if (count >= 30) {
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        season_id: seasonId,
        action_type: 'bonus_season_30',
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
        action_type: 'bonus_season_30',
        description: `🥇 Bonus Oro - Temporada ${seasonId} (${count} jornadas)`,
        points: config.season_30days,
      } as any);
      console.log(`[bonusService] Awarded season 30-days bonus (${config.season_30days} pts) to user ${userId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus por asistir 35+ jornadas en la temporada (Diamante - 10000 pts por defecto)
 */
export async function checkAndAwardSeason35DaysBonus(userId: number, seasonStart: Date, seasonEnd: Date, seasonId: number): Promise<boolean> {
  const config = await loadBonusConfig();
  
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

  if (count >= 35) {
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        season_id: seasonId,
        action_type: 'bonus_season_35',
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
        action_type: 'bonus_season_35',
        description: `💎 Bonus Diamante - Temporada ${seasonId} (${count} jornadas)`,
        points: config.season_35days,
      } as any);
      console.log(`[bonusService] Awarded season 35-days bonus (${config.season_35days} pts) to user ${userId}`);
      return true;
    }
  }

  return false;
}

/**
 * Calcula y otorga bonus por disputar 20+ mesas finales (Black - 10000 pts por defecto)
 */
export async function checkAndAwardFinalTables20Bonus(userId: number, seasonStart: Date, seasonEnd: Date, seasonId: number): Promise<boolean> {
  const config = await loadBonusConfig();
  
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

  if (count >= 20) {
    const existing = await HistoricalPoint.findOne({
      where: {
        user_id: userId,
        season_id: seasonId,
        action_type: 'bonus_final_tables_20',
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
        action_type: 'bonus_final_tables_20',
        description: `⚫ Bonus Black - Temporada ${seasonId} (${count} mesas finales)`,
        points: config.final_tables_20,
      } as any);
      console.log(`[bonusService] Awarded final tables 20+ bonus (${config.final_tables_20} pts) to user ${userId}`);
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
 * @param triplePoints - Si el torneo tiene triple ranking activado
 * @param config - Configuración opcional de puntos (si no se pasa, usa defaults)
 * @returns Total de puntos del pozo a distribuir
 */
export function calculateTournamentPointsPool(
  tournamentDate: Date, 
  buyinCount: number, 
  reentryCount: number,
  doublePoints: boolean,
  triplePoints: boolean = false,
  config?: {
    weekdayBuyin?: number,
    weekdayReentry?: number,
    fridayBuyin?: number,
    fridayReentry?: number,
    dayGroups?: Array<{ name: string, days: number[], buyinPoints: number, reentryPoints: number }>
  }
): number {
  const dayOfWeek = tournamentDate.getDay(); // 0=Domingo, 1=Lunes, etc.
  
  let buyinBasePoints = 150;
  let reentryPoints = 100;

  // Si hay grupos de días configurados, usar esos valores
  if (config?.dayGroups && config.dayGroups.length > 0) {
    const matchingGroup = config.dayGroups.find(group => group.days.includes(dayOfWeek));
    if (matchingGroup) {
      buyinBasePoints = matchingGroup.buyinPoints;
      reentryPoints = matchingGroup.reentryPoints;
      console.log(`[Bonus] Day ${dayOfWeek} matched group "${matchingGroup.name}" - buyin: ${buyinBasePoints}, reentry: ${reentryPoints}`);
    } else {
      console.log(`[Bonus] Day ${dayOfWeek} not in any group, using defaults`);
    }
  } else {
    // Legacy: usar lógica vieja de Viernes vs otros días
    const isFriday = dayOfWeek === 5;
    buyinBasePoints = isFriday 
      ? (config?.fridayBuyin || 200) 
      : (config?.weekdayBuyin || 150);
    reentryPoints = isFriday
      ? (config?.fridayReentry || 100)
      : (config?.weekdayReentry || 100);
  }
  
  // Aplicar multiplicador según tipo de ranking
  let buyinPoints = buyinBasePoints;
  if (triplePoints) {
    buyinPoints = buyinBasePoints * 3;
  } else if (doublePoints) {
    buyinPoints = buyinBasePoints * 2;
  }
  
  // Calcular pozo total
  const totalPoolPoints = (buyinCount * buyinPoints) + (reentryCount * reentryPoints);
  
  console.log(`[Bonus] Pool calculation: ${buyinCount} buyins × ${buyinPoints} + ${reentryCount} reentries × ${reentryPoints} = ${totalPoolPoints} pts`);
  
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
