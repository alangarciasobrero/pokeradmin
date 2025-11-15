import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class RankingHistory extends Model {
  public id!: number;
  public fecha!: Date;
  public user_id!: number;
  public season_id!: number;
  public posicion!: number;
  public puntos_acumulados!: number;
  public torneos_jugados!: number;
}

RankingHistory.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    season_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    posicion: { type: DataTypes.INTEGER, allowNull: false },
    puntos_acumulados: { type: DataTypes.INTEGER, allowNull: false },
    torneos_jugados: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  {
    sequelize,
    tableName: 'ranking_history',
    modelName: 'RankingHistory',
    timestamps: false
  }
);

export default RankingHistory;
