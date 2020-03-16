import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useCart } from '~/hooks/useCart';
import Layout from '~/components/Layout';
import OrderSummary from '~/components/order/OrderSummary';
import { useAuth } from '~/hooks/useAuth';

const OrderSucessful = () => {
  useAuth({ secure: true });
  const { dispatch } = useCart();
  const router = useRouter();
  const { orderId } = router.query;

  React.useEffect(() => {
    if (!orderId) {
      router.replace('/');
      return;
    }

    dispatch({ type: 'RESET_CART' });
  }, []);

  if (!orderId) return <div></div>;

  return (
    <Layout title='Order Successful'>
      <Typography variant='h5' component='h1'>
        Encomenda finalizada com sucesso!
      </Typography>
      <OrderSummary id={orderId} />
    </Layout>
  );
};

export default OrderSucessful;
