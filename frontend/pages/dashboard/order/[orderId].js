import { useRouter } from 'next/router';
import React from 'react';
import OrderSummary from '~/components/order/OrderSummary';
import securePage from '~/hocs/securePage';
import Layout from '~/components/Layout';

const OrderSummaryPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  return (
    <Layout title='Ver detalhes da encomenda'>
      <OrderSummary id={orderId} />
    </Layout>
  );
};

export default securePage(OrderSummaryPage);
