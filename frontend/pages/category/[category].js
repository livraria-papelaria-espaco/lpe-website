import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '~/components/Layout';
import FilterToolbar from '~/components/products/filters/FilterToolbar';
import ProductQuery from '~/components/products/ProductQuery';
import { useProductFilters } from '~/hooks/useProductFilters';

const GET_CATEGORY_FROM_SLUG = gql`
  query GET_CATEGORY_FROM_SLUG($category: String!) {
    categoryBySlug(slug: $category) {
      name
    }
  }
`;

const CategoryPage = () => {
  const { delayedSearch, priceRange, sort } = useProductFilters();
  const router = useRouter();
  const { category } = router.query;
  const { data } = useQuery(GET_CATEGORY_FROM_SLUG, { variables: { category } });

  // TODO?
  const categoryTitle =
    (data && data.categoryBySlug && data.categoryBySlug.name) || category || 'Produtos';

  return (
    <Layout title={categoryTitle} showStoreNav>
      <FilterToolbar />
      <ProductQuery
        priceRange={priceRange}
        search={delayedSearch}
        sort={sort}
        category={category}
      />
    </Layout>
  );
};

export default CategoryPage;
