"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'file_id', {
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
    return queryInterface.removeColumn('users', 'file_id');
  },
};
