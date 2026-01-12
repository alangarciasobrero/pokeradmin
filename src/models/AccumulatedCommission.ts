import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

export interface AccumulatedCommissionAttributes {
  id: number;
  destination_id: number;
  tournament_id: number;
  amount: number;
  percentage_applied: number;
  created_at?: Date;
}

export interface AccumulatedCommissionCreationAttributes 
  extends Optional<AccumulatedCommissionAttributes, 'id' | 'created_at'> {}

export class AccumulatedCommission extends Model<AccumulatedCommissionAttributes, AccumulatedCommissionCreationAttributes> 
  implements AccumulatedCommissionAttributes {
  public id!: number;
  public destination_id!: number;
  public tournament_id!: number;
  public amount!: number;
  public percentage_applied!: number;
  
  public readonly created_at!: Date;
}

AccumulatedCommission.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    destination_id: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: false,
      references: { model: 'commission_destinations', key: 'id' }
    },
    tournament_id: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: false,
      references: { model: 'tournaments', key: 'id' }
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    percentage_applied: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'accumulated_commissions',
    modelName: 'AccumulatedCommission',
    timestamps: false
  }
);

export default AccumulatedCommission;
