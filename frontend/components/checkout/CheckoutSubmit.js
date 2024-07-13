import { useMutation } from '@apollo/client';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { List, Map } from 'immutable';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

const CREATE_ORDER = gql`
  mutation createOrder(
    $price: Float!
    $shippingCost: Float!
    $shippingMethod: ENUM_ORDER_SHIPPINGMETHOD!
    $shippingAddress: ComponentCheckoutAddressInput
    $billingAddress: ComponentCheckoutAddressInput!
    $paymentGateway: ENUM_ORDER_PAYMENTGATEWAY!
    $orderData: JSON!
    $nif: Long
  ) {
    createOrder(
      input: {
        data: {
          price: $price
          shippingCost: $shippingCost
          status: WAITING_PAYMENT
          paymentGateway: $paymentGateway
          shippingMethod: $shippingMethod
          shippingAddress: $shippingAddress
          billingAddress: $billingAddress
          orderData: $orderData
          nif: $nif
        }
      }
    ) {
      order {
        id
        invoiceId
      }
    }
  }
`;

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

const CheckoutSubmit = ({ state, itemsState, shippingCost = 0, disabled, className }) => {
  const router = useRouter();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();

  const price = itemsState.get('total', 0) + shippingCost;
  const shippingMethod = state.get('shippingMethod', 'STORE_PICKUP');
  const billingAddress = state.get('billingAddress').toJS();
  const shippingAddress =
    shippingMethod === 'STORE_PICKUP'
      ? undefined
      : state.get(state.get('useSameAddress', true) ? 'billingAddress' : 'shippingAddress').toJS();
  const paymentGateway = state.get('paymentGateway');
  const nif = state.get('nif') ? parseInt(state.get('nif'), 10) : undefined;

  const onClick = async () => {
    try {
      setLoading(true);
      const { data } = await createOrder({
        variables: {
          shippingCost,
          price,
          shippingMethod,
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

      if (window && window.umami) {
        window.umami.track('purchase');
      }

      router.push('/checkout/success/[orderId]', `/checkout/success/${data.createOrder.order.id}`);
    } catch (e) {
      console.error(e);

      if (window && window.umami) {
        window.umami.track('error', {
          description: JSON.stringify(e),
        });
      }

      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <Button
          variant='contained'
          color='primary'
          onClick={onClick}
          disabled={loading || disabled}
          className={className}
        >
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

CheckoutSubmit.propTypes = {
  state: PropTypes.instanceOf(Map).isRequired,
  itemsState: PropTypes.instanceOf(Map).isRequired,
  shippingCost: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

CheckoutSubmit.defaultProps = {
  shippingCost: 0,
  disabled: false,
  className: '',
};

export default CheckoutSubmit;
