import React from 'react';
import Layout from '~/components/Layout';
import Navbar from '~/components/Navbar';
import ProductList from '~/components/ProductList';

const HomePage = () => (
  <div>
    <Navbar />
    <Layout title='Home'>
      <ProductList />
    </Layout>
  </div>
);

export default HomePage;
