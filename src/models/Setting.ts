import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/database';

/**
 * Modelo para almacenar configuración global del sistema
 * Incluye configuración de comisiones, pozos acumulados, y otras settings
 */
export class Setting extends Model {
  public id!: number;
  public key!: string;
  public value!: string;
  public description?: string;
  public updated_at!: Date;
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'settings',
    modelName: 'Setting',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: false,
  }
);

export default Setting;
