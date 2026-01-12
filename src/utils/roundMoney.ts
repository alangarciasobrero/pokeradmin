/**
 * Redondea un número al múltiplo de 5 más cercano
 * Ejemplos: 1243 → 1245, 1247 → 1245, 1248 → 1250
 * @param value - El valor a redondear
 * @returns El valor redondeado al múltiplo de 5 más cercano
 */
export function roundToNearest5(value: number): number {
  return Math.round(value / 5) * 5;
}

/**
 * Redondea un número normalmente (sin decimales)
 * @param value - El valor a redondear
 * @returns El valor redondeado
 */
export function roundMoney(value: number): number {
  return Math.round(value);
}

/**
 * Formatea un número como moneda con separador de miles
 * @param value - El valor a formatear
 * @returns El valor formateado como string
 */
export function formatMoney(value: number): string {
  return roundToNearest5(value).toLocaleString();
}
