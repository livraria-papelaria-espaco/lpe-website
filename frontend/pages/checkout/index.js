import React from 'react';
import CheckoutForm from '~/components/checkout/CheckoutForm';
import CheckoutSummary from '~/components/checkout/CheckoutSummary';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const CheckoutPage = () => {
  useAuth({ secure: true });
  return (
    <Layout title='Checkout'>
      <CheckoutSummary />
      <CheckoutForm />
    </Layout>
  );
};

export default CheckoutPage;
