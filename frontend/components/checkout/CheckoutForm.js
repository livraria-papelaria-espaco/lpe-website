import { makeStyles } from '@material-ui/styles';
import React from 'react';
import CheckoutMbWayPhone from './CheckoutMbWayPhone';
import CheckoutPaymentGateway from './CheckoutPaymentGateway';
import CheckoutShippingAddress from './CheckoutAddress';
import CheckoutStorePickup from './CheckoutStorePickup';
import CheckoutSubmit from './CheckoutSubmit';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
}));

const CheckoutForm = () => {
  const classes = useStyles();

  const [storePickup, setStorePickup] = React.useState('undefined');
  const [shippingAddress, setShippingAddress] = React.useState({});
  const [billingAddress, setBillingAddress] = React.useState({});
  const [nif, setNif] = React.useState('');
  const [paymentGateway, setPaymentGateway] = React.useState('undefined');
  const [mbWayPhone, setMbWayPhone] = React.useState('');

  return (
    <div className={classes.root}>
      <CheckoutStorePickup value={storePickup} setValue={setStorePickup} />
      {storePickup === 'false' && (
        <CheckoutShippingAddress value={shippingAddress} setValue={setShippingAddress} />
      )}
      <CheckoutPaymentGateway
        value={paymentGateway}
        setValue={setPaymentGateway}
        disableStore={storePickup !== 'true'}
      />
      {paymentGateway === 'MBWAY' && (
        <CheckoutMbWayPhone value={mbWayPhone} setValue={setMbWayPhone} />
      )}
      <CheckoutSubmit
        storePickup={storePickup}
        shippingAddress={shippingAddress}
        paymentGateway={paymentGateway}
        mbWayPhone={mbWayPhone}
      />
    </div>
  );
};

export default CheckoutForm;
