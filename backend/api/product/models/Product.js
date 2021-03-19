'use strict';

/**
 * Lifecycle callbacks for the `Product` model.
 */

module.exports = {
  lifecycles: {
    afterCreate: async (result) => {
      if (!result || !result._id) return;

      await strapi.services.productsearch.updateProduct(result);
    },
    afterUpdate: async (result) => {
      if (!result || !result._id) return;

      await strapi.services.productsearch.updateProduct(result);
    },
    afterDelete: async (result) => {
      if (!result || !result._id) return;

      await strapi.services.productsearch.deleteProdut(result);
    },
  },
};
