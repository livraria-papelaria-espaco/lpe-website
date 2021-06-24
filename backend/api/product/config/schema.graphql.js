module.exports = {
  query: `
    productBySlug(slug: String!): Product
    productsSearch(query: String, limit: Int, start: Int, category: String): [Product]
    newProducts: [Product]
  `,
  resolver: {
    Query: {
      productBySlug: {
        description: 'Get product by slug',
        resolver: 'application::product.product.findOneSlug',
        resolverOf: 'application::product.product.findOne',
      },
      products: false,
      productsSearch: {
        description: 'Search products',
        resolver: 'application::product.product.searchEnhanced',
      },
      newProducts: {
        description: 'Get new products in the store',
        resolver: 'application::product.product.newProducts',
        resolverOf: 'application::product.product.searchEnhanced',
      },
    },
  },
};
