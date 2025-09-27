import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

// Modelo Tournament actualizado para reflejar todos los campos de la tabla
export class Tournament extends Model {
  public id!: number;
  public tournament_name!: string;
  public start_date!: Date;
  public buy_in!: number;
  public re_entry!: number;
  public knockout_bounty!: number;
  public starting_stack!: number;
  public count_to_ranking!: boolean;
  public double_points!: boolean;
  public blind_levels!: number;
  public small_blind!: number;
  public punctuality_discount!: number;
}

Tournament.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tournament_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    buy_in: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false,
    },
    re_entry: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    knockout_bounty: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false,
    },
    starting_stack: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count_to_ranking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    double_points: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    blind_levels: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    small_blind: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    punctuality_discount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Tournament',
    tableName: 'tournaments',
    timestamps: false,
  }
);
