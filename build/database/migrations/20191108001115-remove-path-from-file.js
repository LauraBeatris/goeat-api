"use strict";module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('files', 'path');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'path', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
