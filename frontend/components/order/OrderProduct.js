import { Link as MuiLink } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const OrderProduct = ({ name, slug, priceUnity, price, quantity }) => (
  <Link href='/product/[slug]' as={`/product/${slug}`} passHref>
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
