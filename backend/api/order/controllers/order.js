'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');
const axios = require('axios');
const crypto = require('crypto');
const Joi = require('@hapi/joi');

const orderCreateSchema = Joi.object({
  price: Joi.number()
    .positive()
    .precision(2)
    .required(),
  shippingCost: Joi.number()
    .precision(2)
    .min(0)
    .default(0),
  shippingMethod: Joi.string()
    .valid('STORE_PICKUP', 'CTT')
    .required(),
  shippingAddress: Joi.link('#address').when('shippingMethod', {
    not: 'STORE_PICKUP',
    then: Joi.required(),
  }),
  billingAddress: Joi.link('#address').required(),
  paymentGateway: Joi.string()
    .valid('IN_STORE', 'MB', 'MBWAY')
    .required(),
  status: Joi.string().valid('WAITING_PAYMENT'),
  nif: Joi.number()
    .integer()
    .min(100000000)
    .max(999999999)
    .default(0),
  orderData: Joi.object()
    .keys({
      items: Joi.array()
        .items(
          Joi.object({
            id: Joi.string()
              .alphanum()
              .required(),
            quantity: Joi.number()
              .integer()
              .positive()
              .required(),
          })
        )
        .unique('id')
        .min(1)
        .required(),
      mbWayPhone: Joi.string().pattern(/^9\d{8}$/),
    })
    .when('paymentGateway', { is: 'MBWAY', then: Joi.object({ mbWayPhone: Joi.required() }) }),
}).shared(
  Joi.object({
    firstName: Joi.string()
      .pattern(/\d+/, { invert: true })
      .max(20)
      .required(),
    lastName: Joi.string()
      .pattern(/\d+/, { invert: true })
      .max(20)
      .required(),
    address1: Joi.string()
      .max(100)
      .required(),
    address2: Joi.string()
      .max(100)
      .empty(''),
    city: Joi.string()
      .pattern(/\d+/, { invert: true })
      .max(50)
      .required(),
    postalCode: Joi.string()
      .pattern(/^\d{4}-\d{3}$/)
      .required(),
  }).id('address')
);

const calculateShippingSchema = Joi.object({
  _postalCode: Joi.string()
    .pattern(/^\d{4}-\d{3}$/)
    .required(),
  _shippingMethod: Joi.string()
    .valid('CTT')
    .required(),
  _items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
          .alphanum()
          .required(),
        quantity: Joi.number()
          .integer()
          .positive()
          .required(),
      })
    )
    .unique('id')
    .min(1)
    .required(),
  _limit: Joi.any(),
});

const parseOrderData = async (data, price) => {
  let totalPrice = 0;

  const items = await Promise.all(
    data.items.map(async (v) => {
      const product = await strapi.services.product.findOne({ _id: v.id });
      if (!product) throw strapi.errors.badRequest(`Invalid item`, { id: v.id });

      let needsRestock = 0;

      if (product.quantity - v.quantity < 0) {
        if (!product.orderAvailable)
          throw strapi.errors.conflict(`Stock not available`, { id: v.id });
        needsRestock = v.quantity - product.quantity;
      }

      totalPrice += v.quantity * product.price;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        priceUnity: product.price,
        price: v.quantity * product.price,
        quantity: v.quantity,
        needsRestock,
        reference: product.reference,
      };
    })
  );

  if (totalPrice.toFixed(2) !== price.toFixed(2))
    throw strapi.errors.badRequest('Provided price does not match with calculated price.', {
      originalPrice: price,
      calculatedPrice: totalPrice,
    });

  await Promise.all(
    items.map(async (item) =>
      strapi.services.product
        .decreaseStock({ id: item.id, qnt: item.quantity - item.needsRestock })
        .catch((e) => {
          strapi.log.error(
            { error: e, items },
            'Failed to decrease stock for %s by %d',
            item.id,
            item.quantity - item.needsRestock
          );
          throw e;
        })
    )
  );

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
      // This should never trigger due to Joi verification
      return entity;
  }
};

