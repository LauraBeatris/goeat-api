module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'delivered_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'delivered_at');
  },
};
