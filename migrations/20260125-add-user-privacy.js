'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_private', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si es true, otros players no pueden ver sus estadísticas'
    });
    console.log('✅ Added is_private column to users table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'is_private');
  }
};
