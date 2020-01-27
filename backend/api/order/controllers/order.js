'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

const parseOrderData = async (data) => {
  const items = await data.items.map(async (v) => {
    const products = await strapi.models.product.find({ slug: v.slug });
    if (!products[0]) throw strapi.errors.badRequest(`Invalid item ${v.slug}`);
    const product = products[0];
    //TODO check stock
    return {
      name: product.name,
      slug: product.slug,
      priceUnity: product.price,
      price: v.quantity * product.price,
      quantity: v.quantity,
    };
  });
  return { ...data, items };
};

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      strapi.errors.badRequest('multipart/form-data is not supported for this endpoint.');
    } else {
      entity = await strapi.services.order.create({
        ...ctx.request.body,
        orderData: await parseOrderData(ctx.request.body.orderData),
        user: ctx.state.user.id,
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
