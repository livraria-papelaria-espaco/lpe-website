import { Grid } from '@material-ui/core';
import React from 'react';
import Layout from '~/components/Layout';
import CategoryList from '~/components/products/CategoryList';
import ProductQuery from '~/components/products/ProductQuery';

const HomePage = () => (
  <Layout title='Home'>
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <CategoryList />
      </Grid>
      <Grid item xs={12} md={9}>
        <ProductQuery sort='createdAt:desc' />
      </Grid>
    </Grid>
  </Layout>
);

export default HomePage;
