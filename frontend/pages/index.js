import { Container } from '@material-ui/core';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import AboutUs from '~/components/home/AboutUs';
import Hero from '~/components/home/Hero';
import Layout from '~/components/Layout';
import HighlightRow from '~/components/productsHighlight/HighlightRow';
import { fetchAPI } from '~/lib/graphql';

const HOME_PAGE_QUERY = gql`
  query HOME_PAGE_QUERY {
    productHighlights(where: { homePage: true }) {
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
    homePage {
      about
    }
  }
`;

const HomePage = ({ productHighlights, homePage }) => {
  const router = useRouter();

  if (router.isFallback) return null;

  return (
    <Layout showStoreNav hideFooter homePageNavbar noContainer>
      <Hero />
      <Container fixed>
        {productHighlights.map((highlight) => (
          <HighlightRow key={highlight.id} row={highlight} />
        ))}
      </Container>
      <AboutUs text={homePage.about} />
    </Layout>
  );
};

HomePage.propTypes = {
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
  homePage: PropTypes.shape({
    about: PropTypes.string,
  }).isRequired,
};

HomePage.defaultProps = {
  productHighlights: {},
};

export const getStaticProps = async () => {
  const data = await fetchAPI(HOME_PAGE_QUERY);
  return {
    props: {
      productHighlights: data.productHighlights,
      homePage: data.homePage,
    },
  };
};

export default HomePage;
