'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

const parseOrderData = async (data, price) => {
  let totalPrice = 0;
  const items = await Promise.all(
    data.items.map(async (v) => {
      const products = await strapi.models.product.find({ slug: v.slug });
      if (!products[0]) throw strapi.errors.badRequest(`Invalid item ${v.slug}.`);
      const product = products[0];
      if (product.quantity - v.quantity < 0) {
        if (!product.order_available)
          throw strapi.errors.badRequest(`Stock not available for ${v.slug}`);
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

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      throw strapi.errors.badRequest('multipart/form-data is not supported for this endpoint.');
    } else {
      entity = await strapi.services.order.create({
        ...ctx.request.body,
        orderData: await parseOrderData(ctx.request.body.orderData, ctx.request.body.price),
        user: ctx.state.user.id,
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
