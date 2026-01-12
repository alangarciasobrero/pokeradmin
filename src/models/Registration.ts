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
  public position?: number | null;
  public action_type?: number | null; // 1=buyin,2=reentry,3=duplo
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
    // Use canonical `user_id` referencing the `users` table.
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
    position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    action_type: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: 'Registration',
    tableName: 'registrations',
    timestamps: false,
  }
);

// Define associations after model initialization
import { Tournament } from './Tournament';
import { User } from './User';

Registration.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });
Registration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
