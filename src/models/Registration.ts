// Modelo Sequelize para la entidad Registration
// Representa una inscripción de un jugador a un torneo
import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class Registration extends Model {
  public id!: number;
  public user_id!: number;
  public tournament_id!: number;
  public registration_date!: Date;
  public punctuality!: boolean;
}

/**
 * Inicializa el modelo Registration con los campos y sus propiedades
 */
Registration.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    tournament_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'tournaments',
        key: 'id',
      },
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    punctuality: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Registration',
    tableName: 'registrations',
    timestamps: false,
  }
);
