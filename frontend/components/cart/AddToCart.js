import { Button } from '@material-ui/core';
import React from 'react';
import { useCart } from '~/hooks/useCart';

const AddToCart = ({ item, ...props }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', item });
  };

  return (
    <Button onClick={addToCart} variant='contained' color='primary' {...props}>
      Adicionar ao Carrinho
    </Button>
  );
};

export default AddToCart;
