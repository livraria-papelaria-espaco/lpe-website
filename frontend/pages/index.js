import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import Layout from '~/components/Layout';
import CategoryList from '~/components/products/CategoryList';
import ProductFilterPrice from '~/components/products/ProductFilterPrice';
import ProductQuery from '~/components/products/ProductQuery';
import SearchBar from '~/components/products/SearchBar';

const priceRange = [0, 100];

const HomePage = () => {
  const [priceFilter, setPriceFilter] = useState(priceRange);
  const [search, setSearch] = useState('');

  return (
    <Layout title='Home'>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <SearchBar setValue={setSearch} />
          <CategoryList />
          <ProductFilterPrice value={priceRange} setValue={setPriceFilter} />
        </Grid>
        <Grid item xs={12} md={9}>
          <ProductQuery sort='createdAt:desc' priceRange={priceFilter} search={search} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;
