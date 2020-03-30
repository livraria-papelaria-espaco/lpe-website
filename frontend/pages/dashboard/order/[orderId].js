import { useRouter } from 'next/router';
import React from 'react';
import Layout from '~/components/Layout';
import OrderSummary from '~/components/order/OrderSummary';
import BackArrow from '~/components/utils/BackArrow';
import { useAuth } from '~/hooks/useAuth';

const OrderSummaryPage = () => {
  useAuth({ secure: true });
  const router = useRouter();
  const { orderId } = router.query;
  if (!orderId) return null;

  return (
    <Layout title='Ver detalhes da encomenda'>
      <BackArrow link='/dashboard/orders' text='Voltar para a lista de encomendas' />
      <OrderSummary id={orderId} />
    </Layout>
  );
};

export default OrderSummaryPage;
