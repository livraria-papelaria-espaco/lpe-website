'use strict';
const slugify = require('slugify');

/**
 * Lifecycle callbacks for the `Product` model.
 */

module.exports = {
  beforeSave: async (model) => {
    if (model.name) {
      model.slug = slugify(model.name);
    }

    if (model.quantity !== undefined && model.order_available !== undefined) {
      if (model.quantity > strapi.config.lowStockThreshold) model.stock_status = 'IN_STOCK';
      else if (model.quantity > 0) model.stock_status = 'LOW_STOCK';
      else model.stock_status = model.order_available ? 'ORDER_ONLY' : 'UNAVAILABLE';
    }
  },
  beforeUpdate: async (model) => {
    var update = {};

    if (model.getUpdate().name) {
      update.slug = slugify(model.getUpdate().name);
    }

    if (
      model.getUpdate().quantity !== undefined &&
      model.getUpdate().order_available !== undefined
    ) {
      if (model.getUpdate().quantity > strapi.config.lowStockThreshold)
        update.stock_status = 'IN_STOCK';
      else if (model.getUpdate().quantity > 0) update.stock_status = 'LOW_STOCK';
      else update.stock_status = model.getUpdate().order_available ? 'ORDER_ONLY' : 'UNAVAILABLE';
    }

    if (Object.keys(update).length !== 0) model.update(update);
  },
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  // afterSave: async (model, result) => {},

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, results) => {},

  // Fired before a `fetch` operation.
  // beforeFetch: async (model) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, result) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model) => {},

  // After creating a value.
  // Fired after an `insert` query.
  // afterCreate: async (model, result) => {},

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model) => {},

  // After updating a value.
  // Fired after an `update` query.
  // afterUpdate: async (model, result) => {},

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, result) => {}
};
