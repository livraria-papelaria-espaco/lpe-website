'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');
const axios = require('axios');
const crypto = require('crypto');

const parseOrderData = async (data, price) => {
  let totalPrice = 0;
  const items = await Promise.all(
    data.items.map(async (v) => {
      const products = await strapi.models.product.find({ _id: v.id });
      if (!products[0]) throw strapi.errors.badRequest(`Invalid item ${v.id}.`);
      const product = products[0];
      if (product.quantity - v.quantity < 0) {
        if (!product.order_available)
          throw strapi.errors.badRequest(`Stock not available for ${v.id}`);
        await strapi.models.product.updateOne({ _id: product._id }, { quantity: 0 });
      } else {
        await strapi.models.product.updateOne(
          { _id: product._id },
          { quantity: product.quantity - v.quantity }
        );
      }
      totalPrice += v.quantity * product.price;
      return {
        name: product.name,
        slug: product.slug,
        priceUnity: product.price,
        price: v.quantity * product.price,
        quantity: v.quantity,
      };
    })
  );
  if (totalPrice !== price)
    throw strapi.errors.badRequest('Provided price does not match with calculated price.');

  return { ...data, items };
};

const generateInvoiceId = () =>
  crypto
    .randomBytes(8)
    .toString('hex')
    .toUpperCase();

const handleGateway = (entity) => {
  switch (entity.paymentGateway) {
    case 'IN_STORE':
      return { ...entity, status: 'PROCESSING' };
    case 'MB':
      return handleMB(entity);
    case 'MBWAY':
      return handleMBWay(entity);
    default:
      return { ...entity, status: 'INVALID' };
  }
};

const handleMB = async (entity) => {
  const EU_PAGO_ENDPOINT = `https://${
    strapi.config.currentEnvironment.euPagoSandbox ? 'sandbox' : 'clientes'
  }.eupago.pt/clientes/rest_api`;
  const response = await axios.post(EU_PAGO_ENDPOINT + '/multibanco/create', {
    chave: strapi.config.currentEnvironment.euPagoToken,
    valor: entity.price,
    id: entity.invoiceId,
    data_fim: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 1 day from now in YYYY-MM-DD
    per_dup: 0,
  });
  if (response.data.sucesso != true)
    strapi.errors.badGateway('An error occurred in the payment gateway'); //TODO check if method exists
  const gatewayData = {
    reference: `${response.data.referencia}`,
    entity: `${response.data.entidade}`,
    price: parseFloat(response.data.valor),
  };
  return { ...entity, orderData: { ...entity.orderData, multibanco: gatewayData } };
};

const handleMBWay = async (entity) => {
  const EU_PAGO_ENDPOINT = `https://${
    strapi.config.currentEnvironment.euPagoSandbox ? 'sandbox' : 'clientes'
  }.eupago.pt/clientes/rest_api`;
  const response = await axios.post(EU_PAGO_ENDPOINT + '/mbway/create', {
    chave: strapi.config.currentEnvironment.euPagoToken,
    valor: entity.price,
    id: entity.invoiceId,
    alias: entity.orderData.mbWayPhone,
    descricao: `Encomenda #${entity.invoiceId}`,
  });
  if (response.data.sucesso != true)
    strapi.errors.badGateway('An error occurred in the payment gateway'); //TODO check if method exists
  const gatewayData = {
    entity: '00000',
    reference: `${response.data.referencia}`,
    price: parseFloat(response.data.valor),
  };
  return { ...entity, orderData: { ...entity.orderData, multibanco: gatewayData } };
};

const sanitizeOrderData = (entity) => {
  if (!entity) return entity;
  if (!entity.orderData) return entity;
  return { ...entity, orderData: { ...entity.orderData, fee: undefined } };
};

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      throw strapi.errors.badRequest('multipart/form-data is not supported for this endpoint.');
    } else {
      const entityData = {
        ...ctx.request.body,
        orderData: await parseOrderData(ctx.request.body.orderData, ctx.request.body.price),
        user: ctx.state.user.id,
        invoiceId: generateInvoiceId(),
      };
      entity = await strapi.services.order.create(await handleGateway(entityData));
    }
    return sanitizeOrderData(sanitizeEntity(entity, { model: strapi.models.order }));
  },
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.order.search(ctx.query);
    } else {
      entities = await strapi.services.order.find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeOrderData(sanitizeEntity(entity, { model: strapi.models.order }))
    );
  },
  async findOne(ctx) {
    const entity = await strapi.services.order.findOne(ctx.params);
    return sanitizeOrderData(sanitizeEntity(entity, { model: strapi.models.order }));
  },
};
