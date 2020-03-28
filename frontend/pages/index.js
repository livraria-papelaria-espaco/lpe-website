import React, { useState } from 'react';
import Layout from '~/components/Layout';
import ProductFilterPrice from '~/components/products/ProductFilterPrice';
import ProductQuery from '~/components/products/ProductQuery';
import { useSearch } from '~/hooks/useSearch';

const priceRange = [0, 100];

const HomePage = () => {
  const [priceFilter, setPriceFilter] = useState(priceRange);
  const { delayedSearch } = useSearch();

  return (
    <Layout showStoreNav>
      <ProductFilterPrice value={priceRange} setValue={setPriceFilter} />
      <ProductQuery sort='createdAt:desc' priceRange={priceFilter} search={delayedSearch} />
    </Layout>
  );
};

export default HomePage;
