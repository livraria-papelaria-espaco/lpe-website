module.exports = {
  query: `
    calculateShipping(postalCode: String!, shippingMethod: ENUM_ORDER_SHIPPINGMETHOD!, items: JSON!): Float
    ordersCount: Int!
    ownOrders(sort: String, limit: Int, start: Int, where: JSON): [Order]
  `,
  resolver: {
    Query: {
      ordersCount: {
        description: 'Count orders for a user',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolver: 'application::order.order.count',
      },
      order: {
        description: 'Return an order',
        policies: ['plugins::users-permissions.isAuthenticated', 'isOrderOwner'],
      },
      orders: false,
      ownOrders: {
        description: 'Return a list of orders',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolver: 'application::order.order.findOwn',
      },
      calculateShipping: {
        description: 'Calculate shipping costs from postal code and items',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolver: 'application::order.order.calculateShipping',
      },
    },
  },
};
