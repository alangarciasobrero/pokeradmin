import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class Player extends Model {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone_number?: string | null;
  public nickname?: string | null;
  public current_points?: number | null;
  public suspended?: boolean;
  public is_deleted?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Player.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
    last_name: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
    email: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
    phone_number: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
    nickname: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    current_points: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    suspended: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    tableName: 'players',
    modelName: 'Player',
    timestamps: false
  }
);

export default Player;
