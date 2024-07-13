import { Link as MUILink, Typography } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { List } from 'immutable';
import CartSummary from '~/components/cart/CartSummary';
import { useCart } from '~/hooks/useCart';

const CheckoutItems = ({ children }) => {
  const { state, dispatch } = useCart();

  const empty = state.get('items').size === 0;

  useEffect(() => {
    if (!empty && window && window.umami) {
      window.umami.track('begin_checkout', {
        items: state
          .get('items', List())
          .map((v) => ({
            id: v.get('id'),
            name: v.get('name'),
            price: v.get('price'),
            quantity: v.get('quantity', 1),
          }))
          .toJS(),
      });
    }
  }, []);

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

CheckoutItems.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CheckoutItems;
