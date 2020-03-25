import { Typography } from '@material-ui/core';
import React from 'react';
import CartItem from './CartItem';

const CartSummary = ({ data, dispatch }) => {
  return (
    <>
      {data.get('items').map((item) => (
        <CartItem key={item.get('id')} item={item} dispatch={dispatch} />
      ))}
      <Typography variant='h6' component='p'>
        Total: {data.get('total').toFixed(2)}€
      </Typography>
    </>
  );
};

export default CartSummary;
