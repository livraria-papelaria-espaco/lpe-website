import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const ProductList = ({ products, loading }) => {
  if (loading)
    return (
      <Grid container direction='row' justify='flex-start' alignItems='center' spacing={3}>
        {[...Array(3)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid item xs={6} md={4} lg={3} key={i}>
            <ProductSkeleton />
          </Grid>
        ))}
      </Grid>
    );

  if (products.length === 0)
    return <p>Não foram encontrados produtos. Experimente remover alguns filtros.</p>;

  return (
    <Grid container direction='row' justify='flex-start' alignItems='stretch' spacing={3}>
      {products.map((res) => (
        <Grid item xs={6} md={4} lg={3} key={res.slug}>
          <ProductCard product={res} />
        </Grid>
      ))}
    </Grid>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
};

ProductList.defaultProps = {
  loading: false,
};

export default ProductList;
