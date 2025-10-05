// Modelo Sequelize para la entidad Result
// Representa el resultado de un jugador en un torneo
import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class Result extends Model {
  public id!: number;
  public tournament_id!: number;
  public player_id!: number;
  public position!: number;
  public final_table!: boolean;
}

/**
 * Inicializa el modelo Result con los campos y sus propiedades
 */
Result.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tournament_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'tournaments',
        key: 'id',
      },
    },
    player_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'players',
        key: 'id',
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    final_table: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Result',
    tableName: 'results',
    timestamps: false,
  }
);
