module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('files', 'url');
  },
};
