import React from 'react';
import FilterToolbar from '~/components/products/filters/FilterToolbar';
import Layout from '~/components/Layout';
import ProductQuery from '~/components/products/ProductQuery';
import { useProductFilters } from '~/hooks/useProductFilters';

const HomePage = () => {
  const { delayedSearch, priceRange, sort } = useProductFilters();

  return (
    <Layout showStoreNav>
      <FilterToolbar />
      <ProductQuery priceRange={priceRange} search={delayedSearch} sort={sort} />
    </Layout>
  );
};

export default HomePage;
