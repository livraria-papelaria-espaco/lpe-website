import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import gql from 'graphql-tag';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import AboutUs from '~/components/home/AboutUs';
import Hero from '~/components/home/Hero';
import Layout from '~/components/Layout';
import Newsletter from '~/components/newsletter/Newsletter';
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
      information
      informationSeverity
    }
    globalDiscount {
      discounts {
        __typename
        ... on ComponentDiscountsProductTypeDiscount {
          percentage
          type
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  infoAlert: {
    marginTop: theme.spacing(3),
  },
}));

const HomePage = ({ newProducts, productHighlights, homePage }) => {
  const router = useRouter();
  const styles = useStyles();

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
        {homePage.information && (
          <Alert severity={homePage.informationSeverity || 'info'} className={styles.infoAlert}>
            {homePage.information}
          </Alert>
        )}
        <Newsletter/>
        {newProducts && newProducts.length > 0 && (
          <HighlightRow row={newProductsRow} />
        )}
        {productHighlights.map((highlight) => (
          <HighlightRow key={highlight.id} row={highlight} />
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
  discountPercent: PropTypes.number,
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
    information: PropTypes.string,
    informationSeverity: PropTypes.string,
  }).isRequired,
};

HomePage.defaultProps = {
  newProducts: [],
  productHighlights: [],
};

export const getStaticProps = async () => {
  const [graphql, productHighlightsRaw] = await Promise.all([
    fetchAPI(HOME_PAGE_QUERY),
    fetchREST('/product-highlights', { query: { homePage: true, _sort: 'createdAt' } }),
  ]);

  const handleProduct = (product) => ({
    ...product,
    discountPercent: Math.max(
      0,
      ...graphql.globalDiscount.discounts.map((discount) => {
        // eslint-disable-next-line no-underscore-dangle
        if (discount.__typename === 'ComponentDiscountsProductTypeDiscount')
          return discount.type === product.type ? discount.percentage : 0;
        return 0;
      })
    ),
  });

  const productHighlights = productHighlightsRaw.map((highlight) => ({
    ...highlight,
    content: (highlight.content || []).map((content) => {
      const result = { ...content };

      if (content.products) result.products = result.products.map(handleProduct);
      if (content.product) result.product = handleProduct(result.product);

      return result;
    }),
  }));

  const newProducts = graphql.newProducts.map(handleProduct);

  return {
    revalidate: 300, // 5 min
    props: { newProducts, homePage: graphql.homePage, productHighlights } || {},
  };
};

export default HomePage;
