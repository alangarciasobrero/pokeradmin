/**
 * Gaming Date Utilities
 * 
 * Una "jornada de juego" comienza a las 12:00 PM (mediodía) y termina a las 11:59 AM del día siguiente.
 * Esto permite que eventos de madrugada (ej: torneo que termina a las 3 AM del domingo)
 * se asocien con la jornada del sábado.
 */

/**
 * Calcula la fecha de jornada para un timestamp dado
 * @param timestamp - Fecha/hora del evento
 * @returns Fecha de jornada normalizada (solo fecha, sin hora)
 * 
 * Ejemplos:
 * - Sábado 13/12 22:00 → Jornada: 13/12
 * - Domingo 14/12 03:00 → Jornada: 13/12 (pertenece al sábado)
 * - Domingo 14/12 13:00 → Jornada: 14/12
 */
export function getGamingDate(timestamp: Date): Date {
  const date = new Date(timestamp);
  const hour = date.getHours();
  
  // Si es antes del mediodía (00:00 - 11:59), restar 1 día
  if (hour < 12) {
    date.setDate(date.getDate() - 1);
  }
  
  // Normalizar a medianoche (solo fecha, sin hora)
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Obtiene la jornada actual
 * @returns Fecha de jornada actual
 */
export function getCurrentGamingDate(): Date {
  return getGamingDate(new Date());
}

/**
 * Formatea una jornada como string SQL-compatible (YYYY-MM-DD)
 * @param gamingDate - Fecha de jornada
 * @returns String formato YYYY-MM-DD
 */
export function formatGamingDateSQL(gamingDate: Date): string {
  const year = gamingDate.getFullYear();
  const month = String(gamingDate.getMonth() + 1).padStart(2, '0');
  const day = String(gamingDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una jornada como string legible (DD/MM/YYYY)
 * @param gamingDate - Fecha de jornada
 * @returns String formato DD/MM/YYYY
 */
export function formatGamingDateDisplay(gamingDate: Date): string {
  const year = gamingDate.getFullYear();
  const month = String(gamingDate.getMonth() + 1).padStart(2, '0');
  const day = String(gamingDate.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/**
 * Verifica si un timestamp pertenece a la jornada actual
 * @param timestamp - Fecha/hora a verificar
 * @returns true si pertenece a la jornada actual
 */
export function isCurrentGamingDate(timestamp: Date): boolean {
  const eventGaming = getGamingDate(timestamp);
  const currentGaming = getCurrentGamingDate();
  return eventGaming.getTime() === currentGaming.getTime();
}

/**
 * Obtiene el inicio de la jornada (mediodía)
 * @param gamingDate - Fecha de jornada
 * @returns Timestamp del inicio de la jornada (12:00 PM)
 */
export function getGamingDayStart(gamingDate: Date): Date {
  const start = new Date(gamingDate);
  start.setHours(12, 0, 0, 0);
  return start;
}

/**
 * Obtiene el fin de la jornada (11:59 AM del día siguiente)
 * @param gamingDate - Fecha de jornada
 * @returns Timestamp del fin de la jornada (11:59:59 AM día siguiente)
 */
export function getGamingDayEnd(gamingDate: Date): Date {
  const end = new Date(gamingDate);
  end.setDate(end.getDate() + 1);
  end.setHours(11, 59, 59, 999);
  return end;
}
