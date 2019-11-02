module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('restaurants', 'city_address', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('restaurants', 'city_address');
  },
};
