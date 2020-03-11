import React from 'react';
import Link from 'next/link';
import { Link as MuiLink } from '@material-ui/core';

const OrderProduct = ({ name, slug, priceUnity, price, quantity }) => (
  <Link href={`/product?id=${slug}`} as={`/product/${slug}`} passHref>
    <MuiLink>
      <div>
        <p>
          {name} x{quantity}
        </p>
        {quantity > 1 && <h6>Preço unitário: {priceUnity}</h6>}
        <p>Preço: {price}</p>
        <hr />
      </div>
    </MuiLink>
  </Link>
);

export default OrderProduct;
