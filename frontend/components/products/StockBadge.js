import React from 'react';

const StockBadge = ({ stock, component: Component = 'span' }) => {
  if (stock === 'IN_STOCK') return <Component style={{ color: 'green' }}>Em Stock</Component>;
  if (stock === 'LOW_STOCK')
    return <Component style={{ color: 'orange' }}>Poucas unidades</Component>;
  if (stock === 'ORDER_ONLY')
    return <Component style={{ color: 'orange' }}>Por encomenda</Component>;
  if (stock === 'UNAVAILABLE') return <Component style={{ color: 'red' }}>Indisponível</Component>;
  return <Component>Desconhecido</Component>;
};

export default StockBadge;
