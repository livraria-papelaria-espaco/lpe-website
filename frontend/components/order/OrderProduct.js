import { Link as MuiLink } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const OrderProduct = ({ name, slug, priceUnity, price, quantity, reference }) => {
  return (
    <Link href='/product/[slug]' as={`/product/${slug}`}>
      <MuiLink>
        <div>
          <p>
            {name} x{quantity}
          </p>
          <p>Ref: {reference}</p>
          {quantity > 1 && <h6>Preço unitário: {priceUnity}</h6>}
          <p>Preço: {price}</p>
          <hr />
        </div>
      </MuiLink>
    </Link>
  );
};

export default OrderProduct;
