import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import ProductList from './ProductList';

const ProductQuery = ({ where, sort }) => {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY, { variables: { where, sort } });
  if (loading && !data) return <h1>Loading</h1>;
  if (error) return <p>Error loading products</p>;

  return <ProductList products={data.products || []} />;
};

const PRODUCTS_QUERY = gql`
  query GET_PRODUCTS($where: JSON, $sort: String) {
    products(where: $where, sort: $sort) {
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
