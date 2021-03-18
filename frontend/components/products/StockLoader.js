import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';

const STOCK_STATUS_QUERY = gql`
  query STOCK_STATUS_QUERY($slug: String!) {
    productBySlug(slug: $slug) {
      stockStatus
    }
  }
`;

const StockLoader = ({ product, defaultStock, skeletonClassName, children }) => {
  const { data, loading, error } = useQuery(STOCK_STATUS_QUERY, {
    variables: { slug: product },
    skip: !!defaultStock,
  });

  if (loading) return <Skeleton className={skeletonClassName} width={80} />;

  if (error) return <Typography>Ocorreu um erro</Typography>;

  return children(((data || {}).productBySlug || {}).stockStatus || defaultStock);
};

StockLoader.propTypes = {
  product: PropTypes.string.isRequired,
  defaultStock: PropTypes.string,
  skeletonClassName: PropTypes.string,
  children: PropTypes.func.isRequired,
};

StockLoader.defaultProps = {
  defaultStock: undefined,
  skeletonClassName: undefined,
};

export default StockLoader;
