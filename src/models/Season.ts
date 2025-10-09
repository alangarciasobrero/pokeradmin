import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

export interface SeasonAttributes {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  torneos_totales: number;
  torneos_jugados: number;
  estado: 'planificada' | 'activa' | 'finalizada';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeasonCreationAttributes extends Optional<SeasonAttributes, 'id' | 'descripcion' | 'torneos_totales' | 'torneos_jugados' | 'createdAt' | 'updatedAt'> {}

export class Season extends Model<SeasonAttributes, SeasonCreationAttributes> implements SeasonAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion?: string;
  public fecha_inicio!: Date;
  public fecha_fin!: Date;
  public torneos_totales!: number;
  public torneos_jugados!: number;
  public estado!: 'planificada' | 'activa' | 'finalizada';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Season.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    torneos_totales: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    torneos_jugados: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM('planificada', 'activa', 'finalizada'),
      allowNull: false,
      defaultValue: 'planificada',
    },
  },
  {
    sequelize,
    tableName: 'seasons',
    modelName: 'Season',
  }
);

export default Season;
