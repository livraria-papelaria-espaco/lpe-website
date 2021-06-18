import { Container } from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import PropTypes from 'prop-types';
import CheckoutStepper from '~/components/checkout/CheckoutStepper';
import StoreClosed from '~/components/checkout/StoreClosed';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';
import { fetchAPI } from '~/lib/graphql';

const STORE_SETTINGS_QUERY = gql`
  query {
    storeConfig {
      blockOrders
    }
  }
`;

const CheckoutPage = ({ blockOrders }) => {
  useAuth({ secure: true });

  return (
    <Layout title='Checkout'>
      <Container maxWidth='md'>{blockOrders ? <StoreClosed /> : <CheckoutStepper />}</Container>
    </Layout>
  );
};

CheckoutPage.propTypes = {
  blockOrders: PropTypes.bool,
};

CheckoutPage.defaultProps = {
  blockOrders: false,
};

export const getStaticProps = async () => {
  const graphql = await fetchAPI(STORE_SETTINGS_QUERY);

  return {
    revalidate: 10, // 10 seconds
    props: { blockOrders: graphql.storeConfig.blockOrders } || {},
  };
};

export default CheckoutPage;
