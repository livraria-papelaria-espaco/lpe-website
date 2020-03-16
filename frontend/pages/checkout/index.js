import React from 'react';
import CheckoutForm from '~/components/checkout/CheckoutForm';
import CheckoutSummary from '~/components/checkout/CheckoutSummary';
import Layout from '~/components/Layout';
import Navbar from '~/components/Navbar';
import { useAuth } from '~/hooks/useAuth';

const CheckoutPage = ({ loggedUser }) => {
  useAuth({ secure: true });
  return (
    <div>
      <Navbar username={loggedUser} />
      <Layout title='Checkout'>
        <CheckoutSummary />
        <CheckoutForm />
      </Layout>
    </div>
  );
};

export default CheckoutPage;