const getEuPagoEndpoint = (path) =>
  `https://${
    strapi.config.currentEnvironment.euPagoSandbox ? 'sandbox' : 'clientes'
  }.eupago.pt/clientes/rest_api${path}`;

const handleMB = async (entity) => {
  //TODO add try/catch
  const expiresAt = new Date(Date.now() + 86400000);
  expiresAt.setHours(23, 59, 59); // 23:59:59 of the next day
  const response = await axios.post(getEuPagoEndpoint('/multibanco/create'), {
    chave: strapi.config.currentEnvironment.euPagoToken,
    valor: entity.price,
    id: entity.invoiceId,
    data_fim: expiresAt.toISOString().split('T')[0], // 1 day from now in YYYY-MM-DD
    per_dup: 0,
  });
  if (response.data.sucesso != true)
    throw strapi.errors.badGateway('An error occurred in the payment gateway');
  const gatewayData = {
    reference: `${response.data.referencia}`,
    entity: `${response.data.entidade}`,
    price: parseFloat(response.data.valor),
  };
  return { ...entity, expiresAt, orderData: { ...entity.orderData, multibanco: gatewayData } };
};

const handleMBWay = async (entity) => {
  //TODO add try/catch
  const expiresAt = new Date(Date.now() + 600000); // 10 min
  const response = await axios.post(getEuPagoEndpoint('/mbway/create'), {
    chave: strapi.config.currentEnvironment.euPagoToken,
    valor: entity.price,
    id: entity.invoiceId,
    alias: entity.orderData.mbWayPhone,
    descricao: `Encomenda #${entity.invoiceId}`,
  });
  if (response.data.sucesso != true)
    throw strapi.errors.badGateway('An error occurred in the payment gateway');
  const gatewayData = {
    entity: '00000',
    reference: `${response.data.referencia}`,
    price: parseFloat(response.data.valor),
  };
  return { ...entity, expiresAt, orderData: { ...entity.orderData, multibanco: gatewayData } };
};

const sanitizeOrderData = (entity) => {
  if (!entity) return entity;
  if (!entity.orderData) return entity;
  return { ...entity, orderData: { ...entity.orderData, fee: undefined } };
};

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is('multipart'))
      throw strapi.errors.badRequest('multipart/form-data is not supported for this endpoint.');

    const request = Joi.attempt(ctx.request.body, orderCreateSchema);

    const shippingCost =
      request.shippingMethod === 'STORE_PICKUP'
        ? 0
        : await strapi.services.order.calculateShipping(
            request.shippingAddress.postalCode,
            request.shippingMethod,
            request.orderData.items
          );

    const entityData = {
      ...request,
      orderData: await parseOrderData(request.orderData, request.price - shippingCost),
      user: ctx.state.user.id,
      invoiceId: generateInvoiceId(),
    };
    entity = await strapi.services.order.create(await handleGateway(entityData));

    try {
      strapi.services.email.sendOrderCreatedEmail({
        order: entity,
        user: ctx.state.user,
      });
    } catch (e) {
      strapi.log.error(
        { error: e },
        `Failed to send order create email for order ${entity.invoiceId}: ${JSON.stringify(e)}`
      );
    }

    return sanitizeOrderData(sanitizeEntity(entity, { model: strapi.models.order }));
  },

  async count(ctx) {
    return await strapi.services.order.count({ user: ctx.state.user.id });
  },

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.order.search({ ...ctx.query, user: ctx.state.user.id });
    } else {
      entities = await strapi.services.order.find({ ...ctx.query, user: ctx.state.user.id });
    }

    return entities.map((entity) =>
      sanitizeOrderData(sanitizeEntity(entity, { model: strapi.models.order }))
    );
  },

  async findOne(ctx) {
    const entity = await strapi.services.order.findOne(ctx.params);
    return sanitizeOrderData(sanitizeEntity(entity, { model: strapi.models.order }));
  },

  async calculateShipping(ctx) {
    const { _postalCode, _shippingMethod, _items } = Joi.attempt(
      ctx.request.query,
      calculateShippingSchema
    );
    return strapi.services.order.calculateShipping(_postalCode, _shippingMethod, _items);
  },
};
