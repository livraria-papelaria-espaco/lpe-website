import { Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import CartItem from '~/components/cart/CartItem';
import { useCart } from '~/hooks/useCart';
import { makeStyles } from '@material-ui/core/styles';
import CheckoutSubmit from './CheckoutSubmit';

const useStyles = makeStyles((theme) => ({
  buttonArea: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const paymentGatewayMapping = {
  IN_STORE: 'Pagar em Loja',
  MB: 'Referência Multibanco',
  MBWAY: 'MBWay',
};

const shippingMethodMapping = {
  STORE_PICKUP: 'Levantamento em Loja',
  CTT: 'Envio via CTT',
};

const CheckoutSummary = ({ state, goBack }) => {
  const classes = useStyles();
  const { state: cartState } = useCart();

  const shippingAddressKey = state.get('useSameAddress') ? 'billingAddress' : 'shippingAddress';

  return (
    <div>
      <Typography variant='h4' component='h1'>
        A sua encomenda
      </Typography>
      <Typography variant='h5' component='h2'>
        Items
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {cartState.get('items').map((v) => (
            <CartItem key={v.get('id')} item={v} />
          ))}
        </Grid>
      </Grid>
      <Typography variant='h5' component='h2'>
        Dados do Cliente
      </Typography>
      <Grid container spacing={3}>
        <Field
          title='Nome'
          value={`${state.getIn(['billingAddress', 'firstName'])} ${state.getIn([
            'billingAddress',
            'lastName',
          ])}`}
        />
        <Field
          title='Endereço de Faturação'
          value={[
            state.getIn(['billingAddress', 'address1']),
            state.getIn(['billingAddress', 'address2']),
            `${state.getIn(['billingAddress', 'postalCode'])}, 
            ${state.getIn(['billingAddress', 'city'])}`,
          ].map((v, i) => (
            <span key={i}>
              {i !== 0 && <br />}
              {v}
            </span>
          ))}
        />
        <Field title='NIF' value={state.get('nif')} assert={!!state.get('nif')} />
      </Grid>
      <Typography variant='h5' component='h2'>
        Dados de Envio
      </Typography>
      <Grid container spacing={3}>
        <Field title='Método de Envio' value={shippingMethodMapping[state.get('shippingMethod')]} />
        <Field
          title='Endereço de Envio'
          value={[
            `${state.getIn([shippingAddressKey, 'firstName'])} 
            ${state.getIn([shippingAddressKey, 'lastName'])}`,
            state.getIn([shippingAddressKey, 'address1']),
            state.getIn([shippingAddressKey, 'address2']),
            `${state.getIn([shippingAddressKey, 'postalCode'])}, 
            ${state.getIn([shippingAddressKey, 'city'])}`,
          ].map((v, i) => (
            <span key={i}>
              {i !== 0 && <br />}
              {v}
            </span>
          ))}
          assert={state.get('shippingMethod') !== 'STORE_PICKUP'}
        />
      </Grid>
      <Typography variant='h5' component='h2'>
        Dados de Pagamento
      </Typography>
      <Grid container spacing={3}>
        <Field
          title='Método de Pagamento'
          value={paymentGatewayMapping[state.get('paymentGateway')]}
        />
        <Field
          title='Telemóvel MBWay'
          value={state.get('mbWayPhone')}
          assert={state.get('paymentGateway') === 'MBWAY'}
        />
      </Grid>
      <div className={classes.buttonArea}>
        <Button onClick={goBack} className={classes.button}>
          Voltar
        </Button>
        <CheckoutSubmit state={state} itemsState={cartState} className={classes.button} />
      </div>
    </div>
  );
};

const Field = ({ title, value, assert = true, xs = 12, md = 6, lg = 4 }) => {
  if (!assert) return null;

  return (
    <Grid item xs={xs} md={md} lg={lg}>
      <Typography variant='body1' color='textSecondary'>
        {title}
      </Typography>
      <Typography variant='body1'>{value}</Typography>
    </Grid>
  );
};

export default CheckoutSummary;
