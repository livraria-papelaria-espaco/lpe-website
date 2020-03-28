import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React from 'react';
import OrderAddress from './OrderAddress';
import OrderPaymentGatewayInfo from './OrderPaymentGatewayInfo';
import OrderProduct from './OrderProduct';

const FETCH_ORDER_QUERY = gql`
  query FETCH_ORDER_SUMMARY($id: ID!) {
    order(id: $id) {
      price
      invoiceId
      paymentGateway
      status
      shippingMethod
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        postalCode
      }
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

const OrderSummary = ({ id }) => {
  const { loading, error, data } = useQuery(FETCH_ORDER_QUERY, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  const { order } = data;
  if (!order) return <p>Order not found.</p>;
  return (
    <div>
      <h1>Encomenda: #{order.invoiceId}</h1>
      <p>Criada em: {order.createdAt}</p>
      <p>Custo total: {order.price.toFixed(2)}€</p>
      <p>Meio de pagamento: {order.paymentGateway}</p>
      <p>Estado da encomenda: {order.status}</p>
      {order.shippingMethod === 'STORE_PICKUP' ? (
        <p>Para levantar na loja</p>
      ) : (
        <>
          <OrderAddress title='Morada de envio' address={order.shippingAddress} />
          <OrderAddress title='Morada de faturação' address={order.billingAddress} />
        </>
      )}
      {order.status === 'WAITING_PAYMENT' && (
        <OrderPaymentGatewayInfo gateway={order.paymentGateway} orderData={order.orderData} />
      )}
      <h3>Artigos encomendados</h3>
      {order.orderData.items.map((item) => (
        <OrderProduct item={item} key={item.slug} />
      ))}
    </div>
  );
};

OrderSummary.propTypes = {
  id: PropTypes.string.isRequired, // MongoDB ID
};

export default OrderSummary;
