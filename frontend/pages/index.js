import { Container } from '@material-ui/core';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import AboutUs from '~/components/home/AboutUs';
import Hero from '~/components/home/Hero';
import Layout from '~/components/Layout';
import HighlightRow from '~/components/productsHighlight/HighlightRow';
import { fetchAPI, fetchREST } from '~/lib/graphql';

const HOME_PAGE_QUERY = gql`
  query HOME_PAGE_QUERY {
    newProducts {
      id
      slug
      reference
      name
      price
      shortDescription
      type
      bookAuthor
      images {
        url
      }
    }
    homePage {
      about
    }
  }
`;

const HomePage = ({ newProducts, productHighlights, homePage }) => {
  const router = useRouter();

  if (router.isFallback) return null;

  const newProductsRow = {
    id: 'new-products',
    title: 'Novidades',
    subtitle: 'Os nossos novos produtos!',
    content: [
      {
        __component: 'highlight.product-list',
        id: 'new-products-content',
        products: newProducts,
      },
    ],
  };

  return (
    <Layout showStoreNav homePageNavbar noContainer>
      <Head>
        <meta name='description' property='og:description' content={homePage.about} />
      </Head>
      <Hero />
      <Container fixed>
        {newProducts && newProducts.length > 0 && (
          <HighlightRow row={newProductsRow} listName='New Products Highlight' />
        )}
        {productHighlights.map((highlight) => (
          <HighlightRow key={highlight.id} row={highlight} listName='Product Highlights' />
        ))}
      </Container>
      <AboutUs text={homePage.about} />
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

HomePage.propTypes = {
  newProducts: PropTypes.arrayOf(productType),
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
  homePage: PropTypes.shape({
    about: PropTypes.string,
  }).isRequired,
};

HomePage.defaultProps = {
  newProducts: [],
  productHighlights: [],
};

export const getStaticProps = async () => {
  const [graphql, productHighlights] = await Promise.all([
    fetchAPI(HOME_PAGE_QUERY),
    fetchREST('/product-highlights', { query: { homePage: true } }),
  ]);
  return {
    unstable_revalidate: 300, // 5 min
    props: { ...graphql, productHighlights } || {},
  };
};

export default HomePage;
