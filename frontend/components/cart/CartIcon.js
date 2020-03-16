import { Badge, IconButton } from '@material-ui/core';
import Icon from '@material-ui/icons/ShoppingCartRounded';
import React from 'react';
import CartContext from '~/components/context/CartContext';
import CartDialog from './CartDialog';
import CartSummary from './CartSummary';

const CartIcon = () => {
  const { state: cart, dispatch } = React.useContext(CartContext);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton aria-label='open shopping cart' color='inherit' onClick={handleClick}>
        <Badge badgeContent={cart.get('count')} color='secondary'>
          <Icon />
        </Badge>
      </IconButton>
      <CartDialog open={open} onClose={handleClose}>
        <CartSummary data={cart} dispatch={dispatch} />
      </CartDialog>
    </>
  );
};

export default CartIcon;
