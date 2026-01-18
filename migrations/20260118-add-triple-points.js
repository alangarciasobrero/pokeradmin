'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add triple_points column to tournaments table
    await queryInterface.addColumn('tournaments', 'triple_points', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'double_points'
    });
    
    console.log('✅ Added triple_points column to tournaments table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tournaments', 'triple_points');
  }
};
