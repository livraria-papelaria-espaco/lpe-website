import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '~/components/Layout';
import FilterToolbar from '~/components/products/filters/FilterToolbar';
import ProductQuery from '~/components/products/ProductQuery';
import { useProductFilters } from '~/hooks/useProductFilters';
import { fetchAPI } from '~/lib/graphql';

const GET_CATEGORY_FROM_SLUG = gql`
  query GET_CATEGORY_FROM_SLUG($category: String!) {
    categoryBySlug(slug: $category) {
      name
    }
  }
`;

const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      slug
    }
  }
`;

const CategoryPage = ({ categoryName }) => {
  const { delayedSearch, priceRange, sort } = useProductFilters();
  const router = useRouter();
  const { category } = router.query;
  const { data } = useQuery(GET_CATEGORY_FROM_SLUG, { variables: { category } });

  const categoryTitle = (data && data.categoryBySlug && data.categoryBySlug.name) || categoryName;

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

CategoryPage.propTypes = {
  categoryName: PropTypes.string,
};

CategoryPage.defaultProps = {
  categoryName: undefined,
};

export const getStaticPaths = async () => {
  const data = await fetchAPI(GET_CATEGORIES);
  const paths = (data.categories || []).map((v) => ({ params: { category: v.slug } }));
  return { paths, fallback: true };
};

export const getStaticProps = async (context) => {
  const data = await fetchAPI(GET_CATEGORY_FROM_SLUG, {
    variables: { category: context.params.category },
  });
  return {
    props: { categoryName: (data && data.categoryBySlug && data.categoryBySlug.name) || null },
  };
};

export default CategoryPage;
