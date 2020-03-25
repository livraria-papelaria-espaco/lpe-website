module.exports = {
  query: `
    productBySlug(slug: String!): Product
    productsSearch(query: String, sort: String, limit: Int, start: Int, category: String, priceRange: [Int]): [Product]
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
    },
  },
};
