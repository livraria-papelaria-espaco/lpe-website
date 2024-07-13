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
      disableEuPago
    }
  }
`;

const CheckoutPage = ({ blockOrders, disableEuPago }) => {
  useAuth({ secure: true });

  return (
    <Layout title='Checkout'>
      <Container maxWidth='md'>{blockOrders ? <StoreClosed /> : <CheckoutStepper disableEuPago={disableEuPago} />}</Container>
    </Layout>
  );
};

CheckoutPage.propTypes = {
  blockOrders: PropTypes.bool,
  disableEuPago: PropTypes.bool,
};

CheckoutPage.defaultProps = {
  blockOrders: false,
  disableEuPago: false,
};

export const getStaticProps = async () => {
  const graphql = await fetchAPI(STORE_SETTINGS_QUERY);

  return {
    revalidate: 10, // 10 seconds
    props: {
      blockOrders: graphql.storeConfig.blockOrders,
      disableEuPago: graphql.storeConfig.disableEuPago,
    } || {},
  };
};

export default CheckoutPage;
