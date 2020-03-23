'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async findOne(ctx) {
    const slug = ctx.params.slug || ctx.params._slug;
    if (!slug) return null;

    const entity = await strapi.services.category.findOne({ slug });
    if (!entity || entity.show === false) return null;
    return sanitizeEntity(entity, { model: strapi.models.category });
  },
};
