'use strict';

const { sanitizeEntity } = require('strapi-utils');

const addStockStatus = (entity) => {
  if (typeof entity !== 'object' || entity == null) return entity;

  let stockStatus = 'UNAVAILABLE';

  if (entity.quantity !== undefined && entity.orderAvailable !== undefined) {
    if (entity.quantity > strapi.config.lowStockThreshold) stockStatus = 'IN_STOCK';
    else if (entity.quantity > 0) stockStatus = 'LOW_STOCK';
    else stockStatus = entity.orderAvailable ? 'ORDER_ONLY' : 'UNAVAILABLE';
  }
  return { ...entity, stockStatus: stockStatus };
};

const escapeRegex = (str) => str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  async searchEnhanced(ctx) {
    const query = {};

    if (ctx.query._category) query.category = escapeRegex(ctx.query._category);
    if (ctx.query._query) query.query = escapeRegex(ctx.query._query.substring(0, 30));
    if (ctx.query._sort) query.sort = ctx.query._sort;
    if (ctx.query._limit) query.limit = ctx.query._limit;
    if (ctx.query._start) query.start = ctx.query._start;
    if (ctx.query._priceRange) {
      if (!Array.isArray(ctx.query._priceRange) && ctx.query._priceRange.length !== 2)
        throw ctx.badRequest('Price range must be an array of two integers');
      query.minPrice = parseInt(ctx.query._priceRange[0]);
      query.maxPrice = parseInt(ctx.query._priceRange[1]);
    }

    const entities = await strapi.services.product.searchEnhanced(query);

    return entities.map((entity) =>
      sanitizeEntity(addStockStatus(entity), { model: strapi.models.product })
    );
  },

  find: undefined,

  async findOne(ctx) {
    const id = ctx.params.id;
    const entity = await strapi.services.product.findOne({ id });
    if (!entity || entity.show === false) return null;
    return sanitizeEntity(addStockStatus(entity), { model: strapi.models.product });
  },

  async findOneSlug(ctx) {
    const slug = ctx.params.slug || ctx.params._slug;
    const entity = await strapi.services.product.findOne({ slug });
    if (!entity || entity.show === false) return null;
    return sanitizeEntity(addStockStatus(entity), { model: strapi.models.product });
  },
};
