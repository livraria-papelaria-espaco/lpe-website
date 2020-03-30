import { useQuery } from '@apollo/react-hooks';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import LoadingPage from '~/components/utils/LoadingPage';
import OrderAddress from './OrderAddress';
import OrderItemsTable from './OrderItemsTable';
import OrderPaymentGatewayInfo from './OrderPaymentGatewayInfo';
import ErrorText from '../utils/ErrorText';

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

const paymentGatewayMap = {
  IN_STORE: 'Pagar em loja',
  MB: 'Multibanco',
  MBWAY: 'MBWay',
};

const orderStatusMap = {
  WAITING_PAYMENT: 'A aguardar pagamento',
  PROCESSING: 'Em processamento',
  SHIPPED: 'Enviada',
  DELIVERED: 'Entregue',
  READY_TO_PICKUP: 'Pronta para recolha',
  DELIVERED_FAILED: 'Falha na entrega',
  CANCELLED: 'Cancelada',
  WAITING_ITEMS: 'À espera de produtos',
};

const orderStatusDescriptionMap = {
  WAITING_PAYMENT: 'Estamos a aguardar o pagamento da encomenda para prosseguirmos com a mesma',
  PROCESSING: 'A sua encomenda será processada por um dos nossos colaboradores',
  SHIPPED: 'A sua encomenda já saiu da nossa loja',
  DELIVERED: 'A sua encomenda foi entregue',
  READY_TO_PICKUP: 'A sua encomenda está pronta para ser recolhida na nossa loja',
  DELIVERED_FAILED: 'Os serviços de correio tiveram dificuldades em entregar a sua encomenda',
  CANCELLED: 'A sua encomenda foi cancelada',
  WAITING_ITEMS: 'Alguns dos produtos não estavam em stock na nossa loja, mas já veem a caminho',
};

const shippingMethodMap = {
  STORE_PICKUP: 'Recolha em loja',
  CTT: 'Envio por CTT',
};

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
            {order.nif}
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
