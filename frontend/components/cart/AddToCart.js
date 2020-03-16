import { Button } from '@material-ui/core';
import React from 'react';
import CartContext from '~/components/context/CartContext';

const AddToCart = ({ item, ...props }) => {
  const { dispatch } = React.useContext(CartContext);

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
