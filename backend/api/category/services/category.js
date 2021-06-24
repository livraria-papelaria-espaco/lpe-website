'use strict';

const escapeRegex = (str) => str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  getCategoriesIds(categoryName) {
    if (!categoryName) return [];

    return strapi
      .query('category')
      .model.find({ path: { $regex: `,${escapeRegex(categoryName)},` } })
      .select('_id')
      .then((result) => result.map((v) => (v ? v.toObject()._id : null)));
  },
};
