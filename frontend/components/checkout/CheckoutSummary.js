import React from 'react';
import CartContext from '../context/CartContext';
import CartSummary from '../cart/CartSummary';

const CheckoutSummary = () => {
  const { state } = React.useContext(CartContext);
  return (
    <div>
      <CartSummary data={state} />
    </div>
  );
};

export default CheckoutSummary;
