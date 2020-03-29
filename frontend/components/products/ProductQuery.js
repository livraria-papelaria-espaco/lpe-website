import { useQuery } from '@apollo/react-hooks';
import { Alert } from '@material-ui/lab';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import ProductList from './ProductList';

const PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS($search: String, $sort: String, $priceRange: [Int], $category: String) {
    productsSearch(query: $search, sort: $sort, priceRange: $priceRange, category: $category) {
      name
      shortDescription
      images(limit: 1) {
        url
      }
      price
      reference
      slug
      stockStatus
      type
      bookInfo {
        author
      }
    }
  }
`;

const ProductQuery = ({ sort, priceRange, search, category }) => {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
    variables: { search, sort, priceRange, category },
  });
  if (loading && !data) return <ProductList loading />;
  if (error)
    return <Alert severity='error'>Erro ao carregar produtos. Tente novamente mais tarde.</Alert>;

  return <ProductList products={data.productsSearch || []} />;
};

ProductQuery.propTypes = {
  sort: PropTypes.string,
  priceRange: PropTypes.arrayOf(PropTypes.number),
  search: PropTypes.string,
  category: PropTypes.string,
};

ProductQuery.defaultProps = {
  sort: undefined,
  priceRange: undefined,
  search: undefined,
  category: undefined,
};

export default ProductQuery;
