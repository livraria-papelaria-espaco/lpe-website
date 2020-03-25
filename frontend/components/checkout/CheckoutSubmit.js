import { useMutation } from '@apollo/react-hooks';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import gql from 'graphql-tag';
import { List } from 'immutable';
import { useRouter } from 'next/router';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
    width: 'fit-content',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -9,
    marginLeft: -17,
  },
}));

const CheckoutSubmit = ({ state, itemsState, ...props }) => {
  const router = useRouter();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();

  const price = itemsState.get('total', 0); // TODO add shipping
  const storePickup = state.get('storePickup', true);
  const billingAddress = state.get('billingAddress').toJS();
  const shippingAddress = state
    .get(state.get('useSameAddress', true) ? 'billingAddress' : 'shippingAddress')
    .toJS();
  const paymentGateway = state.get('paymentGateway');
  const nif = state.get('nif') ? parseInt(state.get('nif'), 10) : undefined;

  const onClick = async () => {
    try {
      setLoading(true);
      const { data } = await createOrder({
        variables: {
          price,
          storePickup,
          billingAddress,
          shippingAddress,
          paymentGateway,
          nif,
          orderData: {
            items: itemsState
              .get('items', List())
              .map((v) => ({ id: v.get('id'), quantity: v.get('quantity', 1) }))
              .toJS(),
            mbWayPhone: paymentGateway === 'MBWAY' ? state.get('mbWayPhone') : undefined,
          },
        },
      });
      setLoading(false);
      router.push('/checkout/success/[orderId]', `/checkout/success/${data.createOrder.order._id}`);
    } catch (e) {
      console.error(e);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <Button variant='contained' color='primary' onClick={onClick} disabled={loading} {...props}>
          Encomendar
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
      {error && (
        <Typography variant='body1' component='span' color='error'>
          Ocorreu um erro. Por favor tente novamente mais tarde.
        </Typography>
      )}
    </>
  );
};

const CREATE_ORDER = gql`
  mutation createOrder(
    $price: Float!
    $storePickup: Boolean!
    $shippingAddress: ComponentCheckoutAddressInput!
    $billingAddress: ComponentCheckoutAddressInput!
    $paymentGateway: ENUM_ORDER_PAYMENTGATEWAY!
    $orderData: JSON!
    $nif: Long
  ) {
    createOrder(
      input: {
        data: {
          price: $price
          status: WAITING_PAYMENT
          paymentGateway: $paymentGateway
          storePickup: $storePickup
          shippingAddress: $shippingAddress
          billingAddress: $billingAddress
          orderData: $orderData
          nif: $nif
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
