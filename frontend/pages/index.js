import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import Hero from '~/components/home/Hero';
import Layout from '~/components/Layout';
import { fetchAPI } from '~/lib/graphql';
import HighlightRow from './productsHighlight/HighlightRow';

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
  }
`;

const HomePage = ({ productHighlights }) => {
  const router = useRouter();

  if (router.isFallback) return null;

  return (
    <Layout showStoreNav outsideContainer={<Hero />}>
      {productHighlights.map((highlight) => (
        <HighlightRow key={highlight.id} row={highlight} />
      ))}
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
};

HomePage.defaultProps = {
  productHighlights: {},
};

export const getStaticProps = async () => {
  const data = await fetchAPI(HOME_PAGE_QUERY);
  return {
    props: {
      productHighlights: data.productHighlights,
    },
  };
};

export default HomePage;
