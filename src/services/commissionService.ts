/**
 * Servicio para calcular y distribuir comisiones de torneos
 */
import Setting from '../models/Setting';
import CommissionPool from '../models/CommissionPool';

export interface CommissionConfig {
  total_pct: number;
  quarterly_pct: number;
  monthly_pct: number;
  copa_pct: number;
  house_pct: number;
}

/**
 * Obtiene la configuración actual de comisiones desde la BD
 */
export async function getCommissionConfig(): Promise<CommissionConfig> {
  const settings = await Setting.findAll({
    where: {
      key: ['commission_total_pct', 'commission_quarterly_pct', 'commission_monthly_pct', 'commission_copa_pct', 'commission_house_pct']
    } as any
  });

  const config: CommissionConfig = {
    total_pct: 20,
    quarterly_pct: 1,
    monthly_pct: 1,
    copa_pct: 1,
    house_pct: 17,
  };

  for (const s of settings) {
    const key = (s as any).key;
    const val = Number((s as any).value) || 0;
    if (key === 'commission_total_pct') config.total_pct = val;
    if (key === 'commission_quarterly_pct') config.quarterly_pct = val;
    if (key === 'commission_monthly_pct') config.monthly_pct = val;
    if (key === 'commission_copa_pct') config.copa_pct = val;
    if (key === 'commission_house_pct') config.house_pct = val;
  }

  return config;
}

/**
 * Calcula comisión total y la distribuye a pozos según configuración
 * @param pot - Pozo total del torneo (buy-ins + re-entries, SIN bounty)
 * @param tournamentDate - Fecha del torneo para determinar período
 */
export async function distributeCommission(pot: number, tournamentDate: Date): Promise<void> {
  const config = await getCommissionConfig();
  const totalCommission = pot * (config.total_pct / 100);

  const quarterlyAmount = pot * (config.quarterly_pct / 100);
  const monthlyAmount = pot * (config.monthly_pct / 100);
  const copaAmount = pot * (config.copa_pct / 100);
  const houseAmount = pot * (config.house_pct / 100);

  // Determinar períodos
  const year = tournamentDate.getFullYear();
  const month = String(tournamentDate.getMonth() + 1).padStart(2, '0');
  const quarter = `Q${Math.ceil((tournamentDate.getMonth() + 1) / 3)}`;

  const monthlyPeriod = `${year}-${month}`;
  const quarterlyPeriod = `${year}-${quarter}`;
  const yearPeriod = String(year);

  // Distribuir a pozos (crear o actualizar)
  await addToPool('monthly', monthlyPeriod, monthlyAmount);
  await addToPool('quarterly', quarterlyPeriod, quarterlyAmount);
  await addToPool('copa_don_humberto', yearPeriod, copaAmount);
  await addToPool('house', monthlyPeriod, houseAmount);

  console.log(`[commissionService] Distributed commission: total=${totalCommission.toFixed(2)}, monthly=${monthlyAmount.toFixed(2)}, quarterly=${quarterlyAmount.toFixed(2)}, copa=${copaAmount.toFixed(2)}, house=${houseAmount.toFixed(2)}`);
}

/**
 * Agrega monto a un pozo existente o lo crea
 */
async function addToPool(poolType: 'monthly' | 'quarterly' | 'copa_don_humberto' | 'house', periodIdentifier: string, amount: number): Promise<void> {
  const [pool, created] = await CommissionPool.findOrCreate({
    where: { pool_type: poolType, period_identifier: periodIdentifier, status: 'active' } as any,
    defaults: { pool_type: poolType, period_identifier: periodIdentifier, accumulated_amount: amount, status: 'active' } as any,
  });

  if (!created) {
    const currentAmount = Number((pool as any).accumulated_amount) || 0;
    await CommissionPool.update(
      { accumulated_amount: currentAmount + amount } as any,
      { where: { id: (pool as any).id } as any }
    );
  }
}

export default {
  getCommissionConfig,
  distributeCommission,
};
