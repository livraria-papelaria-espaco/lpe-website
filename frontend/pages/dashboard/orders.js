import React from 'react';
import securePage from '~/hocs/securePage';
import OrderList from '~/components/order/OrderList';
import Layout from '~/components/Layout';

const OrdersPage = () => {
  return (
    <Layout title='Suas encomendas'>
      <OrderList />
    </Layout>
  );
};

export default securePage(OrdersPage);
