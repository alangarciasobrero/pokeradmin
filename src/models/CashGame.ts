import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

// Definición de los atributos de CashGame según la tabla real
export interface CashGameAttributes {
  id: number;
  small_blind: number;
  start_datetime: Date;
  end_datetime?: Date | null;
  default_buyin?: number;
  total_commission?: number;
  dealer?: string | null;
  total_tips?: number;
}

export interface CashGameCreationAttributes extends Optional<CashGameAttributes, 'id' | 'end_datetime' | 'default_buyin' | 'total_commission' | 'dealer' | 'total_tips'> {}

export class CashGame extends Model<CashGameAttributes, CashGameCreationAttributes> implements CashGameAttributes {
  public id!: number;
  public small_blind!: number;
  public start_datetime!: Date;
  public end_datetime?: Date | null;
  public default_buyin?: number;
  public total_commission?: number;
  public dealer?: string | null;
  public total_tips?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CashGame.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    small_blind: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    start_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    default_buyin: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0,
    },
    total_commission: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0,
    },
    dealer: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    total_tips: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'cash_games',
    modelName: 'CashGame',
    timestamps: false,
  }
);

export default CashGame;
