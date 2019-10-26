module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('providers', 'restaurants_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'restaurants',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('providers', 'restaurants_id');
  },
};
