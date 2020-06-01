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
  lifecycles: {
    afterCreate: async (result) => {
      if (!result || !result._id) return;
      if (!result.slug && !result.parent && !result.categories) return;

      await handlePathUpdate(result._id, 0);
    },
    afterUpdate: async (_, params, data) => {
      if (!data.slug && !data.parent && !data.categories) return;
      await handlePathUpdate(params._id, 0);
    },
  },
};
