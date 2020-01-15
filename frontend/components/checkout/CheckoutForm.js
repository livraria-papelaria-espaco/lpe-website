import React from 'react';
import CheckoutStorePickup from './CheckoutStorePickup';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
}));

const CheckoutForm = () => {
  const classes = useStyles();

  const [storePickup, setStorePickup] = React.useState('undefined');

  return (
    <div className={classes.root}>
      <CheckoutStorePickup value={storePickup} setValue={setStorePickup} />
    </div>
  );
};

export default CheckoutForm;
