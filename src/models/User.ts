import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

export class User extends Model {
  public id!: number;
  public username!: string;
  public password_hash!: string;
  public full_name?: string;
  public first_name?: string;
  public last_name?: string;
  public email?: string;
  public phone_number?: string;
  public nickname?: string;
  public current_points?: number;
  public suspended?: boolean;
  public is_deleted?: boolean;
  // Nuevo campo para indicar que el usuario tiene perfil jugador
  public is_player!: boolean;
  public role!: 'admin' | 'user';
  public avatar?: string; // URL o path del avatar
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    current_points: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      comment: 'URL o path del avatar',
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
    is_player: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
