module.exports = {
  up: queryInterface => {
    return queryInterface.renameTable('appointments', 'orders');
  },

  down: queryInterface => {
    return queryInterface.renameTable('orders', 'appointments');
  },
};
