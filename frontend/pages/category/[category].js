import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '~/components/Layout';
import FilterToolbar from '~/components/products/filters/FilterToolbar';
import ProductQuery from '~/components/products/ProductQuery';
import HighlightRow from '~/components/productsHighlight/HighlightRow';
import { useProductFilters } from '~/hooks/useProductFilters';
import { fetchAPI, fetchREST } from '~/lib/graphql';

const GET_CATEGORY_FROM_SLUG = gql`
  query GET_CATEGORY_FROM_SLUG($category: String!) {
    categoryBySlug(slug: $category) {
      id
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

const CategoryPage = ({ name, productHighlights }) => {
  const { delayedSearch, priceRange, sort } = useProductFilters();
  const router = useRouter();
  const { category } = router.query;

  const categoryTitle = name || category;

  return (
    <Layout title={categoryTitle} showStoreNav>
      <Typography variant='h2' component='h1'>
        {categoryTitle}
      </Typography>
      {productHighlights.map((highlight) => (
        <HighlightRow key={highlight.id} row={highlight} listName='Category Product Highlights' />
      ))}
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

const productType = PropTypes.shape({
  id: PropTypes.string.isRequired, // MongoDB ID
  slug: PropTypes.string.isRequired,
  reference: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  shortDescription: PropTypes.string,
  type: PropTypes.oneOf(['Livro', 'Outro']).isRequired,
  bookAuthor: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    })
  ),
});

CategoryPage.propTypes = {
  name: PropTypes.string,
  productHighlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // MongoDB ID
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      content: PropTypes.arrayOf(
        PropTypes.shape({
          __component: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired, // MongoDB ID
          title: PropTypes.string,
          products: PropTypes.arrayOf(productType),
          product: productType,
          description: PropTypes.string,
          badgeNumber: PropTypes.number,
          startAt: PropTypes.number,
        })
      ),
    })
  ),
};

CategoryPage.defaultProps = {
  name: undefined,
  productHighlights: [],
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
  const categoryBySlug = data && data.categoryBySlug;
  if (!categoryBySlug) return { props: {} };
  const productHighlights = await fetchREST('/product-highlights', {
    query: { category: categoryBySlug.id },
  });
  return {
    props: { ...categoryBySlug, productHighlights },
  };
};

export default CategoryPage;
