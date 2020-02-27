import React from 'react';

const OrderAddress = ({ title, firstName, lastName, address1, address2, city, postalCode }) => (
  <div>
    <h3>{title}</h3>
    <p>{`${firstName} ${lastName}`}</p>
    <p>{address1}</p>
    <p>{address2}</p>
    <p>{`${city}, ${postalCode}`}</p>
    <p>Portugal</p>
  </div>
);

export default OrderAddress;
