import { Grid } from '@material-ui/core';
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  if (products.length === 0)
    return <p>Não foram encontrados produtos. Experimente remover alguns filtros.</p>;

  return (
    <Grid container direction='row' justify='center' alignItems='center' spacing={3}>
      {products.map((res) => (
        <Grid item xs={6} md={4} lg={3} key={res.slug}>
          <ProductCard product={res} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
