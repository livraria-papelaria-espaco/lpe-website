import { useQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '~/components/Layout';
import CategoryList from '~/components/products/CategoryList';
import ProductQuery from '~/components/products/ProductQuery';
import ProductFilterPrice from '~/components/products/ProductFilterPrice';

const priceRange = [0, 100];

const CategoryPage = () => {
  const [priceFilter, setPriceFilter] = useState(priceRange);
  const router = useRouter();
  const { category } = router.query;
  const { data } = useQuery(GET_CATEGORY_FROM_SLUG, { variables: { category } });

  // TODO?
  const categoryTitle =
    (data && data.categoryBySlug && data.categoryBySlug.name) || category || 'Produtos';

  return (
    <Layout title={categoryTitle}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <CategoryList />
          <ProductFilterPrice value={priceRange} setValue={setPriceFilter} />
        </Grid>
        <Grid item xs={12} md={9}>
          <ProductQuery
            where={{
              category: { slug: category },
              price_gte: priceFilter[0],
              price_lte: priceFilter[1],
            }}
            sort='createdAt:desc'
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

const GET_CATEGORY_FROM_SLUG = gql`
  query GET_CATEGORY_FROM_SLUG($category: String!) {
    categoryBySlug(slug: $category) {
      name
    }
  }
`;

export default CategoryPage;
