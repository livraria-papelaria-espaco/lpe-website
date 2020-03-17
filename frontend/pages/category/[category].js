import { useQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '~/components/Layout';
import CategoryList from '~/components/products/CategoryList';
import ProductQuery from '~/components/products/ProductQuery';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const { data, loading, error } = useQuery(GET_CATEGORY_FROM_SLUG, { variables: { category } });

  // TODO?
  const categoryTitle =
    (data && data.categoryBySlug && data.categoryBySlug.name) || category || 'Produtos';

  return (
    <Layout title={categoryTitle}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <CategoryList />
        </Grid>
        <Grid item xs={12} md={9}>
          <ProductQuery where={{ category: { slug: category } }} sort='createdAt:desc' />
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
