import { useQuery } from '@apollo/client';
import { Alert } from '@material-ui/lab';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Fade, LinearProgress } from '@material-ui/core';
import LoadMore from './LoadMore';
import ProductList from './ProductList';

const PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS(
    $search: String
    $sort: String
    $priceRange: [Int]
    $category: String
    $limit: Int
    $start: Int
  ) {
    productsSearch(
      query: $search
      sort: $sort
      priceRange: $priceRange
      category: $category
      limit: $limit
      start: $start
    ) {
      id
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
      bookAuthor
    }
    globalDiscount {
      discounts {
        __typename
        ... on ComponentDiscountsProductTypeDiscount {
          percentage
          type
        }
      }
    }
  }
`;

const limit = 24;

const getListName = (search, category) => {
  if (category) return 'Category Listing';
  if (search) return 'Product Search';
  return 'General Product Listing';
};

const ProductQuery = ({ sort, priceRange, search, category }) => {
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: { search, sort, priceRange, category, limit, start: 0 },
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) return <ProductList loading />;
  if (error)
    return <Alert severity='error'>Erro ao carregar produtos. Tente novamente mais tarde.</Alert>;

  const loadMore = () =>
    fetchMore({
      variables: {
        start: data.productsSearch.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.productsSearch.length === 0) setHasMoreToLoad(false);
        return {
          ...prev,
          productsSearch: [...prev.productsSearch, ...fetchMoreResult.productsSearch],
        };
      },
    });

  const handleProduct = (product) => ({
    ...product,
    discountPercent: Math.max(
      0,
      ...data.globalDiscount.discounts.map((discount) => {
        // eslint-disable-next-line no-underscore-dangle
        if (discount.__typename === 'ComponentDiscountsProductTypeDiscount')
          return discount.type === product.type ? discount.percentage : 0;
        return 0;
      })
    ),
  });

  const products = (data.productsSearch || []).map(handleProduct);

  return (
    <>
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? '200ms' : '0ms',
        }}
      >
        <LinearProgress variant='query' />
      </Fade>
      <ProductList products={products || []} listName={getListName(search, category)} />
      <LoadMore
        onClick={loadMore}
        hide={data.productsSearch.length % limit !== 0 || !hasMoreToLoad}
        loading={loading}
      />
    </>
  );
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
