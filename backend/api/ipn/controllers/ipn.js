'use strict';

const axios = require('axios');

const handleMultibancoPayment = async (query) => {
  // check if entities match with order

  const orders = await strapi.models.order.find({ invoiceId: query.orderId });
  if (!orders[0]) throw strapi.errors.badRequest("Can't find order.");
  const order = orders[0];
  if (
    query.reference !== order.orderData.multibanco.reference ||
    query.entidade !== order.orderData.multibanco.entity ||
    query.price !== order.orderData.multibanco.valor
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

  // update order with payment status

  await strapi.models.order.updateOne(
    { _id: order._id },
    {
      orderData: { ...order.orderData, fee: response.data.pagamentos[0].comissao },
      status: 'PROCESSING',
    }
  );
};

const handleMbWayPayment = async (query) => {};

module.exports = {
  async eupago(ctx) {
    const query = ctx.request.query;
    const paymentMethod = query.mp;
    if (paymentMethod === 'PC:PT') await handleMultibancoPayment(query);
    else if (paymentMethod === 'MW:PT') await handleMbWayPayment(query);
    else throw strapi.errors.badRequest('Unknown payment method');
    return {};
  },
};
