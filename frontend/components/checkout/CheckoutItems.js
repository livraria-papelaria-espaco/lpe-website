import React from 'react';
import CartSummary from '~/components/cart/CartSummary';
import { useCart } from '~/hooks/useCart';
import { Typography, Link as MUILink } from '@material-ui/core';
import Link from 'next/link';

const CheckoutItems = ({ children }) => {
  const { state, dispatch } = useCart();

  const empty = state.get('items').size === 0;

  return (
    <div>
      {empty ? (
        <Typography variant='body1' color='error'>
          O seu carrinho de compras está vazio.{' '}
          <Link href='/' passHref>
            <MUILink>Voltar para a página principal.</MUILink>
          </Link>
        </Typography>
      ) : (
        <CartSummary data={state} dispatch={dispatch} />
      )}
      {children(empty)}
    </div>
  );
};

export default CheckoutItems;
