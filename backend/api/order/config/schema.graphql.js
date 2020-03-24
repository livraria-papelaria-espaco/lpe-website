module.exports = {
  resolver: {
    Query: {
      order: {
        description: 'Return an order',
        policies: ['plugins::users-permissions.isAuthenticated', 'isOrderOwner'],
      },
      orders: {
        description: 'Return a list of orders',
        policies: ['plugins::users-permissions.isAuthenticated'],
      },
    },
  },
};
