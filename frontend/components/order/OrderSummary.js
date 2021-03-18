import { useQuery } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import LoadingPage from '~/components/utils/LoadingPage';
import {
  orderStatusDescriptionMap,
  orderStatusMap,
  paymentGatewayMap,
  shippingMethodMap,
} from '~/lib/orders';
import ErrorText from '../utils/ErrorText';
import OrderAddress from './OrderAddress';
import OrderItemsTable from './OrderItemsTable';
import OrderPaymentGatewayInfo from './OrderPaymentGatewayInfo';

const FETCH_ORDER_QUERY = gql`
  query FETCH_ORDER_SUMMARY($id: ID!) {
    order(id: $id) {
      price
      invoiceId
      paymentGateway
      expiresAt
      status
      shippingMethod
      shippingCost
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        postalCode
      }
      nif
      billingAddress {
        firstName
        lastName
        address1
        address2
        city
        postalCode
      }
      orderData
      createdAt
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
  invoiceId: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const OrderSummary = ({ id }) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(FETCH_ORDER_QUERY, { variables: { id } });
  if (loading) return <LoadingPage height={20} />;
  if (error) return <ErrorText error={error} />;
  const { order } = data;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      {order.status === 'WAITING_PAYMENT' && (
        <Alert severity='warning' className={classes.alert}>
          Apenas iremos processar a sua encomenda após recebermos o respetivo pagamento
        </Alert>
      )}
      <Typography variant='subtitle2' color='textSecondary'>
        {new Date(order.createdAt).toLocaleString('pt-PT')}
      </Typography>
      <Typography variant='h5' className={classes.invoiceId} gutterBottom>
        #{order.invoiceId}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Total: </strong>
            {order.price.toFixed(2)}€
          </Typography>
          <Typography>
            <strong>Meio de pagamento: </strong>
            {paymentGatewayMap[order.paymentGateway] || 'Desconhecido'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Estado da encomenda: </strong> {orderStatusMap[order.status] || 'Desconhecido'}
          </Typography>
          <Typography variant='body2'>{orderStatusDescriptionMap[order.status] || ''}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Método de Envio: </strong>
            {shippingMethodMap[order.shippingMethod] || 'Desconhecido'}
          </Typography>
          <Typography>
            <strong>Custos de Envio: </strong>
            {order.shippingCost.toFixed(2)} €
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {order.shippingMethod !== 'STORE_PICKUP' && (
            <OrderAddress title='Morada de envio' address={order.shippingAddress} />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>NIF: </strong>
            {order.nif || '-'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <OrderAddress title='Morada de faturação' address={order.billingAddress} />
        </Grid>
        <Grid item xs={12}>
          {order.status === 'WAITING_PAYMENT' && (
            <OrderPaymentGatewayInfo
              gateway={order.paymentGateway}
              orderData={order.orderData}
              expiresAt={order.expiresAt}
              invoiceId={order.invoiceId}
            />
          )}
        </Grid>
      </Grid>
      <h3>Artigos encomendados</h3>
      <OrderItemsTable items={order.orderData.items} />
    </div>
  );
};

OrderSummary.propTypes = {
  id: PropTypes.string.isRequired, // MongoDB ID
};

export default OrderSummary;
