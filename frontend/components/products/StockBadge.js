/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

const StockBadge = ({ stock, component: Component = 'span', ...props }) => {
  if (stock === 'IN_STOCK')
    return (
      <Component style={{ fontWeight: 500, color: 'green' }} {...props}>
        Em&nbsp;Stock
      </Component>
    );
  if (stock === 'LOW_STOCK')
    return (
      <Component style={{ fontWeight: 500, color: 'orange' }} {...props}>
        Poucas&nbsp;unidades
      </Component>
    );
  if (stock === 'ORDER_ONLY')
    return (
      <Component style={{ fontWeight: 500, color: '#ff6a00' }} {...props}>
        Por&nbsp;encomenda
      </Component>
    );
  if (stock === 'UNAVAILABLE')
    return (
      <Component style={{ fontWeight: 500, color: '#e80000' }} {...props}>
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
