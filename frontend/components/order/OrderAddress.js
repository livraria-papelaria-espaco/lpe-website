import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const OrderAddress = ({
  title,
  address: { firstName, lastName, address1, address2, city, postalCode },
}) => (
  <div>
    <Typography>
      <strong>{title}</strong>
    </Typography>
    <Typography>
      {`${firstName} ${lastName}`}
      <br />
      {address1}
      <br />
      {address2 && (
        <>
          {address2}
          <br />
        </>
      )}
      {`${city}, ${postalCode}`}
      <br />
      Portugal
    </Typography>
  </div>
);

OrderAddress.propTypes = {
  title: PropTypes.string.isRequired,
  address: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    address1: PropTypes.string.isRequired,
    address2: PropTypes.string,
    city: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderAddress;
