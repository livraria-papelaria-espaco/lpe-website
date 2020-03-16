import React from 'react';
import CartSummary from '~/components/cart/CartSummary';
import { useCart } from '~/hooks/useCart';

const CheckoutSummary = () => {
  const { state } = useCart();
  return (
    <div>
      <CartSummary data={state} />
    </div>
  );
};

export default CheckoutSummary;
