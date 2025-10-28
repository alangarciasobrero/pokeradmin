import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

export interface PaymentAttributes {
  id: number;
  user_id: number;
  amount: number; // positive = user paid into system (buy-in / cash-in), negative = refund/withdrawal
  payment_date: Date;
  source?: string | null; // 'tournament' | 'cash' | 'other'
  reference_id?: number | null; // e.g., registration id or cash_game id
  paid?: boolean; // whether payment was completed
  paid_amount?: number | null; // amount actually paid (in case of partial)
  method?: string | null;
  personal_account?: boolean | null;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'source' | 'reference_id' | 'paid' | 'paid_amount' | 'method' | 'personal_account'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public user_id!: number;
  public amount!: number;
  public payment_date!: Date;
  public source?: string | null;
  public reference_id?: number | null;
  public paid?: boolean;
  public paid_amount?: number | null;
  public method?: string | null;
  public personal_account?: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' } },
    amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    payment_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    source: { type: DataTypes.STRING(50), allowNull: true },
    reference_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    paid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    paid_amount: { type: DataTypes.DECIMAL(15,2), allowNull: true, defaultValue: 0 },
    method: { type: DataTypes.STRING(50), allowNull: true },
    personal_account: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false }
  },
  {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
    timestamps: true,
  }
);

export default Payment;
