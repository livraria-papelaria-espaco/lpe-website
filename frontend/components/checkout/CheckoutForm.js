import { makeStyles } from '@material-ui/styles';
import React from 'react';
import CheckoutPaymentGateway from './CheckoutPaymentGateway';
import CheckoutShippingAddress from './CheckoutShippingAddress';
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
  const [paymentGateway, setPaymentGateway] = React.useState('undefined');

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
      <CheckoutSubmit />
    </div>
  );
};

export default CheckoutForm;
