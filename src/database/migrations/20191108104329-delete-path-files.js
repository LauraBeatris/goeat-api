module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'url', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('files', 'url');
  },
};
