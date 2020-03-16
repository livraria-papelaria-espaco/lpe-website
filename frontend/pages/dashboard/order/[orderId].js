import { useRouter } from 'next/router';
import React from 'react';
import Layout from '~/components/Layout';
import OrderSummary from '~/components/order/OrderSummary';
import { useAuth } from '~/hooks/useAuth';

const OrderSummaryPage = () => {
  useAuth({ secure: true });
  const router = useRouter();
  const { orderId } = router.query;
  return (
    <Layout title='Ver detalhes da encomenda'>
      <OrderSummary id={orderId} />
    </Layout>
  );
};

export default OrderSummaryPage;
