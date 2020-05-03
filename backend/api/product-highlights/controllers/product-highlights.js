'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const sanitizeProducts = (entity) => {
  if (!entity || !entity.content) return entity;

  const sanitizeProduct = (product) => {
    if (!product) return product;
    const newProduct = sanitizeEntity(product, { model: strapi.models.product });
    delete newProduct.stockStatus;

    return newProduct;
  };

  return {
    ...entity,
    content: entity.content.map((content) => {
      if (content.products) return { ...content, products: content.products.map(sanitizeProduct) };
      if (content.product) return { ...content, product: sanitizeProduct(content.product) };
      return content;
    }),
  };
};

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services['product-highlights'].search(ctx.query);
    } else {
      entities = await strapi.services['product-highlights'].find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(sanitizeProducts(entity), { model: strapi.models['product-highlights'] })
    );
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services['product-highlights'].findOne({ id });
    return sanitizeEntity(sanitizeProducts(entity), { model: strapi.models['product-highlights'] });
  },
};
