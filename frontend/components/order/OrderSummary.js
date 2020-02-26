import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import OrderAddress from './OrderAddress';

const FETCH_ORDER_QUERY = gql`
  query FETCH_ORDER_SUMMARY($id: ID!) {
    order(id: $id) {
      price
      invoiceId
      paymentGateway
      status
      storePickup
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
    }
  }
`;
const OrderSummary = ({ id }) => {
  const { loading, error, data } = useQuery(FETCH_ORDER_QUERY, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const order = data.order;
  if (!order) return <p>Order not found.</p>;
  return (
    <div>
      <h1>Encomenda: #{order.invoiceId}</h1>
      <p>Custo total: {order.price.toFixed(2)}€</p>
      <p>Meio de pagamento: {order.paymentGateway}</p>
      <p>Estado da encomenda: {order.status}</p>
      {order.storePickup ? (
        <p>Para levantar na loja</p>
      ) : (
        <>
          <OrderAddress title='Morada de envio' {...order.shippingAddress} />
          <OrderAddress title='Morada de faturação' {...order.billingAddress} />
        </>
      )}
    </div>
  );
};

export default OrderSummary;
