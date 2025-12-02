import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class DealerShift extends Model {
  public id!: number;
  public cash_game_id!: number;
  public outgoing_dealer!: string;
  public incoming_dealer!: string;
  public shift_start!: Date;
  public shift_end!: Date;
  public commission!: number;
  public tips!: number;
  public recorded_by!: string | null;
  public created_at!: Date;
}

DealerShift.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cash_game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cash_games',
        key: 'id',
      },
    },
    outgoing_dealer: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    incoming_dealer: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shift_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    shift_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    tips: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    recorded_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'dealer_shifts',
    timestamps: false,
  }
);

export default DealerShift;
