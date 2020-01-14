import React from 'react';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import securePage from '../hocs/securePage';

const CheckoutPage = ({ loggedUser }) => (
  <div>
    <Navbar username={loggedUser} />
    <Layout title='Checkout'>
      <CheckoutSummary />
    </Layout>
  </div>
);

export default securePage(CheckoutPage);
