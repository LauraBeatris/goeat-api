module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('foods', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('foods', 'description');
  },
};
