import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import ProductList from './ProductList';

const ProductQuery = ({ sort, priceRange, search, category }) => {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
    variables: { search, sort, priceRange, category },
  });
  if (loading && !data) return <h1>Loading</h1>;
  if (error) return <p>Error loading products</p>;

  return <ProductList products={data.productsSearch || []} />;
};

const PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS($search: String, $sort: String, $priceRange: [Int], $category: String) {
    productsSearch(query: $search, sort: $sort, priceRange: $priceRange, category: $category) {
      name
      short_description
      images(limit: 1) {
        url
      }
      price
      reference
      slug
      stock_status
    }
  }
`;

export default ProductQuery;
