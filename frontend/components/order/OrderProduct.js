import { Link as MuiLink } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const OrderProduct = ({ item: { name, slug, priceUnity, price, quantity, reference } }) => {
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

OrderProduct.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    priceUnity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
  }).isRequired,
};

OrderProduct.defaultProps = {};

export default OrderProduct;
