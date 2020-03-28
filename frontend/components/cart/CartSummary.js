import { Typography } from '@material-ui/core';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
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

CartSummary.propTypes = {
  data: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func.isRequired,
};

CartSummary.defaultProps = {};

export default CartSummary;
