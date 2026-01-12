/**
 * Utilidades para manejo de fechas en formato dd/mm/yyyy
 */

/**
 * Parsea una fecha en formato dd/mm/yyyy y retorna un objeto Date
 * @param dateStr - String en formato dd/mm/yyyy
 * @returns Date object o null si el formato es inválido
 */
export function parseDateDMY(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;
  
  // Crear fecha (month - 1 porque Date usa 0-11 para meses)
  const date = new Date(year, month - 1, day);
  
  // Verificar que la fecha sea válida (ej: 31/02/2025 sería inválido)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }
  
  return date;
}

/**
 * Formatea una fecha a dd/mm/yyyy
 * @param date - Date object o string ISO
 * @returns String en formato dd/mm/yyyy
 */
export function formatDateDMY(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dt = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dt.getTime())) return '';
  
  const day = String(dt.getDate()).padStart(2, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Convierte dd/mm/yyyy a yyyy-mm-dd (formato SQL/ISO)
 * @param dateStr - String en formato dd/mm/yyyy
 * @returns String en formato yyyy-mm-dd o null si inválido
 */
export function dmyToISO(dateStr: string): string | null {
  const date = parseDateDMY(dateStr);
  if (!date) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Convierte yyyy-mm-dd a dd/mm/yyyy
 * @param isoStr - String en formato yyyy-mm-dd
 * @returns String en formato dd/mm/yyyy
 */
export function isoToDMY(isoStr: string): string {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  return formatDateDMY(date);
}
