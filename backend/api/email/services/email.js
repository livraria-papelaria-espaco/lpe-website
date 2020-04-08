'use strict';

const Email = require('email-templates');

const email = new Email();

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

const paymentGatewayMap = {
  IN_STORE: 'Pagar em loja',
  MB: 'Multibanco',
  MBWAY: 'MBWay',
  BANK_TRANSFER: 'Tranferência Bancária',
};

const sendOrderCreatedEmail = (data) => sendPugEmail(data, 'order-created');

const sendOrderPaidEmail = (data) => sendPugEmail(data, 'order-paid');

const sendOrderReadyToPickupEmail = (data) => sendPugEmail(data, 'order-ready-to-pickup');

const sendOrderShippedEmail = (data) => sendPugEmail(data, 'order-shipped');

const sendOrderCancelledEmail = (data) => sendPugEmail(data, 'order-cancelled');

module.exports = {
  sendOrderCreatedEmail,
  sendOrderPaidEmail,
  sendOrderReadyToPickupEmail,
  sendOrderShippedEmail,
  sendOrderCancelledEmail,
};

const sendPugEmail = async ({ order, user }, template) => {
  const shippingAddress = order.shippingAddress || {};
  const frontendUrl = strapi.config.currentEnvironment.frontendUrl || 'http://localhost:3000';
  const variables = {
    frontendUrl,
    id: order.id,
    orderUrl: `${frontendUrl}/dashboard/order/${order.id}`,
    productUrlPrefix: `${frontendUrl}/product/`,
    clientName: user.username,
    createdAt: order.createdAt.toLocaleString('pt-PT'),
    price: order.price.toFixed(2),
    status: order.status,
    statusText: orderStatusMap[order.status] || 'Desconhecido',
    paymentGateway: order.paymentGateway,
    paymentGatewayText: paymentGatewayMap[order.paymentGateway] || 'Desconhecido',
    mbEntity: (order.orderData.multibanco || {}).entity || '',
    mbReference: (order.orderData.multibanco || {}).reference || '',
    mbWayPhone: order.orderData.mbWayPhone,
    expiresAt: (order.expiresAt || new Date()).toLocaleString('pt-PT'),
    shippingMethod: order.shippingMethod,
    shippingName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    shippingLine1: shippingAddress.address1,
    shippingLine2: shippingAddress.address2,
    shippingCity: `${shippingAddress.postalCode}, ${shippingAddress.city}, Portugal`,
    nif: order.nif > 0 ? order.nif : '-',
    items: order.orderData.items,
    itemsPrice: (order.price - (order.shippingCost || 0)).toFixed(2),
    invoiceId: order.invoiceId,
  };

  const { subject, text, html } = await email.renderAll(template, variables);

  await strapi.plugins['email'].services.email.send({
    to: user.email,
    subject,
    text,
    html,
  });
};
