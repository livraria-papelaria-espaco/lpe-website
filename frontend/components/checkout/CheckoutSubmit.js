import { useMutation } from '@apollo/react-hooks';
import { Button, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import { List } from 'immutable';
import { useRouter } from 'next/router';
import React from 'react';
import CartContext from '~/components/context/CartContext';

const CheckoutSubmit = ({ storePickup, shippingAddress, paymentGateway, mbWayPhone }) => {
  const router = useRouter();
  const { state: itemsState } = React.useContext(CartContext);
  const [createOrder] = useMutation(CREATE_ORDER);
  const [error, setError] = React.useState(false);

  const onClick = async () => {
    const { data, errors } = await createOrder({
      variables: {
        price: itemsState.get('total', 0),
        storePickup: storePickup != 'false',
        address: shippingAddress,
        paymentGateway: paymentGateway,
        orderData: {
          items: itemsState
            .get('items', List())
            .map((v) => ({ id: v.get('id'), quantity: v.get('quantity', 1) }))
            .toJS(),
          mbWayPhone: paymentGateway === 'MBWAY' ? mbWayPhone : undefined,
        },
      },
    });
    if (errors) {
      setError(true);
      return;
    }
    router.push('/checkout/success/[orderId]', `/checkout/success/${data.createOrder.order._id}`);
  };

  return (
    <div>
      <Button variant='contained' color='primary' onClick={onClick}>
        Encomendar
      </Button>
      {error && (
        <Typography variant='p' color='error'>
          Ocorreu um erro
        </Typography>
      )}
    </div>
  );
};

const CREATE_ORDER = gql`
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
        _id
      }
    }
  }
`;

export default CheckoutSubmit;
