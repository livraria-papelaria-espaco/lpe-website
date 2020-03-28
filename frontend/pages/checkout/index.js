import { Container } from '@material-ui/core';
import React from 'react';
import CheckoutStepper from '~/components/checkout/CheckoutStepper';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const CheckoutPage = () => {
  useAuth({ secure: true });
  return (
    <Layout title='Checkout'>
      <Container maxWidth='md'>
        <CheckoutStepper />
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
