import { useQuery } from '@apollo/react-hooks';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import gql from 'graphql-tag';
import { List } from 'immutable';
import React from 'react';
import CartItem from '~/components/cart/CartItem';
import { useCart } from '~/hooks/useCart';
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
  heading: {
    marginTop: theme.spacing(2),
    marignBottom: theme.spacing(1),
  },
  skeleton: {
    display: 'inline-block',
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
  const isStorePickup = state.get('shippingMethod') === 'STORE_PICKUP';

  const { data, loading, error } = useQuery(CALCULATE_SHIPING_QUERY, {
    variables: {
      postalCode: state.getIn([shippingAddressKey, 'postalCode']),
      shippingMethod: state.get('shippingMethod'),
      items: cartState
        .get('items', List())
        .map((v) => ({ id: v.get('id'), quantity: v.get('quantity', 1) }))
        .toJS(),
    },
    skip: isStorePickup,
  });

  return (
    <div>
      <Typography variant='h4' component='h1'>
        A sua encomenda
      </Typography>
      <Typography variant='h5' component='h2' className={classes.heading}>
        Items
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {cartState.get('items').map((v) => (
            <CartItem key={v.get('id')} item={v} />
          ))}
        </Grid>
      </Grid>
      <Typography variant='h5' component='h2' className={classes.heading}>
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
      <Typography variant='h5' component='h2' className={classes.heading}>
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
      <Typography variant='h5' component='h2' className={classes.heading}>
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
      <Typography variant='h5' component='h2' className={classes.heading}>
        Custos
      </Typography>
      <div>
        <Typography variant='body1'>Sub total: {cartState.get('total', 0).toFixed(2)} €</Typography>
        {!isStorePickup && (
          <Typography variant='body1'>
            Custos de envio:{' '}
            {!!loading || !!error ? (
              <Skeleton width={50} className={classes.skeleton} />
            ) : (
              data.calculateShipping.toFixed(2)
            )}
            {' €'}
          </Typography>
        )}
        <Typography variant='h6' component='p'>
          Total:{' '}
          {!!loading || !!error ? (
            <Skeleton width={50} className={classes.skeleton} />
          ) : (
            ((data ? data.calculateShipping : 0) + cartState.get('total', 0)).toFixed(2)
          )}
          {' €'}
        </Typography>
      </div>
      <div className={classes.buttonArea}>
        <Button onClick={goBack} className={classes.button}>
          Voltar
        </Button>
        <CheckoutSubmit
          state={state}
          itemsState={cartState}
          className={classes.button}
          disabled={!!loading || !!error}
          shippingCost={data ? data.calculateShipping : 0}
        />
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

const CALCULATE_SHIPING_QUERY = gql`
  query($postalCode: String!, $shippingMethod: ENUM_ORDER_SHIPPINGMETHOD!, $items: JSON!) {
    calculateShipping(postalCode: $postalCode, shippingMethod: $shippingMethod, items: $items)
  }
`;

export default CheckoutSummary;
