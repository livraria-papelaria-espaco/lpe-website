'use strict';

const { sanitizeEntity } = require('strapi-utils');

const addStockStatus = (entity) => {
  if (typeof entity !== 'object' || entity == null) return entity;

  let stockStatus = 'UNAVAILABLE';

  if (entity.quantity !== undefined && entity.order_available !== undefined) {
    if (entity.quantity > strapi.config.lowStockThreshold) stockStatus = 'IN_STOCK';
    else if (entity.quantity > 0) stockStatus = 'LOW_STOCK';
    else stockStatus = entity.order_available ? 'ORDER_ONLY' : 'UNAVAILABLE';
  }
  return { ...entity, stock_status: stockStatus };
};

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.product.search(ctx.query);
    } else {
      entities = await strapi.services.product.find(ctx.query);
    }

    return entities
      .filter((entity) => entity.show !== false)
      .map((entity) => sanitizeEntity(addStockStatus(entity), { model: strapi.models.product }));
  },

  async findOne(ctx) {
    const slug = ctx.params.slug || ctx.params._slug;
    const entity = await strapi.services.product.findOne({ slug });
    if (!entity || entity.show === false) return null;
    return sanitizeEntity(addStockStatus(entity), { model: strapi.models.product });
  },
};
