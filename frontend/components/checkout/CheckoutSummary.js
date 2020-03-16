import React from 'react';
import CartSummary from '~/components/cart/CartSummary';
import CartContext from '~/components/context/CartContext';

const CheckoutSummary = () => {
  const { state } = React.useContext(CartContext);
  return (
    <div>
      <CartSummary data={state} />
    </div>
  );
};

export default CheckoutSummary;
