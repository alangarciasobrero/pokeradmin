"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tabla: users
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      full_name: { type: Sequelize.STRING(100) },
      first_name: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "" },
      last_name: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "" },
      email: { type: Sequelize.STRING(100), defaultValue: null },
      phone_number: { type: Sequelize.STRING(20), defaultValue: null },
      nickname: { type: Sequelize.STRING(50), defaultValue: null },
      current_points: { type: Sequelize.INTEGER, defaultValue: 0 },
      suspended: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      avatar: { type: Sequelize.STRING(255), defaultValue: null },
      role: { type: Sequelize.ENUM("admin", "user"), allowNull: false, defaultValue: "user" },
      is_player: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: players (legacy)
    await queryInterface.createTable("players", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      first_name: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "" },
      last_name: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "" },
      email: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "" },
      phone_number: { type: Sequelize.STRING(20), defaultValue: null },
      nickname: { type: Sequelize.STRING(50), defaultValue: null },
      current_points: { type: Sequelize.INTEGER, defaultValue: 0 },
      suspended: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });

    // Tabla: seasons
    await queryInterface.createTable("seasons", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(50), allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      fecha_inicio: { type: Sequelize.DATEONLY, allowNull: false },
      fecha_fin: { type: Sequelize.DATEONLY, allowNull: false },
      torneos_totales: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      torneos_jugados: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      estado: { type: Sequelize.ENUM("planificada", "activa", "finalizada"), allowNull: false, defaultValue: "planificada" },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: tournaments
    await queryInterface.createTable("tournaments", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      tournament_name: { type: Sequelize.STRING(100), allowNull: false },
      start_date: { type: Sequelize.DATE, allowNull: false },
      gaming_date: { type: Sequelize.DATEONLY, defaultValue: null },
      buy_in: { type: Sequelize.DECIMAL(15,2), allowNull: false },
      re_entry: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      knockout_bounty: { type: Sequelize.DECIMAL(15,2), allowNull: false, defaultValue: 0 },
      starting_stack: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1000 },
      count_to_ranking: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      double_points: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      blind_levels: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10 },
      small_blind: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10 },
      punctuality_discount: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      punctuality_bonus_chips: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      registration_open: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      end_date: { type: Sequelize.DATE, defaultValue: null },
      pinned: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      season_id: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null, references: { model: "seasons", key: "id" } }
    });

    // Tabla: registrations
    await queryInterface.createTable("registrations", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "users", key: "id" } },
      tournament_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "tournaments", key: "id" } },
      registration_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      punctuality: { type: Sequelize.BOOLEAN, allowNull: false },
      position: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null },
      action_type: { type: Sequelize.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 }
    });

    // Tabla: results
    await queryInterface.createTable("results", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      tournament_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "tournaments", key: "id" } },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "users", key: "id" } },
      position: { type: Sequelize.INTEGER, allowNull: false },
      final_table: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    });

    // Tabla: payments
    await queryInterface.createTable("payments", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "users", key: "id" } },
      amount: { type: Sequelize.DECIMAL(15,2), allowNull: false },
      payment_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      gaming_date: { type: Sequelize.DATEONLY, defaultValue: null },
      source: { type: Sequelize.STRING(50), defaultValue: null },
      reference_id: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null },
      paid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      paid_amount: { type: Sequelize.DECIMAL(15,2), defaultValue: 0 },
      method: { type: Sequelize.STRING(50), defaultValue: null },
      personal_account: { type: Sequelize.BOOLEAN, defaultValue: false },
      recorded_by_name: { type: Sequelize.STRING(150), defaultValue: null },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: cash_games
    await queryInterface.createTable("cash_games", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      small_blind: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      start_datetime: { type: Sequelize.DATE, allowNull: false },
      gaming_date: { type: Sequelize.DATEONLY, defaultValue: null },
      end_datetime: { type: Sequelize.DATE, defaultValue: null },
      default_buyin: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      total_commission: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      dealer: { type: Sequelize.STRING(100), defaultValue: null },
      total_tips: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: cash_participants
    await queryInterface.createTable("cash_participants", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      cash_game_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "cash_games", key: "id" } },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "users", key: "id" } },
      seat_number: { type: Sequelize.INTEGER, defaultValue: null },
      joined_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      left_at: { type: Sequelize.DATE, defaultValue: null }
    });

    // Tabla: dealer_shifts
    await queryInterface.createTable("dealer_shifts", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cash_game_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "cash_games", key: "id" } },
      outgoing_dealer: { type: Sequelize.STRING(100), allowNull: false },
      incoming_dealer: { type: Sequelize.STRING(100), allowNull: false },
      shift_start: { type: Sequelize.DATE, allowNull: false },
      shift_end: { type: Sequelize.DATE, allowNull: false },
      commission: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      tips: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      recorded_by: { type: Sequelize.STRING(50), defaultValue: null },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });

    // Tabla: tournament_points
    await queryInterface.createTable("tournament_points", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      tournament_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false },
      points: { type: Sequelize.INTEGER, allowNull: false }
    });

    // Tabla: historical_points
    await queryInterface.createTable("historical_points", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      record_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      season_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      tournament_id: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null },
      result_id: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null },
      action_type: { type: Sequelize.ENUM("attendance", "reentry", "final_table", "placement", "bonus"), allowNull: false },
      description: { type: Sequelize.STRING(255), defaultValue: null },
      points: { type: Sequelize.INTEGER, allowNull: false }
    });

    // Tabla: ranking_history
    await queryInterface.createTable("ranking_history", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      season_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      posicion: { type: Sequelize.INTEGER, allowNull: false },
      puntos_acumulados: { type: Sequelize.INTEGER, allowNull: false },
      torneos_jugados: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
    });

    // Tabla: settings
    await queryInterface.createTable("settings", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      key: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      value: { type: Sequelize.TEXT, allowNull: false },
      description: { type: Sequelize.STRING(255), defaultValue: null },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: commission_destinations
    await queryInterface.createTable("commission_destinations", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.ENUM("house", "season_ranking", "special_tournament"), allowNull: false },
      season_id: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null, references: { model: "seasons", key: "id" } },
      tournament_id: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: null, references: { model: "tournaments", key: "id" } },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: commission_config
    await queryInterface.createTable("commission_config", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      destination_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "commission_destinations", key: "id" } },
      percentage: { type: Sequelize.DECIMAL(5,2), allowNull: false },
      priority: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Tabla: accumulated_commissions
    await queryInterface.createTable("accumulated_commissions", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      destination_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "commission_destinations", key: "id" } },
      tournament_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: "tournaments", key: "id" } },
      amount: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      percentage_applied: { type: Sequelize.DECIMAL(5,2), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });

    // Tabla: commission_pools
    await queryInterface.createTable("commission_pools", {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      pool_type: { type: Sequelize.ENUM("monthly", "quarterly", "copa_don_humberto", "house"), allowNull: false },
      period_identifier: { type: Sequelize.STRING(50), allowNull: false },
      accumulated_amount: { type: Sequelize.DECIMAL(15,2), allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM("active", "closed", "paid"), allowNull: false, defaultValue: "active" },
      closed_at: { type: Sequelize.DATE, defaultValue: null },
      paid_at: { type: Sequelize.DATE, defaultValue: null },
      notes: { type: Sequelize.TEXT, defaultValue: null },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") }
    });

    // Índices recomendados
    await queryInterface.addIndex("users", ["username"], { name: "idx_users_username" });
    await queryInterface.addIndex("users", ["role"], { name: "idx_users_role" });
    await queryInterface.addIndex("users", ["is_player"], { name: "idx_users_is_player" });
    await queryInterface.addIndex("tournaments", ["season_id"], { name: "idx_tournaments_season" });
    await queryInterface.addIndex("tournaments", ["gaming_date"], { name: "idx_tournaments_gaming_date" });
    await queryInterface.addIndex("tournaments", ["start_date"], { name: "idx_tournaments_start_date" });
    await queryInterface.addIndex("registrations", ["user_id"], { name: "idx_registrations_user" });
    await queryInterface.addIndex("registrations", ["tournament_id"], { name: "idx_registrations_tournament" });
    await queryInterface.addIndex("results", ["tournament_id"], { name: "idx_results_tournament" });
    await queryInterface.addIndex("results", ["user_id"], { name: "idx_results_user" });
    await queryInterface.addIndex("payments", ["user_id"], { name: "idx_payments_user" });
    await queryInterface.addIndex("payments", ["gaming_date"], { name: "idx_payments_gaming_date" });
    await queryInterface.addIndex("payments", ["source"], { name: "idx_payments_source" });
    await queryInterface.addIndex("cash_participants", ["cash_game_id"], { name: "idx_cash_participants_game" });
    await queryInterface.addIndex("cash_participants", ["user_id"], { name: "idx_cash_participants_user" });
    await queryInterface.addIndex("historical_points", ["user_id"], { name: "idx_historical_points_user" });
    await queryInterface.addIndex("historical_points", ["season_id"], { name: "idx_historical_points_season" });
    await queryInterface.addIndex("historical_points", ["tournament_id"], { name: "idx_historical_points_tournament" });
    await queryInterface.addIndex("ranking_history", ["season_id"], { name: "idx_ranking_history_season" });
    await queryInterface.addIndex("ranking_history", ["user_id"], { name: "idx_ranking_history_user" });
    await queryInterface.addIndex("ranking_history", ["fecha"], { name: "idx_ranking_history_fecha" });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("accumulated_commissions");
    await queryInterface.dropTable("commission_config");
    await queryInterface.dropTable("commission_destinations");
    await queryInterface.dropTable("commission_pools");
    await queryInterface.dropTable("settings");
    await queryInterface.dropTable("ranking_history");
    await queryInterface.dropTable("historical_points");
    await queryInterface.dropTable("tournament_points");
    await queryInterface.dropTable("dealer_shifts");
    await queryInterface.dropTable("cash_participants");
    await queryInterface.dropTable("cash_games");
    await queryInterface.dropTable("payments");
    await queryInterface.dropTable("results");
    await queryInterface.dropTable("registrations");
    await queryInterface.dropTable("tournaments");
    await queryInterface.dropTable("seasons");
    await queryInterface.dropTable("players");
    await queryInterface.dropTable("users");
  }
};
