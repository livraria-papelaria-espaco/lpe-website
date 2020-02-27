import React from 'react';
import { Link } from '@material-ui/core';

const OrderProduct = ({ name, slug, priceUnity, price, quantity }) => (
  <Link href={`/product/${slug}`}>
    <div>
      <p>
        {name} x{quantity}
      </p>
      {quantity > 1 && <h6>Preço unitário: {priceUnity}</h6>}
      <p>Preço: {price}</p>
      <hr />
    </div>
  </Link>
);

export default OrderProduct;
