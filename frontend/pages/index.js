import { Container } from '@material-ui/core';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import { Alert, AlertTitle } from '@material-ui/lab';
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
        <div style={{ marginTop: 16 }}>
          <Alert severity='info'>
            <AlertTitle>Promoção</AlertTitle>
            De 7 a 17 de julho, todas as encomendas de livros feitas no nosso site têm 15% de
            desconto. E nem precisa de usar máscara para entrar...
          </Alert>
        </div>
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
  }).isRequired,
};

HomePage.defaultProps = {
  newProducts: [],
  productHighlights: [],
};

export const getStaticProps = async () => {
  const [graphql, productHighlightsRaw] = await Promise.all([
    fetchAPI(HOME_PAGE_QUERY),
    fetchREST('/product-highlights', { query: { homePage: true } }),
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
    unstable_revalidate: 300, // 5 min
    props: { newProducts, homePage: graphql.homePage, productHighlights } || {},
  };
};

export default HomePage;
