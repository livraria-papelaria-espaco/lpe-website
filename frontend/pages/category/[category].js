import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '~/components/Layout';
import ProductFilterPrice from '~/components/products/ProductFilterPrice';
import ProductQuery from '~/components/products/ProductQuery';
import { useSearch } from '~/hooks/useSearch';

const priceRange = [0, 100];

const GET_CATEGORY_FROM_SLUG = gql`
  query GET_CATEGORY_FROM_SLUG($category: String!) {
    categoryBySlug(slug: $category) {
      name
    }
  }
`;

const CategoryPage = () => {
  const [priceFilter, setPriceFilter] = useState(priceRange);
  const { delayedSearch } = useSearch();
  const router = useRouter();
  const { category } = router.query;
  const { data } = useQuery(GET_CATEGORY_FROM_SLUG, { variables: { category } });

  // TODO?
  const categoryTitle =
    (data && data.categoryBySlug && data.categoryBySlug.name) || category || 'Produtos';

  return (
    <Layout title={categoryTitle} showStoreNav>
      <ProductFilterPrice value={priceRange} setValue={setPriceFilter} />
      <ProductQuery
        sort='createdAt:desc'
        priceRange={priceFilter}
        search={delayedSearch}
        category={category}
      />
    </Layout>
  );
};

export default CategoryPage;
