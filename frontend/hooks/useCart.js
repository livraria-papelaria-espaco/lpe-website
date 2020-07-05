import { fromJS } from 'immutable';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = fromJS({ items: [], total: 0, count: 0, default: true });
const CartContext = createContext(initialState);

const refreshMeta = (state) => {
  const [total, count] = state
    .get('items')
    .reduce(
      (result, item) => [
        result[0] +
          (item.get('price', 0) * (1 - item.get('discountPercent', 0) / 100)).toFixed(2) *
            item.get('quantity', 1),
        result[1] + item.get('quantity', 1),
      ],
      [0, 0]
    );
  return state.set('total', total).set('count', count);
};

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer((reducerState, action) => {
    switch (action.type) {
      case 'LOAD_CART':
        return action.data;
      case 'ADD_ITEM':
        if (window && window.gtag) {
          window.gtag('event', 'add_to_cart', {
            items: [
              {
                id: action.item.id,
                name: action.item.name,
                price: action.item.price,
                quantity: action.item.quantity || 1,
              },
            ],
          });
        }

        return reducerState
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.item.id);
            if (key !== undefined)
              return items.update(key, (item) => item.update('quantity', (qnt) => qnt + 1));
            return items.push(fromJS({ ...action.item, quantity: 1 }));
          })
          .update(refreshMeta);
      case 'INCREASE_QUANTITY':
        return reducerState
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.id);
            if (key !== undefined)
              return items.update(key, (item) => item.update('quantity', (qnt) => qnt + 1));
            return items;
          })
          .update(refreshMeta);
      case 'DECREASE_QUANTITY':
        return reducerState
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.id);
            if (key !== undefined)
              return items.update(key, (item) =>
                item.update('quantity', (qnt) => (qnt > 1 ? qnt - 1 : 1))
              );
            return items;
          })
          .update(refreshMeta);
      case 'REMOVE_ITEM':
        if (window && window.gtag) {
          window.gtag('event', 'remove_from_cart', {
            items: [
              {
                id: action.id,
              },
            ],
          });
        }

        return reducerState
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.id);
            if (key !== undefined) return items.delete(key);
            return items;
          })
          .update(refreshMeta);
      case 'RESET_CART':
        return initialState.set('default', false);
      default:
        return reducerState;
    }
  }, initialState);

  useEffect(() => {
    if (state.get('default', false)) {
      const cart = Cookies.getJSON('cart') || [];
      // TODO refresh all data from server
      const [total, count] = cart.reduce(
        (result, v) => [
          result[0] + (v.price * (1 - (v.discountPercent || 0) / 100)).toFixed(2) * v.quantity,
          result[1] + v.quantity,
        ],
        [0, 0]
      );
      dispatch({ type: 'LOAD_CART', data: fromJS({ total, items: cart, count }) });
    }
    Cookies.set('cart', state.get('items').toJS());
  }, [state, dispatch]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
