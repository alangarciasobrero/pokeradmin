import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';
import User from './User';

export interface CashParticipantAttributes {
  id: number;
  cash_game_id: number;
  user_id: number;
  seat_number?: number | null;
  joined_at: Date;
  left_at?: Date | null;
}

export interface CashParticipantCreationAttributes extends Optional<CashParticipantAttributes, 'id' | 'seat_number' | 'left_at'> {}

export class CashParticipant extends Model<CashParticipantAttributes, CashParticipantCreationAttributes> implements CashParticipantAttributes {
  public id!: number;
  public cash_game_id!: number;
  public user_id!: number;
  public seat_number?: number | null;
  public joined_at!: Date;
  public left_at?: Date | null;
}

CashParticipant.init(
  {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  cash_game_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: 'cash_games', key: 'id' } },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' } },
    seat_number: { type: DataTypes.INTEGER, allowNull: true },
    joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    left_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
  },
  {
    sequelize,
    tableName: 'cash_participants',
    modelName: 'CashParticipant',
    timestamps: false
  }
);

// Associations
CashParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default CashParticipant;
