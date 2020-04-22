'use strict';

const { sanitizeEntity } = require('strapi-utils');
const Joi = require('@hapi/joi');

const updateStocksSchema = Joi.array()
  .items(
    Joi.object({
      ref: Joi.string().pattern(/^\d+$/).required(),
      qnt: Joi.number().integer().min(0).required(),
    }).required()
  )
  .unique('ref')
  .min(1)
  .max(100);

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

  async newProducts() {
    const { newProductDays } = await strapi.services['home-page'].find();

    const limitDate = new Date(Date.now() - 86400000 * newProductDays);
    limitDate.setHours(0, 0, 0); // 00:00:00 of X days before

    const entities = await strapi.services.product.find({
      createdAt_gte: limitDate,
      show: true,
      _sort: 'createdAt:desc',
      _limit: 18,
    });

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

  async updateStocks(ctx) {
    try {
      const products = Joi.attempt(ctx.request.body, updateStocksSchema);

      return await Promise.all(
        products.map((product) => strapi.services.product.updateStock(product))
      );
    } catch (e) {
      if (Joi.isError(e)) {
        ctx.throw(400, 'invalid input');
      }
      throw e;
    }
  },
};
