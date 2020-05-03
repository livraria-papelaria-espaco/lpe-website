'use strict';

/**
 * Lifecycle callbacks for the `category` model.
 */

const handlePathUpdate = async (id, deep) => {
  if (deep > 10)
    throw new Error(
      'Stack Overflow: Reached the maximum number of updates for this category. Maybe you have a loop inside the category schema?'
    );
  const category = await strapi.query('category').findOne({ _id: id });
  let newPath = ',';
  if (category.parent) {
    newPath = category.parent.path || ',';
  }
  newPath += `${category.slug},`;
  if (newPath !== category.path) {
    await strapi.query('category').update({ _id: id }, { path: newPath });
    if (category.categories)
      await Promise.all(category.categories.map((cat) => handlePathUpdate(cat._id, deep + 1)));
  }
};

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model, attrs, options) => {},

  // After saving a value.
  // Fired after an `insert` or `update` query.
  afterSave: async (model) => {
    if (!model || !model._id) return;
    if (!model.slug && !model.parent && !model.categories) return;

    await handlePathUpdate(model._id, 0);
  },

  // Before fetching a value.
  // Fired before a `fetch` operation.
  // beforeFetch: async (model, columns, options) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, response, options) => {},

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model, columns, options) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, response, options) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model, attrs, options) => {},

  // After creating a value.
  // Fired after an `insert` query.
  // afterCreate: async (model, attrs, options) => {},

  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model, attrs, options) => {},

  // After updating a value.
  // Fired after an `update` query.
  afterUpdate: async (model) => {
    const query = model.getFilter();
    const update = model.getUpdate();
    if (!update) return;
    const { $set: set } = update;
    if (!set.slug && !set.parent && !set.categories) return;

    await handlePathUpdate(query._id, 0);
  },

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model, attrs, options) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, attrs, options) => {}
};
