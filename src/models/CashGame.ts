import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

// Definición de los atributos de CashGame
export interface CashGameAttributes {
  id: number;
  player_id: number;
  amount: number;
  date: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Para creación, id y timestamps son opcionales
export interface CashGameCreationAttributes extends Optional<CashGameAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Modelo Sequelize para cash_games
export class CashGame extends Model<CashGameAttributes, CashGameCreationAttributes> implements CashGameAttributes {
  public id!: number;
  public player_id!: number;
  public amount!: number;
  public date!: Date;
  public description?: string;
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
    player_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Monto positivo o negativo (ganancia/pérdida)',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'cash_games',
    modelName: 'CashGame',
  }
);

export default CashGame;
