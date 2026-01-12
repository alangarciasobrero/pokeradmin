import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../services/database';

export interface CommissionDestinationAttributes {
  id: number;
  name: string;
  type: 'house' | 'season_ranking' | 'special_tournament';
  season_id?: number | null;
  tournament_id?: number | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CommissionDestinationCreationAttributes 
  extends Optional<CommissionDestinationAttributes, 'id' | 'season_id' | 'tournament_id' | 'is_active' | 'created_at' | 'updated_at'> {}

export class CommissionDestination extends Model<CommissionDestinationAttributes, CommissionDestinationCreationAttributes> 
  implements CommissionDestinationAttributes {
  public id!: number;
  public name!: string;
  public type!: 'house' | 'season_ranking' | 'special_tournament';
  public season_id?: number | null;
  public tournament_id?: number | null;
  public is_active!: boolean;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CommissionDestination.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: { 
      type: DataTypes.ENUM('house', 'season_ranking', 'special_tournament'), 
      allowNull: false 
    },
    season_id: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: true,
      references: { model: 'seasons', key: 'id' }
    },
    tournament_id: { 
      type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: true,
      references: { model: 'tournaments', key: 'id' }
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'commission_destinations',
    modelName: 'CommissionDestination',
    timestamps: true,
    underscored: true
  }
);

// Define associations after all models are loaded
import('./Season').then((SeasonModule) => {
  const Season = SeasonModule.Season;
  CommissionDestination.belongsTo(Season, { foreignKey: 'season_id', as: 'season' });
});

import('./Tournament').then((TournamentModule) => {
  const Tournament = TournamentModule.Tournament;
  CommissionDestination.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });
});

export default CommissionDestination;
