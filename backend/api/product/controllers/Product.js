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
    else stockStatus = 'UNAVAILABLE';
  }
  return { ...entity, stockStatus: stockStatus };
};

module.exports = {
  async searchEnhanced(ctx) {
    try {
      const { _category, _query, _limit, _start } = Joi.attempt(ctx.query, searchEnhancedSchema);

      const categoriesIds = await strapi.services.category.getCategoriesIds(_category);

      if (_query) {
        // Use meilisearch when searching by text
        const filterQuery = categoriesIds.map((id) => `category = "${id}"`).join(' OR ');

        const searchResult = await strapi.services.productsearch.searchProduct(_query, {
          limit: _limit,
          offset: _start,
          filters: filterQuery || undefined,
        });

        const { hits, nbHits } = searchResult;

        const products = (
          await Promise.all(
            hits.map(async (hit) => {
              const product = await strapi.services.product.findOne({ id: hit._id });
              return sanitizeEntity(addStockStatus(product), { model: strapi.models.product });
            })
          )
        ).filter((product) => product !== null);

        return { nbHits, products };
      } else {
        // Get directly from DB if text query is empty
        const nbHits = await strapi.services.product.count({
          quantity_gt: 0, // show only products in stock
          show: true,
          ...(categoriesIds.length === 0 ? {} : { category_in: categoriesIds }),
          _sort: 'updatedAt:desc',
        });

        const products = await strapi.services.product.find({
          quantity_gt: 0, // show only products in stock
          show: true,
          ...(categoriesIds.length === 0 ? {} : { category_in: categoriesIds }),
          _sort: 'updatedAt:desc',
          _limit,
          _start,
        });

        return { nbHits, products };
      }
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
            show: true,
            ...metadata,
            slug,
            images: await metadataServices.fetchAndUploadImages(data.reference, slug),
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
