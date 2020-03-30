import React from 'react';
import Layout from '~/components/Layout';
import OrderList from '~/components/order/OrderList';
import BackArrow from '~/components/utils/BackArrow';
import { useAuth } from '~/hooks/useAuth';

const OrdersPage = () => {
  useAuth({ secure: true });

  return (
    <Layout title='As suas encomendas'>
      <BackArrow link='/dashboard' />
      <OrderList />
    </Layout>
  );
};

export default OrdersPage;
