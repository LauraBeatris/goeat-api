module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('restaurants', 'provider_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'providers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('restaurants', 'provider_id');
  },
};
