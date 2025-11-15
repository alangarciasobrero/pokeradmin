import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class TournamentPoint extends Model {
  public id!: number;
  public tournament_id!: number;
  public position!: number;
  public points!: number;
}

TournamentPoint.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    tournament_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    tableName: 'tournament_points',
    modelName: 'TournamentPoint',
    timestamps: false
  }
);

export default TournamentPoint;
