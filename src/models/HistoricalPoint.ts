import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class HistoricalPoint extends Model {
  public id!: number;
  public record_date!: Date;
  public user_id!: number;
  public season_id!: number;
  public tournament_id?: number | null;
  public result_id?: number | null;
  public action_type!: string;
  public description?: string | null;
  public points!: number;
}

HistoricalPoint.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    record_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    season_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tournament_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    result_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    action_type: { type: DataTypes.ENUM('attendance','reentry','final_table','placement','bonus'), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    points: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    tableName: 'historical_points',
    modelName: 'HistoricalPoint',
    timestamps: false
  }
);

export default HistoricalPoint;
