import PropTypes from 'prop-types';
import React from 'react';

const OrderAddress = ({
  title,
  address: { firstName, lastName, address1, address2, city, postalCode },
}) => (
  <div>
    <h3>{title}</h3>
    <p>{`${firstName} ${lastName}`}</p>
    <p>{address1}</p>
    <p>{address2}</p>
    <p>{`${city}, ${postalCode}`}</p>
    <p>Portugal</p>
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
