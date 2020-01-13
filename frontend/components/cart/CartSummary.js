import { Typography, IconButton } from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/AddRounded';
import RemoveIcon from '@material-ui/icons/RemoveRounded';
import DeleteIcon from '@material-ui/icons/RemoveShoppingCartRounded';

const CartSummary = ({ data, dispatch }) => {
  const increaseQuantity = (id) => () => {
    dispatch({ type: 'INCREASE_QUANTITY', id });
  };

  const decreaseQuantity = (id) => () => {
    dispatch({ type: 'DECREASE_QUANTITY', id });
  };

  const removeItem = (id) => () => {
    dispatch({ type: 'REMOVE_ITEM', id });
  };
  return (
    <>
      {data.get('items').map((item) => (
        <div key={item.get('id')}>
          <Typography variant='h6' component='p'>
            {item.get('name')}
          </Typography>
          <Typography variant='body1'>{item.get('price').toFixed(2)}€</Typography>
          <Typography variant='body2'>Qnt: {item.get('quantity')}</Typography>
          {dispatch && (
            <>
              <IconButton
                onClick={decreaseQuantity(item.get('id'))}
                disabled={item.get('quantity') <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={increaseQuantity(item.get('id'))}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={removeItem(item.get('id'))}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </div>
      ))}
      <Typography variant='h6' component='p'>
        Total: {data.get('total').toFixed(2)}€
      </Typography>
    </>
  );
};

export default CartSummary;
