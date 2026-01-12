import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

export interface CommissionConfigAttributes {
  id: number;
  destination_id: number;
  percentage: number;
  priority: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CommissionConfigCreationAttributes 
  extends Optional<CommissionConfigAttributes, 'id' | 'priority' | 'created_at' | 'updated_at'> {}

export class CommissionConfig extends Model<CommissionConfigAttributes, CommissionConfigCreationAttributes> 
  implements CommissionConfigAttributes {
  public id!: number;
  public destination_id!: number;
  public percentage!: number;
  public priority!: number;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CommissionConfig.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    destination_id: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: false,
      references: { model: 'commission_destinations', key: 'id' }
    },
    percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    priority: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'commission_config',
    modelName: 'CommissionConfig',
    timestamps: true,
    underscored: true
  }
);

export default CommissionConfig;
