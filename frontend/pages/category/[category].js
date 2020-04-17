import { useQuery } from '@apollo/react-hooks';
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
import { fetchAPI } from '~/lib/graphql';

const GET_CATEGORY_FROM_SLUG = gql`
  query GET_CATEGORY_FROM_SLUG($category: String!) {
    categoryBySlug(slug: $category) {
      name
      productHighlights {
        id
        title
        subtitle
        products {
          id
          slug
          reference
          name
          price
          shortDescription
          type
          bookInfo {
            author
          }
          images {
            url
          }
        }
      }
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
  const { data } = useQuery(GET_CATEGORY_FROM_SLUG, { variables: { category } });

  const categoryTitle = (data && data.categoryBySlug && data.categoryBySlug.name) || name;

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

CategoryPage.propTypes = {
  name: PropTypes.string,
  productHighlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // MongoDB ID
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      products: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired, // MongoDB ID
          slug: PropTypes.string.isRequired,
          reference: PropTypes.string,
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          shortDescription: PropTypes.string,
          type: PropTypes.oneOf(['Livro', 'Outro']).isRequired,
          bookInfo: PropTypes.shape({
            author: PropTypes.string,
          }),
          images: PropTypes.arrayOf(
            PropTypes.shape({
              url: PropTypes.string,
            })
          ),
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
  return {
    props: (data && data.categoryBySlug) || {},
  };
};

export default CategoryPage;
