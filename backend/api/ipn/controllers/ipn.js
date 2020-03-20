'use strict';

const axios = require('axios');

const handleMultibancoPayment = async (query) => {
  // check if entities match with order

  const orders = await strapi.services.order.find({ invoiceId: query.orderId });
  if (!orders[0]) throw strapi.errors.badRequest("Can't find order.");
  const order = orders[0];

  // we don't want to sent paid orders back to "processing" accidentally
  if (order.status !== 'WAITING_PAYMENT') return;

  if (
    `${query.reference}` !== order.orderData.multibanco.reference ||
    `${query.entidade}` !== order.orderData.multibanco.entity ||
    parseFloat(query.price) !== order.orderData.multibanco.price
  )
    throw strapi.errors.badRequest('Invalid reference/entity/price for provided order.');

  // check if eupago agrees

  try {
    const EU_PAGO_ENDPOINT = `https://${
      strapi.config.currentEnvironment.euPagoSandbox ? 'sandbox' : 'clientes'
    }.eupago.pt/clientes/rest_api`;

    var response = await axios.post(EU_PAGO_ENDPOINT + '/multibanco/info', {
      chave: strapi.config.currentEnvironment.euPagoToken,
      referencia: query.reference,
      entidade: query.entidade,
    });
  } catch (e) {
    throw strapi.errors.badGateway(
      'An error occurred while requesting information about the transaction.'
    );
  }
  if (!response.data.pagamentos) throw strapi.errors.badRequest('Payment not detected.');
  if (response.data.pagamentos[0].estado !== 'paga')
    throw strapi.errors.badRequest('Payment not completed.');
  if (response.data.pagamentos[0].valor !== query.price)
    throw strapi.errors.badRequest('Payment has invalid price.');

  try {
    await strapi.services.email.sendOrderPaidEmail({
      order: { ...order, status: 'PROCESSING' },
      user: order.user,
    });
  } catch (e) {
    strapi.log.error(
      `Failed to send order create email for order ${order.invoiceId}: ${JSON.stringify(e)}`
    );
  }

  // update order with payment status

  await strapi.models.order.updateOne(
    { _id: order._id },
    {
      orderData: { ...order.orderData, fee: parseFloat(response.data.pagamentos[0].comissao) },
      status: 'PROCESSING',
    }
  );
};

module.exports = {
  async eupago(ctx) {
    const query = ctx.request.query;
    const paymentMethod = query.mp;
    if (paymentMethod !== 'PC:PT' && paymentMethod !== 'MW:PT')
      throw strapi.errors.badRequest('Unknown payment method');
    await handleMultibancoPayment(query);
    return {};
  },
};
