"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('restaurants', 'file_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'files',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('restaurants', 'file_id');
  },
};
