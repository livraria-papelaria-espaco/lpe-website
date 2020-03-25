module.exports = {
  query: `
    calculateShipping(postalCode: String!, shippingMethod: ENUM_ORDER_SHIPPINGMETHOD!, items: JSON!): Float
  `,
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
      calculateShipping: {
        description: 'Calculate shipping costs from postal code and items',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolver: 'application::order.order.calculateShipping',
      },
    },
  },
};
