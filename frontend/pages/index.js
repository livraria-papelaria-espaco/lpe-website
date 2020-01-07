import React from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import defaultPage from '../hocs/defaultPage';

const HomePage = (props) => (
  <div>
    <Navbar username={props.loggedUser} />
    <Layout title='Home'>
      <ProductList />
    </Layout>
  </div>
);

export default defaultPage(HomePage);
