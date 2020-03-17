module.exports={
  query: `
    categoryBySlug(slug: String!): Category
  `,
  resolver:{
    Query:{
      category: false,
      categoryBySlug: {
        description: "Get category by slug",
        resolver: "application::category.category.findOne"
      }
    }
  }
}