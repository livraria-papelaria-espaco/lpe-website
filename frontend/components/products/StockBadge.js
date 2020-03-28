/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

const StockBadge = ({ stock, component: Component = 'span', ...props }) => {
  if (stock === 'IN_STOCK')
    return (
      <Component style={{ color: 'green' }} {...props}>
        Em Stock
      </Component>
    );
  if (stock === 'LOW_STOCK')
    return (
      <Component style={{ color: 'orange' }} {...props}>
        Poucas unidades
      </Component>
    );
  if (stock === 'ORDER_ONLY')
    return (
      <Component style={{ color: 'orange' }} {...props}>
        Por encomenda
      </Component>
    );
  if (stock === 'UNAVAILABLE')
    return (
      <Component style={{ color: 'red' }} {...props}>
        Indisponível
      </Component>
    );
  return <Component {...props}>Desconhecido</Component>;
};

StockBadge.propTypes = {
  stock: PropTypes.string.isRequired,
  component: PropTypes.elementType,
};

StockBadge.defaultProps = {
  component: 'span',
};

export default StockBadge;
