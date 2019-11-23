module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('deliveries', 'menu');
  },

  down: () => {},
};
