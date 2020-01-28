import { fromJS } from 'immutable';
import Cookies from 'js-cookie';
import React, { createContext, useEffect, useReducer } from 'react';

const initialState = fromJS({ items: [], total: 0, count: 0, default: true });
const CartContext = createContext(initialState);

const refreshMeta = (state) => {
  const [total, count] = state
    .get('items')
    .reduce(
      (result, item) => [
        result[0] + item.get('price', 0) * item.get('quantity', 1),
        result[1] + item.get('quantity', 1),
      ],
      [0, 0]
    );
  return state.set('total', total).set('count', count);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'LOAD_CART':
        return action.data;
      case 'ADD_ITEM':
        return state
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.item.id);
            if (key !== undefined)
              return items.update(key, (item) => item.update('quantity', (qnt) => qnt + 1));
            else return items.push(fromJS({ ...action.item, quantity: 1 }));
          })
          .update(refreshMeta);
      case 'INCREASE_QUANTITY':
        return state
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.id);
            if (key !== undefined)
              return items.update(key, (item) => item.update('quantity', (qnt) => qnt + 1));
          })
          .update(refreshMeta);
      case 'DECREASE_QUANTITY':
        return state
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.id);
            if (key !== undefined)
              return items.update(key, (item) =>
                item.update('quantity', (qnt) => (qnt > 1 ? qnt - 1 : 1))
              );
          })
          .update(refreshMeta);
      case 'REMOVE_ITEM':
        return state
          .update('items', (items) => {
            const key = items.findKey((item) => item.get('id') === action.id);
            if (key !== undefined) return items.delete(key);
          })
          .update(refreshMeta);
      case 'RESET_CART':
        return initialState.set('default', false);
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    if (state.get('default', false)) {
      const cart = Cookies.getJSON('cart') || [];
      // TODO refresh all data from server
      const [total, count] = cart.reduce(
        (result, v) => [result[0] + v.price * v.quantity, result[1] + v.quantity],
        [0, 0]
      );
      dispatch({ type: 'LOAD_CART', data: fromJS({ total, items: cart, count }) });
    }
    Cookies.set('cart', state.get('items').toJS());
  }, [state, dispatch]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};
export const CartConsumer = CartContext.Consumer;
export default CartContext;
