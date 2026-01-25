'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Renombrar small_blind a blind_1 para claridad
    await queryInterface.renameColumn('cash_games', 'small_blind', 'blind_1');
    
    // Agregar blind_2 y blind_3
    await queryInterface.addColumn('cash_games', 'blind_2', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'blind_1'
    });
    
    await queryInterface.addColumn('cash_games', 'blind_3', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      after: 'blind_2'
    });
    
    console.log('✅ Added blind_2 and blind_3 columns to cash_games table');
    console.log('✅ Renamed small_blind to blind_1 for clarity');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cash_games', 'blind_3');
    await queryInterface.removeColumn('cash_games', 'blind_2');
    await queryInterface.renameColumn('cash_games', 'blind_1', 'small_blind');
  }
};
