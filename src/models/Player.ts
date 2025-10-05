// Modelo Sequelize para la entidad Player
// Representa a un jugador en el sistema PokerAdmin
import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

/**
 * Clase Player
 * Define los atributos y tipos de un jugador
 */
export class Player extends Model {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email?: string;
  public phone_number?: string;
  public nickname?: string;
  public created_at!: Date;
  public current_points!: number;
  public suspended!: boolean;
  public is_deleted!: boolean;
}

/**
 * Inicializa el modelo Player con los campos y sus propiedades
 */
Player.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    current_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Player',
    tableName: 'players',
    timestamps: false,
  }
);
