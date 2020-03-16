import React from 'react';
import Layout from '~/components/Layout';
import OrderList from '~/components/order/OrderList';
import { useAuth } from '~/hooks/useAuth';

const OrdersPage = () => {
  useAuth({ secure: true });
  return (
    <Layout title='Suas encomendas'>
      <OrderList />
    </Layout>
  );
};

export default OrdersPage;
