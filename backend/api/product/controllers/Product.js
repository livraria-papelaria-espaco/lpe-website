'use strict';

const { sanitizeEntity } = require('strapi-utils');
const Joi = require('joi');

const updateStocksSchema = Joi.array()
  .items(
    Joi.object({
      ref: Joi.string().pattern(/^\d+$/).required(),
      qnt: Joi.number().integer().min(0),
      price: Joi.number().min(0),
    }).required()
  )
  .unique('ref')
  .min(1)
  .max(100);

const createProductSchema = Joi.object({
  reference: Joi.string().pattern(/^\d+$/).required(),
  quantity: Joi.number().integer().min(0).required(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
});

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
    if (entity.quantity > strapi.config.get('custom.lowStockThreshold', 3))
      stockStatus = 'IN_STOCK';
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
      quantity_gt: 0, // show only products in stock
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

  async create(ctx) {
    try {
      let data = { ...Joi.attempt(ctx.request.body, createProductSchema), show: false };

      let metadataServices = strapi.plugins['metadata-fetcher'].services['metadata-fetcher'];

      const product = await strapi.services.product.findOne({ reference: data.reference });
      if (product) {
        const { qnt, price } = await strapi.services.product.updateStock({
          ref: product.reference,
          qnt: data.quantity,
          price: data.price,
        });
        return sanitizeEntity(addStockStatus({ ...product, quantity: qnt, price }), {
          model: strapi.models.product,
        });
      }

      if (metadataServices.isISBN(data.reference)) {
        const metadata = await metadataServices.fetchMetadataFromWook(data.reference);
        if (metadata) {
          const category = await strapi.services.category.findOne({ name: 'Livraria' });

          const slug = await strapi.plugins['content-manager'].services.uid.generateUIDField({
            contentTypeUID: 'application::product.product',
            field: 'slug',
            data: metadata,
          });
          data = {
            ...data,
            ...metadata,
            slug,
            images: await metadataServices.fetchAndUploadImages(data.reference, slug),
            show: true,
            category: category ? category.id : undefined,
          };
        }
      }

      if (!data.slug)
        data = {
          ...data,
          slug: await strapi.plugins['content-manager'].services.uid.generateUIDField({
            contentTypeUID: 'application::product.product',
            field: 'slug',
            data,
          }),
        };

      const entity = await strapi.services.product.create(data);

      return sanitizeEntity(addStockStatus(entity), { model: strapi.models.product });
    } catch (e) {
      if (Joi.isError(e)) {
        ctx.throw(400, 'invalid input');
      }
      throw e;
    }
  },
};
