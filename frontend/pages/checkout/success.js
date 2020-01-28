import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import Navbar from '../../components/Navbar';
import defaultPage from '../../hocs/defaultPage';
import CartContext from '../../components/context/CartContext';

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

  return (
    <div>
      <Navbar username={loggedUser} />
      <Layout title='Order Successful'>
        <Typography variant='h5' component='h1'>
          Encomenda finalizada com sucesso!
        </Typography>
        <Typography variant='h6' component='h2'>
          O número da encomenda é {router.query.id}.
        </Typography>
      </Layout>
    </div>
  );
};

export default defaultPage(OrderSucessful);
