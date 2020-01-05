'use strict';

const { sanitizeEntity } = require('strapi-utils');

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
      .map((entity) => sanitizeEntity(entity, { model: strapi.models.product }));
  },

  async findOne(ctx) {
    const entity = await strapi.services.product.findOne(ctx.params);
    if (entity.show === false) return null;
    return sanitizeEntity(entity, { model: strapi.models.product });
  },
};
