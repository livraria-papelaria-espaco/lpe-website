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

const searchEnhancedSchema = Joi.object({
  _query: Joi.string().allow(''),
  _sort: Joi.string().pattern(/^(?:createdAt|updatedAt|name|price):(?:asc|desc)$/),
  _limit: Joi.number().integer().max(100),
  _start: Joi.number().integer().min(0),
  _category: Joi.string().pattern(/^[a-zA-Z0-9-_]+$/),
  _priceRange: Joi.array().items(Joi.number().min(0)).length(2).sort(),
}).required();

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
    try {
      const { _category, _query, _sort, _limit, _start, _priceRange } = Joi.attempt(
        ctx.query,
        searchEnhancedSchema
      );

      const query = {};

      if (_category) query.category = escapeRegex(_category);
      if (_query) query.query = escapeRegex(_query.substring(0, 30));
      if (_sort) query.sort = _sort;
      if (_limit) query.limit = _limit;
      if (_start) query.start = _start;
      if (_priceRange) {
        query.minPrice = _priceRange[0];
        query.maxPrice = _priceRange[1];
      }

      const entities = await strapi.services.product.searchEnhanced(query);

      return entities.map((entity) =>
        sanitizeEntity(addStockStatus(entity), { model: strapi.models.product })
      );
    } catch (e) {
      if (Joi.isError(e)) {
        ctx.throw(400, 'invalid input');
      }
      throw e;
    }
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
