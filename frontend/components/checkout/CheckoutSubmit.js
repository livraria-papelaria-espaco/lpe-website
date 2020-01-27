import React from 'react';
import { Button } from '@material-ui/core';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const CheckoutSubmit = () => {
  const [createOrder] = useMutation(CREATE_ORDER);

  const onClick = () => {
    createOrder({
      variables: {
        price: 43.3,
        storePickup: false,
        address: {
          firstName: 'John',
          lastName: 'Doe',
          address1: 'Lorem Ipsum Stree',
          address2: '123',
          city: 'Lorem',
          postalCode: '1234-567',
        },
        paymentGateway: 'PAYPAL',
        orderData: { items: [{ slug: 'test', quantity: 3 }] },
      },
      context: {
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWMyYzgzZjAzM2JhMTQ4OWIwMjVmZSIsImlhdCI6MTU3OTk3ODQ2MSwiZXhwIjoxNTgyNTcwNDYxfQ.A6hEFiBUTI77mB-sgEYSSOknip2WMxvLikTEDmyCnME',
        },
      },
    });
  };

  return (
    <div>
      <Button variant='contained' color='primary' onClick={onClick}>
        Encomendar
      </Button>
    </div>
  );
};

const CREATE_ORDER = gql`
  # Write your query or mutation here
  mutation createOrder(
    $price: Float!
    $storePickup: Boolean!
    $address: ComponentCheckoutAddressInput!
    $paymentGateway: ENUM_ORDER_PAYMENTGATEWAY!
    $orderData: JSON!
  ) {
    createOrder(
      input: {
        data: {
          price: $price
          status: WAITING_PAYMENT
          paymentGateway: $paymentGateway
          storePickup: $storePickup
          shippingAddress: $address
          billingAddress: $address
          orderData: $orderData
        }
      }
    ) {
      order {
        status
        _id
      }
    }
  }
`;

export default CheckoutSubmit;
