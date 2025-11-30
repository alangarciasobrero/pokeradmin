import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

/**
 * Modelo para rastrear pozos acumulados de comisiones
 * Cada registro representa un pozo (mensual, trimestral, Copa Don Humberto, etc.)
 */
export class CommissionPool extends Model {
  public id!: number;
  public pool_type!: string; // 'monthly', 'quarterly', 'copa_don_humberto', 'house'
  public period_identifier!: string; // e.g., '2025-11' para mensual, '2025-Q4' para trimestral
  public accumulated_amount!: number;
  public status!: string; // 'active', 'closed', 'paid'
  public closed_at?: Date;
  public paid_at?: Date;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
}

CommissionPool.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pool_type: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'copa_don_humberto', 'house'),
      allowNull: false,
    },
    period_identifier: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    accumulated_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'paid'),
      allowNull: false,
      defaultValue: 'active',
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'commission_pools',
    modelName: 'CommissionPool',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default CommissionPool;
