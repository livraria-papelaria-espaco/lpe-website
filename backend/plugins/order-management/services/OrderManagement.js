'use strict';

/**
 * OrderManagement.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  fetch: (params, populate) => strapi.services.order.findOne(params, populate),
  update: (params, data, files) => strapi.services.order.update(params, data, files),
};
