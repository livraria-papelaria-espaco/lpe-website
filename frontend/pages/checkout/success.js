import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import CartContext from '~/components/context/CartContext';
import Layout from '~/components/Layout';
import Navbar from '~/components/Navbar';
import OrderSummary from '~/components/order/OrderSummary';
import defaultPage from '~/hocs/defaultPage';

const OrderSucessful = ({ loggedUser }) => {
  const { dispatch } = React.useContext(CartContext);
  const router = useRouter();

  React.useEffect(() => {
    if (!router.query.id) {
      router.replace('/');
      return;
    }

    dispatch({ type: 'RESET_CART' });
  }, []);

  if (!router.query.id) return <div></div>;

  return (
    <div>
      <Navbar username={loggedUser} />
      <Layout title='Order Successful'>
        <Typography variant='h5' component='h1'>
          Encomenda finalizada com sucesso!
        </Typography>
        <OrderSummary id={router.query.id} />
      </Layout>
    </div>
  );
};

export default defaultPage(OrderSucessful);
